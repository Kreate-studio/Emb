'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import SectionWrapper from './section-wrapper';
import { loreEntries } from '@/lib/site-data';

export function LoreSection() {
  return (
    <SectionWrapper id="lore" className="bg-secondary/20">
      <div className="relative z-10 max-w-3xl mx-auto bg-card/50 border border-border/50 rounded-2xl p-8 md:p-12 shadow-lg backdrop-blur-md text-center">
        <h2 className="text-4xl md:text-5xl font-headline font-bold">
          Whispers of the Ages
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Uncover the rich history and foundational pillars of D’Last
          Sanctuary.
        </p>

        <div className="mt-8 text-left">
          <Accordion type="single" collapsible className="w-full">
            {loreEntries.map((entry, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="border-b-border/50">
                <AccordionTrigger className="text-lg font-headline hover:no-underline text-left">
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
