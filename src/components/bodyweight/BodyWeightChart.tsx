import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { LineChart as LineChartIcon } from 'lucide-react';
import type { BodyWeightEntry } from '../../types/gym';
import { useLanguage } from '../../hooks/useLanguage';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';

interface BodyWeightChartProps {
  entries: BodyWeightEntry[];
  unit: string;
}

export function BodyWeightChart({ entries, unit }: BodyWeightChartProps) {
  const { language, t } = useLanguage();

  if (entries.length === 0) {
    return <EmptyState title={t('weight.emptyTitle')} description={t('weight.chartEmptyDescription')} icon={<LineChartIcon size={20} />} />;
  }

  const data = [...entries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString(language === 'ar' ? 'ar' : 'en', { month: 'short', day: 'numeric' }),
      weight: entry.weight,
    }));

  return (
    <Card className="h-72">
      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-accent">{t('weight.trend')}</p>
        <h3 className="font-display text-xl font-bold text-text">{t('weight.title')}</h3>
      </div>
      <ResponsiveContainer width="100%" height="78%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <XAxis dataKey="date" tick={{ fill: '#999795', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#999795', fontSize: 11 }} axisLine={false} tickLine={false} width={42} domain={['dataMin - 2', 'dataMax + 2']} />
          <Tooltip
            contentStyle={{ background: '#0F0F0F', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, color: '#F0EDE8' }}
            labelStyle={{ color: '#999795' }}
            formatter={(value) => [`${value} ${unit}`, t('common.weight')]}
          />
          <Line type="monotone" dataKey="weight" stroke="#A8D8A8" strokeWidth={2.5} dot={{ fill: '#A8D8A8', r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
