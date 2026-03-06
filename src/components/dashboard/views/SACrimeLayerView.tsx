import { useState, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Shield, Zap, Users, Navigation, Share2, AlertTriangle, TrendingUp, TrendingDown, MapPin
} from 'lucide-react';
import {
  ResponsiveContainer, RadialBarChart, RadialBar, LineChart, Line,
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  Legend, PolarAngleAxis
} from 'recharts';

/* ── Mock Data ──────────────────────────────────────────── */

const suburbTrend24h = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h}:00`,
  risk: 30 + Math.sin((h - 3) * 0.5) * 25 + (h >= 18 || h <= 5 ? 20 : 0) + Math.round(Math.random() * 8),
}));

const suburbTrend7d = [
  { day: 'Mon', risk: 42 }, { day: 'Tue', risk: 38 }, { day: 'Wed', risk: 45 },
  { day: 'Thu', risk: 51 }, { day: 'Fri', risk: 62 }, { day: 'Sat', risk: 58 }, { day: 'Sun', risk: 44 },
];

const loadsheddingCorrelation = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  stageHours: [48, 32, 60, 80, 120, 96, 72, 110, 140, 88, 56, 44][i],
  robbery: [120, 98, 140, 180, 220, 190, 160, 210, 260, 175, 130, 110][i],
  assault: [85, 72, 95, 120, 150, 135, 110, 145, 180, 125, 90, 78][i],
  burglary: [200, 165, 230, 290, 350, 310, 260, 340, 420, 280, 210, 180][i],
}));

const spikeHotspots = [
  { area: 'Khayelitsha', incidents: 342 },
  { area: 'Mitchells Plain', incidents: 287 },
  { area: 'Nyanga', incidents: 256 },
  { area: 'Delft', incidents: 198 },
  { area: 'Gugulethu', incidents: 174 },
];

const communityIncidents = [
  { type: 'Suspicious vehicle', count: 14 },
  { type: 'Break-in attempt', count: 11 },
  { type: 'Loitering group', count: 9 },
  { type: 'Cable theft', count: 7 },
  { type: 'Armed robbery', count: 5 },
];

const precinctGauges = [
  { name: 'CPT Central', score: 72 },
  { name: 'Sea Point', score: 58 },
  { name: 'Woodstock', score: 65 },
];

const routeOptions = [
  { name: 'N2 via Airport', safety: 82, time: '25 min' },
  { name: 'M5 Southern', safety: 71, time: '30 min' },
  { name: 'R300 / N1', safety: 64, time: '35 min' },
];

const routeRiskProfile = Array.from({ length: 10 }, (_, i) => ({
  km: `${i + 1}km`,
  risk: [18, 22, 35, 52, 68, 45, 30, 25, 20, 15][i],
}));

const predictorOutput = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h}:00`,
  predicted: 20 + Math.sin((h - 4) * 0.45) * 30 + (h >= 19 || h <= 4 ? 25 : 0),
  historical: 25 + Math.sin((h - 4) * 0.45) * 28 + (h >= 19 || h <= 4 ? 22 : 0),
}));

/* ── Tooltip Style ──────────────────────────────────────── */
const tooltipStyle = {
  contentStyle: {
    background: 'hsl(220 18% 10%)',
    border: '1px solid hsl(220 14% 18%)',
    borderRadius: 8,
    fontSize: 12,
    color: 'hsl(210 40% 98%)',
  },
};

/* ── Component ──────────────────────────────────────────── */

