
import { getMembersWithRole } from '@/lib/discord-service';
import { AlertTriangle, Crown } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

function intToHex(int: number | undefined) {
    if (int === undefined || int === null || int === 0) return '#FFFFFF'; // Default to white
    return '#' + int.toString(16).padStart(6, '0');
}


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
       <Carousel
        opts={{
          align: 'start',
          loop: members.length > 5, // Only loop if there are enough items to scroll
        }}
        className="w-full max-w-4xl mx-auto"
      >
        <CarouselContent className="-ml-4">
          {members.map((member) => {
            const roleColor = intToHex(member.highestRole?.color);
            const cardStyle = {
                borderColor: roleColor,
                boxShadow: `0 0 15px ${roleColor}60`,
            };

            return (
              <CarouselItem key={member.user.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                <div 
                    className="p-4 bg-card/50 backdrop-blur-md rounded-lg flex flex-col items-center text-center border-2"
                    style={cardStyle}
                >
                    <Avatar className="h-24 w-24 mx-auto border-4" style={{ borderColor: roleColor }}>
                        <AvatarImage src={member.avatarUrl} alt={member.displayName} />
                        <AvatarFallback>{member.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="mt-2">
                        <p className="font-bold text-sm truncate" style={{ color: roleColor }}>
                            {member.displayName}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                            <Crown className='w-3 h-3 text-yellow-400' />
                            Exalted Patron
                        </p>
                    </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}



