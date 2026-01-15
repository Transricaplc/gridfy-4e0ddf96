import { Shield, Flame, Waves, Mountain, MapPin, Phone, AlertTriangle } from 'lucide-react';
import { touristSites, beachSafety } from '@/data/suburbIntelligence';
import { cn } from '@/lib/utils';

const TravelerModeView = () => {
  const hikingSites = touristSites.filter(site => site.type === 'hiking');
  const beachSites = beachSafety.slice(0, 4);

  return (
    <div className="min-h-screen bg-black px-4 py-6 pb-48">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Emergency Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight">TRAVELER MODE</h1>
            <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
          </div>
          <p className="text-muted-foreground text-sm">
            Simplified emergency access for tourists
          </p>
        </div>

        {/* Emergency SOS Grid - Prominent */}
        <div className="grid grid-cols-2 gap-4">
          <a
            href="tel:10111"
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all border-2 border-blue-400 shadow-lg shadow-blue-500/30 active:scale-95"
          >
            <Shield className="w-12 h-12 text-white" />
            <span className="font-bold text-white text-lg">POLICE</span>
            <span className="font-mono text-blue-100">10111</span>
          </a>
          
          <a
            href="tel:0214807700"
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-red-600 hover:bg-red-500 transition-all border-2 border-red-400 shadow-lg shadow-red-500/30 active:scale-95"
          >
            <Flame className="w-12 h-12 text-white" />
            <span className="font-bold text-white text-lg">FIRE</span>
            <span className="font-mono text-red-100">021 480 7700</span>
          </a>
          
          <a
            href="tel:0870949774"
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-cyan-600 hover:bg-cyan-500 transition-all border-2 border-cyan-400 shadow-lg shadow-cyan-500/30 active:scale-95"
          >
            <Waves className="w-12 h-12 text-white" />
            <span className="font-bold text-white text-lg">SEA RESCUE</span>
            <span className="font-mono text-cyan-100">NSRI</span>
          </a>
          
          <a
            href="tel:0219370300"
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 transition-all border-2 border-emerald-400 shadow-lg shadow-emerald-500/30 active:scale-95"
          >
            <Mountain className="w-12 h-12 text-white" />
            <span className="font-bold text-white text-lg">MTN RESCUE</span>
            <span className="font-mono text-emerald-100">WSAR</span>
          </a>
        </div>

        {/* Hiking Guidelines */}
        <div className="bg-card/50 backdrop-blur-md rounded-2xl border border-amber-500/30 overflow-hidden">
          <div className="bg-amber-500/20 px-4 py-3 border-b border-amber-500/30">
            <div className="flex items-center gap-2">
              <Mountain className="w-5 h-5 text-amber-400" />
              <h2 className="font-bold text-foreground">Hiking Safety</h2>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {hikingSites.slice(0, 3).map(site => (
              <div key={site.id} className="bg-background/50 rounded-xl p-4 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">{site.name}</span>
                  <span className={cn(
                    'text-sm font-bold',
                    site.safety_score >= 80 ? 'text-emerald-400' : 'text-yellow-400'
                  )}>
                    {site.safety_score}
                  </span>
                </div>
                <ul className="space-y-1">
                  {site.protocols.slice(0, 2).map((protocol, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      {protocol}
                    </li>
                  ))}
                </ul>
                <a
                  href={`tel:${site.emergency_contact.replace(/\s/g, '')}`}
                  className="mt-3 flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300"
                >
                  <Phone className="w-3 h-3" />
                  {site.emergency_name}: {site.emergency_contact}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Beach Safety */}
        <div className="bg-card/50 backdrop-blur-md rounded-2xl border border-cyan-500/30 overflow-hidden">
          <div className="bg-cyan-500/20 px-4 py-3 border-b border-cyan-500/30">
            <div className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-cyan-400" />
              <h2 className="font-bold text-foreground">Beach Safety</h2>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {beachSites.map(beach => (
              <div key={beach.id} className="flex items-center justify-between bg-background/50 rounded-xl p-3 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-3 h-3 rounded-full',
                    beach.flag_status === 'green' ? 'bg-emerald-400' :
                    beach.flag_status === 'red' ? 'bg-red-400' :
                    beach.flag_status === 'black' ? 'bg-gray-800 border border-gray-600' :
                    'bg-white'
                  )} />
                  <div>
                    <div className="font-medium text-foreground text-sm">{beach.name}</div>
                    <div className="text-xs text-muted-foreground">{beach.primary_risk}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {beach.shark_spotter && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono">SHARK SPOTTERS</span>
                  )}
                  {beach.lifeguards && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">LIFEGUARDS</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 pb-4">
            <a
              href="tel:0870949774"
              className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-xl text-cyan-400 font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              NSRI Sea Rescue: 087 094 9774
            </a>
          </div>
        </div>

        {/* Quick Dial */}
        <div className="bg-destructive/10 rounded-2xl border border-destructive/30 p-4">
          <a
            href="tel:10177"
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                <Phone className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <div className="font-bold text-foreground">National Ambulance</div>
                <div className="text-sm text-muted-foreground">24/7 Emergency Medical</div>
              </div>
            </div>
            <span className="font-mono font-bold text-xl text-destructive">10177</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TravelerModeView;
