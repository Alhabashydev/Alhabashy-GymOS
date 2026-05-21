import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, hint, id, className, ...props }, ref) {
  const inputId = id || `input-${Math.random().toString(36).slice(2)}`;
  return (
    <label className="block space-y-2" htmlFor={inputId}>
      {label && <span className="block text-xs font-medium text-muted">{label}</span>}
      <input
        id={inputId}
        ref={ref}
        className={cn(
          'focus-ring min-h-[46px] w-full rounded-control border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-text placeholder:text-text/50 transition focus:border-white/20 focus:bg-white/[0.05]',
          className,
        )}
        {...props}
      />
      {hint && <span className="block text-xs text-muted">{hint}</span>}
    </label>
  );
});
