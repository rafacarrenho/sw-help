import { SPEED_TICK_BREAKPOINTS } from './speed-tick.ts';
import type {
  BuildStatKey,
  NormalizedRune,
  OptimizerQuery,
  OptimizerResult,
  PotentialRuneEffect,
  RuneBuildResult,
  RuneSetName,
  RuneStatKey,
  StatValues,
} from './rune-optimizer-types.ts';

const SET_SIZE: Record<RuneSetName, number> = {
  Energy: 2,
  Guard: 2,
  Swift: 4,
  Blade: 2,
  Rage: 4,
  Focus: 2,
  Endure: 2,
  Fatal: 4,
  Despair: 4,
  Vampire: 4,
  Violent: 4,
  Nemesis: 2,
  Will: 2,
  Shield: 2,
  Revenge: 2,
  Destroy: 2,
  Fight: 2,
  Determination: 2,
  Enhance: 2,
  Accuracy: 2,
  Tolerance: 2,
  Seal: 2,
  Intangible: 1,
};

const SET_STAT_BONUS: Partial<
  Record<RuneSetName, { stat: RuneStatKey; value: number }>
> = {
  Energy: { stat: 'hpPercent', value: 15 },
  Guard: { stat: 'defensePercent', value: 15 },
  Blade: { stat: 'critRate', value: 12 },
  Rage: { stat: 'critDamage', value: 40 },
  Focus: { stat: 'accuracy', value: 20 },
  Endure: { stat: 'resistance', value: 20 },
  Fatal: { stat: 'attackPercent', value: 35 },
  Fight: { stat: 'attackPercent', value: 8 },
  Determination: { stat: 'defensePercent', value: 8 },
  Enhance: { stat: 'hpPercent', value: 8 },
  Accuracy: { stat: 'accuracy', value: 10 },
  Tolerance: { stat: 'resistance', value: 10 },
};

const MAX_SET_BONUS: Record<RuneStatKey, number> = {
  hpFlat: 0,
  hpPercent: 45,
  attackFlat: 0,
  attackPercent: 35,
  defenseFlat: 0,
  defensePercent: 45,
  speed: 0,
  critRate: 36,
  critDamage: 40,
  resistance: 60,
  accuracy: 60,
};

const NORMAL_GRIND_MAX: Partial<Record<RuneStatKey, number>> = {
  hpFlat: 550,
  hpPercent: 10,
  attackFlat: 30,
  attackPercent: 10,
  defenseFlat: 30,
  defensePercent: 10,
  speed: 5,
};

const ANCIENT_GRIND_MAX: Partial<Record<RuneStatKey, number>> = {
  hpFlat: 610,
  hpPercent: 12,
  attackFlat: 34,
  attackPercent: 12,
  defenseFlat: 34,
  defensePercent: 12,
  speed: 6,
};

export function runePotentialEffects(
  rune: NormalizedRune,
): PotentialRuneEffect[] {
  const grindCaps = rune.ancient ? ANCIENT_GRIND_MAX : NORMAL_GRIND_MAX;
  return [
    {
      source: 'main',
      stat: rune.main.stat,
      value: rune.main.value,
      grindGain: 0,
      enchanted: false,
    },
    ...(rune.innate
      ? [
          {
            source: 'innate' as const,
            stat: rune.innate.stat,
            value: rune.innate.value,
            grindGain: 0,
            enchanted: false,
          },
        ]
      : []),
    ...rune.substats.map((substat) => {
      const finalGrind = Math.max(substat.grind, grindCaps[substat.stat] ?? 0);
      return {
        source: 'substat' as const,
        stat: substat.stat,
        value: substat.value + finalGrind,
        grindGain: Math.max(0, finalGrind - substat.grind),
        enchanted: substat.enchanted,
      };
    }),
  ];
}

type RuneVector = Record<RuneStatKey, number>;

interface CandidateRune {
  rune: NormalizedRune;
  current: RuneVector;
  potential: RuneVector;
}

const emptyVector = (): RuneVector => ({
  hpFlat: 0,
  hpPercent: 0,
  attackFlat: 0,
  attackPercent: 0,
  defenseFlat: 0,
  defensePercent: 0,
  speed: 0,
  critRate: 0,
  critDamage: 0,
  resistance: 0,
  accuracy: 0,
});

