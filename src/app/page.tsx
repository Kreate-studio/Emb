import { CommunityShowcase } from '@/components/community-showcase';
import { EcosystemShowcase } from '@/components/ecosystem-showcase';
import { EventsCarousel } from '@/components/events-carousel';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { JoinCTA } from '@/components/join-cta';
import { LoreSection } from '@/components/lore-section';
import { PartnershipsCarousel } from '@/components/partnerships-carousel';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <EcosystemShowcase />
        <PartnershipsCarousel />
        <CommunityShowcase />
        <LoreSection />
        <EventsCarousel />
        <JoinCTA />
      </main>
      <Footer />
    </div>
  );
}
