export interface WorkoutDay {
  id: string;
  name: string;
  description?: string;
  order: number;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  targetReps: string;
  defaultWeight?: number;
  restSeconds?: number;
  notes: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSession {
  id: string;
  workoutDayId: string;
  workoutDayName: string;
  startedAt: string;
  finishedAt?: string;
  durationSeconds: number;
  exercises: SessionExercise[];
  status: 'active' | 'completed';
}

export interface SessionExercise {
  id: string;
  exerciseId: string;
  name: string;
  muscleGroup: string;
  notes: string;
  sets: SessionSet[];
}

export interface SessionSet {
  id: string;
  setNumber: number;
  targetReps: string;
  weight: number;
  reps: number;
  completed: boolean;
  note?: string;
}

export interface BodyWeightEntry {
  id: string;
  date: string;
  weight: number;
  note?: string;
}

export interface Settings {
  weightUnit: 'kg' | 'lb';
  defaultRestSeconds: number;
  showRestTimer: boolean;
  theme: 'dark';
  language: 'en';
}

export interface WorkoutSummaryData {
  completedSets: number;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  exercisesCompleted: number;
  notesCount: number;
  durationSeconds: number;
}

export type AppPage = 'dashboard' | 'workouts' | 'workout-detail' | 'train' | 'history' | 'weight' | 'settings';
