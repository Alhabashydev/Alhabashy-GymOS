import { useState } from 'react';
import { Plus, ListChecks } from 'lucide-react';
import type { AppPage } from '../types/gym';
import { useGymStore } from '../hooks/useGymStore';
import { useLanguage } from '../hooks/useLanguage';
import { BottomSheet } from '../components/ui/BottomSheet';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Textarea } from '../components/ui/Textarea';
import { WorkoutDayCard } from '../components/workout/WorkoutDayCard';

interface WorkoutsProps {
  onNavigate: (page: AppPage, id?: string) => void;
}

export function Workouts({ onNavigate }: WorkoutsProps) {
  const { workoutDays, addWorkoutDay, updateWorkoutDay, deleteWorkoutDay, moveWorkoutDay, startWorkout } = useGymStore();
  const { t } = useLanguage();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const editingDay = workoutDays.find((day) => day.id === editingId);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  function openCreate() {
    setEditingId(null);
    setName('');
    setDescription('');
    setError('');
    setSheetOpen(true);
  }

  function openEdit(dayId: string) {
    const day = workoutDays.find((item) => item.id === dayId);
    if (!day) return;
    setEditingId(dayId);
    setName(day.name);
    setDescription(day.description ?? '');
    setError('');
    setSheetOpen(true);
  }

  function saveDay() {
    if (!name.trim()) {
      setError(t('workouts.dayNameRequired'));
      return;
    }
    if (editingId) {
      updateWorkoutDay(editingId, { name: name.trim(), description: description.trim() });
    } else {
      addWorkoutDay(name.trim(), description.trim());
    }
    setSheetOpen(false);
  }

  function start(dayId: string) {
    const session = startWorkout(dayId);
    if (session) onNavigate('train');
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow={t('workouts.eyebrow')}
        title={t('workouts.title')}
        description={t('workouts.description')}
        action={<Button onClick={openCreate} leftIcon={<Plus size={16} />}>{t('workouts.addDay')}</Button>}
      />

      {workoutDays.length === 0 ? (
        <EmptyState title={t('workouts.createFirstTitle')} description={t('workouts.createFirstDescription')} actionLabel={t('workouts.addWorkoutDay')} onAction={openCreate} icon={<ListChecks size={20} />} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {workoutDays.map((day, index) => (
            <WorkoutDayCard
              key={day.id}
              day={day}
              canMoveUp={index > 0}
              canMoveDown={index < workoutDays.length - 1}
              onOpen={() => onNavigate('workout-detail', day.id)}
              onStart={() => start(day.id)}
              onEdit={() => openEdit(day.id)}
              onDelete={() => setDeleteId(day.id)}
              onMoveUp={() => moveWorkoutDay(day.id, 'up')}
              onMoveDown={() => moveWorkoutDay(day.id, 'down')}
            />
          ))}
        </div>
      )}

      <BottomSheet open={sheetOpen} title={editingDay ? t('workouts.editDay') : t('workouts.addDaySheet')} onClose={() => setSheetOpen(false)}>
        <div className="space-y-5">
          <Input label={t('workouts.dayName')} value={name} onChange={(event) => setName(event.target.value)} placeholder="Saturday — Upper A" autoFocus />
          <Textarea label={t('workouts.descriptionLabel')} value={description} onChange={(event) => setDescription(event.target.value)} placeholder={t('workouts.descriptionPlaceholder')} />
          {error && <p className="rounded-control border border-danger/25 bg-danger/10 p-3 text-sm text-danger">{error}</p>}
          <div className="sticky bottom-0 -mx-5 -mb-5 flex gap-3 border-t border-white/10 bg-surface p-5">
            <Button variant="secondary" fullWidth onClick={() => setSheetOpen(false)}>{t('common.cancel')}</Button>
            <Button fullWidth onClick={saveDay}>{t('workouts.saveDay')}</Button>
          </div>
        </div>
      </BottomSheet>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title={t('workouts.deleteTitle')}
        description={t('workouts.deleteDescription')}
        confirmLabel={t('common.delete')}
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteWorkoutDay(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
