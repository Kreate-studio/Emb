
'use server';

import { unstable_noStore as noStore } from 'next/cache';

const API_BASE = 'https://discord.com/api/v10';
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!BOT_TOKEN) {
  console.warn("DISCORD_BOT_TOKEN is not set. Discord integration will not work.");
}

async function discordApiFetch(endpoint: string) {
  if (!BOT_TOKEN) {
    return { data: null, error: 'Discord bot token not configured.' };
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
      },
      next: { revalidate: 60 } // Revalidate every 60 seconds
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

export interface GuildDetails {
  name: string;
  memberCount: number;
  onlineCount: number;
  iconUrl: string | null;
}

export async function getGuildDetails(): Promise<{ details: GuildDetails | null, error: string | null }> {
  noStore();
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
      return { details: null, error: widgetRes.error };
  }

  const iconHash = guildRes.data.icon;
  const iconUrl = iconHash ? `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.png` : null;

  return {
    details: {
      name: guildRes.data.name,
      memberCount: guildRes.data.approximate_member_count || 0,
      onlineCount: widgetRes.data.presence_count || 0,
      iconUrl: iconUrl
    },
    error: null
  };
}

export interface ChannelMessage {
    id: string;
    content: string;
    author: {
        username: string;
        avatarUrl: string;
    };
    timestamp: string;
}

export async function getChannelMessages(channelId: string, limit: number = 5): Promise<{ messages: ChannelMessage[] | null, error: string | null }> {
  noStore();
   if (!channelId) return { messages: null, error: 'Channel ID not provided.' };
  
  const { data, error } = await discordApiFetch(`/channels/${channelId}/messages?limit=${limit}`);

  if (error || !data) {
    return { messages: null, error };
  }

  const messages: ChannelMessage[] = data.map((msg: any) => ({
    id: msg.id,
    content: msg.content,
    author: {
      username: msg.author.username,
      avatarUrl: msg.author.avatar
        ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(msg.author.discriminator) % 5}.png`
    },
    timestamp: msg.timestamp
  }));
  
  return { messages, error: null };
}
