
'use client';

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

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
     <path d="M20.317 4.3698a19.7913 19.7913 0 0 0 -4.9585 -1.5432c-.3726.4528 -1.0371 1.5227 -1.2584 1.8414a17.2963 17.2963 0 0 0 -3.1804 0c-.2213-.3186 -.8858-1.3886 -1.2584-1.8414a19.7913 19.7913 0 0 0 -4.9585 1.5432c-1.422 4.6936 -1.422 9.5312 0 14.2248a19.9218 19.9218 0 0 0 5.8648 2.016c.3726-.4528.9945-1.4497 1.217-1.7883a15.6113 15.6113 0 0 0 2.9582 0c.2224.3386.8443 1.3355 1.217 1.7883a19.9218 19.9218 0 0 0 5.8648-2.016c1.422-4.6936 1.422-9.5312 0-14.2248zm-11.3634 9.8336c-1.3431 0 -2.431-1.229 -2.431-2.742s1.0879-2.742 2.431-2.742c1.343 0 2.431 1.229 2.431 2.742s-1.088 2.742-2.431 2.742zm8.0934 0c-1.3431 0 -2.431-1.229 -2.431-2.742s1.0879-2.742 2.431-2.742c1.343 0 2.431 1.229 2.431 2.742s-1.088 2.742-2.431 2.742z" />
   </svg>
);


export default function LoginPage() {

  const handleLogin = () => {
    // In the next step, we will implement the redirect to Discord's OAuth2 URL.
    alert("The next step is to configure Discord OAuth and redirect the user.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Realm Authentication</CardTitle>
            <CardDescription>
              Connect your Discord account to log in or create an account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button onClick={handleLogin} className="w-full" size="lg">
              <DiscordIcon className="h-6 w-6 mr-2" />
              Login with Discord
            </Button>
            <p className="text-xs text-muted-foreground">
                By logging in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
