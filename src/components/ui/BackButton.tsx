import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { cn } from '../../utils/cn';

interface BackButtonProps {
  fallback?: string;
  label?: string;
  className?: string;
  compact?: boolean;
}

export function BackButton({ fallback = '/', label, className, compact = false }: BackButtonProps) {
  const navigate = useNavigate();
  const { dir, t } = useLanguage();
  const Icon = dir === 'rtl' ? ArrowRight : ArrowLeft;

  function goBack() {
    const historyIndex = typeof window !== 'undefined' ? window.history.state?.idx : 0;
    if (typeof historyIndex === 'number' && historyIndex > 0) {
      navigate(-1);
      return;
    }
    navigate(fallback, { replace: true });
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className={cn(
        'focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-control border border-white/10 bg-white/[0.035] px-4 text-sm font-medium text-text shadow-glow transition hover:bg-white/[0.07] active:scale-[0.98]',
        compact && 'h-11 w-11 px-0',
        className,
      )}
      aria-label={t('common.back')}
    >
      <Icon size={18} />
      {!compact && <span>{label ?? t('common.back')}</span>}
    </button>
  );
}