function addEffect(vector: RuneVector, stat: RuneStatKey, value: number): void {
  vector[stat] += value;
}

export function runeVectors(rune: NormalizedRune): {
  current: RuneVector;
  potential: RuneVector;
} {
  const current = emptyVector();
  const potential = emptyVector();
  addEffect(current, rune.main.stat, rune.main.currentValue);
  addEffect(potential, rune.main.stat, rune.main.value);
  if (rune.innate) {
    addEffect(current, rune.innate.stat, rune.innate.value);
    addEffect(potential, rune.innate.stat, rune.innate.value);
  }
  for (const substat of rune.substats) {
    addEffect(current, substat.stat, substat.value + substat.grind);
  }
  for (const effect of runePotentialEffects(rune)) {
    if (effect.source === 'main' || effect.source === 'innate') continue;
    addEffect(potential, effect.stat, effect.value);
  }
  return { current, potential };
}

function addVector(target: RuneVector, source: RuneVector): void {
  for (const stat of Object.keys(target) as RuneStatKey[]) {
    target[stat] += source[stat];
  }
}

function subtractVector(target: RuneVector, source: RuneVector): void {
  for (const stat of Object.keys(target) as RuneStatKey[]) {
    target[stat] -= source[stat];
  }
}

function statsFromVector(
  base: OptimizerQuery['monster'],
  vector: RuneVector,
): StatValues {
  return {
    hp: Math.floor(base.hp * (1 + vector.hpPercent / 100)) + vector.hpFlat,
    attack:
      Math.floor(base.attack * (1 + vector.attackPercent / 100)) +
      vector.attackFlat,
    defense:
      Math.floor(base.defense * (1 + vector.defensePercent / 100)) +
      vector.defenseFlat,
    speed: base.speed + vector.speed,
    critRate: Math.min(100, base.critRate + vector.critRate),
    critDamage: base.critDamage + vector.critDamage,
    resistance: Math.min(100, base.resistance + vector.resistance),
    accuracy: Math.min(100, base.accuracy + vector.accuracy),
  };
}

function statsFromRuneVector(
  base: OptimizerQuery['monster'],
  vector: RuneVector,
  swiftActive: boolean,
): StatValues {
  const copy = { ...vector };
  const runeSpeed = copy.speed;
  copy.speed = 0;
  const stats = statsFromVector(base, copy);
  stats.speed =
    base.speed + runeSpeed + (swiftActive ? Math.ceil(base.speed * 0.25) : 0);
  return stats;
}

function setVariants(runes: NormalizedRune[]): Array<{
  sets: RuneSetName[];
  bonus: RuneVector;
  swiftActive: boolean;
}> {
  const counts = new Map<RuneSetName, number>();
  let intangible = 0;
  for (const rune of runes) {
    if (rune.set === 'Intangible') intangible += 1;
    else counts.set(rune.set, (counts.get(rune.set) ?? 0) + 1);
  }
  if (intangible > 1) return [];
  const assignments: Array<RuneSetName | undefined> = intangible
    ? [
        undefined,
        ...(Object.keys(SET_SIZE) as RuneSetName[]).filter(
          (set) => set !== 'Intangible',
        ),
      ]
    : [undefined];
  const unique = new Set<string>();
  const variants = [];
  for (const assignment of assignments) {
    const active: RuneSetName[] = [];
    for (const [set, count] of counts) {
      const complete = Math.floor(
        (count + (assignment === set ? 1 : 0)) / SET_SIZE[set],
      );
      for (let index = 0; index < complete; index += 1) active.push(set);
    }
    active.sort();
    const key = active.join('|');
    if (unique.has(key)) continue;
    unique.add(key);
    const bonus = emptyVector();
    for (const set of active) {
      const effect = SET_STAT_BONUS[set];
      if (effect) addEffect(bonus, effect.stat, effect.value);
    }
    variants.push({
      sets: active,
      bonus,
      swiftActive: active.includes('Swift'),
    });
  }
  return variants;
}

