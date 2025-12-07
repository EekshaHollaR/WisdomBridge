import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Brain, ArrowLeft, Save, Clock, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { InterviewChat } from '@/components/interview/InterviewChat';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const EXPERTISE_AREAS = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'technology', label: 'Technology' },
  { value: 'operations', label: 'Operations' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'other', label: 'Other' },
];

export default function Interview() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [sessionId, setSessionId] = useState<string | null>(searchParams.get('session'));
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [expertiseArea, setExpertiseArea] = useState<string>('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?mode=login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted) {
      interval = setInterval(() => setDuration(d => d + 1), 60000);
    }
    return () => clearInterval(interval);
  }, [isStarted]);

  const loadSession = async (id: string) => {
    const { data, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (data && !error) {
      setTitle(data.title);
      setTopic(data.topic || '');
      setExpertiseArea(data.expertise_area || '');
      setMessages((data.transcript as any[]) || []);
      setDuration(data.duration_minutes || 0);
      setIsStarted(true);
    }
  };

  const startSession = async () => {
    if (!title.trim()) {
      toast({ title: 'Please enter a session title', variant: 'destructive' });
      return;
    }

    const { data, error } = await supabase
      .from('interview_sessions')
      .insert([{
        expert_id: profile?.id as string,
        title: title.trim(),
        topic: topic.trim() || null,
        expertise_area: (expertiseArea || null) as any,
        status: 'in_progress',
        transcript: [],
      }])
      .select()
      .single();

    if (error) {
      toast({ title: 'Failed to start session', description: error.message, variant: 'destructive' });
      return;
    }

    setSessionId(data.id);
    setIsStarted(true);
    toast({ title: 'Interview started!', description: 'Begin sharing your expertise.' });
  };

  const saveSession = async () => {
    if (!sessionId) return;
    setIsSaving(true);

    const { error } = await supabase
      .from('interview_sessions')
      .update({
        transcript: messages as any,
        duration_minutes: duration,
      })
      .eq('id', sessionId);

    setIsSaving(false);
    if (error) {
      toast({ title: 'Failed to save', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Progress saved!' });
    }
  };

  const completeSession = async () => {
    if (!sessionId) return;
    setIsSaving(true);

    // Extract key insights from the conversation
    const conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    
    const { error } = await supabase
      .from('interview_sessions')
      .update({
        transcript: messages as any,
        duration_minutes: duration,
        status: 'completed',
        summary: `Interview session covering ${topic || 'various topics'} in ${EXPERTISE_AREAS.find(e => e.value === expertiseArea)?.label || 'general'} domain.`,
      })
      .eq('id', sessionId);

    if (!error) {
      // Create knowledge items from the session
      const assistantMessages = messages.filter(m => m.role === 'assistant');
      if (assistantMessages.length > 0) {
        await supabase.from('knowledge_items').insert({
          expert_id: profile?.id,
          session_id: sessionId,
          title: title,
          content: assistantMessages.map(m => m.content).join('\n\n'),
          category: expertiseArea || 'other',
          knowledge_type: 'explicit',
          tags: [topic, expertiseArea].filter(Boolean),
        });
      }
    }

    setIsSaving(false);
    if (error) {
      toast({ title: 'Failed to complete', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Session completed!', description: 'Your knowledge has been captured.' });
      navigate('/dashboard');
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

          {isStarted && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{duration} min</span>
              </div>
              <Button variant="outline" onClick={saveSession} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save
              </Button>
              <Button onClick={completeSession} disabled={isSaving}>
                Complete Session
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container py-6 flex flex-col">
        {!isStarted ? (
          <div className="max-w-2xl mx-auto w-full">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-2xl">Start Knowledge Interview</CardTitle>
                    <p className="text-muted-foreground">Begin an AI-guided session to capture your expertise</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Session Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Legacy System Migration Expertise"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Topic Focus (optional)</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Database optimization, Client relationships"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Expertise Area</Label>
                  <Select value={expertiseArea} onValueChange={setExpertiseArea}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an area" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERTISE_AREAS.map((area) => (
                        <SelectItem key={area.value} value={area.value}>
                          {area.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" size="lg" onClick={startSession}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Interview
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="flex-1 flex flex-col border-border/50 overflow-hidden">
            <CardHeader className="border-b border-border/50 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-display">{title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {topic && `${topic} • `}
                    {EXPERTISE_AREAS.find(e => e.value === expertiseArea)?.label || 'General'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <InterviewChat
                sessionContext={{ topic, expertiseArea }}
                onMessagesChange={setMessages}
                initialMessages={messages}
              />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
