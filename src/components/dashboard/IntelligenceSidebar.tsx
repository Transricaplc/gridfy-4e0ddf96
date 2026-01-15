import { useState, useMemo } from 'react';
import { Search, MapPin, X, ChevronDown, ChevronUp, Mountain, Umbrella } from 'lucide-react';
import { suburbIntelligence, SuburbData, touristSites } from '@/data/suburbIntelligence';
import SectorIntelligenceCard from './SectorIntelligenceCard';
import TouristProtocolsPanel from './TouristProtocolsPanel';
import { cn } from '@/lib/utils';

const getSafetyColor = (score: number) => {
  if (score >= 80) return 'hsl(160 84% 39%)';
  if (score >= 60) return 'hsl(38 92% 50%)';
  if (score >= 40) return 'hsl(25 95% 53%)';
  return 'hsl(0 84% 60%)';
};

interface IntelligenceSidebarProps {
  onSuburbSelect?: (suburb: SuburbData | null) => void;
}

const IntelligenceSidebar = ({ onSuburbSelect }: IntelligenceSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuburb, setSelectedSuburb] = useState<SuburbData | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const filteredSuburbs = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return suburbIntelligence.filter(suburb => 
      suburb.suburb_name.toLowerCase().includes(query)
    ).slice(0, 8);
  }, [searchQuery]);

  const handleSelectSuburb = (suburb: SuburbData) => {
    setSelectedSuburb(suburb);
    setSearchQuery('');
    setIsFocused(false);
    onSuburbSelect?.(suburb);
  };

  const handleCloseSuburb = () => {
    setSelectedSuburb(null);
    onSuburbSelect?.(null);
  };

  // Quick access suburbs - mix of high and low safety areas
  const quickAccessSuburbs = useMemo(() => {
    return [
      suburbIntelligence.find(s => s.id === 'ottery'),
      suburbIntelligence.find(s => s.id === 'sea-point'),
      suburbIntelligence.find(s => s.id === 'claremont'),
      suburbIntelligence.find(s => s.id === 'khayelitsha'),
      suburbIntelligence.find(s => s.id === 'camps-bay'),
    ].filter(Boolean) as SuburbData[];
  }, []);

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      {/* Search Section */}
      <div className="flex-shrink-0 relative">
        <div className={cn(
          'relative bg-card/80 backdrop-blur-md rounded-xl border-2 transition-all duration-200',
          isFocused ? 'border-primary shadow-lg shadow-primary/20' : 'border-border/50'
        )}>
          <div className="flex items-center px-4 py-3">
            <Search className={cn(
              'w-5 h-5 mr-3 transition-colors',
              isFocused ? 'text-primary' : 'text-muted-foreground'
            )} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Search suburb (e.g., Ottery, Claremont...)"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded hover:bg-background transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results Dropdown */}
        {isFocused && filteredSuburbs.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl rounded-xl border-2 border-primary/30 shadow-2xl overflow-hidden z-50 animate-fade-in">
            {filteredSuburbs.map(suburb => (
              <button
                key={suburb.id}
                onClick={() => handleSelectSuburb(suburb)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors text-left border-b border-border/30 last:border-b-0"
              >
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium text-foreground text-sm">{suburb.suburb_name}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    Ward {suburb.ward_id} • {suburb.incidents_24h} incidents today
                  </div>
                </div>
                <div 
                  className="text-xl font-black font-mono"
                  style={{ color: getSafetyColor(suburb.safety_score) }}
                >
                  {suburb.safety_score}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {isFocused && searchQuery && filteredSuburbs.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl rounded-xl border-2 border-border shadow-2xl p-4 text-center z-50 animate-fade-in">
            <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">No suburbs found for "{searchQuery}"</div>
          </div>
        )}
      </div>

      {/* Quick Access Pills */}
      {!selectedSuburb && (
        <div className="flex-shrink-0 flex flex-wrap gap-2">
          {quickAccessSuburbs.map(suburb => (
            <button
              key={suburb.id}
              onClick={() => handleSelectSuburb(suburb)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all',
                'bg-card/50 border border-border/50 hover:border-primary/50 hover:bg-primary/10',
                'hover:scale-105 active:scale-95'
              )}
            >
              {suburb.suburb_name}
            </button>
          ))}
        </div>
      )}

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide pb-4">
        {/* Sector Intelligence Card */}
        <SectorIntelligenceCard 
          selectedSuburb={selectedSuburb} 
          onClose={handleCloseSuburb} 
        />

        {/* Tourist Guidelines Accordion */}
        <div className="bg-card/50 backdrop-blur-md rounded-xl border border-border/50 overflow-hidden">
          <button
            onClick={() => setShowGuidelines(!showGuidelines)}
            className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Mountain className="w-4 h-4 text-amber-400" />
              </div>
              <span className="font-semibold text-foreground text-sm">Tourist Safety Guidelines</span>
            </div>
            {showGuidelines ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          
          {showGuidelines && (
            <div className="border-t border-border/50">
              <TouristProtocolsPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntelligenceSidebar;
