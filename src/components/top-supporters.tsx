
import { getMembersWithRole } from '@/lib/discord-service';
import { AlertTriangle } from 'lucide-react';
import React from 'react';
import { TopSupportersCarousel } from './top-supporters-carousel';


export async function TopSupporters() {
  const { members, error } = await getMembersWithRole("D'Kingdom Supporter");

  if (error || !members || members.length === 0) {
    return (
      <div className="mt-12">
        <h3 className="text-lg md:text-xl font-headline font-bold mb-4">
          Our Exalted Patrons
        </h3>
        <div className="flex flex-col items-center justify-center bg-card/50 border-border/50 rounded-lg p-8 min-h-40 text-center">
          <AlertTriangle className="w-8 h-8 text-muted-foreground mb-2" />
          <h4 className="font-semibold text-md">Patrons Not Found</h4>
          <p className="text-muted-foreground text-sm">{error || "Could not load our exalted patrons at this time."}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-12">
      <h3 className="text-lg md:text-xl font-headline font-bold mb-4">
        Our Exalted Patrons
      </h3>
       <TopSupportersCarousel members={members} />
    </div>
  );
}
