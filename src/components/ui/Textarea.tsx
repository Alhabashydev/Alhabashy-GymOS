import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ label, hint, id, className, ...props }, ref) {
  const textareaId = id || `textarea-${Math.random().toString(36).slice(2)}`;
  return (
    <label className="block space-y-2" htmlFor={textareaId}>
      {label && <span className="block text-xs font-medium text-muted">{label}</span>}
      <textarea
        id={textareaId}
        ref={ref}
        className={cn(
          'focus-ring min-h-24 w-full resize-none rounded-control border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-5 text-text placeholder:text-text/50 transition focus:border-white/20 focus:bg-white/[0.05]',
          className,
        )}
        {...props}
      />
      {hint && <span className="block text-xs text-muted">{hint}</span>}
    </label>
  );
});
