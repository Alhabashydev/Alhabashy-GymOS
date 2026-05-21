import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  label: string;
  children: ReactNode;
  danger?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, children, danger, className, type = 'button', ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      whileTap={{ scale: 0.96 }}
      className={cn(
        'focus-ring inline-flex h-11 min-h-11 w-11 min-w-11 items-center justify-center rounded-control border border-white/10 bg-white/[0.035] text-text shadow-glow transition hover:bg-white/[0.08] disabled:opacity-50',
        danger && 'border-danger/25 bg-danger/10 text-danger hover:bg-danger/20',
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
});
