import { CountryOption, LanguageOption } from '../types';

export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: 'id', name: 'Indonesia (Google.co.id)', hl: 'id' },
  { code: 'us', name: 'United States (Google.com)', hl: 'en' },
  { code: 'gb', name: 'United Kingdom (Google.co.uk)', hl: 'en' },
  { code: 'sg', name: 'Singapore (Google.com.sg)', hl: 'en' },
  { code: 'my', name: 'Malaysia (Google.com.my)', hl: 'ms' },
  { code: 'au', name: 'Australia (Google.com.au)', hl: 'en' },
  { code: 'ca', name: 'Canada (Google.ca)', hl: 'en' },
  { code: 'de', name: 'Germany (Google.de)', hl: 'de' },
  { code: 'fr', name: 'France (Google.fr)', hl: 'fr' },
  { code: 'jp', name: 'Japan (Google.co.jp)', hl: 'ja' },
  { code: 'in', name: 'India (Google.co.in)', hl: 'en' },
  { code: 'br', name: 'Brazil (Google.com.br)', hl: 'pt' },
  { code: 'nl', name: 'Netherlands (Google.nl)', hl: 'nl' },
  { code: 'ph', name: 'Philippines (Google.com.ph)', hl: 'en' },
  { code: 'ae', name: 'United Arab Emirates (Google.ae)', hl: 'ar' },
];

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'id', name: 'Bahasa Indonesia (Indonesian)' },
  { code: 'en', name: 'English (Inggris)' },
  { code: 'ms', name: 'Bahasa Melayu (Malay)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'ja', name: '日本語 (Japanese)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'ar', name: 'العربية (Arabic)' },
];

export function getCountryName(code: string): string {
  const match = COUNTRY_OPTIONS.find((c) => c.code.toLowerCase() === code.toLowerCase());
  return match ? match.name : code.toUpperCase();
}

export function getLanguageName(code: string): string {
  const match = LANGUAGE_OPTIONS.find((l) => l.code.toLowerCase() === code.toLowerCase());
  return match ? match.name : code.toUpperCase();
}
