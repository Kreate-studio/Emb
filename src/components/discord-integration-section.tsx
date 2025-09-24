import { getGuildDetails, getChannelMessages, getGuildRoles } from '@/lib/discord-service';
import { DiscordIntegrationSectionContent } from './discord-integration-section-content';


export async function DiscordIntegrationSection() {
    const guildId = process.env.DISCORD_GUILD_ID;
    const announcementsChannelId = process.env.DISCORD_ANNOUNCEMENTS_CHANNEL_ID;
    const liveFeedChannelId = process.env.DISCORD_LIVE_FEED_CHANNEL_ID;

    if (!guildId || !announcementsChannelId || !liveFeedChannelId) {
        // You might want to render a placeholder or nothing at all if the IDs are not set.
        // Returning null will prevent the section from rendering.
        console.warn("Discord environment variables are not set. The Discord integration section will not be rendered.");
        return null;
    }

    // Fetch initial data on the server
    const [guildData, announcementsData, liveFeedData, rolesData] = await Promise.all([
        getGuildDetails(),
        getChannelMessages(announcementsChannelId, 3),
        getChannelMessages(liveFeedChannelId, 5),
        getGuildRoles()
    ]);

    return <DiscordIntegrationSectionContent 
        guildData={guildData}
        announcementsData={announcementsData}
        liveFeedData={liveFeedData}
        rolesData={rolesData}
        announcementsChannelId={announcementsChannelId}
        liveFeedChannelId={liveFeedChannelId}
    />
}
