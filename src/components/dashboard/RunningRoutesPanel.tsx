import { PersonStanding, MapPin, Droplets, Lightbulb, Shield } from 'lucide-react';
import { useRunningRoutes, getDifficultyColor, getTerrainIcon, getSafetyColor } from '@/hooks/useRunningRoutes';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const RunningRoutesPanel = () => {
  const { routes, loading, getSafeRoutes } = useRunningRoutes();
  const safeRoutes = getSafeRoutes();

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-16 w-full bg-white/10" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header Stats */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <PersonStanding className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-medium text-foreground/90">Running Routes</span>
        </div>
        <Badge variant="outline" className="text-[10px] border-blue-400/30 text-blue-400">
          {safeRoutes.length} Safe Routes
        </Badge>
      </div>

      {/* Routes List */}
      <ScrollArea className="h-[280px]">
        <div className="space-y-2 pr-2">
          {routes.map(route => (
            <div 
              key={route.id}
              className={`bg-background/50 border rounded-lg p-3 transition-all ${
                route.is_open 
                  ? 'border-border/30 hover:border-border/60' 
                  : 'border-red-500/20 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{getTerrainIcon(route.terrain)}</span>
                    <span className="text-sm font-medium text-foreground/90">{route.name}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{route.location}</span>
                  </div>
                </div>
                <Badge 
                  className="text-[10px] font-mono shrink-0"
                  style={{ 
                    backgroundColor: `${getDifficultyColor(route.difficulty)}20`,
                    color: getDifficultyColor(route.difficulty),
                    border: `1px solid ${getDifficultyColor(route.difficulty)}40`
                  }}
                >
                  {route.difficulty}
                </Badge>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="font-mono">{route.distance_km}km</span>
                {route.is_lit && (
                  <div className="flex items-center gap-1 text-amber-400">
                    <Lightbulb className="w-3 h-3" />
                    <span>Lit</span>
                  </div>
                )}
                {route.has_water_stations && (
                  <div className="flex items-center gap-1 text-cyan-400">
                    <Droplets className="w-3 h-3" />
                    <span>Water</span>
                  </div>
                )}
                <div className="flex items-center gap-1 ml-auto">
                  <Shield className="w-3 h-3" style={{ color: getSafetyColor(route.safety_rating) }} />
                  <span className="font-mono" style={{ color: getSafetyColor(route.safety_rating) }}>
                    {route.safety_rating}/5
                  </span>
                </div>
              </div>

              {/* Notes */}
              {route.notes && (
                <p className="text-[10px] text-muted-foreground mt-2 line-clamp-1">{route.notes}</p>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RunningRoutesPanel;
