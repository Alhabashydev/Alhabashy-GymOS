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
      description: 'Back + delt focus.',
      order: 0,
      createdAt: date,
      updatedAt: date,
      exercises: [
        exercise({ name: 'Lat Pulldown', muscleGroup: 'Back', sets: 3, targetReps: '6–8', defaultWeight: 45, notes: '9 Failure.', order: 0 }),
        exercise({ name: 'T-Bar Row', muscleGroup: 'Back', sets: 2, targetReps: '5–7', defaultWeight: 30, notes: '8 Failure.', order: 1 }),
        exercise({ name: 'Shoulder Press', muscleGroup: 'Shoulders', sets: 2, targetReps: '6–8', defaultWeight: 30, notes: '7 Failure.', order: 2 }),
        exercise({ name: 'Fly Machine', muscleGroup: 'Chest', sets: 2, targetReps: '8–10', defaultWeight: 55, notes: '7 Failure.', order: 3 }),
        exercise({ name: 'Preacher Curl', muscleGroup: 'Biceps', sets: 2, targetReps: '6–8', defaultWeight: 40, notes: 'PH.', order: 4 }),
        exercise({ name: 'Triceps Pushdown', muscleGroup: 'Triceps', sets: 2, targetReps: '6–8', defaultWeight: 15, notes: 'PH.', order: 5 }),
        exercise({ name: 'Hammer Curl', muscleGroup: 'Biceps', sets: 2, targetReps: '6–8', defaultWeight: 0, notes: '', order: 6 }),
      ],
    },
    {
      id: createId('day'),
      name: 'Sunday — Lower A',
      description: 'Hamstring focus.',
      order: 1,
      createdAt: date,
      updatedAt: date,
      exercises: [
        exercise({ name: 'Barbell RDL', muscleGroup: 'Hamstrings', sets: 2, targetReps: '6–8', defaultWeight: 0, notes: '', order: 0 }),
        exercise({ name: 'Pendulum Squat', muscleGroup: 'Quads', sets: 2, targetReps: '6–8', defaultWeight: 0, notes: '', order: 1 }),
        exercise({ name: 'Seated Leg Curl', muscleGroup: 'Hamstrings', sets: 2, targetReps: '7–9', defaultWeight: 0, notes: '', order: 2 }),
        exercise({ name: 'Leg Extension', muscleGroup: 'Quads', sets: 3, targetReps: '6–8', defaultWeight: 0, notes: '', order: 3 }),
        exercise({ name: 'Adduction Machine', muscleGroup: 'Adductors', sets: 2, targetReps: '8–12', defaultWeight: 0, notes: '', order: 4 }),
        exercise({ name: 'Seated Toe Press', muscleGroup: 'Calves', sets: 2, targetReps: '10–15', defaultWeight: 0, notes: '', order: 5 }),
      ],
    },
    {
      id: createId('day'),
      name: 'Monday — Rest',
      description: 'Full break day.',
      order: 2,
      createdAt: date,
      updatedAt: date,
      exercises: [],
    },
    {
      id: createId('day'),
      name: 'Tuesday — Upper B',
      description: 'Chest focus.',
      order: 3,
      createdAt: date,
      updatedAt: date,
      exercises: [
        exercise({ name: 'Incline Press', muscleGroup: 'Chest', sets: 3, targetReps: '6–8', defaultWeight: 0, notes: '', order: 0 }),
        exercise({ name: 'Fly Machine', muscleGroup: 'Chest', sets: 2, targetReps: '6–8', defaultWeight: 0, notes: '', order: 1 }),
        exercise({ name: 'Lat Pulldown', muscleGroup: 'Back', sets: 2, targetReps: '6–8', defaultWeight: 0, notes: '', order: 2 }),
        exercise({ name: 'Rear Delt Fly', muscleGroup: 'Rear Delts', sets: 2, targetReps: '8–10', defaultWeight: 0, notes: '', order: 3 }),
        exercise({ name: 'Triceps Pushdown', muscleGroup: 'Triceps', sets: 2, targetReps: '6–8', defaultWeight: 0, notes: '', order: 4 }),
        exercise({ name: 'Preacher Curl', muscleGroup: 'Biceps', sets: 2, targetReps: '6–8', defaultWeight: 0, notes: '', order: 5 }),
        exercise({ name: 'Reverse Grip Barbell Curl (EZ Bar)', muscleGroup: 'Forearms', sets: 2, targetReps: '6–8', defaultWeight: 0, notes: '', order: 6 }),
      ],
    },
    {
      id: createId('day'),
      name: 'Wednesday — Lower B',
      description: 'Quad / glute focus.',
      order: 4,
      createdAt: date,
      updatedAt: date,
      exercises: [
        exercise({ name: 'Squat', muscleGroup: 'Quads', sets: 3, targetReps: '6–8', defaultWeight: 0, notes: '', order: 0 }),
        exercise({ name: 'Bulgarian Split Squat', muscleGroup: 'Glutes', sets: 2, targetReps: '7–9', defaultWeight: 0, notes: '', order: 1 }),
        exercise({ name: 'Leg Extension', muscleGroup: 'Quads', sets: 2, targetReps: '6–8', defaultWeight: 0, notes: '', order: 2 }),
        exercise({ name: 'Seated Leg Curl', muscleGroup: 'Hamstrings', sets: 2, targetReps: '5–7', defaultWeight: 0, notes: '', order: 3 }),
        exercise({ name: 'Seated Toe Press', muscleGroup: 'Calves', sets: 2, targetReps: '10–15', defaultWeight: 0, notes: '', order: 4 }),
      ],
    },
    {
      id: createId('day'),
      name: 'Thursday — Upper C',
      description: 'Back focus.',
      order: 5,
      createdAt: date,
      updatedAt: date,
      exercises: [
        exercise({ name: 'Pull-Ups or Lat Pulldown', muscleGroup: 'Back', sets: 3, targetReps: '8–10', defaultWeight: 0, notes: '', order: 0 }),
        exercise({ name: 'Seated Row', muscleGroup: 'Back', sets: 2, targetReps: '6–8', defaultWeight: 0, notes: '', order: 1 }),
        exercise({ name: 'Fly Machine', muscleGroup: 'Chest', sets: 2, targetReps: '8–10', defaultWeight: 0, notes: '', order: 2 }),
        exercise({ name: 'Lateral Raises', muscleGroup: 'Shoulders', sets: 2, targetReps: '8–10', defaultWeight: 0, notes: '', order: 3 }),
        exercise({ name: 'Preacher Curl', muscleGroup: 'Biceps', sets: 2, targetReps: '6–8', defaultWeight: 0, notes: '', order: 4 }),
        exercise({ name: 'Hammer Curl', muscleGroup: 'Biceps', sets: 2, targetReps: '6–8', defaultWeight: 0, notes: '', order: 5 }),
        exercise({ name: 'Overhead Triceps Extension', muscleGroup: 'Triceps', sets: 2, targetReps: '6–8', defaultWeight: 0, notes: '', order: 6 }),
      ],
    },
    {
      id: createId('day'),
      name: 'Next Rotation — Upper D',
      description: 'Chest focus.',
      order: 6,
      createdAt: date,
      updatedAt: date,
      exercises: [
        exercise({ name: 'Flat Press', muscleGroup: 'Chest', sets: 2, targetReps: '6–8', defaultWeight: 0, notes: '', order: 0 }),
        exercise({ name: 'Incline Press', muscleGroup: 'Chest', sets: 3, targetReps: '6–8', defaultWeight: 0, notes: '', order: 1 }),
        exercise({ name: 'Seated Row', muscleGroup: 'Back', sets: 2, targetReps: '6–8', defaultWeight: 0, notes: '', order: 2 }),
        exercise({ name: 'Rear Delt Fly', muscleGroup: 'Rear Delts', sets: 2, targetReps: '8–10', defaultWeight: 0, notes: '', order: 3 }),
        exercise({ name: 'Triceps Pushdown', muscleGroup: 'Triceps', sets: 2, targetReps: '6–8', defaultWeight: 0, notes: '', order: 4 }),
        exercise({ name: 'Incline DB Curl', muscleGroup: 'Biceps', sets: 2, targetReps: '6–8', defaultWeight: 0, notes: '', order: 5 }),
      ],
    },
  ];
}
