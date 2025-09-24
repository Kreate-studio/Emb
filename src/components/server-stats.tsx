
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Wifi, Server } from 'lucide-react';
import type { GuildDetails } from '@/lib/discord-service';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ServerStatsProps {
    initialData: GuildDetails | null;
    error: string | null;
}

export function ServerStats({ initialData, error }: ServerStatsProps) {
    if (error || !initialData) {
        return (
            <Card className="h-96 flex flex-col justify-center items-center text-center">
                <CardHeader>
                    <Server className="h-10 w-10 mx-auto text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <CardTitle className="text-xl">Server Stats</CardTitle>
                    <p className="text-muted-foreground mt-2 text-sm">{error || 'Could not load server statistics.'}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-96">
            <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
                 <Avatar className="h-14 w-14 border-2 border-border">
                    {initialData.iconUrl && <AvatarImage src={initialData.iconUrl} alt={initialData.name} />}
                    <AvatarFallback>{initialData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl font-headline">{initialData.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="flex items-center">
                        <Users className="mr-4 h-6 w-6 text-primary" />
                        <div className="flex-1">
                            <p className="text-sm font-medium leading-none text-muted-foreground">Total Members</p>
                            <p className="text-2xl font-bold">{initialData.memberCount.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Wifi className="mr-4 h-6 w-6 text-primary" />
                         <div className="flex-1">
                            <p className="text-sm font-medium leading-none text-muted-foreground">Online</p>
                            <p className="text-2xl font-bold">{initialData.onlineCount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}