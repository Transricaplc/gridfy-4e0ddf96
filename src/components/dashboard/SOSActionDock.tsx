import { useState } from 'react';
import { Shield, Flame, Waves, Mountain, Building2, ChevronUp, ChevronDown, Lock, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SOSButton {
  id: string;
  label: string;
  number: string;
  icon: typeof Shield;
  color: string;
  bgColor: string;
  hoverColor: string;
}

const sosButtons: SOSButton[] = [
  {
    id: 'ccid',
    label: 'CCID',
    number: '021 426 1325',
    icon: Building2,
    color: 'text-violet-50',
    bgColor: 'bg-violet-600/90',
    hoverColor: 'hover:bg-violet-500',
  },
  {
    id: 'saps',
    label: 'SAPS',
    number: '10111',
    icon: Shield,
    color: 'text-blue-50',
    bgColor: 'bg-blue-600/90',
    hoverColor: 'hover:bg-blue-500',
  },
  {
    id: 'fire',
    label: 'FIRE',
    number: '021 480 7700',
    icon: Flame,
    color: 'text-red-50',
    bgColor: 'bg-red-600/90',
    hoverColor: 'hover:bg-red-500',
  },
  {
    id: 'sea-rescue',
    label: 'SEA',
    number: '087 094 9774',
    icon: Waves,
    color: 'text-cyan-50',
    bgColor: 'bg-cyan-600/90',
    hoverColor: 'hover:bg-cyan-500',
  },
  {
    id: 'mtn-rescue',
    label: 'MTN',
    number: '021 937 0300',
    icon: Mountain,
    color: 'text-emerald-50',
    bgColor: 'bg-emerald-600/90',
    hoverColor: 'hover:bg-emerald-500',
  },
];

interface SOSActionDockProps {
  isTravelerMode?: boolean;
}

const SOSActionDock = ({ isTravelerMode = false }: SOSActionDockProps) => {
  const [showLegal, setShowLegal] = useState(false);

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-50',
      'bg-black/90 backdrop-blur-md border-t border-border/30',
      'px-2 safe-area-bottom'
    )}>
      <div className="max-w-[1400px] mx-auto">
        {/* Legal/Compliance Section - Collapsible */}
        <Collapsible open={showLegal} onOpenChange={setShowLegal}>
          <CollapsibleContent className="py-2 border-b border-border/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[9px]">
              {/* POPIA Compliance */}
              <div className="flex items-start gap-2 p-2 rounded bg-card/20">
                <Shield className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">POPIA Compliant</span>
                  <p className="text-muted-foreground leading-tight">
                    SafeSync complies with POPIA. No personally identifiable surveillance data stored.
                  </p>
                </div>
              </div>

              {/* CCTV By-Law */}
              <div className="flex items-start gap-2 p-2 rounded bg-card/20">
                <Lock className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">CoCT CCTV By-Law</span>
                  <p className="text-muted-foreground leading-tight">
                    Adheres to City of Cape Town's CCTV By-Law (2023) for third-party systems.
                  </p>
                </div>
              </div>

              {/* Data Transparency */}
              <div className="flex items-start gap-2 p-2 rounded bg-card/20">
                <FileText className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">Data Transparency</span>
                  <p className="text-muted-foreground leading-tight">
                    Aggregates public OSINT signals and municipal data. No live CCTV footage processed.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-2 p-1.5 bg-background/30 rounded text-center">
              <p className="text-[8px] text-muted-foreground font-mono">
                SafeSync provides aggregated safety intelligence for informational purposes. In emergencies, always contact official services directly.
                Data sourced from City of Cape Town, SAPS, NSRI, and public municipal records.
              </p>
            </div>

            {/* Company Attribution */}
            <div className="mt-1 text-center">
              <p className="text-[8px] text-muted-foreground/70">
                SafeSync is a product of <span className="font-semibold">Evenor Holdings (Pty) Ltd</span> © {new Date().getFullYear()}
              </p>
            </div>
          </CollapsibleContent>

          {/* Toggle Button for Legal Section */}
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-center gap-1 py-0.5 text-[8px] text-muted-foreground/60 hover:text-muted-foreground transition-colors">
              {showLegal ? (
                <>
                  <ChevronDown className="w-2.5 h-2.5" />
                  <span>Hide Legal & Compliance</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-2.5 h-2.5" />
                  <span>Legal & Compliance</span>
                </>
              )}
            </button>
          </CollapsibleTrigger>
        </Collapsible>

        {/* SOS Label */}
        <div className="flex items-center justify-center gap-1 py-0.5">
          <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[6px] font-mono uppercase tracking-widest text-muted-foreground/70">
            SOS • One-Tap
          </span>
          <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
        </div>

        {/* SOS Buttons Grid */}
        <div className="grid grid-cols-5 gap-0.5 pb-1">
          {sosButtons.map((button) => {
            const Icon = button.icon;
            return (
              <a
                key={button.id}
                href={`tel:${button.number.replace(/\s/g, '')}`}
                className={cn(
                  'flex flex-col items-center justify-center rounded transition-all duration-150',
                  'border border-white/10',
                  button.bgColor,
                  button.hoverColor,
                  'active:scale-95',
                  'py-1'
                )}
              >
                <Icon className={cn(
                  button.color,
                  isTravelerMode ? 'w-3 h-3' : 'w-2.5 h-2.5'
                )} strokeWidth={2.5} />
                <span className={cn(
                  'font-bold tracking-wide',
                  button.color,
                  'text-[6px] mt-0.5'
                )}>
                  {button.label}
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
