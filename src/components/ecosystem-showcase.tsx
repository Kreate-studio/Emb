import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SectionWrapper from './section-wrapper';
import { ecosystemItems } from '@/lib/site-data';

export function EcosystemShowcase() {
  return (
    <SectionWrapper id="ecosystem" className="bg-secondary/20">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-headline font-bold">
          Explore the Ecosystem
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground">
          Discover the apps, bots, and tools that power the D’Last Sanctuary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {ecosystemItems.map((item, index) => (
          <Card
            key={index}
            className="group bg-card/50 border-border/50 hover:border-primary/50 hover:bg-card transition-all duration-300 transform hover:-translate-y-2"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg md:text-xl font-bold font-headline">
                {item.title}
              </CardTitle>
              <item.icon className="h-7 w-7 md:h-8 md:w-8 text-primary group-hover:text-accent transition-colors" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm md:text-base">{item.description}</p>
              {item.comingSoon && (
                <Badge
                  variant="outline"
                  className="border-accent text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all"
                >
                  Coming Soon
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}
