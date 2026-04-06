import { memo, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SafetyScoreRingProps {
  score: number;
  suburb: string;
  onTap?: () => void;
}

const SafetyScoreRing = memo(({ score, suburb, onTap }: SafetyScoreRingProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 300;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(eased * score);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  const circumference = 2 * Math.PI * 52;
  const fillPercent = (animatedScore / 10) * 100;
  const strokeDashoffset = circumference - (fillPercent / 100) * circumference;

  const color = score >= 7 ? 'hsl(var(--accent-safe))' : score >= 4 ? 'hsl(var(--accent-warning))' : 'hsl(var(--accent-threat))';

  return (
    <button
      onClick={onTap}
      className="flex flex-col items-center gap-2 py-4 active:scale-[0.97] transition-transform"
      aria-label={`Safety score ${score} out of 10 for ${suburb}`}
    >
      <div className="relative w-[120px] h-[120px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Background track */}
          <circle
            cx="60" cy="60" r="52"
            fill="none"
            stroke="hsl(var(--surface-02))"
            strokeWidth="8"
          />
          {/* Progress arc */}
          <circle
            cx="60" cy="60" r="52"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-foreground tabular-nums leading-none">
            {animatedScore.toFixed(1)}
          </span>
        </div>
      </div>
      <span className="text-[11px] text-muted-foreground font-medium">Safety Score</span>
      <span className="text-[13px] text-foreground font-semibold">{suburb}</span>
    </button>
  );
});

SafetyScoreRing.displayName = 'SafetyScoreRing';
export default SafetyScoreRing;
