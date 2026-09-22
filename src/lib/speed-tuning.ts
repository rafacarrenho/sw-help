import {
  speedTuningSkillOverrides,
  type SpeedTuningTargetScope,
} from '../data/speed-tuning.ts';
import type { Element, Monster, MonsterSkill } from './types.ts';

export const SIEGE_TICK_CONSTANT = 0.0007;
export const DEFAULT_SPEED_TUNING_TOWER_PERCENT = 15;
export const SPEED_BUFF_PERCENT = 30;

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
}

export interface FollowerTuningInput {
  anchorCombatSpeed: number;
  iteration: number;
  accumulatedAtbBoost: number;
  speedBuffStartIteration: number | null;
  artifactSpeedIncrease: number;
  baseSpeed: number;
  towerPercent: number;
  leaderPercent: number;
  usesSwift: boolean;
}

export interface FollowerTuningResult {
  runeSpeed: number;
  combatSpeed: number;
  minimumCombatSpeed: number;
}

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

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

export function getSiegeSpeedLeader(
  monster: Pick<Monster, 'leaderSkill'>,
): SpeedTuningLeader | null {
  const leader = monster.leaderSkill;
  if (!leader || leader.attribute !== 'Attack Speed') return null;
  if (!['General', 'Guild', 'Element'].includes(leader.area)) return null;

  return {
    amount: leader.amount,
    area: leader.area,
    element: leader.element,
  };
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
}: CombatSpeedInput): number | null {
  if (
    !Number.isFinite(baseSpeed) ||
    baseSpeed <= 0 ||
    !Number.isFinite(runeSpeed) ||
    !Number.isFinite(towerPercent) ||
    !Number.isFinite(leaderPercent)
  ) {
    return null;
  }

  const normalizedRuneSpeed = Math.max(0, runeSpeed);
  const normalizedTower = clamp(towerPercent, 0, 15);
  const normalizedLeader = Math.max(0, leaderPercent);
  const exactSwiftBonus = (baseSpeed * 25) / 100;
  const swiftDisplayPenalty = usesSwift
    ? Math.ceil(exactSwiftBonus) - exactSwiftBonus
    : 0;

  return Math.ceil(
    baseSpeed +
      (baseSpeed * (normalizedTower + normalizedLeader)) / 100 +
      normalizedRuneSpeed -
      swiftDisplayPenalty,
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
  baseSpeed,
  towerPercent,
  leaderPercent,
  usesSwift,
}: FollowerTuningInput): FollowerTuningResult | null {
  if (
    !Number.isFinite(anchorCombatSpeed) ||
    anchorCombatSpeed <= 0 ||
    !Number.isInteger(iteration) ||
    iteration < 1 ||
    !Number.isFinite(accumulatedAtbBoost) ||
    !Number.isFinite(artifactSpeedIncrease)
  ) {
    return null;
  }

  const anchorTicks = Math.ceil(1 / (anchorCombatSpeed * SIEGE_TICK_CONSTANT));
  const normalizedBoost = Math.max(0, accumulatedAtbBoost) / 100;
  const numerator =
    anchorCombatSpeed * SIEGE_TICK_CONSTANT * (anchorTicks + iteration) -
    normalizedBoost;

  let denominator = SIEGE_TICK_CONSTANT * (anchorTicks + iteration);
  if (
    speedBuffStartIteration !== null &&
    speedBuffStartIteration >= 1 &&
    speedBuffStartIteration <= iteration
  ) {
    const normalTicks = speedBuffStartIteration - 1;
    const buffedTicks = iteration - normalTicks;
    const speedModifier =
      1 +
      (SPEED_BUFF_PERCENT / 100) *
        (1 + clamp(artifactSpeedIncrease, 0, 100) / 100);
    denominator =
      SIEGE_TICK_CONSTANT *
      (anchorTicks + normalTicks + buffedTicks * speedModifier);
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
  });
  if (runeSpeed === null) return null;

  const tunedCombatSpeed = combatSpeed({
    baseSpeed,
    runeSpeed,
    towerPercent,
    leaderPercent,
    usesSwift,
  });
  if (tunedCombatSpeed === null) return null;

  return {
    runeSpeed,
    combatSpeed: tunedCombatSpeed,
    minimumCombatSpeed,
  };
}
