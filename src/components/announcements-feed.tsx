'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Megaphone, AlertTriangle, RefreshCw } from 'lucide-react';
import type { ChannelMessage } from '@/lib/discord-service';
import { getChannelMessages } from '@/lib/discord-service';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import Image from 'next/image';

interface AnnouncementsFeedProps {
    initialData: ChannelMessage[] | null;
    error: string | null;
    channelId: string;
}

function getTenorGifId(content: string): string | null {
    const tenorRegex = /https:\/\/tenor\.com\/view\/[a-zA-Z0-9-]+-(\d+)/g;
    const match = tenorRegex.exec(content);
    return match ? match[1] : null;
}

async function fetchTenorGifUrl(gifId: string): Promise<string | null> {
    try {
        const response = await fetch(`https://tenor.googleapis.com/v2/posts?ids=${gifId}&key=${process.env.NEXT_PUBLIC_TENOR_API_KEY}&media_filter=gif`);
        if (!response.ok) return null;
        const data = await response.json();
        return data?.results?.[0]?.media_formats?.gif?.url || null;
    } catch (e) {
        console.error("Failed to fetch tenor gif", e);
        return null;
    }
}

function FeedMessage({ message }: { message: ChannelMessage }) {
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
                <AvatarFallback>{message.author.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
                <div className="flex items-baseline gap-2">
                    <p className="font-semibold text-sm">{message.author.username}</p>
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                    </p>
                </div>
                {message.content && (
                    <p className="text-sm text-muted-foreground prose prose-sm prose-invert max-w-none break-words">
                        {message.content.replace(/https:\/\/tenor\.com\/view\/[a-zA-Z0-9-]+/g, '')}
                    </p>
                )}
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

export function AnnouncementsFeed({ initialData, error: initialError, channelId }: AnnouncementsFeedProps) {
    const [data, setData] = useState(initialData);
    const [error, setError] = useState(initialError);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsUpdating(true);
            const { messages, error } = await getChannelMessages(channelId, 3);
            if (messages) setData(messages);
            if (error) setError(error);
            setIsUpdating(false);
        };

        const interval = setInterval(fetchData, 30000); // 30 seconds
        return () => clearInterval(interval);
    }, [channelId]);

    return (
        <Card className="flex flex-col h-96">
            <CardHeader className='pb-2'>
                <div className='flex justify-between items-center'>
                    <CardTitle className="flex items-center gap-2">
                        <Megaphone className="h-6 w-6 text-primary" />
                        Announcements
                    </CardTitle>
                    <RefreshCw className={`h-4 w-4 text-muted-foreground ${isUpdating ? 'animate-spin' : ''}`} />
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col">
                {error || !data || data.length === 0 ? (
                    <div className="m-auto text-center">
                         <AlertTriangle className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-muted-foreground mt-2 text-sm">{error || 'No announcements found.'}</p>
                    </div>
                ) : (
                    <ScrollArea className="h-full pr-4 -mr-4">
                        <div className="space-y-4">
                            {data.map((msg, index) => (
                                <React.Fragment key={msg.id}>
                                    <FeedMessage message={msg} />
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
