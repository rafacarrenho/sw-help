import {
  getTickBreakpoint,
  requiredAdditionalSpeed,
  DEFAULT_SPEED_TICK_TOWER_PERCENT,
} from './speed-tick.ts';
import {
  applicableLeaderPercent,
  getSiegeSpeedLeader,
} from './speed-tuning.ts';
import type { CounterStatName, Monster } from './types.ts';

export const counterStatNames = [
  'hp',
  'attack',
  'defense',
  'critRate',
  'critDamage',
  'resistance',
  'accuracy',
] as const satisfies readonly CounterStatName[];

const finalPercentageStats = new Set<CounterStatName>([
  'critRate',
  'critDamage',
  'resistance',
  'accuracy',
]);

const decimal = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
});

export function formatCounterStat(
  value: number | undefined,
  stat: CounterStatName,
): string {
  if (value === undefined) return '—';

  if (finalPercentageStats.has(stat)) {
    return `${decimal.format(value)}%`;
  }

  if (value >= 1000) {
    return `+${decimal.format(value / 1000)}k`;
  }

  return `+${decimal.format(value)}`;
}

export function formatCounterSpeed(value: number | null): string {
  return value === null ? '—' : `+${decimal.format(value)}`;
}

export function requiredCounterSpeed({
  monster,
  leader,
  tick,
  runeSets,
}: {
  monster: Pick<Monster, 'element' | 'speed'>;
  leader: Pick<Monster, 'leaderSkill'>;
  tick: number;
  runeSets: string;
}): number | null {
  const breakpoint = getTickBreakpoint(tick);
  if (!breakpoint || !monster.speed) return null;

  const speedLeader = getSiegeSpeedLeader(leader);
  const leaderPercent = applicableLeaderPercent(speedLeader, monster.element);
  const usesSwift = runeSets
    .split('/')
    .some((set) => set.trim().toLowerCase() === 'swift');

  return requiredAdditionalSpeed({
    baseSpeed: monster.speed,
    leaderPercent,
    activeAdditionalPercent: DEFAULT_SPEED_TICK_TOWER_PERCENT,
    minimumSpeed: breakpoint.minimumSpeed,
    usesSwift,
  });
}
