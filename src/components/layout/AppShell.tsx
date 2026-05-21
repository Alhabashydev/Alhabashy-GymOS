import type { ReactNode } from 'react';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-page text-text">
      <Header />
      <main className="mx-auto w-full max-w-[1100px] px-4 pb-28 pt-6 md:px-6 md:pb-12 md:pt-8">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
