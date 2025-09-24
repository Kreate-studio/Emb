'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import type { EcosystemItem } from '@/lib/site-data';
import { X } from 'lucide-react';

interface HubModalProps {
  isOpen: boolean;
  onClose: () => void;
  hub: EcosystemItem | null;
}

export function HubModal({ isOpen, onClose, hub }: HubModalProps) {
  if (!hub) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <hub.icon className="h-10 w-10 text-primary" />
            <div>
              <DialogTitle className="text-2xl font-headline">
                {hub.title}
              </DialogTitle>
              {hub.comingSoon && (
                <span className="text-xs text-accent font-semibold">
                  (Coming Soon)
                </span>
              )}
            </div>
          </div>
          <DialogDescription className="text-base text-left">
            {hub.modalContent?.description || hub.description}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
          {hub.title === 'Emberlyn Bot' ? (
            <Button asChild className="w-full">
              <a href="https://discord.com/oauth2/authorize?client_id=1411335886121205822&permissions=8&integration_type=0&scope=bot" target="_blank" rel="noopener noreferrer">Invite Emberlyn to Your Server</a>
            </Button>
          ) : hub.comingSoon ? (
             <p className="text-center text-muted-foreground italic">
              This hub is under construction. Stay tuned for future updates!
            </p>
          ) : (
            <div className="text-center text-muted-foreground">
                <p className='font-bold text-lg'>Tools & Features:</p>
                <ul className='list-disc list-inside text-left mt-2'>
                    {hub.modalContent?.features?.map(feature => (
                        <li key={feature}>{feature}</li>
                    ))}
                </ul>
            </div>
          )}
        </div>
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
