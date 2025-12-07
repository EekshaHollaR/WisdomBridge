import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, ArrowLeft, Send, Sparkles, Loader2, MessageSquare, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useStreamingChat } from '@/hooks/useStreamingChat';
import { cn } from '@/lib/utils';

type Message = { role: 'user' | 'assistant'; content: string };

const SUGGESTED_QUESTIONS = [
  "What are the best practices for onboarding new team members?",
  "How do you handle difficult client situations?",
  "What's the most important thing to know about our legacy systems?",
  "What decision-making frameworks do experienced employees use?",
];

export default function AskQuestion() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { streamChat, isLoading, error } = useStreamingChat('ask-knowledge');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [assistantMessage, setAssistantMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?mode=login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, assistantMessage]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    let response = '';
    setAssistantMessage('');

    await streamChat({
      messages: [],
      extraBody: { 
        question: text,
        conversationHistory: messages
      },
      onDelta: (delta) => {
        response += delta;
        setAssistantMessage(response);
      },
      onDone: () => {
        if (response) {
          setMessages([...newMessages, { role: 'assistant', content: response }]);
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">WisdomBridge</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container py-6 flex flex-col max-w-4xl">
        <Card className="flex-1 flex flex-col border-border/50 overflow-hidden">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="font-display">Ask the Knowledge Base</CardTitle>
                <p className="text-sm text-muted-foreground">Get AI-powered answers from captured expert wisdom</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && !assistantMessage && (
                <div className="text-center py-8">
                  <Lightbulb className="w-12 h-12 mx-auto mb-4 text-primary/50" />
                  <h3 className="text-lg font-semibold mb-2">What would you like to learn?</h3>
                  <p className="text-muted-foreground mb-6">
                    Ask questions and get answers based on captured expert knowledge
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {SUGGESTED_QUESTIONS.map((question, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="h-auto py-3 px-4 text-left whitespace-normal"
                        onClick={() => sendMessage(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

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
                  placeholder="Ask a question..."
                  className="min-h-[60px] max-h-[120px] resize-none"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="h-[60px]"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
