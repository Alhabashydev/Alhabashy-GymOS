import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Dumbbell, Play, XCircle } from 'lucide-react';
import type { AppPage } from '../types/gym';
import { formatDuration, secondsBetween } from '../utils/dates';
import { getWorkoutSummary } from '../utils/workoutMath';
import { useGymStore } from '../hooks/useGymStore';
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
        <SectionHeader eyebrow="Train" title="Start workout" description="Choose a workout day, then track every set with large controls." />
        {workoutDays.length === 0 ? (
          <EmptyState title="Create your first workout day" description="You need at least one workout day before training." actionLabel="Manage Plan" onAction={() => onNavigate('workouts')} icon={<Dumbbell size={20} />} />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {workoutDays.map((day) => (
              <Card key={day.id} interactive className="space-y-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-text">{day.name}</h2>
                  <p className="mt-2 text-sm text-muted">{day.exercises.length} exercises</p>
                </div>
                <Button fullWidth disabled={day.exercises.length === 0} onClick={() => chooseWorkout(day.id)} leftIcon={<Play size={16} />}>Start Workout</Button>
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
        eyebrow="Active workout"
        title={activeSession.workoutDayName}
        description={`${summary?.completedSets ?? 0}/${summary?.totalSets ?? 0} sets done • ${formatDuration(elapsed)}`}
      />

      <div className="sticky top-[80px] z-20 rounded-card border border-white/10 bg-page/85 p-3 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm text-muted">Progress</p>
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
                <Badge>{exercise.muscleGroup}</Badge>
                <Badge>{restSeconds}s rest</Badge>
              </div>
              <div className="rounded-card border border-white/10 bg-black/20 p-4">
                <Textarea
                  label="Exercise notes"
                  value={exercise.notes}
                  onChange={(event) => updateSessionExerciseNotes(exercise.id, event.target.value, false)}
                  placeholder="Write notes for this workout."
                  className="min-h-24"
                />
                <Button
                  className="mt-3"
                  variant="secondary"
                  size="sm"
                  onClick={() => updateSessionExerciseNotes(exercise.id, exercise.notes, true)}
                >
                  Update plan note too
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
          <Button onClick={() => setFinishOpen(true)} leftIcon={<CheckCircle2 size={16} />}>Finish Workout</Button>
          <Button variant="danger" onClick={() => setCancelOpen(true)} leftIcon={<XCircle size={16} />}>Cancel Workout</Button>
        </div>
      </Card>

      <RestTimer active={timer.active} seconds={timer.seconds} onClose={() => setTimer({ active: false, seconds: 0 })} />

      <ConfirmDialog
        open={cancelOpen}
        title="Cancel active workout?"
        description="This will delete the unfinished active workout. Your completed workout history will not be affected."
        confirmLabel="Cancel workout"
        danger
        onCancel={() => setCancelOpen(false)}
        onConfirm={() => {
          cancelWorkout();
          setCancelOpen(false);
        }}
      />

      <ConfirmDialog
        open={finishOpen}
        title="Finish workout?"
        description="This saves the workout to history with your sets, reps, weights, and notes."
        confirmLabel="Save Workout"
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
  const session = sessions.find((item) => item.id === sessionId);

  if (!session) {
    return <EmptyState title="Workout saved" description="Your workout was saved to history." actionLabel="View History" onAction={() => onNavigate('history')} />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Saved" title="Workout complete" description="Your session is saved in workout history." />
      <WorkoutSummary session={session} unit={settings.weightUnit} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Button onClick={() => onNavigate('dashboard')}>Back to Dashboard</Button>
        <Button variant="secondary" onClick={() => onNavigate('history')}>View History</Button>
      </div>
      <Card className="flex items-start gap-3 border-accent/20 bg-accent/5">
        <AlertTriangle className="mt-1 text-accent" size={18} />
        <p className="text-sm leading-6 text-muted">No PRs, scores, or smart suggestions are shown. GymOS only saves the workout data you entered.</p>
      </Card>
    </div>
  );
}
