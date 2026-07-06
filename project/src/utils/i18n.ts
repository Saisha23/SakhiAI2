import type { Language } from '../types';
import { translations } from '../data/translations';
import { resolveLanguage } from '../data/languages';

type TranslatedLang = 'en' | 'hi' | 'ta' | 'bn';

export function getT(language: Language): Record<string, unknown> {
  const lang = resolveLanguage(language) as TranslatedLang;
  return translations[lang] || translations.en;
}

export function tStr(t: Record<string, unknown>, key: string, fallback = ''): string {
  const val = t[key];
  return typeof val === 'string' ? val : fallback;
}
