
'use client';

import { Crown } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import React, { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { DiscordMember } from '@/lib/discord-service';

function intToHex(int: number | undefined) {
    if (int === undefined || int === null || int === 0) return '#FFFFFF'; // Default to white
    return '#' + int.toString(16).padStart(6, '0');
}


export function KingdomBoostersCarousel({ members }: { members: DiscordMember[] }) {
  const plugin = useRef(
    Autoplay({
      delay: 2500,
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
        <CarouselContent className="-ml-4">
          {members.map((member) => {
            const roleColor = intToHex(member.highestRole?.color);

            return (
              <CarouselItem key={member.user.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                <div 
                    className="p-4 bg-card/50 backdrop-blur-md rounded-lg flex flex-col items-center text-center"
                >
                    <Avatar className="h-24 w-24 mx-auto border-4" style={{ borderColor: roleColor }}>
                        <AvatarImage src={member.avatarUrl} alt={member.displayName} />
                        <AvatarFallback>{member.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="mt-2">
                        <p className="font-bold text-sm truncate" style={{ color: roleColor }}>
                            {member.displayName}
                        </p>
                         <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                          <Crown className="w-3 h-3 text-pink-400" />
                          Kingdom Booster
                        </p>
                    </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
  );
}