function containsRequiredSets(
  activeSets: RuneSetName[],
  requiredSets: RuneSetName[],
): boolean {
  const available = new Map<RuneSetName, number>();
  for (const set of activeSets)
    available.set(set, (available.get(set) ?? 0) + 1);
  for (const set of requiredSets) {
    const count = available.get(set) ?? 0;
    if (count < 1) return false;
    available.set(set, count - 1);
  }
  return true;
}

function satisfiesConstraints(
  stats: StatValues,
  constraints: OptimizerQuery['constraints'],
): boolean {
  for (const [stat, range] of Object.entries(constraints) as Array<
    [BuildStatKey, { min?: number; max?: number }]
  >) {
    if (range.min !== undefined && stats[stat] < range.min) return false;
    if (range.max !== undefined && stats[stat] > range.max) return false;
  }
  return true;
}

function reachesTick(
  stats: StatValues,
  query: OptimizerQuery,
  swiftActive: boolean,
): boolean {
  if (!query.tick) return true;
  const breakpoint = SPEED_TICK_BREAKPOINTS.find(
    ({ tick }) => tick === query.tick?.tick,
  );
  if (!breakpoint) return false;
  const runeAndSwiftSpeed = stats.speed - query.monster.speed;
  const swiftPenalty = swiftActive
    ? Math.ceil(query.monster.speed * 0.25) - query.monster.speed * 0.25
    : 0;
  const combatSpeed = Math.ceil(
    query.monster.speed +
      (query.monster.speed *
        (query.tick.speedTowerPercent + query.tick.leaderSkillPercent)) /
        100 +
      runeAndSwiftSpeed -
      swiftPenalty,
  );
  return combatSpeed >= breakpoint.minimumSpeed;
}

function dominates(
  a: CandidateRune,
  b: CandidateRune,
  query: OptimizerQuery,
): boolean {
  let better = false;
  const relevantStats = new Set<BuildStatKey>([
    query.objective,
    ...(Object.keys(query.constraints) as BuildStatKey[]),
    ...(query.tick ? (['speed'] as BuildStatKey[]) : []),
  ]);
  for (const buildStat of relevantStats) {
    const hasMaximum = query.constraints[buildStat]?.max !== undefined;
    const aValue = scaledContribution(a.potential, buildStat, query);
    const bValue = scaledContribution(b.potential, buildStat, query);
    if (hasMaximum && aValue !== bValue) return false;
    if (!hasMaximum && aValue < bValue) return false;
    if (aValue > bValue) better = true;
  }
  const aCurrent = scaledContribution(a.current, query.objective, query);
  const bCurrent = scaledContribution(b.current, query.objective, query);
  if (aCurrent < bCurrent) return false;
  if (aCurrent > bCurrent) better = true;
  return better || a.rune.id.localeCompare(b.rune.id) < 0;
}

function scaledContribution(
  vector: RuneVector,
  stat: BuildStatKey,
  query: OptimizerQuery,
): number {
  switch (stat) {
    case 'hp':
      return vector.hpFlat * 100 + query.monster.hp * vector.hpPercent;
    case 'attack':
      return (
        vector.attackFlat * 100 + query.monster.attack * vector.attackPercent
      );
    case 'defense':
      return (
        vector.defenseFlat * 100 + query.monster.defense * vector.defensePercent
      );
    case 'speed':
      return vector.speed;
    case 'critRate':
      return vector.critRate;
    case 'critDamage':
      return vector.critDamage;
    case 'resistance':
      return vector.resistance;
    case 'accuracy':
      return vector.accuracy;
  }
}

function paretoPrune(
  candidates: CandidateRune[],
  query: OptimizerQuery,
): CandidateRune[] {
  const relevantStats = new Set<BuildStatKey>([
    query.objective,
    ...(Object.keys(query.constraints) as BuildStatKey[]),
    ...(query.tick ? (['speed'] as BuildStatKey[]) : []),
  ]);
  const bySet = new Map<string, CandidateRune[]>();
  for (const candidate of candidates) {
    const set = candidate.rune.set;
    const effect = SET_STAT_BONUS[set];
    const effectStat =
      set === 'Swift'
        ? 'speed'
        : effect
          ? buildStatForRuneStat(effect.stat)
          : undefined;
    const mustPreserveSet =
      set === 'Intangible' ||
      query.requiredSets.includes(set) ||
      (effectStat !== undefined && relevantStats.has(effectStat));
    const key = mustPreserveSet ? set : 'irrelevant-set';
    const group = bySet.get(key) ?? [];
    group.push(candidate);
    bySet.set(key, group);
  }
  return [...bySet.values()].flatMap((group) =>
    group.filter(
      (candidate, index) =>
        !group.some(
          (other, otherIndex) =>
            otherIndex !== index && dominates(other, candidate, query),
        ),
    ),
  );
}

