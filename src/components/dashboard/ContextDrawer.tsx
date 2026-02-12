import { memo } from 'react';
import { X, Shield, MapPin, Phone, AlertTriangle, Camera, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SelectedEntity } from '@/contexts/DashboardContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * Context Drawer — v1.1 Stabilized
 * 
 * Shows entity detail when a ward/suburb/asset is selected.
 * - Desktop: slides in from right, docks next to intelligence sidebar
 * - Mobile: bottom sheet
 * - Never overlays other panels
 * - Single scroll container
 * - Escape to close
 */

interface ContextDrawerProps {
  entity: SelectedEntity;
  onClose: () => void;
}

const ContextDrawer = memo(({ entity, onClose }: ContextDrawerProps) => {
  const isMobile = useIsMobile();
  const data = entity.data || {};

  const getEntityIcon = () => {
    switch (entity.type) {
      case 'ward': return <Shield className="w-4 h-4 text-primary" />;
      case 'suburb': return <MapPin className="w-4 h-4 text-primary" />;
      case 'cctv': return <Camera className="w-4 h-4 text-primary" />;
      default: return <Building2 className="w-4 h-4 text-primary" />;
    }
  };

  const safetyScore = data.safety_score as number | undefined;
  const getSafetyColor = (score: number) => {
    if (score >= 75) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-destructive';
  };

  return (
    <div className={cn(
      "fixed z-30 bg-card/98 backdrop-blur-xl border-border/50 shadow-2xl shadow-black/30",
      "animate-in duration-200",
      isMobile
        ? "bottom-0 left-0 right-0 max-h-[60vh] rounded-t-2xl border-t slide-in-from-bottom-4"
        : "right-0 top-12 bottom-0 w-80 lg:w-[22rem] border-l slide-in-from-right-4 lg:right-80"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border/40 bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-primary/15 shrink-0">
            {getEntityIcon()}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold truncate">{entity.name}</h3>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
              {entity.type} detail
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-muted/50 hover:bg-destructive/20 hover:text-destructive transition-colors shrink-0"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content — single scroll container */}
      <ScrollArea className={cn(
        isMobile ? "max-h-[calc(60vh-56px)]" : "h-[calc(100%-56px)]",
        "scrollbar-visible"
      )}>
        <div className="p-4 space-y-4">
          {/* Safety Score */}
          {safetyScore !== undefined && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30">
              <span className="text-xs text-muted-foreground font-medium">Safety Score</span>
              <span className={cn("text-2xl font-black font-mono tabular-nums", getSafetyColor(safetyScore))}>
                {safetyScore}
              </span>
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-2">
            {data.incidents_24h !== undefined && (
              <MetricCard label="Incidents (24h)" value={String(data.incidents_24h)} color="text-amber-400" />
            )}
            {data.cctv_coverage !== undefined && (
              <MetricCard label="CCTV Coverage" value={`${data.cctv_coverage}%`} color="text-primary" />
            )}
            {data.ward_id !== undefined && (
              <MetricCard label="Ward" value={String(data.ward_id)} color="text-muted-foreground" />
            )}
            {data.suburb_count !== undefined && (
              <MetricCard label="Suburbs" value={String(data.suburb_count)} color="text-muted-foreground" />
            )}
          </div>

          {/* Emergency Contacts */}
          {data.saps_station && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Emergency Contacts</h4>
              <EmergencyContact icon={Shield} label={String(data.saps_station)} phone={String(data.saps_contact)} color="text-blue-400" />
              {data.fire_station && (
                <EmergencyContact icon={AlertTriangle} label={String(data.fire_station)} phone={String(data.fire_contact)} color="text-destructive" />
              )}
              {data.hospital_name && (
                <EmergencyContact icon={Building2} label={String(data.hospital_name)} phone={String(data.hospital_contact)} color="text-emerald-400" />
              )}
            </div>
          )}

          {/* Suburbs list for ward entities */}
          {data.suburbs && Array.isArray(data.suburbs) && (
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Suburbs</h4>
              <div className="flex flex-wrap gap-1.5">
                {(data.suburbs as string[]).map((s, i) => (
                  <span key={i} className="px-2 py-1 rounded text-[10px] font-mono bg-muted/30 border border-border/30">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Asset-specific data */}
          {data.status && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30">
              <span className="text-xs text-muted-foreground">Status</span>
              <span className={cn(
                "text-xs font-bold uppercase px-2 py-0.5 rounded-full",
                data.status === 'operational' ? 'bg-emerald-500/20 text-emerald-400' :
                data.status === 'faulty' ? 'bg-amber-500/20 text-amber-400' :
                'bg-destructive/20 text-destructive'
              )}>
                {String(data.status)}
              </span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
});

ContextDrawer.displayName = 'ContextDrawer';

// Sub-components
const MetricCard = memo(({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="p-3 rounded-xl bg-background/50 border border-border/30">
    <div className="text-[10px] text-muted-foreground font-medium mb-1">{label}</div>
    <div className={cn("text-lg font-bold font-mono tabular-nums", color)}>{value}</div>
  </div>
));

MetricCard.displayName = 'MetricCard';

const EmergencyContact = memo(({ icon: Icon, label, phone, color }: { 
  icon: any; label: string; phone: string; color: string 
}) => (
  <a
    href={`tel:${phone.replace(/\s/g, '')}`}
    className="flex items-center gap-3 p-2.5 rounded-lg bg-background/50 border border-border/30 hover:border-primary/30 transition-colors"
  >
    <Icon className={cn("w-4 h-4 shrink-0", color)} />
    <div className="min-w-0 flex-1">
      <div className="text-xs font-medium truncate">{label}</div>
      <div className="text-[10px] text-muted-foreground font-mono">{phone}</div>
    </div>
    <Phone className="w-3 h-3 text-muted-foreground shrink-0" />
  </a>
));

EmergencyContact.displayName = 'EmergencyContact';

export default ContextDrawer;
