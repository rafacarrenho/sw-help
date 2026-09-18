import monsterData from './monsters.json' with { type: 'json' };
import defenseData from './defenses.json' with { type: 'json' };
import counterData from './counters.json' with { type: 'json' };
import type { Monster, Defense, Counter } from '../lib/types.ts';
import { validateCatalog } from '../lib/validate.ts';
import { elementLabels, isFinalMonster } from '../lib/monster-catalog.ts';

export const allMonsters = monsterData as Monster[];
export const monsters = allMonsters.filter(isFinalMonster);
export const defenses = defenseData as Defense[];
export const counters = counterData as Counter[];
validateCatalog(allMonsters, defenses, counters);

export const monsterById = new Map(
  allMonsters.map((monster) => [monster.id, monster]),
);
export const getCounters = (id: string) =>
  counters.filter((counter) => counter.defenseId === id);
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
