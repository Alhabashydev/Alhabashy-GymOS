import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { BodyWeightEntry } from '../../types/gym';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { LineChart as LineChartIcon } from 'lucide-react';

interface BodyWeightChartProps {
  entries: BodyWeightEntry[];
  unit: string;
}

export function BodyWeightChart({ entries, unit }: BodyWeightChartProps) {
  if (entries.length === 0) {
    return <EmptyState title="Add your first body weight entry" description="Your simple weight trend chart will appear here." icon={<LineChartIcon size={20} />} />;
  }

  const data = [...entries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      weight: entry.weight,
    }));

  return (
    <Card className="h-72">
      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-accent">Trend</p>
        <h3 className="font-display text-xl font-bold text-text">Body weight</h3>
      </div>
      <ResponsiveContainer width="100%" height="78%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <XAxis dataKey="date" tick={{ fill: '#999795', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#999795', fontSize: 11 }} axisLine={false} tickLine={false} width={42} domain={['dataMin - 2', 'dataMax + 2']} />
          <Tooltip
            contentStyle={{ background: '#0F0F0F', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, color: '#F0EDE8' }}
            labelStyle={{ color: '#999795' }}
            formatter={(value) => [`${value} ${unit}`, 'Weight']}
          />
          <Line type="monotone" dataKey="weight" stroke="#A8D8A8" strokeWidth={2.5} dot={{ fill: '#A8D8A8', r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