function buildStatForRuneStat(stat: RuneStatKey): BuildStatKey {
  switch (stat) {
    case 'hpFlat':
    case 'hpPercent':
      return 'hp';
    case 'attackFlat':
    case 'attackPercent':
      return 'attack';
    case 'defenseFlat':
    case 'defensePercent':
      return 'defense';
    case 'speed':
      return 'speed';
    case 'critRate':
      return 'critRate';
    case 'critDamage':
      return 'critDamage';
    case 'resistance':
      return 'resistance';
    case 'accuracy':
      return 'accuracy';
  }
}

function objectiveContributionForVector(
  vector: RuneVector,
  query: OptimizerQuery,
): number {
  switch (query.objective) {
    case 'hp':
      return vector.hpFlat + (query.monster.hp * vector.hpPercent) / 100;
    case 'attack':
      return (
        vector.attackFlat + (query.monster.attack * vector.attackPercent) / 100
      );
    case 'defense':
      return (
        vector.defenseFlat +
        (query.monster.defense * vector.defensePercent) / 100
      );
    case 'speed':
      return vector.speed;
    case 'critRate':
      return vector.critRate;
    case 'critDamage':
      return vector.critDamage;
    case 'resistance':
      return vector.resistance;
    case 'accuracy':
      return vector.accuracy;
  }
}

function objectiveContribution(
  candidate: CandidateRune,
  query: OptimizerQuery,
): number {
  return objectiveContributionForVector(candidate.potential, query);
}

function candidatePriority(
  candidate: CandidateRune,
  query: OptimizerQuery,
): number {
  let score = objectiveContribution(candidate, query) * 100;
  for (const [stat, range] of Object.entries(query.constraints) as Array<
    [BuildStatKey, { min?: number; max?: number }]
  >) {
    if (range.min === undefined) continue;
    const baseValue = query.monster[stat];
    const gap = Math.max(1, range.min - baseValue);
    const contribution = scaledContribution(candidate.potential, stat, query);
    score +=
      contribution /
      (stat === 'hp' || stat === 'attack' || stat === 'defense'
        ? gap * 100
        : gap);
  }
  if (query.tick) score += candidate.potential.speed / 10;
  if (query.requiredSets.includes(candidate.rune.set)) score += 5;
  return score;
}

function insertResult(
  results: RuneBuildResult[],
  result: RuneBuildResult,
  limit: number,
): void {
  const existing = results.findIndex(
    ({ runeIds }) => runeIds.join('|') === result.runeIds.join('|'),
  );
  if (existing >= 0) results.splice(existing, 1);
  results.push(result);
  results.sort(
    (a, b) =>
      b.objectiveValue - a.objectiveValue ||
      b.currentObjectiveValue - a.currentObjectiveValue ||
      a.runeIds.join('|').localeCompare(b.runeIds.join('|')),
  );
  if (results.length > limit) results.length = limit;
}

