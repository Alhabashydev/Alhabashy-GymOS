import { Languages, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { fallbackPathFor } from '../../utils/routes';
import { BackButton } from '../ui/BackButton';
import { IconButton } from '../ui/IconButton';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, t, toggleLanguage } = useLanguage();
  const showBack = location.pathname !== '/';
  const nextLanguageLabel = language === 'en' ? 'AR' : 'EN';

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-page/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1100px] items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {showBack && <BackButton fallback={fallbackPathFor(location.pathname)} className="shrink-0" />}
          <button type="button" onClick={() => navigate('/')} className="flex min-w-0 items-center gap-3 text-left rtl:text-right" aria-label={t('common.goHome')}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control border border-white/10 bg-white/[0.035] font-display text-sm font-bold text-accent shadow-glow">G</span>
            <span className="min-w-0 leading-none">
              <span className="block truncate font-display text-lg font-bold text-text">GymOS</span>
              <span className="hidden truncate text-xs text-muted sm:block">{t('header.subtitle')}</span>
            </span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-control border border-white/10 bg-white/[0.035] px-3 text-xs font-semibold text-text shadow-glow transition hover:bg-white/[0.08] active:scale-[0.98]"
            aria-label={t('common.changeLanguage')}
            title={t('common.changeLanguage')}
          >
            <Languages size={16} />
            <span>{nextLanguageLabel}</span>
          </button>
          <IconButton label={t('common.openSettings')} onClick={() => navigate('/settings')}>
            <Settings size={18} />
          </IconButton>
        </div>
      </div>
    </header>
  );
}
