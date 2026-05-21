import { Edit3, Trash2 } from 'lucide-react';
import type { BodyWeightEntry } from '../../types/gym';
import { formatDate } from '../../utils/dates';
import { Card } from '../ui/Card';
import { IconButton } from '../ui/IconButton';

interface BodyWeightEntryCardProps {
  entry: BodyWeightEntry;
  unit: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function BodyWeightEntryCard({ entry, unit, onEdit, onDelete }: BodyWeightEntryCardProps) {
  return (
    <Card className="flex items-start justify-between gap-4">
      <div>
        <p className="font-display text-xl font-bold text-text">{entry.weight} {unit}</p>
        <p className="mt-1 text-sm text-muted">{formatDate(entry.date)}</p>
        {entry.note && <p className="mt-3 text-sm leading-6 text-text/85">{entry.note}</p>}
      </div>
      <div className="flex gap-2">
        <IconButton label="Edit body weight" onClick={onEdit}><Edit3 size={17} /></IconButton>
        <IconButton label="Delete body weight" danger onClick={onDelete}><Trash2 size={17} /></IconButton>
      </div>
    </Card>
  );
}
