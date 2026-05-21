import type { Settings, WorkoutDay } from '../types/gym';
import { createId } from '../utils/ids';
import { nowIso } from '../utils/dates';

export const defaultSettings: Settings = {
  weightUnit: 'kg',
  defaultRestSeconds: 90,
  showRestTimer: true,
  theme: 'dark',
  language: 'en',
};

function exercise(input: {
  name: string;
  muscleGroup: string;
  sets: number;
  targetReps: string;
  defaultWeight: number;
  notes: string;
  order: number;
}) {
  const date = nowIso();
  return {
    id: createId('exercise'),
    restSeconds: 90,
    createdAt: date,
    updatedAt: date,
    ...input,
  };
}

export function createDefaultWorkoutDays(): WorkoutDay[] {
  const date = nowIso();

  return [
    {
      id: createId('day'),
      name: 'Saturday — Upper A',
      description: 'Back, shoulders, arms. Simple heavy upper session.',
      order: 0,
      createdAt: date,
      updatedAt: date,
      exercises: [
        exercise({ name: 'Lat Pulldown', muscleGroup: 'Back', sets: 3, targetReps: '6–8', defaultWeight: 45, notes: 'Control the negative and get a full stretch.', order: 0 }),
        exercise({ name: 'T-Bar Row', muscleGroup: 'Back', sets: 2, targetReps: '5–7', defaultWeight: 30, notes: 'Keep your chest stable and avoid swinging.', order: 1 }),
        exercise({ name: 'Shoulder Press', muscleGroup: 'Shoulders', sets: 2, targetReps: '6–8', defaultWeight: 30, notes: 'Keep the movement controlled.', order: 2 }),
        exercise({ name: 'Preacher Curl', muscleGroup: 'Biceps', sets: 2, targetReps: '6–8', defaultWeight: 40, notes: 'Do not lift your elbows.', order: 3 }),
        exercise({ name: 'Triceps Pushdown', muscleGroup: 'Triceps', sets: 2, targetReps: '6–8', defaultWeight: 15, notes: 'Lock elbows near your sides.', order: 4 }),
      ],
    },
    {
      id: createId('day'),
      name: 'Sunday — Lower A',
      description: 'Hamstrings, quads, and calves. Clean lower session.',
      order: 1,
      createdAt: date,
      updatedAt: date,
      exercises: [
        exercise({ name: 'Barbell RDL', muscleGroup: 'Hamstrings', sets: 2, targetReps: '6–8', defaultWeight: 0, notes: 'Keep your back tight and feel the hamstrings stretch.', order: 0 }),
        exercise({ name: 'Pendulum Squat', muscleGroup: 'Quads', sets: 2, targetReps: '6–8', defaultWeight: 0, notes: 'Control the bottom position.', order: 1 }),
        exercise({ name: 'Seated Leg Curl', muscleGroup: 'Hamstrings', sets: 2, targetReps: '7–9', defaultWeight: 0, notes: 'Squeeze hard at the bottom.', order: 2 }),
        exercise({ name: 'Leg Extension', muscleGroup: 'Quads', sets: 3, targetReps: '6–8', defaultWeight: 0, notes: 'Pause at the top.', order: 3 }),
        exercise({ name: 'Seated Calf Raise', muscleGroup: 'Calves', sets: 2, targetReps: '10–15', defaultWeight: 0, notes: 'Full stretch and full squeeze.', order: 4 }),
      ],
    },
  ];
}
