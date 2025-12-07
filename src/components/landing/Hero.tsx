import { ArrowRight, Brain, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-hero">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Knowledge Transfer</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Preserve <span className="text-gradient-primary">Decades of Wisdom</span> Before It Walks Out the Door
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              WisdomBridge AI captures and transfers critical institutional knowledge from retiring experts to the next generation through intelligent, adaptive mentorship.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button asChild size="lg" className="group shadow-lg hover:shadow-accent transition-all">
                <Link to="/auth">
                  Start Capturing Knowledge
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/auth?mode=login">
                  Sign In
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div>
                <div className="text-2xl md:text-3xl font-display font-bold text-foreground">$300K+</div>
                <div className="text-sm text-muted-foreground">Weekly savings potential</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-display font-bold text-foreground">48%</div>
                <div className="text-sm text-muted-foreground">Efficiency improvement</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-display font-bold text-foreground">76M</div>
                <div className="text-sm text-muted-foreground">Retiring experts</div>
              </div>
            </div>
          </div>

          {/* Right illustration */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {/* Knowledge flow visualization */}
              <div className="relative">
                {/* Expert card */}
                <div className="absolute -top-4 -left-4 w-64 p-6 rounded-2xl bg-card shadow-xl border border-border animate-float">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-expert flex items-center justify-center">
                      <Brain className="w-6 h-6 text-expert-foreground" />
                    </div>
                    <div>
                      <div className="font-display font-semibold text-card-foreground">Expert</div>
                      <div className="text-sm text-muted-foreground">30+ years experience</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-expert/20 rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-expert rounded-full" />
                    </div>
                    <div className="text-xs text-muted-foreground">Knowledge captured: 80%</div>
                  </div>
                </div>

                {/* Center AI visualization */}
                <div className="mx-auto w-48 h-48 rounded-full bg-gradient-primary shadow-glow flex items-center justify-center" style={{ marginTop: '80px' }}>
                  <div className="w-40 h-40 rounded-full bg-card flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-primary" />
                  </div>
                </div>

                {/* Learner card */}
                <div className="absolute -bottom-4 -right-4 w-64 p-6 rounded-2xl bg-card shadow-xl border border-border animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-learner flex items-center justify-center">
                      <Users className="w-6 h-6 text-learner-foreground" />
                    </div>
                    <div>
                      <div className="font-display font-semibold text-card-foreground">Learner</div>
                      <div className="text-sm text-muted-foreground">Rising talent</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-learner/20 rounded-full overflow-hidden">
                      <div className="h-full w-3/5 bg-learner rounded-full" />
                    </div>
                    <div className="text-xs text-muted-foreground">Knowledge absorbed: 60%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
