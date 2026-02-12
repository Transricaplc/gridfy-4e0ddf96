import { useState, useCallback, useMemo, lazy, Suspense, memo } from 'react';
import { 
  AlertTriangle, Grid3X3, Camera, Flame, Shield,
  Bike, Mountain, MapPin, TrafficCone, Users, Menu
} from 'lucide-react';
import TopStatusBar from './TopStatusBar';
import MapFirstView from './MapFirstView';
import ControlHub, { LayerConfig } from './ControlHub';
import ContextDrawer from './ContextDrawer';
import { useDashboard } from '@/contexts/DashboardContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy-load non-critical panels
const IntelligenceSidebar = lazy(() => import('./IntelligenceSidebar'));
const MobileBottomSheet = lazy(() => import('./MobileBottomSheet'));

/**
 * Map-First Layout — v1.1 Stabilized
 * 
 * Fixed Layout Zones:
 * ┌──────────────────────────────────────────┐
 * │ TOP STATUS BAR (h-12, z-50)             │
 * ├────────┬─────────────────────┬───────────┤
 * │CONTROL │                     │INTELLIGENCE│
 * │HUB     │   CENTER MAP        │SIDEBAR    │
 * │(z-30)  │   (z-0, flex-1)     │(z-20,w-80)│
 * │        │                     │           │
 * ├────────┴─────────────────────┴───────────┤
 * │ SOS DOCK (z-50, fixed bottom)            │
 * └──────────────────────────────────────────┘
 * 
 * Rules enforced:
 * 1. Only ONE primary panel visible at a time
 * 2. No draggable/floating panels — all docked
 * 3. Panels auto-collapse on map interaction
 * 4. Fixed grid system — no resize jitter
 * 5. Traveler mode locks all secondary panels
 * 6. z-index hierarchy: map(0) < intel(20) < controls(30) < statusbar(50)
 */

type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d';
type SeverityLevel = 'all' | 'low' | 'medium' | 'high' | 'critical';

// Single enum for which panel is active — enforces mutual exclusivity
type ActivePanel = 'none' | 'controls' | 'intelligence';

