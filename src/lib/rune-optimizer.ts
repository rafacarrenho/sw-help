import { SPEED_TICK_BREAKPOINTS } from './speed-tick.ts';
import { runeSetNames } from './rune-optimizer-types.ts';
import type {
  BuildStatKey,
  NormalizedRune,
  OptimizerObjectiveKey,
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
      baseValue: rune.main.value,
      currentGrind: 0,
      possibleGrind: 0,
      grindable: false,
      enchanted: false,
    },
    ...(rune.innate
      ? [
          {
            source: 'innate' as const,
            stat: rune.innate.stat,
            value: rune.innate.value,
            baseValue: rune.innate.value,
            currentGrind: 0,
            possibleGrind: 0,
            grindable: false,
            enchanted: false,
          },
        ]
      : []),
    ...rune.substats.map((substat) => {
      const grindCap = grindCaps[substat.stat];
      const grindable = grindCap !== undefined;
      const possibleGrind = grindable
        ? Math.max(0, grindCap - substat.grind)
        : 0;
      return {
        source: 'substat' as const,
        stat: substat.stat,
        value: substat.value + substat.grind + possibleGrind,
        baseValue: substat.value,
        currentGrind: substat.grind,
        possibleGrind,
        grindable,
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

type DamagePartialFrontier = Array<Array<[attack: number, critDamage: number]>>;

interface DamageProjection {
  attack: number;
  critRate: number;
  critDamage: number;
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

function candidateVector(
  candidate: CandidateRune,
  query: OptimizerQuery,
): RuneVector {
  return query.projection === 'current'
    ? candidate.current
    : candidate.potential;
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
  const objectiveStats = objectiveStatKeys(query.objective);
  const relevantStats = new Set<BuildStatKey>([
    ...objectiveStats,
    ...(Object.keys(query.constraints) as BuildStatKey[]),
    ...(query.tick ? (['speed'] as BuildStatKey[]) : []),
  ]);
  for (const buildStat of relevantStats) {
    const hasMaximum = query.constraints[buildStat]?.max !== undefined;
    const aValue = scaledContribution(
      candidateVector(a, query),
      buildStat,
      query,
    );
    const bValue = scaledContribution(
      candidateVector(b, query),
      buildStat,
      query,
    );
    if (hasMaximum && aValue !== bValue) return false;
    if (!hasMaximum && aValue < bValue) return false;
    if (aValue > bValue) better = true;
  }
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
    ...objectiveStatKeys(query.objective),
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

function objectiveStatKeys(objective: OptimizerObjectiveKey): BuildStatKey[] {
  return objective === 'damage'
    ? ['attack', 'critRate', 'critDamage']
    : [objective];
}

export function buildObjectiveValue(
  stats: StatValues,
  objective: OptimizerObjectiveKey,
): number {
  if (objective !== 'damage') return stats[objective];
  return Math.round(
    stats.attack *
      (1 + (Math.min(100, stats.critRate) / 100) * (stats.critDamage / 100)),
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
    case 'damage': {
      const base = statsFromVector(query.monster, emptyVector());
      return (
        buildObjectiveValue(statsFromVector(query.monster, vector), 'damage') -
        buildObjectiveValue(base, 'damage')
      );
    }
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
  return objectiveContributionForVector(
    candidateVector(candidate, query),
    query,
  );
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
    const contribution = scaledContribution(
      candidateVector(candidate, query),
      stat,
      query,
    );
    score +=
      contribution /
      (stat === 'hp' || stat === 'attack' || stat === 'defense'
        ? gap * 100
        : gap);
  }
  if (query.tick) score += candidateVector(candidate, query).speed / 10;
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
      a.runeIds.join('|').localeCompare(b.runeIds.join('|')),
  );
  if (results.length > limit) results.length = limit;
}

function addDamagePartial(
  frontier: DamagePartialFrontier,
  attack: number,
  critRate: number,
  critDamage: number,
): boolean {
  const cappedCritRate = Math.min(100, critRate);
  for (let rate = cappedCritRate; rate <= 100; rate += 1) {
    if (
      frontier[rate].some(
        ([knownAttack, knownCritDamage]) =>
          knownAttack >= attack && knownCritDamage >= critDamage,
      )
    ) {
      return false;
    }
  }

  for (let rate = 0; rate <= cappedCritRate; rate += 1) {
    frontier[rate] = frontier[rate].filter(
      ([knownAttack, knownCritDamage]) =>
        knownAttack > attack || knownCritDamage > critDamage,
    );
  }
  frontier[cappedCritRate].push([attack, critDamage]);
  return true;
}

function paretoDamageProjections(
  projections: DamageProjection[],
): DamageProjection[] {
  projections.sort(
    (a, b) =>
      b.attack - a.attack ||
      b.critRate - a.critRate ||
      b.critDamage - a.critDamage,
  );
  const bestCritDamageByRate = Array.from(
    { length: 101 },
    () => Number.NEGATIVE_INFINITY,
  );
  const result: DamageProjection[] = [];
  for (const projection of projections) {
    const critRate = Math.min(100, projection.critRate);
    let dominated = false;
    for (let rate = critRate; rate <= 100; rate += 1) {
      if (bestCritDamageByRate[rate] >= projection.critDamage) {
        dominated = true;
        break;
      }
    }
    if (dominated) continue;
    result.push({ ...projection, critRate });
    bestCritDamageByRate[critRate] = Math.max(
      bestCritDamageByRate[critRate],
      projection.critDamage,
    );
  }
  return result;
}

export function optimizeRunes(
  allRunes: NormalizedRune[],
  query: OptimizerQuery,
): OptimizerResult {
  const startedAt = Date.now();
  const requiredPieceTargets = new Map<RuneSetName, number>();
  for (const set of query.requiredSets) {
    requiredPieceTargets.set(
      set,
      (requiredPieceTargets.get(set) ?? 0) + SET_SIZE[set],
    );
  }
  const requiredPieceCount = [...requiredPieceTargets.values()].reduce(
    (total, count) => total + count,
    0,
  );
  if (requiredPieceCount > 6) {
    return {
      builds: [],
      combinationsEvaluated: 0,
      candidatesBySlot: [0, 0, 0, 0, 0, 0],
      elapsedMs: Date.now() - startedAt,
    };
  }

  const allSlotsReservedByRequiredSets = requiredPieceCount === 6;
  const excluded = new Set(query.excludedMonsterIds);
  const allowed = allRunes.filter(
    (rune) =>
      (!query.inventoryOnly || rune.location === 'inventory') &&
      (query.includeLocked || !rune.locked) &&
      (!rune.equippedMonsterId || !excluded.has(rune.equippedMonsterId)) &&
      (!allSlotsReservedByRequiredSets ||
        rune.set === 'Intangible' ||
        requiredPieceTargets.has(rune.set)),
  );
  const candidatesBySlot = Array.from({ length: 6 }, (_, slotIndex) => {
    const candidates = allowed
      .filter((rune) => rune.slot === slotIndex + 1)
      .map((rune) => ({ rune, ...runeVectors(rune) }));
    const pruned = paretoPrune(candidates, query);
    pruned.sort(
      (a, b) =>
        candidatePriority(b, query) - candidatePriority(a, query) ||
        a.rune.id.localeCompare(b.rune.id),
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
  const candidateCountsBySlot = candidatesBySlot.map((slot) => slot.length);
  candidatesBySlot.sort((a, b) => a.length - b.length);

  const requiredTargets = [...requiredPieceTargets.entries()];
  const requiredSetIndexes = new Map(
    requiredTargets.map(([set], index) => [set, index]),
  );
  const candidateKindsBySlot = candidatesBySlot.map(
    (candidates) =>
      new Set(
        candidates.map(({ rune }) => {
          if (rune.set === 'Intangible') return -2;
          return requiredSetIndexes.get(rune.set) ?? -1;
        }),
      ),
  );
  const setFeasibilityMemo = new Map<string, boolean>();
  const canCompleteRequiredSets = (
    depth: number,
    counts: number[],
    intangible: number,
  ): boolean => {
    if (requiredTargets.length === 0) return true;
    if (depth === 6) {
      const missingPieces = requiredTargets.reduce(
        (total, [, target], index) =>
          total + Math.max(0, target - counts[index]),
        0,
      );
      return missingPieces <= intangible;
    }

    const cappedCounts = counts.map((count, index) =>
      Math.min(count, requiredTargets[index][1]),
    );
    const key = `${depth}|${intangible}|${cappedCounts.join(',')}`;
    const cached = setFeasibilityMemo.get(key);
    if (cached !== undefined) return cached;

    for (const kind of candidateKindsBySlot[depth]) {
      if (kind === -2) {
        if (
          intangible === 0 &&
          canCompleteRequiredSets(depth + 1, cappedCounts, 1)
        ) {
          setFeasibilityMemo.set(key, true);
          return true;
        }
        continue;
      }

      const nextCounts = [...cappedCounts];
      if (kind >= 0) nextCounts[kind] += 1;
      if (canCompleteRequiredSets(depth + 1, nextCounts, intangible)) {
        setFeasibilityMemo.set(key, true);
        return true;
      }
    }

    setFeasibilityMemo.set(key, false);
    return false;
  };

  const optimisticSetBonus = allSlotsReservedByRequiredSets
    ? (() => {
        const bonus = emptyVector();
        for (const set of query.requiredSets) {
          const effect = SET_STAT_BONUS[set];
          if (effect) addEffect(bonus, effect.stat, effect.value);
        }
        return bonus;
      })()
    : MAX_SET_BONUS;
  const fixedDamageSetBonuses: DamageProjection[] = [
    {
      attack: optimisticSetBonus.attackPercent,
      critRate: optimisticSetBonus.critRate,
      critDamage: optimisticSetBonus.critDamage,
    },
  ];

  if (
    !canCompleteRequiredSets(
      0,
      requiredTargets.map(() => 0),
      0,
    )
  ) {
    return {
      builds: [],
      combinationsEvaluated: 0,
      candidatesBySlot: candidateCountsBySlot,
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
  for (let depth = 5; depth >= 0; depth -= 1) {
    remainingScaledMax[depth] = { ...remainingScaledMax[depth + 1] };
    for (const stat of Object.keys(
      remainingScaledMax[depth],
    ) as BuildStatKey[]) {
      remainingScaledMax[depth][stat] += Math.max(
        ...candidatesBySlot[depth].map((candidate) =>
          scaledContribution(candidateVector(candidate, query), stat, query),
        ),
      );
    }
  }

  const remainingDamageProjections: DamageProjection[][] = Array.from(
    { length: 7 },
    () => [],
  );
  if (query.objective === 'damage') {
    remainingDamageProjections[6] = [{ attack: 0, critRate: 0, critDamage: 0 }];
    for (let depth = 5; depth >= 0; depth -= 1) {
      const projections: DamageProjection[] = [];
      for (const candidate of candidatesBySlot[depth]) {
        const vector = candidateVector(candidate, query);
        const attack = scaledContribution(vector, 'attack', query);
        for (const suffix of remainingDamageProjections[depth + 1]) {
          projections.push({
            attack: attack + suffix.attack,
            critRate: vector.critRate + suffix.critRate,
            critDamage: vector.critDamage + suffix.critDamage,
          });
        }
      }
      remainingDamageProjections[depth] = paretoDamageProjections(projections);
    }
  }

  const selected: CandidateRune[] = [];
  const currentVector = emptyVector();
  const potentialVector = emptyVector();
  const selectedVector =
    query.projection === 'current' ? currentVector : potentialVector;
  const results: RuneBuildResult[] = [];
  const limit = Math.max(1, Math.min(50, query.limit ?? 10));
  let combinationsEvaluated = 0;
  let intangibleCount = 0;
  const selectedRequiredCounts = requiredTargets.map(() => 0);
  const objectiveStats = objectiveStatKeys(query.objective);
  const partialRelevantStats = [
    ...new Set<BuildStatKey>([
      ...objectiveStats,
      ...(Object.keys(query.constraints) as BuildStatKey[]),
      ...(query.tick ? (['speed'] as BuildStatKey[]) : []),
    ]),
  ];
  const partialRelevantSets = runeSetNames.filter((set) => {
    if (set === 'Intangible' || query.requiredSets.includes(set)) return true;
    if (set === 'Swift') return partialRelevantStats.includes('speed');
    const effect = SET_STAT_BONUS[set];
    return (
      effect !== undefined &&
      partialRelevantStats.includes(buildStatForRuneStat(effect.stat))
    );
  });
  const partialSetIndexes = new Map(
    partialRelevantSets.map((set, index) => [set, index]),
  );
  const partialSetCounts = partialRelevantSets.map(() => 0);
  const partialFrontiers = Array.from(
    { length: 7 },
    () => new Map<string, DamagePartialFrontier>(),
  );
  const canUsePartialPareto =
    query.objective === 'damage' &&
    query.tick === undefined &&
    Object.entries(query.constraints).every(
      ([stat, range]) =>
        ['attack', 'critRate', 'critDamage'].includes(stat) &&
        range?.max === undefined,
    );
  const needsOptimisticSpeed =
    query.objective === 'speed' ||
    query.tick !== undefined ||
    query.constraints.speed !== undefined;
  const damageBonusMemo = new Map<string, DamageProjection[]>();

  const possibleDamageSetBonuses = (depth: number): DamageProjection[] => {
    if (allSlotsReservedByRequiredSets) return fixedDamageSetBonuses;
    const damageSets = ['Fatal', 'Rage', 'Blade', 'Fight'] as const;
    const selectedCounts = damageSets.map((set) => {
      const index = partialSetIndexes.get(set);
      return index === undefined ? 0 : partialSetCounts[index];
    });
    const intangibleIndex = partialSetIndexes.get('Intangible');
    const selectedIntangible =
      intangibleIndex === undefined ? 0 : partialSetCounts[intangibleIndex];
    const key = `${depth}|${selectedCounts.join(',')}|${selectedIntangible}`;
    const cached = damageBonusMemo.get(key);
    if (cached) return cached;

    const unique = new Map<string, DamageProjection>();
    const additions = [0, 0, 0, 0];
    const addBonus = (assignment: number): void => {
      const counts = selectedCounts.map(
        (count, index) =>
          count + additions[index] + (assignment === index ? 1 : 0),
      );
      const bonus = {
        attack: Math.floor(counts[0] / 4) * 35 + Math.floor(counts[3] / 2) * 8,
        critRate: Math.floor(counts[2] / 2) * 12,
        critDamage: Math.floor(counts[1] / 4) * 40,
      };
      unique.set(
        `${bonus.attack}|${bonus.critRate}|${bonus.critDamage}`,
        bonus,
      );
    };
    const enumerate = (index: number, remaining: number): void => {
      if (index < additions.length) {
        for (let count = 0; count <= remaining; count += 1) {
          additions[index] = count;
          enumerate(index + 1, remaining - count);
        }
        return;
      }
      const maxExtraIntangible = Math.min(1 - selectedIntangible, remaining);
      for (
        let extraIntangible = 0;
        extraIntangible <= maxExtraIntangible;
        extraIntangible += 1
      ) {
        const hasIntangible = selectedIntangible + extraIntangible === 1;
        addBonus(-1);
        if (hasIntangible) {
          for (let assignment = 0; assignment < 4; assignment += 1) {
            addBonus(assignment);
          }
        }
      }
    };
    enumerate(0, 6 - depth);
    const bonuses = [...unique.values()];
    damageBonusMemo.set(key, bonuses);
    return bonuses;
  };

  const maximumPossibleSpeed = (depth: number): number => {
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
          const value = total + candidateVector(candidate, query).speed;
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
        selectedVector.speed +
        addedSpeed +
        (canActivateSwift ? Math.ceil(query.monster.speed * 0.25) : 0);
      best = Math.max(best, total);
    }
    return best;
  };

  const maximumPossibleDamage = (depth: number): number => {
    const selectedAttack = scaledContribution(selectedVector, 'attack', query);
    let best = Number.NEGATIVE_INFINITY;
    const bonuses = possibleDamageSetBonuses(depth);
    for (const remaining of remainingDamageProjections[depth]) {
      for (const bonus of bonuses) {
        const attack =
          query.monster.attack +
          Math.floor(
            (selectedAttack +
              remaining.attack +
              query.monster.attack * bonus.attack) /
              100,
          );
        const critRate = Math.min(
          100,
          query.monster.critRate +
            selectedVector.critRate +
            remaining.critRate +
            bonus.critRate,
        );
        const critDamage =
          query.monster.critDamage +
          selectedVector.critDamage +
          remaining.critDamage +
          bonus.critDamage;
        best = Math.max(
          best,
          Math.round(attack * (1 + (critRate / 100) * (critDamage / 100))),
        );
      }
    }
    return best;
  };

  const optimisticStatsAt = (depth: number, vector: RuneVector): StatValues => {
    const remaining = remainingScaledMax[depth];
    const scaled = (stat: BuildStatKey) =>
      scaledContribution(vector, stat, query) + remaining[stat];
    return {
      hp:
        query.monster.hp +
        Math.floor(
          (scaled('hp') + query.monster.hp * optimisticSetBonus.hpPercent) /
            100,
        ),
      attack:
        query.monster.attack +
        Math.floor(
          (scaled('attack') +
            query.monster.attack * optimisticSetBonus.attackPercent) /
            100,
        ),
      defense:
        query.monster.defense +
        Math.floor(
          (scaled('defense') +
            query.monster.defense * optimisticSetBonus.defensePercent) /
            100,
        ),
      speed: needsOptimisticSpeed
        ? maximumPossibleSpeed(depth)
        : query.monster.speed,
      critRate: Math.min(
        100,
        query.monster.critRate +
          scaled('critRate') +
          optimisticSetBonus.critRate,
      ),
      critDamage:
        query.monster.critDamage +
        scaled('critDamage') +
        optimisticSetBonus.critDamage,
      resistance: Math.min(
        100,
        query.monster.resistance +
          scaled('resistance') +
          optimisticSetBonus.resistance,
      ),
      accuracy: Math.min(
        100,
        query.monster.accuracy +
          scaled('accuracy') +
          optimisticSetBonus.accuracy,
      ),
    };
  };

  const visit = (depth: number): void => {
    if (
      !canCompleteRequiredSets(depth, selectedRequiredCounts, intangibleCount)
    ) {
      return;
    }

    if (canUsePartialPareto && depth > 0) {
      const state = partialSetCounts.join(',');
      let frontier = partialFrontiers[depth].get(state);
      if (!frontier) {
        frontier = Array.from({ length: 101 }, () => []);
        partialFrontiers[depth].set(state, frontier);
      }
      if (
        !addDamagePartial(
          frontier,
          scaledContribution(selectedVector, 'attack', query),
          selectedVector.critRate,
          selectedVector.critDamage,
        )
      )
        return;
    }

    if (depth === 6) {
      combinationsEvaluated += 1;
      const runes = selected
        .map(({ rune }) => rune)
        .sort((a, b) => a.slot - b.slot);
      for (const variant of setVariants(runes)) {
        if (!containsRequiredSets(variant.sets, query.requiredSets)) continue;
        const currentWithBonus = { ...currentVector };
        addVector(currentWithBonus, variant.bonus);
        const current = statsFromRuneVector(
          query.monster,
          currentWithBonus,
          variant.swiftActive,
        );
        const potentialWithBonus = { ...potentialVector };
        addVector(potentialWithBonus, variant.bonus);
        const potential = statsFromRuneVector(
          query.monster,
          potentialWithBonus,
          variant.swiftActive,
        );
        const selectedStats =
          query.projection === 'current' ? current : potential;
        if (!satisfiesConstraints(selectedStats, query.constraints)) continue;
        if (!reachesTick(selectedStats, query, variant.swiftActive)) continue;
        const result = {
          runeIds: runes.map(({ id }) => id),
          sets: variant.sets,
          current,
          potential,
          objectiveValue: buildObjectiveValue(selectedStats, query.objective),
        };
        if (
          canUsePartialPareto &&
          results[0] &&
          result.objectiveValue < results[0].objectiveValue
        ) {
          continue;
        }
        if (
          canUsePartialPareto &&
          results[0] &&
          result.objectiveValue > results[0].objectiveValue
        ) {
          results.length = 0;
        }
        insertResult(results, result, limit);
      }
      return;
    }

    const optimisticStats = optimisticStatsAt(depth, selectedVector);
    for (const [stat, range] of Object.entries(query.constraints) as Array<
      [BuildStatKey, { min?: number; max?: number }]
    >) {
      if (range.min !== undefined && optimisticStats[stat] < range.min) return;
      if (range.max !== undefined) {
        const minimumStats = statsFromVector(query.monster, selectedVector);
        if (minimumStats[stat] > range.max) return;
      }
    }
    if (
      results.length === limit ||
      (canUsePartialPareto && results.length > 0)
    ) {
      const worst = canUsePartialPareto
        ? results[0]
        : results[results.length - 1];
      const optimisticObjective =
        query.objective === 'damage'
          ? maximumPossibleDamage(depth)
          : buildObjectiveValue(optimisticStats, query.objective);
      if (optimisticObjective < worst.objectiveValue) {
        return;
      }
    }

    for (const candidate of candidatesBySlot[depth]) {
      const isIntangible = candidate.rune.set === 'Intangible';
      if (isIntangible && intangibleCount >= 1) continue;
      const requiredSetIndex = requiredSetIndexes.get(candidate.rune.set);
      const previousRequiredCount =
        requiredSetIndex === undefined
          ? 0
          : selectedRequiredCounts[requiredSetIndex];
      if (isIntangible) intangibleCount += 1;
      const partialSetIndex = partialSetIndexes.get(candidate.rune.set);
      if (partialSetIndex !== undefined) partialSetCounts[partialSetIndex] += 1;
      if (requiredSetIndex !== undefined) {
        selectedRequiredCounts[requiredSetIndex] = Math.min(
          requiredTargets[requiredSetIndex][1],
          previousRequiredCount + 1,
        );
      }
      selected.push(candidate);
      addVector(currentVector, candidate.current);
      addVector(potentialVector, candidate.potential);
      visit(depth + 1);
      subtractVector(potentialVector, candidate.potential);
      subtractVector(currentVector, candidate.current);
      selected.pop();
      if (requiredSetIndex !== undefined) {
        selectedRequiredCounts[requiredSetIndex] = previousRequiredCount;
      }
      if (partialSetIndex !== undefined) partialSetCounts[partialSetIndex] -= 1;
      if (isIntangible) intangibleCount -= 1;
    }
  };

  visit(0);
  return {
    builds: results,
    combinationsEvaluated,
    candidatesBySlot: candidateCountsBySlot,
    elapsedMs: Date.now() - startedAt,
  };
}
