import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
}

export function Card({ children, className, interactive, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'glass-card p-5 text-text',
        interactive && 'transition hover:border-white/15 hover:bg-white/[0.06]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
