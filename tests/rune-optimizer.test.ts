import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';
import {
  buildObjectiveValue,
  optimizeRunes,
  runePotentialEffects,
  runeVectors,
} from '../src/lib/rune-optimizer.ts';
import { parseSwexJson } from '../src/lib/swex-import.ts';
import { runeSetAssetNames, runeVisualAssets } from '../src/lib/rune-visual.ts';
import { runeSetNames } from '../src/lib/rune-optimizer-types.ts';
import type {
  NormalizedRune,
  OptimizerQuery,
  RuneSetName,
  RuneStatKey,
} from '../src/lib/rune-optimizer-types.ts';

test('rune visuals cover every set, slot, quality and Ancient variant', () => {
  assert.deepEqual(
    Object.keys(runeSetAssetNames).sort(),
    [...runeSetNames].sort(),
  );

  for (const set of runeSetNames) {
    for (const slot of [1, 2, 3, 4, 5, 6] as const) {
      for (const quality of [1, 2, 3, 4, 5]) {
        for (const ancient of [false, true]) {
          const assets = runeVisualAssets({ slot, set, quality, ancient });
          for (const path of Object.values(assets)) {
            assert.ok(
              existsSync(new URL(`../public${path}`, import.meta.url)),
              `Missing rune asset: ${path}`,
            );
          }
        }
      }
    }
  }
});

const monster = {
  id: 'monster-1',
  name: 'Test monster',
  hp: 10_000,
  attack: 800,
  defense: 700,
  speed: 100,
  critRate: 15,
  critDamage: 50,
  resistance: 15,
  accuracy: 0,
};

function rune(
  id: string,
  slot: NormalizedRune['slot'],
  set: RuneSetName,
  stat: RuneStatKey,
  value: number,
  extras: Partial<NormalizedRune> = {},
): NormalizedRune {
  return {
    id,
    slot,
    set,
    grade: 6,
    quality: 5,
    level: 15,
    ancient: false,
    locked: false,
    location: 'inventory',
    main: { stat, value, currentValue: value },
    substats: [],
    ...extras,
  };
}

function query(overrides: Partial<OptimizerQuery> = {}): OptimizerQuery {
  return {
    monster,
    objective: 'speed',
    constraints: {},
    requiredSets: [],
    inventoryOnly: false,
    includeLocked: true,
    excludedMonsterIds: [],
    limit: 10,
    ...overrides,
  };
}

test('SWEX import sanitizes identifiers and projects main stats to +15', () => {
  const exportJson = JSON.stringify({
    command: 'HubUserLogin',
    ret_code: 0,
    session_key: 'private-session',
    wizard_info: { wizard_id: 999, wizard_name: 'Private name' },
    rune_lock_list: [{ rune_id: 987654, lock_type: 1 }],
    unit_list: [
      {
        unit_id: 123456,
        unit_master_id: 10101,
        unit_level: 40,
        class: 6,
        runes: [
          {
            rune_id: 987654,
            slot_no: 2,
            set_id: 3,
            class: 6,
            rank: 5,
            upgrade_curr: 12,
            pri_eff: [8, 31],
            prefix_eff: [0, 0],
            sec_eff: [[8, 25, 0, 0]],
          },
        ],
        artifacts: [{ rid: 555, slot: 1, rank: 4, level: 15 }],
      },
    ],
    runes: [],
    artifacts: [],
  });

  const snapshot = parseSwexJson(
    exportJson,
    new Date('2026-10-13T12:00:00.000Z'),
  );
  assert.equal(snapshot.monsters[0].id, 'monster-1');
  assert.equal(snapshot.runes[0].id, 'rune-1');
  assert.equal(snapshot.runes[0].main.currentValue, 31);
  assert.equal(snapshot.runes[0].main.value, 42);
  assert.equal(snapshot.runes[0].locked, true);
  assert.equal(snapshot.artifacts.length, 1);
  const serialized = JSON.stringify(snapshot);
  assert.doesNotMatch(
    serialized,
    /private-session|Private name|987654|123456|555/,
  );
});

test('potential stats keep current substats and add only maximum grinds', () => {
  const testRune = rune('r1', 1, 'Energy', 'hpFlat', 2448, {
    innate: { stat: 'accuracy', value: 8 },
    substats: [
      { stat: 'speed', value: 25, grind: 0, enchanted: false },
      { stat: 'hpPercent', value: 20, grind: 4, enchanted: true },
      { stat: 'critRate', value: 18, grind: 0, enchanted: false },
    ],
  });
  const vectors = runeVectors(testRune);
  assert.equal(vectors.current.speed, 25);
  assert.equal(vectors.potential.speed, 30);
  assert.equal(vectors.potential.hpPercent, 30);
  assert.equal(vectors.potential.critRate, 18);

  assert.deepEqual(runePotentialEffects(testRune), [
    {
      source: 'main',
      stat: 'hpFlat',
      value: 2448,
      baseValue: 2448,
      currentGrind: 0,
      possibleGrind: 0,
      grindable: false,
      enchanted: false,
    },
    {
      source: 'innate',
      stat: 'accuracy',
      value: 8,
      baseValue: 8,
      currentGrind: 0,
      possibleGrind: 0,
      grindable: false,
      enchanted: false,
    },
    {
      source: 'substat',
      stat: 'speed',
      value: 30,
      baseValue: 25,
      currentGrind: 0,
      possibleGrind: 5,
      grindable: true,
      enchanted: false,
    },
    {
      source: 'substat',
      stat: 'hpPercent',
      value: 30,
      baseValue: 20,
      currentGrind: 4,
      possibleGrind: 6,
      grindable: true,
      enchanted: true,
    },
    {
      source: 'substat',
      stat: 'critRate',
      value: 18,
      baseValue: 18,
      currentGrind: 0,
      possibleGrind: 0,
      grindable: false,
      enchanted: false,
    },
  ]);
});

