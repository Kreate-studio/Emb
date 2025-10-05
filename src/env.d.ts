
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_DISCORD_CLIENT_ID: string;
    NEXT_PUBLIC_DISCORD_REDIRECT_URI: string;
    NEXT_PUBLIC_APP_URL: string;
    DISCORD_CLIENT_SECRET: string;
    DISCORD_BOT_TOKEN: string;
    DISCORD_GUILD_ID: string;
    DISCORD_ANNOUNCEMENTS_CHANNEL_ID: string;
    DISCORD_LIVE_FEED_CHANNEL_ID: string;
    DISCORD_PARTNERS_CHANNEL_ID: string;
    DISCORD_EVENTS_CHANNEL_ID: string;
    DISCORD_PARTNERSHIP_REQUESTS_CHANNEL_ID: string;
    SESSION_SECRET: string;
    KV_URL: string;
    KV_REST_API_URL: string;
    KV_REST_API_TOKEN: string;
    KV_REST_API_READ_ONLY_TOKEN: string;
    ECONOMY_API_URL: string;
    ECONOMY_API_SECRET: string;
  }
}
