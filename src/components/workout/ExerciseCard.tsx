import { ArrowDown, ArrowUp, Copy, Edit3, Trash2 } from 'lucide-react';
import type { Exercise } from '../../types/gym';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { IconButton } from '../ui/IconButton';

interface ExerciseCardProps {
  exercise: Exercise;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  unit: string;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function ExerciseCard({ exercise, canMoveUp, canMoveDown, unit, onEdit, onDelete, onDuplicate, onMoveUp, onMoveDown }: ExerciseCardProps) {
  return (
    <Card interactive className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-bold text-text">{exercise.name}</h3>
            <Badge>{exercise.muscleGroup || 'General'}</Badge>
          </div>
          <p className="mt-2 text-sm text-muted">{exercise.sets} sets • {exercise.targetReps} reps • {exercise.defaultWeight ?? 0}{unit}</p>
        </div>
        <div className="flex gap-2">
          <IconButton label="Move exercise up" onClick={onMoveUp} disabled={!canMoveUp}><ArrowUp size={16} /></IconButton>
          <IconButton label="Move exercise down" onClick={onMoveDown} disabled={!canMoveDown}><ArrowDown size={16} /></IconButton>
        </div>
      </div>

      {exercise.notes && (
        <div className="rounded-control border border-white/10 bg-black/20 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Notes</p>
          <p className="mt-2 text-sm leading-6 text-text/90">{exercise.notes}</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3">
        <IconButton label="Edit exercise" onClick={onEdit}><Edit3 size={17} /></IconButton>
        <IconButton label="Duplicate exercise" onClick={onDuplicate}><Copy size={17} /></IconButton>
        <IconButton label="Delete exercise" danger onClick={onDelete}><Trash2 size={17} /></IconButton>
      </div>
    </Card>
  );
}
