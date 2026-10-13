import type {
  AccountSnapshot,
  ImportedArtifact,
  ImportedMonster,
  NormalizedRune,
  RuneEffect,
  RuneSetName,
  RuneStatKey,
} from './rune-optimizer-types.ts';

type JsonRecord = Record<string, unknown>;

const STAT_BY_ID: Record<number, RuneStatKey | undefined> = {
  1: 'hpFlat',
  2: 'hpPercent',
  3: 'attackFlat',
  4: 'attackPercent',
  5: 'defenseFlat',
  6: 'defensePercent',
  8: 'speed',
  9: 'critRate',
  10: 'critDamage',
  11: 'resistance',
  12: 'accuracy',
};

const SET_BY_ID: Record<number, RuneSetName | undefined> = {
  1: 'Energy',
  2: 'Guard',
  3: 'Swift',
  4: 'Blade',
  5: 'Rage',
  6: 'Focus',
  7: 'Endure',
  8: 'Fatal',
  10: 'Despair',
  11: 'Vampire',
  13: 'Violent',
  14: 'Nemesis',
  15: 'Will',
  16: 'Shield',
  17: 'Revenge',
  18: 'Destroy',
  19: 'Fight',
  20: 'Determination',
  21: 'Enhance',
  22: 'Accuracy',
  23: 'Tolerance',
  24: 'Seal',
  25: 'Intangible',
};

const MAX_MAIN_BY_STAT: Record<RuneStatKey, number[]> = {
  hpFlat: [804, 1092, 1380, 1704, 2088, 2448],
  hpPercent: [18, 20, 38, 43, 51, 63],
  attackFlat: [54, 74, 93, 113, 135, 160],
  attackPercent: [18, 20, 38, 43, 51, 63],
  defenseFlat: [54, 74, 93, 113, 135, 160],
  defensePercent: [18, 20, 38, 43, 51, 63],
  speed: [18, 19, 25, 30, 39, 42],
  critRate: [18, 20, 37, 41, 47, 58],
  critDamage: [20, 37, 43, 58, 65, 80],
  resistance: [18, 20, 38, 44, 51, 64],
  accuracy: [18, 20, 38, 44, 51, 64],
};

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function numberValue(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function arrayValue(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function normalizeEffect(value: unknown): RuneEffect | undefined {
  if (!Array.isArray(value)) return undefined;
  const stat = STAT_BY_ID[numberValue(value[0])];
  if (!stat) return undefined;
  return { stat, value: numberValue(value[1]) };
}

function rawId(value: unknown): string | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value === 'string' && value.length > 0) return value;
  return undefined;
}

