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
import type { Event } from '@/lib/discord-service';
import { X, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Badge } from './ui/badge';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

export function EventModal({ isOpen, onClose, event }: EventModalProps) {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-2xl w-[90vw]">
        <DialogHeader>
          {event.imageUrl && (
            <div className="w-full aspect-video overflow-hidden rounded-t-lg -mt-6">
                <Image
                    src={event.imageUrl}
                    alt={event.title}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                />
            </div>
          )}
          <div className='p-6 text-left'>
            <Badge variant="secondary" className="mb-2 w-fit">
                {event.category}
            </Badge>
            <DialogTitle className="text-2xl font-headline mb-2">
                {event.title}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground whitespace-pre-wrap max-h-[40vh] overflow-y-auto">
                {event.description}
            </DialogDescription>
          </div>
        </DialogHeader>

        {event.readMoreLink && (
            <div className="px-6 pb-6">
                 <Button asChild className="w-full">
                    <a href={event.readMoreLink} target="_blank" rel="noopener noreferrer">
                        Learn More <ExternalLink className='ml-2' />
                    </a>
                </Button>
            </div>
        )}

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

    