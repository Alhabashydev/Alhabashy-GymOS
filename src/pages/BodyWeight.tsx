import { useState } from 'react';
import { Plus, Scale } from 'lucide-react';
import type { BodyWeightEntry } from '../types/gym';
import { useGymStore } from '../hooks/useGymStore';
import { useLanguage } from '../hooks/useLanguage';
import { BodyWeightChart } from '../components/bodyweight/BodyWeightChart';
import { BodyWeightEntryCard } from '../components/bodyweight/BodyWeightEntryCard';
import { BodyWeightForm } from '../components/bodyweight/BodyWeightForm';
import { BottomSheet } from '../components/ui/BottomSheet';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatCard } from '../components/ui/StatCard';

export function BodyWeight() {
  const { bodyWeight, settings, addBodyWeight, updateBodyWeight, deleteBodyWeight } = useGymStore();
  const { t } = useLanguage();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const editing = bodyWeight.find((entry) => entry.id === editingId);
  const latest = bodyWeight[0];

  function openCreate() {
    setEditingId(null);
    setSheetOpen(true);
  }

  function openEdit(id: string) {
    setEditingId(id);
    setSheetOpen(true);
  }

  function submit(value: Omit<BodyWeightEntry, 'id'>) {
    if (editingId) updateBodyWeight(editingId, value);
    else addBodyWeight(value);
    setSheetOpen(false);
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow={t('weight.eyebrow')}
        title={t('weight.title')}
        description={t('weight.description')}
        action={<Button onClick={openCreate} leftIcon={<Plus size={16} />}>{t('weight.addEntry')}</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label={t('weight.latest')} value={latest ? `${latest.weight} ${settings.weightUnit}` : '—'} icon={<Scale size={19} />} />
        <StatCard label={t('weight.entries')} value={bodyWeight.length} />
        <StatCard label={t('weight.unit')} value={settings.weightUnit.toUpperCase()} />
      </div>

      <BodyWeightChart entries={bodyWeight} unit={settings.weightUnit} />

      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-text">{t('weight.recentEntries')}</h2>
        {bodyWeight.length === 0 ? (
          <EmptyState title={t('weight.emptyTitle')} description={t('weight.emptyDescription')} actionLabel={t('weight.addEntry')} onAction={openCreate} icon={<Scale size={20} />} />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {bodyWeight.map((entry) => (
              <BodyWeightEntryCard
                key={entry.id}
                entry={entry}
                unit={settings.weightUnit}
                onEdit={() => openEdit(entry.id)}
                onDelete={() => setDeleteId(entry.id)}
              />
            ))}
          </div>
        )}
      </div>

      <BottomSheet open={sheetOpen} title={editing ? t('weight.editSheet') : t('weight.addSheet')} onClose={() => setSheetOpen(false)}>
        <BodyWeightForm initial={editing} unit={settings.weightUnit} onSubmit={submit} onCancel={() => setSheetOpen(false)} />
      </BottomSheet>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title={t('weight.deleteTitle')}
        description={t('weight.deleteDescription')}
        confirmLabel={t('common.delete')}
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteBodyWeight(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
