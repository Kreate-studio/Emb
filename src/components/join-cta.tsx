'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { handleNewsletterSignup } from '@/app/actions';
import SectionWrapper from './section-wrapper';
import { useToast } from '@/hooks/use-toast';
import { FlameIcon } from './flame-icon';
import { JoinCTAContent } from './join-cta-content';
import type { getGuildWidget } from '@/lib/discord-service';

export function JoinCTA({ widgetData }: { widgetData: Awaited<ReturnType<typeof getGuildWidget>> | null }) {
  
  const safeWidgetData = widgetData || { widget: null, error: 'Widget data not available.' };

  return (
    <SectionWrapper id="join">
      <div className="max-w-6xl mx-auto text-center">
        <FlameIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 animate-pulse" />
        <h2 className="text-3xl md:text-4xl font-headline font-bold">
          Claim Your Place in the Realm
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-muted-foreground text-base md:text-lg">
          Join our Discord to connect with the community, or sign up for our
          newsletter for exclusive updates.
        </p>

        <div className="mt-8">
            <JoinCTAContent widgetData={safeWidgetData} />
        </div>
      </div>
    </SectionWrapper>
  );
}
