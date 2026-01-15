import { useState, useEffect } from 'react';
import { Shield, Bell, Settings, ToggleLeft, ToggleRight, AlertTriangle, Plane } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isTravelerMode: boolean;
  onToggleTravelerMode: () => void;
}

const Header = ({ isTravelerMode, onToggleTravelerMode }: HeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertCount] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className={cn(
      'border-b-2 shadow-2xl sticky top-0 z-50',
      isTravelerMode 
        ? 'bg-black border-red-500/50' 
        : 'bg-gradient-header border-primary/50'
    )}>
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="relative">
              <div className={cn(
                'w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-2xl transition-all',
                isTravelerMode 
                  ? 'bg-red-600 glow-red' 
                  : 'bg-gradient-to-br from-primary to-blue-400 glow-blue'
              )}>
                <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className={cn(
                'absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background animate-pulse',
                isTravelerMode ? 'bg-red-500' : 'bg-safety-good'
              )} />
            </div>
            <div>
              <h1 className="text-lg lg:text-2xl font-black text-foreground tracking-tight">
                Safe<span className={isTravelerMode ? 'text-red-400' : 'text-primary'}>Sync</span>
              </h1>
              <p className="text-primary/70 text-[9px] lg:text-[10px] font-mono tracking-wider uppercase">
                {isTravelerMode ? 'TRAVELER EMERGENCY MODE' : 'CAPE TOWN SITUATIONAL AWARENESS'}
              </p>
            </div>
          </div>

          {/* Risk Level Ticker (Command Center Only) */}
          {!isTravelerMode && (
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-mono text-yellow-400">THREAT LEVEL: MODERATE</span>
            </div>
          )}
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Traveler Mode Toggle */}
            <button
              onClick={onToggleTravelerMode}
              className={cn(
                'flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl transition-all border-2',
                isTravelerMode
                  ? 'bg-red-600 border-red-400 text-white hover:bg-red-500'
                  : 'bg-card/50 border-border hover:border-primary/50 text-foreground hover:bg-primary/10'
              )}
            >
              <Plane className="w-4 h-4" />
              <span className="text-xs lg:text-sm font-semibold hidden sm:inline">
                {isTravelerMode ? 'Exit Traveler Mode' : "Traveler's Mode"}
              </span>
              {isTravelerMode ? (
                <ToggleRight className="w-5 h-5" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {/* Alerts Button (Command Center Only) */}
            {!isTravelerMode && (
              <button className={cn(
                'relative p-2 rounded-xl transition-all',
                'bg-background/30 hover:bg-background/50 border border-border/50',
                alertCount > 0 && 'text-safety-moderate'
              )}>
                <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                {alertCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {alertCount}
                  </span>
                )}
              </button>
            )}

            {/* Settings (Command Center Only) */}
            {!isTravelerMode && (
              <button className="hidden sm:flex p-2 rounded-xl bg-background/30 hover:bg-background/50 border border-border/50 transition-all">
                <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
              </button>
            )}

            {/* Live Indicator */}
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg shadow-lg pulse-live',
              isTravelerMode ? 'bg-red-600' : 'bg-safety-good/90'
            )}>
              <div className="w-2 h-2 bg-foreground rounded-full" />
              <span className="text-xs font-bold text-foreground hidden sm:inline">LIVE</span>
            </div>

            {/* Time Display (Command Center Only) */}
            {!isTravelerMode && (
              <div className="hidden md:block text-right">
                <div className="text-[9px] text-muted-foreground uppercase tracking-wide font-mono">
                  {currentTime.toLocaleDateString('en-ZA', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div className="font-mono text-sm font-bold text-foreground tabular-nums">
                  {currentTime.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