test('Ancient runes display their higher possible grind', () => {
  const effects = runePotentialEffects(
    rune('ancient', 2, 'Swift', 'speed', 42, {
      ancient: true,
      substats: [
        { stat: 'hpPercent', value: 20, grind: 10, enchanted: false },
        { stat: 'speed', value: 26, grind: 6, enchanted: false },
      ],
    }),
  );
  assert.deepEqual(effects[1], {
    source: 'substat',
    stat: 'hpPercent',
    value: 32,
    baseValue: 20,
    currentGrind: 10,
    possibleGrind: 2,
    grindable: true,
    enchanted: false,
  });
  assert.deepEqual(effects[2], {
    source: 'substat',
    stat: 'speed',
    value: 32,
    baseValue: 26,
    currentGrind: 6,
    possibleGrind: 0,
    grindable: true,
    enchanted: false,
  });
});

test('optimizer finds the exact fastest build and applies Swift rounding', () => {
  const runes = Array.from({ length: 6 }, (_, index) =>
    rune(
      `swift-${index + 1}`,
      (index + 1) as NormalizedRune['slot'],
      index < 4 ? 'Swift' : 'Will',
      'speed',
      10 + index,
    ),
  );
  runes.push(rune('slow-slot-6', 6, 'Will', 'speed', 1));
  const result = optimizeRunes(runes, query({ requiredSets: ['Swift'] }));
  assert.equal(result.builds[0].potential.speed, 100 + 75 + 25);
  assert.ok(result.builds[0].sets.includes('Swift'));
  assert.deepEqual(result.builds[0].runeIds, [
    'swift-1',
    'swift-2',
    'swift-3',
    'swift-4',
    'swift-5',
    'swift-6',
  ]);
});

test('optimizer ranks and constrains builds using the selected projection', () => {
  const fixed = Array.from({ length: 5 }, (_, index) =>
    rune(
      `fixed-${index + 2}`,
      (index + 2) as NormalizedRune['slot'],
      'Energy',
      'hpFlat',
      0,
    ),
  );
  const runes = [
    rune('best-now', 1, 'Energy', 'speed', 30),
    rune('best-max', 1, 'Energy', 'speed', 42, {
      level: 9,
      main: { stat: 'speed', currentValue: 10, value: 42 },
    }),
    ...fixed,
  ];

  const currentResult = optimizeRunes(
    runes,
    query({
      projection: 'current',
      constraints: { speed: { min: 120 } },
      limit: 1,
    }),
  );
  assert.equal(currentResult.builds[0].runeIds[0], 'best-now');
  assert.equal(currentResult.builds[0].current.speed, 130);
  assert.equal(currentResult.builds[0].potential.speed, 130);
  assert.equal(currentResult.builds[0].objectiveValue, 130);

  const maximumResult = optimizeRunes(
    runes,
    query({ projection: 'potential', limit: 1 }),
  );
  assert.equal(maximumResult.builds[0].runeIds[0], 'best-max');
  assert.equal(maximumResult.builds[0].current.speed, 110);
  assert.equal(maximumResult.builds[0].potential.speed, 142);
  assert.equal(maximumResult.builds[0].objectiveValue, 142);
});

test('Tick validation follows the selected current or maximum values', () => {
  const runes = Array.from({ length: 6 }, (_, index) =>
    rune(
      `tick-${index + 1}`,
      (index + 1) as NormalizedRune['slot'],
      index < 4 ? 'Swift' : 'Energy',
      'hpFlat',
      0,
      {
        substats: [{ stat: 'speed', value: 26, grind: 0, enchanted: false }],
      },
    ),
  );
  const tick = {
    tick: 5 as const,
    speedTowerPercent: 0,
    leaderSkillPercent: 0,
  };

  const currentResult = optimizeRunes(
    runes,
    query({ projection: 'current', tick }),
  );
  assert.equal(currentResult.builds.length, 0);

  const maximumResult = optimizeRunes(
    runes,
    query({ projection: 'potential', tick }),
  );
  assert.equal(maximumResult.builds.length, 1);
  assert.equal(maximumResult.builds[0].current.speed, 281);
  assert.equal(maximumResult.builds[0].potential.speed, 311);
});

