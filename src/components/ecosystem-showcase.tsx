import {
  Bot,
  Brush,
  Gamepad2,
  Library,
  Music,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SectionWrapper from './section-wrapper';

const ecosystemItems = [
  {
    icon: Bot,
    title: 'Emberlyn Bot',
    description:
      'A versatile Discord bot to manage your community and enhance engagement.',
    comingSoon: false,
  },
  {
    icon: Brush,
    title: 'Artist Hub',
    description:
      'A dedicated space for artists to showcase their work, find inspiration, and collaborate.',
    comingSoon: true,
  },
  {
    icon: Gamepad2,
    title: 'Gaming Hub',
    description:
      'Organize tournaments, track stats, and connect with fellow gamers.',
    comingSoon: true,
  },
  {
    icon: Music,
    title: 'Music Hub',
    description:
      'Share your compositions, discover new music, and collaborate on projects.',
    comingSoon: true,
  },
  {
    icon: Library,
    title: 'Anime/Fandom Hub',
    description:
      'A central place for all things anime and fandom, from discussions to fan art.',
    comingSoon: true,
  },
  {
    icon: ShieldCheck,
    title: 'Warden Tools',
    description:
      'Advanced moderation and security tools to protect your community.',
    comingSoon: false,
  },
];

export function EcosystemShowcase() {
  return (
    <SectionWrapper id="ecosystem">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-headline font-bold">
          Explore the Ecosystem
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Discover the apps, bots, and tools that power the D’Last Sanctuary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ecosystemItems.map((item, index) => (
          <Card
            key={index}
            className="group bg-card/50 border-border/50 hover:border-primary/50 hover:bg-card transition-all duration-300 transform hover:-translate-y-2"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold font-headline">
                {item.title}
              </CardTitle>
              <item.icon className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{item.description}</p>
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
