
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { verifyLoginCode } from '@/app/actions';

export default function LoginPage() {
  const [uniqueCode, setUniqueCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Generate a unique code for the user to send to the bot
    const code = `dls-login-${Math.random().toString(36).substring(2, 8)}`;
    setUniqueCode(code);
    setIsLoading(false);
    // In a real app, we would store this code in the database with an expiry
    // and a 'pending' status, associated with the user's session.
    // For now, we'll handle this in a future step.
  }, []);

  const handleVerification = async () => {
    if (!uniqueCode) return;
    setIsVerifying(true);
    
    // This action will check if the bot has marked this code as verified
    const result = await verifyLoginCode(uniqueCode);

    if (result.success && result.userId) {
      // Store session, redirect to profile
      // This will be implemented in the next step.
      alert(`Login successful for user ID: ${result.userId}! Redirecting...`);
      router.push(`/profile/${result.userId}`);
    } else {
      alert(result.message);
    }

    setIsVerifying(false);
  };
  
  const botName = "Emberlyn"; // Or your bot's name

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Realm Authentication</CardTitle>
            <CardDescription>
              To log in, please send a Direct Message to our Discord bot with the following code.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-20">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Your unique login code:</p>
                <p className="text-2xl font-mono font-bold tracking-widest bg-background p-3 rounded-md">
                  {uniqueCode}
                </p>
              </div>
            )}
            <div>
                 <p className="text-sm text-muted-foreground">
                    Send this code as a DM to the <strong>{botName}</strong> bot on our Discord server.
                </p>
            </div>
            <Button onClick={handleVerification} disabled={isVerifying || isLoading} className="w-full">
              {isVerifying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</> : 'I Have Sent the Code'}
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
