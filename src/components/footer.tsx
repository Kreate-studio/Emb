'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FlameIcon } from './flame-icon';
import { Button } from './ui/button';
import { Twitter, Youtube } from 'lucide-react';

const socialLinks = [
  {
    name: 'Discord',
    icon: (
      <svg
        className="h-5 w-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M20.317 4.3698a19.7913 19.7913 0 0 0 -4.9585 -1.5432c-.3726.4528 -1.0371 1.5227 -1.2584 1.8414a17.2963 17.2963 0 0 0 -3.1804 0c-.2213-.3186 -.8858-1.3886 -1.2584-1.8414a19.7913 19.7913 0 0 0 -4.9585 1.5432c-1.422 4.6936 -1.422 9.5312 0 14.2248a19.9218 19.9218 0 0 0 5.8648 2.016c.3726-.4528.9945-1.4497 1.217-1.7883a15.6113 15.6113 0 0 0 2.9582 0c.2224.3386.8443 1.3355 1.217 1.7883a19.9218 19.9218 0 0 0 5.8648-2.016c1.422-4.6936 1.422-9.5312 0-14.2248zm-11.3634 9.8336c-1.3431 0 -2.431-1.229 -2.431-2.742s1.0879-2.742 2.431-2.742c1.343 0 2.431 1.229 2.431 2.742s-1.088 2.742-2.431 2.742zm8.0934 0c-1.3431 0 -2.431-1.229 -2.431-2.742s1.0879-2.742 2.431-2.742c1.343 0 2.431 1.229 2.431 2.742s-1.088 2.742-2.431 2.742z" />
      </svg>
    ),
    href: 'https://discord.gg/PruRXZ7zkF',
  },
  { name: 'Twitter', icon: <Twitter className="h-5 w-5" />, href: '#' },
  { name: 'YouTube', icon: <Youtube className="h-5 w-5" />, href: '#' },
];

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-secondary/20 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <FlameIcon className="h-7 w-7" />
              <span className="text-lg font-headline font-bold">
                Sanctyr
              </span>
            </Link>
            <p className="max-w-xs text-muted-foreground italic text-sm md:text-base">
              "From embers, a kingdom shall rise."
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center lg:text-left">
            <div>
              <h3 className="font-headline font-semibold text-foreground text-base md:text-lg">
                Ecosystem
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="#ecosystem"
                    className="text-sm text-muted-foreground hover:text-primary transition"
                  >
                    Emberlyn Bot
                  </Link>
                </li>
                <li>
                  <Link
                    href="#ecosystem"
                    className="text-sm text-muted-foreground hover:text-primary transition"
                  >
                    Artist Hub
                  </Link>
                </li>
                <li>
                  <Link
                    href="#ecosystem"
                    className="text-sm text-muted-foreground hover:text-primary transition"
                  >
                    Gaming Hub
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-semibold text-foreground text-base md:text-lg">
                Community
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="#community"
                    className="text-sm text-muted-foreground hover:text-primary transition"
                  >
                    Showcase
                  </Link>
                </li>
                <li>
                  <Link
                    href="#events"
                    className="text-sm text-muted-foreground hover:text-primary transition"
                  >
                    Events
                  </Link>
                </li>
              </ul>
            </div>
             <div>
              <h3 className="font-headline font-semibold text-foreground text-base md:text-lg">
                Legal
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center lg:items-end">
            <h3 className="font-headline font-semibold text-foreground text-base md:text-lg">
              Follow the Flame
            </h3>
            <div className="flex mt-4 space-x-4">
              {socialLinks.map((social) => (
                <Button key={social.name} variant="ghost" size="icon" asChild>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>
            &copy; {currentYear || new Date().getFullYear()} D’Last Sanctuary. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