const SACrimeLayerView = memo(() => {
  const [startSuburb, setStartSuburb] = useState('');
  const [destSuburb, setDestSuburb] = useState('');
  const [showRoutes, setShowRoutes] = useState(false);
  const [predictorFrom, setPredictorFrom] = useState('');
  const [predictorTo, setPredictorTo] = useState('');
  const [showPredictor, setShowPredictor] = useState(false);

  const currentRisk = 62;
  const nationalAvg = 55;
  const gaugeData = [{ value: currentRisk, fill: 'url(#riskGradient)' }];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            SA Crime & Loadshedding Intelligence
          </h2>
          <p className="text-sm text-muted-foreground mt-1">SAPS-grade risk analytics · Live correlation engine</p>
        </div>
        <Badge variant="outline" className="text-primary border-primary/30 text-xs">
          <Zap className="w-3 h-3 mr-1" /> LIVE
        </Badge>
      </div>

      {/* Row 1: Suburb Risk Gauge (1col) + Loadshedding Correlation (2col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 1. Suburb Risk Gauge */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <CardHeader className="pb-2 px-4 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Your Suburb Risk Tonight</CardTitle>
              <div className="text-right">
                <span className="text-2xl font-bold tabular-nums text-foreground">{currentRisk}</span>
                <p className="text-[10px] text-muted-foreground">
                  {currentRisk > nationalAvg ? (
                    <span className="text-destructive">+{currentRisk - nationalAvg} vs national avg</span>
                  ) : (
                    <span className="text-primary">{nationalAvg - currentRisk} below avg</span>
                  )}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {/* Radial Gauge */}
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="65%"
                  outerRadius="100%"
                  data={gaugeData}
                  startAngle={180}
                  endAngle={0}
                  barSize={12}
                >
                  <defs>
                    <linearGradient id="riskGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--safety-green))" />
                      <stop offset="50%" stopColor="hsl(var(--safety-yellow))" />
                      <stop offset="100%" stopColor="hsl(var(--safety-red))" />
                    </linearGradient>
                  </defs>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} angleAxisId={0} />
                  <RadialBar
                    dataKey="value"
                    cornerRadius={6}
                    animationDuration={1000}
                    animationEasing="ease-out"
                    animationBegin={0}
                    isAnimationActive={true}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            {/* 24h Trend Line */}
            <div className="h-20 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={suburbTrend24h}>
                  <Line
                    type="monotone"
                    dataKey="risk"
                    stroke="hsl(var(--primary))"
                    strokeWidth={1.5}
                    dot={false}
                    animationDuration={1000}
                    animationEasing="ease-out"
                    animationBegin={200}
                    isAnimationActive={true}
                  />
                  <Tooltip {...tooltipStyle} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 2. Loadshedding + Crime Correlation */}
        <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <CardHeader className="pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-safety-yellow" />
              Loadshedding + Crime Spikes
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-4">
            {/* Multi-line area */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={loadsheddingCorrelation}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Area type="monotone" dataKey="stageHours" name="Stage Hours" stroke="hsl(var(--safety-yellow))" fill="hsl(var(--safety-yellow))" fillOpacity={0.15} strokeWidth={2} animationDuration={1000} animationEasing="ease-out" animationBegin={0} isAnimationActive={true} />
                  <Area type="monotone" dataKey="robbery" name="Robbery" stroke="hsl(var(--safety-red))" fill="hsl(var(--safety-red))" fillOpacity={0.1} strokeWidth={1.5} animationDuration={1000} animationEasing="ease-out" animationBegin={200} isAnimationActive={true} />
                  <Area type="monotone" dataKey="assault" name="Assault" stroke="hsl(var(--safety-orange))" fill="none" strokeWidth={1.5} strokeDasharray="4 4" animationDuration={1000} animationEasing="ease-out" animationBegin={400} isAnimationActive={true} />
                  <Area type="monotone" dataKey="burglary" name="Burglary" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.08} strokeWidth={1.5} animationDuration={1000} animationEasing="ease-out" animationBegin={600} isAnimationActive={true} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Top 5 Spike Hotspots */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Top 5 Spike Hotspots</p>
              <div className="space-y-2">
                {spikeHotspots.map((h, i) => (
                  <div key={h.area} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-4 tabular-nums">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium text-foreground">{h.area}</span>
                        <span className="text-xs tabular-nums text-muted-foreground">{h.incidents}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-destructive/70 transition-all duration-700"
                          style={{ width: `${(h.incidents / spikeHotspots[0].incidents) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Family Commute (2col) + Community Reports (1col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 3. Family Commute Safety Tracker */}
        <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <CardHeader className="pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Navigation className="w-4 h-4 text-primary" />
              Safest Route for Your Family
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Start suburb (e.g. Camps Bay)"
                value={startSuburb}
                onChange={(e) => setStartSuburb(e.target.value)}
                className="flex-1 h-9 text-sm"
              />
              <Input
                placeholder="Destination (e.g. Stellenbosch)"
                value={destSuburb}
                onChange={(e) => setDestSuburb(e.target.value)}
                className="flex-1 h-9 text-sm"
              />
              <Button size="sm" onClick={() => setShowRoutes(true)} className="shrink-0">
                Calculate
              </Button>
            </div>

            {showRoutes && (
              <>
                {/* Route ranking bars */}
                <div className="space-y-2">
                  {routeOptions.map(r => (
                    <div key={r.name} className="flex items-center gap-3">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-medium text-foreground">{r.name}</span>
                          <span className="text-xs text-muted-foreground">{r.time}</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${r.safety}%`,
                              backgroundColor: r.safety >= 80
                                ? 'hsl(var(--safety-green))'
                                : r.safety >= 70
                                  ? 'hsl(var(--safety-yellow))'
                                  : 'hsl(var(--safety-orange))',
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-bold tabular-nums text-foreground w-8 text-right">{r.safety}%</span>
                    </div>
                  ))}
                </div>
                {/* Route risk profile line chart */}
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={routeRiskProfile}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="km" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                      <Tooltip {...tooltipStyle} />
                      <Line type="monotone" dataKey="risk" name="Risk Score" stroke="hsl(var(--safety-red))" strokeWidth={2} dot={{ r: 3, fill: 'hsl(var(--safety-red))' }} animationDuration={1000} animationEasing="ease-out" animationBegin={0} isAnimationActive={true} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {/* Share button */}
                <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Gridfy Safety Route: ${startSuburb} → ${destSuburb}. Safest: ${routeOptions[0].name} (${routeOptions[0].safety}%)`)}`, '_blank')}>
                  <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share via WhatsApp
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* 4. Neighbourhood Watch Aggregator */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <CardHeader className="pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Community Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-4">
            {/* Top 5 Incidents bars */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Top 5 This Week</p>
              <div className="space-y-2">
                {communityIncidents.map(inc => (
                  <div key={inc.type} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium text-foreground">{inc.type}</span>
                        <span className="text-xs tabular-nums text-muted-foreground">{inc.count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-700"
                          style={{ width: `${(inc.count / communityIncidents[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Mini precinct gauges */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Precinct Scores</p>
              <div className="grid grid-cols-3 gap-2">
                {precinctGauges.map(p => (
                  <div key={p.name} className="text-center">
                    <div className="h-16">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          innerRadius="60%"
                          outerRadius="100%"
                          data={[{ value: p.score }]}
                          startAngle={180}
                          endAngle={0}
                          barSize={6}
                        >
                          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} angleAxisId={0} />
                          <RadialBar
                            dataKey="value"
                            cornerRadius={4}
                            fill={p.score >= 70 ? 'hsl(var(--safety-green))' : p.score >= 50 ? 'hsl(var(--safety-yellow))' : 'hsl(var(--safety-red))'}
                            animationDuration={800}
                            animationEasing="ease-out"
                            isAnimationActive={true}
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                    <span className="text-[10px] text-muted-foreground leading-tight block">{p.name}</span>
                    <span className="text-xs font-bold tabular-nums text-foreground">{p.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Route Risk Predictor (full width) */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-safety-orange" />
            Route Risk Predictor
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="From suburb"
              value={predictorFrom}
              onChange={(e) => setPredictorFrom(e.target.value)}
              className="flex-1 h-9 text-sm"
            />
            <Input
              placeholder="To suburb"
              value={predictorTo}
              onChange={(e) => setPredictorTo(e.target.value)}
              className="flex-1 h-9 text-sm"
            />
            <Button size="sm" onClick={() => setShowPredictor(true)} className="shrink-0">
              Predict Risk
            </Button>
          </div>

          {showPredictor && (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={predictorOutput}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} interval={3} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Area type="monotone" dataKey="predicted" name="Predicted Risk" stroke="hsl(var(--safety-red))" fill="hsl(var(--safety-red))" fillOpacity={0.15} strokeWidth={2} animationDuration={1000} animationEasing="ease-out" animationBegin={0} isAnimationActive={true} />
                  <Area type="monotone" dataKey="historical" name="Historical Avg" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth={1.5} strokeDasharray="4 4" animationDuration={1000} animationEasing="ease-out" animationBegin={200} isAnimationActive={true} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

SACrimeLayerView.displayName = 'SACrimeLayerView';
export default SACrimeLayerView;
