import { useEffect, useState } from 'react';
import type { Exercise } from '../../types/gym';
import { useLanguage } from '../../hooks/useLanguage';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';

const muscleGroups = ['Back', 'Chest', 'Shoulders', 'Biceps', 'Triceps', 'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Abs', 'Adductors', 'General'];

type ExerciseFormValue = Omit<Exercise, 'id' | 'order' | 'createdAt' | 'updatedAt'>;

interface ExerciseFormProps {
  initial?: Partial<ExerciseFormValue>;
  defaultRestSeconds: number;
  onSubmit: (value: ExerciseFormValue) => void;
  onCancel: () => void;
}

export function ExerciseForm({ initial, defaultRestSeconds, onSubmit, onCancel }: ExerciseFormProps) {
  const { t, muscle } = useLanguage();
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
      setError(t('exercise.nameRequired'));
      return;
    }
    if (!Number.isFinite(parsedSets) || parsedSets < 1) {
      setError(t('exercise.setsRequired'));
      return;
    }
    if (!Number.isFinite(parsedWeight) || parsedWeight < 0) {
      setError(t('exercise.weightNegative'));
      return;
    }
    if (!Number.isFinite(parsedRest) || parsedRest < 0) {
      setError(t('exercise.restNegative'));
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
      <Input label={t('exercise.name')} value={name} onChange={(event) => setName(event.target.value)} placeholder="Lat Pulldown" autoFocus />
      <Select label={t('exercise.muscleGroup')} value={muscleGroup} onChange={(event) => setMuscleGroup(event.target.value)}>
        {muscleGroups.map((group) => <option key={group} value={group}>{muscle(group)}</option>)}
      </Select>
      <div className="grid grid-cols-2 gap-4">
        <Input label={t('exercise.sets')} type="number" min={1} value={sets} onChange={(event) => setSets(event.target.value)} />
        <Input label={t('exercise.targetReps')} value={targetReps} onChange={(event) => setTargetReps(event.target.value)} placeholder="6–8" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label={t('exercise.defaultWeight')} type="number" min={0} step="0.5" value={defaultWeight} onChange={(event) => setDefaultWeight(event.target.value)} />
        <Input label={t('exercise.restSeconds')} type="number" min={0} value={restSeconds} onChange={(event) => setRestSeconds(event.target.value)} />
      </div>
      <Textarea label={t('exercise.notes')} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={t('exercise.notesPlaceholder')} />
      {error && <p className="rounded-control border border-danger/25 bg-danger/10 p-3 text-sm text-danger">{error}</p>}
      <div className="sticky bottom-0 -mx-5 -mb-5 flex gap-3 border-t border-white/10 bg-surface p-5">
        <Button variant="secondary" fullWidth onClick={onCancel}>{t('common.cancel')}</Button>
        <Button fullWidth onClick={submit}>{t('exercise.save')}</Button>
      </div>
    </div>
  );
}
