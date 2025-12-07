import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, ArrowLeft, Users, BookOpen, Clock, TrendingUp, Award, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface SessionSummary {
  id: string;
  title: string;
  status: string;
  duration_minutes: number;
  created_at: string;
  expertise_area: string | null;
}

export default function Impact() {
  const { user, profile, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [knowledgeItems, setKnowledgeItems] = useState<any[]>([]);
  const [learnerCount, setLearnerCount] = useState(0);
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    totalDuration: 0,
    totalKnowledge: 0,
    learnersReached: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?mode=login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile?.id && role === 'expert') {
      fetchImpactData();
    }
  }, [profile, role]);

  const fetchImpactData = async () => {
    setLoading(true);
    
    // Fetch sessions
    const { data: sessionData } = await supabase
      .from('interview_sessions')
      .select('id, title, status, duration_minutes, created_at, expertise_area')
      .eq('expert_id', profile?.id)
      .order('created_at', { ascending: false });

    if (sessionData) {
      setSessions(sessionData);
    }

    // Fetch knowledge items
    const { data: knowledgeData } = await supabase
      .from('knowledge_items')
      .select('id, title, category, created_at')
      .eq('expert_id', profile?.id)
      .order('created_at', { ascending: false });

    if (knowledgeData) {
      setKnowledgeItems(knowledgeData);

      // Count learners who accessed this expert's knowledge
      const knowledgeIds = knowledgeData.map(k => k.id);
      if (knowledgeIds.length > 0) {
        const { count } = await supabase
          .from('learning_progress')
          .select('learner_id', { count: 'exact', head: true })
          .in('knowledge_item_id', knowledgeIds);
        
        setLearnerCount(count || 0);
      }
    }

    // Calculate stats
    const completedSessions = sessionData?.filter(s => s.status === 'completed').length || 0;
    const totalDuration = sessionData?.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) || 0;

    setStats({
      totalSessions: sessionData?.length || 0,
      completedSessions,
      totalDuration,
      totalKnowledge: knowledgeData?.length || 0,
      learnersReached: learnerCount,
    });

    setLoading(false);
  };

  const getCompletionRate = () => {
    if (stats.totalSessions === 0) return 0;
    return Math.round((stats.completedSessions / stats.totalSessions) * 100);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
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
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-3">
            <Award className="w-8 h-8 text-primary" />
            Your Impact
          </h1>
          <p className="text-muted-foreground">See how your knowledge is helping others grow</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Impact stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalSessions}</p>
                      <p className="text-sm text-muted-foreground">Interview Sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-expert/10 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-expert" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalKnowledge}</p>
                      <p className="text-sm text-muted-foreground">Knowledge Items</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-learner/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-learner" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{learnerCount}</p>
                      <p className="text-sm text-muted-foreground">Learners Reached</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalDuration}</p>
                      <p className="text-sm text-muted-foreground">Minutes Shared</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Session completion progress */}
            <Card className="border-border/50 mb-8">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Session Completion Rate
                </CardTitle>
                <CardDescription>
                  {stats.completedSessions} of {stats.totalSessions} sessions completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={getCompletionRate()} className="h-3 mb-2" />
                <p className="text-sm text-muted-foreground text-right">{getCompletionRate()}% complete</p>
              </CardContent>
            </Card>

            {/* Recent sessions */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-display">Recent Sessions</CardTitle>
                  <CardDescription>Your latest interview sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  {sessions.length === 0 ? (
                    <div className="text-center py-6">
                      <Sparkles className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">No sessions yet</p>
                      <Button onClick={() => navigate('/interview')}>Start First Interview</Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sessions.slice(0, 5).map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium truncate max-w-[200px]">{session.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(session.created_at), 'MMM d, yyyy')} • {session.duration_minutes || 0} min
                            </p>
                          </div>
                          <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                            {session.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-display">Knowledge Created</CardTitle>
                  <CardDescription>Your captured expertise</CardDescription>
                </CardHeader>
                <CardContent>
                  {knowledgeItems.length === 0 ? (
                    <div className="text-center py-6">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">Complete an interview to create knowledge</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {knowledgeItems.slice(0, 5).map((item) => (
                        <div 
                          key={item.id} 
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                          onClick={() => navigate(`/knowledge/${item.id}`)}
                        >
                          <div>
                            <p className="font-medium truncate max-w-[200px]">{item.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(item.created_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <Badge variant="outline">{item.category || 'General'}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
