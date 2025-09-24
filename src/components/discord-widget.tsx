'use client';

import { Users, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';

interface DiscordMember {
  id: string;
  username: string;
  avatar_url: string;
}

interface DiscordWidgetData {
  name: string;
  instant_invite: string;
  presence_count: number;
  members: DiscordMember[];
}

function WidgetSkeleton() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4 w-full">
        <div className="h-8 w-48 bg-muted rounded-md"></div>
        <div className="h-6 w-32 bg-muted rounded-md"></div>
        <div className="flex justify-center -space-x-4">
          <Skeleton className="h-10 w-10 rounded-full border-2 border-background"></Skeleton>
          <Skeleton className="h-10 w-10 rounded-full border-2 border-background"></Skeleton>
          <Skeleton className="h-10 w-10 rounded-full border-2 border-background"></Skeleton>
        </div>
      </div>
    </div>
  );
}

function WidgetError() {
  return (
    <div className="text-center w-full">
      <p className="text-muted-foreground text-center">
        Could not load Discord server status. You can join us directly!
      </p>
    </div>
  );
}

export function DiscordWidget() {
  const [data, setData] = useState<DiscordWidgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWidgetData() {
      try {
        const response = await fetch(
          'https://discord.com/api/guilds/1409095756438175816/widget.json'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch widget data');
        }
        const widgetData = await response.json();
        setData(widgetData);
      } catch (err) {
        console.error('Error fetching Discord widget data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchWidgetData();

    // Refetch every minute
    const interval = setInterval(fetchWidgetData, 60000);
    return () => clearInterval(interval);
  }, []);

  const inviteLink = data?.instant_invite || 'https://discord.gg/PruRXZ7zkF';

  return (
    <div className="lg:col-span-2 bg-card/50 border border-border/50 rounded-2xl p-6 md:p-12 shadow-lg backdrop-blur-md h-full flex flex-col justify-center items-center gap-6">
      {loading ? (
        <WidgetSkeleton />
      ) : error || !data ? (
        <WidgetError />
      ) : (
        <div className="text-center w-full">
          <h3 className="text-2xl md:text-3xl font-headline font-bold text-foreground">
            {data.name}
          </h3>
          <div className="my-4 flex items-center justify-center gap-2 text-muted-foreground">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span>{data.presence_count} Members Online</span>
          </div>
          {data.members && data.members.length > 0 && (
            <TooltipProvider>
              <div className="flex justify-center -space-x-4 mb-6">
                {data.members.slice(0, 10).map((member) => (
                  <Tooltip key={member.id}>
                    <TooltipTrigger>
                      <Avatar className="border-2 border-background">
                        <AvatarImage
                          src={member.avatar_url}
                          alt={member.username}
                        />
                        <AvatarFallback>
                          <User />
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{member.username}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          )}
        </div>
      )}
      <Button asChild size="lg" className="w-full">
        <a href={inviteLink} target="_blank" rel="noopener noreferrer">
          <Users className="mr-2" />
          Join Server
        </a>
      </Button>
    </div>
  );
}
