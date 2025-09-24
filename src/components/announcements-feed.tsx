'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Megaphone, AlertTriangle, RefreshCw } from 'lucide-react';
import type { ChannelMessage } from '@/lib/discord-service';
import { getChannelMessages, getGuildRoles, type GuildRole } from '@/lib/discord-service';
import { getTenorGifUrl } from '@/app/actions';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import Image from 'next/image';
import { Button } from './ui/button';

interface AnnouncementsFeedProps {
    initialData: ChannelMessage[] | null;
    error: string | null;
    channelId: string;
    initialRoles: GuildRole[] | null;
    rolesError: string | null;
}

function intToHex(int: number) {
    if (int === undefined || int === null || int === 0) return '#FFFFFF'; // Default to white
    return '#' + int.toString(16).padStart(6, '0');
}

function MessageContent({ message, roles }: { message: ChannelMessage, roles: GuildRole[] }) {
    let content = message.content;

    // Replace role mentions
    if (message.mentions.roles && roles.length > 0) {
        message.mentions.roles.forEach(roleId => {
            const role = roles.find(r => r.id === roleId);
            if (role) {
                const hexColor = intToHex(role.color);
                const mention = `<span style="color: ${hexColor}; background-color: ${hexColor}33;" class="px-1 rounded-sm">@${role.name}</span>`;
                content = content.replace(new RegExp(`<@&${role.id}>`, 'g'), mention);
            }
        });
    }
    
    // Replace user mentions
    // This is a simplified version, a full implementation would need to fetch member data
    content = content.replace(/<@!?(\d+)>/g, (match, userId) => {
        // In a real app, you might look up the user's nickname from a pre-fetched list
        return `<span class="text-primary bg-primary/20 px-1 rounded-sm">@user</span>`;
    });


    return (
        <p 
            className="text-sm text-muted-foreground prose prose-sm prose-invert max-w-none break-words"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}

function FeedMessage({ message, roles }: { message: ChannelMessage, roles: GuildRole[] }) {
    const firstAttachment = message.attachments?.[0];
    const isImage = firstAttachment?.content_type?.startsWith('image/');
    const isVideo = firstAttachment?.content_type?.startsWith('video/');
    const tenorUrl = message.content.match(/https?:\/\/tenor\.com\/view\/[a-zA-Z0-9-]+|https?:\/\/tenor\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+/)?.[0];
    const [gifUrl, setGifUrl] = useState<string | null>(null);

    useEffect(() => {
        if (tenorUrl) {
            getTenorGifUrl(tenorUrl).then(({ url }) => {
                if(url) setGifUrl(url);
            });
        }
    }, [tenorUrl]);
    
    return (
        <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 border">
                <AvatarImage src={message.author.avatarUrl} alt={message.author.username} />
                <AvatarFallback>{message.author.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
                <div className="flex items-baseline gap-2">
                    <p className="font-semibold text-sm">{message.author.displayName}</p>
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                    </p>
                </div>
                {message.content && <MessageContent message={message} roles={roles} />}
                {(firstAttachment && (isImage || isVideo)) ? (
                     <div className="mt-2 rounded-lg overflow-hidden border border-border">
                        {isImage ? (
                            <Image 
                                src={firstAttachment.proxy_url} 
                                alt="Discord attachment"
                                width={firstAttachment.width}
                                height={firstAttachment.height}
                                className="max-h-60 w-auto object-contain"
                            />
                        ) : isVideo ? (
                            <video controls src={firstAttachment.url} className="max-h-60 w-auto" />
                        ): null}
                    </div>
                ) : gifUrl ? (
                    <div className="mt-2 rounded-lg overflow-hidden border border-border">
                        <Image 
                            src={gifUrl} 
                            alt="Tenor GIF"
                            width={220}
                            height={150} // A common GIF aspect ratio
                            className="max-h-60 w-auto object-contain"
                            unoptimized
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export function AnnouncementsFeed({ initialData, error: initialError, channelId, initialRoles, rolesError: initialRolesError }: AnnouncementsFeedProps) {
    const [data, setData] = useState(initialData);
    const [roles, setRoles] = useState(initialRoles);
    const [error, setError] = useState(initialError || initialRolesError);
    const [isUpdating, setIsUpdating] = useState(false);

     const fetchData = useCallback(async () => {
        setIsUpdating(true);
        const [{ messages, error: msgError }, { roles: guildRoles, error: rolesError }] = await Promise.all([
            getChannelMessages(channelId, 10),
            getGuildRoles()
        ]);
        
        if (messages) setData(messages);
        if (guildRoles) setRoles(guildRoles);
        
        const combinedError = msgError || rolesError;
        setError(combinedError);

        setIsUpdating(false);
    }, [channelId]);

    useEffect(() => {
        const interval = setInterval(fetchData, 30000); // 30 seconds
        return () => clearInterval(interval);
    }, [fetchData]);

    return (
        <Card className="flex flex-col h-96 bg-card/50 border-border/50 backdrop-blur-md shadow-lg">
            <CardHeader className='pb-2'>
                <div className='flex justify-between items-center'>
                    <CardTitle className="flex items-center gap-2">
                        <Megaphone className="h-6 w-6 text-primary" />
                        Announcements
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={fetchData} disabled={isUpdating}>
                        <RefreshCw className={`h-4 w-4 text-muted-foreground ${isUpdating ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col">
                {error || !data || data.length === 0 || !roles ? (
                    <div className="m-auto text-center">
                         <AlertTriangle className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-muted-foreground mt-2 text-sm">{error || 'No announcements found.'}</p>
                         <Button variant="outline" size="sm" className="mt-4" onClick={fetchData} disabled={isUpdating}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
                            Try Again
                        </Button>
                    </div>
                ) : (
                    <ScrollArea className="h-full pr-4 -mr-4">
                        <div className="space-y-4">
                            {data.map((msg, index) => (
                                <React.Fragment key={msg.id}>
                                    <FeedMessage message={msg} roles={roles} />
                                    {index < data.length - 1 && <Separator className="my-4"/>}
                                </React.Fragment>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
}