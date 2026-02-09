import { useState } from 'react';
import MapFirstLayout from '@/components/dashboard/MapFirstLayout';
import TravelerModeView from '@/components/dashboard/TravelerModeView';
import SOSActionDock from '@/components/dashboard/SOSActionDock';
import HeroSection from '@/components/dashboard/HeroSection';
import TopStatusBar from '@/components/dashboard/TopStatusBar';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { WildfireProvider } from '@/contexts/WildfireContext';

const DashboardContent = () => {
  const { isTravelerMode, setTravelerMode } = useDashboard();
  const [showDashboard, setShowDashboard] = useState(false);

  const handleToggleTravelerMode = () => {
    setTravelerMode(!isTravelerMode);
  };

  // Show hero first
  if (!showDashboard) {
    return <HeroSection onEnterDashboard={() => setShowDashboard(true)} />;
  }

  if (isTravelerMode) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TopStatusBar 
          isTravelerMode={true} 
          onToggleTravelerMode={handleToggleTravelerMode} 
        />
        <TravelerModeView />
        <SOSActionDock isTravelerMode={true} />
      </div>
    );
  }

  return (
    <>
      <MapFirstLayout />
      <SOSActionDock isTravelerMode={false} />
    </>
  );
};

const Index = () => {
  return (
    <DashboardProvider>
      <WildfireProvider>
        <DashboardContent />
      </WildfireProvider>
    </DashboardProvider>
  );
};

export default Index;
