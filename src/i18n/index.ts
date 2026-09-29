import { en, type Messages } from './messages/en.ts';
import { ptBR } from './messages/pt-BR.ts';
import type { Locale } from './routes.ts';

const messages: Record<Locale, Messages> = {
  en,
  'pt-BR': ptBR,
};

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}

export function numberLocale(locale: Locale): string {
  return locale === 'pt-BR' ? 'pt-BR' : 'en-US';
}

export * from './routes.ts';
