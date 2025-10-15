
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getSession } from '@/lib/auth-actions';
import SectionWrapper from '@/components/section-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Award, Handshake } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const tiers = [
  {
    name: 'Tier 1: Standard Partner',
    icon: Handshake,
    audience: 'Servers seeking mutual promotion.',
    perks: [
      'Co-branded mini-events and competitions.',
      'Logo / brand presence on our Discord and website.',
      'Rotating announcements or mentions in our channels.',
      'Limited bot-assisted features for collaborative events.',
      'Summary reports of event participation and engagement.',
    ],
    requests: [
      'Optional promotion of Sanctyr to your members.',
      'Temporary access for cross-server events or collaborations.',
    ],
    badge: 'Standard'
  },
  {
    name: 'Tier 2: Network Partner',
    icon: Users,
    audience: 'Servers that actively reward members and want to collaborate on events.',
    perks: [
      'Member recognition for top contributors through bots or events.',
      'Dedicated guild / partner channels for direct interaction.',
      'Co-branded seasonal events integrated into our lore.',
      'Custom creative support: designs, videos, 3D assets, or mini-bots.',
      'Promotion across our partner network and on our website.',
    ],
    requests: [
      'Custom Queen role for our server in yours.',
      'Sanctyrian role for our members in your server.',
      'Promotion of Sanctyr in announcements or events.',
      'Optional support for seasonal rewards (Nitro, small perks).',
    ],
    badge: 'Network'
  },
  {
    name: 'Tier 3: Strategic Partner',
    icon: Award,
    audience: 'Servers or brands investing resources like money, Nitro, or active member support.',
    perks: [
      'Full custom bot and website integration.',
      'Permanent lore integration: your server becomes part of Sanctyr’s story.',
      'Advisory access to events, guild mechanics, and recognition systems.',
      'Exclusive event hosting with full creative support.',
      'Priority access to our top contributors for collaboration or recruitment.',
      'Promotion across our full network of partner servers.',
    ],
    requests: [
      'Prominent Queen and Sanctyrian roles in your server.',
      'Promotion of Sanctyr across your announcements and network.',
      'Support for seasonal events: prizes, Nitro, or small perks.',
      'Priority access for our members to your server events or channels.',
    ],
    badge: 'Strategic'
  }
];

const whyPartner = [
    'Access to a curated, highly active community of creators and contributors.',
    'Network promotion across multiple curated servers.',
    'Custom creative and technical support (bots, design, videos, 3D assets).',
    'Opportunities for collaboration, events, and member recognition.',
    'Prestige and visibility within a limited, exclusive ecosystem.',
];

export default async function PartnershipsPage() {
  const session = await getSession();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header session={session} />
      <main className="flex-1">
        <SectionWrapper>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-headline font-bold">
              Partner with Sanctyr
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground">
              Sanctyr is an exclusive creative community for artists, gamers, writers, musicians, and anime enthusiasts. We are building a **network of curated servers** and are looking for partners who want to collaborate, gain exposure, and provide value to their members while benefiting from our unique ecosystem.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <Card key={tier.name} className="flex flex-col bg-card/50 border-border/50 shadow-lg">
                <CardHeader>
                    <div className='flex justify-between items-center'>
                        <tier.icon className="w-10 h-10 text-primary" />
                        <Badge variant="outline">{tier.badge}</Badge>
                    </div>
                  <CardTitle className="text-2xl font-headline pt-4">{tier.name}</CardTitle>
                  <CardDescription>{tier.audience}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold mb-2">Perks for your server:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                      {tier.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                    <Separator className="my-4" />
                    <h4 className="font-semibold mb-2">What we request:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {tier.requests.map((request, i) => (
                         <li key={i} className="flex items-start gap-2">
                          <Handshake className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                          <span>{request}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

           <div className="mt-20 max-w-4xl mx-auto">
             <Card className="bg-card/50 border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-headline text-center">Why Partner with Sanctyr?</CardTitle>
                </CardHeader>
                <CardContent>
                     <ul className="space-y-3 text-base text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                      {whyPartner.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                </CardContent>
             </Card>
           </div>
        </SectionWrapper>
      </main>
      <Footer />
    </div>
  );
}
