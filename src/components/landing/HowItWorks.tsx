import { ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Expert Onboarding',
    description: 'Retiring experts create their profile and identify key knowledge areas to document before they leave.',
    highlight: 'Takes just 10 minutes',
  },
  {
    number: '02',
    title: 'AI Interview Sessions',
    description: 'Our AI conducts deep-dive interviews, asking intelligent follow-up questions to uncover hidden insights.',
    highlight: 'Natural conversation flow',
  },
  {
    number: '03',
    title: 'Knowledge Structuring',
    description: 'AI automatically organizes captured knowledge into searchable modules with visual aids and decision trees.',
    highlight: 'Instant organization',
  },
  {
    number: '04',
    title: 'Learner Access',
    description: 'New team members access curated knowledge paths personalized to their role and learning needs.',
    highlight: 'Adaptive learning',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            How WisdomBridge Works
          </h2>
          <p className="text-lg text-muted-foreground">
            A simple four-step process to preserve decades of expertise for future generations.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={step.number} 
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Step card */}
                <div className="relative z-10 p-6 rounded-2xl bg-card border border-border shadow-md hover:shadow-lg transition-shadow">
                  {/* Number */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center font-display font-bold text-xl mb-4 shadow-glow">
                    {step.number}
                  </div>

                  <h3 className="text-xl font-display font-semibold mb-2 text-card-foreground">{step.title}</h3>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  
                  <div className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                    {step.highlight}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 w-8 h-8 bg-background rounded-full items-center justify-center z-20 border border-border">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
