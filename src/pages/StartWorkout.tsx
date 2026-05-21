import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Dumbbell, Play, XCircle } from 'lucide-react';
import type { AppPage } from '../types/gym';
import { formatDuration, secondsBetween } from '../utils/dates';
import { getWorkoutSummary } from '../utils/workoutMath';
import { useGymStore } from '../hooks/useGymStore';
import { useLanguage } from '../hooks/useLanguage';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Textarea } from '../components/ui/Textarea';
import { SetTrackerRow } from '../components/workout/SetTrackerRow';
import { RestTimer } from '../components/workout/RestTimer';
import { WorkoutSummary } from '../components/workout/WorkoutSummary';

interface StartWorkoutProps {
  onNavigate: (page: AppPage, id?: string) => void;
}

export function StartWorkout({ onNavigate }: StartWorkoutProps) {
  const {
    workoutDays,
    activeSession,
    settings,
    startWorkout,
    updateSessionSet,
    updateSessionExerciseNotes,
    finishWorkout,
    cancelWorkout,
  } = useGymStore();
  const { language, t, muscle } = useLanguage();

  const [elapsed, setElapsed] = useState(0);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [finishOpen, setFinishOpen] = useState(false);
  const [summarySessionId, setSummarySessionId] = useState<string | null>(null);
  const [timer, setTimer] = useState<{ active: boolean; seconds: number }>({ active: false, seconds: 0 });

  useEffect(() => {
    if (!activeSession) return;
    setElapsed(secondsBetween(activeSession.startedAt));
    const interval = window.setInterval(() => setElapsed(secondsBetween(activeSession.startedAt)), 1000);
    return () => window.clearInterval(interval);
  }, [activeSession]);

  const summary = useMemo(() => activeSession ? getWorkoutSummary(activeSession) : null, [activeSession]);

  function chooseWorkout(dayId: string) {
    const session = startWorkout(dayId);
    if (session) setSummarySessionId(null);
  }

  if (!activeSession && summarySessionId) {
    return <CompletedSummary sessionId={summarySessionId} onNavigate={onNavigate} />;
  }

  if (!activeSession) {
    return (
      <div className="space-y-8">
        <SectionHeader eyebrow={t('train.eyebrow')} title={t('train.title')} description={t('train.description')} />
        {workoutDays.length === 0 ? (
          <EmptyState title={t('train.createFirstTitle')} description={t('train.createFirstDescription')} actionLabel={t('dashboard.managePlan')} onAction={() => onNavigate('workouts')} icon={<Dumbbell size={20} />} />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {workoutDays.map((day) => (
              <Card key={day.id} interactive className="space-y-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-text">{day.name}</h2>
                  <p className="mt-2 text-sm text-muted">{day.exercises.length} {t('common.exercises')}</p>
                </div>
                <Button fullWidth disabled={day.exercises.length === 0} onClick={() => chooseWorkout(day.id)} leftIcon={<Play size={16} />}>{t('train.startWorkout')}</Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow={t('train.activeEyebrow')}
        title={activeSession.workoutDayName}
        description={`${t('train.setsDone', { done: summary?.completedSets ?? 0, total: summary?.totalSets ?? 0 })} • ${formatDuration(elapsed, language)}`}
      />

      <div className="sticky top-[80px] z-20 rounded-card border border-white/10 bg-page/85 p-3 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm text-muted">{t('common.progress')}</p>
          <p className="text-sm font-medium text-accent">{summary?.completedSets ?? 0}/{summary?.totalSets ?? 0}</p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${summary && summary.totalSets > 0 ? (summary.completedSets / summary.totalSets) * 100 : 0}%` }} />
        </div>
      </div>

      <div className="space-y-5">
        {activeSession.exercises.map((exercise) => {
          const dayExercise = workoutDays.find((day) => day.id === activeSession.workoutDayId)?.exercises.find((item) => item.id === exercise.exerciseId);
          const restSeconds = dayExercise?.restSeconds ?? settings.defaultRestSeconds;
          return (
            <Card key={exercise.id} className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-bold text-text">{exercise.name}</h2>
                <Badge>{muscle(exercise.muscleGroup)}</Badge>
                <Badge>{restSeconds}s {t('common.rest')}</Badge>
              </div>
              <div className="rounded-card border border-white/10 bg-black/20 p-4">
                <Textarea
                  label={t('train.exerciseNotes')}
                  value={exercise.notes}
                  onChange={(event) => updateSessionExerciseNotes(exercise.id, event.target.value, false)}
                  placeholder={t('train.notesPlaceholder')}
                  className="min-h-24"
                />
                <Button
                  className="mt-3"
                  variant="secondary"
                  size="sm"
                  onClick={() => updateSessionExerciseNotes(exercise.id, exercise.notes, true)}
                >
                  {t('train.updatePlanNote')}
                </Button>
              </div>
              <div className="space-y-4">
                {exercise.sets.map((set) => (
                  <SetTrackerRow
                    key={set.id}
                    set={set}
                    unit={settings.weightUnit}
                    onChange={(updates) => updateSessionSet(exercise.id, set.id, updates)}
                    onCompleted={() => {
                      updateSessionSet(exercise.id, set.id, { completed: !set.completed });
                      if (!set.completed && settings.showRestTimer) setTimer({ active: true, seconds: restSeconds });
                    }}
                  />
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="space-y-4">
        <WorkoutSummary session={activeSession} unit={settings.weightUnit} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Button onClick={() => setFinishOpen(true)} leftIcon={<CheckCircle2 size={16} />}>{t('train.finishWorkout')}</Button>
          <Button variant="danger" onClick={() => setCancelOpen(true)} leftIcon={<XCircle size={16} />}>{t('train.cancelWorkout')}</Button>
        </div>
      </Card>

      <RestTimer active={timer.active} seconds={timer.seconds} onClose={() => setTimer({ active: false, seconds: 0 })} />

      <ConfirmDialog
        open={cancelOpen}
        title={t('train.cancelTitle')}
        description={t('train.cancelDescription')}
        confirmLabel={t('train.cancelWorkout')}
        danger
        onCancel={() => setCancelOpen(false)}
        onConfirm={() => {
          cancelWorkout();
          setCancelOpen(false);
        }}
      />

      <ConfirmDialog
        open={finishOpen}
        title={t('train.finishTitle')}
        description={t('train.finishDescription')}
        confirmLabel={t('train.saveWorkout')}
        onCancel={() => setFinishOpen(false)}
        onConfirm={() => {
          const completed = finishWorkout();
          setFinishOpen(false);
          if (completed) setSummarySessionId(completed.id);
        }}
      />
    </div>
  );
}

function CompletedSummary({ sessionId, onNavigate }: { sessionId: string; onNavigate: (page: AppPage, id?: string) => void }) {
  const { sessions, settings } = useGymStore();
  const { t } = useLanguage();
  const session = sessions.find((item) => item.id === sessionId);

  if (!session) {
    return <EmptyState title={t('train.savedTitle')} description={t('train.savedDescription')} actionLabel={t('train.viewHistory')} onAction={() => onNavigate('history')} />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow={t('train.completeEyebrow')} title={t('train.completeTitle')} description={t('train.completeDescription')} />
      <WorkoutSummary session={session} unit={settings.weightUnit} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Button onClick={() => onNavigate('dashboard')}>{t('train.backDashboard')}</Button>
        <Button variant="secondary" onClick={() => onNavigate('history')}>{t('train.viewHistory')}</Button>
      </div>
      <Card className="flex items-start gap-3 border-accent/20 bg-accent/5">
        <AlertTriangle className="mt-1 text-accent" size={18} />
        <p className="text-sm leading-6 text-muted">{t('train.cleanNote')}</p>
      </Card>
    </div>
  );
}
