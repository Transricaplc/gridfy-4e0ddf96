import { useState, lazy, Suspense, memo } from 'react';
import MapFirstLayout from '@/components/dashboard/MapFirstLayout';
import HeroSection from '@/components/dashboard/HeroSection';
import TopStatusBar from '@/components/dashboard/TopStatusBar';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { WildfireProvider } from '@/contexts/WildfireContext';

// Lazy-load heavy secondary views
const TravelerModeView = lazy(() => import('@/components/dashboard/TravelerModeView'));
const SOSActionDock = lazy(() => import('@/components/dashboard/SOSActionDock'));

/**
 * Index Page — v1.1 Stabilized
 * 
 * View states:
 * 1. Hero → Entry gate (no dashboard rendering)
 * 2. Standard → MapFirstLayout + SOS dock
 * 3. Traveler → TravelerModeView + SOS dock (panels locked)
 * 
 * State transitions are clean — no double renders or layout reflows.
 */

const DashboardContent = memo(() => {
  const { isTravelerMode, setTravelerMode } = useDashboard();
  const [showDashboard, setShowDashboard] = useState(false);

  // Gate: Hero section
  if (!showDashboard) {
    return <HeroSection onEnterDashboard={() => setShowDashboard(true)} />;
  }

  // Traveler mode — isolated view, no secondary panels
  if (isTravelerMode) {
    return (
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <TopStatusBar 
          isTravelerMode={true} 
          onToggleTravelerMode={() => setTravelerMode(false)} 
        />
        <Suspense fallback={<div className="flex-1 bg-background" />}>
          <div className="flex-1 overflow-y-auto pb-16">
            <TravelerModeView />
          </div>
          <SOSActionDock isTravelerMode={true} />
        </Suspense>
      </div>
    );
  }

  // Standard mode — map-first layout
  return (
    <>
      <MapFirstLayout />
      <Suspense fallback={null}>
        <SOSActionDock isTravelerMode={false} />
      </Suspense>
    </>
  );
});

DashboardContent.displayName = 'DashboardContent';

const Index = () => (
  <DashboardProvider>
    <WildfireProvider>
      <DashboardContent />
    </WildfireProvider>
  </DashboardProvider>
);

export default Index;
