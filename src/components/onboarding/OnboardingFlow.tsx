import { useState, memo } from 'react';
import { cn } from '@/lib/utils';
import { MapPin, UserPlus, Bell, Download, ArrowRight, Check, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const crimeTypes = [
  { id: 'robbery', label: 'Robbery & Mugging' },
  { id: 'burglary', label: 'Home Burglary' },
  { id: 'vehicle', label: 'Vehicle Crime' },
  { id: 'assault', label: 'Assault' },
  { id: 'gbv', label: 'Gender-Based Violence' },
  { id: 'drugs', label: 'Drug Activity' },
  { id: 'gang', label: 'Gang Activity' },
  { id: 'loadshedding', label: 'Load Shedding' },
];

const OnboardingFlow = memo(({ onComplete }: OnboardingFlowProps) => {
  const [step, setStep] = useState(0);
  const [suburb, setSuburb] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set(['robbery', 'burglary']));
  const [downloading, setDownloading] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const skip = () => next();

  const toggleAlert = (id: string) => {
    setSelectedAlerts((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      onComplete();
    }, 1500);
  };

  const screens = [
    // Screen 1: Welcome
    <div key="welcome" className="flex flex-col items-center justify-center text-center gap-6 px-6 animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center">
        <MapPin className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-3xl font-black text-foreground tracking-tight">Welcome to Gridfy</h1>
      <p className="text-lg text-muted-foreground max-w-xs">Safety Intelligence for Every South African</p>
      <Button size="lg" className="mt-4 min-w-[200px] min-h-[48px] text-base font-bold" onClick={next}>
        Get Started <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </div>,

    // Screen 2: Home suburb
    <div key="suburb" className="flex flex-col items-center text-center gap-6 px-6 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
        <MapPin className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">Set Your Home Suburb</h2>
      <p className="text-sm text-muted-foreground max-w-xs">We'll personalise your safety intelligence for your area</p>
      <Input
        placeholder="e.g. Rondebosch, Khayelitsha, Stellenbosch"
        value={suburb}
        onChange={(e) => setSuburb(e.target.value)}
        className="max-w-xs min-h-[48px] text-base"
      />
      <div className="flex gap-3 mt-2">
        <Button variant="outline" className="min-h-[48px]" onClick={skip}>
          <SkipForward className="w-4 h-4 mr-2" /> Skip
        </Button>
        <Button className="min-h-[48px] min-w-[120px]" onClick={next} disabled={!suburb.trim()}>
          Continue <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>,

    // Screen 3: Trusted Contact
    <div key="contact" className="flex flex-col items-center text-center gap-6 px-6 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
        <UserPlus className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">Add a Trusted Contact</h2>
      <p className="text-sm text-muted-foreground max-w-xs">This person will be notified if you trigger a panic alert</p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Input placeholder="Contact name" value={contactName} onChange={(e) => setContactName(e.target.value)} className="min-h-[48px]" />
        <Input placeholder="Phone number" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="min-h-[48px]" />
      </div>
      <div className="flex gap-3 mt-2">
        <Button variant="outline" className="min-h-[48px]" onClick={skip}>
          <SkipForward className="w-4 h-4 mr-2" /> Skip
        </Button>
        <Button className="min-h-[48px] min-w-[120px]" onClick={next}>
          Continue <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>,

    // Screen 4: Alert preferences
    <div key="alerts" className="flex flex-col items-center text-center gap-5 px-6 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
        <Bell className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">Alert Preferences</h2>
      <p className="text-sm text-muted-foreground max-w-xs">Choose which crime types to be notified about</p>
      <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
        {crimeTypes.map((ct) => (
          <button
            key={ct.id}
            onClick={() => toggleAlert(ct.id)}
            className={cn(
              'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium min-h-[48px] transition-colors',
              selectedAlerts.has(ct.id)
                ? 'bg-primary/15 border-primary text-primary'
                : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {selectedAlerts.has(ct.id) && <Check className="w-3.5 h-3.5 shrink-0" />}
            <span className="truncate">{ct.label}</span>
          </button>
        ))}
      </div>
      <Button className="min-h-[48px] min-w-[120px] mt-2" onClick={next}>
        Continue <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </div>,

    // Screen 5: Offline map download
    <div key="offline" className="flex flex-col items-center text-center gap-6 px-6 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
        <Download className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">Offline Safety Map</h2>
      <p className="text-sm text-muted-foreground max-w-xs">
        Download your suburb's safety map for offline access (~4 MB)
      </p>
      {suburb && (
        <p className="text-sm font-semibold text-primary">{suburb}</p>
      )}
      <div className="flex gap-3 mt-2">
        <Button variant="outline" className="min-h-[48px]" onClick={onComplete}>
          <SkipForward className="w-4 h-4 mr-2" /> Skip
        </Button>
        <Button className="min-h-[48px] min-w-[160px]" onClick={handleDownload} disabled={downloading}>
          {downloading ? 'Downloading...' : 'Download Map'}
        </Button>
      </div>
    </div>,
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 pt-8 pb-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              i === step ? 'w-6 bg-primary' : i < step ? 'bg-primary/50' : 'bg-border'
            )}
          />
        ))}
      </div>

      {/* Screen content */}
      <div className="flex-1 flex items-center justify-center overflow-auto">
        {screens[step]}
      </div>
    </div>
  );
});

OnboardingFlow.displayName = 'OnboardingFlow';
export default OnboardingFlow;
