import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import type { WorkoutSession } from '../../types/gym';
import { useLanguage } from '../../hooks/useLanguage';
import { formatDateTime, formatDuration } from '../../utils/dates';
import { getWorkoutSummary } from '../../utils/workoutMath';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { IconButton } from '../ui/IconButton';

interface SessionCardProps {
  session: WorkoutSession;
  unit: string;
  onOpen: () => void;
  onDelete: () => void;
}

export function SessionCard({ session, unit, onOpen, onDelete }: SessionCardProps) {
  const summary = getWorkoutSummary(session);
  const { dir, language, t } = useLanguage();
  const OpenIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <Card interactive className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left rtl:text-right">
          <h3 className="font-display text-xl font-bold text-text">{session.workoutDayName}</h3>
          <p className="mt-1 text-sm text-muted">{formatDateTime(session.finishedAt || session.startedAt, language)}</p>
        </button>
        <div className="flex gap-2">
          <IconButton label={t('history.openSession')} onClick={onOpen}><OpenIcon size={18} /></IconButton>
          <IconButton label={t('history.deleteSession')} danger onClick={onDelete}><Trash2 size={17} /></IconButton>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge accent>{summary.completedSets}/{summary.totalSets} {t('common.sets')}</Badge>
        <Badge>{formatDuration(summary.durationSeconds, language)}</Badge>
        <Badge>{summary.totalReps} {t('common.reps')}</Badge>
        <Badge>{summary.totalVolume.toLocaleString()} {unit}</Badge>
      </div>
    </Card>
  );
}
