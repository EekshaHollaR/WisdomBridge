import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useStreamingChat } from '@/hooks/useStreamingChat';
import { cn } from '@/lib/utils';

type Message = { role: 'user' | 'assistant'; content: string };

interface InterviewChatProps {
  sessionContext: {
    topic?: string;
    expertiseArea?: string;
  };
  onMessagesChange?: (messages: Message[]) => void;
  initialMessages?: Message[];
}

export function InterviewChat({ sessionContext, onMessagesChange, initialMessages = [] }: InterviewChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [assistantMessage, setAssistantMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { streamChat, isLoading, error } = useStreamingChat('ai-interview');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, assistantMessage]);

  useEffect(() => {
    if (messages.length === 0) {
      // Start the interview with an initial AI message
      startInterview();
    }
  }, []);

  const startInterview = async () => {
    let response = '';
    setAssistantMessage('');

    await streamChat({
      messages: [{ role: 'user', content: 'Start the interview. Ask me about my expertise.' }],
      extraBody: { sessionContext, type: 'interview' },
      onDelta: (delta) => {
        response += delta;
        setAssistantMessage(response);
      },
      onDone: () => {
        if (response) {
          const newMessages = [{ role: 'assistant' as const, content: response }];
          setMessages(newMessages);
          onMessagesChange?.(newMessages);
        }
        setAssistantMessage('');
      },
    });
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    let response = '';
    setAssistantMessage('');

    await streamChat({
      messages: newMessages,
      extraBody: { sessionContext, type: 'interview' },
      onDelta: (delta) => {
        response += delta;
        setAssistantMessage(response);
      },
      onDone: () => {
        if (response) {
          const finalMessages = [...newMessages, { role: 'assistant' as const, content: response }];
          setMessages(finalMessages);
          onMessagesChange?.(finalMessages);
        }
        setAssistantMessage('');
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex gap-3 animate-fade-in",
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3",
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-muted text-foreground rounded-bl-md'
              )}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {/* Streaming message */}
        {assistantMessage && (
          <div className="flex gap-3 justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-muted text-foreground px-4 py-3">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{assistantMessage}</p>
            </div>
          </div>
        )}
        
        {isLoading && !assistantMessage && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Error display */}
      {error && (
        <div className="mx-4 mb-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share your knowledge..."
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={isLoading}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-[60px]"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
