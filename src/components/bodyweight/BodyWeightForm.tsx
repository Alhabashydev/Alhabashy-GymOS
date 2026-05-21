import { useEffect, useState } from 'react';
import type { BodyWeightEntry } from '../../types/gym';
import { useLanguage } from '../../hooks/useLanguage';
import { todayInputValue } from '../../utils/dates';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

interface BodyWeightFormProps {
  initial?: Partial<BodyWeightEntry>;
  unit: string;
  onSubmit: (value: Omit<BodyWeightEntry, 'id'>) => void;
  onCancel: () => void;
}

export function BodyWeightForm({ initial, unit, onSubmit, onCancel }: BodyWeightFormProps) {
  const { t } = useLanguage();
  const [date, setDate] = useState(initial?.date?.slice(0, 10) ?? todayInputValue());
  const [weight, setWeight] = useState(String(initial?.weight ?? ''));
  const [note, setNote] = useState(initial?.note ?? '');
  const [error, setError] = useState('');

  useEffect(() => setError(''), [date, weight]);

  function submit() {
    const parsed = Number(weight);
    if (!date) {
      setError(t('weight.requiredDate'));
      return;
    }
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError(t('weight.invalidValue'));
      return;
    }
    onSubmit({ date, weight: parsed, note: note.trim() });
  }

  return (
    <div className="space-y-5">
      <Input label={t('common.date')} type="date" value={date} onChange={(event) => setDate(event.target.value)} />
      <Input label={`${t('weight.title')} (${unit})`} type="number" step="0.1" min={0} value={weight} onChange={(event) => setWeight(event.target.value)} placeholder="82.5" />
      <Textarea label={t('common.note')} value={note} onChange={(event) => setNote(event.target.value)} placeholder={t('common.optionalNote')} />
      {error && <p className="rounded-control border border-danger/25 bg-danger/10 p-3 text-sm text-danger">{error}</p>}
      <div className="sticky bottom-0 -mx-5 -mb-5 flex gap-3 border-t border-white/10 bg-surface p-5">
        <Button variant="secondary" fullWidth onClick={onCancel}>{t('common.cancel')}</Button>
        <Button fullWidth onClick={submit}>{t('weight.save')}</Button>
      </div>
    </div>
  );
}
