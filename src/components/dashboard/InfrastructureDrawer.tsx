import { useState } from 'react';
import { ChevronUp, ChevronDown, Layers, Construction } from 'lucide-react';
import InfrastructureGrid from './InfrastructureGrid';
import RoadsStatusPanel from './RoadsStatusPanel';
import { cn } from '@/lib/utils';

const InfrastructureDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn(
      'fixed bottom-[110px] left-0 right-0 z-40 transition-transform duration-300',
      isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-48px)]'
    )}>
      {/* Handle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-3 py-3 bg-card/95 backdrop-blur-xl border-t-2 border-x-2 border-border/50 rounded-t-2xl hover:bg-card transition-colors"
      >
        <div className="flex items-center gap-2">
          <Construction className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Infrastructure Status</span>
          <Layers className="w-4 h-4 text-muted-foreground" />
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {/* Content */}
      <div className="bg-card/95 backdrop-blur-xl border-x-2 border-border/50 max-h-[50vh] overflow-y-auto">
        <div className="p-4 space-y-4">
          <InfrastructureGrid />
          <RoadsStatusPanel />
        </div>
      </div>
    </div>
  );
};

export default InfrastructureDrawer;
