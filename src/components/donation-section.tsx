'use client';

import { Heart, DollarSign } from 'lucide-react';
import SectionWrapper from './section-wrapper';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from './ui/input';

const donationTiers = [
  { amount: 5, emoji: '❤️' },
  { amount: 15, emoji: '💖' },
  { amount: 25, emoji: '🌟' },
  { amount: 50, emoji: '💎' },
];

export function DonationSection() {
  return (
    <SectionWrapper id="donate" className="bg-secondary/20">
      <div className="max-w-4xl mx-auto text-center">
        <Heart className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
        <h2 className="text-3xl md:text-4xl font-headline font-bold">
          Support the Realm
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          D’Last Sanctuary is a community-driven universe, and every flame
          contributes to its warmth. Your donations help us cover server costs,
          fund app development, and create more magical experiences for
          everyone.
        </p>

        <Card className="mt-8 text-left bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Choose Your Contribution</CardTitle>
            <CardDescription>
              Select a one-time donation amount or enter a custom value.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="onetime">
              <TabsList className="grid w-full grid-cols-1 mb-4 h-auto">
                <TabsTrigger value="onetime">One-Time Donation</TabsTrigger>
              </TabsList>
              <TabsContent value="onetime">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {donationTiers.map((tier) => (
                    <Button
                      key={tier.amount}
                      variant="outline"
                      className="h-20 flex-col gap-1 text-lg"
                      onClick={() => {
                        // In a real app, you would handle payment here
                        alert(`Thank you for your $${tier.amount} donation!`);
                      }}
                    >
                      <span className="text-2xl">{tier.emoji}</span>
                      <span>${tier.amount}</span>
                    </Button>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-grow">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Custom Amount"
                      className="pl-10 text-base"
                    />
                  </div>
                  <Button className="w-full sm:w-auto">
                    Donate Custom Amount
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
}
