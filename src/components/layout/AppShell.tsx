import { useEffect, type ReactNode } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { language, dir } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [dir, language]);

  return (
    <div dir={dir} className="min-h-screen bg-page text-text">
      <Header />
      <main className="mx-auto w-full max-w-[1100px] px-4 pb-28 pt-6 md:px-6 md:pb-12 md:pt-8">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
