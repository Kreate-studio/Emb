
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { handleDiscordLogin } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Sending...' : 'Login with Discord'}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(handleDiscordLogin, { message: '' });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.error ? 'Error' : 'OTP Sent!',
        description: state.message,
        variant: state.error ? 'destructive' : 'default',
      });
      // We don't reset the form here, in case the user needs to retry
    }
  }, [state, toast]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Realm Authentication</CardTitle>
            <CardDescription>
              Enter your Discord User ID to receive a login code via DM from our bot.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} ref={formRef} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="discord-id">Discord User ID</Label>
                <Input
                  id="discord-id"
                  name="discordId"
                  placeholder="e.g., 838092589344489532"
                  required
                  pattern="\d{17,19}"
                  title="Your Discord User ID should be a 17-19 digit number."
                />
                 <p className="text-xs text-muted-foreground pt-1">
                    Not sure how to find your ID? Check out this {' '}
                    <Link href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID" target='_blank' rel="noopener noreferrer" className='underline hover:text-primary'>
                        Discord guide
                    </Link>.
                 </p>
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
