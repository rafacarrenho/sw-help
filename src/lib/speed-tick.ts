import { leaderText } from './monster-catalog.ts';
import type { Element, Monster } from './types.ts';

export interface SpeedTickBreakpoint {
  tick: number;
  minimumSpeed: number;
}

export interface SpeedLeaderOption {
  label: string;
  value: number;
}

export const SWIFT_SPEED_PERCENT = 25;
export const DEFAULT_SPEED_TICK_TOWER_PERCENT = 15;
export const DEFAULT_SPEED_TICK_LEADER_VALUE = 'all';
export const SPEED_TICK_TEAM_SLOT_COUNT = 4;

export type SpeedTickMode = 'individual' | 'siege' | 'arena';
export type SpeedTickTeamMode = Exclude<SpeedTickMode, 'individual'>;

const SPEED_TICK_TEAM_SLOT_COUNTS: Record<SpeedTickTeamMode, number> = {
  siege: 3,
  arena: 4,
};

const SPEED_TICK_LEADER_AREAS: Record<SpeedTickTeamMode, readonly string[]> = {
  siege: ['General', 'Guild', 'Element'],
  arena: ['General', 'Arena', 'Element'],
};

const speedTickTeamQueryKeys = [
  'view',
  'teamLeader',
  ...Array.from({ length: SPEED_TICK_TEAM_SLOT_COUNT }, (_, index) => [
    `m${index + 1}`,
    `swift${index + 1}`,
  ]).flat(),
];

export interface SpeedTickQueryState {
  monsterId: string | null;
  towerPercent: number;
  leaderValue: string;
  usesSwift: boolean;
}

export interface SpeedTickTeamLeader {
  amount: number;
  area: string;
  element: Element | null;
}

export interface SpeedTickTeamQueryMonster {
  element: Element;
  leader: SpeedTickTeamLeader | null;
}

export interface SpeedTickTeamQueryState {
  mode: SpeedTickTeamMode;
  monsterIds: Array<string | null>;
  towerPercent: number;
  leaderMonsterId: string | null;
  usesSwift: boolean[];
}

export function getSpeedTickTeamLeader(
  monster: Pick<Monster, 'leaderSkill'>,
): SpeedTickTeamLeader | null {
  const leader = monster.leaderSkill;
  if (
    !leader ||
    leader.attribute !== 'Attack Speed' ||
    !['General', 'Guild', 'Arena', 'Element'].includes(leader.area)
  ) {
    return null;
  }

  return {
    amount: leader.amount,
    area: leader.area,
    element: leader.element,
  };
}

export function readSpeedTickMode(params: URLSearchParams): SpeedTickMode {
  const view = params.get('view');
  if (view === 'arena') return 'arena';
  if (view === 'siege' || view === 'team') return 'siege';
  return 'individual';
}

export function speedTickTeamSlotCount(mode: SpeedTickTeamMode): number {
  return SPEED_TICK_TEAM_SLOT_COUNTS[mode];
}

export function isSpeedTickTeamLeaderValid(
  leader: SpeedTickTeamLeader | null,
  mode: SpeedTickTeamMode,
): leader is SpeedTickTeamLeader {
  return Boolean(leader && SPEED_TICK_LEADER_AREAS[mode].includes(leader.area));
}

export function speedTickTeamLeaderPercent(
  leader: SpeedTickTeamLeader | null,
  targetElement: Element,
  mode: SpeedTickTeamMode,
): number {
  if (!isSpeedTickTeamLeaderValid(leader, mode)) return 0;
  if (leader.area !== 'Element') return leader.amount;
  return leader.element === targetElement ? leader.amount : 0;
}

const validTeamLeaderIds = (
  monsterIds: Array<string | null>,
  monsters: ReadonlyMap<string, SpeedTickTeamQueryMonster>,
  mode: SpeedTickTeamMode,
) =>
  monsterIds.filter((monsterId): monsterId is string =>
    Boolean(
      monsterId &&
      isSpeedTickTeamLeaderValid(monsters.get(monsterId)?.leader ?? null, mode),
    ),
  );

export function reconcileSpeedTickTeamLeader(
  leaderMonsterId: string | null,
  monsterIds: Array<string | null>,
  monsters: ReadonlyMap<string, SpeedTickTeamQueryMonster>,
  mode: SpeedTickTeamMode,
): string | null {
  const candidates = validTeamLeaderIds(monsterIds, monsters, mode);
  if (leaderMonsterId && candidates.includes(leaderMonsterId)) {
    return leaderMonsterId;
  }
  return candidates.length === 1 ? (candidates[0] ?? null) : null;
}

