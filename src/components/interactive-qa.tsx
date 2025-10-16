'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { handleAnalyzeQuestion } from '@/app/actions';
import { Loader2, User, Bot, Send } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type InteractiveQAProps = {
  patientHistory: string;
  currentVitals: string;
};

export default function InteractiveQA({ patientHistory, currentVitals }: InteractiveQAProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I am the patient simulator. What would you like to ask about the patient's condition?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
        viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await handleAnalyzeQuestion({
      question: input,
      patientHistory,
      currentVitals,
    });

    setIsLoading(false);

    if (response.success && response.data) {
      const assistantMessage: Message = { role: 'assistant', content: response.data.suggestedResponse };
      setMessages(prev => [...prev, assistantMessage]);
    } else {
      const errorMessage: Message = { role: 'assistant', content: response.error || 'Sorry, I encountered an error.' };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <Card className="h-full flex flex-col bg-card/90 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle>Interactive Q&A</CardTitle>
        <CardDescription>Ask questions about the patient.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" viewportRef={viewportRef}>
          <div className="space-y-4 pr-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'assistant' && (
                  <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Avatar className="w-8 h-8 border-2 border-primary">
                                <AvatarFallback className="bg-primary/20 text-primary"><Bot size={20} /></AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>AI Assistant</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                )}
                <div className={`rounded-lg px-3 py-2 max-w-[85%] shadow-md ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                   <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Avatar className="w-8 h-8 border-2 border-accent">
                                <AvatarFallback className="bg-accent/20 text-accent"><User size={20}/></AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>You</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8 border-2 border-primary">
                  <AvatarFallback className="bg-primary/20 text-primary"><Bot size={20} /></AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-3 py-2 bg-muted">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="min-h-[40px] resize-none bg-background/80"
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                }
            }}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
