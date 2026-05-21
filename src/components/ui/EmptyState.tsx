import type { ReactNode } from 'react';
import { Card } from './Card';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-start gap-4">
      {icon && <div className="flex h-11 w-11 items-center justify-center rounded-control border border-white/10 bg-white/[0.035] text-accent">{icon}</div>}
      <div className="space-y-1">
        <h3 className="font-display text-lg font-bold text-text">{title}</h3>
        {description && <p className="text-sm leading-6 text-muted">{description}</p>}
      </div>
      {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}
    </Card>
  );
}
