import type { AppPage } from '../types/gym';

export function pageToPath(page: AppPage, id?: string) {
  switch (page) {
    case 'dashboard':
      return '/';
    case 'workouts':
      return '/plan';
    case 'workout-detail':
      return id ? `/plan/day/${id}` : '/plan';
    case 'train':
      return '/train';
    case 'history':
      return '/history';
    case 'weight':
      return '/weight';
    case 'settings':
      return '/settings';
    default:
      return '/';
  }
}

export function pathToPage(pathname: string): AppPage {
  if (pathname === '/') return 'dashboard';
  if (pathname.startsWith('/plan/day/')) return 'workout-detail';
  if (pathname.startsWith('/plan')) return 'workouts';
  if (pathname.startsWith('/train')) return 'train';
  if (pathname.startsWith('/history')) return 'history';
  if (pathname.startsWith('/weight')) return 'weight';
  if (pathname.startsWith('/settings')) return 'settings';
  return 'dashboard';
}

export function fallbackPathFor(pathname: string) {
  if (pathname.startsWith('/plan/day/')) return '/plan';
  return '/';
}
