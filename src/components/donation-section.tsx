import { Heart } from 'lucide-react';
import SectionWrapper from './section-wrapper';
import { TopSupporters } from './top-supporters';
import { DonationTiers } from './donation-tiers';
import { KingdomBoosters } from './kingdom-boosters';
import Image from 'next/image';
import { Button } from './ui/button';

export async function DonationSection() {
  return (
    <SectionWrapper id="donate">
      <div className="max-w-5xl mx-auto text-center">
        <Heart className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-primary animate-pulse" />
        <h2 className="text-3xl md:text-4xl font-headline font-bold">
          Support the Realm
        </h2>
        <p className="mt-3 max-w-3xl mx-auto text-muted-foreground text-base md:text-lg">
          D’Last Sanctuary is a community-driven universe, and every flame
          contributes to its warmth. Your support helps us cover costs, fund new projects,
          and create more magical experiences for everyone.
        </p>

        <div className="my-8">
            <Button asChild variant="ghost" className="h-auto p-0">
                <a href='https://ko-fi.com/X8X81M5A6Y' target='_blank' rel='noopener noreferrer'>
                    <Image 
                        height='48' 
                        width='245'
                        src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' 
                        alt='Buy Me a Coffee at ko-fi.com' 
                    />
                </a>
            </Button>
        </div>


        <TopSupporters />
        <KingdomBoosters />

        <DonationTiers />
      </div>
    </SectionWrapper>
  );
}
