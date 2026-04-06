import { memo } from 'react';

/** Shimmer skeleton matching the DashboardView layout */
const SkeletonDashboard = memo(() => (
  <div className="space-y-6 animate-fade-in">
    {/* Briefing skeleton */}
    <div className="rounded-xl border border-[hsl(var(--border-subtle))] bg-card p-4">
      <div className="skeleton h-3 w-32 mb-3" />
      <div className="skeleton h-6 w-48 mb-2" />
      <div className="skeleton h-3 w-full mb-1.5" />
      <div className="skeleton h-3 w-3/4 mb-1.5" />
      <div className="skeleton h-3 w-1/2" />
    </div>

    {/* Score ring skeleton */}
    <div className="flex justify-center py-4">
      <div className="skeleton w-[120px] h-[120px] rounded-full" />
    </div>

    {/* Metric strip skeleton */}
    <div className="flex gap-0 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="shrink-0 w-[88px] p-2.5">
          <div className="skeleton h-6 w-10 mb-2" />
          <div className="skeleton h-2.5 w-14" />
        </div>
      ))}
    </div>

    {/* Incident feed skeleton */}
    <div>
      <div className="skeleton h-4 w-40 mb-3" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3 border-b border-[hsl(var(--border-subtle)/0.3)]">
          <div className="skeleton w-10 h-10 rounded-lg shrink-0" />
          <div className="flex-1">
            <div className="skeleton h-3.5 w-24 mb-1.5" />
            <div className="skeleton h-2.5 w-36" />
          </div>
          <div className="skeleton h-2.5 w-14" />
        </div>
      ))}
    </div>
  </div>
));

SkeletonDashboard.displayName = 'SkeletonDashboard';
export default SkeletonDashboard;
