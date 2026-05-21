import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { createDefaultWorkoutDays, defaultSettings } from '../data/defaultWorkout';
import type { BodyWeightEntry, Exercise, Settings, WorkoutDay, WorkoutSession } from '../types/gym';
import { nowIso, secondsBetween } from '../utils/dates';
import { createId } from '../utils/ids';
import { clampNumber } from '../utils/workoutMath';
import { GymOSBackup, readJson, removeJson, STORAGE_KEYS, validateBackup, writeJson } from '../utils/storage';

interface GymStore {
  workoutDays: WorkoutDay[];
  sessions: WorkoutSession[];
  activeSession: WorkoutSession | null;
  bodyWeight: BodyWeightEntry[];
  settings: Settings;
  setWorkoutDays: (days: WorkoutDay[]) => void;
  addWorkoutDay: (name: string, description?: string) => string;
  updateWorkoutDay: (dayId: string, updates: Partial<Pick<WorkoutDay, 'name' | 'description'>>) => void;
  deleteWorkoutDay: (dayId: string) => void;
  moveWorkoutDay: (dayId: string, direction: 'up' | 'down') => void;
  addExercise: (dayId: string, exercise: Omit<Exercise, 'id' | 'order' | 'createdAt' | 'updatedAt'>) => void;
  updateExercise: (dayId: string, exerciseId: string, updates: Partial<Exercise>) => void;
  deleteExercise: (dayId: string, exerciseId: string) => void;
  duplicateExercise: (dayId: string, exerciseId: string) => void;
  moveExercise: (dayId: string, exerciseId: string, direction: 'up' | 'down') => void;
  startWorkout: (dayId: string) => WorkoutSession | null;
  updateSessionSet: (exerciseId: string, setId: string, updates: { weight?: number; reps?: number; completed?: boolean; note?: string }) => void;
  updateSessionExerciseNotes: (exerciseId: string, notes: string, updatePlanNote?: boolean) => void;
  finishWorkout: () => WorkoutSession | null;
  cancelWorkout: () => void;
  deleteSession: (sessionId: string) => void;
  addBodyWeight: (entry: Omit<BodyWeightEntry, 'id'>) => void;
  updateBodyWeight: (entryId: string, updates: Partial<Omit<BodyWeightEntry, 'id'>>) => void;
  deleteBodyWeight: (entryId: string) => void;
  updateSettings: (updates: Partial<Settings>) => void;
  exportBackup: () => GymOSBackup;
  importBackup: (backup: unknown) => { ok: true } | { ok: false; error: string };
  resetAllData: () => void;
}

const GymContext = createContext<GymStore | null>(null);

function initialWorkoutDays(): WorkoutDay[] {
  const stored = readJson<WorkoutDay[] | null>(STORAGE_KEYS.workoutDays, null);
  if (Array.isArray(stored)) return stored;
  const starter = createDefaultWorkoutDays();
  writeJson(STORAGE_KEYS.workoutDays, starter);
  return starter;
}

function sortedDays(days: WorkoutDay[]): WorkoutDay[] {
  return [...days].sort((a, b) => a.order - b.order).map((day, index) => ({ ...day, order: index }));
}

function sortedExercises(exercises: Exercise[]): Exercise[] {
  return [...exercises].sort((a, b) => a.order - b.order).map((exercise, index) => ({ ...exercise, order: index }));
}

