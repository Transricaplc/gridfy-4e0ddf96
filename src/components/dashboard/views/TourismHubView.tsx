import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search, MapPin, Phone, Globe, Mail, Clock, Users, Navigation,
  Thermometer, Wind, Star, Filter, ExternalLink, Mountain, Waves,
  Wine, Landmark, Camera, TreePine, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Category = 'All' | 'Nature' | 'History' | 'Adventure' | 'Wine' | 'Beach' | 'Culture' | 'Family';

interface Attraction {
  id: string;
  name: string;
  category: Category;
  description: string;
  phone: string;
  email: string;
  website: string;
  hours: string;
  isOpen: boolean;
  lat: number;
  lng: number;
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  crowdPercent: number;
  rating: number;
  sustainabilityScore: number;
  aiTip: string;
  photo: string;
}

const attractions: Attraction[] = [
  {
    id: 'table-mountain',
    name: 'Table Mountain Aerial Cableway',
    category: 'Nature',
    description: 'Iconic flat-topped mountain offering panoramic views of Cape Town via rotating cable car. One of the New7Wonders of Nature.',
    phone: '+27 21 424 8181',
    email: 'info@tablemountain.net',
    website: 'https://tablemountain.net',
    hours: '08:00 – 18:00',
    isOpen: true,
    lat: -33.9575,
    lng: 18.4034,
    crowdLevel: 'Moderate',
    crowdPercent: 55,
    rating: 4.8,
    sustainabilityScore: 92,
    aiTip: 'Wind speeds dropping — ideal window in 2 hours',
    photo: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&h=400&fit=crop',
  },
  {
    id: 'robben-island',
    name: 'Robben Island Museum',
    category: 'History',
    description: 'UNESCO World Heritage Site. Former political prison where Nelson Mandela was held. Accessible via ferry from V&A Waterfront.',
    phone: '+27 21 413 4200',
    email: 'infow@robben-island.org.za',
    website: 'https://robben-island.org.za',
    hours: '09:00 – 15:00 (ferry departures)',
    isOpen: true,
    lat: -33.8066,
    lng: 18.3666,
    crowdLevel: 'High',
    crowdPercent: 78,
    rating: 4.7,
    sustainabilityScore: 88,
    aiTip: 'Book 2 days ahead — 80% chance of sell-out tomorrow',
    photo: 'https://images.unsplash.com/photo-1591121060175-5523370a3f78?w=600&h=400&fit=crop',
  },
  {
    id: 'atlantis-dunes',
    name: 'Atlantis Dunes',
    category: 'Adventure',
    description: 'Thrilling quad biking and sandboarding on vast coastal dunes. Multiple adventure operators available.',
    phone: '+27 21 572 2900',
    email: 'bookings@atlantisdunes.co.za',
    website: 'https://atlantisdunes.co.za',
    hours: '08:00 – 17:00',
    isOpen: true,
    lat: -33.6311,
    lng: 18.4621,
    crowdLevel: 'Low',
    crowdPercent: 22,
    rating: 4.5,
    sustainabilityScore: 70,
    aiTip: 'Low crowd — great time to visit! UV index moderate.',
    photo: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&h=400&fit=crop',
  },
  {
    id: 'groot-constantia',
    name: 'Groot Constantia Wine Estate',
    category: 'Wine',
    description: 'South Africa\'s oldest wine-producing farm (est. 1685). Award-winning wines, cellar tours, and fine dining.',
    phone: '+27 21 794 5128',
    email: 'enquiries@grootconstantia.co.za',
    website: 'https://grootconstantia.co.za',
    hours: '09:00 – 17:30',
    isOpen: true,
    lat: -34.0269,
    lng: 18.4231,
    crowdLevel: 'Low',
    crowdPercent: 30,
    rating: 4.6,
    sustainabilityScore: 85,
    aiTip: 'Sunset tasting slots available — book now',
    photo: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&h=400&fit=crop',
  },
  {
    id: 'va-waterfront',
    name: 'V&A Waterfront',
    category: 'Culture',
    description: 'Cape Town\'s premier shopping, dining, and entertainment destination with harbor views and the Zeitz MOCAA museum.',
    phone: '+27 21 408 7600',
    email: 'info@waterfront.co.za',
    website: 'https://waterfront.co.za',
    hours: '09:00 – 21:00',
    isOpen: true,
    lat: -33.9036,
    lng: 18.4207,
    crowdLevel: 'Very High',
    crowdPercent: 88,
    rating: 4.5,
    sustainabilityScore: 78,
    aiTip: 'Peak hours — crowd drops 40% after 17:00',
    photo: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=600&h=400&fit=crop',
  },
  {
    id: 'kirstenbosch',
    name: 'Kirstenbosch National Botanical Garden',
    category: 'Nature',
    description: 'World-renowned botanical garden on the eastern slopes of Table Mountain. Features the Boomslang Tree Canopy Walkway.',
    phone: '+27 21 799 8783',
    email: 'info@sanbi.org',
    website: 'https://sanbi.org/gardens/kirstenbosch',
    hours: '08:00 – 18:00',
    isOpen: true,
    lat: -33.9881,
    lng: 18.4327,
    crowdLevel: 'Moderate',
    crowdPercent: 50,
    rating: 4.9,
    sustainabilityScore: 96,
    aiTip: 'Best light for photos before 10:00',
    photo: 'https://images.unsplash.com/photo-1591019479261-1a103585c559?w=600&h=400&fit=crop',
  },
  {
    id: 'cape-point',
    name: 'Cape Point & Cape of Good Hope',
    category: 'Nature',
    description: 'Dramatic cliffs at the southwestern tip of Africa. Home to diverse fynbos, baboons, and the historic lighthouse.',
    phone: '+27 21 780 9010',
    email: 'info@sanparks.org',
    website: 'https://capepoint.co.za',
    hours: '06:00 – 18:00',
    isOpen: true,
    lat: -34.3568,
    lng: 18.4972,
    crowdLevel: 'Moderate',
    crowdPercent: 45,
    rating: 4.7,
    sustainabilityScore: 94,
    aiTip: 'Wind advisory lifted — clear skies next 4 hours',
    photo: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop',
  },
  {
    id: 'boulders-beach',
    name: 'Boulders Beach Penguin Colony',
    category: 'Beach',
    description: 'Protected beach colony of endangered African penguins. Boardwalk viewing and swimming areas.',
    phone: '+27 21 786 2329',
    email: 'info@sanparks.org',
    website: 'https://sanparks.org',
    hours: '08:00 – 17:00',
    isOpen: true,
    lat: -34.1976,
    lng: 18.4512,
    crowdLevel: 'High',
    crowdPercent: 72,
    rating: 4.6,
    sustainabilityScore: 90,
    aiTip: 'Penguin feeding time at 14:30 — arrive early',
    photo: 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=600&h=400&fit=crop',
  },
  {
    id: 'lions-head',
    name: 'Lion\'s Head & Signal Hill',
    category: 'Nature',
    description: 'Popular hiking peak with 360° views of the city, ocean, and Table Mountain. Famous for full-moon hikes.',
    phone: '',
    email: '',
    website: 'https://sanparks.org',
    hours: 'Open 24/7',
    isOpen: true,
    lat: -33.9343,
    lng: 18.3897,
    crowdLevel: 'High',
    crowdPercent: 65,
    rating: 4.8,
    sustainabilityScore: 95,
    aiTip: 'Sunset hike starts 17:45 — trail busy after 16:00',
    photo: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=600&h=400&fit=crop',
  },
  {
    id: 'chapmans-peak',
    name: 'Chapman\'s Peak Drive',
    category: 'Nature',
    description: '9km scenic coastal drive with 114 curves carved into the cliff face between Hout Bay and Noordhoek.',
    phone: '+27 21 791 8222',
    email: 'info@chapmanspeakdrive.co.za',
    website: 'https://chapmanspeakdrive.co.za',
    hours: '06:00 – 19:00',
    isOpen: true,
    lat: -34.0854,
    lng: 18.3571,
    crowdLevel: 'Low',
    crowdPercent: 18,
    rating: 4.9,
    sustainabilityScore: 82,
    aiTip: 'No closures today — road fully open',
    photo: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&h=400&fit=crop',
  },
  {
    id: 'bo-kaap',
    name: 'Bo-Kaap',
    category: 'Culture',
    description: 'Historic neighborhood with vibrant pastel houses and rich Cape Malay heritage. Home to the Bo-Kaap Museum.',
    phone: '+27 21 481 3939',
    email: '',
    website: 'https://iziko.org.za',
    hours: '09:00 – 17:00',
    isOpen: true,
    lat: -33.9207,
    lng: 18.4135,
    crowdLevel: 'Moderate',
    crowdPercent: 52,
    rating: 4.4,
    sustainabilityScore: 88,
    aiTip: 'Best photos early morning — fewer tour groups',
    photo: 'https://images.unsplash.com/photo-1580746738099-d0b8e4c4f2eb?w=600&h=400&fit=crop',
  },
  {
    id: 'camps-bay',
    name: 'Camps Bay Beach',
    category: 'Beach',
    description: 'Trendy beach strip backed by the Twelve Apostles mountain range. Sunset hotspot with beachside restaurants.',
    phone: '',
    email: '',
    website: 'https://capetown.travel',
    hours: 'Open 24/7',
    isOpen: true,
    lat: -33.9506,
    lng: 18.3782,
    crowdLevel: 'High',
    crowdPercent: 75,
    rating: 4.5,
    sustainabilityScore: 72,
    aiTip: 'UV index HIGH — seek shade 12:00–15:00',
    photo: 'https://images.unsplash.com/photo-1576485375217-d6a95e34d043?w=600&h=400&fit=crop',
  },
  {
    id: 'two-oceans',
    name: 'Two Oceans Aquarium',
    category: 'Family',
    description: 'Interactive marine aquarium at the V&A Waterfront showcasing Atlantic and Indian Ocean marine life.',
    phone: '+27 21 418 3823',
    email: 'info@aquarium.co.za',
    website: 'https://aquarium.co.za',
    hours: '09:30 – 18:00',
    isOpen: true,
    lat: -33.9081,
    lng: 18.4178,
    crowdLevel: 'Moderate',
    crowdPercent: 48,
    rating: 4.4,
    sustainabilityScore: 86,
    aiTip: 'Penguin feeding show at 15:00 — arrive 14:30',
    photo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
  },
  {
    id: 'stellenbosch',
    name: 'Stellenbosch Winelands',
    category: 'Wine',
    description: 'Historic university town surrounded by hundreds of wine farms. Famous Cabernet Sauvignon and Chenin Blanc.',
    phone: '+27 21 886 4310',
    email: 'info@wineroute.co.za',
    website: 'https://wineroute.co.za',
    hours: '10:00 – 17:00',
    isOpen: true,
    lat: -33.9321,
    lng: 18.8602,
    crowdLevel: 'Low',
    crowdPercent: 35,
    rating: 4.7,
    sustainabilityScore: 80,
    aiTip: 'Harvest season — special cellar tours available',
    photo: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&h=400&fit=crop',
  },
  {
    id: 'district-six',
    name: 'District Six Museum',
    category: 'History',
    description: 'Powerful museum documenting forced removals during apartheid. Features personal stories and artifacts.',
    phone: '+27 21 466 7200',
    email: 'info@districtsix.co.za',
    website: 'https://districtsix.co.za',
    hours: '09:00 – 16:00',
    isOpen: true,
    lat: -33.9295,
    lng: 18.4337,
    crowdLevel: 'Low',
    crowdPercent: 20,
    rating: 4.6,
    sustainabilityScore: 92,
    aiTip: 'Guided tours at 10:00 & 14:00 — highly recommended',
    photo: 'https://images.unsplash.com/photo-1580746738099-d0b8e4c4f2eb?w=600&h=400&fit=crop',
  },
  {
    id: 'constantia-glen',
    name: 'Constantia Glen Wine Farm',
    category: 'Wine',
    description: 'Boutique wine estate in the Constantia Valley offering award-winning Bordeaux-style blends and mountain views.',
    phone: '+27 21 795 5639',
    email: 'info@constantiaglen.com',
    website: 'https://constantiaglen.com',
    hours: '10:00 – 17:00',
    isOpen: true,
    lat: -34.0258,
    lng: 18.4130,
    crowdLevel: 'Low',
    crowdPercent: 15,
    rating: 4.7,
    sustainabilityScore: 89,
    aiTip: 'Intimate setting — no booking needed today',
    photo: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&h=400&fit=crop',
  },
];

