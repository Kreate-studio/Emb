'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { handleNewsletterSignup } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { DiscordWidget } from './discord-widget';
import type { getGuildWidget } from '@/lib/discord-service';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Joining...' : 'Join the Waitlist'}
    </Button>
  );
}

export function JoinCTAContent({ widgetData }: { widgetData: Awaited<ReturnType<typeof getGuildWidget>> }) {
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
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
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
        <DiscordWidget initialData={widgetData.widget} error={widgetData.error} />
    </div>
  );
}
