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
  label: string;
  description: string;
  status: 'example' | 'documented';
}
export interface Counter {
  id: string;
  defenseId: string;
  team: string[];
  title: string;
  strategy: string;
  steps: string[];
  turnOrder: string[];
  runes: { monsterId: string; sets: string }[];
  speed: string;
  caution: string;
  status: 'example' | 'documented';
  sources: { title: string; url: string }[];
}
