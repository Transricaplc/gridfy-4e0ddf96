import { Phone, Shield, Flame, Waves, Mountain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SOSButton {
  id: string;
  label: string;
  number: string;
  icon: typeof Phone;
  color: string;
  bgColor: string;
  hoverColor: string;
  glowColor: string;
}

const sosButtons: SOSButton[] = [
  {
    id: 'saps',
    label: 'SAPS',
    number: '10111',
    icon: Shield,
    color: 'text-blue-100',
    bgColor: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-500',
    glowColor: 'shadow-blue-500/50',
  },
  {
    id: 'fire',
    label: 'FIRE',
    number: '021 480 7700',
    icon: Flame,
    color: 'text-red-100',
    bgColor: 'bg-red-600',
    hoverColor: 'hover:bg-red-500',
    glowColor: 'shadow-red-500/50',
  },
  {
    id: 'sea-rescue',
    label: 'SEA RESCUE',
    number: '087 094 9774',
    icon: Waves,
    color: 'text-cyan-100',
    bgColor: 'bg-cyan-600',
    hoverColor: 'hover:bg-cyan-500',
    glowColor: 'shadow-cyan-500/50',
  },
  {
    id: 'mtn-rescue',
    label: 'MTN RESCUE',
    number: '021 937 0300',
    icon: Mountain,
    color: 'text-emerald-100',
    bgColor: 'bg-emerald-600',
    hoverColor: 'hover:bg-emerald-500',
    glowColor: 'shadow-emerald-500/50',
  },
];

interface SOSActionDockProps {
  isTravelerMode?: boolean;
}

const SOSActionDock = ({ isTravelerMode = false }: SOSActionDockProps) => {
  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-50',
      'bg-black/95 backdrop-blur-xl border-t-2 border-primary/30',
      'px-4 py-3 safe-area-bottom'
    )}>
      <div className="max-w-[1400px] mx-auto">
        {/* SOS Label */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Emergency SOS • Tap to Call
          </span>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>

        {/* SOS Buttons Grid */}
        <div className={cn(
          'grid gap-3',
          isTravelerMode ? 'grid-cols-2' : 'grid-cols-4'
        )}>
          {sosButtons.map((button) => {
            const Icon = button.icon;
            return (
              <a
                key={button.id}
                href={`tel:${button.number.replace(/\s/g, '')}`}
                className={cn(
                  'flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all duration-200',
                  'border-2 border-white/20',
                  button.bgColor,
                  button.hoverColor,
                  'hover:scale-[1.02] active:scale-[0.98]',
                  'shadow-lg hover:shadow-xl',
                  button.glowColor,
                  isTravelerMode ? 'py-6' : 'py-4'
                )}
              >
                <Icon className={cn(
                  'transition-transform',
                  button.color,
                  isTravelerMode ? 'w-10 h-10' : 'w-7 h-7'
                )} />
                <span className={cn(
                  'font-bold tracking-wide',
                  button.color,
                  isTravelerMode ? 'text-lg' : 'text-sm'
                )}>
                  {button.label}
                </span>
                <span className={cn(
                  'font-mono opacity-80',
                  button.color,
                  isTravelerMode ? 'text-sm' : 'text-xs'
                )}>
                  {button.number}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SOSActionDock;
