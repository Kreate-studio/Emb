
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
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
import { useRouter, useSearchParams } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Verifying...' : 'Verify Code'}
    </Button>
  );
}

// Dummy action for now
async function handleVerifyOtp(prevState: any, formData: FormData) {
    await new Promise(res => setTimeout(res, 1000));
    console.log(formData.get('otp'));
    console.log(formData.get('discordId'));
    const otp = formData.get('otp');
    if (otp === '123456') {
        return { message: 'Successfully verified!', success: true };
    }
    return { message: 'Invalid OTP. Please try again.', error: true };
}


export default function VerifyPage() {
  const [state, formAction] = useActionState(handleVerifyOtp, { message: '' });
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const discordId = searchParams.get('id');

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.error ? 'Error' : 'Success!',
        description: state.message,
        variant: state.error ? 'destructive' : 'default',
      });
       if (state.success) {
        // On successful verification, redirect to profile or home
        router.push('/');
      }
    }
  }, [state, toast, router]);
  
  if (!discordId) {
      // Handle case where discordId is missing
      return (
           <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-1 flex items-center justify-center p-4">
                 <Card className="w-full max-w-sm text-center">
                     <CardHeader>
                        <CardTitle>Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-muted-foreground'>No user ID provided. Please return to the login page.</p>
                         <Button onClick={() => router.push('/login')} className='mt-4'>Go to Login</Button>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
      )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Verify Your Identity</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to your Discord DMs to complete the login process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
               <input type="hidden" name="discordId" value={discordId} />
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  name="otp"
                  placeholder="e.g., 123456"
                  required
                  pattern="\d{6}"
                  title="Enter the 6-digit code."
                />
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
