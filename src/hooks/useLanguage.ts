import { useCallback } from 'react';
import { languageDirection, localizeMuscleGroup, translate, type Language } from '../i18n';
import { useGymStore } from './useGymStore';

export function useLanguage() {
  const { settings, updateSettings } = useGymStore();
  const language = settings.language;
  const dir = languageDirection(language);

  const t = useCallback((key: string, vars?: Record<string, string | number>) => translate(language, key, vars), [language]);
  const muscle = useCallback((group: string) => localizeMuscleGroup(language, group), [language]);
  const setLanguage = useCallback((next: Language) => updateSettings({ language: next }), [updateSettings]);
  const toggleLanguage = useCallback(() => updateSettings({ language: language === 'en' ? 'ar' : 'en' }), [language, updateSettings]);

  return { language, dir, t, muscle, setLanguage, toggleLanguage };
}
