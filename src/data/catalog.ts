import monsterData from './monsters.json' with { type: 'json' };
import defenseData from './defenses.json' with { type: 'json' };
import counterData from './counters.json' with { type: 'json' };
import counterCopyEn from './locales/en/counters.json' with { type: 'json' };
import counterCopyPt from './locales/pt-BR/counters.json' with { type: 'json' };
import counterCopyEs from './locales/es/counters.json' with { type: 'json' };
import counterCopyFr from './locales/fr/counters.json' with { type: 'json' };
import counterCopyDe from './locales/de/counters.json' with { type: 'json' };
import type {
  Monster,
  Defense,
  Counter,
  CounterCopy,
  CounterDefinition,
} from '../lib/types.ts';
import {
  validateCatalog,
  validateCounterDefinitions,
} from '../lib/validate.ts';
import {
  localizeCounters,
  resolveCounterDefinitions,
  validateCounterCopyCoverage,
} from '../lib/counter-config.ts';
import { elementLabels, isFinalMonster } from '../lib/monster-catalog.ts';
import type { Locale } from '../i18n/index.ts';

export const allMonsters = monsterData as Monster[];
export const monsters = allMonsters.filter(isFinalMonster);
export const defenses = defenseData as Defense[];
const counterDefinitions = counterData as CounterDefinition[];
const counterBases = resolveCounterDefinitions(counterDefinitions);
const counterCopy: Record<Locale, Record<string, CounterCopy>> = {
  en: counterCopyEn,
  'pt-BR': counterCopyPt,
  es: counterCopyEs,
  fr: counterCopyFr,
  de: counterCopyDe,
};

export function countersFor(locale: Locale): Counter[] {
  return localizeCounters(counterBases, counterCopy[locale]);
}

validateCounterCopyCoverage(counterDefinitions, counterCopy, 'en');
validateCounterDefinitions(allMonsters, defenses, counterDefinitions);
export const counters = countersFor('pt-BR');
validateCatalog(allMonsters, defenses, counters);

export const monsterById = new Map(
  allMonsters.map((monster) => [monster.id, monster]),
);
export const getCounters = (id: string) =>
  counters.filter((counter) => counter.defenseId === id);
export const getCountersFor = (id: string, locale: Locale) =>
  countersFor(locale).filter((counter) => counter.defenseId === id);
export const teamName = (team: string[]) =>
  team.map((id) => monsterById.get(id)!.name).join(' · ');
export const searchText = (defense: Defense) =>
  defense.team
    .map((id) => {
      const monster = monsterById.get(id)!;
      return [monster.name, ...monster.aliases].join(' ');
    })
    .join(' ');
export const elementNames = elementLabels;
