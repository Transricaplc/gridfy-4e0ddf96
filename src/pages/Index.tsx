import { lazy, Suspense } from 'react';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { WildfireProvider } from '@/contexts/WildfireContext';
import type { ViewId } from '@/components/dashboard/AlmienDashboard';

const AlmienDashboard = lazy(() => import('@/components/dashboard/AlmienDashboard'));

interface IndexProps {
  initialView?: ViewId;
}

const Index = ({ initialView }: IndexProps) => (
  <DashboardProvider>
    <WildfireProvider>
      <Suspense fallback={<div className="h-screen bg-background" />}>
        <AlmienDashboard initialView={initialView} />
      </Suspense>
    </WildfireProvider>
  </DashboardProvider>
);

export default Index;
