import { en, type Messages } from './messages/en.ts';
import { ptBR } from './messages/pt-BR.ts';
import { es } from './messages/es.ts';
import { fr } from './messages/fr.ts';
import { de } from './messages/de.ts';
import type { Locale } from './routes.ts';

const messages: Record<Locale, Messages> = {
  en,
  'pt-BR': ptBR,
  es,
  fr,
  de,
};

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}

export function numberLocale(locale: Locale): string {
  const numberLocales: Record<Locale, string> = {
    en: 'en-US',
    'pt-BR': 'pt-BR',
    es: 'es',
    fr: 'fr-FR',
    de: 'de-DE',
  };
  return numberLocales[locale];
}

export * from './routes.ts';
