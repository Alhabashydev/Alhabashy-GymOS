import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ label, id, className, children, ...props }, ref) {
  const selectId = id || `select-${Math.random().toString(36).slice(2)}`;
  return (
    <label className="block space-y-2" htmlFor={selectId}>
      {label && <span className="block text-xs font-medium text-muted">{label}</span>}
      <select
        id={selectId}
        ref={ref}
        className={cn(
          'focus-ring min-h-[46px] w-full rounded-control border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-text transition focus:border-white/20 focus:bg-white/[0.05]',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
});
