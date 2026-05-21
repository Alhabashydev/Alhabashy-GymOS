import { Clock, Play } from 'lucide-react';
import type { WorkoutSession } from '../../types/gym';
import { formatDuration, secondsBetween } from '../../utils/dates';
import { getWorkoutSummary } from '../../utils/workoutMath';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ActiveWorkoutCardProps {
  session: WorkoutSession;
  onContinue: () => void;
}

export function ActiveWorkoutCard({ session, onContinue }: ActiveWorkoutCardProps) {
  const summary = getWorkoutSummary(session);
  return (
    <Card className="space-y-4 border-accent/25 bg-accent/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge accent>Workout in progress</Badge>
          <h3 className="mt-3 font-display text-xl font-bold text-text">{session.workoutDayName}</h3>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted"><Clock size={15} /> {formatDuration(secondsBetween(session.startedAt))}</p>
        </div>
        <p className="text-sm text-accent">{summary.completedSets}/{summary.totalSets} sets</p>
      </div>
      <Button fullWidth onClick={onContinue} leftIcon={<Play size={16} />}>Continue Workout</Button>
    </Card>
  );
}
