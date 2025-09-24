'use client';
import Image from 'next/image';
import React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import SectionWrapper from './section-wrapper';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { partners } from '@/lib/site-data';
import { Badge } from '@/components/ui/badge';

export function PartnershipsCarousel() {
  const partnerImages = partners.map((partner) => ({
    ...partner,
    ...PlaceHolderImages.find((img) => img.id === partner.imageId),
  }));

  const plugin = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  return (
    <SectionWrapper id="partnerships">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-headline font-bold">
          Our Valued Partners
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground">
          Realms and communities we are proud to be allied with.
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
          {partnerImages.map((partner, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 sm:basis-1/3 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <div className="p-1">
                <Card className="overflow-hidden group">
                  <CardContent className="flex flex-col items-center p-0 relative">
                    {partner.tags && (
                      <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
                        {partner.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs backdrop-blur-sm bg-black/30"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {partner.imageUrl && (
                      <div className="w-full aspect-[3/4] overflow-hidden">
                        <Image
                          src={partner.imageUrl}
                          alt={partner.name}
                          data-ai-hint={partner.imageHint}
                          width={600}
                          height={800}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                    <div className="absolute bottom-0 p-3 md:p-4 w-full text-center">
                      <h3 className="text-base md:text-xl font-bold font-headline text-white">
                        {partner.name}
                      </h3>
                      <Button
                        asChild
                        className="mt-2 md:mt-4"
                        size="sm"
                        variant="secondary"
                      >
                        <a
                          href={partner.joinLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Join Server
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </SectionWrapper>
  );
}
