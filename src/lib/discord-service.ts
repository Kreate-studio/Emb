
'use server';

import { unstable_noStore as noStore } from 'next/cache';

const API_BASE = 'https://discord.com/api/v10';
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

const GENERIC_CONFIG_ERROR = "Discord integration not configured.";

if (!BOT_TOKEN) {
  console.warn("DISCORD_BOT_TOKEN is not set. Discord integration will not work.");
}

async function discordApiFetch(endpoint: string, options: RequestInit = {}) {
  noStore();
  if (!BOT_TOKEN && !endpoint.includes('widget.json')) {
    return { data: null, error: 'Discord bot token not configured.' };
  }

  const defaultHeaders: HeadersInit = endpoint.includes('widget.json') 
    ? {} 
    : { Authorization: `Bot ${BOT_TOKEN}` };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      next: { revalidate: 10 } // Revalidate more frequently for live data
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Discord API Error (${response.status}) fetching ${endpoint}: ${errorText}`);
      return { data: null, error: `Failed to fetch from Discord API: ${response.statusText}` };
    }
    
    // widget.json can return a 204 No Content if disabled
    if (response.status === 204) {
      return { data: null, error: 'Widget is disabled for this server.'};
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err) {
    console.error(`Error fetching from Discord API (${endpoint}):`, err);
    return { data: null, error: 'An unexpected error occurred while fetching from Discord.' };
  }
}

export async function sendMessageToChannel(channelId: string, message: string): Promise<{error: string | null}> {
  if (!channelId) return { error: 'Channel ID not provided.' };

  const { error } = await discordApiFetch(`/channels/${channelId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: message })
  });

  return { error };
}


export interface GuildRole {
    id: string;
    name: string;
    color: number;
    position: number;
}

export async function getGuildRoles(): Promise<{ roles: GuildRole[] | null, error: string | null}> {
    const GUILD_ID = process.env.DISCORD_GUILD_ID;
    if (!GUILD_ID) return { roles: null, error: GENERIC_CONFIG_ERROR };
    const { data, error } = await discordApiFetch(`/guilds/${GUILD_ID}/roles`);
    if (error || !data) return { roles: null, error };
    
    const roles: GuildRole[] = data.map((role: any) => ({
        id: role.id,
        name: role.name,
        color: role.color,
        position: role.position,
    })).sort((a: GuildRole, b: GuildRole) => b.position - a.position); // Sort by position descending
    
    return { roles, error: null };
}

export interface GuildDetails {
  name: string;
  memberCount: number;
  onlineCount: number;
  iconUrl: string | null;
  premiumSubscriptionCount: number;
  premiumTier: number;
}

export async function getGuildDetails(): Promise<{ details: GuildDetails | null, error: string | null }> {
  const GUILD_ID = process.env.DISCORD_GUILD_ID;
  if (!GUILD_ID) return { details: null, error: GENERIC_CONFIG_ERROR };

  const [guildRes, widgetRes] = await Promise.all([
     discordApiFetch(`/guilds/${GUILD_ID}?with_counts=true`),
     discordApiFetch(`/guilds/${GUILD_ID}/widget.json`)
  ]);

  if (guildRes.error || !guildRes.data) {
      return { details: null, error: guildRes.error };
  }
   if (widgetRes.error || !widgetRes.data) {
      // Widget can be disabled, so we don't want to fail the entire request
      console.warn("Could not fetch Discord widget.json. Online count may be inaccurate.");
  }

  const iconHash = guildRes.data.icon;
  const iconUrl = iconHash ? `https://cdn.discordapp.com/icons/${GUILD_ID}/${iconHash}.png` : null;

  return {
    details: {
      name: guildRes.data.name,
      memberCount: guildRes.data.approximate_member_count || 0,
      onlineCount: widgetRes.data?.presence_count || 0,
      iconUrl: iconUrl,
      premiumSubscriptionCount: guildRes.data.premium_subscription_count || 0,
      premiumTier: guildRes.data.premium_tier || 0,
    },
    error: null
  };
}

export interface DiscordMember {
  user: {
    id: string;
    username: string;
    global_name: string;
    avatar: string;
  };
  roles: string[];
  nick: string | null;
  highestRole?: GuildRole;
}

async function getGuildMember(userId: string): Promise<{member: DiscordMember | null, error: string | null}> {
    const GUILD_ID = process.env.DISCORD_GUILD_ID;
    if (!GUILD_ID) return { member: null, error: GENERIC_CONFIG_ERROR };
    const { data, error } = await discordApiFetch(`/guilds/${GUILD_ID}/members/${userId}`);
    return { member: data, error };
}