export function parseSwexJson(text: string, now = new Date()): AccountSnapshot {
  let root: unknown;
  try {
    root = JSON.parse(text);
  } catch {
    throw new Error('invalid-json');
  }
  if (!isRecord(root)) throw new Error('invalid-export');
  if (numberValue(root.ret_code, -1) !== 0) throw new Error('invalid-export');

  const warnings = new Set<string>();
  const lockedRawIds = new Set(
    arrayValue(root.rune_lock_list)
      .filter(isRecord)
      .map((entry) => rawId(entry.rune_id))
      .filter((value): value is string => Boolean(value)),
  );
  const monsterIdByRaw = new Map<string, string>();
  const monsters: ImportedMonster[] = [];
  const rawRuneSources: Array<{ rune: JsonRecord; owner?: string }> = [];
  const rawArtifactSources: Array<{ artifact: JsonRecord; owner?: string }> =
    [];

  for (const value of arrayValue(root.unit_list)) {
    if (!isRecord(value)) continue;
    const sourceId = rawId(value.unit_id);
    const com2usId = numberValue(value.unit_master_id);
    if (!sourceId || !com2usId) {
      warnings.add('skipped-monster');
      continue;
    }
    const id = `monster-${monsters.length + 1}`;
    monsterIdByRaw.set(sourceId, id);
    monsters.push({
      id,
      com2usId,
      level: numberValue(value.unit_level),
      stars: numberValue(value.class),
      awakened: Boolean(value.awakening_info),
    });
    for (const rune of arrayValue(value.runes)) {
      if (isRecord(rune)) rawRuneSources.push({ rune, owner: id });
    }
    for (const artifact of [
      ...arrayValue(value.artifacts),
      ...arrayValue(value.artifact_list),
    ]) {
      if (isRecord(artifact)) rawArtifactSources.push({ artifact, owner: id });
    }
  }

  for (const rune of arrayValue(root.runes)) {
    if (isRecord(rune)) rawRuneSources.push({ rune });
  }
  for (const artifact of [
    ...arrayValue(root.artifacts),
    ...arrayValue(root.artifact_list),
  ]) {
    if (isRecord(artifact)) rawArtifactSources.push({ artifact });
  }

  const seenRuneIds = new Set<string>();
  const runes: NormalizedRune[] = [];
  for (const source of rawRuneSources) {
    const sourceId = rawId(source.rune.rune_id);
    if (!sourceId || seenRuneIds.has(sourceId)) continue;
    seenRuneIds.add(sourceId);
    const slot = numberValue(source.rune.slot_no);
    const set = SET_BY_ID[numberValue(source.rune.set_id)];
    const rawMain = normalizeEffect(source.rune.pri_eff);
    const rawClass = numberValue(source.rune.class);
    const grade = rawClass > 10 ? rawClass - 10 : rawClass;
    if (!set || !rawMain || slot < 1 || slot > 6 || grade < 1 || grade > 6) {
      warnings.add('skipped-rune');
      continue;
    }
    const mainMax = MAX_MAIN_BY_STAT[rawMain.stat][grade - 1];
    const innate = normalizeEffect(source.rune.prefix_eff);
    const substats = arrayValue(source.rune.sec_eff)
      .filter(Array.isArray)
      .map((effect) => {
        const stat = STAT_BY_ID[numberValue(effect[0])];
        return stat
          ? {
              stat,
              value: numberValue(effect[1]),
              enchanted: numberValue(effect[2]) > 0,
              grind: numberValue(effect[3]),
            }
          : undefined;
      })
      .filter((effect): effect is NonNullable<typeof effect> =>
        Boolean(effect),
      );
    runes.push({
      id: `rune-${runes.length + 1}`,
      slot: slot as NormalizedRune['slot'],
      set,
      grade,
      quality: numberValue(source.rune.rank),
      level: numberValue(source.rune.upgrade_curr),
      ancient: rawClass > 10,
      locked: lockedRawIds.has(sourceId),
      location: source.owner ? 'equipped' : 'inventory',
      ...(source.owner ? { equippedMonsterId: source.owner } : {}),
      main: {
        stat: rawMain.stat,
        currentValue: rawMain.value,
        value: mainMax,
      },
      ...(innate ? { innate } : {}),
      substats,
    });
  }

  const seenArtifactIds = new Set<string>();
  const artifacts: ImportedArtifact[] = [];
  for (const source of rawArtifactSources) {
    const sourceId = rawId(
      source.artifact.artifact_id ??
        source.artifact.relic_id ??
        source.artifact.rid,
    );
    if (!sourceId || seenArtifactIds.has(sourceId)) continue;
    seenArtifactIds.add(sourceId);
    artifacts.push({
      id: `artifact-${artifacts.length + 1}`,
      slot: numberValue(source.artifact.slot),
      level: numberValue(source.artifact.level ?? source.artifact.upgrade_curr),
      grade: numberValue(source.artifact.rank ?? source.artifact.class),
      location: source.owner ? 'equipped' : 'inventory',
      ...(source.owner ? { equippedMonsterId: source.owner } : {}),
    });
  }

  if (runes.length === 0) throw new Error('no-runes');
  if (monsters.length === 0) warnings.add('no-monsters');

  return {
    schemaVersion: 1,
    importedAt: now.toISOString(),
    monsters,
    runes,
    artifacts,
    warnings: [...warnings],
  };
}
