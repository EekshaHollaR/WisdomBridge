import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Brain, ArrowLeft, User, Calendar, Tag, Bookmark, BookmarkCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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

export default function KnowledgeDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, profile, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [item, setItem] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?mode=login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (id) {
      fetchKnowledge();
    }
  }, [id, profile]);

  const fetchKnowledge = async () => {
    setLoading(true);
    
    const { data: itemData, error } = await supabase
      .from('knowledge_items')
      .select(`
        *,
        expert:profiles!knowledge_items_expert_id_fkey (full_name, job_title, department, bio)
      `)
      .eq('id', id)
      .single();

    if (!error && itemData) {
      setItem(itemData);
      
      // Track access for learners
      if (role === 'learner' && profile?.id) {
        const { data: progressData } = await supabase
          .from('learning_progress')
          .select('*')
          .eq('knowledge_item_id', id)
          .eq('learner_id', profile.id)
          .maybeSingle();

        if (progressData) {
          setProgress(progressData);
          // Update last accessed
          await supabase
            .from('learning_progress')
            .update({ last_accessed_at: new Date().toISOString() })
            .eq('id', progressData.id);
        } else {
          // Create new progress record
          const { data: newProgress } = await supabase
            .from('learning_progress')
            .insert({
              learner_id: profile.id,
              knowledge_item_id: id,
              status: 'in_progress',
              completion_percentage: 25,
            })
            .select()
            .single();
          setProgress(newProgress);
        }
      }
    }
    setLoading(false);
  };

  const toggleBookmark = async () => {
    if (!progress?.id) return;
    
    const { error } = await supabase
      .from('learning_progress')
      .update({ bookmarked: !progress.bookmarked })
      .eq('id', progress.id);

    if (!error) {
      setProgress({ ...progress, bookmarked: !progress.bookmarked });
      toast({ title: progress.bookmarked ? 'Bookmark removed' : 'Bookmarked!' });
    }
  };

  const markComplete = async () => {
    if (!progress?.id) return;
    
    const { error } = await supabase
      .from('learning_progress')
      .update({ 
        status: 'completed',
        completion_percentage: 100,
        completed_at: new Date().toISOString()
      })
      .eq('id', progress.id);

    if (!error) {
      setProgress({ ...progress, status: 'completed', completion_percentage: 100 });
      toast({ title: 'Marked as complete! 🎉' });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Knowledge item not found</p>
            <Button className="mt-4" onClick={() => navigate('/knowledge')}>
              Back to Library
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/knowledge')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">WisdomBridge</span>
            </Link>
          </div>

          {role === 'learner' && progress && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={toggleBookmark}>
                {progress.bookmarked ? (
                  <BookmarkCheck className="w-4 h-4 text-primary" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </Button>
              {progress.status !== 'completed' && (
                <Button onClick={markComplete}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress bar for learners */}
          {role === 'learner' && progress && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Learning Progress</span>
                <span className="text-sm font-medium">{progress.completion_percentage}%</span>
              </div>
              <Progress value={progress.completion_percentage} className="h-2" />
            </div>
          )}

          <Card className="border-border/50 mb-6">
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-2">
                {EXPERTISE_AREAS.find(a => a.value === item.category)?.label || 'General'}
              </Badge>
              <CardTitle className="font-display text-3xl">{item.title}</CardTitle>
              
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{item.expert?.full_name || 'Unknown Expert'}</span>
                  {item.expert?.job_title && (
                    <span className="text-muted-foreground/70">• {item.expert.job_title}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(item.created_at), 'MMMM d, yyyy')}</span>
                </div>
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.tags.map((tag: string, idx: number) => (
                    <Badge key={idx} variant="outline">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {item.content.split('\n').map((paragraph: string, idx: number) => (
                  <p key={idx} className="mb-4 leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expert info card */}
          {item.expert && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-display text-lg">About the Expert</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.expert.full_name}</h4>
                    {item.expert.job_title && (
                      <p className="text-sm text-muted-foreground">{item.expert.job_title}</p>
                    )}
                    {item.expert.department && (
                      <p className="text-sm text-muted-foreground">{item.expert.department}</p>
                    )}
                    {item.expert.bio && (
                      <p className="mt-2 text-sm">{item.expert.bio}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
