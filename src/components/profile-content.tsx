
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Briefcase, Calendar, Coins, PiggyBank, Swords, Shield, Scroll, Gem, Fish, Apple, Diamond, LandPlot, Share2, SquareArrowOutUpRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { LucideIcon } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { handleEconomyAction } from '@/app/actions';
import type { DiscordMember, GuildRole } from '@/lib/discord-service';
import type { SessionUser } from '@/lib/auth';
import type { EconomyProfile } from '@/lib/economy-service';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function intToHex(int: number | undefined) {
    if (int === undefined || int === null || int === 0) return '#99aab5';
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

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) {
    return (
        <div className="bg-secondary/50 rounded-lg p-3 flex items-center gap-3">
            <Icon className="w-6 h-6 text-primary" />
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-lg font-bold">{value}</p>
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

function CommandButton({ command, userId, children, variant = 'default', className }: { command: string, userId: string, children: React.ReactNode, variant?: "default" | "secondary", className?: string }) {
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
            <Button type="submit" disabled={isPending} className={className} variant={variant}>
                {isPending ? 'Running...' : children}
            </Button>
        </form>
    );
}

function TransferDialog({ sender, recipient }: { sender: SessionUser, recipient: DiscordMember }) {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();
    const [state, formAction, isPending] = useActionState(handleEconomyAction, { message: '', success: false, error: false });
     
    useEffect(() => {
        if (state.message) {
            toast({
                title: state.error ? 'Transfer Failed' : 'Transfer Successful',
                description: state.message,
                variant: state.error ? 'destructive' : 'default',
            });
            if (state.success) {
                setOpen(false);
                setAmount('');
            }
        }
    }, [state, toast]);

    const handleFormAction = (formData: FormData) => {
        const transferAmount = parseInt(amount, 10);
        if (isNaN(transferAmount) || transferAmount <= 0) {
             toast({ title: 'Invalid Amount', description: 'Please enter a valid positive number.', variant: 'destructive' });
             return;
        }
        
        formData.set('args', JSON.stringify([`<@${recipient.user.id}>`, amount]));
        formAction(formData);
    }
    
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="secondary" size="sm">
                    <LandPlot className="mr-2" /> Transfer
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <form action={handleFormAction} ref={formRef}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Transfer to {recipient.displayName}</AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter the amount you wish to transfer. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="my-4">
                        <Label htmlFor="amount" className="sr-only">Amount</Label>
                        <Input 
                            id="amount" 
                            name="amount" 
                            type="number"
                            placeholder="e.g. 100" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="1"
                            required 
                        />
                    </div>
                    <AlertDialogFooter>
                        <input type="hidden" name="command" value="transfer" />
                        <input type="hidden" name="userId" value={sender.id} />
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Transferring..." : "Confirm Transfer"}
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function ShareButton() {
    const { toast } = useToast();
    const handleShare = async () => {
        const shareData = {
            title: document.title,
            text: `Check out this profile on Sanctyr!`,
            url: window.location.href,
        };

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.error("Sharing failed", error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast({
                title: "Link Copied!",
                description: "Profile URL has been copied to your clipboard.",
            });
        }
    };
    return (
        <Button variant="secondary" size="sm" onClick={handleShare}>
            <Share2 className="mr-2" /> Share
        </Button>
    )
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
    const bannerImage = PlaceHolderImages.find((img) => img.id === 'lore-bg');

    if (pageError || !member) {
        return <ProfileError message={pageError || "An unknown error occurred."} />;
    }
    
    const safeUserRoles = userRoles || [];

    const accentColor = safeUserRoles.length > 0 ? intToHex(safeUserRoles[0].color) : 'hsl(var(--primary))';
    const isOwnProfile = session?.id === member.user.id;
    const joinedAt = member.joined_at ? new Date(member.joined_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

    return (
        <>
            <div className="relative w-full h-48 md:h-64">
                {bannerImage && (
                    <Image 
                        src={bannerImage.imageUrl}
                        alt="Profile banner"
                        fill
                        className="object-cover"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-black/50" />
            </div>
            <div className="container mx-auto px-4 -mt-24 pb-12">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 flex flex-col gap-6">
                         <Card className="overflow-visible text-center">
                            <CardContent className="p-6">
                                <Avatar className="w-32 h-32 border-4 border-background ring-4 mx-auto -mt-20 mb-4" style={{ ringColor: accentColor }}>
                                    <AvatarImage src={member.avatarUrl} alt={member.displayName} />
                                    <AvatarFallback>{member.displayName?.charAt(0) || member.user.username.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h1 className="text-3xl font-bold font-headline">{member.displayName}</h1>
                                <p className="text-muted-foreground">@{member.user.username}</p>
                                <p className="text-sm text-muted-foreground mt-2">Joined on {joinedAt}</p>
                                
                                <div className="flex flex-wrap gap-1 mt-4 justify-center">
                                    {safeUserRoles.slice(0, 5).map(role => (
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
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Economy</CardTitle>
                            </CardHeader>
                             <CardContent className="flex flex-col gap-4">
                                {economyError ? (
                                    <div className="bg-destructive/20 border border-destructive/50 rounded-lg p-4 text-center">
                                        <AlertTriangle className="mx-auto h-8 w-8 text-destructive mb-2"/>
                                        <p className="text-sm font-semibold text-destructive-foreground">Could not load economy data</p>
                                    </div>
                                ) : (
                                    <>
                                        <StatCard icon={Coins} label="Wallet" value={economyProfile?.wallet?.toLocaleString() ?? '0'} />
                                        <StatCard icon={PiggyBank} label="Bank" value={economyProfile?.bank?.toLocaleString() ?? '0'} />
                                        <StatCard icon={Diamond} label="Gold" value={economyProfile?.gold?.toLocaleString() ?? '0'} />
                                    </>
                                )}
                             </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <Card>
                             <CardHeader className="flex-row justify-between items-center">
                                <CardTitle>Actions</CardTitle>
                                <div className="flex gap-2">
                                     {session && !isOwnProfile && <TransferDialog sender={session} recipient={member} />}
                                    <ShareButton />
                                    <Button asChild variant="secondary" size="sm">
                                        <a href={`https://discord.com/users/${member.user.id}`} target="_blank" rel="noopener noreferrer">
                                            <SquareArrowOutUpRight className="mr-2" /> Discord
                                        </a>
                                    </Button>
                                </div>
                            </CardHeader>
                             <CardContent>
                                {isOwnProfile ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        <CommandButton command="work" userId={member.user.id} className="w-full">
                                            <Briefcase className="mr-2" /> Work
                                        </CommandButton>
                                        <CommandButton command="daily" userId={member.user.id} variant="secondary" className="w-full">
                                            <Calendar className="mr-2" /> Daily
                                        </CommandButton>
                                         <CommandButton command="weekly" userId={member.user.id} variant="secondary" className="w-full">
                                            <Calendar className="mr-2" /> Weekly
                                        </Button>
                                    </div>
                                ) : (
                                     <p className="text-sm text-muted-foreground text-center italic">This is not your profile. Actions are limited.</p>
                                )}
                             </CardContent>
                        </Card>
                         <Card>
                             <CardHeader>
                                <CardTitle>Inventory</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="border-2 border-dashed rounded-lg p-4 min-h-48 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                        {economyProfile?.inventory && economyProfile.inventory.length > 0 ? (
                                            economyProfile.inventory.map((item, index) => {
                                                const Icon = getItemIcon(item.name);
                                                return (
                                                <TooltipProvider key={index}>
                                                <Tooltip>
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
                                                </TooltipProvider>
                                            )})
                                        ) : economyError ? (
                                             <div className="col-span-full flex flex-col items-center justify-center text-muted-foreground text-center">
                                                <AlertTriangle className="h-10 w-10 mb-2 text-destructive"/>
                                                <p>Could not load inventory</p>
                                            </div>
                                        ) : (
                                            <div className="col-span-full flex flex-col items-center justify-center text-muted-foreground text-center">
                                                <Package className="h-10 w-10 mb-2"/>
                                                <p>Inventory is empty</p>
                                            </div>
                                        )}
                                    </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
