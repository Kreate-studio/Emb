'use client';
import Image from 'next/image';
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

export function PartnershipsCarousel() {
  const partnerImages = partners.map((partner) => ({
    ...partner,
    ...PlaceHolderImages.find((img) => img.id === partner.imageId),
  }));

  return (
    <SectionWrapper id="partnerships">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-headline font-bold">
          Our Valued Partners
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Realms and communities we are proud to be allied with.
        </p>
      </div>

      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full max-w-6xl mx-auto"
      >
        <CarouselContent>
          {partnerImages.map((partner, index) => (
            <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
              <div className="p-1">
                <Card className="overflow-hidden group">
                  <CardContent className="flex flex-col items-center p-0 relative">
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
                    <div className="absolute bottom-0 p-4 w-full text-center">
                      <h3 className="text-xl font-bold font-headline text-white">
                        {partner.name}
                      </h3>
                       <Button asChild className="mt-4" variant="secondary">
                        <a href={partner.joinLink} target="_blank" rel="noopener noreferrer">
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
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </SectionWrapper>
  );
}
