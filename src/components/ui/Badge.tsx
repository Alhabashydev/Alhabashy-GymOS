import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  accent?: boolean;
}

export function Badge({ children, accent, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-white/[0.08] px-3 py-1 text-xs font-semibold leading-4 text-muted',
        accent && 'bg-accent/15 text-accent',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
