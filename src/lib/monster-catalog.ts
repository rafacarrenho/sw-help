import type { Monster } from './types.ts';
import { matchesSearch } from './search.ts';

export const PAGE_SIZE = 48;
export interface MonsterSummary extends Pick<
  Monster,
  | 'id'
  | 'name'
  | 'element'
  | 'naturalStars'
  | 'aliases'
  | 'image'
  | 'family'
  | 'awakenLevel'
  | 'speed'
  | 'leaderSkill'
  | 'obtainable'
  | 'awakensTo'
> {
  sortStats?: Pick<
    NonNullable<Monster['maxLevelStats']>,
    'hp' | 'attack' | 'defense'
  >;
}
export function toMonsterSummary(monster: Monster): MonsterSummary {
  const {
    id,
    name,
    element,
    naturalStars,
    aliases,
    image,
    family,
    awakenLevel,
    speed,
    leaderSkill,
    obtainable,
    awakensTo,
    maxLevelStats,
  } = monster;
  return {
    id,
    name,
    element,
    naturalStars,
    aliases,
    image,
    family,
    awakenLevel,
    speed,
    leaderSkill,
    obtainable,
    awakensTo,
    sortStats: maxLevelStats
      ? {
          hp: maxLevelStats.hp,
          attack: maxLevelStats.attack,
          defense: maxLevelStats.defense,
        }
      : undefined,
  };
}
export const elementLabels: Record<string, string> = {
  fire: 'Fogo',
  water: 'Água',
  wind: 'Vento',
  light: 'Luz',
  dark: 'Trevas',
  pure: 'Puro',
};
export const catalogElementOptions = Object.entries(elementLabels).filter(
  ([element]) => element !== 'pure',
);
export const attributeLabels: Record<string, string> = {
  'Attack Power': 'ATQ',
  Defense: 'DEF',
  HP: 'HP',
  'Attack Speed': 'SPD',
  'Critical Rate': 'Taxa crítica',
  'Critical DMG': 'Dano crítico',
  Resistance: 'Resistência',
  Accuracy: 'Precisão',
};
const leaderSkillIcons: Record<string, string> = {
  Accuracy: '/leader-skills/accuracy.png',
  'Attack Power': '/leader-skills/attack-power.png',
  'Attack Speed': '/leader-skills/attack-speed.png',
  'Critical DMG': '/leader-skills/critical-damage.png',
  'Critical Rate': '/leader-skills/critical-rate.png',
  Defense: '/leader-skills/defense.png',
  HP: '/leader-skills/hp.png',
  Resistance: '/leader-skills/resistance.png',
};
export function leaderSkillIcon(skill: Monster['leaderSkill']): string | null {
  return skill ? (leaderSkillIcons[skill.attribute] ?? null) : null;
}
export const areaLabels: Record<string, string> = {
  General: 'Todos os conteúdos',
  Arena: 'Arena',
  Dungeon: 'Masmorras',
  Guild: 'Conteúdo de guilda',
  'Guild Battle': 'Conteúdo de guilda',
  Element: 'Por elemento',
};
export const archetypeLabels: Record<string, string> = {
  Attack: 'Ataque',
  Defense: 'Defesa',
  HP: 'HP',
  Support: 'Suporte',
  Material: 'Material',
  none: 'Não informado',
};
export function isFinalMonster(
  monster: Pick<Monster, 'obtainable' | 'awakensTo'>,
): boolean {
  return monster.obtainable === true && !monster.awakensTo;
}
export function formLabel(monster: Pick<Monster, 'awakenLevel'>): string {
  return monster.awakenLevel === 2 ? 'Segundo despertar' : '';
}
export function leaderText(skill: Monster['leaderSkill']): string {
  if (!skill) return 'Sem habilidade de líder';
  const area = skill.element
    ? `Aliados de ${elementLabels[skill.element]}`
    : (areaLabels[skill.area] ?? skill.area);
  return `${attributeLabels[skill.attribute] ?? skill.attribute} +${skill.amount}% · ${area}`;
}
export function monsterSearchText(monster: Monster): string {
  return [
    monster.name,
    monster.family,
    ...monster.aliases,
    elementLabels[monster.element],
  ]
    .filter(Boolean)
    .join(' ');
}
export interface MonsterFilters {
  q: string;
  element: string;
  stars: string;
  leader: string;
  sort: string;
  availability: string;
}
type SortStat = keyof NonNullable<MonsterSummary['sortStats']>;
const sortStatByFilter: Partial<Record<string, SortStat>> = {
  hp: 'hp',
  attack: 'attack',
  defense: 'defense',
};
export function readMonsterFilters(params: URLSearchParams): MonsterFilters {
  const allowed = (key: string, values: string[], fallback = '') =>
    values.includes(params.get(key) ?? '') ? params.get(key)! : fallback;
  const rawAvailability = allowed(
    'availability',
    ['all', 'obtainable'],
    'obtainable',
  );
  const hasLegacyFormOverride =
    params.get('form') !== null && rawAvailability === 'all';
  const availability = hasLegacyFormOverride ? 'obtainable' : rawAvailability;
  return {
    q: (params.get('q') ?? '').slice(0, 200),
    element: allowed(
      'element',
      catalogElementOptions.map(([element]) => element),
    ),
    stars: allowed('stars', ['1', '2', '3', '4', '5']),
    leader: allowed('leader', ['any', 'none', ...Object.keys(attributeLabels)]),
    sort: allowed(
      'sort',
      ['name', 'stars', 'speed', 'hp', 'attack', 'defense'],
      'name',
    ),
    availability,
  };
}
export function filterMonsters<T extends MonsterSummary>(
  monsters: T[],
  filters: MonsterFilters,
): T[] {
  return monsters
    .filter(
      (monster) =>
        isFinalMonster(monster) &&
        matchesSearch(monsterSearchText(monster), filters.q) &&
        (!filters.element || monster.element === filters.element) &&
        (!filters.stars || String(monster.naturalStars) === filters.stars) &&
        (!filters.leader ||
          (filters.leader === 'any'
            ? !!monster.leaderSkill
            : filters.leader === 'none'
              ? !monster.leaderSkill
              : monster.leaderSkill?.attribute === filters.leader)) &&
        (filters.availability === 'all' || monster.obtainable === true),
    )
    .sort((a, b) => {
      const stat = sortStatByFilter[filters.sort];
      const primary = stat
        ? (b.sortStats?.[stat] ?? 0) - (a.sortStats?.[stat] ?? 0)
        : filters.sort === 'speed'
          ? (b.speed ?? 0) - (a.speed ?? 0)
          : filters.sort === 'stars'
            ? b.naturalStars - a.naturalStars
            : 0;
      return (
        primary ||
        a.name.localeCompare(b.name, 'en') ||
        a.element.localeCompare(b.element) ||
        (b.awakenLevel ?? 0) - (a.awakenLevel ?? 0) ||
        a.id.localeCompare(b.id)
      );
    });
}
export const catalogPageUrl = (page: number) =>
  page <= 1 ? '/monstros/' : `/monstros/pagina/${page}/`;
