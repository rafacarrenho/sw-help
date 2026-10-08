export type Element = 'fire' | 'water' | 'wind' | 'light' | 'dark' | 'pure';
export type Tower = '4star' | 'open';
export interface Monster {
  id: string;
  name: string;
  element: Element;
  naturalStars: number;
  aliases: string[];
  image?: string;
  source?: string;
  imageSource?: string;
  swarfarmId?: number;
  com2usId?: number;
  familyId?: number;
  family?: string;
  archetype?: string;
  awakenLevel?: number;
  obtainable?: boolean;
  speed?: number;
  maxLevelStats?: {
    hp: number;
    attack: number;
    defense: number;
    critRate: number;
    critDamage: number;
    resistance: number;
    accuracy: number;
  };
  skillIds?: number[];
  skillUpsToMax?: number;
  sources?: MonsterSource[];
  awakensFrom?: string | null;
  awakensTo?: string | null;
  leaderSkill?: {
    attribute: string;
    amount: number;
    area: string;
    element: Element | null;
  } | null;
}
export interface MonsterSource {
  id: number;
  name: string;
  description: string;
  farmable: boolean;
}
export interface MonsterSkill {
  id: number;
  name: string;
  description: string;
  slot: number;
  cooltime: number | null;
  hits: number;
  passive: boolean;
  aoe: boolean;
  random: boolean;
  maxLevel: number;
  levelProgress: string[];
  effects: {
    name: string;
    description: string;
    isBuff: boolean;
    type: string;
    chance: number;
    quantity: number;
    note: string;
  }[];
  multiplierFormula: string;
  scalesWith: string[];
  source: string;
}
export interface Defense {
  id: string;
  team: string[];
  tower: Tower;
  status: 'example' | 'documented';
}
export interface CounterStats {
  hp?: number;
  attack?: number;
  defense?: number;
  critRate?: number;
  critDamage?: number;
  resistance?: number;
  accuracy?: number;
}
export type CounterStatName = keyof CounterStats;
export interface CounterRune {
  monsterId: string;
  sets: string;
  stats?: CounterStats;
  preferredStats?: CounterStatName[];
}
export type CounterStatsOverride = Partial<
  Record<CounterStatName, number | null>
>;
export interface CounterRuneOverride {
  monsterId: string;
  sets?: string;
  stats?: CounterStatsOverride;
  preferredStats?: CounterStatName[];
}
export interface CounterConfiguration {
  team: string[];
  turnOrder: string[];
  runes: CounterRune[];
  tick: number;
  sources: { title: string; url: string }[];
}
export interface CounterMatchupOverrides {
  turnOrder?: string[];
  runes?: CounterRuneOverride[];
  tick?: number;
  sources?: { title: string; url: string }[];
}
export interface CounterMatchup {
  defenseId: string;
  killOrder?: string[];
  overrides?: CounterMatchupOverrides;
}
export interface CounterDefinition extends CounterConfiguration {
  id: string;
  matchups: CounterMatchup[];
}
export interface CounterBase extends CounterConfiguration {
  id: string;
  counterId: string;
  defenseId: string;
  killOrder?: string[];
}
export interface CounterCopy {
  instruction: string;
  matchups?: Record<string, string>;
}
export type Counter = CounterBase & { instruction: string };
