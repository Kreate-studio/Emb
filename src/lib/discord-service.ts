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
}

export async function getGuildRoles(): Promise<{ roles: GuildRole[] | null, error: string | null}> {
    if (!GUILD_ID) return { roles: null, error: 'Guild ID not configured.' };
    const { data, error } = await discordApiFetch(`/guilds/${GUILD_ID}/roles`);
    if (error || !data) return { roles: null, error };
    
    const roles: GuildRole[] = data.map((role: any) => ({
        id: role.id,
        name: role.name,
        color: role.color,
    }));
    
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

export interface ChannelMessage {
    id: string;
    content: string;
    author: {
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

export async function getChannelMessages(channelId: string, limit: number = 5): Promise<{ messages: ChannelMessage[] | null, error: string | null }> {
  if (!channelId) return { messages: null, error: 'Channel ID not provided.' };
  
  const { data, error } = await discordApiFetch(`/channels/${channelId}/messages?limit=${limit}`);

  if (error || !data) {
    return { messages: null, error };
  }

  const messages: ChannelMessage[] = data.map((msg: any) => {
    const author = msg.author;
    const displayName = msg.member?.nick || author.global_name || author.username;
    
    return {
      id: msg.id,
      content: msg.content,
      author: {
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
      }
    }
  });
  
  return { messages, error: null };
}