export interface ChannelMessage {
    id: string;
    content: string;
    author: {
        id: string;
        username: string;
        displayName: string;
        avatarUrl: string;
    };
    timestamp: string;
    attachments: {
        url: string;
        proxy_url: string;
        width: number;
        height: number;
        content_type: string;
    }[];
    mentions: {
      roles: string[];
    }
}

export type ChannelMessageWithUser = ChannelMessage & { user: DiscordMember | null; allRoles: GuildRole[] };


export async function getChannelMessagesWithUsers(channelId: string, limit: number = 5): Promise<{ messages: ChannelMessageWithUser[] | null, error: string | null }> {
  if (!channelId) return { messages: null, error: 'Channel ID not provided.' };
  
  const { data: messagesData, error: messagesError } = await discordApiFetch(`/channels/${channelId}/messages?limit=${limit}`);

  if (messagesError || !messagesData) {
    return { messages: null, error: messagesError };
  }
    
  const { roles, error: rolesError } = await getGuildRoles();
  if (rolesError || !roles) {
      return { messages: null, error: rolesError };
  }

  const enhancedMessages: ChannelMessageWithUser[] = await Promise.all(messagesData.map(async (msg: any) => {
    const author = msg.author;
    const { member, error: memberError } = await getGuildMember(author.id);
    
    if (memberError) {
      console.warn(`Could not fetch member ${author.id}: ${memberError}`)
    }

    let highestRole: GuildRole | undefined = undefined;
    if(member && member.roles.length > 0) {
        const userRoles = roles.filter(r => member.roles.includes(r.id));
        highestRole = userRoles.length > 0 ? userRoles[0] : undefined; // roles are pre-sorted by position
    }

    const displayName = member?.nick || author.global_name || author.username;
    
    return {
      id: msg.id,
      content: msg.content,
      author: {
        id: author.id,
        username: author.username,
        displayName: displayName,
        avatarUrl: author.avatar
          ? `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/${(parseInt(author.id) >> 22) % 6}.png`
      },
      timestamp: msg.timestamp,
      attachments: msg.attachments || [],
      mentions: {
        roles: msg.mention_roles || [],
      },
      user: member ? { ...member, highestRole } : null,
      allRoles: roles,
    }
  }));
  
  return { messages: enhancedMessages, error: null };
}

export interface DiscordWidgetData {
  name: string;
  instant_invite: string;
  presence_count: number;
  members: {
    id: string;
    username: string;
    avatar_url: string;
  }[];
}

export async function getGuildWidget(): Promise<{ widget: DiscordWidgetData | null, error: string | null }> {
    const GUILD_ID = process.env.DISCORD_GUILD_ID;
    if (!GUILD_ID) {
      console.warn("DISCORD_GUILD_ID is not set. Discord widget will not be fetched.");
      return { widget: null, error: GENERIC_CONFIG_ERROR };
    }
    const { data, error } = await discordApiFetch(`/guilds/${GUILD_ID}/widget.json`);
    return { widget: data, error };
}


export interface Partner {
  name: string;
  joinLink: string;
  imageUrl: string;
  tags: string[];
  description: string;
}

export async function getPartnersFromChannel(): Promise<{ partners: Partner[] | null, error: string | null }> {
  const channelId = process.env.DISCORD_PARTNERS_CHANNEL_ID;
  if (!channelId) {
    return { partners: null, error: 'Partners channel ID not configured.' };
  }

  const { data: messages, error } = await discordApiFetch(`/channels/${channelId}/messages?limit=25`);
  if (error || !messages) {
    return { partners: null, error };
  }
  
  // *** ADDED FOR DEBUGGING ***
  console.log("Raw messages from partners channel:", JSON.stringify(messages, null, 2));


  const partners: Partner[] = messages.map((msg: any) => {
    try {
      const embed = msg.embeds?.[0];
      if (!embed || !embed.title || !embed.image?.url) {
        return null;
      }
      
      const inviteLinkField = embed.fields?.find((f: any) => f.name.toLowerCase() === 'invite link');
      const tagsField = embed.fields?.find((f: any) => f.name.toLowerCase() === 'tags');

      const joinLink = inviteLinkField?.value || '#';
      const tags = tagsField?.value ? tagsField.value.split(',').map((t: string) => t.trim()) : [];

      return {
        name: embed.title,
        joinLink: joinLink,
        tags: tags,
        description: embed.description || '',
        imageUrl: embed.image.url,
      };
    } catch (e) {
      console.error(`Failed to parse partner message (embed) ${msg.id}:`, e);
      return null;
    }
  }).filter((p: Partner | null): p is Partner => p !== null);

  return { partners, error: null };
}


    

    

    

    