test('damage objective balances ATK and critical damage at 100% CR', () => {
  const runes = [
    rune('pure-attack', 1, 'Energy', 'attackFlat', 500),
    rune('balanced', 1, 'Energy', 'attackFlat', 250, {
      substats: [{ stat: 'critDamage', value: 80, grind: 0, enchanted: false }],
    }),
    rune('pure-cd', 1, 'Energy', 'critDamage', 150),
    ...Array.from({ length: 5 }, (_, index) =>
      rune(
        `fixed-${index + 2}`,
        (index + 2) as NormalizedRune['slot'],
        'Energy',
        'hpFlat',
        0,
        {
          substats: [
            { stat: 'critRate', value: 17, grind: 0, enchanted: false },
          ],
        },
      ),
    ),
  ];

  const result = optimizeRunes(
    runes,
    query({
      objective: 'damage',
      constraints: { critRate: { min: 100 } },
      limit: 1,
    }),
  );

  assert.equal(result.builds.length, 1);
  assert.equal(result.builds[0].runeIds[0], 'balanced');
  assert.equal(result.builds[0].potential.attack, 1050);
  assert.equal(result.builds[0].potential.critRate, 100);
  assert.equal(result.builds[0].potential.critDamage, 130);
  assert.equal(
    result.builds[0].objectiveValue,
    buildObjectiveValue(result.builds[0].potential, 'damage'),
  );
  assert.equal(result.builds[0].objectiveValue, 2415);
});

test('full required sets prune irrelevant Pareto candidates before searching', () => {
  const runes: NormalizedRune[] = [];
  for (let slot = 1; slot <= 6; slot += 1) {
    const normalizedSlot = slot as NormalizedRune['slot'];
    for (const set of ['Violent', 'Will'] as const) {
      runes.push(
        rune(`${set}-${slot}`, normalizedSlot, set, 'speed', 10, {
          substats: [
            { stat: 'critRate', value: 15, grind: 0, enchanted: false },
          ],
        }),
      );
    }
    for (let index = 1; index <= 30; index += 1) {
      runes.push(
        rune(
          `Blade-${slot}-${index}`,
          normalizedSlot,
          'Blade',
          'speed',
          index,
          {
            substats: [
              {
                stat: 'critRate',
                value: 31 - index,
                grind: 0,
                enchanted: false,
              },
            ],
          },
        ),
      );
    }
  }

  const result = optimizeRunes(
    runes,
    query({
      requiredSets: ['Violent', 'Will'],
      constraints: { critRate: { min: 100 } },
    }),
  );

  assert.deepEqual(result.candidatesBySlot, [2, 2, 2, 2, 2, 2]);
  assert.equal(result.builds.length, 10);
  assert.ok(result.combinationsEvaluated <= 15);
  assert.ok(
    result.builds.every(
      ({ sets, potential }) =>
        sets.includes('Violent') &&
        sets.includes('Will') &&
        potential.critRate === 100,
    ),
  );
});

test('required sets that need more than six pieces fail before searching', () => {
  const runes = Array.from({ length: 6 }, (_, index) =>
    rune(
      `r${index + 1}`,
      (index + 1) as NormalizedRune['slot'],
      'Swift',
      'speed',
      10,
    ),
  );
  const result = optimizeRunes(
    runes,
    query({ requiredSets: ['Swift', 'Violent'] }),
  );
  assert.equal(result.builds.length, 0);
  assert.equal(result.combinationsEvaluated, 0);
  assert.deepEqual(result.candidatesBySlot, [0, 0, 0, 0, 0, 0]);
});

test('one Intangible rune can complete a required four-piece set', () => {
  const sets: RuneSetName[] = [
    'Violent',
    'Violent',
    'Violent',
    'Intangible',
    'Will',
    'Will',
  ];
  const runes = sets.map((set, index) =>
    rune(
      `r${index + 1}`,
      (index + 1) as NormalizedRune['slot'],
      set,
      'speed',
      5,
    ),
  );
  const result = optimizeRunes(
    runes,
    query({ requiredSets: ['Violent', 'Will'] }),
  );
  assert.equal(result.builds.length, 1);
  assert.deepEqual(result.builds[0].sets.sort(), ['Violent', 'Will']);
});

test('constraints, locked rune filters, exclusions and Tick are enforced', () => {
  const runes = Array.from({ length: 6 }, (_, index) =>
    rune(
      `r${index + 1}`,
      (index + 1) as NormalizedRune['slot'],
      'Endure',
      'speed',
      31,
      {
        locked: index === 0,
        ...(index === 1
          ? { location: 'equipped' as const, equippedMonsterId: 'monster-2' }
          : {}),
      },
    ),
  );
  assert.equal(
    optimizeRunes(runes, query({ includeLocked: false })).builds.length,
    0,
  );
  assert.equal(
    optimizeRunes(runes, query({ excludedMonsterIds: ['monster-2'] })).builds
      .length,
    0,
  );
  const tickResult = optimizeRunes(
    runes,
    query({
      constraints: { resistance: { min: 75 } },
      tick: { tick: 5, speedTowerPercent: 0, leaderSkillPercent: 0 },
    }),
  );
  assert.equal(tickResult.builds.length, 1);
  assert.equal(tickResult.builds[0].potential.resistance, 75);
});
