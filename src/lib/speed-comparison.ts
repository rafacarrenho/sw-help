import type { Monster } from './types.ts';
import { combatSpeed } from './speed-tuning.ts';

export const DEFAULT_SPEED_COMPARISON_TOWER_PERCENT = 15;
export const SWIFT_STRUCTURAL_PERCENT = 25;
export const SPEED_COMPARISON_CHILLING_ID = 'chilling-water-958';
export const CHILLING_SPEED_PER_BUFF = 20;
export const DEFAULT_CHILLING_INITIAL_BUFFS = 2;

export interface SpeedComparisonMonster {
  id: string;
  speed: number;
}

export interface SpeedComparisonSideState {
  monsterId: string | null;
  leaderPercent: number;
  towerPercent: number;
  usesSwift: boolean;
  initialBuffs: number;
}

export interface SpeedComparisonState {
  ally: SpeedComparisonSideState;
  enemy: SpeedComparisonSideState;
}

export interface StructuralSpeedInput {
  baseSpeed: number;
  leaderPercent: number;
  towerPercent: number;
  usesSwift: boolean;
  passiveSpeedBonus?: number;
}

export interface StructuralSpeedComparison {
  allySpeed: number;
  enemySpeed: number;
  winner: 'ally' | 'enemy' | 'tie';
  advantage: number;
  strictRuneTolerance: number;
}

type LeaderMonster = Pick<Monster, 'leaderSkill'>;

const managedQueryKeys = [
  'mode',
  'ally',
  'enemy',
  'allyLeader',
  'enemyLeader',
  'allySwift',
  'enemySwift',
  'allyTower',
  'enemyTower',
  'allyStartBuffs',
  'enemyStartBuffs',
] as const;

const validTower = (value: string | null) => {
  if (value === null || value.trim() === '') {
    return DEFAULT_SPEED_COMPARISON_TOWER_PERCENT;
  }
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 15
    ? parsed
    : DEFAULT_SPEED_COMPARISON_TOWER_PERCENT;
};

export function getSpeedComparisonLeaderPercentages(
  monsters: readonly LeaderMonster[],
): number[] {
  const percentages = new Set<number>([0]);

  for (const monster of monsters) {
    const leader = monster.leaderSkill;
    if (!leader || leader.attribute !== 'Attack Speed') {
      continue;
    }
    percentages.add(leader.amount);
  }

  return Array.from(percentages).sort((first, second) => first - second);
}

export function structuralSpeed({
  baseSpeed,
  leaderPercent,
  towerPercent,
  usesSwift,
  passiveSpeedBonus = 0,
}: StructuralSpeedInput): number | null {
  if (!Number.isFinite(baseSpeed) || baseSpeed <= 0) return null;

  const swiftDisplayedSpeed = usesSwift
    ? Math.ceil((baseSpeed * SWIFT_STRUCTURAL_PERCENT) / 100)
    : 0;

  return combatSpeed({
    baseSpeed,
    runeSpeed: swiftDisplayedSpeed,
    towerPercent,
    leaderPercent,
    usesSwift,
    passiveSpeedBonus,
  });
}

export function compareStructuralSpeed(
  ally: StructuralSpeedInput,
  enemy: StructuralSpeedInput,
): StructuralSpeedComparison | null {
  const allySpeed = structuralSpeed(ally);
  const enemySpeed = structuralSpeed(enemy);
  if (allySpeed === null || enemySpeed === null) return null;

  const difference = allySpeed - enemySpeed;
  const advantage = Math.abs(difference);

  return {
    allySpeed,
    enemySpeed,
    winner: difference > 0 ? 'ally' : difference < 0 ? 'enemy' : 'tie',
    advantage,
    strictRuneTolerance: Math.max(0, advantage - 1),
  };
}

const readSide = (
  params: URLSearchParams,
  prefix: 'ally' | 'enemy',
  monsters: ReadonlyMap<string, SpeedComparisonMonster>,
  leaders: readonly LeaderMonster[],
): SpeedComparisonSideState => {
  const monsterId = params.get(prefix);
  const monster = monsterId ? monsters.get(monsterId) : undefined;
  const parsedLeader = Number(params.get(`${prefix}Leader`));
  const validLeaders = monster
    ? getSpeedComparisonLeaderPercentages(leaders)
    : [0];
  const defaultInitialBuffs =
    monster?.id === SPEED_COMPARISON_CHILLING_ID
      ? DEFAULT_CHILLING_INITIAL_BUFFS
      : 0;
  const initialBuffsParam = params.get(`${prefix}StartBuffs`);
  const parsedInitialBuffs =
    initialBuffsParam === null ? NaN : Number(initialBuffsParam);
  const initialBuffs =
    monster?.id === SPEED_COMPARISON_CHILLING_ID &&
    Number.isInteger(parsedInitialBuffs) &&
    parsedInitialBuffs >= 0 &&
    parsedInitialBuffs <= 2
      ? parsedInitialBuffs
      : defaultInitialBuffs;

  return {
    monsterId: monster?.id ?? null,
    leaderPercent:
      Number.isFinite(parsedLeader) && validLeaders.includes(parsedLeader)
        ? parsedLeader
        : 0,
    towerPercent: validTower(params.get(`${prefix}Tower`)),
    usesSwift: monster ? params.get(`${prefix}Swift`) !== '0' : true,
    initialBuffs,
  };
};

export function readSpeedComparisonQueryState(
  params: URLSearchParams,
  monsters: ReadonlyMap<string, SpeedComparisonMonster>,
  leaders: readonly LeaderMonster[],
): SpeedComparisonState {
  return {
    ally: readSide(params, 'ally', monsters, leaders),
    enemy: readSide(params, 'enemy', monsters, leaders),
  };
}

const writeSide = (
  params: URLSearchParams,
  prefix: 'ally' | 'enemy',
  side: SpeedComparisonSideState,
) => {
  if (side.monsterId) {
    params.set(prefix, side.monsterId);
    if (side.leaderPercent > 0) {
      params.set(`${prefix}Leader`, String(side.leaderPercent));
    }
    if (!side.usesSwift) params.set(`${prefix}Swift`, '0');
  }
  if (side.towerPercent !== DEFAULT_SPEED_COMPARISON_TOWER_PERCENT) {
    params.set(`${prefix}Tower`, String(side.towerPercent));
  }
  if (side.monsterId === SPEED_COMPARISON_CHILLING_ID) {
    const normalizedInitialBuffs = Number.isInteger(side.initialBuffs)
      ? Math.min(2, Math.max(0, side.initialBuffs))
      : DEFAULT_CHILLING_INITIAL_BUFFS;
    if (normalizedInitialBuffs !== DEFAULT_CHILLING_INITIAL_BUFFS) {
      params.set(`${prefix}StartBuffs`, String(normalizedInitialBuffs));
    }
  }
};

export function writeSpeedComparisonQueryState(
  params: URLSearchParams,
  state: SpeedComparisonState,
): URLSearchParams {
  const nextParams = new URLSearchParams(params);
  managedQueryKeys.forEach((key) => nextParams.delete(key));

  writeSide(nextParams, 'ally', state.ally);
  writeSide(nextParams, 'enemy', state.enemy);
  return nextParams;
}
