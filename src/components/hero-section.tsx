'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FlameIcon } from '@/components/flame-icon';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ParticleBackground } from './particle-background';
import { ArrowDown } from 'lucide-react';

export function HeroSection() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-bg');
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.pageYOffset);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="hero"
      className="relative h-dvh min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      <ParticleBackground />
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          data-ai-hint={heroImage.imageHint}
          fill
          className="object-cover -z-10"
          style={{ transform: `translateY(${offsetY * 0.4}px)` }}
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-0" />
      <div className="absolute inset-0 bg-background/50 z-0" />

      <div className="relative z-10 text-center p-4 flex flex-col items-center">
        <FlameIcon className="w-16 h-16 md:w-24 md:h-24 mb-4 drop-shadow-[0_0_15px_hsl(var(--accent))] animate-pulse" />
        <h1 className="text-4xl md:text-7xl font-headline font-bold uppercase text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground drop-shadow-lg animate-fade-in-down">
          D’LAST SANCTUARY
        </h1>
        <p className="mt-4 max-w-2xl text-base md:text-xl text-muted-foreground animate-fade-in-up animation-delay-300">
          A realm for Gamers, Artists, and Creators - Shape the kingdom and your
          destiny.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-600">
          <Button size="lg" asChild>
            <a
              href="https://discord.gg/PruRXZ7zkF"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join the Realm
            </a>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="#ecosystem">Explore the Ecosystem</Link>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <ArrowDown className="w-6 h-6 text-muted-foreground animate-bounce" />
      </div>
    </section>
  );
}
