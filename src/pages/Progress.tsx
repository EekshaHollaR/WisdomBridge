import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, ArrowLeft, BookOpen, CheckCircle2, Clock, Bookmark, TrendingUp, Target, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface ProgressItem {
  id: string;
  status: string;
  completion_percentage: number;
  bookmarked: boolean;
  last_accessed_at: string | null;
  completed_at: string | null;
  knowledge_item: {
    id: string;
    title: string;
    category: string | null;
    expert: {
      full_name: string;
    } | null;
  } | null;
}

export default function Progress() {
  const { user, profile, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    bookmarked: 0,
    avgCompletion: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?mode=login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile?.id && role === 'learner') {
      fetchProgress();
    }
  }, [profile, role]);

  const fetchProgress = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('learning_progress')
      .select(`
        id, status, completion_percentage, bookmarked, last_accessed_at, completed_at,
        knowledge_item:knowledge_items (
          id, title, category,
          expert:profiles!knowledge_items_expert_id_fkey (full_name)
        )
      `)
      .eq('learner_id', profile?.id)
      .order('last_accessed_at', { ascending: false, nullsFirst: false });

    if (!error && data) {
      const items = data.map(item => ({
        ...item,
        knowledge_item: item.knowledge_item as ProgressItem['knowledge_item']
      }));
      setProgressItems(items);
      
      // Calculate stats
      const completed = items.filter(i => i.status === 'completed').length;
      const inProgress = items.filter(i => i.status === 'in_progress').length;
      const bookmarked = items.filter(i => i.bookmarked).length;
      const avgCompletion = items.length > 0 
        ? Math.round(items.reduce((acc, i) => acc + (i.completion_percentage || 0), 0) / items.length)
        : 0;
      
      setStats({
        total: items.length,
        completed,
        inProgress,
        bookmarked,
        avgCompletion,
      });
    }
    setLoading(false);
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
            <TrendingUp className="w-8 h-8 text-primary" />
            My Learning Progress
          </h1>
          <p className="text-muted-foreground">Track your journey through expert knowledge</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Stats cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.total}</p>
                      <p className="text-sm text-muted-foreground">Items Started</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.completed}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.inProgress}</p>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.avgCompletion}%</p>
                      <p className="text-sm text-muted-foreground">Avg. Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress list */}
            {progressItems.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No learning progress yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start exploring the knowledge library to track your progress
                  </p>
                  <Button onClick={() => navigate('/knowledge')}>
                    Explore Knowledge
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-display font-semibold">Learning Items</h2>
                {progressItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className="border-border/50 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => navigate(`/knowledge/${item.knowledge_item?.id}`)}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">{item.knowledge_item?.title}</h3>
                            {item.bookmarked && (
                              <Bookmark className="w-4 h-4 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            By {item.knowledge_item?.expert?.full_name || 'Unknown Expert'}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            {item.status === 'completed' ? (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <Clock className="w-3 h-3 mr-1" />
                                In Progress
                              </Badge>
                            )}
                            {item.last_accessed_at && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Last accessed {format(new Date(item.last_accessed_at), 'MMM d')}
                              </p>
                            )}
                          </div>
                          
                          <div className="w-24">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{item.completion_percentage}%</span>
                            </div>
                            <ProgressBar value={item.completion_percentage} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
