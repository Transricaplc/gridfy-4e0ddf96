import { Activity, Shield, BarChart3, Building2, Users, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Activity,
    title: 'Real-time Traffic Monitoring',
    description: 'Live congestion data across major routes and intersections.',
  },
  {
    icon: Shield,
    title: 'Incident Response Tracking',
    description: 'Track active incidents with response times and coverage.',
  },
  {
    icon: BarChart3,
    title: 'Safety Analytics & Insights',
    description: 'Predictive safety scoring with historical trend analysis.',
  },
  {
    icon: Building2,
    title: 'Infrastructure Reporting',
    description: 'Monitor CCTV, signals, and utility status city-wide.',
  },
  {
    icon: Users,
    title: 'Community Engagement',
    description: 'Citizen reports and crowd-sourced safety intelligence.',
  },
];

interface HeroSectionProps {
  onEnterDashboard: () => void;
}

const HeroSection = ({ onEnterDashboard }: HeroSectionProps) => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden px-4 py-16">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-primary tracking-wide uppercase">Live Intelligence Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
          Real-time Urban Intelligence{' '}
          <span className="text-primary">for Safer Communities</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Monitor traffic patterns, incident reports, safety metrics, and city infrastructure data in one comprehensive dashboard
        </p>

        {/* CTA */}
        <button
          onClick={onEnterDashboard}
          className={cn(
            "inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 transition-all shadow-lg shadow-primary/25",
            "hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          )}
        >
          Enter Dashboard
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </button>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-12 max-w-3xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={cn(
                  "flex flex-col items-center gap-3 p-5 rounded-xl",
                  "bg-card/50 border border-border/50 backdrop-blur-sm",
                  "hover:border-primary/30 hover:bg-card/80 transition-all"
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground text-center leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
