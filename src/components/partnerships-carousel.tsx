
'use client';
import Image from 'next/image';
import React, {useRef, useEffect, useActionState, useState} from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SectionWrapper from './section-wrapper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { handlePartnershipRequest } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useFormStatus } from 'react-dom';
import type { Partner } from '@/lib/discord-service';
import { getPartnersFromChannel } from '@/lib/discord-service';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Submitting...' : 'Submit Partnership Request'}
    </Button>
  );
}


function PartnershipsCarouselContent({ partners, error }: { partners: Partner[] | null, error: string | null }) {
  const plugin = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  if (error || !partners || partners.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-card/50 border-border/50 rounded-lg p-8 min-h-48 text-center">
        <AlertTriangle className="w-10 h-10 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg">Could Not Load Partners</h3>
        <p className="text-muted-foreground text-sm">{error || "No partners found in the channel."}</p>
      </div>
    );
  }

  return (
    <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full max-w-6xl mx-auto"
      >
        <CarouselContent>
          {partners.map((partner, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 sm:basis-1/3 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <div className="p-1">
                <Card className="overflow-hidden group">
                  <CardContent className="flex flex-col items-center p-0 relative">
                    {partner.tags && (
                      <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
                        {partner.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs backdrop-blur-sm bg-black/30"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {partner.imageUrl && (
                      <div className="w-full aspect-[3/4] overflow-hidden">
                        <Image
                          src={partner.imageUrl}
                          alt={partner.name}
                          width={600}
                          height={800}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                    <div className="absolute bottom-0 p-3 md:p-4 w-full text-center">
                      <h3 className="text-base md:text-xl font-bold font-headline text-white">
                        {partner.name}
                      </h3>
                      <Button
                        asChild
                        className="mt-2 md:mt-4"
                        size="sm"
                        variant="secondary"
                      >
                        <a
                          href={partner.joinLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Join Server
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
  )
}

export function PartnershipsCarousel() {
  const [state, formAction] = useActionState(handlePartnershipRequest, { message: '' });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [partnersData, setPartnersData] = useState<{ partners: Partner[] | null, error: string | null }>({ partners: null, error: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPartners() {
      setIsLoading(true);
      const data = await getPartnersFromChannel();
      setPartnersData(data);
      setIsLoading(false);
    }
    loadPartners();
  }, []);


  useEffect(() => {
    if (state.message) {
      toast({
        title: state.error ? 'Error' : 'Success',
        description: state.message,
        variant: state.error ? 'destructive' : 'default',
      });
      if (state.success) {
        formRef.current?.reset();
      }
    }
  }, [state, toast]);


  return (
    <SectionWrapper id="partnerships">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-headline font-bold">
          Our Valued Partners
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground">
          Realms and communities we are proud to be allied with.
        </p>
      </div>

      {isLoading ? (
         <div className="flex items-center justify-center min-h-48">
            <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin" />
         </div>
      ) : (
        <PartnershipsCarouselContent partners={partnersData.partners} error={partnersData.error} />
      )}


      <Card className="mt-12 max-w-2xl mx-auto bg-card/50 border-border/50 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle>Partner With Us</CardTitle>
          <CardDescription>
            Interested in joining our network? Review our partnership tiers and submit a request.
          </CardDescription>
           <div className='pt-4'>
             <Button asChild>
                <Link href="/partnerships">Learn More About Tiers</Link>
            </Button>
           </div>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="partnership-tier">Partnership Tier</Label>
              <Select name="partnership-tier" required>
                  <SelectTrigger>
                      <SelectValue placeholder="Select a tier" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="Tier 1: Standard">Tier 1: Standard Partner</SelectItem>
                      <SelectItem value="Tier 2: Network">Tier 2: Network Partner</SelectItem>
                      <SelectItem value="Tier 3: Strategic">Tier 3: Strategic Partner</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="server-name">Server Name</Label>
              <Input id="server-name" name="server-name" placeholder="Your community's name" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="discord-username">Your Discord Username</Label>
              <Input id="discord-username" name="discord-username" placeholder="e.g. username or @username" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="server-link">Discord Invite Link</Label>
              <Input id="server-link" name="server-link" placeholder="https://discord.gg/your-invite" required />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </SectionWrapper>
  );
}
