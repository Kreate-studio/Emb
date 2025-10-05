
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Briefcase, Calendar, Coins, Package, PiggyBank, Swords, Shield, Scroll, Gem, Fish, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { LucideIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { handleEconomyAction } from '@/app/actions';
import type { DiscordMember, GuildRole } from '@/lib/discord-service';
import type { SessionUser } from '@/lib/auth';
import type { EconomyProfile } from '@/lib/economy-service';


function intToHex(int: number | undefined) {
    if (int === undefined || int === null || int === 0) return '#99aab5'; // Default Discord grey
    return '#' + int.toString(16).padStart(6, '0');
}

function ProfileError({ message }: { message: string }) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h2 className="text-2xl font-bold mb-2">Could Not Load Profile</h2>
            <p className="text-muted-foreground">{message}</p>
            </div>
        </div>
    )
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) {
    return (
        <div className="bg-secondary/50 rounded-lg p-4 flex items-center gap-4">
            <Icon className="w-8 h-8 text-primary" />
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-xl font-bold">{value}</p>
            </div>
        </div>
    )
}

const itemIconMap: Record<string, LucideIcon> = {
    'sword': Swords,
    'shield': Shield,
    'scroll': Scroll,
    'gem': Gem,
    'fish': Fish,
    'rod': Fish,
    'food': Apple,
    'apple': Apple,
    'potion': Apple,
};

function getItemIcon(itemName: string): LucideIcon {
    const lowerCaseName = itemName.toLowerCase();
    for (const key in itemIconMap) {
        if (lowerCaseName.includes(key)) {
            return itemIconMap[key];
        }
    }
    return Package;
}

function CommandButton({ command, userId, children, variant = 'default' }: { command: string, userId: string, children: React.ReactNode, variant?: "default" | "secondary" }) {
    const { toast } = useToast();
    const [state, formAction, isPending] = useActionState(handleEconomyAction, { message: '', success: false, error: false });
    
    useEffect(() => {
        if (state.message) {
            toast({
                title: state.error ? 'Action Failed' : 'Action Successful',
                description: state.message,
                variant: state.error ? 'destructive' : 'default',
            });
        }
    }, [state, toast]);

    return (
        <form action={formAction}>
            <input type="hidden" name="command" value={command} />
            <input type="hidden" name="userId" value={userId} />
            <Button type="submit" disabled={isPending} className="w-full" variant={variant}>
                {isPending ? 'Running...' : children}
            </Button>
        </form>
    );
}

interface ProfileContentProps {
  session: SessionUser | null;
  member: DiscordMember | null;
  userRoles: GuildRole[] | null;
  economyProfile: EconomyProfile | null;
  economyError: string | null;
  pageError: string | null;
}

export function ProfileContent({ session, member, userRoles, economyProfile, economyError, pageError }: ProfileContentProps) {
    
    if (pageError || !member || !userRoles) {
        return <ProfileError message={pageError || "An unknown error occurred."} />;
    }

    const bannerColor = userRoles.length > 0 ? intToHex(userRoles[0].color) : 'hsl(var(--primary))';
    const isOwnProfile = session?.id === member.user.id;

    return (
        <>
            <div className="w-full h-48" style={{ backgroundColor: bannerColor }} />
            <div className="container mx-auto px-4 -mt-24 pb-12">
                 <Card className="overflow-visible">
                    <CardHeader className="flex flex-col md:flex-row items-center gap-6 border-b p-6">
                        <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary -mt-16 md:-mt-8">
                            <AvatarImage src={member.avatarUrl} alt={member.displayName} />
                            <AvatarFallback>{member.displayName?.charAt(0) || member.user.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className='text-center md:text-left'>
                            <h1 className="text-3xl font-bold font-headline">{member.displayName}</h1>
                            <p className="text-muted-foreground">@{member.user.username}</p>
                            {userRoles.length > 0 ? (
                                <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                                    {userRoles.map(role => (
                                        <Badge 
                                            key={role.id}
                                            className="border"
                                            style={{ 
                                                backgroundColor: `${intToHex(role.color)}20`,
                                                borderColor: intToHex(role.color),
                                                color: intToHex(role.color)
                                            }}
                                        >
                                            {role.name}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground mt-2">No roles to display.</p>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                         <TooltipProvider>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-1 flex flex-col gap-4">
                                    <h3 className="font-headline text-xl font-bold">Economy Profile</h3>
                                    {economyError ? (
                                        <div className="bg-destructive/20 border border-destructive/50 rounded-lg p-4 text-center">
                                            <AlertTriangle className="mx-auto h-8 w-8 text-destructive mb-2"/>
                                            <p className="text-sm font-semibold text-destructive-foreground">Could not load economy data</p>
                                            <p className="text-xs text-muted-foreground">{economyError}</p>
                                        </div>
                                    ) : (
                                        <>
                                            <StatCard icon={Coins} label="Wallet" value={economyProfile?.wallet.toLocaleString() ?? 'N/A'} />
                                            <StatCard icon={PiggyBank} label="Bank" value={economyProfile?.bank.toLocaleString() ?? 'N/A'} />
                                        </>
                                    )}
                                    {isOwnProfile && (
                                        <>
                                            <Separator />
                                            <h3 className="font-headline text-xl font-bold">Common Actions</h3>
                                            <div className="flex flex-col gap-2">
                                                <CommandButton command="work" userId={member.user.id}>
                                                    <Briefcase className="mr-2" /> Work
                                                </CommandButton>
                                                <CommandButton command="daily" userId={member.user.id} variant="secondary">
                                                    <Calendar className="mr-2" /> Daily
                                                </CommandButton>
                                                <CommandButton command="weekly" userId={member.user.id} variant="secondary">
                                                    <Calendar className="mr-2" /> Weekly
                                                </CommandButton>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="lg:col-span-2">
                                    <h3 className="font-headline text-xl font-bold mb-4">Inventory</h3>
                                    <div className="border-2 border-dashed rounded-lg p-6 min-h-48 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                        {economyProfile?.inventory && economyProfile.inventory.length > 0 ? (
                                            economyProfile.inventory.map((item, index) => {
                                                const Icon = getItemIcon(item.name);
                                                return (
                                                <Tooltip key={index}>
                                                    <TooltipTrigger asChild>
                                                        <div className="aspect-square bg-secondary rounded-md flex flex-col items-center justify-center p-2 text-center group relative cursor-help">
                                                            <Icon className="h-8 w-8 text-muted-foreground"/>
                                                            <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-tl-md rounded-br-md">
                                                                {item.quantity}
                                                            </div>
                                                        </div>
                                                    </TooltipTrigger>
                                                     <TooltipContent>
                                                        <p className='font-bold'>{item.name}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )})
                                        ) : economyError ? (
                                             <div className="col-span-full flex flex-col items-center justify-center text-muted-foreground">
                                                <AlertTriangle className="h-10 w-10 mb-2 text-destructive"/>
                                                <p>Could not load inventory</p>
                                            </div>
                                        ) : (
                                            <div className="col-span-full flex flex-col items-center justify-center text-muted-foreground">
                                                <Package className="h-10 w-10 mb-2"/>
                                                <p>Inventory is empty</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                         </TooltipProvider>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