export function GymProvider({ children }: { children: ReactNode }) {
  const [workoutDays, rawSetWorkoutDays] = useState<WorkoutDay[]>(initialWorkoutDays);
  const [sessions, setSessionsState] = useState<WorkoutSession[]>(() => readJson(STORAGE_KEYS.sessions, []));
  const [activeSession, setActiveSessionState] = useState<WorkoutSession | null>(() => readJson(STORAGE_KEYS.activeSession, null));
  const [bodyWeight, setBodyWeightState] = useState<BodyWeightEntry[]>(() => readJson(STORAGE_KEYS.bodyWeight, []));
  const [settings, setSettingsState] = useState<Settings>(() => ({ ...defaultSettings, ...readJson(STORAGE_KEYS.settings, defaultSettings) }));

  const setWorkoutDays = useCallback((days: WorkoutDay[]) => {
    const next = sortedDays(days).map((day) => ({ ...day, exercises: sortedExercises(day.exercises) }));
    rawSetWorkoutDays(next);
    writeJson(STORAGE_KEYS.workoutDays, next);
  }, []);

  const setSessions = useCallback((next: WorkoutSession[]) => {
    setSessionsState(next);
    writeJson(STORAGE_KEYS.sessions, next);
  }, []);

  const setActiveSession = useCallback((next: WorkoutSession | null) => {
    setActiveSessionState(next);
    if (next) writeJson(STORAGE_KEYS.activeSession, next);
    else removeJson(STORAGE_KEYS.activeSession);
  }, []);

  const setBodyWeight = useCallback((next: BodyWeightEntry[]) => {
    const sorted = [...next].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setBodyWeightState(sorted);
    writeJson(STORAGE_KEYS.bodyWeight, sorted);
  }, []);

  const setSettings = useCallback((next: Settings) => {
    setSettingsState(next);
    writeJson(STORAGE_KEYS.settings, next);
  }, []);

  const addWorkoutDay = useCallback((name: string, description?: string) => {
    const date = nowIso();
    const id = createId('day');
    setWorkoutDays([
      ...workoutDays,
      { id, name: name.trim(), description: description?.trim(), order: workoutDays.length, exercises: [], createdAt: date, updatedAt: date },
    ]);
    return id;
  }, [setWorkoutDays, workoutDays]);

  const updateWorkoutDay = useCallback((dayId: string, updates: Partial<Pick<WorkoutDay, 'name' | 'description'>>) => {
    setWorkoutDays(workoutDays.map((day) => day.id === dayId ? { ...day, ...updates, updatedAt: nowIso() } : day));
  }, [setWorkoutDays, workoutDays]);

  const deleteWorkoutDay = useCallback((dayId: string) => {
    setWorkoutDays(workoutDays.filter((day) => day.id !== dayId));
    if (activeSession?.workoutDayId === dayId) setActiveSession(null);
  }, [activeSession, setActiveSession, setWorkoutDays, workoutDays]);

  const moveWorkoutDay = useCallback((dayId: string, direction: 'up' | 'down') => {
    const days = sortedDays(workoutDays);
    const index = days.findIndex((day) => day.id === dayId);
    const target = direction === 'up' ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= days.length) return;
    [days[index], days[target]] = [days[target], days[index]];
    setWorkoutDays(days.map((day, order) => ({ ...day, order })));
  }, [setWorkoutDays, workoutDays]);

  const addExercise = useCallback((dayId: string, exercise: Omit<Exercise, 'id' | 'order' | 'createdAt' | 'updatedAt'>) => {
    const date = nowIso();
    setWorkoutDays(workoutDays.map((day) => {
      if (day.id !== dayId) return day;
      const newExercise: Exercise = {
        ...exercise,
        id: createId('exercise'),
        order: day.exercises.length,
        sets: Math.max(1, Math.floor(exercise.sets)),
        defaultWeight: clampNumber(exercise.defaultWeight || 0),
        restSeconds: clampNumber(exercise.restSeconds || settings.defaultRestSeconds),
        createdAt: date,
        updatedAt: date,
      };
      return { ...day, exercises: [...day.exercises, newExercise], updatedAt: date };
    }));
  }, [setWorkoutDays, settings.defaultRestSeconds, workoutDays]);

  const updateExercise = useCallback((dayId: string, exerciseId: string, updates: Partial<Exercise>) => {
    setWorkoutDays(workoutDays.map((day) => {
      if (day.id !== dayId) return day;
      return {
        ...day,
        updatedAt: nowIso(),
        exercises: sortedExercises(day.exercises.map((exercise) => exercise.id === exerciseId ? {
          ...exercise,
          ...updates,
          sets: updates.sets === undefined ? exercise.sets : Math.max(1, Math.floor(updates.sets)),
          defaultWeight: updates.defaultWeight === undefined ? exercise.defaultWeight : clampNumber(updates.defaultWeight),
          restSeconds: updates.restSeconds === undefined ? exercise.restSeconds : clampNumber(updates.restSeconds),
          updatedAt: nowIso(),
        } : exercise)),
      };
    }));
  }, [setWorkoutDays, workoutDays]);

  const deleteExercise = useCallback((dayId: string, exerciseId: string) => {
    setWorkoutDays(workoutDays.map((day) => day.id === dayId ? { ...day, exercises: sortedExercises(day.exercises.filter((exercise) => exercise.id !== exerciseId)), updatedAt: nowIso() } : day));
  }, [setWorkoutDays, workoutDays]);

  const duplicateExercise = useCallback((dayId: string, exerciseId: string) => {
    setWorkoutDays(workoutDays.map((day) => {
      if (day.id !== dayId) return day;
      const source = day.exercises.find((exercise) => exercise.id === exerciseId);
      if (!source) return day;
      const date = nowIso();
      return {
        ...day,
        updatedAt: date,
        exercises: sortedExercises([...day.exercises, { ...source, id: createId('exercise'), name: `${source.name} Copy`, order: day.exercises.length, createdAt: date, updatedAt: date }]),
      };
    }));
  }, [setWorkoutDays, workoutDays]);

  const moveExercise = useCallback((dayId: string, exerciseId: string, direction: 'up' | 'down') => {
    setWorkoutDays(workoutDays.map((day) => {
      if (day.id !== dayId) return day;
      const exercises = sortedExercises(day.exercises);
      const index = exercises.findIndex((exercise) => exercise.id === exerciseId);
      const target = direction === 'up' ? index - 1 : index + 1;
      if (index < 0 || target < 0 || target >= exercises.length) return day;
      [exercises[index], exercises[target]] = [exercises[target], exercises[index]];
      return { ...day, exercises: exercises.map((exercise, order) => ({ ...exercise, order })), updatedAt: nowIso() };
    }));
  }, [setWorkoutDays, workoutDays]);

  const startWorkout = useCallback((dayId: string) => {
    const day = workoutDays.find((item) => item.id === dayId);
    if (!day || day.exercises.length === 0) return null;

    const session: WorkoutSession = {
      id: createId('session'),
      workoutDayId: day.id,
      workoutDayName: day.name,
      startedAt: nowIso(),
      durationSeconds: 0,
      status: 'active',
      exercises: sortedExercises(day.exercises).map((exercise) => ({
        id: createId('session_exercise'),
        exerciseId: exercise.id,
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        notes: exercise.notes,
        sets: Array.from({ length: exercise.sets }, (_, index) => ({
          id: createId('set'),
          setNumber: index + 1,
          targetReps: exercise.targetReps,
          weight: Number(exercise.defaultWeight) || 0,
          reps: 0,
          completed: false,
          note: '',
        })),
      })),
    };

    setActiveSession(session);
    return session;
  }, [setActiveSession, workoutDays]);

  const updateSessionSet = useCallback((exerciseId: string, setId: string, updates: { weight?: number; reps?: number; completed?: boolean; note?: string }) => {
    if (!activeSession) return;
    const next: WorkoutSession = {
      ...activeSession,
      durationSeconds: secondsBetween(activeSession.startedAt),
      exercises: activeSession.exercises.map((exercise) => exercise.id !== exerciseId ? exercise : {
        ...exercise,
        sets: exercise.sets.map((set) => set.id !== setId ? set : {
          ...set,
          ...updates,
          weight: updates.weight === undefined ? set.weight : clampNumber(updates.weight),
          reps: updates.reps === undefined ? set.reps : clampNumber(updates.reps),
        }),
      }),
    };
    setActiveSession(next);
  }, [activeSession, setActiveSession]);

  const updateSessionExerciseNotes = useCallback((exerciseId: string, notes: string, updatePlanNote?: boolean) => {
    if (!activeSession) return;
    const next: WorkoutSession = {
      ...activeSession,
      durationSeconds: secondsBetween(activeSession.startedAt),
      exercises: activeSession.exercises.map((exercise) => exercise.id === exerciseId ? { ...exercise, notes } : exercise),
    };
    setActiveSession(next);

    if (updatePlanNote) {
      const sessionExercise = activeSession.exercises.find((exercise) => exercise.id === exerciseId);
      if (sessionExercise) updateExercise(activeSession.workoutDayId, sessionExercise.exerciseId, { notes });
    }
  }, [activeSession, setActiveSession, updateExercise]);

  const finishWorkout = useCallback(() => {
    if (!activeSession) return null;
    const finishedAt = nowIso();
    const completed: WorkoutSession = {
      ...activeSession,
      finishedAt,
      durationSeconds: secondsBetween(activeSession.startedAt, finishedAt),
      status: 'completed',
    };
    setSessions([completed, ...sessions]);
    setActiveSession(null);
    return completed;
  }, [activeSession, sessions, setActiveSession, setSessions]);

  const cancelWorkout = useCallback(() => {
    setActiveSession(null);
  }, [setActiveSession]);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(sessions.filter((session) => session.id !== sessionId));
  }, [sessions, setSessions]);

  const addBodyWeight = useCallback((entry: Omit<BodyWeightEntry, 'id'>) => {
    setBodyWeight([...bodyWeight, { ...entry, id: createId('weight'), weight: clampNumber(entry.weight) }]);
  }, [bodyWeight, setBodyWeight]);

  const updateBodyWeight = useCallback((entryId: string, updates: Partial<Omit<BodyWeightEntry, 'id'>>) => {
    setBodyWeight(bodyWeight.map((entry) => entry.id === entryId ? { ...entry, ...updates, weight: updates.weight === undefined ? entry.weight : clampNumber(updates.weight) } : entry));
  }, [bodyWeight, setBodyWeight]);

  const deleteBodyWeight = useCallback((entryId: string) => {
    setBodyWeight(bodyWeight.filter((entry) => entry.id !== entryId));
  }, [bodyWeight, setBodyWeight]);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings({ ...settings, ...updates, theme: 'dark', language: 'en' });
  }, [setSettings, settings]);

  const exportBackup = useCallback((): GymOSBackup => ({
    app: 'GymOS',
    version: 1,
    exportedAt: nowIso(),
    workoutDays,
    sessions,
    activeSession,
    bodyWeight,
    settings,
  }), [activeSession, bodyWeight, sessions, settings, workoutDays]);

  const importBackup = useCallback((backup: unknown) => {
    if (!validateBackup(backup)) return { ok: false as const, error: 'Invalid GymOS backup file.' };
    setWorkoutDays(backup.workoutDays);
    setSessions(backup.sessions);
    setActiveSession(backup.activeSession);
    setBodyWeight(backup.bodyWeight);
    setSettings(backup.settings);
    return { ok: true as const };
  }, [setActiveSession, setBodyWeight, setSessions, setSettings, setWorkoutDays]);

  const resetAllData = useCallback(() => {
    const starter = createDefaultWorkoutDays();
    setWorkoutDays(starter);
    setSessions([]);
    setActiveSession(null);
    setBodyWeight([]);
    setSettings(defaultSettings);
  }, [setActiveSession, setBodyWeight, setSessions, setSettings, setWorkoutDays]);

  const value = useMemo<GymStore>(() => ({
    workoutDays,
    sessions,
    activeSession,
    bodyWeight,
    settings,
    setWorkoutDays,
    addWorkoutDay,
    updateWorkoutDay,
    deleteWorkoutDay,
    moveWorkoutDay,
    addExercise,
    updateExercise,
    deleteExercise,
    duplicateExercise,
    moveExercise,
    startWorkout,
    updateSessionSet,
    updateSessionExerciseNotes,
    finishWorkout,
    cancelWorkout,
    deleteSession,
    addBodyWeight,
    updateBodyWeight,
    deleteBodyWeight,
    updateSettings,
    exportBackup,
    importBackup,
    resetAllData,
  }), [
    addBodyWeight,
    addExercise,
    addWorkoutDay,
    activeSession,
    bodyWeight,
    cancelWorkout,
    deleteBodyWeight,
    deleteExercise,
    deleteSession,
    deleteWorkoutDay,
    duplicateExercise,
    exportBackup,
    finishWorkout,
    importBackup,
    moveExercise,
    moveWorkoutDay,
    resetAllData,
    sessions,
    setWorkoutDays,
    settings,
    startWorkout,
    updateBodyWeight,
    updateExercise,
    updateSessionExerciseNotes,
    updateSessionSet,
    updateSettings,
    updateWorkoutDay,
    workoutDays,
  ]);

  return <GymContext.Provider value={value}>{children}</GymContext.Provider>;
}

export function useGymStore() {
  const context = useContext(GymContext);
  if (!context) throw new Error('useGymStore must be used inside GymProvider');
  return context;
}
