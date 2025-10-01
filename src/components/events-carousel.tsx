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
import { Badge } from '@/components/ui/badge';
import type { Event } from '@/lib/discord-service';

interface EventsCarouselProps {
  events: Event[];
}

function EventCard({ event }: { event: Event }) {
  const CardInner = () => (
    <Card className="overflow-hidden group h-full">
      <CardContent className="flex flex-col items-start p-0 h-full">
        {event.imageUrl && (
          <div className="w-full aspect-video overflow-hidden">
            <Image
              src={event.imageUrl}
              alt={event.title}
              width={800}
              height={500}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        )}
        <div className="p-4 w-full flex flex-col flex-1">
          <Badge variant="secondary" className="mb-2 w-fit">
            {event.category}
          </Badge>
          <h3 className="text-base md:text-lg font-bold font-headline">
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-1">
            {event.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  if (event.readMoreLink) {
    return (
      <a href={event.readMoreLink} target="_blank" rel="noopener noreferrer" className="block h-full">
        <CardInner />
      </a>
    );
  }

  return <CardInner />;
}


export function EventsCarousel({ events }: EventsCarouselProps) {
  const plugin = React.useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      plugins={[plugin.current]}
      className="w-full max-w-4xl mx-auto"
    >
      <CarouselContent>
        {events.map((event, index) => (
          <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3">
            <div className="p-1 h-full">
              <EventCard event={event} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
