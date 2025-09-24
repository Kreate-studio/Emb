'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Wifi, RefreshCw, Gem, Crown } from 'lucide-react';
import type { GuildDetails } from '@/lib/discord-service';
import { getGuildDetails } from '@/lib/discord-service';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

interface ServerStatsProps {
    initialData: GuildDetails | null;
    error: string | null;
}

const tierMap: Record<number, string> = {
    0: 'None',
    1: 'Tier 1',
    2: 'Tier 2',
    3: 'Tier 3',
};

export function ServerStats({ initialData, error: initialError }: ServerStatsProps) {
    const [data, setData] = useState(initialData);
    const [error, setError] = useState(initialError);
    const [isUpdating, setIsUpdating] = useState(false);

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
            <Card className="h-full flex flex-col justify-center items-center text-center">
                 <CardHeader>
                    <div className="flex items-center justify-center h-14 w-14 rounded-full bg-muted border">
                        <Crown className="h-8 w-8 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <CardTitle className="text-xl">Server Stats</CardTitle>
                    <p className="text-muted-foreground mt-2 text-sm">{error || 'Could not load server statistics.'}</p>
                     <Button variant="outline" size="sm" className="mt-4" onClick={fetchData} disabled={isUpdating}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex-row items-center justify-between gap-4 space-y-0 pb-4">
                <div className='flex items-center gap-4'>
                    <Avatar className="h-14 w-14 border-2 border-border">
                        {data.iconUrl && <AvatarImage src={data.iconUrl} alt={data.name} />}
                        <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                     <div>
                        <CardTitle className="text-2xl font-headline">{data.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{tierMap[data.premiumTier]}</p>
                    </div>
                </div>
                 <Button variant="ghost" size="icon" onClick={fetchData} disabled={isUpdating}>
                    <RefreshCw className={`h-4 w-4 text-muted-foreground ${isUpdating ? 'animate-spin' : ''}`} />
                 </Button>
            </CardHeader>
            <CardContent className="flex flex-col justify-around flex-1">
                <div className="flex items-center">
                    <Users className="mr-4 h-6 w-6 text-primary" />
                    <div className="flex-1">
                        <p className="text-sm font-medium leading-none text-muted-foreground">Total Members</p>
                        <p className="text-2xl font-bold">{data.memberCount.toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <Wifi className="mr-4 h-6 w-6 text-primary" />
                     <div className="flex-1">
                        <p className="text-sm font-medium leading-none text-muted-foreground">Online</p>
                        <p className="text-2xl font-bold">{data.onlineCount.toLocaleString()}</p>
                    </div>
                </div>
                 <div className="flex items-center">
                    <Gem className="mr-4 h-6 w-6 text-primary" />
                     <div className="flex-1">
                        <p className="text-sm font-medium leading-none text-muted-foreground">Server Boosts</p>
                        <p className="text-2xl font-bold">{data.premiumSubscriptionCount}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
