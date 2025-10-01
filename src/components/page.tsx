
import { CommunityShowcase } from '@/components/community-showcase';
import { DonationSection } from '@/components/donation-section';
import { HubsSection } from '@/components/hubs-section';
import EventsCarouselContainer from '@/components/events-carousel-container';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { JoinCTA } from '@/components/join-cta';
import { LoreSection } from '@/components/lore-section';
import { PartnershipsCarousel } from '@/components/partnerships-carousel';
import { DiscordIntegrationSection } from '@/components/discord-integration-section';
import { getGuildWidget } from '@/lib/discord-service';

export default async function Home() {

  const guildId = process.env.DISCORD_GUILD_ID;
  let widgetData = null;
  if(guildId) {
    widgetData = await getGuildWidget();
  } else {
    // Ensure widgetData is not null and has a default structure
    widgetData = { widget: null, error: "Guild ID not configured." };
  }


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
        <EventsCarouselContainer />
        <DonationSection />
        <JoinCTA widgetData={widgetData} />
      </main>
      <Footer />
    </div>
  );
}
