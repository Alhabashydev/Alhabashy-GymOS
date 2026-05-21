import { useLanguage } from '../../hooks/useLanguage';
import { Button } from './Button';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  danger,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useLanguage();
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <div className="space-y-5">
        <p className="text-sm leading-6 text-muted">{description}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel}>{cancelLabel ?? t('common.cancel')}</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel ?? t('common.confirm')}</Button>
        </div>
      </div>
    </Modal>
  );
}