export function optimizeRunes(
  allRunes: NormalizedRune[],
  query: OptimizerQuery,
): OptimizerResult {
  const startedAt = Date.now();
  const excluded = new Set(query.excludedMonsterIds);
  const allowed = allRunes.filter(
    (rune) =>
      (!query.inventoryOnly || rune.location === 'inventory') &&
      (query.includeLocked || !rune.locked) &&
      (!rune.equippedMonsterId || !excluded.has(rune.equippedMonsterId)),
  );
  const candidatesBySlot = Array.from({ length: 6 }, (_, slotIndex) => {
    const candidates = allowed
      .filter((rune) => rune.slot === slotIndex + 1)
      .map((rune) => ({ rune, ...runeVectors(rune) }));
    const pruned = paretoPrune(candidates, query);
    pruned.sort(
      (a, b) =>
        candidatePriority(b, query) - candidatePriority(a, query) ||
        scaledContribution(b.current, query.objective, query) -
          scaledContribution(a.current, query.objective, query),
    );
    return pruned;
  });

  if (candidatesBySlot.some((slot) => slot.length === 0)) {
    return {
      builds: [],
      combinationsEvaluated: 0,
      candidatesBySlot: candidatesBySlot.map((slot) => slot.length),
      elapsedMs: Date.now() - startedAt,
    };
  }

  const emptyBuildValues = (): StatValues => ({
    hp: 0,
    attack: 0,
    defense: 0,
    speed: 0,
    critRate: 0,
    critDamage: 0,
    resistance: 0,
    accuracy: 0,
  });
  const remainingScaledMax = Array.from({ length: 7 }, emptyBuildValues);
  const remainingCurrentScaledMax = Array.from({ length: 7 }, emptyBuildValues);
  for (let depth = 5; depth >= 0; depth -= 1) {
    remainingScaledMax[depth] = { ...remainingScaledMax[depth + 1] };
    remainingCurrentScaledMax[depth] = {
      ...remainingCurrentScaledMax[depth + 1],
    };
    for (const stat of Object.keys(
      remainingScaledMax[depth],
    ) as BuildStatKey[]) {
      remainingScaledMax[depth][stat] += Math.max(
        ...candidatesBySlot[depth].map((candidate) =>
          scaledContribution(candidate.potential, stat, query),
        ),
      );
      remainingCurrentScaledMax[depth][stat] += Math.max(
        ...candidatesBySlot[depth].map((candidate) =>
          scaledContribution(candidate.current, stat, query),
        ),
      );
    }
  }

  const selected: CandidateRune[] = [];
  const currentVector = emptyVector();
  const potentialVector = emptyVector();
  const results: RuneBuildResult[] = [];
  const limit = Math.max(1, Math.min(50, query.limit ?? 10));
  let combinationsEvaluated = 0;
  let intangibleCount = 0;

  const maximumPossibleSpeed = (
    depth: number,
    mode: 'current' | 'potential',
  ): number => {
    const selectedSwift = selected.filter(
      ({ rune }) => rune.set === 'Swift',
    ).length;
    const selectedIntangible = selected.filter(
      ({ rune }) => rune.set === 'Intangible',
    ).length;
    let states = new Map<string, number>([['0|0', 0]]);
    for (let slot = depth; slot < 6; slot += 1) {
      const next = new Map<string, number>();
      for (const [key, total] of states) {
        const [swiftCount, extraIntangible] = key.split('|').map(Number);
        for (const candidate of candidatesBySlot[slot]) {
          const isIntangible = candidate.rune.set === 'Intangible' ? 1 : 0;
          if (selectedIntangible + extraIntangible + isIntangible > 1) continue;
          const nextSwift =
            swiftCount + (candidate.rune.set === 'Swift' ? 1 : 0);
          const nextIntangible = extraIntangible + isIntangible;
          const nextKey = `${nextSwift}|${nextIntangible}`;
          const value = total + candidate[mode].speed;
          if (value > (next.get(nextKey) ?? Number.NEGATIVE_INFINITY)) {
            next.set(nextKey, value);
          }
        }
      }
      states = next;
    }
    let best = Number.NEGATIVE_INFINITY;
    for (const [key, addedSpeed] of states) {
      const [swiftCount, extraIntangible] = key.split('|').map(Number);
      const canActivateSwift =
        selectedSwift + swiftCount + selectedIntangible + extraIntangible >= 4;
      const total =
        query.monster.speed +
        potentialVector.speed +
        addedSpeed +
        (canActivateSwift ? Math.ceil(query.monster.speed * 0.25) : 0);
      best = Math.max(best, total);
    }
    return best;
  };

  const optimisticStatsAt = (
    depth: number,
    vector: RuneVector,
    mode: 'current' | 'potential',
  ): StatValues => {
    const remaining =
      mode === 'potential'
        ? remainingScaledMax[depth]
        : remainingCurrentScaledMax[depth];
    const scaled = (stat: BuildStatKey) =>
      scaledContribution(vector, stat, query) + remaining[stat];
    return {
      hp:
        query.monster.hp +
        Math.floor(
          (scaled('hp') + query.monster.hp * MAX_SET_BONUS.hpPercent) / 100,
        ),
      attack:
        query.monster.attack +
        Math.floor(
          (scaled('attack') +
            query.monster.attack * MAX_SET_BONUS.attackPercent) /
            100,
        ),
      defense:
        query.monster.defense +
        Math.floor(
          (scaled('defense') +
            query.monster.defense * MAX_SET_BONUS.defensePercent) /
            100,
        ),
      speed: maximumPossibleSpeed(depth, mode),
      critRate: Math.min(
        100,
        query.monster.critRate + scaled('critRate') + MAX_SET_BONUS.critRate,
      ),
      critDamage:
        query.monster.critDamage +
        scaled('critDamage') +
        MAX_SET_BONUS.critDamage,
      resistance: Math.min(
        100,
        query.monster.resistance +
          scaled('resistance') +
          MAX_SET_BONUS.resistance,
      ),
      accuracy: Math.min(
        100,
        query.monster.accuracy + scaled('accuracy') + MAX_SET_BONUS.accuracy,
      ),
    };
  };

  const visit = (depth: number): void => {
    if (depth === 6) {
      combinationsEvaluated += 1;
      const runes = selected.map(({ rune }) => rune);
      for (const variant of setVariants(runes)) {
        if (!containsRequiredSets(variant.sets, query.requiredSets)) continue;
        const currentWithBonus = { ...currentVector };
        const potentialWithBonus = { ...potentialVector };
        addVector(currentWithBonus, variant.bonus);
        addVector(potentialWithBonus, variant.bonus);
        const current = statsFromRuneVector(
          query.monster,
          currentWithBonus,
          variant.swiftActive,
        );
        const potential = statsFromRuneVector(
          query.monster,
          potentialWithBonus,
          variant.swiftActive,
        );
        if (!satisfiesConstraints(potential, query.constraints)) continue;
        if (!reachesTick(potential, query, variant.swiftActive)) continue;
        insertResult(
          results,
          {
            runeIds: runes.map(({ id }) => id),
            sets: variant.sets,
            current,
            potential,
            objectiveValue: potential[query.objective],
            currentObjectiveValue: current[query.objective],
          },
          limit,
        );
      }
      return;
    }

    const optimisticStats = optimisticStatsAt(
      depth,
      potentialVector,
      'potential',
    );
    const optimisticCurrentStats = optimisticStatsAt(
      depth,
      currentVector,
      'current',
    );
    for (const [stat, range] of Object.entries(query.constraints) as Array<
      [BuildStatKey, { min?: number; max?: number }]
    >) {
      if (range.min !== undefined && optimisticStats[stat] < range.min) return;
      if (range.max !== undefined) {
        const minimumStats = statsFromVector(query.monster, potentialVector);
        if (minimumStats[stat] > range.max) return;
      }
    }
    if (results.length === limit) {
      const worst = results[results.length - 1];
      if (
        optimisticStats[query.objective] < worst.objectiveValue ||
        (optimisticStats[query.objective] === worst.objectiveValue &&
          optimisticCurrentStats[query.objective] <=
            worst.currentObjectiveValue)
      ) {
        return;
      }
    }

    for (const candidate of candidatesBySlot[depth]) {
      const isIntangible = candidate.rune.set === 'Intangible';
      if (isIntangible && intangibleCount >= 1) continue;
      if (isIntangible) intangibleCount += 1;
      selected.push(candidate);
      addVector(currentVector, candidate.current);
      addVector(potentialVector, candidate.potential);
      visit(depth + 1);
      subtractVector(potentialVector, candidate.potential);
      subtractVector(currentVector, candidate.current);
      selected.pop();
      if (isIntangible) intangibleCount -= 1;
    }
  };

  visit(0);
  return {
    builds: results,
    combinationsEvaluated,
    candidatesBySlot: candidatesBySlot.map((slot) => slot.length),
    elapsedMs: Date.now() - startedAt,
  };
}
