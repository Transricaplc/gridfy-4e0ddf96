import { MajorRoute, RouteSection } from '@/types/dashboard';
import { getSafetyColor, cn } from '@/lib/utils';

interface RouteDetailProps {
  route: MajorRoute;
}

const statusStyles: Record<RouteSection['status'], string> = {
  good: 'badge-good',
  moderate: 'badge-moderate',
  poor: 'badge-poor',
  critical: 'badge-critical',
};

const RouteDetail = ({ route }: RouteDetailProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card rounded-xl p-4 lg:p-6 border-2 border-primary">
        <h2 className="text-xl lg:text-2xl font-black text-foreground mb-4 lg:mb-6">
          {route.name} - Detailed Coverage
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
          <div className="bg-background rounded-lg p-3 lg:p-4">
            <div className="text-xs lg:text-sm text-muted-foreground mb-1">Total Cameras</div>
            <div className="text-2xl lg:text-3xl font-black text-foreground">{route.total_cameras}</div>
          </div>
          <div className="bg-background rounded-lg p-3 lg:p-4">
            <div className="text-xs lg:text-sm text-muted-foreground mb-1">Functioning</div>
            <div className="text-2xl lg:text-3xl font-black text-safety-good">{route.functioning}</div>
          </div>
          <div className="bg-background rounded-lg p-3 lg:p-4">
            <div className="text-xs lg:text-sm text-muted-foreground mb-1">Offline</div>
            <div className="text-2xl lg:text-3xl font-black text-destructive">{route.offline}</div>
          </div>
          <div className="bg-background rounded-lg p-3 lg:p-4">
            <div className="text-xs lg:text-sm text-muted-foreground mb-1">Safety Score</div>
            <div 
              className="text-2xl lg:text-3xl font-black"
              style={{ color: getSafetyColor(route.safety_score) }}
            >
              {route.safety_score}
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg p-4 lg:p-6">
          <h3 className="font-bold text-foreground mb-4">Section Coverage</h3>
          <div className="space-y-3">
            {route.sections.map((section, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 lg:p-4 bg-card rounded-lg"
              >
                <div className="flex items-center space-x-3 lg:space-x-4">
                  <div className="text-xl lg:text-2xl font-bold text-muted-foreground">#{idx + 1}</div>
                  <div>
                    <div className="font-semibold text-foreground text-sm lg:text-base">{section.name}</div>
                    <div className="text-xs lg:text-sm text-muted-foreground">{section.cameras} cameras</div>
                  </div>
                </div>
                <div className={cn(
                  'px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg font-bold text-xs lg:text-sm',
                  statusStyles[section.status]
                )}>
                  {section.status.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteDetail;