export function readSpeedTickTeamQueryState(
  params: URLSearchParams,
  monsters: ReadonlyMap<string, SpeedTickTeamQueryMonster>,
  requestedMode?: SpeedTickTeamMode,
): SpeedTickTeamQueryState {
  const parsedMode = readSpeedTickMode(params);
  const mode =
    requestedMode ?? (parsedMode === 'individual' ? 'siege' : parsedMode);
  const seenIds = new Set<string>();
  const monsterIds = Array.from(
    { length: speedTickTeamSlotCount(mode) },
    (_, index) => {
      const monsterId = params.get(`m${index + 1}`);
      if (!monsterId || !monsters.has(monsterId) || seenIds.has(monsterId)) {
        return null;
      }
      seenIds.add(monsterId);
      return monsterId;
    },
  );
  const parsedTower = Number(params.get('tower'));
  const towerPercent =
    params.has('tower') &&
    Number.isInteger(parsedTower) &&
    parsedTower >= 0 &&
    parsedTower <= 15
      ? parsedTower
      : DEFAULT_SPEED_TICK_TOWER_PERCENT;
  const requestedLeader = params.get('teamLeader');
  const candidates = validTeamLeaderIds(monsterIds, monsters, mode);
  const leaderMonsterId =
    requestedLeader === '0'
      ? null
      : requestedLeader && candidates.includes(requestedLeader)
        ? requestedLeader
        : candidates.length === 1
          ? (candidates[0] ?? null)
          : null;

  return {
    mode,
    monsterIds,
    towerPercent,
    leaderMonsterId,
    usesSwift: monsterIds.map(
      (monsterId, index) =>
        Boolean(monsterId) && params.get(`swift${index + 1}`) === '1',
    ),
  };
}

export function writeSpeedTickTeamQueryState(
  params: URLSearchParams,
  state: SpeedTickTeamQueryState,
): URLSearchParams {
  const nextParams = new URLSearchParams(params);
  nextParams.delete('monster');
  nextParams.delete('leader');
  nextParams.delete('swift');
  nextParams.set('view', state.mode);

  for (let index = 0; index < SPEED_TICK_TEAM_SLOT_COUNT; index += 1) {
    const isVisibleSlot = index < speedTickTeamSlotCount(state.mode);
    const monsterId = isVisibleSlot ? (state.monsterIds[index] ?? null) : null;
    const monsterKey = `m${index + 1}`;
    const swiftKey = `swift${index + 1}`;
    if (monsterId) nextParams.set(monsterKey, monsterId);
    else nextParams.delete(monsterKey);
    if (monsterId && state.usesSwift[index]) nextParams.set(swiftKey, '1');
    else nextParams.delete(swiftKey);
  }

  if (state.towerPercent !== DEFAULT_SPEED_TICK_TOWER_PERCENT) {
    nextParams.set('tower', String(state.towerPercent));
  } else {
    nextParams.delete('tower');
  }
  nextParams.set('teamLeader', state.leaderMonsterId ?? '0');

  return nextParams;
}

export function readSpeedTickQueryState(
  params: URLSearchParams,
  {
    monsterIds,
    leaderPercentages,
  }: {
    monsterIds: ReadonlySet<string>;
    leaderPercentages: readonly number[];
  },
): SpeedTickQueryState {
  const monsterParam = params.get('monster');
  const towerParam = params.get('tower');
  const parsedTower = towerParam === null ? NaN : Number(towerParam);
  const leaderParam = params.get('leader');
  const parsedLeader = leaderParam === null ? NaN : Number(leaderParam);

  return {
    monsterId:
      monsterParam && monsterIds.has(monsterParam) ? monsterParam : null,
    towerPercent:
      Number.isInteger(parsedTower) && parsedTower >= 0 && parsedTower <= 15
        ? parsedTower
        : DEFAULT_SPEED_TICK_TOWER_PERCENT,
    leaderValue:
      leaderParam !== null &&
      Number.isFinite(parsedLeader) &&
      leaderPercentages.includes(parsedLeader)
        ? String(parsedLeader)
        : DEFAULT_SPEED_TICK_LEADER_VALUE,
    usesSwift: params.get('swift') === '1',
  };
}

export function writeSpeedTickQueryState(
  params: URLSearchParams,
  state: SpeedTickQueryState,
): URLSearchParams {
  const nextParams = new URLSearchParams(params);

  for (const key of speedTickTeamQueryKeys) nextParams.delete(key);

  if (state.monsterId) nextParams.set('monster', state.monsterId);
  else nextParams.delete('monster');

  if (state.towerPercent !== DEFAULT_SPEED_TICK_TOWER_PERCENT) {
    nextParams.set('tower', String(state.towerPercent));
  } else {
    nextParams.delete('tower');
  }

  if (state.leaderValue !== DEFAULT_SPEED_TICK_LEADER_VALUE) {
    nextParams.set('leader', state.leaderValue);
  } else {
    nextParams.delete('leader');
  }

  if (state.usesSwift) nextParams.set('swift', '1');
  else nextParams.delete('swift');

  return nextParams;
}

export const SPEED_TICK_BREAKPOINTS: SpeedTickBreakpoint[] = [
  { tick: 3, minimumSpeed: 477 },
  { tick: 4, minimumSpeed: 358 },
  { tick: 5, minimumSpeed: 286 },
  { tick: 6, minimumSpeed: 239 },
  { tick: 7, minimumSpeed: 205 },
  { tick: 8, minimumSpeed: 179 },
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
  const combatSpeedWithoutAdditionalRuneSpeed = Math.ceil(
    baseSpeed + towerLeaderBonus - swiftDisplayPenalty,
  );

  return Math.max(0, minimumSpeed - combatSpeedWithoutAdditionalRuneSpeed);
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
