
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FlameIcon } from '@/components/flame-icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import type { SessionUser } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { handleLogout } from '@/lib/auth-actions';

const navLinks = [
  { href: '/#ecosystem', label: 'Ecosystem' },
  { href: '/partnerships', label: 'Partners' },
  { href: '/#community', label: 'Community' },
  { href: '/lore', label: 'Lore' },
  { href: '/#events', label: 'Events' },
  { href: '/#donate', label: 'Donate' },
];

function UserNav({ session }: { session: SessionUser }) {
  if (!session) return null;

  const avatarUrl = session.avatar
    ? `https://cdn.discordapp.com/avatars/${session.id}/${session.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(session.discriminator) % 5}.png`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatarUrl} alt={session.username} />
            <AvatarFallback>{session.username.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              #{session.discriminator}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/profile/${session.id}`}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleLogout()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header({ session }: { session: SessionUser | null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        'absolute md:sticky top-0 z-50 w-full transition-all duration-300 py-3'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-12 md:h-14 bg-background/80 backdrop-blur-lg border border-border/50 rounded-full px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <FlameIcon className="h-6 w-6 md:h-7 md:w-7" />
            <span className="text-lg md:text-xl font-headline font-bold hidden sm:inline-block">
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

          <div className="hidden md:flex items-center gap-2">
             <ThemeToggle />
            {session ? (
              <UserNav session={session} />
            ) : (
              <>
                <Button variant="ghost" asChild className="rounded-full">
                    <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="rounded-full">
                  <a
                    href="https://discord.gg/PruRXZ7zkF"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join the Realm
                  </a>
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
             <ThemeToggle />
             {session ? (
               <UserNav session={session} />
             ) : (
                <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="h-8 w-8 rounded-full"
                >
                {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                ) : (
                    <Menu className="h-5 w-5" />
                )}
                <span className="sr-only">Open menu</span>
                </Button>
             )}
              { !session && isMobileMenuOpen && (
                <div className="md:hidden absolute top-full right-0 mt-2 w-48">
                    <div className="bg-background/80 backdrop-blur-lg border border-border/50 rounded-2xl p-4">
                    <nav className="flex flex-col items-start gap-2">
                        {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-base font-medium text-foreground hover:text-primary transition-colors w-full p-2 rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                        ))}
                        <Link href="/login" className="text-base font-medium text-foreground hover:text-primary transition-colors w-full p-2 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
                            Login
                        </Link>
                    </nav>
                    <div className="mt-4 pt-4 border-t border-border/50">
                        <Button asChild className="w-full rounded-full">
                        <a
                            href="https://discord.gg/PruRXZ7zkF"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Join the Realm
                        </a>
                        </Button>
                    </div>
                    </div>
                </div>
                )
             }
          </div>
        </div>
      </div>
    </header>
  );
}
