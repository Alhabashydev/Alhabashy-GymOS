import type { BodyWeightEntry, Settings, WorkoutDay, WorkoutSession } from '../types/gym';

export const STORAGE_KEYS = {
  workoutDays: 'gymos_workout_days',
  sessions: 'gymos_sessions',
  activeSession: 'gymos_active_session',
  bodyWeight: 'gymos_body_weight',
  settings: 'gymos_settings',
} as const;

export interface GymOSBackup {
  app: 'GymOS';
  version: 1;
  exportedAt: string;
  workoutDays: WorkoutDay[];
  sessions: WorkoutSession[];
  activeSession: WorkoutSession | null;
  bodyWeight: BodyWeightEntry[];
  settings: Settings;
}

export function readJson<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`GymOS could not read ${key}`, error);
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`GymOS could not save ${key}`, error);
  }
}

export function removeJson(key: string): void {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`GymOS could not remove ${key}`, error);
  }
}

export function isWorkoutDayArray(value: unknown): value is WorkoutDay[] {
  return Array.isArray(value) && value.every((day) => {
    const maybe = day as Partial<WorkoutDay>;
    return typeof maybe.id === 'string' && typeof maybe.name === 'string' && Array.isArray(maybe.exercises);
  });
}

export function isSessionArray(value: unknown): value is WorkoutSession[] {
  return Array.isArray(value) && value.every((session) => {
    const maybe = session as Partial<WorkoutSession>;
    return typeof maybe.id === 'string' && typeof maybe.workoutDayName === 'string' && Array.isArray(maybe.exercises);
  });
}

export function isBodyWeightArray(value: unknown): value is BodyWeightEntry[] {
  return Array.isArray(value) && value.every((entry) => {
    const maybe = entry as Partial<BodyWeightEntry>;
    return typeof maybe.id === 'string' && typeof maybe.date === 'string' && typeof maybe.weight === 'number';
  });
}

export function isSettings(value: unknown): value is Settings {
  const maybe = value as Partial<Settings>;
  return Boolean(
    maybe &&
    (maybe.weightUnit === 'kg' || maybe.weightUnit === 'lb') &&
    typeof maybe.defaultRestSeconds === 'number' &&
    typeof maybe.showRestTimer === 'boolean'
  );
}

export function validateBackup(value: unknown): value is GymOSBackup {
  const backup = value as Partial<GymOSBackup>;
  return Boolean(
    backup &&
    backup.app === 'GymOS' &&
    backup.version === 1 &&
    isWorkoutDayArray(backup.workoutDays) &&
    isSessionArray(backup.sessions) &&
    (backup.activeSession === null || typeof backup.activeSession?.id === 'string') &&
    isBodyWeightArray(backup.bodyWeight) &&
    isSettings(backup.settings)
  );
}
