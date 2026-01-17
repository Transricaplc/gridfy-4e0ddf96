import { useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ExpandablePanelProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const ExpandablePanel = ({ title, icon, children, isOpen, onClose }: ExpandablePanelProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[95vw] w-full h-[90vh] max-h-[90vh] p-0 gap-0 bg-background/98 backdrop-blur-xl border-primary/20"
        aria-describedby={undefined}
      >
        <DialogHeader className="p-4 border-b border-border/40 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                {icon}
              </div>
              <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpandablePanel;
