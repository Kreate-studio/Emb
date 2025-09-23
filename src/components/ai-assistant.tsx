'use client';

import React, { useState, useRef, useEffect, useOptimistic, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, CornerDownLeft, X, Loader2 } from 'lucide-react';
import { getAIResponse } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { FlameIcon } from './flame-icon';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
};

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  const [optimisticMessages, addOptimisticMessage] = useOptimistic<
    Message[],
    string
  >(messages, (state, newContent) => [
    ...state,
    { id: state.length + 1, role: 'user', content: newContent },
  ]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [optimisticMessages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userInput = input;
    setInput('');
    setError(null);
    setLoading(true);

    startTransition(() => {
      addOptimisticMessage(userInput);
    });

    const result = await getAIResponse(userInput);

    if (result.error) {
      setError(result.error);
      setMessages((prev) => [
        ...prev,
        { id: prev.length, role: 'user', content: userInput },
        { id: prev.length + 1, role: 'assistant', content: result.error || 'An error occurred.' },
      ]);
    } else if (result.response) {
      setMessages((prev) => [
        ...prev,
        { id: prev.length, role: 'user', content: userInput },
        { id: prev.length + 1, role: 'assistant', content: result.response },
      ]);
    }
    setLoading(false);
  };

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50 animate-float"
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Assistant"
      >
        <FlameIcon className="h-8 w-8" />
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="flex flex-col p-0 w-full sm:max-w-lg">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-2 font-headline">
              <Bot className="text-primary" />
              Sanctuary Guide
            </SheetTitle>
             <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3"
              >
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </SheetHeader>
          <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                 <Avatar className="w-8 h-8 border border-border">
                    <AvatarFallback>
                      <Bot size={20} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-secondary p-3 rounded-lg rounded-tl-none max-w-[85%]">
                    <p className="text-sm">
                      Greetings! Ask me anything about D’Last Sanctuary.
                    </p>
                  </div>
              </div>
              {optimisticMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn('flex items-start gap-3', {
                    'justify-end': message.role === 'user',
                  })}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="w-8 h-8 border border-border">
                      <AvatarFallback>
                        <Bot size={20} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'p-3 rounded-lg max-w-[85%]',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-secondary rounded-tl-none'
                    )}
                  >
                    <p className="text-sm prose prose-sm prose-invert" dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />')}}/>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="w-8 h-8 border border-border">
                      <AvatarFallback>
                        <User size={20} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {loading && (
                 <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8 border border-border">
                      <AvatarFallback>
                        <Bot size={20} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-secondary p-3 rounded-lg rounded-tl-none max-w-[85%]">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <SheetFooter className="p-4 border-t bg-background">
            <form onSubmit={handleSubmit} className="w-full relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about lore, events, or the ecosystem..."
                className="pr-12"
                disabled={loading}
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                disabled={loading || !input.trim()}
              >
                <CornerDownLeft className="h-5 w-5" />
              </Button>
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
