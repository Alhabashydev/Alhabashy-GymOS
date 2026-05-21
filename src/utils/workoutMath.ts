import type { WorkoutSession, WorkoutSummaryData } from '../types/gym';
import { secondsBetween } from './dates';

export function getWorkoutSummary(session: WorkoutSession): WorkoutSummaryData {
  let completedSets = 0;
  let totalSets = 0;
  let totalReps = 0;
  let totalVolume = 0;
  let exercisesCompleted = 0;
  let notesCount = 0;

  session.exercises.forEach((exercise) => {
    let completedInExercise = 0;
    if (exercise.notes.trim()) notesCount += 1;

    exercise.sets.forEach((set) => {
      totalSets += 1;
      if (set.note?.trim()) notesCount += 1;
      if (set.completed) {
        completedSets += 1;
        completedInExercise += 1;
        totalReps += Number(set.reps) || 0;
        totalVolume += (Number(set.weight) || 0) * (Number(set.reps) || 0);
      }
    });

    if (completedInExercise > 0) exercisesCompleted += 1;
  });

  return {
    completedSets,
    totalSets,
    totalReps,
    totalVolume,
    exercisesCompleted,
    notesCount,
    durationSeconds: session.finishedAt ? secondsBetween(session.startedAt, session.finishedAt) : secondsBetween(session.startedAt),
  };
}

export function clampNumber(value: number, min = 0): number {
  const safe = Number(value);
  if (Number.isNaN(safe)) return min;
  return Math.max(min, safe);
}
