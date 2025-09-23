'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import SectionWrapper from './section-wrapper';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const loreEntries = [
  {
    title: 'The Eternal Queen & King',
    content:
      'At the heart of the realm stand the Eternal Queen and King, immortal sovereigns who have witnessed ages turn to dust. Their wisdom is as boundless as their power, guiding the sanctuary through eons of turmoil and peace. They are the twin flames from which the sanctuary was born.',
  },
  {
    title: 'The High Council',
    content:
      'Comprised of the most esteemed and sagacious individuals from across the realms, the High Council advises the Eternal monarchs. Each member is a master of their craft—be it arcane arts, statecraft, or ancient warfare—ensuring the kingdom’s stability and prosperity.',
  },
  {
    title: 'The Wardens',
    content:
      'The silent protectors and enforcers of the sanctuary’s laws. Clad in moonlit silver armor, the Wardens patrol the seen and unseen paths of the realm. They are chosen for their unwavering loyalty and formidable skills, embodying justice and order.',
  },
  {
    title: 'Citizens of the Realm',
    content:
      'From the most talented artists to the bravest gamers, the citizens are the lifeblood of D’Last Sanctuary. They are the creators, the dreamers, and the adventurers whose passions and stories weave the very fabric of the kingdom, shaping its destiny with every creation and quest.',
  },
];

export function LoreSection() {
  const bgImage = PlaceHolderImages.find((img) => img.id === 'lore-bg');
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.pageYOffset);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <SectionWrapper id="lore" className="relative">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt={bgImage.description}
          data-ai-hint={bgImage.imageHint}
          fill
          className="object-cover object-center z-0"
          style={{ transform: `translateY(${offsetY * 0.1}px)` }}
        />
      )}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0" />

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="max-w-md">
          <h2 className="text-4xl md:text-5xl font-headline font-bold">
            Whispers of the Ages
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Uncover the rich history and foundational pillars of D’Last
            Sanctuary.
          </p>
        </div>
        <div className="bg-card/50 border border-border/50 rounded-lg p-2 backdrop-blur-md">
          <Accordion type="single" collapsible className="w-full">
            {loreEntries.map((entry, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg font-headline hover:no-underline">
                  {entry.title}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {entry.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </SectionWrapper>
  );
}
