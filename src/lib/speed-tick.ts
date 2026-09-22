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
}: {
  baseSpeed: number;
  leaderPercent: number;
  activeAdditionalPercent: number;
  targetTick: number;
}): number {
  const target = getTickBreakpoint(targetTick);
  if (!target) {
    throw new Error(`Tick ${targetTick} não existe no breakpoint padrão.`);
  }

  const baseMultiplier = 1 + leaderPercent / 100;
  const currentMultiplier = 1 + activeAdditionalPercent / 100;
  const requiredPercent =
    Math.max(
      0,
      target.minimumSpeed / (baseSpeed * baseMultiplier * currentMultiplier) -
        1,
    ) * 100;

  return requiredPercent;
}

export function requiredAdditionalSpeed({
  baseSpeed,
  leaderPercent,
  activeAdditionalPercent,
  minimumSpeed,
}: {
  baseSpeed: number;
  leaderPercent: number;
  activeAdditionalPercent: number;
  minimumSpeed: number;
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

  const leaderFactor = 1 + Math.max(0, leaderPercent) / 100;
  const additionalFactor = 1 + Math.max(0, activeAdditionalPercent) / 100;
  const currentSpeed = baseSpeed * leaderFactor * additionalFactor;
  const difference = Math.max(0, minimumSpeed - currentSpeed);
  const rounded = Math.round(difference);

  return Math.abs(difference - rounded) < 1e-9
    ? rounded
    : Math.ceil(difference);
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
