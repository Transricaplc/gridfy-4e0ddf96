import { Camera, VideoOff, Route, Train, Car, AlertTriangle, Shield, Phone } from 'lucide-react';
import StatCard from './StatCard';
import { majorRoutes, trainRoutes, uberDangerZones } from '@/data/dashboardData';

const StatsBar = () => {
  const totalCameras = majorRoutes.reduce((a, b) => a + b.total_cameras, 0);
  const functionalCameras = majorRoutes.reduce((a, b) => a + b.functioning, 0);
  const offlineCameras = majorRoutes.reduce((a, b) => a + b.offline, 0);
  const totalIncidents = majorRoutes.reduce((a, b) => a + b.incidents_24h, 0);
  const uptimePercent = Math.round((functionalCameras / totalCameras) * 100);

  return (
    <div className="bg-gradient-stats border-b border-border shadow-xl">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 lg:gap-4">
          <StatCard icon={Camera} value={functionalCameras} label="Active Cameras" variant="green" />
          <StatCard icon={VideoOff} value={offlineCameras} label="Offline Cameras" variant="red" />
          <StatCard icon={Route} value={majorRoutes.length} label="Major Routes" variant="blue" />
          <StatCard icon={Train} value={trainRoutes.length} label="Train Lines" variant="purple" />
          <StatCard icon={Car} value={uberDangerZones.length} label="Uber Risk Zones" variant="yellow" />
          <StatCard icon={AlertTriangle} value={totalIncidents} label="Incidents (24h)" variant="orange" />
          <StatCard icon={Shield} value={`${uptimePercent}%`} label="Uptime" variant="teal" />
          <StatCard icon={Phone} value="10111" label="Emergency" variant="pink" />
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
