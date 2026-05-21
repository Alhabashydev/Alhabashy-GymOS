import type { Language } from '../i18n';
import { translate } from '../i18n';

export function nowIso(): string {
  return new Date().toISOString();
}

export function todayInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

function localeFor(language: Language = 'en'): string {
  return language === 'ar' ? 'ar' : 'en';
}

export function formatDate(value?: string, language: Language = 'en'): string {
  if (!value) return translate(language, 'common.notSet');
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return translate(language, 'common.invalidDate');
  return new Intl.DateTimeFormat(localeFor(language), {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(value?: string, language: Language = 'en'): string {
  if (!value) return translate(language, 'common.notSet');
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return translate(language, 'common.invalidDate');
  return new Intl.DateTimeFormat(localeFor(language), {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatDuration(seconds: number, language: Language = 'en'): string {
  const safe = Math.max(0, Math.floor(seconds || 0));
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;

  if (language === 'ar') {
    if (hrs > 0) return `${hrs}س ${mins}د`;
    if (mins > 0) return `${mins}د ${secs}ث`;
    return `${secs}ث`;
  }

  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

export function secondsBetween(startIso: string, endIso = new Date().toISOString()): number {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  return Math.max(0, Math.floor((end - start) / 1000));
}
