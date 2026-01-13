import { useState } from 'react';
import Header from '@/components/dashboard/Header';
import StatsBar from '@/components/dashboard/StatsBar';
import TabNavigation from '@/components/dashboard/TabNavigation';
import RouteCard from '@/components/dashboard/RouteCard';
import RouteDetail from '@/components/dashboard/RouteDetail';
import TrainCard from '@/components/dashboard/TrainCard';
import UberZoneCard from '@/components/dashboard/UberZoneCard';
import EmptyState from '@/components/dashboard/EmptyState';
import { majorRoutes, trainRoutes, uberDangerZones } from '@/data/dashboardData';
import { MajorRoute, TabId } from '@/types/dashboard';

const Index = () => {
  const [selectedRoute, setSelectedRoute] = useState<MajorRoute | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    if (tab !== 'routes') {
      setSelectedRoute(null);
    }
  };

  const handleRouteClick = (route: MajorRoute) => {
    setSelectedRoute(route);
    setActiveTab('routes');
  };

  return (
    <div className="min-h-screen bg-gradient-body">
      <Header />
      <StatsBar />
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {majorRoutes.map(route => (
              <RouteCard 
                key={route.id} 
                route={route} 
                onClick={() => handleRouteClick(route)} 
              />
            ))}
          </div>
        )}

        {activeTab === 'routes' && selectedRoute && (
          <RouteDetail route={selectedRoute} />
        )}

        {activeTab === 'routes' && !selectedRoute && (
          <EmptyState />
        )}

        {activeTab === 'trains' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {trainRoutes.map(train => (
              <TrainCard key={train.id} train={train} />
            ))}
          </div>
        )}

        {activeTab === 'uber' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {uberDangerZones.map(zone => (
              <UberZoneCard key={zone.id} zone={zone} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
