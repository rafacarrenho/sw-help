import {
  speedTuningSkillOverrides,
  type SpeedTuningTargetScope,
} from '../data/speed-tuning.ts';
import type { Element, Monster, MonsterSkill } from './types.ts';

export type SpeedTuningMode = 'siege' | 'arena' | 'rta';

export const SIEGE_TICK_CONSTANT = 0.0007;
export const ARENA_TICK_CONSTANT = 0.0007;
export const RTA_TICK_CONSTANT = 0.00015;
export const DEFAULT_SPEED_TUNING_TOWER_PERCENT = 15;
export const SPEED_BUFF_PERCENT = 30;

export const SPEED_TUNING_MODE_CONFIG = {
  siege: {
    slotCount: 3,
    tickConstant: SIEGE_TICK_CONSTANT,
    leaderAreas: ['General', 'Guild', 'Element'],
  },
  arena: {
    slotCount: 4,
    tickConstant: ARENA_TICK_CONSTANT,
    leaderAreas: ['General', 'Arena', 'Element'],
  },
  rta: {
    slotCount: 4,
    tickConstant: RTA_TICK_CONSTANT,
    leaderAreas: ['General', 'Arena', 'Element'],
  },
} as const satisfies Record<
  SpeedTuningMode,
  {
    slotCount: 3 | 4;
    tickConstant: number;
    leaderAreas: readonly string[];
  }
>;

export interface SpeedTuningEffect {
  percent?: number;
  scope: SpeedTuningTargetScope;
  skillId: number;
  skillName: string;
}

export interface SpeedTuningCapabilities {
  atbBoost: SpeedTuningEffect | null;
  speedBuff: SpeedTuningEffect | null;
}

export interface SpeedTuningLeader {
  amount: number;
  area: string;
  element: Element | null;
}

export interface CombatSpeedInput {
  baseSpeed: number;
  runeSpeed: number;
  towerPercent: number;
  leaderPercent: number;
  usesSwift: boolean;
  passiveSpeedBonus?: number;
}

export interface FollowerTuningInput {
  anchorCombatSpeed: number;
  iteration: number;
  accumulatedAtbBoost: number;
  speedBuffStartIteration: number | null;
  artifactSpeedIncrease: number;
  /** Team-wide amplification, such as Miriam's passive. Adds to artifact %. */
  teamSpeedBuffIncrease?: number;
  baseSpeed: number;
  towerPercent: number;
  leaderPercent: number;
  usesSwift: boolean;
  passiveSpeedBonus?: number;
  tickConstant?: number;
}

export interface FollowerTuningResult {
  runeSpeed: number;
  combatSpeed: number;
  minimumCombatSpeed: number;
}

export interface SpeedTuningQueryMonster {
  defaultBoostPercent: number | null;
  defaultInitialBuffs: number | null;
  hasSpeedBuff: boolean;
  hasTargetEffect: boolean;
  leaderAmount: number | null;
  leaderArea?: string | null;
}

export interface SpeedTuningQuerySlotState {
  monsterId: string | null;
  runeSpeed: number;
  usesSwift: boolean;
  boostPercent: number;
  speedBuffEnabled: boolean;
  targetIndex: number;
  artifactPercent: number;
  initialBuffs: number;
}

export interface SpeedTuningQueryState {
  mode: SpeedTuningMode;
  towerPercent: number;
  activeLeaderIndex: number | null;
  slots: SpeedTuningQuerySlotState[];
}

export const SPEED_TUNING_MAX_SLOT_COUNT = 4;
const speedTuningQueryKeys = [
  'mode',
  'tower',
  'leader',
  ...Array.from({ length: SPEED_TUNING_MAX_SLOT_COUNT }, (_, index) => [
    `m${index + 1}`,
    `r${index + 1}`,
    `swift${index + 1}`,
    `boost${index + 1}`,
    `buff${index + 1}`,
    `target${index + 1}`,
    `artifact${index + 1}`,
    `startBuffs${index + 1}`,
  ]).flat(),
];

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