const MapFirstLayout = () => {
  const { isTravelerMode, setTravelerMode, selectedEntity, clearSelection } = useDashboard();
  const isMobile = useIsMobile();

  // Single panel state — only one panel open at a time
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [severity, setSeverity] = useState<SeverityLevel>('all');
  
  // Layer configuration — memoized to prevent re-renders
  const [layers, setLayers] = useState<LayerConfig[]>([
    { id: 'heatmap', name: 'Crime Heatmap', icon: AlertTriangle, color: '#ef4444', enabled: true, category: 'safety' },
    { id: 'safezones', name: 'Safe Zones', icon: Shield, color: '#10b981', enabled: true, category: 'safety' },
    { id: 'reports', name: 'Citizen Reports', icon: Users, color: '#f97316', enabled: true, category: 'safety' },
    { id: 'risk', name: 'Pickpocket Zones', icon: AlertTriangle, color: '#f97316', enabled: false, category: 'safety' },
    { id: 'wards', name: 'Ward Boundaries', icon: Grid3X3, color: '#6366f1', enabled: true, category: 'infrastructure' },
    { id: 'cctv', name: 'CCTV Cameras', icon: Camera, color: '#3b82f6', enabled: false, category: 'infrastructure' },
    { id: 'traffic', name: 'Traffic Signals', icon: TrafficCone, color: '#22c55e', enabled: false, category: 'infrastructure' },
    { id: 'cycling', name: 'Cycle Lanes', icon: Bike, color: '#10b981', enabled: false, category: 'infrastructure' },
    { id: 'hiking', name: 'Hiking Trails', icon: Mountain, color: '#92400e', enabled: false, category: 'infrastructure' },
    { id: 'wildfire', name: 'Wildfire (AFIS)', icon: Flame, color: '#ef4444', enabled: false, category: 'operations', restrictedTo: ['analyst', 'responder'] },
    { id: 'hotspots', name: 'Accident Hotspots', icon: MapPin, color: '#ef4444', enabled: false, category: 'operations', restrictedTo: ['analyst', 'responder'] },
  ]);

  // Toggle layer handler
  const handleToggleLayer = useCallback((id: string) => {
    setLayers(prev => prev.map(l => 
      l.id === id ? { ...l, enabled: !l.enabled } : l
    ));
  }, []);

  // Auto-collapse ALL panels on map interaction
  const handleMapInteraction = useCallback(() => {
    setActivePanel('none');
  }, []);

  // Toggle a specific panel — closes others automatically
  const togglePanel = useCallback((panel: ActivePanel) => {
    setActivePanel(prev => prev === panel ? 'none' : panel);
  }, []);

  // Traveler mode locks secondary panels
  const showIntelligenceSidebar = !isTravelerMode && !isMobile;
  const showMobileIntelButton = !isTravelerMode && isMobile;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* TOP STATUS BAR — fixed h-12, always visible, z-50 */}
      <TopStatusBar
        isTravelerMode={isTravelerMode}
        onToggleTravelerMode={() => setTravelerMode(!isTravelerMode)}
        alertCount={3}
        connectionStatus="connected"
      />

      {/* MAIN CONTENT — flex-1, no overflow */}
      <main className="flex-1 relative overflow-hidden">
        {/* PRIMARY MAP CANVAS — z-0, fills all available space */}
        <MapFirstView 
          fullHeight 
          onMapInteraction={handleMapInteraction}
        />

        {/* CONTROL HUB — docked, z-30 */}
        {!isTravelerMode && (
          <ControlHub
            layers={layers}
            onToggleLayer={handleToggleLayer}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            severity={severity}
            onSeverityChange={setSeverity}
            isExpanded={activePanel === 'controls'}
            onToggleExpand={() => togglePanel('controls')}
            onCollapseAll={handleMapInteraction}
          />
        )}

        {/* DESKTOP: Right Intelligence Sidebar — fixed dock, z-20, w-80 */}
        {showIntelligenceSidebar && (
          <aside className={cn(
            "hidden lg:flex fixed right-0 top-12 bottom-0 w-80 z-20",
            "bg-card/95 backdrop-blur-xl border-l border-border/50",
            "flex-col overflow-hidden will-change-auto"
          )}>
            <Suspense fallback={
              <div className="flex-1 flex items-center justify-center">
                <span className="text-xs text-muted-foreground font-mono">Loading…</span>
              </div>
            }>
              <IntelligenceSidebar />
            </Suspense>
          </aside>
        )}

        {/* MOBILE: Intelligence Toggle Button */}
        {showMobileIntelButton && (
          <button
            onClick={() => togglePanel('intelligence')}
            className={cn(
              "lg:hidden fixed bottom-20 right-4 z-30",
              "flex items-center gap-2 px-4 py-2.5",
              "rounded-full shadow-lg transition-all duration-200",
              activePanel === 'intelligence'
                ? "bg-primary text-primary-foreground"
                : "bg-card/90 text-foreground border border-border/50"
            )}
          >
            <Menu className="w-4 h-4" />
            <span className="text-sm font-medium">Intel</span>
          </button>
        )}

        {/* MOBILE: Bottom Sheet — slides up, never overlaps map controls */}
        {isMobile && (
          <Suspense fallback={null}>
            <MobileBottomSheet
              isOpen={activePanel === 'intelligence'}
              onClose={() => setActivePanel('none')}
              title="Safety Intelligence"
              initialState="expanded"
            >
              <div className="p-4">
                <IntelligenceSidebar />
              </div>
            </MobileBottomSheet>
          </Suspense>
        )}

        {/* CONTEXT DRAWER — entity detail, docked right on desktop, bottom sheet on mobile */}
        {selectedEntity && (
          <ContextDrawer
            entity={selectedEntity}
            onClose={clearSelection}
          />
        )}
      </main>
    </div>
  );
};

export default memo(MapFirstLayout);
