import type { WorkoutSession } from '../../types/gym';
import { useLanguage } from '../../hooks/useLanguage';
import { formatDateTime } from '../../utils/dates';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { WorkoutSummary } from '../workout/WorkoutSummary';

interface SessionDetailProps {
  session: WorkoutSession;
  unit: string;
}

export function SessionDetail({ session, unit }: SessionDetailProps) {
  const { language, t, muscle } = useLanguage();
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-muted">{formatDateTime(session.finishedAt || session.startedAt, language)}</p>
        <h2 className="font-display text-2xl font-bold text-text">{session.workoutDayName}</h2>
      </div>
      <WorkoutSummary session={session} unit={unit} />
      <div className="space-y-4">
        {session.exercises.map((exercise) => (
          <Card key={exercise.id} className="space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-lg font-bold text-text">{exercise.name}</h3>
                <Badge>{muscle(exercise.muscleGroup)}</Badge>
              </div>
              {exercise.notes && <p className="mt-3 rounded-control border border-white/10 bg-black/20 p-4 text-sm leading-6 text-text/85">{exercise.notes}</p>}
            </div>
            <div className="space-y-3">
              {exercise.sets.map((set) => (
                <div key={set.id} className="rounded-control border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-text">{t('common.set')} {set.setNumber}</p>
                      <p className="text-sm text-muted">{set.weight} {unit} × {set.reps} {t('common.reps')}</p>
                    </div>
                    <Badge accent={set.completed}>{set.completed ? t('common.done') : t('common.skipped')}</Badge>
                  </div>
                  {set.note && <p className="mt-3 text-sm leading-6 text-muted">{set.note}</p>}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
