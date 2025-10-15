'use client';

import React from 'react';
import SectionWrapper from './section-wrapper';
import { loreEntries } from '@/lib/site-data';
import { Button } from './ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Flame, Crown, Users, Gem } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay";

const iconMap: Record<string, React.ElementType> = {
    "The Eternal Flame": Flame,
    "The Eternal Queen & Her Council": Crown,
    "The Exalted & The Citizens": Gem,
    "The Guilds of Creation": Users,
}

export function LoreSection() {

    const plugin = React.useRef(
        Autoplay({
          delay: 5000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        })
      );

  return (
    <SectionWrapper id="lore">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-headline font-bold">
          Whispers of the Ages
        </h2>
        <p className="mt-3 max-w-3xl mx-auto text-base md:text-lg text-muted-foreground">
          Uncover the rich history and foundational pillars of D’Last
          Sanctuary, one chapter at a time.
        </p>
      </div>

      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full max-w-6xl mx-auto"
      >
        <CarouselContent>
          {loreEntries.map((entry, index) => {
            const Icon = iconMap[entry.title] || Flame;
            return (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-2 h-full">
                    <Card className="h-full flex flex-col bg-card/50 border-border/50 backdrop-blur-sm shadow-lg hover:border-primary/50 transition-colors duration-300">
                        <CardHeader className="items-center text-center">
                            <div className="p-4 bg-primary/10 rounded-full mb-2">
                                <Icon className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="font-headline text-2xl">{entry.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between text-center">
                            <p className="text-muted-foreground line-clamp-5">{entry.content}</p>
                            <Button asChild variant="outline" className="mt-6 w-fit mx-auto">
                                <Link href="/lore">Read the Chronicle</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>

    </SectionWrapper>
  );
}
