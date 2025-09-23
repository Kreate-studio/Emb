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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Joining...' : 'Join the Waitlist'}
    </Button>
  );
}

export function JoinCTA() {
  const [state, formAction] = useActionState(handleNewsletterSignup, { message: '' });
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
      <div className="max-w-4xl mx-auto text-center bg-card/50 border border-border/50 rounded-2xl p-8 md:p-12 shadow-lg backdrop-blur-md">
        <FlameIcon className="w-16 h-16 mx-auto mb-4 animate-pulse" />
        <h2 className="text-3xl md:text-4xl font-headline font-bold">
          Claim Your Place in the Realm
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Sign up for early access to our upcoming apps and get exclusive news
          and updates from the High Council.
        </p>
        <form
          ref={formRef}
          action={formAction}
          className="mt-8 max-w-lg mx-auto"
        >
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
    </SectionWrapper>
  );
}
