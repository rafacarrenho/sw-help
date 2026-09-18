import monsterData from './monsters.json';
import defenseData from './defenses.json';
import counterData from './counters.json';
import type { Monster, Defense, Counter } from '../lib/types';
import { validateCatalog } from '../lib/validate';

export const monsters = monsterData as Monster[];
export const defenses = defenseData as Defense[];
export const counters = counterData as Counter[];
validateCatalog(monsters, defenses, counters);

export const monsterById = new Map(
  monsters.map((monster) => [monster.id, monster]),
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
export const elementNames = {
  fire: 'Fogo',
  water: 'Água',
  wind: 'Vento',
  light: 'Luz',
  dark: 'Trevas',
};
