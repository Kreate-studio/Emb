'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FlameIcon } from '@/components/flame-icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#ecosystem', label: 'Ecosystem' },
  { href: '#partnerships', label: 'Partners' },
  { href: '#community', label: 'Community' },
  { href: '#lore', label: 'Lore' },
  { href: '#events', label: 'Events' },
  { href: '#donate', label: 'Donate' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300 py-4'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 bg-background/80 backdrop-blur-lg border border-border/50 rounded-full px-6">
          <Link href="/" className="flex items-center gap-2">
            <FlameIcon className="h-8 w-8" />
            <span className="text-xl font-headline font-bold hidden sm:inline-block">
              Sanctyr
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button asChild>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join the Realm
              </a>
            </Button>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2">
            <div className="bg-background/80 backdrop-blur-lg border border-border/50 rounded-2xl p-4">
              <nav className="flex flex-col items-start gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors w-full p-2 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t border-border/50">
                <Button asChild className="w-full">
                  <a
                    href="https://discord.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join the Realm
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
