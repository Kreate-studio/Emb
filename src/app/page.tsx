
import { CommunityShowcase } from '@/components/community-showcase';
import { DonationSection } from '@/components/donation-section';
import { HubsSection } from '@/components/hubs-section';
import { EventsCarousel } from '@/components/events-carousel';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { JoinCTA } from '@/components/join-cta';
import { LoreSection } from '@/components/lore-section';
import { PartnershipsCarousel } from '@/components/partnerships-carousel';
import { DiscordIntegrationSection } from '@/components/discord-integration-section';
import { getGuildWidget } from '@/lib/discord-service';

export default async function Home() {
    // The check for the guild ID is now handled within getGuildWidget to ensure
    // the environment variable is never accessed in a way that could be exposed to the client.
    const widgetData = await getGuildWidget();

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-1">
                <HeroSection />
                <HubsSection />
                <DiscordIntegrationSection />
                <PartnershipsCarousel />
                <CommunityShowcase />
                <LoreSection />
                <EventsCarousel />
                <DonationSection />
                <JoinCTA widgetData={widgetData} />
            </main>
            <Footer />
        </div>
    );
}
