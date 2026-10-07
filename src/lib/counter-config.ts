import type {
  Counter,
  CounterBase,
  CounterCopy,
  CounterDefinition,
  CounterRune,
  CounterRuneOverride,
  CounterStats,
} from './types.ts';

const copyStats = (stats?: CounterStats): CounterStats | undefined =>
  stats ? { ...stats } : undefined;

const copyRune = (rune: CounterRune): CounterRune => ({
  ...rune,
  stats: copyStats(rune.stats),
  preferredStats: rune.preferredStats ? [...rune.preferredStats] : undefined,
});

function mergeRune(
  baseRune: CounterRune,
  override: CounterRuneOverride,
): CounterRune {
  const stats = { ...baseRune.stats };

  for (const [name, value] of Object.entries(override.stats ?? {})) {
    const statName = name as keyof CounterStats;
    if (value === null) delete stats[statName];
    else stats[statName] = value;
  }

  return {
    monsterId: baseRune.monsterId,
    sets: override.sets ?? baseRune.sets,
    stats: Object.keys(stats).length > 0 ? stats : undefined,
    preferredStats:
      override.preferredStats !== undefined
        ? [...override.preferredStats]
        : baseRune.preferredStats
          ? [...baseRune.preferredStats]
          : undefined,
  };
}

function mergeRunes(
  baseRunes: CounterRune[],
  overrides: CounterRuneOverride[] = [],
): CounterRune[] {
  const overridesByMonster = new Map(
    overrides.map((override) => [override.monsterId, override]),
  );

  return baseRunes.map((rune) => {
    const override = overridesByMonster.get(rune.monsterId);
    return override ? mergeRune(rune, override) : copyRune(rune);
  });
}

export function resolveCounterDefinitions(
  definitions: CounterDefinition[],
): CounterBase[] {
  return definitions.flatMap((definition) =>
    definition.matchups.map((matchup) => {
      const overrides = matchup.overrides;
      return {
        id: `${definition.id}-${matchup.defenseId}`,
        counterId: definition.id,
        defenseId: matchup.defenseId,
        team: [...definition.team],
        turnOrder: [...(overrides?.turnOrder ?? definition.turnOrder)],
        runes: mergeRunes(definition.runes, overrides?.runes),
        tick: overrides?.tick ?? definition.tick,
        sources: (overrides?.sources ?? definition.sources).map((source) => ({
          ...source,
        })),
        killOrder: matchup.killOrder ? [...matchup.killOrder] : undefined,
      };
    }),
  );
}

export function localizeCounters(
  counters: CounterBase[],
  copy: Record<string, CounterCopy>,
): Counter[] {
  return counters.map((counter) => {
    const localized = copy[counter.counterId];
    return {
      ...counter,
      instruction:
        localized.matchups?.[counter.defenseId] ?? localized.instruction,
    };
  });
}

export function validateCounterCopyCoverage<LocaleName extends string>(
  definitions: CounterDefinition[],
  copies: Record<LocaleName, Record<string, CounterCopy>>,
  canonicalLocale: NoInfer<LocaleName>,
): void {
  const definitionIds = new Set(definitions.map(({ id }) => id));

  for (const [locale, localizedCopies] of Object.entries(copies) as [
    LocaleName,
    Record<string, CounterCopy>,
  ][]) {
    const localizedIds = Object.keys(localizedCopies);
    if (
      localizedIds.length !== definitionIds.size ||
      localizedIds.some((id) => !definitionIds.has(id))
    ) {
      throw new Error(`Invalid localized counters for ${locale}.`);
    }

    for (const definition of definitions) {
      const localized = localizedCopies[definition.id];
      if (!localized.instruction?.trim()) {
        throw new Error(
          `Invalid generic counter instruction for ${locale}.${definition.id}.`,
        );
      }

      const defenseIds = new Set(
        definition.matchups.map(({ defenseId }) => defenseId),
      );
      const localizedMatchups = Object.keys(localized.matchups ?? {});
      if (localizedMatchups.some((id) => !defenseIds.has(id))) {
        throw new Error(
          `Invalid counter matchup instruction for ${locale}.${definition.id}.`,
        );
      }
      if (
        Object.values(localized.matchups ?? {}).some(
          (instruction) => !instruction.trim(),
        )
      ) {
        throw new Error(
          `Empty counter matchup instruction for ${locale}.${definition.id}.`,
        );
      }
    }
  }

  for (const definition of definitions) {
    const canonicalMatchups = Object.keys(
      copies[canonicalLocale][definition.id].matchups ?? {},
    ).sort();

    for (const [locale, localizedCopies] of Object.entries(copies) as [
      LocaleName,
      Record<string, CounterCopy>,
    ][]) {
      const localizedMatchups = Object.keys(
        localizedCopies[definition.id].matchups ?? {},
      ).sort();
      if (
        canonicalMatchups.length !== localizedMatchups.length ||
        canonicalMatchups.some(
          (defenseId, index) => defenseId !== localizedMatchups[index],
        )
      ) {
        throw new Error(
          `Counter matchup translations for ${locale}.${definition.id} do not match ${canonicalLocale}.`,
        );
      }
    }
  }
}
