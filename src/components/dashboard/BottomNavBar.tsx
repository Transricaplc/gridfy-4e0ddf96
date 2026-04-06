import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Shield, MapPin, Navigation, Users, User } from 'lucide-react';
import type { ViewId } from './GridifyDashboard';

interface BottomNavBarProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
}

const tabs: { id: ViewId; label: string; icon: typeof Shield }[] = [
  { id: 'dashboard', label: 'Home', icon: Shield },
  { id: 'map-full', label: 'Map', icon: MapPin },
  { id: 'safe-route', label: 'Routes', icon: Navigation },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'settings', label: 'Profile', icon: User },
];

const BottomNavBar = memo(({ activeView, onNavigate }: BottomNavBarProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[90] bg-[hsl(210_30%_3%)] border-t border-[hsl(var(--border-subtle))]"
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-stretch justify-around h-16 max-w-lg mx-auto relative">
        {tabs.map((tab) => {
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 min-w-[48px] min-h-[48px] relative',
                'transition-colors duration-100',
                isActive
                  ? 'text-accent-safe'
                  : 'text-muted-foreground'
              )}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Top indicator bar */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-accent-safe" />
              )}
              <tab.icon
                className="w-5 h-5"
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn(
                'text-[11px] leading-none',
                isActive ? 'font-bold' : 'font-medium'
              )}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
});

BottomNavBar.displayName = 'BottomNavBar';
export default BottomNavBar;
