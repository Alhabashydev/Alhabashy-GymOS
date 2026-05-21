import type { WorkoutSession } from '../../types/gym';
import { formatDuration } from '../../utils/dates';
import { getWorkoutSummary } from '../../utils/workoutMath';
import { Card } from '../ui/Card';

interface WorkoutSummaryProps {
  session: WorkoutSession;
  unit: string;
}

export function WorkoutSummary({ session, unit }: WorkoutSummaryProps) {
  const summary = getWorkoutSummary(session);
  return (
    <Card className="space-y-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-accent">Workout summary</p>
        <h3 className="mt-1 font-display text-xl font-bold text-text">{session.workoutDayName}</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SummaryItem label="Duration" value={formatDuration(summary.durationSeconds)} />
        <SummaryItem label="Sets" value={`${summary.completedSets}/${summary.totalSets}`} />
        <SummaryItem label="Exercises" value={summary.exercisesCompleted} />
        <SummaryItem label="Total reps" value={summary.totalReps} />
        <SummaryItem label="Volume" value={`${summary.totalVolume.toLocaleString()} ${unit}`} />
        <SummaryItem label="Notes" value={summary.notesCount} />
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
