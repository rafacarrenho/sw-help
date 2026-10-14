export const runeStatKeys = [
  'hpFlat',
  'hpPercent',
  'attackFlat',
  'attackPercent',
  'defenseFlat',
  'defensePercent',
  'speed',
  'critRate',
  'critDamage',
  'resistance',
  'accuracy',
] as const;

export type RuneStatKey = (typeof runeStatKeys)[number];

export const buildStatKeys = [
  'hp',
  'attack',
  'defense',
  'speed',
  'critRate',
  'critDamage',
  'resistance',
  'accuracy',
] as const;

export type BuildStatKey = (typeof buildStatKeys)[number];

export const optimizerObjectiveKeys = [...buildStatKeys, 'damage'] as const;

export type OptimizerObjectiveKey = (typeof optimizerObjectiveKeys)[number];

export const runeSetNames = [
  'Energy',
  'Guard',
  'Swift',
  'Blade',
  'Rage',
  'Focus',
  'Endure',
  'Fatal',
  'Despair',
  'Vampire',
  'Violent',
  'Nemesis',
  'Will',
  'Shield',
  'Revenge',
  'Destroy',
  'Fight',
  'Determination',
  'Enhance',
  'Accuracy',
  'Tolerance',
  'Seal',
  'Intangible',
] as const;

export type RuneSetName = (typeof runeSetNames)[number];

export interface RuneEffect {
  stat: RuneStatKey;
  value: number;
}

export interface RuneSubstat extends RuneEffect {
  grind: number;
  enchanted: boolean;
}

export interface NormalizedRune {
  id: string;
  slot: 1 | 2 | 3 | 4 | 5 | 6;
  set: RuneSetName;
  grade: number;
  quality: number;
  level: number;
  ancient: boolean;
  locked: boolean;
  location: 'inventory' | 'equipped';
  equippedMonsterId?: string;
  main: RuneEffect & { currentValue: number };
  innate?: RuneEffect;
  substats: RuneSubstat[];
}

export interface PotentialRuneEffect {
  source: 'main' | 'innate' | 'substat';
  stat: RuneStatKey;
  value: number;
  baseValue: number;
  currentGrind: number;
  possibleGrind: number;
  grindable: boolean;
  enchanted: boolean;
}

export interface ImportedMonster {
  id: string;
  com2usId: number;
  level: number;
  stars: number;
  awakened: boolean;
}

export interface ImportedArtifact {
  id: string;
  slot: number;
  level: number;
  grade: number;
  location: 'inventory' | 'equipped';
  equippedMonsterId?: string;
}

export interface AccountSnapshot {
  schemaVersion: 1;
  importedAt: string;
  monsters: ImportedMonster[];
  runes: NormalizedRune[];
  artifacts: ImportedArtifact[];
  warnings: string[];
}

export interface MonsterBaseStats {
  id: string;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  critRate: number;
  critDamage: number;
  resistance: number;
  accuracy: number;
}

export type StatValues = Record<BuildStatKey, number>;

export interface StatRange {
  min?: number;
  max?: number;
}

export interface TickConstraint {
  tick: 3 | 4 | 5 | 6 | 7 | 8;
  speedTowerPercent: number;
  leaderSkillPercent: number;
}

export interface OptimizerQuery {
  monster: MonsterBaseStats;
  objective: OptimizerObjectiveKey;
  projection?: 'current' | 'potential';
  constraints: Partial<Record<BuildStatKey, StatRange>>;
  requiredSets: RuneSetName[];
  inventoryOnly: boolean;
  includeLocked: boolean;
  excludedMonsterIds: string[];
  tick?: TickConstraint;
  limit?: number;
}

export interface RuneBuildResult {
  runeIds: string[];
  sets: RuneSetName[];
  stats: StatValues;
  objectiveValue: number;
}

export interface OptimizerResult {
  builds: RuneBuildResult[];
  combinationsEvaluated: number;
  candidatesBySlot: number[];
  elapsedMs: number;
}

export interface ImportSummary {
  monsters: number;
  runes: number;
  artifacts: number;
  warnings: string[];
}
