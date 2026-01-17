import { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, Camera, Activity, Clock, 
  TrendingUp, TrendingDown, Bell, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboard } from '@/contexts/DashboardContext';
import { useCityIntelligence } from '@/hooks/useCityKPIs';
import { useAssets } from '@/hooks/useAssets';

/**
 * Level 1 - Global Status Bar
 * Always visible at top. Answers: "What is the state of the city right now?"
 */
const GlobalStatusBar = () => {
  const { timeFilter, setTimeFilter } = useDashboard();
  const { activeAlerts, kpis } = useCityIntelligence();
  const { stats } = useAssets();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate city health based on KPIs
  const safetyKPI = kpis.find(k => k.kpi_code === 'safety_score');
  const cityHealth = safetyKPI?.current_value ?? 78;
  
  const getHealthStatus = (score: number) => {
    if (score >= 80) return { label: 'HEALTHY', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 60) return { label: 'MODERATE', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (score >= 40) return { label: 'ELEVATED', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' };
    return { label: 'CRITICAL', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
  };

  const healthStatus = getHealthStatus(cityHealth);
  const criticalAlerts = activeAlerts.filter(a => a.priority === 'critical').length;
  const highRiskZones = 3; // Would come from real data

  return (
    <div className="bg-card/80 backdrop-blur-xl border-b border-border/50 px-4 py-2">
      <div className="max-w-[2000px] mx-auto flex items-center justify-between gap-4">
        {/* Left: City Health Summary */}
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg border",
            healthStatus.color
          )}>
            <Shield className="w-4 h-4" />
            <span className="text-xs font-tactical font-bold">{healthStatus.label}</span>
            <span className="text-sm font-bold tabular-nums">{cityHealth}</span>
          </div>

          {/* Critical Alerts Count */}
          {criticalAlerts > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 pulse-danger">
              <Bell className="w-4 h-4" />
              <span className="text-xs font-tactical font-bold">{criticalAlerts} CRITICAL</span>
            </div>
          )}

          {/* High Risk Zones */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-tactical">{highRiskZones} HIGH-RISK</span>
          </div>
        </div>

        {/* Center: Quick Stats */}
        <div className="hidden lg:flex items-center gap-6">
          <QuickStat 
            icon={Camera} 
            value={stats.operationalCCTV} 
            total={stats.totalCCTV}
            label="CCTV" 
            color="text-blue-400" 
          />
          <QuickStat 
            icon={Zap} 
            value={stats.operationalSignals} 
            total={stats.totalSignals}
            label="Signals" 
            color="text-emerald-400" 
          />
          <QuickStat 
            icon={Activity} 
            value={activeAlerts.length} 
            label="Alerts" 
            color="text-amber-400" 
          />
        </div>

        {/* Right: Time Context */}
        <div className="flex items-center gap-3">
          {/* Time Filter Selector */}
          <div className="flex items-center bg-background/50 rounded-lg p-0.5 border border-border/50">
            {(['live', '24h', '7d'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={cn(
                  "px-2.5 py-1 rounded text-[10px] font-tactical font-medium transition-all",
                  timeFilter === filter
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filter === 'live' ? '● LIVE' : filter.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Current Time */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-tactical text-xs tabular-nums">
              {currentTime.toLocaleTimeString('en-ZA', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuickStatProps {
  icon: typeof Camera;
  value: number;
  total?: number;
  label: string;
  color: string;
}

const QuickStat = ({ icon: Icon, value, total, label, color }: QuickStatProps) => (
  <div className="flex items-center gap-2">
    <Icon className={cn("w-3.5 h-3.5", color)} />
    <div className="text-xs font-tactical">
      <span className={cn("font-bold tabular-nums", color)}>{value}</span>
      {total !== undefined && (
        <span className="text-muted-foreground">/{total}</span>
      )}
    </div>
    <span className="text-[9px] text-muted-foreground uppercase">{label}</span>
  </div>
);

export default GlobalStatusBar;
