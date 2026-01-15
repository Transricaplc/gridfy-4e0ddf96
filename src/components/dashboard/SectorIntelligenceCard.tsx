import { useState, useEffect } from 'react';
import { 
  MapPin, Shield, Cross, Phone, Camera, AlertTriangle, 
  Flame, Building2, Radio, Signal, X, ChevronRight
} from 'lucide-react';
import { suburbIntelligence, SuburbData } from '@/data/suburbIntelligence';
import { cn } from '@/lib/utils';

const getSafetyColor = (score: number) => {
  if (score >= 80) return 'hsl(160 84% 39%)';
  if (score >= 60) return 'hsl(38 92% 50%)';
  if (score >= 40) return 'hsl(25 95% 53%)';
  return 'hsl(0 84% 60%)';
};

const getRiskLabel = (score: number) => {
  if (score >= 80) return { label: 'LOW RISK', class: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  if (score >= 60) return { label: 'MODERATE', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
  if (score >= 40) return { label: 'HIGH RISK', class: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
  return { label: 'CRITICAL', class: 'bg-red-500/20 text-red-400 border-red-500/30' };
};

interface SectorIntelligenceCardProps {
  selectedSuburb: SuburbData | null;
  onClose: () => void;
}

const SectorIntelligenceCard = ({ selectedSuburb, onClose }: SectorIntelligenceCardProps) => {
  const [signalHealth, setSignalHealth] = useState(0);

  useEffect(() => {
    if (selectedSuburb) {
      // Animate signal health on suburb change
      setSignalHealth(0);
      const target = selectedSuburb.cctv_coverage;
      const duration = 1000;
      const steps = 20;
      const increment = target / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setSignalHealth(target);
          clearInterval(timer);
        } else {
          setSignalHealth(Math.round(current));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [selectedSuburb]);

  if (!selectedSuburb) {
    return (
      <div className="bg-card/50 backdrop-blur-md rounded-xl border border-border/50 p-6 text-center">
        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-muted-foreground text-sm">
          Search for an area to view sector intelligence
        </p>
      </div>
    );
  }

  const risk = getRiskLabel(selectedSuburb.safety_score);

  return (
    <div className="bg-card/80 backdrop-blur-xl rounded-xl border-2 border-primary/50 overflow-hidden shadow-xl shadow-primary/10 animate-scale-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/30 to-primary/10 px-4 py-3 border-b border-primary/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">{selectedSuburb.suburb_name}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <span>Ward {selectedSuburb.ward_id}</span>
                <span>•</span>
                <span>{selectedSuburb.area_code}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-background/50 transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Safety Score & Risk Badge */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Safety Score</div>
            <div 
              className="text-5xl font-black font-mono"
              style={{ color: getSafetyColor(selectedSuburb.safety_score) }}
            >
              {selectedSuburb.safety_score}
            </div>
          </div>
          <div className={cn('px-4 py-2 rounded-lg border font-bold text-sm', risk.class)}>
            {risk.label}
          </div>
        </div>

        {/* Live Signal Health */}
        <div className="bg-background/50 rounded-lg p-3 border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Signal className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-foreground">CCTV Signal Health</span>
            </div>
            <div className="flex items-center gap-1">
              <Radio className={cn(
                'w-3 h-3',
                signalHealth >= 70 ? 'text-emerald-400' : signalHealth >= 40 ? 'text-yellow-400' : 'text-red-400'
              )} />
              <span className="font-mono text-sm font-bold text-foreground">{signalHealth}%</span>
            </div>
          </div>
          <div className="h-2 bg-background rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-primary to-cyan-400"
              style={{ width: `${signalHealth}%` }}
            />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs">Incidents (24h)</span>
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">{selectedSuburb.incidents_24h}</div>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Camera className="w-4 h-4" />
              <span className="text-xs">Camera Coverage</span>
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">{selectedSuburb.cctv_coverage}%</div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="space-y-2">
          {/* SAPS */}
          <a
            href={`tel:${selectedSuburb.saps_contact.replace(/\s/g, '')}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <Shield className="w-5 h-5 text-blue-400 group-hover:text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground text-sm">{selectedSuburb.saps_station}</div>
              <div className="text-xs text-muted-foreground">Local SAPS Station</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-blue-400">{selectedSuburb.saps_contact}</span>
              <ChevronRight className="w-4 h-4 text-blue-400" />
            </div>
          </a>

          {/* Fire */}
          <a
            href={`tel:${selectedSuburb.fire_contact.replace(/\s/g, '')}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
              <Flame className="w-5 h-5 text-orange-400 group-hover:text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground text-sm">{selectedSuburb.fire_station}</div>
              <div className="text-xs text-muted-foreground">Fire & Rescue</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-orange-400">{selectedSuburb.fire_contact}</span>
              <ChevronRight className="w-4 h-4 text-orange-400" />
            </div>
          </a>

          {/* Hospital */}
          <a
            href={`tel:${selectedSuburb.hospital_contact.replace(/\s/g, '')}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center group-hover:bg-red-500 transition-colors">
              <Cross className="w-5 h-5 text-red-400 group-hover:text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground text-sm">{selectedSuburb.hospital_name}</div>
              <div className="text-xs text-muted-foreground">Nearest Hospital</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-red-400">{selectedSuburb.hospital_contact}</span>
              <ChevronRight className="w-4 h-4 text-red-400" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SectorIntelligenceCard;
