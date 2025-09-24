
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, AlertTriangle } from 'lucide-react';
import type { ChannelMessage } from '@/lib/discord-service';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import React from 'react';
import Image from 'next/image';

interface LiveChannelFeedProps {
    initialData: ChannelMessage[] | null;
    error: string | null;
}

function getTenorGif(content: string): string | null {
    const tenorRegex = /https:\/\/tenor\.com\/view\/[a-zA-Z0-9-]+/g;
    const match = content.match(tenorRegex);
    if (match) {
        // This is a simplified approach. A real implementation would fetch the URL
        // and then get the GIF from the response, which requires a Tenor API key.
        // For now, we'll try to guess the GIF URL. This may not always work.
        const parts = match[0].split('-');
        const gifId = parts[parts.length - 1];
        if (gifId) {
             // This is a common but not guaranteed URL format for Tenor GIFs on Imgur
            return `https://i.imgur.com/${gifId}.gif`;
        }
    }
    return null;
}

function FeedMessage({ message }: { message: ChannelMessage }) {
    const firstAttachment = message.attachments?.[0];
    const isImage = firstAttachment?.content_type?.startsWith('image/');
    const isVideo = firstAttachment?.content_type?.startsWith('video/');
    const tenorGifUrl = getTenorGif(message.content);

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
                        {message.content}
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

export function LiveChannelFeed({ initialData, error }: LiveChannelFeedProps) {
    return (
        <Card className="flex flex-col h-96">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-6 w-6 text-primary" />
                    Live Feed
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                 {error || !initialData || initialData.length === 0 ? (
                    <div className="m-auto text-center">
                         <AlertTriangle className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-muted-foreground mt-2 text-sm">{error || 'Could not load live feed.'}</p>
                    </div>
                ) : (
                    <ScrollArea className="h-full pr-4">
                        <div className="space-y-4">
                           {initialData.map((msg, index) => (
                                <React.Fragment key={msg.id}>
                                    <FeedMessage message={msg} />
                                    {index < initialData.length - 1 && <Separator className="my-4"/>}
                                </React.Fragment>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
}
