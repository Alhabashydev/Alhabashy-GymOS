import { ArrowDown, ArrowUp, Dumbbell, Edit3, Play, Trash2 } from 'lucide-react';
import type { WorkoutDay } from '../../types/gym';
import { useLanguage } from '../../hooks/useLanguage';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { IconButton } from '../ui/IconButton';

interface WorkoutDayCardProps {
  day: WorkoutDay;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onOpen: () => void;
  onStart: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function WorkoutDayCard({ day, canMoveUp, canMoveDown, onOpen, onStart, onEdit, onDelete, onMoveUp, onMoveDown }: WorkoutDayCardProps) {
  const { t, muscle } = useLanguage();
  const groups = Array.from(new Set(day.exercises.map((exercise) => exercise.muscleGroup).filter(Boolean))).slice(0, 4);

  return (
    <Card interactive className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left rtl:text-right">
          <h3 className="font-display text-xl font-bold text-text">{day.name}</h3>
          {day.description && <p className="mt-2 text-sm leading-6 text-muted">{day.description}</p>}
        </button>
        <div className="flex items-center gap-2">
          <IconButton label={t('workouts.moveUp')} onClick={onMoveUp} disabled={!canMoveUp}><ArrowUp size={16} /></IconButton>
          <IconButton label={t('workouts.moveDown')} onClick={onMoveDown} disabled={!canMoveDown}><ArrowDown size={16} /></IconButton>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge accent>{day.exercises.length} {t('common.exercises')}</Badge>
        {groups.map((group) => <Badge key={group}>{muscle(group)}</Badge>)}
        {groups.length === 0 && <Badge>{t('workouts.noExercisesYet')}</Badge>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button onClick={onStart} disabled={day.exercises.length === 0} leftIcon={<Play size={16} />}>{t('workouts.start')}</Button>
        <Button variant="secondary" onClick={onOpen} leftIcon={<Dumbbell size={16} />}>{t('workouts.manage')}</Button>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" fullWidth onClick={onEdit} leftIcon={<Edit3 size={16} />}>{t('workouts.editDayButton')}</Button>
        <IconButton label={t('workouts.deleteDayLabel')} danger onClick={onDelete}><Trash2 size={17} /></IconButton>
      </div>
    </Card>
  );
}
