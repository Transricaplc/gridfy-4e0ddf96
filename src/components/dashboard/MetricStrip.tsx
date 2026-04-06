import { memo, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Metric {
  label: string;
  value: number;
  suffix?: string;
  color: string;
}

const metrics: Metric[] = [
  { label: 'Incidents Today', value: 7, color: 'text-destructive' },
  { label: 'Active Alerts', value: 4, color: 'text-safety-yellow' },
  { label: 'Area Score', value: 7.8, color: 'text-accent-safe' },
  { label: 'Avg Response', value: 8, suffix: 'min', color: 'text-foreground' },
  { label: 'Loadshedding', value: 4, suffix: 'stg', color: 'text-safety-yellow' },
  { label: 'Women Killed/wk', value: 12, color: 'text-destructive' },
];

function AnimatedNumber({ target, decimals = 0 }: { target: number; decimals?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 300;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * target);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target]);

  return <>{decimals > 0 ? display.toFixed(decimals) : Math.round(display)}</>;
}

const MetricStrip = memo(() => {
  return (
    <div className="flex gap-0 overflow-x-auto scrollbar-visible" style={{ WebkitOverflowScrolling: 'touch' }}>
      {metrics.map((m) => (
        <div
          key={m.label}
          className="shrink-0 w-[88px] p-2.5 bg-[hsl(var(--surface-01))] border border-[hsl(var(--border-subtle))] rounded-lg first:ml-0"
          style={{ marginLeft: metrics.indexOf(m) > 0 ? '-1px' : 0 }}
        >
          <span className={cn('text-[22px] font-bold tabular-nums leading-none block', m.color)}>
            <AnimatedNumber target={m.value} decimals={m.label === 'Area Score' ? 1 : 0} />
          </span>
          {m.suffix && (
            <span className="text-[10px] text-muted-foreground font-mono ml-0.5">{m.suffix}</span>
          )}
          <span className="text-[10px] text-muted-foreground block mt-1 leading-tight">{m.label}</span>
        </div>
      ))}
    </div>
  );
});

MetricStrip.displayName = 'MetricStrip';
export default MetricStrip;
