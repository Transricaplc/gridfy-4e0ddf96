import { useState } from 'react';
import { Plane, PlaneTakeoff, PlaneLanding, Search, RefreshCw } from 'lucide-react';
import { useFlights, getFlightStatusColor, getFlightStatusLabel } from '@/hooks/useFlights';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const FlightStatusPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'departure' | 'arrival'>('departure');
  const { arrivals, departures, loading, error, refetch } = useFlights();

  const flights = activeTab === 'departure' ? departures : arrivals;

  const filteredFlights = flights.filter(f => 
    !searchQuery || 
    f.flight_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.origin_destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm');
    } catch {
      return '--:--';
    }
  };

  if (loading) {
    return (
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-3 py-1.5 border-b border-border">
          <div className="flex items-center gap-2">
            <Plane className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">CPT International</span>
          </div>
        </div>
        <div className="p-3 space-y-2">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 text-center">
        <p className="text-xs text-red-400">{error}</p>
        <button onClick={refetch} className="text-xs text-cyan-400 mt-2 hover:underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-3 py-1.5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">CPT International</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={refetch} className="p-1 hover:bg-white/10 rounded transition-colors">
              <RefreshCw className="w-3 h-3 text-muted-foreground" />
            </button>
            <span className="text-[10px] font-mono text-cyan-400 animate-pulse">LIVE</span>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'departure' | 'arrival')} className="w-full">
          <TabsList className="grid grid-cols-2 h-7 bg-background/50">
            <TabsTrigger value="departure" className="text-[10px] h-6 gap-1 data-[state=active]:bg-primary/20">
              <PlaneTakeoff className="w-3 h-3" />
              Departures ({departures.length})
            </TabsTrigger>
            <TabsTrigger value="arrival" className="text-[10px] h-6 gap-1 data-[state=active]:bg-primary/20">
              <PlaneLanding className="w-3 h-3" />
              Arrivals ({arrivals.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search flight, airline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 pl-7 text-xs bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>

        {/* Flight List */}
        <div className="space-y-1 max-h-[160px] overflow-y-auto scrollbar-visible">
          {filteredFlights.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No flights found</p>
          ) : (
            filteredFlights.map(flight => (
              <div 
                key={flight.id}
                className="grid grid-cols-12 gap-2 items-center p-2 bg-background/50 rounded border border-border/30 text-xs"
              >
                <div className="col-span-3 font-mono font-medium text-foreground">{flight.flight_number}</div>
                <div className="col-span-3 text-muted-foreground truncate">{flight.airline}</div>
                <div className="col-span-2 font-mono text-foreground truncate">
                  {flight.origin_destination}
                </div>
                <div className="col-span-2 font-mono text-muted-foreground">
                  {formatTime(flight.scheduled_time)}
                </div>
                <div className="col-span-2 flex justify-end">
                  <span 
                    className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase"
                    style={{ 
                      color: getFlightStatusColor(flight.status),
                      backgroundColor: `${getFlightStatusColor(flight.status)}20`
                    }}
                  >
                    {getFlightStatusLabel(flight.status)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[9px] text-muted-foreground font-mono">
          <span>Source: ACSA</span>
          <span className="text-cyan-400">Real-time</span>
        </div>
      </div>
    </div>
  );
};

export default FlightStatusPanel;
