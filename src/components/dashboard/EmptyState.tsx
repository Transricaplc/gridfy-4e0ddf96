import { Camera } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="bg-card rounded-xl p-8 lg:p-12 border-2 border-border text-center animate-fade-in">
      <Camera className="w-12 h-12 lg:w-16 lg:h-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-2">Select a Route</h3>
      <p className="text-muted-foreground text-sm lg:text-base">
        Click on any route card in the Overview tab to view detailed camera coverage
      </p>
    </div>
  );
};

export default EmptyState;
