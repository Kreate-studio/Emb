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
import { Badge } from '@/components/ui/badge';
import { events } from '@/lib/site-data';

export function EventsCarousel() {
  const eventImages = events.map((event) => ({
    ...event,
    ...PlaceHolderImages.find((img) => img.id === event.imageId),
  }));

  const plugin = React.useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  return (
    <SectionWrapper id="events" className="bg-secondary/20">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-headline font-bold">
          Events & News
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Stay updated with the latest happenings in the D’Last Sanctuary.
        </p>
      </div>

      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full max-w-4xl mx-auto"
      >
        <CarouselContent>
          {eventImages.map((event, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="overflow-hidden group">
                  <CardContent className="flex flex-col items-start p-0">
                    {event.imageUrl && (
                      <div className="w-full aspect-video overflow-hidden">
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          data-ai-hint={event.imageHint}
                          width={800}
                          height={500}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    )}
                    <div className="p-4 w-full">
                       <Badge variant="secondary" className="mb-2">{event.category}</Badge>
                      <h3 className="text-lg font-bold font-headline">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </SectionWrapper>
  );
}
