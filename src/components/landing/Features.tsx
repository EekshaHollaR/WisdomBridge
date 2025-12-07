import { MessageSquare, Brain, BookOpen, BarChart3, Mic, Image } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: MessageSquare,
    title: 'AI-Guided Interviews',
    description: 'Intelligent questioning extracts both explicit procedures and tacit wisdom that experts struggle to articulate.',
    color: 'primary',
  },
  {
    icon: Mic,
    title: 'Voice Capture',
    description: 'Natural voice recording with real-time transcription makes sharing knowledge as easy as having a conversation.',
    color: 'expert',
  },
  {
    icon: Image,
    title: 'Visual Generation',
    description: 'AI transforms verbal descriptions into process diagrams, workflow charts, and technical illustrations.',
    color: 'accent',
  },
  {
    icon: Brain,
    title: 'Smart Structuring',
    description: 'Knowledge is automatically organized into searchable, interconnected modules with decision trees.',
    color: 'learner',
  },
  {
    icon: BookOpen,
    title: 'Adaptive Learning',
    description: 'Personalized learning paths adapt to each learner\'s background, role, and comprehension level.',
    color: 'wisdom-gold',
  },
  {
    icon: BarChart3,
    title: 'Impact Analytics',
    description: 'Track knowledge transfer progress, identify gaps, and measure ROI across your organization.',
    color: 'secondary',
  },
];

export function Features() {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Capture Knowledge That Would Otherwise Be Lost
          </h2>
          <p className="text-lg text-muted-foreground">
            Our multi-modal AI platform extracts, structures, and transfers institutional wisdom through intelligent conversations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-gradient-card animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                    feature.color === 'primary' ? 'bg-primary/10 text-primary' :
                    feature.color === 'expert' ? 'bg-expert/10 text-expert' :
                    feature.color === 'accent' ? 'bg-accent/10 text-accent' :
                    feature.color === 'learner' ? 'bg-learner/10 text-learner' :
                    feature.color === 'wisdom-gold' ? 'bg-wisdom-gold/10 text-wisdom-gold' :
                    'bg-secondary text-secondary-foreground'
                  }`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2 text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
