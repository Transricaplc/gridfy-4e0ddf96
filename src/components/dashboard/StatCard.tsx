import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  variant: 'green' | 'red' | 'blue' | 'purple' | 'yellow' | 'orange' | 'teal' | 'pink';
}

const variantClasses = {
  green: 'bg-stat-green',
  red: 'bg-stat-red',
  blue: 'bg-stat-blue',
  purple: 'bg-stat-purple',
  yellow: 'bg-stat-yellow',
  orange: 'bg-stat-orange',
  teal: 'bg-stat-teal',
  pink: 'bg-stat-pink',
};

const StatCard = ({ icon: Icon, value, label, variant }: StatCardProps) => {
  return (
    <div className={cn(
      'rounded-xl p-3 lg:p-4 shadow-2xl border-2 transition-transform hover:scale-105',
      variantClasses[variant]
    )}>
      <Icon className="w-5 h-5 lg:w-7 lg:h-7 text-foreground mb-1 lg:mb-2" />
      <div className="text-xl lg:text-3xl font-black text-foreground">{value}</div>
      <div className="text-[10px] lg:text-xs text-foreground/80 font-semibold">{label}</div>
    </div>
  );
};

export default StatCard;
