
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Briefcase, Calendar, Coins, PiggyBank, Swords, Shield, Scroll, Gem, Fish, Apple, Diamond, LandPlot, Share2, SquareArrowOutUpRight, Package, User, Star, Wallet, LayoutGrid, PawPrint, Store, MoreHorizontal, Axe, Skull, Hand, Tent, Landmark, Banknote, VenetianMask, Scale, Users, Bot, Gamepad2, CircleDollarSign, Ticket, Trophy, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { LucideIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { handleEconomyAction } from '@/app/actions';
import type { DiscordMember, GuildRole } from '@/lib/discord-service';
import type { SessionUser } from '@/lib/auth';
import type { EconomyProfile } from '@/lib/economy-service';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';

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

function CommandButton({ command, userId, args, children, variant = 'outline', size = 'default', className, onSuccess, ...props }: { command: string, userId: string, args?: string[], children: React.ReactNode, variant?: "default" | "secondary" | "outline" | "ghost" | "link" | null, size?: "default" | "sm" | "lg" | "icon" | null, className?: string, onSuccess?: () => void }) {
    const { toast } = useToast();

    const formAction = async (formData: FormData) => {
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
    }

    return (
        <form action={formAction}>
            <input type="hidden" name="command" value={command} />
            <input type="hidden" name="userId" value={userId} />
            {args && <input type="hidden" name="args" value={JSON.stringify(args)} />}
            <Button type="submit" className={cn("w-full justify-start text-base py-6", className)} variant={variant} size={size} {...props}>
                {children}
            </Button>
        </form>
    );
}

function ArgumentDialog({ triggerButton, title, description, inputPlaceholder, command, userId, onActionSuccess, hasRecipient = false }: { triggerButton: React.ReactNode, title: string, description: string, inputPlaceholder: string, command: string, userId: string, onActionSuccess: () => void, hasRecipient?: boolean }) {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    
    const args = hasRecipient ? [recipient, amount] : [amount];

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {triggerButton}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-4 space-y-4">
                    {hasRecipient && (
                         <div>
                            <Label htmlFor="recipient" className="sr-only">Recipient</Label>
                            <Input 
                                id="recipient" 
                                name="recipient" 
                                type="text"
                                placeholder="e.g. @username or User ID" 
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                required 
                            />
                        </div>
                    )}
                    <div>
                        <Label htmlFor="amount" className="sr-only">Amount</Label>
                        <Input 
                            id="amount" 
                            name="amount" 
                            type="number"
                            placeholder={inputPlaceholder} 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="1"
                            required 
                        />
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <CommandButton
                        command={command}
                        userId={userId}
                        args={args}
                        variant="default"
                        size="default"
                        className='w-auto justify-center'
                        onSuccess={() => {
                            setOpen(false);
                            setAmount('');
                            if(hasRecipient) setRecipient('');
                            onActionSuccess();
                        }}
                    >
                        Confirm
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
        <Button variant="outline" onClick={handleShare} className="w-full justify-start text-base py-6">
            <Share2 className="mr-4" /> Share
        </Button>
    )
}

