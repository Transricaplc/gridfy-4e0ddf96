import { Video, VideoOff } from 'lucide-react';
import { MajorRoute } from '@/types/dashboard';
import { getSafetyColor } from '@/lib/utils';

interface RouteCardProps {
  route: MajorRoute;
  onClick: () => void;
}

const RouteCard = ({ route, onClick }: RouteCardProps) => {
  const coveragePercent = Math.round((route.functioning / route.total_cameras) * 100);

  return (
    <div 
      className="bg-card rounded-xl p-4 lg:p-6 border-2 border-border card-hover cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <h3 className="text-lg lg:text-xl font-bold text-foreground">{route.id}</h3>
        <div 
          className="text-2xl lg:text-3xl font-black"
          style={{ color: getSafetyColor(route.safety_score) }}
        >
          {route.safety_score}
        </div>
      </div>
      
      <div className="text-xs lg:text-sm text-muted-foreground mb-3 lg:mb-4">{route.name}</div>
      
      <div className="grid grid-cols-2 gap-2 lg:gap-3 mb-3 lg:mb-4">
        <div className="bg-background rounded-lg p-2 lg:p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Video className="w-3 h-3 lg:w-4 lg:h-4 text-safety-good" />
            <span className="text-[10px] lg:text-xs text-muted-foreground">Active</span>
          </div>
          <div className="text-lg lg:text-xl font-bold text-foreground">{route.functioning}</div>
        </div>
        
        <div className="bg-background rounded-lg p-2 lg:p-3">
          <div className="flex items-center space-x-2 mb-1">
            <VideoOff className="w-3 h-3 lg:w-4 lg:h-4 text-destructive" />
            <span className="text-[10px] lg:text-xs text-muted-foreground">Offline</span>
          </div>
          <div className="text-lg lg:text-xl font-bold text-foreground">{route.offline}</div>
        </div>
      </div>
      
      <div className="bg-background rounded-lg p-2 lg:p-3">
        <div className="flex items-center justify-between text-[10px] lg:text-xs text-muted-foreground mb-1">
          <span>Coverage</span>
          <span>{coveragePercent}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-1.5 lg:h-2">
          <div 
            className="progress-gradient h-1.5 lg:h-2 rounded-full transition-all duration-500"
            style={{ width: `${coveragePercent}%` }}
          />
        </div>
      </div>
      
      <div className="mt-3 lg:mt-4 flex items-center justify-between text-xs lg:text-sm">
        <span className="text-muted-foreground">Incidents (24h)</span>
        <span className="font-bold text-safety-poor">{route.incidents_24h}</span>
      </div>
    </div>
  );
};

export default RouteCard;
