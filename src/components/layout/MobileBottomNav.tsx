import type { LucideIcon } from 'lucide-react';
import { Dumbbell, History, Home, LineChart, ListChecks } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
}

const items: NavItem[] = [
  { to: '/', label: 'Home', icon: Home, isActive: (path) => path === '/' },
  { to: '/plan', label: 'Plan', icon: ListChecks, isActive: (path) => path.startsWith('/plan') },
  { to: '/train', label: 'Train', icon: Dumbbell, isActive: (path) => path.startsWith('/train') },
  { to: '/history', label: 'History', icon: History, isActive: (path) => path.startsWith('/history') },
  { to: '/weight', label: 'Weight', icon: LineChart, isActive: (path) => path.startsWith('/weight') },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-page/85 backdrop-blur-xl md:hidden" aria-label="Main navigation">
      <div className="grid grid-cols-5 px-1 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.isActive(location.pathname);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'focus-ring flex min-h-14 flex-col items-center justify-center gap-1 rounded-control text-[11px] font-medium transition',
                active ? 'text-accent' : 'text-muted hover:text-text',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
