import { Dumbbell, History, LineChart, ListChecks, Play, Scale } from 'lucide-react';
import type { AppPage } from '../types/gym';
import { formatDateTime } from '../utils/dates';
import { getWorkoutSummary } from '../utils/workoutMath';
import { ActiveWorkoutCard } from '../components/workout/ActiveWorkoutCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatCard } from '../components/ui/StatCard';
import { useGymStore } from '../hooks/useGymStore';
import { useLanguage } from '../hooks/useLanguage';

interface DashboardProps {
  onNavigate: (page: AppPage, id?: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { workoutDays, sessions, activeSession, bodyWeight } = useGymStore();
  const { language, t } = useLanguage();
  const totalExercises = workoutDays.reduce((sum, day) => sum + day.exercises.length, 0);
  const latestWeight = bodyWeight[0];
  const lastSession = sessions[0];
  const nextWorkout = workoutDays[0];

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow={t('dashboard.eyebrow')}
        title={t('dashboard.title')}
        description={t('dashboard.description')}
      />

      {activeSession && <ActiveWorkoutCard session={activeSession} onContinue={() => onNavigate('train')} />}

      {!activeSession && nextWorkout && (
        <Card className="space-y-5 border-accent/20 bg-accent/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-accent">{t('dashboard.currentWorkout')}</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-text">{nextWorkout.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{t('dashboard.exercisesReady', { count: nextWorkout.exercises.length })}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-control bg-accent/15 text-accent">
              <Dumbbell size={22} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={() => onNavigate('train')} leftIcon={<Play size={16} />}>{t('dashboard.startWorkout')}</Button>
            <Button variant="secondary" onClick={() => onNavigate('workouts')}>{t('dashboard.managePlan')}</Button>
          </div>
        </Card>
      )}

      {workoutDays.length === 0 && (
        <EmptyState title={t('dashboard.createFirstDayTitle')} description={t('dashboard.createFirstDayDescription')} actionLabel={t('dashboard.addWorkoutDay')} onAction={() => onNavigate('workouts')} icon={<ListChecks size={20} />} />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t('dashboard.totalWorkouts')} value={sessions.length} icon={<History size={19} />} />
        <StatCard label={t('dashboard.currentWeight')} value={latestWeight ? `${latestWeight.weight}` : '—'} hint={latestWeight ? formatDateTime(latestWeight.date, language) : t('dashboard.addWeightHint')} icon={<Scale size={19} />} />
        <StatCard label={t('dashboard.lastWorkout')} value={lastSession ? lastSession.workoutDayName.split('—')[0].trim() : '—'} hint={lastSession ? formatDateTime(lastSession.finishedAt, language) : t('dashboard.finishWorkoutHint')} icon={<Dumbbell size={19} />} />
        <StatCard label={t('dashboard.exercises')} value={totalExercises} icon={<ListChecks size={19} />} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-text">{t('dashboard.recentWorkout')}</h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('history')}>{t('dashboard.viewAll')}</Button>
          </div>
          {lastSession ? (
            <div className="rounded-control border border-white/10 bg-white/[0.03] p-4">
              <p className="font-medium text-text">{lastSession.workoutDayName}</p>
              <p className="mt-1 text-sm text-muted">{formatDateTime(lastSession.finishedAt, language)}</p>
              <p className="mt-3 text-sm text-muted">{getWorkoutSummary(lastSession).completedSets} {t('common.sets')} {t('common.done').toLowerCase()}</p>
            </div>
          ) : <p className="text-sm leading-6 text-muted">{t('dashboard.noRecentWorkout')}</p>}
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-text">{t('dashboard.bodyWeight')}</h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('weight')} leftIcon={<LineChart size={15} />}>{t('dashboard.open')}</Button>
          </div>
          {latestWeight ? (
            <div className="rounded-control border border-white/10 bg-white/[0.03] p-4">
              <p className="font-display text-2xl font-bold text-text">{latestWeight.weight}</p>
              <p className="mt-1 text-sm text-muted">{t('dashboard.latestEntry')} • {formatDateTime(latestWeight.date, language)}</p>
              {latestWeight.note && <p className="mt-3 text-sm leading-6 text-text/85">{latestWeight.note}</p>}
            </div>
          ) : <p className="text-sm leading-6 text-muted">{t('dashboard.addWeightHint')}</p>}
        </Card>
      </div>
    </div>
  );
}
