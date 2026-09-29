import type { Monster } from './types.ts';
import { matchesSearch } from './search.ts';
import { getMessages, routePath, type Locale } from '../i18n/index.ts';

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
export function elementLabelsFor(locale: Locale): Record<string, string> {
  const { common } = getMessages(locale);
  return {
    fire: common.fire,
    water: common.water,
    wind: common.wind,
    light: common.light,
    dark: common.dark,
    pure: common.pure,
  };
}
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
export function attributeLabelsFor(locale: Locale): Record<string, string> {
  const { common } = getMessages(locale);
  return {
    'Attack Power': locale === 'pt-BR' ? 'ATQ' : 'ATK',
    Defense: 'DEF',
    HP: 'HP',
    'Attack Speed': 'SPD',
    'Critical Rate': common.criticalRate,
    'Critical DMG': common.criticalDamage,
    Resistance: common.resistance,
    Accuracy: common.accuracy,
  };
}
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
export function areaLabelsFor(locale: Locale): Record<string, string> {
  const { taxonomy } = getMessages(locale);
  return {
    General: taxonomy.allContent,
    Arena: taxonomy.arena,
    Dungeon: taxonomy.dungeons,
    Guild: taxonomy.guildContent,
    'Guild Battle': taxonomy.guildContent,
    Element: taxonomy.byElement,
  };
}
export const leaderScopeOptions = [
  { value: 'global', label: 'Global', areas: ['General'] },
  { value: 'arena', label: 'Arena', areas: ['Arena'] },
  { value: 'dungeon', label: 'Masmorras', areas: ['Dungeon'] },
  { value: 'guild', label: 'Guild', areas: ['Guild', 'Guild Battle'] },
  { value: 'element', label: 'Por elemento', areas: ['Element'] },
  {
    value: 'global-arena',
    label: 'Global + Arena',
    areas: ['General', 'Arena'],
  },
  {
    value: 'global-guild',
    label: 'Global + Guild',
    areas: ['General', 'Guild', 'Guild Battle'],
  },
] as const;
export function leaderScopeOptionsFor(locale: Locale) {
  const { taxonomy } = getMessages(locale);
  return [
    { value: 'global', label: taxonomy.global, areas: ['General'] },
    { value: 'arena', label: taxonomy.arena, areas: ['Arena'] },
    { value: 'dungeon', label: taxonomy.dungeons, areas: ['Dungeon'] },
    {
      value: 'guild',
      label: taxonomy.guild,
      areas: ['Guild', 'Guild Battle'],
    },
    { value: 'element', label: taxonomy.byElement, areas: ['Element'] },
    {
      value: 'global-arena',
      label: taxonomy.globalArena,
      areas: ['General', 'Arena'],
    },
    {
      value: 'global-guild',
      label: taxonomy.globalGuild,
      areas: ['General', 'Guild', 'Guild Battle'],
    },
  ] as const;
}
const leaderAreasByScope: ReadonlyMap<string, readonly string[]> = new Map(
  leaderScopeOptions.map(({ value, areas }) => [value, areas] as const),
);
function leaderArea(skill: Monster['leaderSkill']): string | null {
  if (!skill) return null;
  return skill.element ? 'Element' : skill.area;
}
export const archetypeLabels: Record<string, string> = {
  Attack: 'Ataque',
  Defense: 'Defesa',
  HP: 'HP',
  Support: 'Suporte',
  Material: 'Material',
  none: 'Não informado',
};
export function archetypeLabelsFor(locale: Locale): Record<string, string> {
  const { common } = getMessages(locale);
  return {
    Attack: common.attack,
    Defense: common.defense,
    HP: 'HP',
    Support: common.support,
    Material: common.material,
    none: common.notInformed,
  };
}
export function isFinalMonster(
  monster: Pick<Monster, 'obtainable' | 'awakensTo'>,
): boolean {
  return monster.obtainable === true && !monster.awakensTo;
}
export function formLabel(
  monster: Pick<Monster, 'awakenLevel'>,
  locale: Locale = 'pt-BR',
): string {
  return monster.awakenLevel === 2
    ? getMessages(locale).monster.secondAwakening
    : '';
}
export function leaderBonusText(
  skill: Monster['leaderSkill'],
  locale: Locale = 'pt-BR',
): string {
  if (!skill) return getMessages(locale).monster.noLeaderSkill;
  const labels = attributeLabelsFor(locale);
  return `${labels[skill.attribute] ?? skill.attribute} +${skill.amount}%`;
}
export function leaderScopeText(
  skill: Monster['leaderSkill'],
  locale: Locale = 'pt-BR',
): string | null {
  if (!skill) return null;
  const labels = elementLabelsFor(locale);
  return skill.element
    ? locale === 'pt-BR'
      ? `${getMessages(locale).taxonomy.elementAllies} ${labels[skill.element]}`
      : `${labels[skill.element]} ${getMessages(locale).taxonomy.elementAllies}`
    : (areaLabelsFor(locale)[skill.area] ?? skill.area);
}
export function leaderText(
  skill: Monster['leaderSkill'],
  locale: Locale = 'pt-BR',
): string {
  const scope = leaderScopeText(skill, locale);
  return scope
    ? `${leaderBonusText(skill, locale)} · ${scope}`
    : leaderBonusText(skill, locale);
}
export function monsterSearchText(
  monster: Monster,
  locale: Locale = 'pt-BR',
): string {
  return [
    monster.name,
    monster.family,
    ...monster.aliases,
    elementLabelsFor(locale)[monster.element],
  ]
    .filter(Boolean)
    .join(' ');
}
export interface MonsterFilters {
  q: string;
  element: string;
  stars: string;
  leader: string;
  leaderScope: string;
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
    leaderScope: allowed(
      'leaderScope',
      leaderScopeOptions.map(({ value }) => value),
    ),
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
  locale: Locale = 'pt-BR',
): T[] {
  const leaderAreas = leaderAreasByScope.get(filters.leaderScope);
  return monsters
    .filter(
      (monster) =>
        isFinalMonster(monster) &&
        matchesSearch(monsterSearchText(monster, locale), filters.q) &&
        (!filters.element || monster.element === filters.element) &&
        (!filters.stars || String(monster.naturalStars) === filters.stars) &&
        (!filters.leader ||
          (filters.leader === 'any'
            ? !!monster.leaderSkill
            : filters.leader === 'none'
              ? !monster.leaderSkill
              : monster.leaderSkill?.attribute === filters.leader)) &&
        (!leaderAreas ||
          (!!monster.leaderSkill &&
            leaderAreas.includes(leaderArea(monster.leaderSkill) ?? ''))) &&
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
export const catalogPageUrl = (page: number, locale: Locale = 'pt-BR') =>
  page <= 1
    ? routePath('monsters', locale)
    : routePath('monsterPage', locale, { page });
