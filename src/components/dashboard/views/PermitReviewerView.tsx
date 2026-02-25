import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileCheck, Upload, Clock, CheckCircle2, AlertTriangle, XCircle, Search } from 'lucide-react';

interface Permit {
  id: string;
  title: string;
  applicant: string;
  type: 'construction' | 'renovation' | 'demolition' | 'signage';
  submitted: string;
  status: 'auto-approved' | 'human-review' | 'rejected' | 'pending';
  complianceScore: number;
  flags: string[];
  ward: number;
}

const permits: Permit[] = [
  { id: 'P-2026-0041', title: 'Residential Extension – 14 Main Rd', applicant: 'J. van der Merwe', type: 'construction', submitted: '2026-02-24', status: 'auto-approved', complianceScore: 96, flags: [], ward: 77 },
  { id: 'P-2026-0040', title: 'Commercial Signage – V&A Waterfront', applicant: 'Harbour Corp', type: 'signage', submitted: '2026-02-23', status: 'auto-approved', complianceScore: 92, flags: ['Heritage overlay zone'], ward: 54 },
  { id: 'P-2026-0039', title: 'Office Renovation – Foreshore Tower', applicant: 'CBD Holdings', type: 'renovation', submitted: '2026-02-22', status: 'human-review', complianceScore: 68, flags: ['Missing fire cert', 'Accessibility ramp unclear'], ward: 115 },
  { id: 'P-2026-0038', title: 'Demolition – Old Warehouse Woodstock', applicant: 'Regen Dev', type: 'demolition', submitted: '2026-02-21', status: 'human-review', complianceScore: 54, flags: ['Asbestos assessment required', 'Heritage building potential'], ward: 57 },
  { id: 'P-2026-0037', title: 'Multi-Story Residential – Obs', applicant: 'Metro Homes', type: 'construction', submitted: '2026-02-20', status: 'pending', complianceScore: 0, flags: [], ward: 58 },
  { id: 'P-2026-0036', title: 'Rooftop Solar – Constantia', applicant: 'Green Energy SA', type: 'renovation', submitted: '2026-02-19', status: 'auto-approved', complianceScore: 99, flags: [], ward: 64 },
];

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle2; label: string }> = {
  'auto-approved': { color: 'text-emerald-500', icon: CheckCircle2, label: 'Auto-Approved' },
  'human-review': { color: 'text-amber-500', icon: AlertTriangle, label: 'Human Review' },
  'rejected': { color: 'text-destructive', icon: XCircle, label: 'Rejected' },
  'pending': { color: 'text-muted-foreground', icon: Clock, label: 'Pending AI Scan' },
};

export default function PermitReviewerView() {
  const autoApproved = permits.filter(p => p.status === 'auto-approved').length;
  const reviewQueue = permits.filter(p => p.status === 'human-review').length;
  const autoRate = Math.round((autoApproved / permits.filter(p => p.status !== 'pending').length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">AI Permit Auto-Reviewer</h2>
        <p className="text-sm text-muted-foreground mt-1">Instant AI compliance checks for construction, renovation & signage permits</p>
      </div>

      {/* Upload CTA */}
      <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
        <CardContent className="p-6 flex flex-col items-center text-center gap-3">
          <Upload className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm font-medium">Upload Permit Documents</p>
            <p className="text-xs text-muted-foreground">PDF, images, or CAD files · AI scans for zoning, environmental & accessibility compliance</p>
          </div>
          <Button size="sm" className="gap-2"><Upload className="w-4 h-4" />Select Files</Button>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-500">{autoRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">Auto-Approval Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{autoApproved}</div>
            <div className="text-xs text-muted-foreground mt-1">Auto-Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-500">{reviewQueue}</div>
            <div className="text-xs text-muted-foreground mt-1">In Review Queue</div>
          </CardContent>
        </Card>
      </div>

      {/* Permit Timeline */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><FileCheck className="w-4 h-4" />Active Permits Timeline</CardTitle></CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="max-h-[420px]">
            <div className="divide-y divide-border">
              {permits.map(p => {
                const cfg = statusConfig[p.status];
                const StatusIcon = cfg.icon;
                return (
                  <div key={p.id} className="px-4 py-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`w-5 h-5 shrink-0 ${cfg.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{p.title}</span>
                          <Badge variant="outline" className="text-[10px] shrink-0">{p.type}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{p.id} · {p.applicant} · Ward {p.ward} · {p.submitted}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant={p.status === 'auto-approved' ? 'default' : p.status === 'human-review' ? 'secondary' : 'outline'} className="text-[10px]">
                          {cfg.label}
                        </Badge>
                        {p.complianceScore > 0 && (
                          <div className="mt-1 flex items-center gap-1.5 justify-end">
                            <span className="text-[10px] text-muted-foreground">Compliance</span>
                            <span className={`text-xs font-bold ${p.complianceScore >= 80 ? 'text-emerald-500' : p.complianceScore >= 50 ? 'text-amber-500' : 'text-destructive'}`}>{p.complianceScore}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {p.flags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 ml-8">
                        {p.flags.map(f => (
                          <Badge key={f} variant="outline" className="text-[10px] text-amber-600 border-amber-600/30">⚠ {f}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
