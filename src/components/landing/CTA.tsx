import { ArrowRight, Shield, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function CTA() {
  return (
    <section className="py-24 bg-gradient-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-6">
            Don't Let 30 Years of Expertise Retire in 30 Days
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Start capturing critical institutional knowledge today. Every day you wait, more invaluable wisdom walks out the door.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              asChild 
              size="lg" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl group"
            >
              <Link to="/auth">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/auth?mode=login">
                Sign In
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid sm:grid-cols-3 gap-6 pt-8 border-t border-primary-foreground/20">
            <div className="flex items-center justify-center gap-3 text-primary-foreground/80">
              <Clock className="w-5 h-5" />
              <span>Setup in 10 minutes</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-primary-foreground/80">
              <Shield className="w-5 h-5" />
              <span>Enterprise-grade security</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-primary-foreground/80">
              <TrendingUp className="w-5 h-5" />
              <span>Measurable ROI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
