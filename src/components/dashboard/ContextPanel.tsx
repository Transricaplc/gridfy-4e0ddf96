import { useEffect, useState } from 'react';
import { 
  X, MapPin, Clock, AlertTriangle, Camera, TrafficCone,
  ChevronRight, Activity, Link2, History, ExternalLink,
  Shield, Zap, TrendingUp, TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboard, SelectedEntity } from '@/contexts/DashboardContext';
import { useOntology } from '@/hooks/useOntology';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

/**
 * Level 3 - Context Panel
 * Slide-in panel that appears when user clicks a map object.
 * Shows related entities, not raw tables.
 */
const ContextPanel = () => {
  const { selectedEntity, contextPanelOpen, closeContextPanel } = useDashboard();
  const { getEntityNeighborhood, entities, relationships } = useOntology();
  const [neighbors, setNeighbors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedEntity?.id) {
      setLoading(true);
      getEntityNeighborhood(selectedEntity.id, 2)
        .then(setNeighbors)
        .finally(() => setLoading(false));
    }
  }, [selectedEntity?.id, getEntityNeighborhood]);

  if (!contextPanelOpen || !selectedEntity) return null;

  return (
    <div className={cn(
      "fixed right-0 top-0 h-full w-[400px] z-50",
      "bg-card/95 backdrop-blur-xl border-l border-border/50 shadow-2xl",
      "transform transition-transform duration-300 ease-out",
      contextPanelOpen ? "translate-x-0" : "translate-x-full"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            getTypeStyle(selectedEntity.type).bg
          )}>
            {getTypeIcon(selectedEntity.type)}
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{selectedEntity.name}</h2>
            <p className="text-xs text-muted-foreground capitalize">
              {selectedEntity.type?.replace('_', ' ')}
            </p>
          </div>
        </div>
        <button
          onClick={closeContextPanel}
          className="p-2 rounded-lg hover:bg-background/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <ScrollArea className="h-[calc(100%-80px)]">
        <div className="p-4 space-y-4">
          {/* Quick Stats */}
          <QuickStatsGrid entity={selectedEntity} />

          <Separator />

          {/* Location Context */}
          {selectedEntity.coordinates && (
            <Card className="bg-background/30 border-border/30">
              <CardHeader className="py-2 px-3">
                <CardTitle className="text-xs font-medium flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-primary" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <p className="text-xs text-muted-foreground font-mono">
                  {selectedEntity.coordinates.lat.toFixed(6)}, {selectedEntity.coordinates.lng.toFixed(6)}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Related Entities - "Why is this happening here?" */}
          <Card className="bg-background/30 border-border/30">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-xs font-medium flex items-center gap-2">
                <Link2 className="w-3 h-3 text-primary" />
                Related Entities
                {loading && <span className="text-muted-foreground">(loading...)</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              {neighbors.length > 0 ? (
                <div className="space-y-2">
                  {neighbors.slice(0, 8).map((neighbor, idx) => (
                    <RelatedEntityCard key={idx} neighbor={neighbor} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  No related entities found
                </p>
              )}
            </CardContent>
          </Card>

          {/* Linked Incidents */}
          <Card className="bg-background/30 border-border/30">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-3 h-3 text-orange-400" />
                Linked Incidents
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <IncidentList entityId={selectedEntity.id} />
            </CardContent>
          </Card>

          {/* Historical Changes */}
          <Card className="bg-background/30 border-border/30">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-xs font-medium flex items-center gap-2">
                <History className="w-3 h-3 text-primary" />
                Recent Changes
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <ChangeHistory entityId={selectedEntity.id} />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-medium">
              <ExternalLink className="w-3 h-3" />
              Full Details
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors text-xs font-medium">
              <Activity className="w-3 h-3" />
              View Trends
            </button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

// Helper Components

const QuickStatsGrid = ({ entity }: { entity: SelectedEntity }) => {
  const stats = [
    { label: 'Status', value: 'Operational', icon: Shield, color: 'text-emerald-400' },
    { label: 'Risk Level', value: 'Low', icon: AlertTriangle, color: 'text-emerald-400' },
    { label: 'Last Update', value: '2m ago', icon: Clock, color: 'text-muted-foreground' },
    { label: 'Connections', value: '5', icon: Link2, color: 'text-primary' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((stat) => (
        <div key={stat.label} className="p-2 rounded-lg bg-background/30 border border-border/30">
          <div className="flex items-center gap-2 mb-1">
            <stat.icon className={cn("w-3 h-3", stat.color)} />
            <span className="text-[10px] text-muted-foreground uppercase">{stat.label}</span>
          </div>
          <p className={cn("text-sm font-semibold", stat.color)}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

const RelatedEntityCard = ({ neighbor }: { neighbor: any }) => (
  <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors text-left">
    <div className="p-1.5 rounded bg-primary/10">
      {getTypeIcon(neighbor.entity_type)}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium truncate">{neighbor.entity_name}</p>
      <p className="text-[10px] text-muted-foreground">
        {neighbor.relationship_type} • {neighbor.direction}
      </p>
    </div>
    <ChevronRight className="w-3 h-3 text-muted-foreground" />
  </button>
);

const IncidentList = ({ entityId }: { entityId: string }) => {
  // Mock incidents - would be fetched based on entity
  const incidents = [
    { id: 1, title: 'Camera offline briefly', time: '2h ago', severity: 'low' },
    { id: 2, title: 'Maintenance scheduled', time: '1d ago', severity: 'info' },
  ];

  return (
    <div className="space-y-2">
      {incidents.map((incident) => (
        <div key={incident.id} className="flex items-center gap-2 p-2 rounded-lg bg-background/20">
          <Badge variant="outline" className={cn(
            "text-[8px]",
            incident.severity === 'low' ? 'border-amber-500/50 text-amber-400' : 'border-blue-500/50 text-blue-400'
          )}>
            {incident.severity}
          </Badge>
          <span className="text-xs flex-1 truncate">{incident.title}</span>
          <span className="text-[10px] text-muted-foreground">{incident.time}</span>
        </div>
      ))}
    </div>
  );
};

const ChangeHistory = ({ entityId }: { entityId: string }) => {
  // Mock history - would be fetched from ontology_lineage
  const history = [
    { action: 'Status updated', time: '5m ago', by: 'System' },
    { action: 'Location verified', time: '2h ago', by: 'Admin' },
    { action: 'Created', time: '30d ago', by: 'Import' },
  ];

  return (
    <div className="space-y-2">
      {history.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2 text-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="flex-1">{item.action}</span>
          <span className="text-muted-foreground">{item.time}</span>
        </div>
      ))}
    </div>
  );
};

// Utility functions

const getTypeIcon = (type: string | null) => {
  switch (type) {
    case 'cctv': return <Camera className="w-4 h-4" />;
    case 'traffic_signal': return <TrafficCone className="w-4 h-4" />;
    case 'incident': return <AlertTriangle className="w-4 h-4" />;
    default: return <MapPin className="w-4 h-4" />;
  }
};

const getTypeStyle = (type: string | null) => {
  switch (type) {
    case 'cctv': return { bg: 'bg-blue-500/20', text: 'text-blue-400' };
    case 'traffic_signal': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400' };
    case 'incident': return { bg: 'bg-orange-500/20', text: 'text-orange-400' };
    default: return { bg: 'bg-primary/20', text: 'text-primary' };
  }
};

export default ContextPanel;
