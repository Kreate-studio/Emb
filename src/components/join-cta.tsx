'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { handleNewsletterSignup } from '@/app/actions';
import SectionWrapper from './section-wrapper';
import { useToast } from '@/hooks/use-toast';
import { FlameIcon } from './flame-icon';
import { Users, User } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Joining...' : 'Join the Waitlist'}
    </Button>
  );
}

interface DiscordMember {
  id: string;
  username: string;
  discriminator: string;
  avatar_url: string;
  status: string;
}

interface DiscordWidgetData {
  name: string;
  instant_invite: string;
  presence_count: number;
  members: DiscordMember[];
}

function DiscordWidget() {
  const [data, setData] = useState<DiscordWidgetData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWidgetData() {
      try {
        const response = await fetch(
          'https://discord.com/api/guilds/1409095756438175816/widget.json'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch Discord widget data');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    }
    fetchWidgetData();
  }, []);

  const content = () => {
    if (error) {
      return (
        <p className="text-muted-foreground">
          Could not load Discord status. Please join us directly!
        </p>
      );
    }
    if (!data) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4 w-full">
            <div className="h-8 w-48 bg-muted rounded-md"></div>
            <div className="h-6 w-32 bg-muted rounded-md"></div>
            <div className="h-10 w-full bg-muted rounded-md"></div>
          </div>
        </div>
      );
    }
    return (
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
    );
  };

  const inviteLink = data?.instant_invite || 'https://discord.gg/PruRXZ7zkF';

  return (
    <div className="lg:col-span-2 bg-card/50 border border-border/50 rounded-2xl p-6 md:p-12 shadow-lg backdrop-blur-md h-full flex flex-col justify-center items-center gap-6">
      {content()}
      <Button asChild size="lg" className="w-full">
        <a href={inviteLink} target="_blank" rel="noopener noreferrer">
          <Users className="mr-2" />
          Join Server
        </a>
      </Button>
    </div>
  );
}

export function JoinCTA() {
  const [state, formAction] = useActionState(handleNewsletterSignup, {
    message: '',
  });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.error ? 'Error' : 'Success',
        description: state.message,
        variant: state.error ? 'destructive' : 'default',
      });
      if (!state.error) {
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  return (
    <SectionWrapper id="join">
      <div className="max-w-6xl mx-auto text-center">
        <FlameIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 animate-pulse" />
        <h2 className="text-3xl md:text-4xl font-headline font-bold">
          Claim Your Place in the Realm
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-muted-foreground text-base md:text-lg">
          Join our Discord to connect with the community, or sign up for our
          newsletter for exclusive updates.
        </p>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-3 bg-card/50 border border-border/50 rounded-2xl p-6 md:p-12 shadow-lg backdrop-blur-md h-full flex flex-col justify-center">
            <h3 className="text-2xl md:text-3xl font-headline font-bold mb-4">
              Stay Informed
            </h3>
            <p className="text-muted-foreground mb-6">
              Sign up for early access to our upcoming apps and get exclusive
              news and updates from the High Council.
            </p>
            <form ref={formRef} action={formAction} className="w-full">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                  className="flex-grow text-base"
                />
                <SubmitButton />
              </div>
            </form>
          </div>
          <DiscordWidget />
        </div>
      </div>
    </SectionWrapper>
  );
}

    