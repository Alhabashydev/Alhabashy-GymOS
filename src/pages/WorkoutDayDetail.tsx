import { useMemo, useState } from 'react';
import { ArrowLeft, Dumbbell, Plus } from 'lucide-react';
import type { AppPage, Exercise } from '../types/gym';
import { useGymStore } from '../hooks/useGymStore';
import { Badge } from '../components/ui/Badge';
import { BottomSheet } from '../components/ui/BottomSheet';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { SectionHeader } from '../components/ui/SectionHeader';
import { ExerciseCard } from '../components/workout/ExerciseCard';
import { ExerciseForm } from '../components/workout/ExerciseForm';

interface WorkoutDayDetailProps {
  dayId?: string | null;
  onNavigate: (page: AppPage, id?: string) => void;
}

export function WorkoutDayDetail({ dayId, onNavigate }: WorkoutDayDetailProps) {
  const { workoutDays, settings, addExercise, updateExercise, deleteExercise, duplicateExercise, moveExercise, startWorkout } = useGymStore();
  const day = workoutDays.find((item) => item.id === dayId) ?? workoutDays[0];
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const editingExercise = useMemo(() => day?.exercises.find((exercise) => exercise.id === editingId), [day, editingId]);

  if (!day) {
    return (
      <EmptyState title="Workout day not found" description="The selected workout day no longer exists." actionLabel="Back to Plan" onAction={() => onNavigate('workouts')} />
    );
  }

  function openCreate() {
    setEditingId(null);
    setSheetOpen(true);
  }

  function openEdit(exerciseId: string) {
    setEditingId(exerciseId);
    setSheetOpen(true);
  }

  function submitExercise(value: Omit<Exercise, 'id' | 'order' | 'createdAt' | 'updatedAt'>) {
    if (!day) return;
    if (editingId) updateExercise(day.id, editingId, value);
    else addExercise(day.id, value);
    setSheetOpen(false);
  }

  function start() {
    const session = startWorkout(day.id);
    if (session) onNavigate('train');
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('workouts')} leftIcon={<ArrowLeft size={16} />}>Plan</Button>
        <Badge>{day.exercises.length} exercises</Badge>
      </div>

      <SectionHeader
        eyebrow="Workout day"
        title={day.name}
        description={day.description || 'Manage exercises, sets, default weights, rest time, and exercise notes.'}
        action={<Button onClick={openCreate} leftIcon={<Plus size={16} />}>Add Exercise</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Button onClick={start} disabled={day.exercises.length === 0} leftIcon={<Dumbbell size={16} />}>Start this workout</Button>
        <Button variant="secondary" onClick={openCreate}>Add exercise</Button>
      </div>

      {day.exercises.length === 0 ? (
        <EmptyState title="Add your first exercise" description="Each exercise can have sets, target reps, default weight, rest time, and notes." actionLabel="Add Exercise" onAction={openCreate} icon={<Dumbbell size={20} />} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {day.exercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              unit={settings.weightUnit}
              canMoveUp={index > 0}
              canMoveDown={index < day.exercises.length - 1}
              onEdit={() => openEdit(exercise.id)}
              onDelete={() => setDeleteId(exercise.id)}
              onDuplicate={() => duplicateExercise(day.id, exercise.id)}
              onMoveUp={() => moveExercise(day.id, exercise.id, 'up')}
              onMoveDown={() => moveExercise(day.id, exercise.id, 'down')}
            />
          ))}
        </div>
      )}

      <BottomSheet open={sheetOpen} title={editingExercise ? 'Edit exercise' : 'Add exercise'} onClose={() => setSheetOpen(false)}>
        <ExerciseForm
          initial={editingExercise}
          defaultRestSeconds={settings.defaultRestSeconds}
          onSubmit={submitExercise}
          onCancel={() => setSheetOpen(false)}
        />
      </BottomSheet>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete exercise?"
        description="This removes the exercise from the workout plan. Existing completed workout history stays saved."
        confirmLabel="Delete"
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteExercise(day.id, deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
