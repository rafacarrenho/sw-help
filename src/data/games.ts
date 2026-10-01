import type { Locale, RouteName } from '../i18n';

export type GameId = 'summoners-war';
export type GameSection =
  | 'home'
  | 'siege'
  | 'monsters'
  | 'speed-tick'
  | 'speed-tuning'
  | 'speed-comparison';

export interface GameNavigationItem {
  route: RouteName;
  section: GameSection;
  icon: string;
  label: Record<Locale, string>;
}

export interface GameDefinition {
  id: GameId;
  name: string;
  shortName: string;
  icon: string;
  homeRoute: RouteName;
  description: Record<Locale, string>;
  navigation: readonly GameNavigationItem[];
}

export const games = [
  {
    id: 'summoners-war',
    name: 'Summoners War',
    shortName: 'SW',
    icon: 'swords',
    homeRoute: 'home',
    description: {
      en: 'Siege counters, monster research, and SPD calculators for Summoners War.',
      'pt-BR':
        'Counters de Siege, catálogo de monstros e calculadoras de SPD para Summoners War.',
    },
    navigation: [
      {
        route: 'home',
        section: 'home',
        icon: 'home',
        label: { en: 'Summoners War', 'pt-BR': 'Summoners War' },
      },
      {
        route: 'siegeCounter',
        section: 'siege',
        icon: 'swords',
        label: { en: 'Siege Counter', 'pt-BR': 'Siege Counter' },
      },
      {
        route: 'monsters',
        section: 'monsters',
        icon: 'book',
        label: { en: 'Monster Catalog', 'pt-BR': 'Catálogo de Monstros' },
      },
      {
        route: 'speedTuning',
        section: 'speed-tuning',
        icon: 'speed',
        label: { en: 'Spd Tuning', 'pt-BR': 'Spd Tuning' },
      },
      {
        route: 'speedComparison',
        section: 'speed-comparison',
        icon: 'speed',
        label: { en: 'SPD Comparison', 'pt-BR': 'Comparador de SPD' },
      },
      {
        route: 'speedTick',
        section: 'speed-tick',
        icon: 'clock',
        label: { en: 'Spd Tick', 'pt-BR': 'Spd Tick' },
      },
    ],
  },
] as const satisfies readonly GameDefinition[];

export const gameById = new Map<GameId, GameDefinition>(
  games.map((game) => [game.id, game]),
);
