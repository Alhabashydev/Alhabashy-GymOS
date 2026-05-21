import { useEffect, useState } from 'react';
import type { Exercise } from '../../types/gym';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';

const muscleGroups = ['Back', 'Chest', 'Shoulders', 'Biceps', 'Triceps', 'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Abs', 'General'];

type ExerciseFormValue = Omit<Exercise, 'id' | 'order' | 'createdAt' | 'updatedAt'>;

interface ExerciseFormProps {
  initial?: Partial<ExerciseFormValue>;
  defaultRestSeconds: number;
  onSubmit: (value: ExerciseFormValue) => void;
  onCancel: () => void;
}

export function ExerciseForm({ initial, defaultRestSeconds, onSubmit, onCancel }: ExerciseFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [muscleGroup, setMuscleGroup] = useState(initial?.muscleGroup ?? 'General');
  const [sets, setSets] = useState(String(initial?.sets ?? 2));
  const [targetReps, setTargetReps] = useState(initial?.targetReps ?? '6–8');
  const [defaultWeight, setDefaultWeight] = useState(String(initial?.defaultWeight ?? 0));
  const [restSeconds, setRestSeconds] = useState(String(initial?.restSeconds ?? defaultRestSeconds));
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [error, setError] = useState('');

  useEffect(() => setError(''), [name, sets, defaultWeight, restSeconds]);

  function submit() {
    const parsedSets = Number(sets);
    const parsedWeight = Number(defaultWeight);
    const parsedRest = Number(restSeconds);

    if (!name.trim()) {
      setError('Exercise name is required.');
      return;
    }
    if (!Number.isFinite(parsedSets) || parsedSets < 1) {
      setError('Sets must be at least 1.');
      return;
    }
    if (!Number.isFinite(parsedWeight) || parsedWeight < 0) {
      setError('Weight cannot be negative.');
      return;
    }
    if (!Number.isFinite(parsedRest) || parsedRest < 0) {
      setError('Rest time cannot be negative.');
      return;
    }

    onSubmit({
      name: name.trim(),
      muscleGroup,
      sets: Math.floor(parsedSets),
      targetReps: targetReps.trim() || '6–8',
      defaultWeight: parsedWeight,
      restSeconds: Math.floor(parsedRest),
      notes: notes.trim(),
    });
  }

  return (
    <div className="space-y-5">
      <Input label="Exercise name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Lat Pulldown" autoFocus />
      <Select label="Muscle group" value={muscleGroup} onChange={(event) => setMuscleGroup(event.target.value)}>
        {muscleGroups.map((group) => <option key={group} value={group}>{group}</option>)}
      </Select>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Sets" type="number" min={1} value={sets} onChange={(event) => setSets(event.target.value)} />
        <Input label="Target reps" value={targetReps} onChange={(event) => setTargetReps(event.target.value)} placeholder="6–8" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Default weight" type="number" min={0} step="0.5" value={defaultWeight} onChange={(event) => setDefaultWeight(event.target.value)} />
        <Input label="Rest seconds" type="number" min={0} value={restSeconds} onChange={(event) => setRestSeconds(event.target.value)} />
      </div>
      <Textarea label="Exercise notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Control the negative. Keep back tight." />
      {error && <p className="rounded-control border border-danger/25 bg-danger/10 p-3 text-sm text-danger">{error}</p>}
      <div className="sticky bottom-0 -mx-5 -mb-5 flex gap-3 border-t border-white/10 bg-surface p-5">
        <Button variant="secondary" fullWidth onClick={onCancel}>Cancel</Button>
        <Button fullWidth onClick={submit}>Save exercise</Button>
      </div>
    </div>
  );
}
