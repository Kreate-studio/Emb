
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import Script from 'next/script';

const siteTitle = 'Sanctyr';
const siteDescription =
  'A realm for Gamers, Artists, and Creators - Shape the kingdom and your destiny.';

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: 'https://sanctyr.netlify.app', // Replace with your actual domain
    siteName: siteTitle,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558690281-0ab20ad67b8b?w=1200&h=630&fit=crop', // OG image size
        width: 1200,
        height: 630,
        alt: 'Floating ruins in a dark fantasy setting.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['https://images.unsplash.com/photo-1558690281-0ab20ad67b8b?w=1200&h=630&fit=crop'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <Script src='https://storage.ko-fi.com/cdn/scripts/overlay-widget.js' strategy="afterInteractive" />
        <Script id="kofi-widget" strategy="afterInteractive">
          {`
            kofiWidgetOverlay.draw('sanctyr', {
              'type': 'floating-chat',
              'floating-chat.donateButton.text': 'Support Us',
              'floating-chat.donateButton.background-color': '#f45d22',
              'floating-chat.donateButton.text-color': '#fff'
            });
          `}
        </Script>
      </body>
    </html>
  );
}
