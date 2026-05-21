import { Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BackButton } from '../ui/BackButton';
import { IconButton } from '../ui/IconButton';
import { fallbackPathFor } from '../../utils/routes';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const showBack = location.pathname !== '/';

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-page/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1100px] items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {showBack && <BackButton fallback={fallbackPathFor(location.pathname)} className="shrink-0" />}
          <button type="button" onClick={() => navigate('/')} className="flex min-w-0 items-center gap-3 text-left" aria-label="Go to GymOS home">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control border border-white/10 bg-white/[0.035] font-display text-sm font-bold text-accent shadow-glow">G</span>
            <span className="min-w-0 leading-none">
              <span className="block truncate font-display text-lg font-bold text-text">GymOS</span>
              <span className="hidden truncate text-xs text-muted sm:block">Personal gym system</span>
            </span>
          </button>
        </div>
        <IconButton label="Open settings" onClick={() => navigate('/settings')}>
          <Settings size={18} />
        </IconButton>
      </div>
    </header>
  );
}
