import { useMemo, useState } from 'react';
import { History as HistoryIcon, Search } from 'lucide-react';
import { useGymStore } from '../hooks/useGymStore';
import type { WorkoutSession } from '../types/gym';
import { BottomSheet } from '../components/ui/BottomSheet';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Select } from '../components/ui/Select';
import { SessionCard } from '../components/history/SessionCard';
import { SessionDetail } from '../components/history/SessionDetail';

export function History() {
  const { sessions, workoutDays, settings, deleteSession } = useGymStore();
  const [query, setQuery] = useState('');
  const [filterDay, setFilterDay] = useState('all');
  const [selected, setSelected] = useState<WorkoutSession | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => sessions.filter((session) => {
    const matchesDay = filterDay === 'all' || session.workoutDayId === filterDay;
    const text = `${session.workoutDayName} ${session.exercises.map((exercise) => exercise.name).join(' ')}`.toLowerCase();
    return matchesDay && text.includes(query.toLowerCase().trim());
  }), [filterDay, query, sessions]);

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="History" title="Workout history" description="Review completed sessions with sets, reps, weights, and notes." />

      <div className="grid gap-4 md:grid-cols-[1fr_260px]">
        <Input label="Search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by exercise name" />
        <Select label="Filter by day" value={filterDay} onChange={(event) => setFilterDay(event.target.value)}>
          <option value="all">All workout days</option>
          {workoutDays.map((day) => <option key={day.id} value={day.id}>{day.name}</option>)}
        </Select>
      </div>

      {sessions.length === 0 ? (
        <EmptyState title="Finish a workout to see it here" description="Completed workout sessions will appear in this list." icon={<HistoryIcon size={20} />} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No matching sessions" description="Try another exercise name or workout day filter." icon={<Search size={20} />} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {filtered.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              unit={settings.weightUnit}
              onOpen={() => setSelected(session)}
              onDelete={() => setDeleteId(session.id)}
            />
          ))}
        </div>
      )}

      <BottomSheet open={Boolean(selected)} title="Session detail" onClose={() => setSelected(null)}>
        {selected && <SessionDetail session={selected} unit={settings.weightUnit} />}
      </BottomSheet>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete workout session?"
        description="This permanently removes this completed workout from your local history."
        confirmLabel="Delete"
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteSession(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
