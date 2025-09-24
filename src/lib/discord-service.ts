'use server';

import { unstable_noStore as noStore } from 'next/cache';

const API_BASE = 'https://discord.com/api/v10';
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!BOT_TOKEN) {
  console.warn("DISCORD_BOT_TOKEN is not set. Discord integration will not work.");
}

async function discordApiFetch(endpoint: string) {
  noStore();
  if (!BOT_TOKEN) {
    return { data: null, error: 'Discord bot token not configured.' };
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
      },
      next: { revalidate: 10 } // Revalidate more frequently for live data
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Discord API Error (${response.status}): ${errorText}`);
      return { data: null, error: `Failed to fetch from Discord API: ${response.statusText}` };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err) {
    console.error('Error fetching from Discord API:', err);
    return { data: null, error: 'An unexpected error occurred while fetching from Discord.' };
  }
}

export interface GuildRole {
    id: string;
    name: string;
    color: number;
    position: number;
}

export async function getGuildRoles(): Promise<{ roles: GuildRole[] | null, error: string | null}> {
    if (!GUILD_ID) return { roles: null, error: 'Guild ID not configured.' };
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
  const guildId = process.env.DISCORD_GUILD_ID;
  if (!guildId) return { details: null, error: 'Guild ID not configured.' };

  const [guildRes, widgetRes] = await Promise.all([
     discordApiFetch(`/guilds/${guildId}?with_counts=true`),
     discordApiFetch(`/guilds/${guildId}/widget.json`)
  ]);

  if (guildRes.error || !guildRes.data) {
      return { details: null, error: guildRes.error };
  }
   if (widgetRes.error || !widgetRes.data) {
      // Widget can be disabled, so we don't want to fail the entire request
      console.warn("Could not fetch Discord widget.json. Online count may be inaccurate.");
  }

  const iconHash = guildRes.data.icon;
  const iconUrl = iconHash ? `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.png` : null;

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
    if (!GUILD_ID) return { member: null, error: 'Guild ID not configured.' };
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
