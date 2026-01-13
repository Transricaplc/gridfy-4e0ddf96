import { UberDangerZone } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface UberZoneCardProps {
  zone: UberDangerZone;
}

const dangerStyles = {
  CRITICAL: {
    container: 'bg-destructive/30 border-destructive',
    badge: 'bg-destructive text-destructive-foreground',
  },
  HIGH: {
    container: 'bg-safety-poor/30 border-safety-poor',
    badge: 'bg-safety-poor text-foreground',
  },
  MODERATE: {
    container: 'bg-safety-moderate/30 border-safety-moderate',
    badge: 'bg-safety-moderate text-background',
  },
};

const UberZoneCard = ({ zone }: UberZoneCardProps) => {
  const style = dangerStyles[zone.danger_level];

  return (
    <div className={cn(
      'rounded-xl p-4 lg:p-6 border-2 animate-fade-in',
      style.container
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl lg:text-2xl font-bold text-foreground">{zone.name}</h3>
        <div className={cn(
          'px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg font-black text-xs lg:text-sm',
          style.badge
        )}>
          {zone.danger_level}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:gap-3 mb-4">
        <div className="bg-background/50 rounded-lg p-2 lg:p-3">
          <div className="text-[10px] lg:text-xs text-muted-foreground mb-1">Risk Score</div>
          <div className="text-2xl lg:text-3xl font-black text-destructive">{zone.risk_score}/100</div>
        </div>
        <div className="bg-background/50 rounded-lg p-2 lg:p-3">
          <div className="text-[10px] lg:text-xs text-muted-foreground mb-1">Uber Incidents</div>
          <div className="text-2xl lg:text-3xl font-black text-safety-poor">{zone.incidents_uber}</div>
        </div>
      </div>

      <div className="bg-background/70 rounded-lg p-3 lg:p-4">
        <div className="text-[10px] lg:text-xs text-muted-foreground mb-1 lg:mb-2">⚠️ DRIVER RECOMMENDATION</div>
        <div className="text-xs lg:text-sm font-semibold text-foreground">{zone.recommendation}</div>
      </div>
    </div>
  );
};

export default UberZoneCard;
