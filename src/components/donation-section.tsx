'use client';

import { Heart, Flame, Gem, ShieldCheck, Construction } from 'lucide-react';
import SectionWrapper from './section-wrapper';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from './ui/card';
import { Progress } from './ui/progress';

const supportTiers = [
  {
    icon: Flame,
    title: 'Flame of Nitro',
    description:
      'Fund Discord Nitro boosts to keep the Sanctuary blazing with enhanced features for all members.',
    buttonText: 'Boost the Flame',
    color: 'text-orange-500',
  },
  {
    icon: ShieldCheck,
    title: "The Citadel's Vault",
    description:
      'Contribute directly to server hosting, domain, and bot maintenance costs to keep our digital fortress secure.',
    buttonText: 'Guard the Vault',
    color: 'text-sky-500',
    progress: 70,
  },
  {
    icon: Construction,
    title: 'Forging New Realms',
    description:
      'Support the development of new community projects and applications, like the upcoming Gaming and Artist Hubs.',
    buttonText: 'Fund the Forge',
    color: 'text-amber-500',
  },
  {
    icon: Gem,
    title: 'Patron of the Crown',
    description:
      'Provide general support to the creators and leaders of the realm, ensuring the vision continues to thrive.',
    buttonText: 'Become a Patron',
    color: 'text-fuchsia-500',
  },
];

export function DonationSection() {
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

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left">
          {supportTiers.map((tier) => (
            <Card
              key={tier.title}
              className="bg-card/50 border-border/50 flex flex-col"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <tier.icon
                    className={`w-10 h-10 ${tier.color}`}
                    aria-hidden="true"
                  />
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-headline">
                      {tier.title}
                    </CardTitle>
                  </div>
                </div>
                <CardDescription className="pt-2">
                  {tier.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                {tier.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span className="text-muted-foreground">Monthly Goal</span>
                      <span>{tier.progress}%</span>
                    </div>
                    <Progress value={tier.progress} className="h-2" />
                  </div>
                )}
                <Button
                  className="w-full"
                  onClick={() => {
                    // In a real app, you would handle payment here
                    alert(`Thank you for choosing to ${tier.buttonText}!`);
                  }}
                >
                  {tier.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
