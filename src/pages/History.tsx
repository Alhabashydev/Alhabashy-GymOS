import { useMemo, useState } from 'react';
import { History as HistoryIcon, Search } from 'lucide-react';
import { useGymStore } from '../hooks/useGymStore';
import { useLanguage } from '../hooks/useLanguage';
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
  const { t } = useLanguage();
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
      <SectionHeader eyebrow={t('history.eyebrow')} title={t('history.title')} description={t('history.description')} />

      <div className="grid gap-4 md:grid-cols-[1fr_260px]">
        <Input label={t('history.search')} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('history.searchPlaceholder')} />
        <Select label={t('history.filterByDay')} value={filterDay} onChange={(event) => setFilterDay(event.target.value)}>
          <option value="all">{t('history.allDays')}</option>
          {workoutDays.map((day) => <option key={day.id} value={day.id}>{day.name}</option>)}
        </Select>
      </div>

      {sessions.length === 0 ? (
        <EmptyState title={t('history.emptyTitle')} description={t('history.emptyDescription')} icon={<HistoryIcon size={20} />} />
      ) : filtered.length === 0 ? (
        <EmptyState title={t('history.noMatchTitle')} description={t('history.noMatchDescription')} icon={<Search size={20} />} />
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

      <BottomSheet open={Boolean(selected)} title={t('history.sessionDetail')} onClose={() => setSelected(null)}>
        {selected && <SessionDetail session={selected} unit={settings.weightUnit} />}
      </BottomSheet>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title={t('history.deleteTitle')}
        description={t('history.deleteDescription')}
        confirmLabel={t('common.delete')}
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