const categories: Category[] = ['All', 'Nature', 'History', 'Adventure', 'Wine', 'Beach', 'Culture', 'Family'];

const categoryIcons: Record<Category, typeof Mountain> = {
  All: MapPin,
  Nature: TreePine,
  History: Landmark,
  Adventure: Mountain,
  Wine: Wine,
  Beach: Waves,
  Culture: Camera,
  Family: Star,
};

const crowdColor: Record<string, string> = {
  Low: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
  Moderate: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  High: 'bg-orange-500/15 text-orange-500 border-orange-500/30',
  'Very High': 'bg-red-500/15 text-red-500 border-red-500/30',
};

const AttractionCard = ({ a }: { a: Attraction }) => (
  <Card className="card-hover overflow-hidden group">
    {/* Photo */}
    <div className="relative h-40 overflow-hidden">
      <img
        src={a.photo}
        alt={a.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute top-2 right-2 flex gap-1.5">
        <Badge variant="outline" className={cn('text-[10px] border', crowdColor[a.crowdLevel])}>
          <Users className="w-3 h-3 mr-1" />{a.crowdLevel}
        </Badge>
      </div>
      <div className="absolute bottom-2 left-2 flex items-center gap-1">
        <Badge className={cn('text-[10px]', a.isOpen ? 'bg-emerald-600' : 'bg-red-600')}>
          {a.isOpen ? 'Open Now' : 'Closed'}
        </Badge>
        <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/50 text-white text-[10px]">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{a.rating}
        </div>
      </div>
    </div>

    <CardHeader className="pb-2 pt-3 px-4">
      <CardTitle className="text-sm font-bold leading-tight line-clamp-1">{a.name}</CardTitle>
      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{a.description}</p>
    </CardHeader>

    <CardContent className="px-4 pb-4 space-y-3">
      {/* Hours */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="w-3.5 h-3.5 shrink-0" />
        <span>{a.hours}</span>
      </div>

      {/* Contact row */}
      <div className="flex items-center gap-2 flex-wrap">
        {a.phone && (
          <a href={`tel:${a.phone}`} className="flex items-center gap-1 text-[10px] text-primary hover:underline">
            <Phone className="w-3 h-3" />{a.phone}
          </a>
        )}
        {a.website && (
          <a href={a.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-primary hover:underline">
            <Globe className="w-3 h-3" />Website
          </a>
        )}
      </div>

      {/* Crowd density bar */}
      <div>
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">Crowd density</span>
          <span className="font-semibold tabular-nums">{a.crowdPercent}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', {
              'bg-emerald-500': a.crowdPercent < 40,
              'bg-amber-500': a.crowdPercent >= 40 && a.crowdPercent < 65,
              'bg-orange-500': a.crowdPercent >= 65 && a.crowdPercent < 80,
              'bg-red-500': a.crowdPercent >= 80,
            })}
            style={{ width: `${a.crowdPercent}%` }}
          />
        </div>
      </div>

      {/* AI Tip */}
      <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
        <Thermometer className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
        <p className="text-[10px] text-primary font-medium leading-relaxed">{a.aiTip}</p>
      </div>

      {/* Sustainability */}
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground">Sustainability</span>
        <div className="flex items-center gap-1.5">
          <TreePine className="w-3 h-3 text-emerald-500" />
          <span className="font-bold text-emerald-500">{a.sustainabilityScore}/100</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button size="sm" className="flex-1 h-8 text-xs gap-1.5">
          <Navigation className="w-3.5 h-3.5" />Get There
        </Button>
        <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
          <ExternalLink className="w-3.5 h-3.5" />Book
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function TourismHubView() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('All');
  const [tab, setTab] = useState<'cards' | 'map'>('cards');

  const filtered = useMemo(() => {
    return attractions.filter(a => {
      const matchCat = category === 'All' || a.category === category;
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tourism Hub</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Cape Town attractions with real-time crowd intelligence & AI recommendations
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Attractions', value: attractions.length, icon: MapPin },
          { label: 'Open Now', value: attractions.filter(a => a.isOpen).length, icon: Clock },
          { label: 'Low Crowd', value: attractions.filter(a => a.crowdPercent < 40).length, icon: Users },
          { label: 'Avg Rating', value: (attractions.reduce((s, a) => s + a.rating, 0) / attractions.length).toFixed(1), icon: Star },
        ].map(s => (
          <Card key={s.label} className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground tabular-nums">{s.value}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search + Filter + View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search attractions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Tabs value={tab} onValueChange={v => setTab(v as any)} className="shrink-0">
          <TabsList className="h-9">
            <TabsTrigger value="cards" className="text-xs">Cards</TabsTrigger>
            <TabsTrigger value="map" className="text-xs">Map</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Category Pills */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-1">
          {categories.map(cat => {
            const Icon = categoryIcons[cat];
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border',
                  category === cat
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                )}
              >
                <Icon className="w-3.5 h-3.5" />{cat}
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Content */}
      {tab === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(a => <AttractionCard key={a.id} a={a} />)}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No attractions found for this filter.
            </div>
          )}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="h-[500px] bg-muted flex items-center justify-center text-sm text-muted-foreground">
            <div className="text-center space-y-2">
              <MapPin className="w-8 h-8 mx-auto text-primary/40" />
              <p>Interactive map with {filtered.length} attraction pins</p>
              <p className="text-xs">Integrates with existing Leaflet map layers</p>
            </div>
          </div>
        </Card>
      )}

      {/* AI Day Planner CTA */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">AI Perfect Day Planner</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Let our AI plan an optimized itinerary based on crowd levels, weather, and your interests
            </p>
          </div>
          <Button size="sm" className="shrink-0 gap-1.5 text-xs">
            Plan My Day <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
