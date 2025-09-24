'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import SectionWrapper from './section-wrapper';
import { ecosystemItems } from '@/lib/site-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { HubModal } from './hub-modal';
import type { EcosystemItem } from '@/lib/site-data';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

export function HubsSection() {
  const [selectedHub, setSelectedHub] = useState<EcosystemItem | null>(null);

  const hubsWithImages = ecosystemItems.map((item) => {
    const placeholder = PlaceHolderImages.find((p) => p.id === item.imageId);
    return {
      ...item,
      imageUrl: placeholder?.imageUrl,
      imageHint: placeholder?.imageHint,
    };
  });

  return (
    <>
      <SectionWrapper id="ecosystem" className="bg-secondary/20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-headline font-bold">
            Explore the Hubs
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground">
            Discover the apps, bots, and tools that power the D’Last Sanctuary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {hubsWithImages.map((item) => (
            <Card
              key={item.title}
              onClick={() => setSelectedHub(item)}
              className={cn(
                'group relative aspect-[4/3] overflow-hidden rounded-lg transition-all duration-300 transform hover:-translate-y-2 cursor-pointer',
                !item.imageUrl && 'bg-card/50 border-border/50'
              )}
            >
              {item.imageUrl && (
                <>
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    data-ai-hint={item.imageHint}
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors" />
                </>
              )}
              <div className="relative z-10 flex flex-col justify-between h-full p-4 md:p-5">
                <div className="flex items-start justify-between">
                  <item.icon className="h-7 w-7 md:h-8 md:w-8 text-primary group-hover:text-accent transition-colors drop-shadow-lg" />
                  {item.comingSoon && (
                    <Badge
                      variant="outline"
                      className="border-accent text-accent bg-background/50 backdrop-blur-sm group-hover:bg-accent group-hover:text-accent-foreground transition-all"
                    >
                      Coming Soon
                    </Badge>
                  )}
                </div>
                <div className='text-white'>
                  <h3 className="text-xl md:text-2xl font-bold font-headline drop-shadow-md">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-foreground/80 drop-shadow-sm line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </SectionWrapper>
      <HubModal
        isOpen={!!selectedHub}
        onClose={() => setSelectedHub(null)}
        hub={selectedHub}
      />
    </>
  );
}
