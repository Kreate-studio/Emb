'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Users, Wifi, RefreshCw, Gem, Crown } from 'lucide-react';
import type { GuildDetails, DiscordWidgetData } from '@/lib/discord-service';
import { getGuildDetails } from '@/lib/discord-service';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface ServerStatsProps {
    initialData: GuildDetails | null;
    error: string | null;
    widgetData: DiscordWidgetData | null;
}

const tierMap: Record<number, string> = {
    0: 'No Tier',
    1: 'Tier 1',
    2: 'Tier 2',
    3: 'Tier 3',
};

export function ServerStats({ initialData, error: initialError, widgetData }: ServerStatsProps) {
    const [data, setData] = useState(initialData);
    const [error, setError] = useState(initialError);
    const [isUpdating, setIsUpdating] = useState(false);
    const inviteLink = widgetData?.instant_invite || 'https://discord.gg/PruRXZ7zkF';

    const fetchData = useCallback(async () => {
        setIsUpdating(true);
        const { details, error } = await getGuildDetails();
        if (details) setData(details);
        if (error) setError(error);
        setIsUpdating(false);
    }, []);

     useEffect(() => {
        const interval = setInterval(fetchData, 60000); // 60 seconds
        return () => clearInterval(interval);
    }, [fetchData]);

    if (error || !data) {
        return (
            <Card className="h-96 flex flex-col justify-center items-center text-center p-4 bg-card/50 border-border/50 backdrop-blur-md shadow-lg">
                 <div className="flex items-center justify-center h-14 w-14 rounded-full bg-muted border mb-4">
                    <Crown className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl font-headline">Server Stats</CardTitle>
                <p className="text-muted-foreground mt-2 text-sm">{error || 'Could not load server statistics.'}</p>
                 <Button variant="outline" size="sm" className="mt-4" onClick={fetchData} disabled={isUpdating}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
                    Try Again
                </Button>
            </Card>
        );
    }

    return (
        <Card className="h-96 flex flex-col bg-card/50 border-border/50 backdrop-blur-md shadow-lg">
            <CardHeader className="flex-row items-center justify-between gap-4 space-y-0 pb-2">
                <div className='flex items-center gap-4'>
                    <Avatar className="h-14 w-14 border-2 border-primary">
                        {data.iconUrl && <AvatarImage src={data.iconUrl} alt={data.name} />}
                        <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                     <div>
                        <CardTitle className="text-2xl font-headline">{data.name}</CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <Crown className='w-4 h-4 text-yellow-400' />
                            {tierMap[data.premiumTier]}
                        </p>
                    </div>
                </div>
                 <Button variant="ghost" size="icon" onClick={fetchData} disabled={isUpdating}>
                    <RefreshCw className={`h-4 w-4 text-muted-foreground ${isUpdating ? 'animate-spin' : ''}`} />
                 </Button>
            </CardHeader>
            <CardContent className="flex flex-col justify-center flex-1 pt-4">
                <div className='text-center'>
                    <p className='text-4xl md:text-5xl font-bold tracking-tighter'>{data.memberCount.toLocaleString()}</p>
                    <p className='text-sm text-muted-foreground'>Total Members</p>
                </div>
                <Separator className='my-6' />
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold">{data.onlineCount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                            <Wifi className='w-3 h-3 text-green-500'/> Online
                        </p>
                    </div>
                     <div>
                        <p className="text-2xl font-bold">{data.premiumSubscriptionCount}</p>
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                            <Gem className='w-3 h-3 text-pink-500' /> Boosts
                        </p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                 <Button asChild size="lg" className="w-full">
                    <a href={inviteLink} target="_blank" rel="noopener noreferrer">
                    <Users className="mr-2" />
                    Join Server
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
}
