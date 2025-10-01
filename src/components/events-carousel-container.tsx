import { getEventsFromChannel } from '@/lib/discord-service';
import { AlertTriangle } from 'lucide-react';
import SectionWrapper from './section-wrapper';
import { EventsCarousel } from './events-carousel';


export default async function EventsCarouselContainer() {
  const { events, error } = await getEventsFromChannel();

  return (
     <SectionWrapper id="events" className="bg-secondary/20">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-headline font-bold">
          Events & News
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground">
          Stay updated with the latest happenings in the D’Last Sanctuary.
        </p>
      </div>
       {error || !events || events.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-card/50 border-border/50 rounded-lg p-8 min-h-48 text-center max-w-4xl mx-auto">
          <AlertTriangle className="w-10 h-10 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg">Could Not Load Events</h3>
          <p className="text-muted-foreground text-sm">{error || "No events found in the channel."}</p>
        </div>
      ) : (
        <EventsCarousel events={events} />
      )}
    </SectionWrapper>
  )
}
