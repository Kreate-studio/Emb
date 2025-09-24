'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { FlameIcon } from './flame-icon';
import { marked } from 'marked';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
};

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentInput = input.trim();
    if (!currentInput || isPending) return;

    setInput('');

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: currentInput,
    };
    setMessages((prev) => [...prev, userMessage]);

    startTransition(async () => {
      const result = await getAIResponse(currentInput);
      
      if (result.error) {
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: 'error',
          content: result.error,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } else if (result.response) {
         const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: result.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    });
  };

  const parseContent = (content: string) => {
    // Sanitize and parse markdown
    const dirtyHtml = marked.parse(content);
    // In a real app, you should use a proper sanitizer like DOMPurify
    // for security reasons before using dangerouslySetInnerHTML.
    // For this prototype, we'll trust the AI output.
    return { __html: dirtyHtml as string };
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
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn('flex items-start gap-3', {
                    'justify-end': message.role === 'user',
                  })}
                >
                  {message.role !== 'user' && (
                    <Avatar className="w-8 h-8 border border-border">
                      <AvatarFallback>
                        <Bot size={20} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'p-3 rounded-lg max-w-[85%]',
                      message.role === 'user' && 'bg-primary text-primary-foreground rounded-br-none',
                      message.role === 'assistant' && 'bg-secondary rounded-tl-none',
                      message.role === 'error' && 'bg-destructive/20 text-destructive-foreground rounded-tl-none'
                    )}
                  >
                    <div className="text-sm prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={parseContent(message.content)}/>
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
               {isPending && (
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
                disabled={isPending}
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                disabled={isPending || !input.trim()}
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