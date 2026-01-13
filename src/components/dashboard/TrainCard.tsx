import { Train } from 'lucide-react';
import { TrainRoute } from '@/types/dashboard';
import { getSafetyColor, cn } from '@/lib/utils';

interface TrainCardProps {
  train: TrainRoute;
}

const statusStyles = {
  critical: {
    container: 'bg-destructive/20 border-destructive',
    badge: 'bg-destructive text-destructive-foreground',
    message: '🚨 CRITICAL - AVOID IF POSSIBLE',
  },
  high_risk: {
    container: 'bg-safety-poor/20 border-safety-poor',
    badge: 'bg-safety-poor text-foreground',
    message: '⚠️ HIGH RISK - EXERCISE EXTREME CAUTION',
  },
  moderate: {
    container: 'bg-safety-moderate/20 border-safety-moderate',
    badge: 'bg-safety-moderate text-background',
    message: '⚠️ MODERATE RISK - STAY ALERT',
  },
};

const TrainCard = ({ train }: TrainCardProps) => {
  const style = statusStyles[train.status];

  return (
    <div className={cn(
      'rounded-xl p-4 lg:p-6 border-2 animate-fade-in',
      style.container
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg lg:text-xl font-bold text-foreground flex items-center">
          <Train className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
          {train.name}
        </h3>
        <div 
          className="text-2xl lg:text-3xl font-black"
          style={{ color: getSafetyColor(train.safety_score) }}
        >
          {train.safety_score}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 lg:gap-3 mb-4">
        <div className="bg-background/50 rounded-lg p-2 lg:p-3">
          <div className="text-[10px] lg:text-xs text-muted-foreground mb-1">Stations</div>
          <div className="text-lg lg:text-xl font-bold text-foreground">{train.stations}</div>
        </div>
        <div className="bg-background/50 rounded-lg p-2 lg:p-3">
          <div className="text-[10px] lg:text-xs text-muted-foreground mb-1">Cameras</div>
          <div className="text-lg lg:text-xl font-bold text-safety-good">
            {train.operating_cameras}/{train.total_cameras}
          </div>
        </div>
        <div className="bg-background/50 rounded-lg p-2 lg:p-3">
          <div className="text-[10px] lg:text-xs text-muted-foreground mb-1">Incidents</div>
          <div className="text-lg lg:text-xl font-bold text-destructive">{train.incidents_24h}</div>
        </div>
      </div>

      <div className={cn(
        'px-4 py-2 rounded-lg font-bold text-center text-xs lg:text-sm',
        style.badge
      )}>
        {style.message}
      </div>
    </div>
  );
};

export default TrainCard;
