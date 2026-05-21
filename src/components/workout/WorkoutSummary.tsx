import type { WorkoutSession } from '../../types/gym';
import { useLanguage } from '../../hooks/useLanguage';
import { formatDuration } from '../../utils/dates';
import { getWorkoutSummary } from '../../utils/workoutMath';
import { Card } from '../ui/Card';

interface WorkoutSummaryProps {
  session: WorkoutSession;
  unit: string;
}

export function WorkoutSummary({ session, unit }: WorkoutSummaryProps) {
  const summary = getWorkoutSummary(session);
  const { language, t } = useLanguage();
  return (
    <Card className="space-y-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-accent">{t('summary.title')}</p>
        <h3 className="mt-1 font-display text-xl font-bold text-text">{session.workoutDayName}</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SummaryItem label={t('summary.duration')} value={formatDuration(summary.durationSeconds, language)} />
        <SummaryItem label={t('summary.sets')} value={`${summary.completedSets}/${summary.totalSets}`} />
        <SummaryItem label={t('summary.exercises')} value={summary.exercisesCompleted} />
        <SummaryItem label={t('summary.totalReps')} value={summary.totalReps} />
        <SummaryItem label={t('summary.volume')} value={`${summary.totalVolume.toLocaleString()} ${unit}`} />
        <SummaryItem label={t('summary.notes')} value={summary.notesCount} />
      </div>
    </Card>
  );
}

function SummaryItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-control border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-display text-lg font-bold text-text">{value}</p>
    </div>
  );
}
