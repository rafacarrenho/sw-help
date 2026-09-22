import { leaderText } from './monster-catalog.ts';
import type { Monster } from './types.ts';

export interface SpeedTickBreakpoint {
  tick: number;
  minimumSpeed: number;
}

export interface SpeedLeaderOption {
  label: string;
  value: number;
}

export const SWIFT_SPEED_PERCENT = 25;

export const SPEED_TICK_BREAKPOINTS: SpeedTickBreakpoint[] = [
  { tick: 3, minimumSpeed: 477 },
  { tick: 4, minimumSpeed: 358 },
  { tick: 5, minimumSpeed: 286 },
  { tick: 6, minimumSpeed: 239 },
  { tick: 7, minimumSpeed: 205 },
  { tick: 8, minimumSpeed: 179 },
  { tick: 9, minimumSpeed: 159 },
  { tick: 10, minimumSpeed: 143 },
  { tick: 11, minimumSpeed: 130 },
];

export const additionalSpeedPercentOptions = [
  5, 10, 15, 20, 25, 30, 50, 100,
] as const;

export function getTickBreakpoint(
  tick: number,
): SpeedTickBreakpoint | undefined {
  return SPEED_TICK_BREAKPOINTS.find((entry) => entry.tick === tick);
}

export function requiredAdditionalSpeedPercent({
  baseSpeed,
  leaderPercent,
  activeAdditionalPercent,
  targetTick,
  usesSwift = false,
}: {
  baseSpeed: number;
  leaderPercent: number;
  activeAdditionalPercent: number;
  targetTick: number;
  usesSwift?: boolean;
}): number {
  const target = getTickBreakpoint(targetTick);
  if (!target) {
    throw new Error(`Tick ${targetTick} não existe no breakpoint padrão.`);
  }

  const currentMultiplier =
    1 +
    (Math.max(0, leaderPercent) +
      Math.max(0, activeAdditionalPercent) +
      (usesSwift ? SWIFT_SPEED_PERCENT : 0)) /
      100;
  const requiredPercent =
    Math.max(0, target.minimumSpeed / baseSpeed - currentMultiplier) * 100;

  return requiredPercent;
}

export function requiredAdditionalSpeed({
  baseSpeed,
  leaderPercent,
  activeAdditionalPercent,
  minimumSpeed,
  usesSwift = false,
}: {
  baseSpeed: number;
  leaderPercent: number;
  activeAdditionalPercent: number;
  minimumSpeed: number;
  usesSwift?: boolean;
}): number | null {
  if (
    !Number.isFinite(baseSpeed) ||
    baseSpeed <= 0 ||
    !Number.isFinite(leaderPercent) ||
    !Number.isFinite(activeAdditionalPercent) ||
    !Number.isFinite(minimumSpeed) ||
    minimumSpeed <= 0
  ) {
    return null;
  }

  const towerLeaderBonus =
    (baseSpeed *
      (Math.max(0, leaderPercent) + Math.max(0, activeAdditionalPercent))) /
    100;
  const exactSwiftBonus = (baseSpeed * SWIFT_SPEED_PERCENT) / 100;
  const swiftDisplayPenalty = usesSwift
    ? Math.ceil(exactSwiftBonus) - exactSwiftBonus
    : 0;
  const combatSpeedWithoutGreenBonus = Math.ceil(
    baseSpeed + towerLeaderBonus - swiftDisplayPenalty,
  );

  return Math.max(0, minimumSpeed - combatSpeedWithoutGreenBonus);
}

export function getLeaderOptions(
  monster: Pick<Monster, 'leaderSkill'>,
): Array<{ label: string; value: number }> {
  const options = [{ label: 'Sem líder', value: 0 }];
  const skill = monster.leaderSkill;

  if (!skill || skill.attribute !== 'Attack Speed') {
    return options;
  }

  return [
    ...options,
    {
      label: leaderText(skill),
      value: skill.amount,
    },
  ];
}

export function getPossibleSpeedLeaders(
  monsters: Monster[],
): SpeedLeaderOption[] {
  const percentages = new Set<number>([0]);

  for (const monster of monsters) {
    const skill = monster.leaderSkill;
    if (!skill || skill.attribute !== 'Attack Speed') continue;
    percentages.add(skill.amount);
  }

  return Array.from(percentages)
    .sort((a, b) => a - b)
    .map((value) => ({ label: `${value}%`, value }));
}
