'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { handleNewsletterSignup } from '@/app/actions';
import SectionWrapper from './section-wrapper';
import { useToast } from '@/hooks/use-toast';
import { FlameIcon } from './flame-icon';
import { DiscordWidget } from './discord-widget';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Joining...' : 'Join the Waitlist'}
    </Button>
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