function ProfileHeader({ member, userRoles }: { member: DiscordMember, userRoles: GuildRole[] }) {
    const bannerImage = PlaceHolderImages.find((img) => img.id === 'lore-bg');
    
    return (
        <div className="relative h-48 md:h-64 w-full">
            {bannerImage && (
                <Image
                    src={bannerImage.imageUrl}
                    alt="Profile banner"
                    fill
                    className="object-cover"
                    priority
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-black/50" />
            <div className="container mx-auto px-4">
                <div className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4">
                     <div className="flex items-end gap-4">
                        <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background ring-4 ring-primary">
                            <AvatarImage src={member.avatarUrl} alt={member.displayName} />
                            <AvatarFallback>{member.displayName?.charAt(0) || member.user.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                     </div>
                </div>
            </div>
        </div>
    )
}

const Stat = ({ icon: Icon, label, value, error, valueClass }: { icon: LucideIcon, label: string, value: string | number | null, error?: boolean, valueClass?: string }) => (
    <div className="flex items-center gap-4 py-4">
        <Icon className="w-6 h-6 text-primary" />
        <div className='flex-1'>
            <p className="text-sm text-muted-foreground">{label}</p>
            {error ? (
                <span className="text-lg font-bold text-destructive">N/A</span>
            ) : (
                <p className={cn("font-bold font-mono text-2xl", valueClass)}>{value}</p>
            )}
        </div>
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
    const [activeTab, setActiveTab] = useState('profile');
    
    if (pageError || !member) {
        return <ProfileError message={pageError || "An unknown error occurred."} />;
    }

    const isOwnProfile = session?.id === member.user.id;

    const renderMobileContent = () => {
        switch (activeTab) {
            case 'inventory': return <InventoryView economyProfile={initialEconomyProfile} error={economyError} />;
            case 'pets': return <PetsView />;
            case 'shop': return <ShopView />;
            case 'profile':
            default:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold font-headline">{member.displayName}</h1>
                            <p className="text-muted-foreground">@{member.user.username}</p>
                             <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                                {userRoles && userRoles.slice(0, 3).map(role => (
                                    <Badge
                                        key={role.id}
                                        className="border text-xs"
                                        style={{
                                            backgroundColor: `${intToHex(role.color)}20`,
                                            borderColor: `${intToHex(role.color)}80`,
                                            color: intToHex(role.color)
                                        }}
                                    >
                                        {role.name}
                                    </Badge>
                                ))}
                                {userRoles && userRoles.length > 3 && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="sm" variant="outline" className="h-auto px-2 py-0.5 text-xs bg-background/20 border-white/30 text-foreground/80 hover:bg-background/40 hover:text-white">
                                                +{userRoles.length - 3} more
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>All Roles ({userRoles.length})</AlertDialogTitle>
                                            </AlertDialogHeader>
                                            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                                                {userRoles.map(role => (
                                                    <Badge
                                                        key={role.id}
                                                        className="border"
                                                        style={{
                                                            backgroundColor: `${intToHex(role.color)}20`,
                                                            borderColor: `${intToHex(role.color)}80`,
                                                            color: intToHex(role.color)
                                                        }}
                                                    >
                                                        {role.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Close</AlertDialogCancel>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </div>
                        </div>
                        <StatsView economyProfile={initialEconomyProfile} error={economyError} />
                    </div>
                );
        }
    };

    return (
        <>
            <ProfileHeader member={member} userRoles={userRoles || []} />
            
            <div className="pt-16 md:pt-4">
                {/* Desktop Layout */}
                <div className="hidden md:block container mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <h1 className="text-3xl font-bold font-headline">{member.displayName}</h1>
                                    <p className="text-muted-foreground">@{member.user.username}</p>
                                      <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                                        {userRoles && userRoles.slice(0, 3).map(role => (
                                            <Badge
                                                key={role.id}
                                                className="border text-xs"
                                                style={{
                                                    backgroundColor: `${intToHex(role.color)}20`,
                                                    borderColor: `${intToHex(role.color)}80`,
                                                    color: intToHex(role.color)
                                                }}
                                            >
                                                {role.name}
                                            </Badge>
                                        ))}
                                        {userRoles && userRoles.length > 3 && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="outline" className="h-auto px-2 py-0.5 text-xs bg-background/20 border-foreground/30 text-foreground/80 hover:bg-background/40 hover:text-white">
                                                        +{userRoles.length - 3} more
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>All Roles ({userRoles.length})</AlertDialogTitle>
                                                    </AlertDialogHeader>
                                                    <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                                                        {userRoles.map(role => (
                                                            <Badge
                                                                key={role.id}
                                                                className="border"
                                                                style={{
                                                                    backgroundColor: `${intToHex(role.color)}20`,
                                                                    borderColor: `${intToHex(role.color)}80`,
                                                                    color: intToHex(role.color)
                                                                }}
                                                            >
                                                                {role.name}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Close</AlertDialogCancel>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                           <StatsView economyProfile={initialEconomyProfile} error={economyError} isDesktop />
                           <ActionsView isOwnProfile={isOwnProfile} member={member} session={session} onRefresh={onRefresh} isDesktop />
                        </div>
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <InventoryView economyProfile={initialEconomyProfile} error={economyError} isDesktop />
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <PetsView isDesktop />
                                <ShopView isDesktop />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden">
                    <div className="container mx-auto px-4 py-6 min-h-[40vh] mb-20 mt-8">
                        {renderMobileContent()}
                    </div>
                    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border z-50">
                        <div className="container mx-auto grid grid-cols-5">
                            <TabButton id="profile" label="Profile" icon={User} activeTab={activeTab} setActiveTab={setActiveTab} />
                            <TabButton id="inventory" label="Inventory" icon={LayoutGrid} activeTab={activeTab} setActiveTab={setActiveTab} />
                            <ActionSheet isOwnProfile={isOwnProfile} member={member} session={session} onRefresh={() => onRefresh()} />
                            <TabButton id="pets" label="Pets" icon={PawPrint} activeTab={activeTab} setActiveTab={setActiveTab} disabled />
                            <TabButton id="shop" label="Shop" icon={Store} activeTab={activeTab} setActiveTab={setActiveTab} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

const TabButton = ({ id, label, icon: Icon, activeTab, setActiveTab, disabled }: { id: string, label: string, icon: LucideIcon, activeTab: string, setActiveTab: (id: string) => void, disabled?: boolean }) => (
    <button
        onClick={() => setActiveTab(id)}
        disabled={disabled}
        className={cn(
            "flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors",
            activeTab === id ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            disabled && "text-muted-foreground/50 cursor-not-allowed"
        )}
    >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </button>
)

const ActionSheet = ({ isOwnProfile, member, session, onRefresh }: { isOwnProfile: boolean, member: DiscordMember, session: SessionUser | null, onRefresh: () => void}) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className='w-5 h-5'/>
                    <span>Actions</span>
                </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-lg max-h-[80vh]">
                <SheetHeader className='text-left mb-4'>
                    <SheetTitle>Actions</SheetTitle>
                </SheetHeader>
                <ScrollArea className='h-full'>
                    <ActionsView isOwnProfile={isOwnProfile} member={member} session={session} onRefresh={onRefresh}/>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}

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
                "border-2 border-dashed border-border/50 rounded-lg p-4 grid grid-cols-4 sm:grid-cols-6 gap-4",
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
                        <div className="col-span-full flex flex-col items-center justify-center text-muted-foreground text-center gap-2">
                        <AlertTriangle className="h-10 w-10 text-destructive"/>
                        <p className='font-semibold'>Could not load inventory</p>
                    </div>
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center text-muted-foreground text-center gap-2">
                        <Package className="h-10 w-10"/>
                        <p className='font-semibold'>Inventory is empty</p>
                    </div>
                )}
            </div>
        </CardContent>
    </Card>
)

const PetsView = ({ isDesktop }: { isDesktop?: boolean }) => (
     <Card className={cn(isDesktop && "w-full")}>
        <CardHeader><CardTitle>Pets</CardTitle></CardHeader>
        <CardContent>
            <div className={cn(
                "border-2 border-dashed border-border/50 rounded-lg p-4 flex flex-col items-center justify-center text-muted-foreground text-center",
                isDesktop ? "min-h-48" : "min-h-48"
                )}>
                <PawPrint className="h-10 w-10 mb-2"/>
                <p className="font-bold">Pet System Coming Soon!</p>
                <p className="text-sm">Adopt and raise your own companions.</p>
            </div>
        </CardContent>
    </Card>
)

const ShopView = ({ isDesktop }: { isDesktop?: boolean }) => (
     <Card className={cn(isDesktop && "w-full")}>
        <CardHeader><CardTitle>Shop</CardTitle></CardHeader>
        <CardContent>
            <div className={cn(
                "border-2 border-dashed border-border/50 rounded-lg p-4 flex flex-col items-center justify-center text-muted-foreground text-center",
                isDesktop ? "min-h-48" : "min-h-48"
                )}>
                <Store className="h-10 w-10 mb-2"/>
                <p className="font-bold">Shop</p>
                <Button className='mt-2'>Enter Shop</Button>
            </div>
        </CardContent>
    </Card>
)


const ActionsView = ({ isOwnProfile, member, session, onRefresh, isDesktop }: { isOwnProfile: boolean, member: DiscordMember, session: SessionUser | null, onRefresh: () => void, isDesktop?: boolean }) => (
    <Card className={cn(isDesktop && "w-full")}>
        {isDesktop && <CardHeader><CardTitle>Actions</CardTitle></CardHeader>}
        <CardContent className={cn(!isDesktop && "pt-0")}>
             <Accordion type="multiple" className="w-full" defaultValue={['item-1', 'item-2', 'item-3', 'item-4', 'item-5']}>
                {isOwnProfile && (
                    <AccordionItem value="item-1">
                        <AccordionTrigger className='font-headline'>Earn</AccordionTrigger>
                        <AccordionContent className="grid grid-cols-1 gap-2">
                             <CommandButton command="work" userId={member.user.id} onSuccess={onRefresh}><Briefcase className="mr-4"/> Work</CommandButton>
                             <CommandButton command="daily" userId={member.user.id} onSuccess={onRefresh}><Calendar className="mr-4"/> Daily</CommandButton>
                             <CommandButton command="weekly" userId={member.user.id} onSuccess={onRefresh}><Star className="mr-4"/> Weekly</CommandButton>
                             <CommandButton command="beg" userId={member.user.id} onSuccess={onRefresh}><Hand className="mr-4"/> Beg</CommandButton>
                             <CommandButton command="crime" userId={member.user.id} onSuccess={onRefresh}><VenetianMask className="mr-4"/> Crime</CommandButton>
                             <CommandButton command="fish" userId={member.user.id} onSuccess={onRefresh}><Fish className="mr-4"/> Fish</CommandButton>
                             <CommandButton command="hunt" userId={member.user.id} onSuccess={onRefresh}><Axe className="mr-4"/> Hunt</CommandButton>
                             <CommandButton command="loot" userId={member.user.id} onSuccess={onRefresh}><Tent className="mr-4"/> Loot</CommandButton>
                             <ArgumentDialog 
                                triggerButton={<Button variant="outline" className="w-full justify-start text-base py-6"><Skull className="mr-4"/> Rob</Button>}
                                title="Rob a User"
                                description="Enter the user ID or mention of the user you want to rob."
                                inputPlaceholder="e.g. @username or 123456789"
                                command="rob"
                                userId={member.user.id}
                                onActionSuccess={onRefresh}
                             />
                        </AccordionContent>
                    </AccordionItem>
                )}
                 <AccordionItem value="item-2">
                    <AccordionTrigger className='font-headline'>Bank</AccordionTrigger>
                    <AccordionContent className="grid grid-cols-1 gap-2">
                        {isOwnProfile && (
                            <>
                            <ArgumentDialog 
                                triggerButton={<Button variant="outline" className="w-full justify-start text-base py-6"><Landmark className="mr-4"/> Deposit</Button>}
                                title="Deposit to Bank"
                                description="Enter the amount you wish to move from your wallet to your bank."
                                inputPlaceholder="e.g. 100"
                                command="deposit"
                                userId={member.user.id}
                                onActionSuccess={onRefresh}
                             />
                            <ArgumentDialog 
                                triggerButton={<Button variant="outline" className="w-full justify-start text-base py-6"><Wallet className="mr-4"/> Withdraw</Button>}
                                title="Withdraw from Bank"
                                description="Enter the amount you wish to move from your bank to your wallet."
                                inputPlaceholder="e.g. 100"
                                command="withdraw"
                                userId={member.user.id}
                                onActionSuccess={onRefresh}
                             />
                             <ArgumentDialog 
                                triggerButton={<Button variant="outline" className="w-full justify-start text-base py-6"><Banknote className="mr-4"/> Invest</Button>}
                                title="Invest"
                                description="Enter the amount you wish to invest."
                                inputPlaceholder="e.g. 100"
                                command="invest"
                                userId={member.user.id}
                                onActionSuccess={onRefresh}
                             />
                              <ArgumentDialog 
                                triggerButton={<Button variant="outline" className="w-full justify-start text-base py-6"><CircleDollarSign className="mr-4"/> Loan</Button>}
                                title="Take a Loan"
                                description="Enter the amount you wish to loan."
                                inputPlaceholder="e.g. 100"
                                command="loan"
                                userId={member.user.id}
                                onActionSuccess={onRefresh}
                             />
                            </>
                        )}
                        {session && (
                             <ArgumentDialog 
                                triggerButton={<Button variant="outline" className="w-full justify-start text-base py-6"><LandPlot className="mr-4"/> Transfer</Button>}
                                title={`Transfer to ${member.displayName}`}
                                description="Enter the amount you wish to transfer. This cannot be undone."
                                inputPlaceholder="e.g. 100"
                                command="transfer"
                                userId={session.id}
                                onActionSuccess={onRefresh}
                                hasRecipient={true}
                             />
                        )}
                    </AccordionContent>
                </AccordionItem>
                {isOwnProfile && (
                    <AccordionItem value="item-3">
                        <AccordionTrigger className='font-headline'>Gambling</AccordionTrigger>
                        <AccordionContent className="grid grid-cols-1 gap-2">
                            <ArgumentDialog 
                                triggerButton={<Button variant="outline" className="w-full justify-start text-base py-6"><Gamepad2 className="mr-4"/> Gamble</Button>}
                                title="Gamble"
                                description="Enter the amount you wish to gamble."
                                inputPlaceholder="e.g. 100"
                                command="gamble"
                                userId={member.user.id}
                                onActionSuccess={onRefresh}
                             />
                            <ArgumentDialog 
                                triggerButton={<Button variant="outline" className="w-full justify-start text-base py-6"><Bot className="mr-4"/> Roulette</Button>}
                                title="Play Roulette"
                                description="Enter the amount you wish to bet on roulette."
                                inputPlaceholder="e.g. 100"
                                command="roulette"
                                userId={member.user.id}
                                onActionSuccess={onRefresh}
                             />
                              <ArgumentDialog 
                                triggerButton={<Button variant="outline" className="w-full justify-start text-base py-6"><Ticket className="mr-4"/> Slots</Button>}
                                title="Play Slots"
                                description="Enter the amount you wish to bet on the slot machine."
                                inputPlaceholder="e.g. 100"
                                command="slots"
                                userId={member.user.id}
                                onActionSuccess={onRefresh}
                             />
                        </AccordionContent>
                    </AccordionItem>
                )}
                 <AccordionItem value="item-4">
                    <AccordionTrigger className='font-headline'>Social</AccordionTrigger>
                    <AccordionContent className="grid grid-cols-1 gap-2">
                        {isOwnProfile && (
                            <ArgumentDialog 
                                triggerButton={<Button variant="outline" className="w-full justify-start text-base py-6"><Scale className="mr-4"/> Trade</Button>}
                                title="Trade with a user"
                                description="Enter the user and the item/amount you wish to trade."
                                inputPlaceholder="e.g. @user 100"
                                command="trade"
                                userId={member.user.id}
                                onActionSuccess={onRefresh}
                                hasRecipient
                             />
                        )}
                         <CommandButton command="leaderboard" userId={member.user.id} onSuccess={onRefresh}><Trophy className="mr-4"/> Leaderboard</CommandButton>
                         <CommandButton command="myhome" userId={member.user.id} onSuccess={onRefresh}><Home className="mr-4"/> My Home</CommandButton>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-5">
                    <AccordionTrigger className='font-headline'>General</AccordionTrigger>
                    <AccordionContent className="grid grid-cols-1 gap-2">
                        <ShareButton />
                        <Button asChild variant="outline" className="w-full justify-start text-base py-6">
                            <a href={`https://discord.com/users/${member.user.id}`} target="_blank" rel="noopener noreferrer">
                                <SquareArrowOutUpRight className="mr-4" /> Discord
                            </a>
                        </Button>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </CardContent>
    </Card>
)

    
