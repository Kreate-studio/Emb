
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
    
    if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        return { data, error: null };
    }

    return { data: true, error: null }; // For successful responses with no body

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

export async function sendDm(userId: string, message: string): Promise<{ error: string | null }> {
    if (!userId) return { error: 'User ID not provided.' };

    try {
        // Step 1: Create a DM channel with the user
        const { data: channelData, error: channelError } = await discordApiFetch('/users/@me/channels', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipient_id: userId }),
        });

        if (channelError || !channelData?.id) {
            console.error(`Failed to create DM channel with ${userId}:`, channelError);
            return { error: 'Could not create a direct message channel with the user.' };
        }

        const channelId = channelData.id;

        // Step 2: Send the message to the newly created channel
        return sendMessageToChannel(channelId, message);
    } catch (e) {
        console.error(`Error in sendDm for user ${userId}:`, e);
        return { error: 'An unexpected error occurred while trying to send a direct message.' };
    }
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
  joined_at: string;
  highestRole?: GuildRole;
  avatarUrl: string;
  displayName: string;
}

export async function getGuildMember(userId: string): Promise<{member: DiscordMember | null, error: string | null}> {
    const GUILD_ID = process.env.DISCORD_GUILD_ID;
    if (!GUILD_ID) return { member: null, error: GENERIC_CONFIG_ERROR };
    const { data: memberData, error } = await discordApiFetch(`/guilds/${GUILD_ID}/members/${userId}`);
    
    if (error || !memberData) {
        return { member: null, error };
    }

    const displayName = memberData.nick || memberData.user?.global_name || memberData.user?.username || 'Unknown User';
    const avatarUrl = memberData.user?.avatar
        ? `https://cdn.discordapp.com/avatars/${memberData.user.id}/${memberData.user.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${(parseInt(memberData.user.id) >> 22) % 6}.png`;

    const member: DiscordMember = {
        ...memberData,
        displayName,
        avatarUrl,
    };

    return { member, error: null };
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

export async function getMembersWithRole(roleName: string): Promise<{ members: DiscordMember[] | null, error: string | null }> {
  const GUILD_ID = process.env.DISCORD_GUILD_ID;
  if (!GUILD_ID) {
    return { members: null, error: GENERIC_CONFIG_ERROR };
  }

  const { roles, error: rolesError } = await getGuildRoles();
  if (rolesError || !roles) {
    return { members: null, error: rolesError };
  }

  const targetRole = roles.find(r => r.name.toLowerCase() === roleName.toLowerCase());
  if (!targetRole) {
    return { members: null, error: `Role '${roleName}' not found.` };
  }

  // Discord's API is paginated, so we fetch in a loop.
  let allMembers: any[] = [];
  let lastMemberId = '0';
  const limit = 1000;

  while (true) {
    const { data: membersChunk, error: membersError } = await discordApiFetch(
      `/guilds/${GUILD_ID}/members?limit=${limit}&after=${lastMemberId}`
    );

    if (membersError || !membersChunk) {
      return { members: null, error: membersError };
    }

    allMembers = allMembers.concat(membersChunk);

    if (membersChunk.length < limit) {
      break; // Last page
    }
    lastMemberId = membersChunk[membersChunk.length - 1].user.id;
  }
  
  const membersWithRole = allMembers.filter(m => m.roles.includes(targetRole.id));
  
  const detailedMembers: DiscordMember[] = membersWithRole.map((member: any) => {
    const userRoles = roles.filter(r => member.roles.includes(r.id));
    const highestRole = userRoles.length > 0 ? userRoles[0] : undefined;
    const displayName = member.nick || member.user.global_name || member.user.username;
    const avatarUrl = member.user.avatar
        ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${(parseInt(member.user.id) >> 22) % 6}.png`;

    return {
        ...member,
        displayName,
        avatarUrl,
        highestRole,
    };
  });

  return { members: detailedMembers, error: null };
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
  
  const markdownLinkRegex = /\[.*?\]\((https?:\/\/[^\s]+)\)/;

  const partners: Partner[] = messages.map((msg: any) => {
    try {
      const embed = msg.embeds?.[0];
      if (!embed || !embed.title || !embed.image?.url) {
        return null;
      }
      
      let joinLink = '#';
      let tags: string[] = [];

      if (embed.fields && Array.isArray(embed.fields)) {
        const inviteField = embed.fields.find((f: any) => f.value?.includes('https://discord.gg/'));
        if (inviteField?.value) {
            const match = inviteField.value.match(markdownLinkRegex);
            if (match && match[1]) {
                joinLink = match[1];
            } else {
                 joinLink = inviteField.value.trim();
            }
        }
        
        const tagsField = embed.fields.find((f: any) => {
            const lowerCaseName = f.name?.toLowerCase();
            return lowerCaseName.includes('tags') || lowerCaseName.includes('categories');
        });

        if (tagsField && tagsField.value) {
            tags = tagsField.value.split(',').map((t: string) => t.trim()).filter(Boolean);
        }
      }

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

export interface Event {
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  readMoreLink: string | null;
}

export async function getEventsFromChannel(): Promise<{ events: Event[] | null, error: string | null }> {
    const channelId = process.env.DISCORD_EVENTS_CHANNEL_ID;
    if (!channelId) {
        return { events: null, error: 'Events channel ID not configured.' };
    }

    const { data: messages, error } = await discordApiFetch(`/channels/${channelId}/messages?limit=10`);
    if (error || !messages) {
        return { events: null, error };
    }
    
    const markdownLinkRegex = /\[.*?\]\((https?:\/\/[^\s)]+)\)/;
    const urlRegex = /https?:\/\/[^\s)]+/;


    const events: Event[] = messages.map((msg: any) => {
        try {
            const embed = msg.embeds?.[0];
            if (!embed || !embed.title || !embed.description || !embed.image?.url) {
                return null;
            }

            const categoryField = embed.fields?.find((f: any) => f.name?.toLowerCase().includes('tags'));
            const linkField = embed.fields?.find((f: any) => {
                const lowerCaseName = f.name?.toLowerCase();
                return lowerCaseName.includes('read more') || lowerCaseName.includes('link') || lowerCaseName.includes('learn more');
            });

            let readMoreLink: string | null = null;
            if (linkField && linkField.value) {
                const markdownMatch = linkField.value.match(markdownLinkRegex);
                if (markdownMatch && markdownMatch[1]) {
                    readMoreLink = markdownMatch[1];
                } else {
                    const urlMatch = linkField.value.match(urlRegex);
                    if (urlMatch) {
                        readMoreLink = urlMatch[0];
                    }
                }
            }

            return {
                title: embed.title,
                category: categoryField?.value || 'General',
                description: embed.description,
                imageUrl: embed.image.url,
                readMoreLink: readMoreLink,
            };
        } catch (e) {
            console.error(`Failed to parse event message (embed) ${msg.id}:`, e);
            return null;
        }
    }).filter((e: Event | null): e is Event => e !== null);

    return { events, error: null };
}
