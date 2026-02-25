import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Wrench, Heart, Leaf, Award, Search } from 'lucide-react';

const volunteers = [
  { name: 'Thandi M.', skills: ['First Aid', 'Translation (isiXhosa)'], points: 420, matches: 3 },
  { name: 'Johan V.', skills: ['Plumbing', 'Carpentry'], points: 310, matches: 2 },
  { name: 'Ayesha K.', skills: ['Gardening', 'Event Coordination'], points: 580, matches: 5 },
  { name: 'David L.', skills: ['IT Support', 'Tutoring'], points: 190, matches: 1 },
  { name: 'Nomsa P.', skills: ['First Aid', 'Childcare'], points: 350, matches: 4 },
];

const projects = [
  { title: 'Khayelitsha Clean-Up Drive', skills: ['General', 'Gardening'], date: 'Mar 1', volunteers: 12, needed: 20 },
  { title: 'Langa School Repairs', skills: ['Plumbing', 'Carpentry'], date: 'Mar 5', volunteers: 4, needed: 8 },
  { title: 'Elderly Home Visits – Athlone', skills: ['First Aid', 'Translation'], date: 'Mar 8', volunteers: 6, needed: 10 },
  { title: 'River Clean – Liesbeek', skills: ['General'], date: 'Mar 12', volunteers: 18, needed: 25 },
];

export default function VolunteerMatchView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Volunteer & Community Skill-Matching</h2>
        <p className="text-sm text-muted-foreground mt-1">Register skills · AI-matched projects · Impact points</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Registered Volunteers', value: '1,247', icon: Users, color: 'text-primary' },
          { label: 'Active Projects', value: projects.length.toString(), icon: Wrench, color: 'text-amber-500' },
          { label: 'Community Points', value: '48.2k', icon: Award, color: 'text-emerald-500' },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <k.icon className={`w-5 h-5 ${k.color}`} />
              <div>
                <div className="text-xs text-muted-foreground">{k.label}</div>
                <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Upcoming Projects</CardTitle></CardHeader>
          <CardContent className="p-0 divide-y divide-border">
            {projects.map(p => (
              <div key={p.title} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{p.title}</span>
                  <Badge variant="outline" className="text-[10px]">{p.date}</Badge>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex gap-1">
                    {p.skills.map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground">{p.volunteers}/{p.needed} filled</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Top Volunteers</CardTitle></CardHeader>
          <CardContent className="p-0 divide-y divide-border">
            {volunteers.map((v, i) => (
              <div key={v.name} className="flex items-center gap-3 px-4 py-3">
                <span className="text-xs font-mono text-muted-foreground w-4">#{i + 1}</span>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{v.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{v.name}</div>
                  <div className="text-xs text-muted-foreground">{v.skills.join(', ')}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-primary">{v.points} pts</div>
                  <div className="text-[10px] text-muted-foreground">{v.matches} matches</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
