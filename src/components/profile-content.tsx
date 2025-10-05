
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Briefcase, Calendar, Coins, PiggyBank, Swords, Shield, Scroll, Gem, Fish, Apple, Diamond, LandPlot, Share2, SquareArrowOutUpRight, Package, User, Star, Wallet, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { LucideIcon } from 'lucide-react';
import React, { useEffect, useState, useTransition } from 'react';
import { useActionState, } from 'react';
import { useToast } from '@/hooks/use-toast';
import { handleEconomyAction } from '@/app/actions';
import type { DiscordMember, GuildRole } from '@/lib/discord-service';
import type { SessionUser } from '@/lib/auth';
import type { EconomyProfile } from '@/lib/economy-service';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

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

function CommandButton({ command, userId, args, children, variant = 'default', size = 'default', className, onSuccess }: { command: string, userId: string, args?: string[], children: React.ReactNode, variant?: "default" | "secondary" | "outline", size?: "default" | "sm" | "lg", className?: string, onSuccess?: () => void }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const formAction = async (formData: FormData) => {
        startTransition(async () => {
            const result = await handleEconomyAction(undefined, formData);
            if (result.message) {
                toast({
                    title: result.error ? 'Action Failed' : 'Action Successful',
                    description: result.message,
                    variant: result.error ? 'destructive' : 'default',
                });
            }
            if (result.success && onSuccess) {
                onSuccess();
            }
        });
    }

    return (
        <form action={formAction}>
            <input type="hidden" name="command" value={command} />
            <input type="hidden" name="userId" value={userId} />
            {args && <input type="hidden" name="args" value={JSON.stringify(args)} />}
            <Button type="submit" disabled={isPending} className={className} variant={variant} size={size}>
                {isPending ? 'Running...' : children}
            </Button>
        </form>
    );
}

function TransferDialog({ sender, recipient, onTransferSuccess }: { sender: SessionUser, recipient: DiscordMember, onTransferSuccess: () => void }) {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState('');
    
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                 <Button variant="outline" size="sm" className="w-full">
                    <LandPlot className="mr-2" /> Transfer
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
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
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                         <CommandButton
                            command="transfer"
                            userId={sender.id}
                            args={[`<@${recipient.user.id}>`, amount]}
                            onSuccess={() => {
                                setOpen(false);
                                setAmount('');
                                onTransferSuccess();
                            }}
                         >
                            Confirm Transfer
                         </CommandButton>
                    </AlertDialogFooter>
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
        <Button variant="outline" size="sm" onClick={handleShare} className="w-full">
            <Share2 className="mr-2" /> Share
        </Button>
    )
}