const queryNumber = (
  value: string | null,
  fallback: number,
  minimum: number,
  maximum: number,
) => {
  if (value === null || value.trim() === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? clamp(parsed, minimum, maximum) : fallback;
};

export function speedTuningModeFromValue(
  value: string | null | undefined,
): SpeedTuningMode {
  return value === 'arena' || value === 'rta' ? value : 'siege';
}

export function isSpeedLeaderValidForMode(
  leader: SpeedTuningLeader | null,
  mode: SpeedTuningMode,
): boolean {
  return Boolean(
    leader &&
    (SPEED_TUNING_MODE_CONFIG[mode].leaderAreas as readonly string[]).includes(
      leader.area,
    ),
  );
}

const queryMonsterHasValidLeader = (
  monster: SpeedTuningQueryMonster | undefined,
  mode: SpeedTuningMode,
) =>
  monster?.leaderAmount !== null &&
  monster?.leaderAmount !== undefined &&
  (monster.leaderArea === undefined ||
    monster.leaderArea === null ||
    (SPEED_TUNING_MODE_CONFIG[mode].leaderAreas as readonly string[]).includes(
      monster.leaderArea,
    ));

export function readSpeedTuningQueryState(
  params: URLSearchParams,
  monsters: ReadonlyMap<string, SpeedTuningQueryMonster>,
): SpeedTuningQueryState {
  const mode = speedTuningModeFromValue(params.get('mode'));
  const slotCount = SPEED_TUNING_MODE_CONFIG[mode].slotCount;
  const towerParam = params.get('tower');
  const parsedTower = towerParam === null ? NaN : Number(towerParam);
  const towerPercent =
    Number.isInteger(parsedTower) && parsedTower >= 0 && parsedTower <= 15
      ? parsedTower
      : DEFAULT_SPEED_TUNING_TOWER_PERCENT;

  const slots = Array.from(
    { length: SPEED_TUNING_MAX_SLOT_COUNT },
    (_, slotIndex): SpeedTuningQuerySlotState => {
      const slotNumber = slotIndex + 1;
      const monsterParam = params.get(`m${slotNumber}`);
      const monster =
        slotIndex < slotCount && monsterParam
          ? monsters.get(monsterParam)
          : null;
      const targetFallback = Math.min(slotIndex + 1, slotCount - 1);

      if (!monster || !monsterParam) {
        return {
          monsterId: null,
          runeSpeed: 0,
          usesSwift: false,
          boostPercent: 0,
          speedBuffEnabled: false,
          targetIndex: targetFallback,
          artifactPercent: 0,
          initialBuffs: 0,
        };
      }

      const targetParam = Number(params.get(`target${slotNumber}`));
      const targetIndex =
        Number.isInteger(targetParam) &&
        targetParam > slotNumber &&
        targetParam <= slotCount
          ? targetParam - 1
          : targetFallback;
      const initialBuffsParam = params.get(`startBuffs${slotNumber}`);
      const parsedInitialBuffs =
        initialBuffsParam === null ? NaN : Number(initialBuffsParam);
      const initialBuffs =
        monster.defaultInitialBuffs !== null &&
        Number.isInteger(parsedInitialBuffs) &&
        parsedInitialBuffs >= 0 &&
        parsedInitialBuffs <= 2
          ? parsedInitialBuffs
          : (monster.defaultInitialBuffs ?? 0);

      return {
        monsterId: monsterParam,
        runeSpeed:
          slotIndex === 0 ? queryNumber(params.get('r1'), 0, 0, 999) : 0,
        usesSwift: params.get(`swift${slotNumber}`) === '1',
        boostPercent:
          monster.defaultBoostPercent === null || slotIndex >= slotCount - 1
            ? 0
            : queryNumber(
                params.get(`boost${slotNumber}`),
                monster.defaultBoostPercent,
                0,
                100,
              ),
        speedBuffEnabled:
          monster.hasSpeedBuff &&
          slotIndex < slotCount - 1 &&
          params.get(`buff${slotNumber}`) !== '0',
        targetIndex:
          monster.hasTargetEffect && slotIndex < slotCount - 1
            ? targetIndex
            : targetFallback,
        artifactPercent:
          slotIndex > 0
            ? queryNumber(params.get(`artifact${slotNumber}`), 0, 0, 100)
            : 0,
        initialBuffs,
      };
    },
  );

  const leaderCandidates = slots
    .map((slot, index) => ({
      index,
      amount:
        slot.monsterId === null ||
        !queryMonsterHasValidLeader(monsters.get(slot.monsterId), mode)
          ? null
          : (monsters.get(slot.monsterId)?.leaderAmount ?? null),
    }))
    .filter(
      (candidate): candidate is { index: number; amount: number } =>
        candidate.amount !== null,
    );
  const leaderParam = params.get('leader');
  const requestedLeaderIndex = Number(leaderParam) - 1;
  let activeLeaderIndex: number | null = null;

  if (leaderCandidates.length > 0 && leaderParam !== '0') {
    const requestedLeader = leaderCandidates.find(
      ({ index }) => index === requestedLeaderIndex,
    );
    activeLeaderIndex =
      requestedLeader?.index ??
      leaderCandidates.reduce((best, candidate) =>
        candidate.amount > best.amount ? candidate : best,
      ).index;
  }

  return { mode, towerPercent, activeLeaderIndex, slots };
}

export function writeSpeedTuningQueryState(
  params: URLSearchParams,
  state: SpeedTuningQueryState,
  monsters: ReadonlyMap<string, SpeedTuningQueryMonster>,
): URLSearchParams {
  const nextParams = new URLSearchParams(params);
  speedTuningQueryKeys.forEach((key) => nextParams.delete(key));

  const mode = speedTuningModeFromValue(state.mode);
  const slotCount = SPEED_TUNING_MODE_CONFIG[mode].slotCount;
  if (mode !== 'siege') nextParams.set('mode', mode);

  if (state.towerPercent !== DEFAULT_SPEED_TUNING_TOWER_PERCENT) {
    nextParams.set(
      'tower',
      String(clamp(Math.round(state.towerPercent), 0, 15)),
    );
  }

  state.slots.slice(0, slotCount).forEach((slot, slotIndex) => {
    if (!slot.monsterId) return;
    const monster = monsters.get(slot.monsterId);
    if (!monster) return;
    const slotNumber = slotIndex + 1;
    nextParams.set(`m${slotNumber}`, slot.monsterId);

    if (slotIndex === 0 && slot.runeSpeed > 0) {
      nextParams.set('r1', String(clamp(slot.runeSpeed, 0, 999)));
    }
    if (slot.usesSwift) nextParams.set(`swift${slotNumber}`, '1');

    if (monster.defaultInitialBuffs !== null) {
      const normalizedInitialBuffs = Number.isInteger(slot.initialBuffs)
        ? clamp(slot.initialBuffs, 0, 2)
        : monster.defaultInitialBuffs;
      if (normalizedInitialBuffs !== monster.defaultInitialBuffs) {
        nextParams.set(
          `startBuffs${slotNumber}`,
          String(normalizedInitialBuffs),
        );
      }
    }

    if (
      slotIndex < slotCount - 1 &&
      monster.defaultBoostPercent !== null &&
      slot.boostPercent !== monster.defaultBoostPercent
    ) {
      nextParams.set(
        `boost${slotNumber}`,
        String(clamp(slot.boostPercent, 0, 100)),
      );
    }
    if (
      slotIndex < slotCount - 1 &&
      monster.hasSpeedBuff &&
      !slot.speedBuffEnabled
    ) {
      nextParams.set(`buff${slotNumber}`, '0');
    }

    const targetFallback = Math.min(slotIndex + 1, slotCount - 1);
    if (
      slotIndex < slotCount - 1 &&
      monster.hasTargetEffect &&
      slot.targetIndex !== targetFallback &&
      slot.targetIndex > slotIndex &&
      slot.targetIndex < slotCount
    ) {
      nextParams.set(`target${slotNumber}`, String(slot.targetIndex + 1));
    }

    if (slotIndex > 0 && slot.artifactPercent > 0) {
      nextParams.set(
        `artifact${slotNumber}`,
        String(clamp(slot.artifactPercent, 0, 100)),
      );
    }
  });

  const hasLeader = state.slots.some((slot) => {
    if (!slot.monsterId) return false;
    return queryMonsterHasValidLeader(monsters.get(slot.monsterId), mode);
  });
  if (hasLeader) {
    const activeSlot =
      state.activeLeaderIndex === null
        ? null
        : state.slots[state.activeLeaderIndex];
    const activeHasLeader = Boolean(
      activeSlot?.monsterId &&
      queryMonsterHasValidLeader(monsters.get(activeSlot.monsterId), mode),
    );
    nextParams.set(
      'leader',
      activeHasLeader ? String(state.activeLeaderIndex! + 1) : '0',
    );
  }

  return nextParams;
}

const normalizedDescription = (skill: MonsterSkill) =>
  skill.description.toLocaleLowerCase('en-US').replaceAll('’', "'");

function inferAtbScope(skill: MonsterSkill): SpeedTuningTargetScope | null {
  const description = normalizedDescription(skill);
  const describesAllies = [
    /attack bars? of all (?:other )?allies/,
    /all allies[^.]{0,100}attack bars?/,
    /allies' attack bars?/,
    /attack bars? of the allies/,
    /increases? their attack bars?[^.]{0,30}/,
  ].some((pattern) => pattern.test(description));
  const describesOneAlly = [
    /(?:fills?|increases?|recovers?|balances?|switches?)[^.]{0,55}attack bars? of (?:the )?(?:target )?ally/,
    /(?:fills?|increases?|recovers?)[^.]{0,55}(?:an ally|ally target|target ally)(?:'s)? attack bars?/,
    /(?:the |target )?ally's attack bars? (?:is|will be|by)/,
    /attack bars? of the ally with/,
    /attack bars? of the affected ally/,
    /revived ally's attack bars?/,
  ].some((pattern) => pattern.test(description));

  if (describesOneAlly) return 'single';
  return describesAllies ? 'team' : null;
}

function describesFullAtb(skill: MonsterSkill): boolean {
  const description = normalizedDescription(skill);

  return [
    /fully fills?[^.]{0,60}(?:target )?ally[^.]{0,30}attack bar/,
    /fills? up (?:the )?(?:target )?ally(?: target)?'s attack bar(?: to the max)?/,
    /fills? up an ally's attack bar to the max/,
    /grants? (?:the )?(?:target )?ally (?:an additional turn|a turn instantly)/,
  ].some((pattern) => pattern.test(description));
}

function inferSpeedBuffScope(
  skill: MonsterSkill,
): SpeedTuningTargetScope | null {
  const description = normalizedDescription(skill);
  if (skill.aoe && /\ball (?:other )?allies\b/.test(description)) return 'team';

  const describesAllies = [
    /attack speed of all allies/,
    /all allies[^.]{0,100}attack speed/,
    /increases? their attack speed/,
  ].some((pattern) => pattern.test(description));
  if (describesAllies) return 'team';

  const describesOneAlly = [
    /(?:an ally|ally target|target ally)[^.]{0,80}attack speed/,
    /(?:target|ally)(?:'s)? attack speed/,
    /grants?[^.]{0,60}increase attack speed[^.]{0,30}(?:ally|target)/,
  ].some((pattern) => pattern.test(description));
  if (describesOneAlly) return 'single';

  return inferAtbScope(skill);
}

function skillHasEffect(skill: MonsterSkill, name: string) {
  return skill.effects.some((effect) => effect.name === name);
}

function atbEffectForSkill(skill: MonsterSkill): SpeedTuningEffect | null {
  const override = speedTuningSkillOverrides[skill.id];
  if (override?.excludeAtb || !skillHasEffect(skill, 'Increase ATB')) {
    return null;
  }

  const scope = override?.atbScope ?? inferAtbScope(skill);
  if (!scope) return null;

  const importedAmount = Math.max(
    0,
    ...skill.effects
      .filter((effect) => effect.name === 'Increase ATB')
      .map((effect) => effect.quantity ?? 0),
  );
  const percent = clamp(
    override?.atbBoost ??
      (importedAmount || (describesFullAtb(skill) ? 100 : 0)),
    0,
    100,
  );

  return {
    percent,
    scope,
    skillId: skill.id,
    skillName: skill.name,
  };
}

function speedBuffEffectForSkill(
  skill: MonsterSkill,
): SpeedTuningEffect | null {
  const override = speedTuningSkillOverrides[skill.id];
  if (
    override?.excludeSpeedBuff ||
    !skillHasEffect(skill, 'Increase ATK SPD')
  ) {
    return null;
  }

  const scope = override?.speedBuffScope ?? inferSpeedBuffScope(skill);
  if (!scope) return null;

  return {
    scope,
    skillId: skill.id,
    skillName: skill.name,
  };
}

export function getSpeedTuningCapabilities(
  monster: Pick<Monster, 'skillIds'>,
  skillById: ReadonlyMap<number, MonsterSkill>,
): SpeedTuningCapabilities {
  const relevantSkills = (monster.skillIds ?? [])
    .map((skillId) => skillById.get(skillId))
    .filter((skill): skill is MonsterSkill => Boolean(skill));

  const atbBoost = relevantSkills
    .map(atbEffectForSkill)
    .filter((effect): effect is SpeedTuningEffect => Boolean(effect))
    .sort((first, second) => (second.percent ?? 0) - (first.percent ?? 0))[0];
  const speedBuff = relevantSkills
    .map(speedBuffEffectForSkill)
    .filter((effect): effect is SpeedTuningEffect => Boolean(effect))
    .sort((first, second) => {
      if (first.scope === second.scope) return 0;
      return first.scope === 'team' ? -1 : 1;
    })[0];

  return {
    atbBoost: atbBoost ?? null,
    speedBuff: speedBuff ?? null,
  };
}

export function getSpeedTuningLeader(
  monster: Pick<Monster, 'leaderSkill'>,
  mode?: SpeedTuningMode,
): SpeedTuningLeader | null {
  const leader = monster.leaderSkill;
  if (!leader || leader.attribute !== 'Attack Speed') return null;
  const result = {
    amount: leader.amount,
    area: leader.area,
    element: leader.element,
  };
  return mode === undefined || isSpeedLeaderValidForMode(result, mode)
    ? result
    : null;
}

export const getSiegeSpeedLeader = (monster: Pick<Monster, 'leaderSkill'>) =>
  getSpeedTuningLeader(monster, 'siege');

/**
 * Converts the normal 30% SPD buff into the tick multiplier used in battle.
 * Artifact and compatible team amplifiers add together before they amplify
 * the base buff: 1 + 0.30 × (1 + (artifact + team) / 100).
 */
export function speedBuffMultiplier(
  artifactSpeedIncrease: number,
  teamSpeedBuffIncrease = 0,
): number | null {
  if (
    !Number.isFinite(artifactSpeedIncrease) ||
    !Number.isFinite(teamSpeedBuffIncrease)
  ) {
    return null;
  }

  const combinedEffectIncrease =
    clamp(artifactSpeedIncrease, 0, 100) + Math.max(0, teamSpeedBuffIncrease);
  return 1 + (SPEED_BUFF_PERCENT / 100) * (1 + combinedEffectIncrease / 100);
}

export function applicableLeaderPercent(
  leader: SpeedTuningLeader | null,
  targetElement: Element,
): number {
  if (!leader) return 0;
  if (leader.area === 'Element' && leader.element !== targetElement) return 0;
  return Math.max(0, leader.amount);
}

export function combatSpeed({
  baseSpeed,
  runeSpeed,
  towerPercent,
  leaderPercent,
  usesSwift,
  passiveSpeedBonus = 0,
}: CombatSpeedInput): number | null {
  if (
    !Number.isFinite(baseSpeed) ||
    baseSpeed <= 0 ||
    !Number.isFinite(runeSpeed) ||
    !Number.isFinite(towerPercent) ||
    !Number.isFinite(leaderPercent) ||
    !Number.isFinite(passiveSpeedBonus)
  ) {
    return null;
  }

  const normalizedRuneSpeed = Math.max(0, runeSpeed);
  const normalizedTower = clamp(towerPercent, 0, 15);
  const normalizedLeader = Math.max(0, leaderPercent);
  const normalizedPassiveSpeedBonus = Math.max(0, passiveSpeedBonus);
  const exactSwiftBonus = (baseSpeed * 25) / 100;
  const swiftDisplayPenalty = usesSwift
    ? Math.ceil(exactSwiftBonus) - exactSwiftBonus
    : 0;

  return Math.ceil(
    baseSpeed +
      (baseSpeed * (normalizedTower + normalizedLeader)) / 100 +
      normalizedRuneSpeed -
      swiftDisplayPenalty +
      normalizedPassiveSpeedBonus,
  );
}

export function minimumRuneSpeedForCombat(
  minimumCombatSpeed: number,
  input: Omit<CombatSpeedInput, 'runeSpeed'>,
): number | null {
  if (!Number.isFinite(minimumCombatSpeed) || minimumCombatSpeed <= 0) {
    return null;
  }

  const withoutRunes = combatSpeed({ ...input, runeSpeed: 0 });
  if (withoutRunes === null) return null;

  let candidate = Math.max(0, Math.floor(minimumCombatSpeed - withoutRunes));
  while (
    candidate > 0 &&
    (combatSpeed({ ...input, runeSpeed: candidate - 1 }) ?? -Infinity) >=
      minimumCombatSpeed
  ) {
    candidate -= 1;
  }
  while (
    (combatSpeed({ ...input, runeSpeed: candidate }) ?? -Infinity) <
    minimumCombatSpeed
  ) {
    candidate += 1;
  }

  return candidate;
}

export function tuneFollower({
  anchorCombatSpeed,
  iteration,
  accumulatedAtbBoost,
  speedBuffStartIteration,
  artifactSpeedIncrease,
  teamSpeedBuffIncrease = 0,
  baseSpeed,
  towerPercent,
  leaderPercent,
  usesSwift,
  passiveSpeedBonus = 0,
  tickConstant = SIEGE_TICK_CONSTANT,
}: FollowerTuningInput): FollowerTuningResult | null {
  if (
    !Number.isFinite(anchorCombatSpeed) ||
    anchorCombatSpeed <= 0 ||
    !Number.isInteger(iteration) ||
    iteration < 1 ||
    !Number.isFinite(accumulatedAtbBoost) ||
    !Number.isFinite(artifactSpeedIncrease) ||
    !Number.isFinite(teamSpeedBuffIncrease) ||
    !Number.isFinite(passiveSpeedBonus) ||
    !Number.isFinite(tickConstant) ||
    tickConstant <= 0
  ) {
    return null;
  }

  const anchorTicks = Math.ceil(1 / (anchorCombatSpeed * tickConstant));
  const normalizedBoost = Math.max(0, accumulatedAtbBoost) / 100;
  const numerator =
    anchorCombatSpeed * tickConstant * (anchorTicks + iteration) -
    normalizedBoost;

  let denominator = tickConstant * (anchorTicks + iteration);
  if (
    speedBuffStartIteration !== null &&
    speedBuffStartIteration >= 1 &&
    speedBuffStartIteration <= iteration
  ) {
    const normalTicks = speedBuffStartIteration - 1;
    const buffedTicks = iteration - normalTicks;
    const speedModifier = speedBuffMultiplier(
      artifactSpeedIncrease,
      teamSpeedBuffIncrease,
    );
    if (speedModifier === null) return null;
    denominator =
      tickConstant * (anchorTicks + normalTicks + buffedTicks * speedModifier);
  }

  if (!Number.isFinite(denominator) || denominator <= 0) return null;

  const minimumCombatSpeed = Math.max(
    1,
    Math.floor(numerator / denominator) + 1,
  );
  const runeSpeed = minimumRuneSpeedForCombat(minimumCombatSpeed, {
    baseSpeed,
    towerPercent,
    leaderPercent,
    usesSwift,
    passiveSpeedBonus,
  });
  if (runeSpeed === null) return null;

  const tunedCombatSpeed = combatSpeed({
    baseSpeed,
    runeSpeed,
    towerPercent,
    leaderPercent,
    usesSwift,
    passiveSpeedBonus,
  });
  if (tunedCombatSpeed === null) return null;

  return {
    runeSpeed,
    combatSpeed: tunedCombatSpeed,
    minimumCombatSpeed,
  };
}
