import monsterData from './monsters.json' with { type: 'json' };
import defenseData from './defenses.json' with { type: 'json' };
import counterData from './counters.json' with { type: 'json' };
import defenseCopyEn from './locales/en/defenses.json' with { type: 'json' };
import defenseCopyPt from './locales/pt-BR/defenses.json' with { type: 'json' };
import counterCopyEn from './locales/en/counters.json' with { type: 'json' };
import counterCopyPt from './locales/pt-BR/counters.json' with { type: 'json' };
import type {
  Monster,
  Defense,
  DefenseBase,
  DefenseCopy,
  Counter,
  CounterBase,
} from '../lib/types.ts';
import { validateCatalog } from '../lib/validate.ts';
import { elementLabels, isFinalMonster } from '../lib/monster-catalog.ts';
import type { Locale } from '../i18n/index.ts';

export const allMonsters = monsterData as Monster[];
export const monsters = allMonsters.filter(isFinalMonster);
const defenseBases = defenseData as DefenseBase[];
const counterBases = counterData as CounterBase[];
const defenseCopy: Record<Locale, Record<string, DefenseCopy>> = {
  en: defenseCopyEn,
  'pt-BR': defenseCopyPt,
};
const counterCopy: Record<Locale, Record<string, string>> = {
  en: counterCopyEn,
  'pt-BR': counterCopyPt,
};

function assertLocalizedCoverage() {
  for (const locale of ['en', 'pt-BR'] as const) {
    const defenseIds = new Set(defenseBases.map(({ id }) => id));
    const counterIds = new Set(counterBases.map(({ id }) => id));
    const localizedDefenseIds = Object.keys(defenseCopy[locale]);
    const localizedCounterIds = Object.keys(counterCopy[locale]);
    if (
      localizedDefenseIds.length !== defenseIds.size ||
      localizedDefenseIds.some((id) => !defenseIds.has(id))
    ) {
      throw new Error(`Invalid localized defenses for ${locale}.`);
    }
    if (
      localizedCounterIds.length !== counterIds.size ||
      localizedCounterIds.some((id) => !counterIds.has(id))
    ) {
      throw new Error(`Invalid localized counters for ${locale}.`);
    }
  }
}

export function defensesFor(locale: Locale): Defense[] {
  return defenseBases.map((defense) => ({
    ...defense,
    ...defenseCopy[locale][defense.id],
  }));
}

export function countersFor(locale: Locale): Counter[] {
  return counterBases.map((counter) => ({
    ...counter,
    instruction: counterCopy[locale][counter.id],
  }));
}

assertLocalizedCoverage();
export const defenses = defensesFor('pt-BR');
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
