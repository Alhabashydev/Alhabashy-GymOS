import { Check, Minus, Plus } from 'lucide-react';
import type { SessionSet } from '../../types/gym';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

interface SetTrackerRowProps {
  set: SessionSet;
  unit: string;
  onChange: (updates: Partial<SessionSet>) => void;
  onCompleted: () => void;
}

export function SetTrackerRow({ set, unit, onChange, onCompleted }: SetTrackerRowProps) {
  const weight = Number(set.weight) || 0;
  const reps = Number(set.reps) || 0;

  return (
    <div className={cn('space-y-4 rounded-card border border-white/10 bg-black/20 p-4', set.completed && 'border-accent/30 bg-accent/5')}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-base font-bold text-text">Set {set.setNumber}</p>
          <p className="text-xs text-muted">Target {set.targetReps}</p>
        </div>
        <Button variant={set.completed ? 'secondary' : 'primary'} onClick={onCompleted} leftIcon={<Check size={16} />}>
          {set.completed ? 'Done' : 'Done Set'}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <Input label={`Weight (${unit})`} type="number" step="0.5" min={0} value={set.weight} onChange={(event) => onChange({ weight: Number(event.target.value) })} />
          <div className="grid grid-cols-2 gap-3">
            <IconButton label="Decrease weight" onClick={() => onChange({ weight: Math.max(0, weight - 2.5) })}><Minus size={16} /></IconButton>
            <IconButton label="Increase weight" onClick={() => onChange({ weight: weight + 2.5 })}><Plus size={16} /></IconButton>
          </div>
        </div>
        <div className="space-y-3">
          <Input label="Reps" type="number" min={0} value={set.reps} onChange={(event) => onChange({ reps: Number(event.target.value) })} />
          <div className="grid grid-cols-2 gap-3">
            <IconButton label="Decrease reps" onClick={() => onChange({ reps: Math.max(0, reps - 1) })}><Minus size={16} /></IconButton>
            <IconButton label="Increase reps" onClick={() => onChange({ reps: reps + 1 })}><Plus size={16} /></IconButton>
          </div>
        </div>
      </div>
      <Textarea label="Set note" value={set.note ?? ''} onChange={(event) => onChange({ note: event.target.value })} placeholder="Optional set note" className="min-h-20" />
    </div>
  );
}
