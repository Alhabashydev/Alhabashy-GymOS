import { useState } from 'react';
import { Plus, ListChecks } from 'lucide-react';
import type { AppPage } from '../types/gym';
import { useGymStore } from '../hooks/useGymStore';
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
      setError('Workout day name is required.');
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
        eyebrow="Plan"
        title="Workout days"
        description="Manage your training days and keep the plan simple enough to use inside the gym."
        action={<Button onClick={openCreate} leftIcon={<Plus size={16} />}>Add Day</Button>}
      />

      {workoutDays.length === 0 ? (
        <EmptyState title="Create your first workout day" description="Add a day, then add exercises with sets, target reps, weight, and notes." actionLabel="Add Workout Day" onAction={openCreate} icon={<ListChecks size={20} />} />
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

      <BottomSheet open={sheetOpen} title={editingDay ? 'Edit workout day' : 'Add workout day'} onClose={() => setSheetOpen(false)}>
        <div className="space-y-5">
          <Input label="Day name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Saturday — Upper A" autoFocus />
          <Textarea label="Description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Back, shoulders, and arms." />
          {error && <p className="rounded-control border border-danger/25 bg-danger/10 p-3 text-sm text-danger">{error}</p>}
          <div className="sticky bottom-0 -mx-5 -mb-5 flex gap-3 border-t border-white/10 bg-surface p-5">
            <Button variant="secondary" fullWidth onClick={() => setSheetOpen(false)}>Cancel</Button>
            <Button fullWidth onClick={saveDay}>Save day</Button>
          </div>
        </div>
      </BottomSheet>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete workout day?"
        description="This removes the workout day and all exercises inside it. Completed history stays saved."
        confirmLabel="Delete"
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
