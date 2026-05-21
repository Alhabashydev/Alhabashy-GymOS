import type { ReactNode } from 'react';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  hint?: string;
}

export function StatCard({ label, value, icon, hint }: StatCardProps) {
  return (
    <Card className="min-h-[116px]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
          <p className="font-display text-2xl font-bold text-text">{value}</p>
          {hint && <p className="text-xs text-muted">{hint}</p>}
        </div>
        {icon && <div className="flex h-10 w-10 items-center justify-center rounded-control bg-white/[0.035] text-accent">{icon}</div>}
      </div>
    </Card>
  );
}
