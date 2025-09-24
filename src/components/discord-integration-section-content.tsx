'use client';

import React from 'react';
import type { ChannelMessageWithUser } from '@/lib/discord-service';
import type { getGuildDetails, getGuildWidget } from '@/lib/discord-service';
import SectionWrapper from './section-wrapper';
import { ServerStats } from './server-stats';
import { AnnouncementsFeed } from './announcements-feed';
import { LiveChannelFeed } from './live-channel-feed';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

type DiscordIntegrationSectionProps = {
  guildData: Awaited<ReturnType<typeof getGuildDetails>>;
  announcementsData: { messages: ChannelMessageWithUser[] | null, error: string | null };
  liveFeedData: { messages: ChannelMessageWithUser[] | null, error: string | null };
  widgetData: Awaited<ReturnType<typeof getGuildWidget>>;
  announcementsChannelId: string;
  liveFeedChannelId: string;
};

export function DiscordIntegrationSectionContent({
    guildData,
    announcementsData,
    liveFeedData,
    widgetData,
    announcementsChannelId,
    liveFeedChannelId
}: DiscordIntegrationSectionProps) {

    const plugin = React.useRef(
        Autoplay({
        delay: 5000,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
        })
    );

    return (
        <SectionWrapper id="discord-live" className="bg-secondary/20">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-headline font-bold">
                    From the Community
                </h2>
                <p className="mt-3 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground">
                    A live look into the heart of D’Last Sanctuary on Discord.
                </p>
            </div>
            <div className="lg:hidden">
                 <Carousel
                    opts={{
                        align: 'start',
                        loop: true,
                    }}
                    plugins={[plugin.current]}
                    className="w-full max-w-md mx-auto"
                >
                    <CarouselContent>
                        <CarouselItem>
                             <ServerStats 
                                initialData={guildData.details} 
                                error={guildData.error}
                                widgetData={widgetData.widget} 
                            />
                        </CarouselItem>
                         <CarouselItem>
                             <AnnouncementsFeed 
                                initialData={announcementsData.messages} 
                                error={announcementsData.error}
                                channelId={announcementsChannelId}
                            />
                        </CarouselItem>
                         <CarouselItem>
                             <LiveChannelFeed 
                                initialData={liveFeedData.messages} 
                                error={liveFeedData.error}
                                channelId={liveFeedChannelId}
                            />
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>
            </div>
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <ServerStats 
                    initialData={guildData.details} 
                    error={guildData.error}
                    widgetData={widgetData.widget}
                />
                <AnnouncementsFeed 
                    initialData={announcementsData.messages} 
                    error={announcementsData.error}
                    channelId={announcementsChannelId}
                />
                <LiveChannelFeed 
                    initialData={liveFeedData.messages} 
                    error={liveFeedData.error}
                    channelId={liveFeedChannelId}
                />
            </div>
        </SectionWrapper>
    );
}