function ProfileHeader({ member, userRoles }: { member: DiscordMember, userRoles: GuildRole[] }) {
    const bannerImage = PlaceHolderImages.find((img) => img.id === 'lore-bg');
    const accentColor = userRoles.length > 0 ? intToHex(userRoles[0].color) : 'hsl(var(--primary))';
    const joinedAt = member.joined_at ? new Date(member.joined_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

    return (
        <div className="relative">
            <div className="h-32 md:h-48 w-full relative">
                {bannerImage && (
                    <Image
                        src={bannerImage.imageUrl}
                        alt="Profile banner"
                        fill
                        className="object-cover"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>
            <div className="container mx-auto px-4 -mt-16 sm:flex sm:items-end sm:gap-6">
                <Avatar className="w-28 h-28 md:w-36 md:h-36 border-4 border-background ring-4" style={{ ringColor: accentColor }}>
                    <AvatarImage src={member.avatarUrl} alt={member.displayName} />
                    <AvatarFallback>{member.displayName?.charAt(0) || member.user.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="mt-4 sm:mt-0 sm:pb-4">
                    <h1 className="text-3xl md:text-4xl font-bold font-headline">{member.displayName}</h1>
                    <p className="text-muted-foreground">@{member.user.username}</p>
                    <p className="text-sm text-muted-foreground mt-1">Joined on {joinedAt}</p>
                </div>
            </div>
             <div className="container mx-auto px-4 mt-4">
                <div className="flex flex-wrap gap-1 justify-start">
                    {userRoles.slice(0, 5).map(role => (
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
            </div>
        </div>
    )
}

const Stat = ({ icon: Icon, label, value, error }: { icon: LucideIcon, label: string, value: string | number | null, error?: boolean }) => (
    <div className="flex justify-between items-center py-4">
        <div className="flex items-center gap-4">
            <Icon className="w-5 h-5 text-muted-foreground" />
            <p className="font-medium">{label}</p>
        </div>
        {error ? (
            <span className="text-sm text-destructive">Unavailable</span>
        ) : (
            <p className="font-bold font-mono text-lg">{value}</p>
        )}
    </div>
)


interface ProfileContentProps {
  session: SessionUser | null;
  member: DiscordMember | null;
  userRoles: GuildRole[] | null;
  initialEconomyProfile: EconomyProfile | null;
  economyError: string | null;
  pageError: string | null;
  onRefresh: () => void;
}


export function ProfileContent({ session, member, userRoles, initialEconomyProfile, economyError, pageError, onRefresh }: ProfileContentProps) {
    const [activeTab, setActiveTab] = useState('stats');
    const [economyProfile, setEconomyProfile] = useState(initialEconomyProfile);
    
    useEffect(() => {
        setEconomyProfile(initialEconomyProfile)
    }, [initialEconomyProfile])
    
    if (pageError || !member) {
        return <ProfileError message={pageError || "An unknown error occurred."} />;
    }

    const safeUserRoles = userRoles || [];
    const isOwnProfile = session?.id === member.user.id;

    const renderContent = () => {
        switch (activeTab) {
            case 'inventory':
                return <InventoryView economyProfile={economyProfile} error={economyError} />;
            case 'actions':
                return <ActionsView isOwnProfile={isOwnProfile} member={member} session={session} onRefresh={onRefresh} />;
            default:
                return <StatsView economyProfile={economyProfile} error={economyError} />;
        }
    };

    return (
        <>
            <ProfileHeader member={member} userRoles={safeUserRoles} />
            
            {/* Desktop Layout */}
            <div className="hidden md:block container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 flex flex-col gap-6">
                       <StatsView economyProfile={economyProfile} error={economyError} isDesktop />
                       <ActionsView isOwnProfile={isOwnProfile} member={member} session={session} onRefresh={onRefresh} isDesktop />
                    </div>
                    <div className="lg:col-span-2">
                        <InventoryView economyProfile={economyProfile} error={economyError} isDesktop />
                    </div>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
                <div className="container mx-auto px-4 py-6 min-h-[40vh]">
                    {renderContent()}
                </div>
                <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
                    <div className="container mx-auto px-4 grid grid-cols-3">
                        <TabButton id="stats" label="Stats" icon={Wallet} activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton id="inventory" label="Inventory" icon={LayoutGrid} activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton id="actions" label="Actions" icon={Star} activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>
                </div>
            </div>
        </>
    );
}

const TabButton = ({ id, label, icon: Icon, activeTab, setActiveTab }: { id: string, label: string, icon: LucideIcon, activeTab: string, setActiveTab: (id: string) => void }) => (
    <button
        onClick={() => setActiveTab(id)}
        className={cn(
            "flex flex-col items-center justify-center gap-1 py-3 text-sm font-medium transition-colors",
            activeTab === id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        )}
    >
        <Icon className="w-6 h-6" />
        <span>{label}</span>
    </button>
)

const StatsView = ({ economyProfile, error, isDesktop }: { economyProfile: EconomyProfile | null, error: string | null, isDesktop?: boolean }) => (
    <Card className={cn(isDesktop && "w-full")}>
        {isDesktop && <CardHeader><CardTitle>Stats</CardTitle></CardHeader>}
        <CardContent className={cn(!isDesktop && "pt-6")}>
             <div className="divide-y divide-border">
                <Stat icon={Coins} label="Wallet" value={economyProfile?.wallet?.toLocaleString() ?? null} error={!!error} />
                <Stat icon={PiggyBank} label="Bank" value={economyProfile?.bank?.toLocaleString() ?? null} error={!!error} />
                <Stat icon={Diamond} label="Gold" value={economyProfile?.gold?.toLocaleString() ?? null} error={!!error} />
             </div>
        </CardContent>
    </Card>
)

const InventoryView = ({ economyProfile, error, isDesktop }: { economyProfile: EconomyProfile | null, error: string | null, isDesktop?: boolean }) => (
     <Card className={cn(isDesktop && "w-full")}>
        <CardHeader><CardTitle>Inventory</CardTitle></CardHeader>
        <CardContent>
            <div className={cn(
                "border-2 border-dashed rounded-lg p-4 grid grid-cols-4 sm:grid-cols-6 gap-4",
                 isDesktop ? "min-h-96" : "min-h-48"
            )}>
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
                ) : error ? (
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
)

const ActionsView = ({ isOwnProfile, member, session, onRefresh, isDesktop }: { isOwnProfile: boolean, member: DiscordMember, session: SessionUser | null, onRefresh: () => void, isDesktop?: boolean }) => (
    <Card className={cn(isDesktop && "w-full")}>
        {isDesktop && <CardHeader><CardTitle>Actions</CardTitle></CardHeader>}
        <CardContent className={cn(!isDesktop && "pt-6")}>
            <div className="grid grid-cols-1 gap-2">
                {isOwnProfile ? (
                    <>
                        <CommandButton command="work" userId={member.user.id} onSuccess={onRefresh} className="w-full justify-start" variant='outline' size='lg'><Briefcase className="mr-4"/> Work</CommandButton>
                        <CommandButton command="daily" userId={member.user.id} onSuccess={onRefresh} className="w-full justify-start" variant='outline' size='lg'><Calendar className="mr-4"/> Daily</CommandButton>
                        <CommandButton command="weekly" userId={member.user.id} onSuccess={onRefresh} className="w-full justify-start" variant='outline' size='lg'><Calendar className="mr-4"/> Weekly</CommandButton>
                    </>
                ) : (
                    <p className="text-sm text-muted-foreground text-center italic py-4">This is not your profile. Actions are limited.</p>
                )}
                <Separator className='my-2'/>
                <div className="grid grid-cols-2 gap-2">
                    {session && !isOwnProfile && <TransferDialog sender={session} recipient={member} onTransferSuccess={onRefresh} />}
                    <ShareButton />
                    <Button asChild variant="outline" size="sm" className="w-full">
                        <a href={`https://discord.com/users/${member.user.id}`} target="_blank" rel="noopener noreferrer">
                            <SquareArrowOutUpRight className="mr-2" /> Discord
                        </a>
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
)

    