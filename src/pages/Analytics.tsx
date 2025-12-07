import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, ArrowLeft, Users, BookOpen, TrendingUp, Activity, BarChart3, PieChart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function Analytics() {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalExperts: 0,
    totalLearners: 0,
    totalSessions: 0,
    completedSessions: 0,
    totalKnowledge: 0,
    totalProgress: 0,
    completedProgress: 0,
  });
  const [categoryBreakdown, setCategoryBreakdown] = useState<{ category: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?mode=login');
    }
    if (!authLoading && role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, role, authLoading, navigate]);

  useEffect(() => {
    if (role === 'admin') {
      fetchAnalytics();
    }
  }, [role]);

  const fetchAnalytics = async () => {
    setLoading(true);
    
    // Count experts
    const { count: expertCount } = await supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'expert');

    // Count learners
    const { count: learnerCount } = await supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'learner');

    // Count sessions
    const { count: sessionCount } = await supabase
      .from('interview_sessions')
      .select('*', { count: 'exact', head: true });

    const { count: completedSessionCount } = await supabase
      .from('interview_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    // Count knowledge items
    const { count: knowledgeCount } = await supabase
      .from('knowledge_items')
      .select('*', { count: 'exact', head: true });

    // Count learning progress
    const { count: progressCount } = await supabase
      .from('learning_progress')
      .select('*', { count: 'exact', head: true });

    const { count: completedProgressCount } = await supabase
      .from('learning_progress')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    // Get category breakdown
    const { data: knowledgeData } = await supabase
      .from('knowledge_items')
      .select('category');

    const categoryCounts: Record<string, number> = {};
    knowledgeData?.forEach(item => {
      const cat = item.category || 'other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    setCategoryBreakdown(
      Object.entries(categoryCounts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
    );

    setStats({
      totalExperts: expertCount || 0,
      totalLearners: learnerCount || 0,
      totalSessions: sessionCount || 0,
      completedSessions: completedSessionCount || 0,
      totalKnowledge: knowledgeCount || 0,
      totalProgress: progressCount || 0,
      completedProgress: completedProgressCount || 0,
    });

    setLoading(false);
  };

  const getCategoryLabel = (value: string) => {
    const labels: Record<string, string> = {
      engineering: 'Engineering',
      manufacturing: 'Manufacturing',
      healthcare: 'Healthcare',
      finance: 'Finance',
      technology: 'Technology',
      operations: 'Operations',
      sales: 'Sales',
      marketing: 'Marketing',
      hr: 'Human Resources',
      other: 'Other',
    };
    return labels[value] || value;
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
            <BarChart3 className="w-8 h-8 text-primary" />
            Organization Analytics
          </h1>
          <p className="text-muted-foreground">Overview of your knowledge transfer program</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Overview stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="border-border/50 bg-gradient-to-br from-expert/5 to-expert/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-expert/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-expert" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalExperts}</p>
                      <p className="text-sm text-muted-foreground">Experts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-gradient-to-br from-learner/5 to-learner/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-learner/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-learner" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalLearners}</p>
                      <p className="text-sm text-muted-foreground">Learners</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalSessions}</p>
                      <p className="text-sm text-muted-foreground">Sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalKnowledge}</p>
                      <p className="text-sm text-muted-foreground">Knowledge Items</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress metrics */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Session Completion
                  </CardTitle>
                  <CardDescription>
                    {stats.completedSessions} of {stats.totalSessions} sessions completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress 
                    value={stats.totalSessions > 0 ? (stats.completedSessions / stats.totalSessions) * 100 : 0} 
                    className="h-4 mb-2" 
                  />
                  <p className="text-sm text-muted-foreground text-right">
                    {stats.totalSessions > 0 ? Math.round((stats.completedSessions / stats.totalSessions) * 100) : 0}% completion rate
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-learner" />
                    Learning Completion
                  </CardTitle>
                  <CardDescription>
                    {stats.completedProgress} of {stats.totalProgress} learning items completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress 
                    value={stats.totalProgress > 0 ? (stats.completedProgress / stats.totalProgress) * 100 : 0} 
                    className="h-4 mb-2" 
                  />
                  <p className="text-sm text-muted-foreground text-right">
                    {stats.totalProgress > 0 ? Math.round((stats.completedProgress / stats.totalProgress) * 100) : 0}% completion rate
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Category breakdown */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Knowledge by Category
                </CardTitle>
                <CardDescription>Distribution of captured knowledge across expertise areas</CardDescription>
              </CardHeader>
              <CardContent>
                {categoryBreakdown.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No knowledge items captured yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {categoryBreakdown.map((item) => (
                      <div key={item.category} className="flex items-center gap-4">
                        <div className="w-32 text-sm font-medium truncate">
                          {getCategoryLabel(item.category)}
                        </div>
                        <div className="flex-1">
                          <Progress 
                            value={(item.count / stats.totalKnowledge) * 100} 
                            className="h-3" 
                          />
                        </div>
                        <div className="w-12 text-sm text-right text-muted-foreground">
                          {item.count}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
