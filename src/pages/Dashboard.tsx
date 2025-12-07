import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, LogOut, MessageSquare, BookOpen, BarChart3, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user, profile, role, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth?mode=login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const roleDisplay = !role ? 'Loading...' : role === 'expert' ? '🧠 Expert' : role === 'learner' ? '📚 Learner' : '⚙️ Admin';

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">WisdomBridge</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-foreground">{profile?.full_name || 'User'}</div>
              <div className="text-xs text-muted-foreground">{roleDisplay}</div>
            </div>
            <Button variant="outline" size="icon" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Welcome, {profile?.full_name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-muted-foreground">
            {role === 'expert'
              ? 'Ready to share your expertise and preserve your institutional knowledge?'
              : role === 'learner'
                ? 'Explore curated knowledge from experienced professionals.'
                : 'Manage your organization\'s knowledge transfer program.'}
          </p>
        </div>

        {/* Quick actions based on role */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {role === 'expert' && (
            <>
              <Card className="hover:shadow-lg transition-all border-border/50 group cursor-pointer" onClick={() => navigate('/interview')}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <CardTitle className="font-display">Start Interview</CardTitle>
                  <CardDescription>Begin an AI-guided knowledge capture session</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Start Session</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all border-border/50 group cursor-pointer" onClick={() => navigate('/knowledge')}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-expert/10 text-expert flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <CardTitle className="font-display">My Knowledge</CardTitle>
                  <CardDescription>View and manage your captured knowledge</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">View Knowledge</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all border-border/50 group cursor-pointer" onClick={() => navigate('/impact')}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <CardTitle className="font-display">Impact</CardTitle>
                  <CardDescription>See how many learners you've helped</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">View Stats</Button>
                </CardContent>
              </Card>
            </>
          )}

          {role === 'learner' && (
            <>
              <Card className="hover:shadow-lg transition-all border-border/50 group cursor-pointer" onClick={() => navigate('/knowledge')}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-learner/10 text-learner flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <CardTitle className="font-display">Explore Knowledge</CardTitle>
                  <CardDescription>Browse available expert knowledge</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Browse</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all border-border/50 group cursor-pointer" onClick={() => navigate('/ask')}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <CardTitle className="font-display">Ask Questions</CardTitle>
                  <CardDescription>Get AI-powered answers from captured knowledge</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">Ask AI</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all border-border/50 group cursor-pointer" onClick={() => navigate('/progress')}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <CardTitle className="font-display">My Progress</CardTitle>
                  <CardDescription>Track your learning journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">View Progress</Button>
                </CardContent>
              </Card>
            </>
          )}

          {role === 'admin' && (
            <>
              <Card className="hover:shadow-lg transition-all border-border/50 group cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6" />
                  </div>
                  <CardTitle className="font-display">Manage Users</CardTitle>
                  <CardDescription>View and manage experts and learners</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Manage</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all border-border/50 group cursor-pointer" onClick={() => navigate('/knowledge')}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-expert/10 text-expert flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <CardTitle className="font-display">Knowledge Base</CardTitle>
                  <CardDescription>Review all captured institutional knowledge</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">Review</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all border-border/50 group cursor-pointer" onClick={() => navigate('/analytics')}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <CardTitle className="font-display">Analytics</CardTitle>
                  <CardDescription>Organization-wide knowledge metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">View Analytics</Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
