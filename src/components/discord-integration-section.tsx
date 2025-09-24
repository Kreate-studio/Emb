
import { getGuildDetails, getChannelMessages } from '@/lib/discord-service';
import SectionWrapper from './section-wrapper';
import { ServerStats } from './server-stats';
import { AnnouncementsFeed } from './announcements-feed';
import { LiveChannelFeed } from './live-channel-feed';

export async function DiscordIntegrationSection() {
    const guildId = process.env.DISCORD_GUILD_ID;
    const announcementsChannelId = process.env.DISCORD_ANNOUNCEMENTS_CHANNEL_ID;
    const liveFeedChannelId = process.env.DISCORD_LIVE_FEED_CHANNEL_ID;

    if (!guildId || !announcementsChannelId || !liveFeedChannelId) {
        return null;
    }

    // Fetch initial data on the server
    const [guildData, announcementsData, liveFeedData] = await Promise.all([
        getGuildDetails(),
        getChannelMessages(announcementsChannelId, 3),
        getChannelMessages(liveFeedChannelId, 5)
    ]);

    return (
        <SectionWrapper id="discord-live" className="bg-secondary/20">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-headline font-bold">
                    From the Community
                </h2>
                <p className="mt-3 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground">
                    A live look into the heart of D’Last Sanctuary on Discord.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <ServerStats 
                    initialData={guildData.details} 
                    error={guildData.error} 
                />
                <AnnouncementsFeed 
                    initialData={announcementsData.messages} 
                    error={announcementsData.error}
                    channelId={announcementsChannelId}
                />
                <LiveChannelFeed 
                    initialData={liveFeedData.messages} 
                    error={liveFeedData.error}
                    channelId={liveFeedChannelId}
                />
            </div>
        </SectionWrapper>
    );
}
