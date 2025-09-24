'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Megaphone, AlertTriangle, RefreshCw } from 'lucide-react';
import type { ChannelMessage } from '@/lib/discord-service';
import { getChannelMessages, getGuildRoles, type GuildRole } from '@/lib/discord-service';
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

function getTenorGifId(content: string): string | null {
    const tenorRegex = /https:\/\/tenor\.com\/view\/[a-zA-Z0-9-]+-(\d+)/;
    const match = tenorRegex.exec(content);
    return match ? match[1] : null;
}

async function fetchTenorGifUrl(gifId: string): Promise<string | null> {
    try {
        if (!process.env.NEXT_PUBLIC_TENOR_API_KEY) {
            console.warn('Tenor API key is not set. GIFs will not be displayed.');
            return null;
        }
        const response = await fetch(`https://tenor.googleapis.com/v2/posts?ids=${gifId}&key=${process.env.NEXT_PUBLIC_TENOR_API_KEY}&media_filter=gif`);
        if (!response.ok) return null;
        const data = await response.json();
        return data?.results?.[0]?.media_formats?.gif?.url || null;
    } catch (e) {
        console.error("Failed to fetch tenor gif", e);
        return null;
    }
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

    // Remove Tenor URL from content
    content = content.replace(/https:\/\/tenor\.com\/view\/[a-zA-Z0-9-]+-\d+/g, '');

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
    const tenorGifId = getTenorGifId(message.content);
    const [tenorGifUrl, setTenorGifUrl] = useState<string | null>(null);

    useEffect(() => {
        if (tenorGifId) {
            fetchTenorGifUrl(tenorGifId).then(setTenorGifUrl);
        }
    }, [tenorGifId]);

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
                ) : tenorGifUrl ? (
                     <div className="mt-2 rounded-lg overflow-hidden border border-border">
                        <Image 
                            src={tenorGifUrl} 
                            alt="Tenor GIF"
                            width={220}
                            height={124}
                            unoptimized
                            className="max-h-60 w-auto object-contain"
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
                            {data.slice().reverse().map((msg, index) => (
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
