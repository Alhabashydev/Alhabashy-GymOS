import { useState } from 'react';
import { Plus, Scale } from 'lucide-react';
import type { BodyWeightEntry } from '../types/gym';
import { useGymStore } from '../hooks/useGymStore';
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
        eyebrow="Weight"
        title="Body weight"
        description="Track your body weight with a simple chart and short notes."
        action={<Button onClick={openCreate} leftIcon={<Plus size={16} />}>Add Entry</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Latest" value={latest ? `${latest.weight} ${settings.weightUnit}` : '—'} icon={<Scale size={19} />} />
        <StatCard label="Entries" value={bodyWeight.length} />
        <StatCard label="Unit" value={settings.weightUnit.toUpperCase()} />
      </div>

      <BodyWeightChart entries={bodyWeight} unit={settings.weightUnit} />

      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-text">Recent entries</h2>
        {bodyWeight.length === 0 ? (
          <EmptyState title="Add your first body weight entry" description="Use this page to keep your weight log simple." actionLabel="Add Entry" onAction={openCreate} icon={<Scale size={20} />} />
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

      <BottomSheet open={sheetOpen} title={editing ? 'Edit body weight' : 'Add body weight'} onClose={() => setSheetOpen(false)}>
        <BodyWeightForm initial={editing} unit={settings.weightUnit} onSubmit={submit} onCancel={() => setSheetOpen(false)} />
      </BottomSheet>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete body weight entry?"
        description="This removes this body weight entry from LocalStorage."
        confirmLabel="Delete"
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
