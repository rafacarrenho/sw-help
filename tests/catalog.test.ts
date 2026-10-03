import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { validateCatalog } from '../src/lib/validate.ts';
import { matchesSearch } from '../src/lib/search.ts';
import {
  formatCounterSpeed,
  formatCounterStat,
  requiredCounterSpeed,
} from '../src/lib/counter-stats.ts';
import {
  catalogElementOptionsFor,
  filterMonsters,
  readMonsterFilters,
  leaderBonusText,
  leaderScopeText,
  leaderText,
  leaderSkillIcon,
  toMonsterSummary,
} from '../src/lib/monster-catalog.ts';
import {
  DEFAULT_SPEED_TICK_LEADER_VALUE,
  DEFAULT_SPEED_TICK_TOWER_PERCENT,
  SPEED_TICK_BREAKPOINTS,
  additionalSpeedPercentOptions,
  getLeaderOptions,
  getPossibleSpeedLeaders,
  readSpeedTickQueryState,
  requiredAdditionalSpeed,
  requiredAdditionalSpeedPercent,
  writeSpeedTickQueryState,
} from '../src/lib/speed-tick.ts';
import {
  applicableLeaderPercent,
  ARENA_TICK_CONSTANT,
  combatSpeed,
  DEFAULT_SPEED_TUNING_TOWER_PERCENT,
  getSiegeSpeedLeader,
  getSpeedTuningLeader,
  getSpeedTuningCapabilities,
  minimumRuneSpeedForCombat,
  RTA_TICK_CONSTANT,
  readSpeedTuningQueryState,
  speedBuffMultiplier,
  tuneFollower,
  writeSpeedTuningQueryState,
  type SpeedTuningQueryMonster,
} from '../src/lib/speed-tuning.ts';
import {
  compareStructuralSpeed,
  getSpeedComparisonLeaderPercentages,
  readSpeedComparisonQueryState,
  structuralSpeed,
  writeSpeedComparisonQueryState,
} from '../src/lib/speed-comparison.ts';
import { monsterById, defensesFor, countersFor } from '../src/data/catalog.ts';
import { games } from '../src/data/games.ts';
import { skillById } from '../src/data/skill-catalog.ts';
import {
  getMessages,
  localeMetadata,
  localeOptions,
  locales,
  routePath,
} from '../src/i18n/index.ts';
import type {
  Monster,
  MonsterSkill,
  DefenseBase,
  Counter,
  CounterBase,
} from '../src/lib/types.ts';

const read = (name: string) =>
  JSON.parse(
    readFileSync(new URL(`../src/data/${name}.json`, import.meta.url), 'utf8'),
  );
const monsters: Monster[] = read('monsters');
const skills: MonsterSkill[] = read('skills');
const defenses: DefenseBase[] = read('defenses');
const counters: CounterBase[] = read('counters');

test('cabeçalhos estáticos endurecem a entrega em produção', () => {
  const headers = readFileSync(
    new URL('../public/_headers', import.meta.url),
    'utf8',
  );

  assert.match(headers, /Content-Security-Policy:/);
  assert.match(headers, /frame-ancestors 'none'/);
  assert.match(headers, /X-Content-Type-Options: nosniff/);
  assert.match(headers, /X-Frame-Options: DENY/);
  assert.match(headers, /\/_astro\/\*/);
  assert.match(headers, /max-age=31536000, immutable/);
});

test('rotas localizadas mantêm inglês na raiz e português sob /pt', () => {
  assert.equal(routePath('portalHome', 'en'), '/');
  assert.equal(routePath('portalHome', 'pt-BR'), '/pt');
  assert.equal(routePath('home', 'en'), '/summoners-war');
  assert.equal(routePath('home', 'pt-BR'), '/pt/summoners-war');
  assert.equal(routePath('siegeCounter', 'en'), '/summoners-war/siege-counter');
  assert.equal(
    routePath('siegeCounter', 'pt-BR'),
    '/pt/summoners-war/siege-counter',
  );
  assert.equal(
    routePath('siege', 'en', { id: 'morris-eshir-orion' }),
    '/summoners-war/siege-counter/morris-eshir-orion',
  );
  assert.equal(routePath('monsters', 'en'), '/summoners-war/monsters');
  assert.equal(routePath('monsters', 'pt-BR'), '/pt/summoners-war/monstros');
  assert.equal(
    routePath('speedComparison', 'en'),
    '/summoners-war/speed-comparison',
  );
  assert.equal(
    routePath('speedComparison', 'pt-BR'),
    '/pt/summoners-war/comparador-spd',
  );
  assert.equal(
    routePath('monster', 'pt-BR', { id: 'nora' }),
    '/pt/summoners-war/monstros/nora',
  );
  assert.deepEqual(games[0].navigation[0].label, {
    en: 'Summoners War',
    'pt-BR': 'Summoners War',
  });
});

test('opções de elemento acompanham o idioma do catálogo', () => {
  assert.deepEqual(catalogElementOptionsFor('en'), [
    ['fire', 'Fire'],
    ['water', 'Water'],
    ['wind', 'Wind'],
    ['light', 'Light'],
    ['dark', 'Dark'],
  ]);
  assert.deepEqual(catalogElementOptionsFor('pt-BR'), [
    ['fire', 'Fogo'],
    ['water', 'Água'],
    ['wind', 'Vento'],
    ['light', 'Luz'],
    ['dark', 'Trevas'],
  ]);
});

test('registro de jogos mantém o menu contextual centralizado', () => {
  assert.deepEqual(
    games.map(({ id }) => id),
    ['summoners-war'],
  );
  assert.equal(games[0].homeRoute, 'home');
  assert.deepEqual(
    games[0].navigation.map(({ route }) => route),
    [
      'home',
      'siegeCounter',
      'monsters',
      'speedTuning',
      'speedComparison',
      'speedTick',
    ],
  );
});

test('conteúdo editorial tem cobertura em inglês e português', () => {
  const englishDefenses = defensesFor('en');
  const portugueseDefenses = defensesFor('pt-BR');
  const englishCounters = countersFor('en');
  const portugueseCounters = countersFor('pt-BR');

  assert.equal(englishDefenses.length, defenses.length);
  assert.equal(portugueseDefenses.length, defenses.length);
  assert.equal(englishCounters.length, counters.length);
  assert.equal(portugueseCounters.length, counters.length);
  assert.notEqual(
    englishDefenses[0].description,
    portugueseDefenses[0].description,
  );
  assert.notEqual(
    englishCounters[0].instruction,
    portugueseCounters[0].instruction,
  );
  assert.equal(getMessages('en').layout.language, 'Language');
  assert.equal(getMessages('pt-BR').layout.language, 'Idioma');
});

test('todos os locales possuem metadados para o seletor de idioma', () => {
  assert.deepEqual(
    localeOptions.map(({ locale }) => locale),
    [...locales],
  );

  for (const locale of locales) {
    assert.ok(localeMetadata[locale].label);
    assert.ok(localeMetadata[locale].flag);
    assert.match(localeMetadata[locale].abbreviation, /^[A-Z]{2,3}$/);
  }
});

test('Comparador de SPD descobre todas as lideranças sem filtrar conteúdo', () => {
  assert.deepEqual(
    getSpeedComparisonLeaderPercentages(monsters),
    [0, 10, 15, 16, 17, 19, 20, 21, 23, 24, 28, 30, 33],
  );
});

test('Comparador de SPD calcula vantagem estrutural e folga estrita', () => {
  const adriana = {
    baseSpeed: 111,
    leaderPercent: 24,
    towerPercent: 15,
    usesSwift: true,
  };
  const triton = {
    baseSpeed: 116,
    leaderPercent: 0,
    towerPercent: 15,
    usesSwift: true,
  };

  assert.equal(structuralSpeed(adriana), 183);
  assert.equal(structuralSpeed(triton), 163);
  assert.equal(
    structuralSpeed({
      baseSpeed: 101,
      leaderPercent: 0,
      towerPercent: 15,
      usesSwift: true,
      passiveSpeedBonus: 40,
    }),
    182,
  );
  assert.deepEqual(compareStructuralSpeed(adriana, triton), {
    allySpeed: 183,
    enemySpeed: 163,
    winner: 'ally',
    advantage: 20,
    strictRuneTolerance: 19,
  });
  assert.equal(
    compareStructuralSpeed(
      { ...adriana, leaderPercent: 0, towerPercent: 0, usesSwift: false },
      { ...adriana, leaderPercent: 0, towerPercent: 0, usesSwift: false },
    )?.winner,
    'tie',
  );
  assert.equal(
    compareStructuralSpeed(
      { ...adriana, leaderPercent: 0, towerPercent: 0, usesSwift: false },
      triton,
    )?.winner,
    'enemy',
  );
});

test('Comparador de SPD normaliza e serializa estado compartilhável', () => {
  const comparisonMonsters = new Map([
    [
      'adriana-water-2021',
      { id: 'adriana-water-2021', element: 'water' as const, speed: 111 },
    ],
    [
      'triton-wind-847',
      { id: 'triton-wind-847', element: 'wind' as const, speed: 116 },
    ],
    [
      'chilling-water-958',
      { id: 'chilling-water-958', element: 'water' as const, speed: 101 },
    ],
  ]);
  const state = readSpeedComparisonQueryState(
    new URLSearchParams(
      'mode=arena&ally=adriana-water-2021&allyLeader=24&allySwift=1&allyTower=14&enemy=triton-wind-847&enemyLeader=999&enemySwift=0&enemyTower=99',
    ),
    comparisonMonsters,
    monsters,
  );

  assert.deepEqual(state, {
    ally: {
      monsterId: 'adriana-water-2021',
      leaderPercent: 24,
      towerPercent: 14,
      usesSwift: true,
      initialBuffs: 0,
    },
    enemy: {
      monsterId: 'triton-wind-847',
      leaderPercent: 0,
      towerPercent: 15,
      usesSwift: false,
      initialBuffs: 0,
    },
  });
  assert.equal(
    writeSpeedComparisonQueryState(
      new URLSearchParams('utm_source=share&ally=old'),
      state,
    ).toString(),
    'utm_source=share&ally=adriana-water-2021&allyLeader=24&allyTower=14&enemy=triton-wind-847&enemySwift=0',
  );

  const chillingState = readSpeedComparisonQueryState(
    new URLSearchParams(
      'ally=chilling-water-958&allyStartBuffs=1&enemy=triton-wind-847&enemyStartBuffs=1',
    ),
    comparisonMonsters,
    monsters,
  );
  assert.equal(chillingState.ally.initialBuffs, 1);
  assert.equal(chillingState.enemy.initialBuffs, 0);
  assert.equal(
    writeSpeedComparisonQueryState(
      new URLSearchParams('allyStartBuffs=9&enemyStartBuffs=1'),
      chillingState,
    ).toString(),
    'ally=chilling-water-958&allyStartBuffs=1&enemy=triton-wind-847',
  );

  const defaultChillingState = readSpeedComparisonQueryState(
    new URLSearchParams('ally=chilling-water-958&allyStartBuffs=9'),
    comparisonMonsters,
    monsters,
  );
  assert.equal(defaultChillingState.ally.initialBuffs, 2);
  assert.equal(
    writeSpeedComparisonQueryState(
      new URLSearchParams('allyStartBuffs=9'),
      defaultChillingState,
    ).toString(),
    'ally=chilling-water-958',
  );
});

test('tickbreaks e cálculo de velocidade respeitam os valores do jogo', () => {
  assert.deepEqual(
    SPEED_TICK_BREAKPOINTS.filter((tick) => [4, 5, 6].includes(tick.tick)).map(
      (tick) => [tick.tick, tick.minimumSpeed],
    ),
    [
      [4, 358],
      [5, 286],
      [6, 239],
    ],
  );
  assert.deepEqual(
    additionalSpeedPercentOptions,
    [5, 10, 15, 20, 25, 30, 50, 100],
  );
  assert.ok(
    Math.abs(
      requiredAdditionalSpeedPercent({
        baseSpeed: 150,
        leaderPercent: 15,
        activeAdditionalPercent: 0,
        targetTick: 5,
      }) - 75.66666666666666,
    ) < 1e-9,
  );
  assert.deepEqual(
    getLeaderOptions({
      leaderSkill: {
        attribute: 'Attack Speed',
        amount: 15,
        area: 'Arena',
        element: null,
      },
    } as any),
    [
      { label: 'Sem líder', value: 0 },
      { label: 'SPD +15% · Arena', value: 15 },
    ],
  );
  assert.deepEqual(
    getPossibleSpeedLeaders(monsters).map((leader) => leader.value),
    [0, 10, 15, 16, 17, 19, 20, 21, 23, 24, 28, 30, 33],
  );
  assert.deepEqual(
    getPossibleSpeedLeaders(monsters).map((leader) => leader.label),
    [
      '0%',
      '10%',
      '15%',
      '16%',
      '17%',
      '19%',
      '20%',
      '21%',
      '23%',
      '24%',
      '28%',
      '30%',
      '33%',
    ],
  );
  assert.equal(
    requiredAdditionalSpeed({
      baseSpeed: 100,
      leaderPercent: 0,
      activeAdditionalPercent: 15,
      minimumSpeed: 239,
    }),
    124,
  );
  assert.equal(
    requiredAdditionalSpeed({
      baseSpeed: 100,
      leaderPercent: 33,
      activeAdditionalPercent: 15,
      minimumSpeed: 239,
    }),
    91,
  );
  assert.deepEqual(
    SPEED_TICK_BREAKPOINTS.map(({ minimumSpeed }) =>
      requiredAdditionalSpeed({
        baseSpeed: 102,
        leaderPercent: 0,
        activeAdditionalPercent: 15,
        minimumSpeed,
      }),
    ),
    [359, 240, 168, 121, 87, 61, 41, 25, 12],
  );
  assert.deepEqual(
    SPEED_TICK_BREAKPOINTS.map(({ minimumSpeed }) =>
      requiredAdditionalSpeed({
        baseSpeed: 102,
        leaderPercent: 0,
        activeAdditionalPercent: 15,
        minimumSpeed,
        usesSwift: true,
      }),
    ),
    [360, 241, 169, 122, 88, 62, 42, 26, 13],
  );
  assert.equal(
    requiredAdditionalSpeed({
      baseSpeed: 0,
      leaderPercent: 33,
      activeAdditionalPercent: 15,
      minimumSpeed: 239,
    }),
    null,
  );
  assert.deepEqual(
    getSpeedTuningLeader(
      {
        leaderSkill: {
          attribute: 'Attack Speed',
          amount: 33,
          area: 'Arena',
          element: null,
        },
      },
      'rta',
    ),
    { amount: 33, area: 'Arena', element: null },
  );
  assert.equal(
    getSpeedTuningLeader(
      {
        leaderSkill: {
          attribute: 'Attack Speed',
          amount: 28,
          area: 'Guild',
          element: null,
        },
      },
      'arena',
    ),
    null,
  );
});

test('Speed Tuning normaliza boosts, buffs e lideranças de Siege', () => {
  assert.deepEqual(
    getSpeedTuningCapabilities(monsterById.get('bernard-wind-368')!, skillById),
    {
      atbBoost: {
        percent: 30,
        defaultPercent: 30,
        conditional: false,
        scope: 'team',
        skillId: 418,
        skillName: 'Tailwind',
      },
      speedBuff: {
        scope: 'team',
        skillId: 418,
        skillName: 'Tailwind',
      },
    },
  );
  assert.deepEqual(
    getSpeedTuningCapabilities(monsterById.get('konamiya-water-56')!, skillById)
      .atbBoost,
    {
      percent: 100,
      defaultPercent: 100,
      conditional: false,
      scope: 'single',
      skillId: 81,
      skillName: 'Resurge',
    },
  );
  assert.deepEqual(
    getSpeedTuningCapabilities(monsterById.get('dova-light-981')!, skillById),
    {
      atbBoost: {
        percent: 15,
        defaultPercent: 15,
        conditional: false,
        scope: 'single',
        skillId: 1426,
        skillName: 'Breeze',
      },
      speedBuff: {
        scope: 'single',
        skillId: 1429,
        skillName: "Rabbit's Agility",
      },
    },
  );
  assert.deepEqual(
    getSpeedTuningCapabilities(
      monsterById.get('adriana-water-2021')!,
      skillById,
    ).speedBuff,
    {
      scope: 'team',
      skillId: 3459,
      skillName: 'Determination of Dessert Kingdom',
    },
  );
  assert.deepEqual(
    getSpeedTuningCapabilities(
      monsterById.get('chilling-water-958')!,
      skillById,
    ).speedBuff,
    {
      scope: 'team',
      skillId: 1394,
      skillName: 'Song of the Night Wind',
    },
  );
  assert.equal(
    getSpeedTuningCapabilities(monsterById.get('clara')!, skillById).speedBuff,
    null,
  );
  assert.deepEqual(
    getSpeedTuningCapabilities(
      monsterById.get('belladeon-light-1299')!,
      skillById,
    ).atbBoost,
    {
      percent: 30,
      defaultPercent: 30,
      conditional: false,
      scope: 'team',
      skillId: 2221,
      skillName: 'Mobilize',
    },
  );
  assert.deepEqual(
    getSpeedTuningCapabilities(monsterById.get('mihyang-water-613')!, skillById)
      .atbBoost,
    {
      percent: 15,
      defaultPercent: 0,
      conditional: true,
      scope: 'team',
      skillId: 3997,
      skillName: 'Blade Fan',
    },
  );
  assert.deepEqual(
    getSpeedTuningCapabilities(
      monsterById.get('yeonhong-light-721')!,
      skillById,
    ).atbBoost,
    {
      percent: 15,
      defaultPercent: 0,
      conditional: true,
      scope: 'team',
      skillId: 925,
      skillName: 'Blade Fan',
    },
  );
  assert.deepEqual(
    getSpeedTuningCapabilities(monsterById.get('woonsa-dark-786')!, skillById)
      .atbBoost,
    {
      percent: 20,
      defaultPercent: 10,
      conditional: true,
      scope: 'team',
      skillId: 1200,
      skillName: 'Inhale Magic',
    },
  );
  assert.deepEqual(
    getSpeedTuningCapabilities(monsterById.get('wedjat-light-931')!, skillById)
      .atbBoost,
    {
      percent: 30,
      defaultPercent: 10,
      conditional: true,
      scope: 'team',
      skillId: 1355,
      skillName: 'Duty of the Monarch(Passive)',
    },
  );
  assert.deepEqual(
    getSpeedTuningCapabilities(monsterById.get('ragdoll-dark-770')!, skillById)
      .atbBoost,
    {
      percent: 10,
      defaultPercent: 0,
      conditional: true,
      scope: 'team',
      skillId: 1098,
      skillName: 'Tooth For a Tooth (Passive)',
    },
  );

  const generalLeader = getSiegeSpeedLeader({
    leaderSkill: {
      attribute: 'Attack Speed',
      amount: 19,
      area: 'General',
      element: null,
    },
  });
  assert.equal(applicableLeaderPercent(generalLeader, 'wind'), 19);
  const elementalLeader = getSiegeSpeedLeader({
    leaderSkill: {
      attribute: 'Attack Speed',
      amount: 30,
      area: 'Element',
      element: 'fire',
    },
  });
  assert.equal(applicableLeaderPercent(elementalLeader, 'fire'), 30);
  assert.equal(applicableLeaderPercent(elementalLeader, 'water'), 0);
  assert.equal(
    getSiegeSpeedLeader({
      leaderSkill: {
        attribute: 'Attack Speed',
        amount: 33,
        area: 'Arena',
        element: null,
      },
    }),
    null,
  );
});

test('Speed Tuning calcula SPD de combate e seguidores com boosts', () => {
  assert.equal(speedBuffMultiplier(0)?.toFixed(3), '1.300');
  assert.equal(speedBuffMultiplier(0, 35)?.toFixed(3), '1.405');
  assert.equal(speedBuffMultiplier(20)?.toFixed(3), '1.360');
  assert.equal(speedBuffMultiplier(20, 35)?.toFixed(3), '1.465');

  assert.equal(
    combatSpeed({
      baseSpeed: 102,
      runeSpeed: 168,
      towerPercent: 15,
      leaderPercent: 0,
      usesSwift: false,
    }),
    286,
  );
  assert.equal(
    combatSpeed({
      baseSpeed: 102,
      runeSpeed: 169,
      towerPercent: 15,
      leaderPercent: 0,
      usesSwift: true,
    }),
    286,
  );
  assert.equal(
    minimumRuneSpeedForCombat(286, {
      baseSpeed: 102,
      towerPercent: 15,
      leaderPercent: 0,
      usesSwift: true,
    }),
    169,
  );
  assert.equal(
    combatSpeed({
      baseSpeed: 101,
      runeSpeed: 0,
      towerPercent: 15,
      leaderPercent: 0,
      usesSwift: false,
      passiveSpeedBonus: 0,
    }),
    117,
  );
  assert.equal(
    combatSpeed({
      baseSpeed: 101,
      runeSpeed: 0,
      towerPercent: 15,
      leaderPercent: 0,
      usesSwift: false,
      passiveSpeedBonus: 20,
    }),
    137,
  );
  assert.equal(
    combatSpeed({
      baseSpeed: 101,
      runeSpeed: 0,
      towerPercent: 15,
      leaderPercent: 0,
      usesSwift: false,
      passiveSpeedBonus: 40,
    }),
    157,
  );

  assert.deepEqual(
    tuneFollower({
      anchorCombatSpeed: 300,
      iteration: 1,
      accumulatedAtbBoost: 0,
      speedBuffStartIteration: null,
      artifactSpeedIncrease: 0,
      baseSpeed: 100,
      towerPercent: 15,
      leaderPercent: 0,
      usesSwift: false,
    }),
    { runeSpeed: 186, combatSpeed: 301, minimumCombatSpeed: 301 },
  );
  assert.deepEqual(
    tuneFollower({
      anchorCombatSpeed: 300,
      iteration: 1,
      accumulatedAtbBoost: 0,
      speedBuffStartIteration: null,
      artifactSpeedIncrease: 0,
      baseSpeed: 101,
      towerPercent: 15,
      leaderPercent: 0,
      usesSwift: false,
      passiveSpeedBonus: 40,
    }),
    { runeSpeed: 144, combatSpeed: 301, minimumCombatSpeed: 301 },
  );
  assert.deepEqual(
    tuneFollower({
      anchorCombatSpeed: 300,
      iteration: 1,
      accumulatedAtbBoost: 30,
      speedBuffStartIteration: 1,
      artifactSpeedIncrease: 0,
      baseSpeed: 100,
      towerPercent: 15,
      leaderPercent: 0,
      usesSwift: false,
    }),
    { runeSpeed: 103, combatSpeed: 218, minimumCombatSpeed: 218 },
  );
  assert.deepEqual(
    tuneFollower({
      anchorCombatSpeed: 300,
      iteration: 2,
      accumulatedAtbBoost: 30,
      speedBuffStartIteration: 1,
      artifactSpeedIncrease: 20,
      baseSpeed: 100,
      towerPercent: 15,
      leaderPercent: 0,
      usesSwift: false,
    }),
    { runeSpeed: 102, combatSpeed: 217, minimumCombatSpeed: 217 },
  );
  assert.deepEqual(
    tuneFollower({
      anchorCombatSpeed: 300,
      iteration: 1,
      accumulatedAtbBoost: 30,
      speedBuffStartIteration: 1,
      artifactSpeedIncrease: 0,
      teamSpeedBuffIncrease: 35,
      baseSpeed: 100,
      towerPercent: 15,
      leaderPercent: 0,
      usesSwift: false,
    }),
    { runeSpeed: 100, combatSpeed: 215, minimumCombatSpeed: 215 },
  );
  assert.deepEqual(
    tuneFollower({
      anchorCombatSpeed: 300,
      iteration: 2,
      accumulatedAtbBoost: 30,
      speedBuffStartIteration: 1,
      artifactSpeedIncrease: 20,
      teamSpeedBuffIncrease: 35,
      baseSpeed: 100,
      towerPercent: 15,
      leaderPercent: 0,
      usesSwift: false,
    }),
    { runeSpeed: 96, combatSpeed: 211, minimumCombatSpeed: 211 },
  );
  assert.deepEqual(
    tuneFollower({
      anchorCombatSpeed: 300,
      iteration: 1,
      accumulatedAtbBoost: 0,
      speedBuffStartIteration: null,
      artifactSpeedIncrease: 0,
      teamSpeedBuffIncrease: 35,
      baseSpeed: 100,
      towerPercent: 15,
      leaderPercent: 0,
      usesSwift: false,
    }),
    { runeSpeed: 186, combatSpeed: 301, minimumCombatSpeed: 301 },
  );

  const kabillaCombatSpeed = combatSpeed({
    baseSpeed: 120,
    runeSpeed: 230,
    towerPercent: 15,
    leaderPercent: 19,
    usesSwift: true,
  });
  assert.equal(kabillaCombatSpeed, 391);
  const talisman = tuneFollower({
    anchorCombatSpeed: kabillaCombatSpeed!,
    iteration: 2,
    accumulatedAtbBoost: 30,
    speedBuffStartIteration: null,
    artifactSpeedIncrease: 0,
    baseSpeed: 105,
    towerPercent: 15,
    leaderPercent: 19,
    usesSwift: true,
  });
  assert.deepEqual(talisman, {
    runeSpeed: 180,
    combatSpeed: 320,
    minimumCombatSpeed: 320,
  });
  assert.equal(
    minimumRuneSpeedForCombat(talisman!.combatSpeed, {
      baseSpeed: 106,
      towerPercent: 15,
      leaderPercent: 19,
      usesSwift: true,
    }),
    178,
  );
});

test('Speed Tuning usa ticks de Arena e RTA nas quatro posições', () => {
  const baseInput = {
    anchorCombatSpeed: 300,
    accumulatedAtbBoost: 30,
    speedBuffStartIteration: null,
    artifactSpeedIncrease: 0,
    baseSpeed: 100,
    towerPercent: 15,
    leaderPercent: 0,
    usesSwift: false,
  };

  assert.deepEqual(
    tuneFollower({
      ...baseInput,
      iteration: 3,
      tickConstant: ARENA_TICK_CONSTANT,
    }),
    { runeSpeed: 132, combatSpeed: 247, minimumCombatSpeed: 247 },
  );
  assert.deepEqual(
    tuneFollower({
      ...baseInput,
      iteration: 3,
      tickConstant: RTA_TICK_CONSTANT,
    }),
    { runeSpeed: 109, combatSpeed: 224, minimumCombatSpeed: 224 },
  );
});

test('query params do Speed Tick preservam e restauram filtros válidos', () => {
  const validation = {
    monsterIds: new Set(['anne-fire-181', 'nora']),
    leaderPercentages: [0, 10, 24, 33],
  };
  const defaults = readSpeedTickQueryState(new URLSearchParams(), validation);
  assert.deepEqual(defaults, {
    monsterId: null,
    towerPercent: DEFAULT_SPEED_TICK_TOWER_PERCENT,
    leaderValue: DEFAULT_SPEED_TICK_LEADER_VALUE,
    usesSwift: false,
  });

  const completeParams = new URLSearchParams(
    'monster=anne-fire-181&tower=0&leader=24&swift=1&utm_source=share',
  );
  const completeState = readSpeedTickQueryState(completeParams, validation);
  assert.deepEqual(completeState, {
    monsterId: 'anne-fire-181',
    towerPercent: 0,
    leaderValue: '24',
    usesSwift: true,
  });
  assert.equal(
    writeSpeedTickQueryState(completeParams, completeState).toString(),
    completeParams.toString(),
  );

  const invalidParams = new URLSearchParams(
    'monster=missing&tower=99&leader=999&swift=true&utm_source=share',
  );
  const invalidState = readSpeedTickQueryState(invalidParams, validation);
  assert.deepEqual(invalidState, defaults);
  assert.equal(
    writeSpeedTickQueryState(invalidParams, invalidState).toString(),
    'utm_source=share',
  );
});

test('query params do Speed Tuning preservam e restauram todo o time', () => {
  const queryMonsters = new Map<string, SpeedTuningQueryMonster>([
    [
      'kabilla-light-430',
      {
        defaultBoostPercent: 30,
        defaultInitialBuffs: null,
        hasSpeedBuff: false,
        hasTargetEffect: false,
        leaderAmount: null,
      },
    ],
    [
      'gemini-light-657',
      {
        defaultBoostPercent: null,
        defaultInitialBuffs: null,
        hasSpeedBuff: false,
        hasTargetEffect: false,
        leaderAmount: 19,
      },
    ],
    [
      'talisman-light-1680',
      {
        defaultBoostPercent: null,
        defaultInitialBuffs: null,
        hasSpeedBuff: false,
        hasTargetEffect: false,
        leaderAmount: null,
      },
    ],
  ]);
  const params = new URLSearchParams(
    'utm_source=share&tower=0&m1=kabilla-light-430&r1=230&swift1=1&boost1=0&m2=gemini-light-657&leader=2&artifact2=15&m3=talisman-light-1680&swift3=1',
  );
  const state = readSpeedTuningQueryState(params, queryMonsters);

  assert.deepEqual(state, {
    mode: 'siege',
    towerPercent: 0,
    activeLeaderIndex: 1,
    slots: [
      {
        monsterId: 'kabilla-light-430',
        runeSpeed: 230,
        usesSwift: true,
        boostPercent: 0,
        speedBuffEnabled: false,
        targetIndex: 1,
        artifactPercent: 0,
        initialBuffs: 0,
      },
      {
        monsterId: 'gemini-light-657',
        runeSpeed: 0,
        usesSwift: false,
        boostPercent: 0,
        speedBuffEnabled: false,
        targetIndex: 2,
        artifactPercent: 15,
        initialBuffs: 0,
      },
      {
        monsterId: 'talisman-light-1680',
        runeSpeed: 0,
        usesSwift: true,
        boostPercent: 0,
        speedBuffEnabled: false,
        targetIndex: 2,
        artifactPercent: 0,
        initialBuffs: 0,
      },
      {
        monsterId: null,
        runeSpeed: 0,
        usesSwift: false,
        boostPercent: 0,
        speedBuffEnabled: false,
        targetIndex: 2,
        artifactPercent: 0,
        initialBuffs: 0,
      },
    ],
  });
  assert.deepEqual(
    Object.fromEntries(
      writeSpeedTuningQueryState(params, state, queryMonsters),
    ),
    Object.fromEntries(params),
  );
});

test('query params do Speed Tuning normalizam valores inválidos e padrões', () => {
  const queryMonsters = new Map<string, SpeedTuningQueryMonster>([
    [
      'bernard',
      {
        defaultBoostPercent: 30,
        defaultInitialBuffs: null,
        hasSpeedBuff: true,
        hasTargetEffect: false,
        leaderAmount: null,
      },
    ],
    [
      'konamiya',
      {
        defaultBoostPercent: 100,
        defaultInitialBuffs: null,
        hasSpeedBuff: false,
        hasTargetEffect: true,
        leaderAmount: null,
      },
    ],
    [
      'clara',
      {
        defaultBoostPercent: 20,
        defaultInitialBuffs: null,
        hasSpeedBuff: false,
        hasTargetEffect: false,
        leaderAmount: 19,
      },
    ],
  ]);
  const invalid = new URLSearchParams(
    'utm_source=share&tower=99&m1=missing&r1=9999&swift1=true&boost1=12&m2=konamiya&target2=1&artifact2=999&m3=clara&leader=2&buff3=0',
  );
  const state = readSpeedTuningQueryState(invalid, queryMonsters);

  assert.equal(state.towerPercent, DEFAULT_SPEED_TUNING_TOWER_PERCENT);
  assert.equal(state.slots[0]?.monsterId, null);
  assert.equal(state.slots[1]?.targetIndex, 2);
  assert.equal(state.slots[1]?.artifactPercent, 100);
  assert.equal(state.activeLeaderIndex, 2);
  assert.equal(
    writeSpeedTuningQueryState(invalid, state, queryMonsters).toString(),
    'utm_source=share&m2=konamiya&artifact2=100&m3=clara&leader=3',
  );

  const defaults = readSpeedTuningQueryState(
    new URLSearchParams('m1=bernard&m2=konamiya&target1=3'),
    queryMonsters,
  );
  assert.equal(defaults.slots[0]?.boostPercent, 30);
  assert.equal(defaults.slots[0]?.speedBuffEnabled, true);
  assert.equal(defaults.slots[0]?.targetIndex, 1);
  assert.equal(defaults.slots[1]?.boostPercent, 100);
  assert.equal(defaults.slots[1]?.targetIndex, 2);
  assert.equal(
    writeSpeedTuningQueryState(
      new URLSearchParams('m1=bernard&m2=konamiya&target1=3'),
      defaults,
      queryMonsters,
    ).toString(),
    'm1=bernard&m2=konamiya',
  );
});

test('query params do Speed Tuning usam padrões conservadores de boost', () => {
  const queryMonsters = new Map<string, SpeedTuningQueryMonster>([
    [
      'mihyang',
      {
        defaultBoostPercent: 0,
        defaultInitialBuffs: null,
        hasSpeedBuff: false,
        hasTargetEffect: false,
        leaderAmount: null,
      },
    ],
    [
      'woonsa',
      {
        defaultBoostPercent: 10,
        defaultInitialBuffs: null,
        hasSpeedBuff: false,
        hasTargetEffect: false,
        leaderAmount: null,
      },
    ],
    [
      'follower',
      {
        defaultBoostPercent: null,
        defaultInitialBuffs: null,
        hasSpeedBuff: false,
        hasTargetEffect: false,
        leaderAmount: null,
      },
    ],
  ]);
  const params = new URLSearchParams('m1=mihyang&m2=woonsa&m3=follower');
  const defaults = readSpeedTuningQueryState(params, queryMonsters);

  assert.equal(defaults.slots[0]?.boostPercent, 0);
  assert.equal(defaults.slots[1]?.boostPercent, 10);
  assert.equal(
    writeSpeedTuningQueryState(params, defaults, queryMonsters).toString(),
    params.toString(),
  );

  defaults.slots[0]!.boostPercent = 15;
  defaults.slots[1]!.boostPercent = 20;
  assert.equal(
    writeSpeedTuningQueryState(params, defaults, queryMonsters).toString(),
    'm1=mihyang&boost1=15&m2=woonsa&boost2=20&m3=follower',
  );
});

test('query params do Speed Tuning suportam quatro monstros e líderes por modo', () => {
  const queryMonsters = new Map<string, SpeedTuningQueryMonster>([
    [
      'guild-leader',
      {
        defaultBoostPercent: null,
        defaultInitialBuffs: null,
        hasSpeedBuff: false,
        hasTargetEffect: false,
        leaderAmount: 28,
        leaderArea: 'Guild',
      },
    ],
    [
      'arena-leader',
      {
        defaultBoostPercent: null,
        defaultInitialBuffs: null,
        hasSpeedBuff: false,
        hasTargetEffect: false,
        leaderAmount: 33,
        leaderArea: 'Arena',
      },
    ],
    [
      'single-booster',
      {
        defaultBoostPercent: 100,
        defaultInitialBuffs: null,
        hasSpeedBuff: false,
        hasTargetEffect: true,
        leaderAmount: null,
      },
    ],
    [
      'follower',
      {
        defaultBoostPercent: null,
        defaultInitialBuffs: null,
        hasSpeedBuff: false,
        hasTargetEffect: false,
        leaderAmount: null,
      },
    ],
  ]);
  const params = new URLSearchParams(
    'mode=rta&m1=guild-leader&m2=arena-leader&leader=1&m3=single-booster&target3=4&m4=follower',
  );
  const state = readSpeedTuningQueryState(params, queryMonsters);

  assert.equal(state.mode, 'rta');
  assert.equal(state.slots.length, 4);
  assert.equal(state.slots[3]?.monsterId, 'follower');
  assert.equal(state.slots[2]?.targetIndex, 3);
  assert.equal(state.activeLeaderIndex, 1);
  assert.equal(
    writeSpeedTuningQueryState(params, state, queryMonsters).toString(),
    'mode=rta&m1=guild-leader&m2=arena-leader&m3=single-booster&m4=follower&leader=2',
  );

  const invalidMode = readSpeedTuningQueryState(
    new URLSearchParams('mode=unknown&m1=guild-leader&m4=follower'),
    queryMonsters,
  );
  assert.equal(invalidMode.mode, 'siege');
  assert.equal(invalidMode.slots[3]?.monsterId, null);
});

test('query params preservam os buffs iniciais exclusivos do Chilling', () => {
  const queryMonsters = new Map<string, SpeedTuningQueryMonster>([
    [
      'chilling-water-958',
      {
        defaultBoostPercent: null,
        defaultInitialBuffs: 2,
        hasSpeedBuff: true,
        hasTargetEffect: false,
        leaderAmount: null,
      },
    ],
    [
      'bernard-wind-1579',
      {
        defaultBoostPercent: 30,
        defaultInitialBuffs: null,
        hasSpeedBuff: true,
        hasTargetEffect: false,
        leaderAmount: null,
      },
    ],
  ]);
  const shared = new URLSearchParams(
    'm1=chilling-water-958&startBuffs1=1&m2=bernard-wind-1579&startBuffs2=1',
  );
  const sharedState = readSpeedTuningQueryState(shared, queryMonsters);

  assert.equal(sharedState.slots[0]?.initialBuffs, 1);
  assert.equal(sharedState.slots[1]?.initialBuffs, 0);
  assert.equal(
    writeSpeedTuningQueryState(shared, sharedState, queryMonsters).toString(),
    'm1=chilling-water-958&startBuffs1=1&m2=bernard-wind-1579',
  );

  const invalidState = readSpeedTuningQueryState(
    new URLSearchParams('m1=chilling-water-958&startBuffs1=9'),
    queryMonsters,
  );
  assert.equal(invalidState.slots[0]?.initialBuffs, 2);
  assert.equal(
    writeSpeedTuningQueryState(
      new URLSearchParams('m1=chilling-water-958&startBuffs1=9'),
      invalidState,
      queryMonsters,
    ).toString(),
    'm1=chilling-water-958',
  );

  const zeroState = readSpeedTuningQueryState(
    new URLSearchParams('m3=chilling-water-958&startBuffs3=0'),
    queryMonsters,
  );
  assert.equal(zeroState.slots[2]?.initialBuffs, 0);
  assert.equal(
    writeSpeedTuningQueryState(
      new URLSearchParams('m3=chilling-water-958&startBuffs3=0'),
      zeroState,
      queryMonsters,
    ).toString(),
    'm3=chilling-water-958&startBuffs3=0',
  );
});

test('importação completa mantém IDs do Siege, formas e líderes da fonte', () => {
  assert.equal(monsters.length, read('monsters-meta').count);
  assert.ok(monsters.length > 1900);
  const nora = monsters.find((m) => m.id === 'nora')!;
  assert.equal(nora.swarfarmId, 1877);
  assert.equal(nora.family, 'Totemist');
  assert.ok(monsters.some((m) => m.awakenLevel === 2));
  assert.ok(monsters.some((m) => m.obtainable === false));
  for (const monster of monsters) {
    assert.ok(monster.swarfarmId);
    assert.ok(monster.family);
    assert.ok(
      monster.image ||
        read('monsters-meta').missingPortraits.includes(monster.imageSource),
    );
  }
});
test('catálogo preserva atributos, habilidades e origens sem pesar o índice', () => {
  const carcano = monsters.find((monster) => monster.id === 'carcano')!;
  assert.deepEqual(carcano.maxLevelStats, {
    hp: 9225,
    attack: 758,
    defense: 604,
    critRate: 15,
    critDamage: 50,
    resistance: 15,
    accuracy: 0,
  });
  assert.deepEqual(carcano.skillIds, [2098, 2103, 2108]);
  assert.equal(carcano.skillUpsToMax, 9);
  assert.ok(carcano.sources?.some((source) => source.name === 'Fire Scroll'));
  assert.ok(
    carcano.skillIds?.every((id) => skills.some((skill) => skill.id === id)),
  );

  const summary = toMonsterSummary(carcano);
  assert.deepEqual(summary.sortStats, {
    hp: 9225,
    attack: 758,
    defense: 604,
  });
  assert.equal('maxLevelStats' in summary, false);
  assert.equal('skillIds' in summary, false);
  assert.equal('sources' in summary, false);
});
test('busca de monstros combina família, elemento, estrelas, forma e líder', () => {
  const find = (query: string) =>
    filterMonsters(monsters, readMonsterFilters(new URLSearchParams(query)));
  const totemists = find('q=tótemist&element=fire&stars=5&form=1');
  assert.ok(totemists.some((m) => m.id === 'nora'));
  assert.ok(
    totemists.every((m) => m.element === 'fire' && m.awakenLevel === 1),
  );
  const leaders = find('leader=Attack+Speed&sort=speed');
  assert.ok(leaders.length > 0);
  assert.ok(leaders.every((m) => m.leaderSkill?.attribute === 'Attack Speed'));
  assert.ok(
    leaders.every((m, i) => i === 0 || leaders[i - 1].speed! >= m.speed!),
  );
  assert.ok(find('leader=none').every((m) => !m.leaderSkill));
  const globalArena = find('leaderScope=global-arena');
  assert.ok(globalArena.length > 0);
  assert.ok(
    globalArena.every(
      (m) =>
        !m.leaderSkill?.element &&
        ['General', 'Arena'].includes(m.leaderSkill?.area ?? ''),
    ),
  );
  assert.deepEqual(
    new Set(globalArena.map((m) => m.leaderSkill?.area)),
    new Set(['General', 'Arena']),
  );
  const globalGuild = find('leaderScope=global-guild');
  assert.ok(
    globalGuild.every(
      (m) =>
        !m.leaderSkill?.element &&
        ['General', 'Guild', 'Guild Battle'].includes(
          m.leaderSkill?.area ?? '',
        ),
    ),
  );
  assert.deepEqual(
    new Set(globalGuild.map((m) => m.leaderSkill?.area)),
    new Set(['General', 'Guild']),
  );
  const arenaSpeedLeaders = find('leader=Attack+Speed&leaderScope=arena');
  assert.ok(arenaSpeedLeaders.length > 0);
  assert.ok(
    arenaSpeedLeaders.every(
      (m) =>
        m.leaderSkill?.attribute === 'Attack Speed' &&
        m.leaderSkill.area === 'Arena',
    ),
  );
  const elementLeaders = find('leaderScope=element');
  assert.ok(elementLeaders.length > 0);
  assert.ok(elementLeaders.every((m) => m.leaderSkill?.element));
  assert.equal(find('availability=all').length, find('').length);
  assert.ok(find('').every((m) => m.obtainable));
  assert.equal(find('q=naoexiste123456').length, 0);
  assert.equal(
    leaderText({
      attribute: 'Attack Speed',
      amount: 33,
      area: 'Arena',
      element: null,
    }),
    'SPD +33% · Arena',
  );
  assert.equal(
    leaderText({
      attribute: 'HP',
      amount: 50,
      area: 'Element',
      element: 'water',
    }),
    'HP +50% · Aliados de Água',
  );
  assert.equal(
    readMonsterFilters(new URLSearchParams('element=invalid&form=999')).element,
    '',
  );
  assert.equal(
    readMonsterFilters(new URLSearchParams('element=pure')).element,
    '',
  );
  assert.equal(
    readMonsterFilters(new URLSearchParams('leaderScope=invalid')).leaderScope,
    '',
  );
});
test('catálogo ordena os atributos máximos do maior para o menor', () => {
  const summaries = monsters.map(toMonsterSummary);
  for (const sort of ['hp', 'attack', 'defense'] as const) {
    const ordered = filterMonsters(
      summaries,
      readMonsterFilters(new URLSearchParams(`sort=${sort}`)),
    );
    assert.ok(ordered.length > 0);
    assert.ok(
      ordered.every(
        (monster, index) =>
          index === 0 ||
          (ordered[index - 1].sortStats?.[sort] ?? 0) >=
            (monster.sortStats?.[sort] ?? 0),
      ),
    );
  }
  assert.equal(
    readMonsterFilters(new URLSearchParams('sort=invalid')).sort,
    'name',
  );
});
test('mapeia todos os atributos de liderança para ícones locais', () => {
  const icons = {
    Accuracy: '/leader-skills/accuracy.png',
    'Attack Power': '/leader-skills/attack-power.png',
    'Attack Speed': '/leader-skills/attack-speed.png',
    'Critical DMG': '/leader-skills/critical-damage.png',
    'Critical Rate': '/leader-skills/critical-rate.png',
    Defense: '/leader-skills/defense.png',
    HP: '/leader-skills/hp.png',
    Resistance: '/leader-skills/resistance.png',
  };
  for (const [attribute, path] of Object.entries(icons)) {
    assert.equal(
      leaderSkillIcon({
        attribute,
        amount: 1,
        area: 'General',
        element: null,
      }),
      path,
    );
    assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)));
  }
  assert.equal(leaderSkillIcon(null), null);
});
test('separa o bônus e o contexto da habilidade de líder', () => {
  const skill = {
    attribute: 'Attack Power',
    amount: 44,
    area: 'Arena',
    element: null,
  };
  assert.equal(leaderBonusText(skill), 'ATQ +44%');
  assert.equal(leaderScopeText(skill), 'Arena');
  assert.equal(leaderText(skill), 'ATQ +44% · Arena');
  assert.equal(leaderBonusText(null), 'Sem habilidade de líder');
  assert.equal(leaderScopeText(null), null);
});
test('catálogo público mantém só a última forma obtível de cada família', () => {
  const visible = filterMonsters(
    monsters,
    readMonsterFilters(new URLSearchParams()),
  );
  assert.ok(visible.some((m) => m.id === 'red-angelmon-fire-8'));
  assert.ok(!visible.some((m) => m.id === 'angelmon-fire-7'));
  assert.ok(visible.every((m) => m.obtainable));
  assert.ok(visible.every((m) => !m.awakensTo));
  const legacyFilters = readMonsterFilters(
    new URLSearchParams('form=1&availability=all'),
  );
  assert.equal('form' in legacyFilters, false);
  assert.equal(legacyFilters.availability, 'obtainable');
});

test('mapeamento completo inclui a cadeia de evolução do monstro', () => {
  assert.ok(monsterById.has('angelmon-fire-7'));
  assert.equal(
    monsterById.get('angelmon-fire-7')?.awakensTo,
    'red-angelmon-fire-8',
  );
  assert.equal(
    monsterById.get('red-angelmon-fire-8')?.awakensFrom,
    'angelmon-fire-7',
  );
});
test('rejeita IDs externos duplicados, formas quebradas e bônus inválidos', () => {
  assert.throws(
    () =>
      validateCatalog(
        [...monsters, { ...monsters[0], id: 'duplicate-source' }],
        [],
        [],
        skills,
      ),
    /SWARFARM duplicados/,
  );
  assert.throws(
    () =>
      validateCatalog(
        [{ ...monsters[0], awakensTo: 'missing-form' }],
        [],
        [],
        skills,
      ),
    /forma inexistente/,
  );
  assert.throws(
    () =>
      validateCatalog(
        [
          {
            ...monsters[0],
            awakensFrom: null,
            awakensTo: null,
            leaderSkill: {
              attribute: 'HP',
              amount: -5,
              area: 'General',
              element: null,
            },
          },
        ],
        [],
        [],
        skills,
      ),
    /habilidade de líder/,
  );
});

test('catálogo completo é válido e os retratos locais existem', () => {
  assert.doesNotThrow(() =>
    validateCatalog(monsters, defenses, counters, skills),
  );
  for (const monster of monsters) {
    if (monster.image)
      assert.ok(
        existsSync(new URL(`../public${monster.image}`, import.meta.url)),
        monster.image,
      );
  }
});
test('aceita apenas o sentinela -1 para habilidades sem slot normal', () => {
  const specialSkills = skills.map((skill, index) =>
    index === 0 ? { ...skill, slot: -1 } : skill,
  );
  assert.doesNotThrow(() =>
    validateCatalog(monsters, defenses, counters, specialSkills),
  );
  assert.throws(
    () =>
      validateCatalog(monsters, defenses, counters, [
        { ...skills[0], slot: -2 },
        ...skills.slice(1),
      ]),
    /habilidade/,
  );
});
test('diferencia bônus adicionais de metas finais nos counters', () => {
  assert.equal(formatCounterStat(undefined, 'hp'), '—');
  assert.equal(formatCounterStat(30000, 'hp'), '+30k');
  assert.equal(formatCounterStat(30500, 'hp'), '+30,5k');
  assert.equal(formatCounterStat(1000, 'attack'), '+1k');
  assert.equal(formatCounterStat(700, 'defense'), '+700');
  assert.equal(formatCounterStat(100, 'resistance'), '100%');
  assert.equal(formatCounterStat(85, 'accuracy'), '85%');
  assert.equal(formatCounterSpeed(149), '+149');
  assert.equal(formatCounterSpeed(null), '—');
});
test('calcula a SPD do counter com Tick, líder, torre e Swift', () => {
  const speed = (
    monsterId: string,
    leaderId: string,
    runeSets = 'Violent / Will',
  ) =>
    requiredCounterSpeed({
      monster: monsterById.get(monsterId)!,
      leader: monsterById.get(leaderId)!,
      tick: 5,
      runeSets,
    });

  assert.equal(speed('platy-fire-835', 'platy-fire-835'), 149);
  assert.equal(speed('shihwa-fire-244', 'platy-fire-835'), 144);
  assert.equal(speed('iona-light-661', 'platy-fire-835'), 127);
  assert.equal(speed('betta-dark-839', 'platy-fire-835'), 128);
  assert.equal(speed('betta-dark-839', 'betta-dark-839'), 156);
  assert.equal(speed('shihwa-fire-244', 'betta-dark-839'), 168);
  assert.equal(speed('iona-light-661', 'betta-dark-839'), 154);
  assert.equal(speed('mimirr-light-655', 'mimirr-light-655'), 142);
  assert.equal(speed('loren-light-410', 'mimirr-light-655'), 144);
  assert.equal(speed('elucia-water-1281', 'mimirr-light-655'), 141);
  assert.equal(speed('platy-fire-835', 'platy-fire-835', 'Swift / Will'), 150);
});
test('rejeita metas de counter inválidas ou conflitantes', () => {
  for (const stats of [{ hp: -1 }, { defense: 700.5 }, { speed: 120 }]) {
    assert.throws(
      () =>
        validateCatalog(
          monsters,
          defenses,
          [
            {
              ...counters[0],
              runes: [
                { ...counters[0].runes[0], stats },
                ...counters[0].runes.slice(1),
              ],
            } as Counter,
          ],
          skills,
        ),
      /runas/,
    );
  }
  for (const preferredStats of [['unknown'], ['accuracy', 'accuracy']]) {
    assert.throws(
      () =>
        validateCatalog(
          monsters,
          defenses,
          [
            {
              ...counters[0],
              runes: [
                { ...counters[0].runes[0], preferredStats },
                ...counters[0].runes.slice(1),
              ],
            } as Counter,
          ],
          skills,
        ),
      /runas/,
    );
  }
  assert.throws(
    () =>
      validateCatalog(
        monsters,
        defenses,
        [
          {
            ...counters[0],
            runes: [
              {
                ...counters[0].runes[0],
                stats: { accuracy: 85 },
                preferredStats: ['accuracy'],
              },
              ...counters[0].runes.slice(1),
            ],
          },
        ],
        skills,
      ),
    /runas/,
  );
  assert.throws(
    () =>
      validateCatalog(
        monsters,
        defenses,
        [{ ...counters[0], tick: 2 }],
        skills,
      ),
    /Tick/,
  );
});
test('todas as defesas ativas têm o número de counters esperado', () => {
  for (const defense of defenses) {
    const matching = counters.filter(
      (counter) => counter.defenseId === defense.id,
    );
    const expected = [
      'solveig-vigor-cichlid',
      'solveig-cichlid-molly',
      'solveig-iris-hraesvelg',
    ].includes(defense.id)
      ? 3
      : 4;
    assert.equal(matching.length, expected, defense.id);
  }
});
test('busca combina nomes em qualquer ordem, vírgulas, espaços, caixa e acentos', () => {
  assert.ok(matchesSearch('Mo Long Nora Triana', 'triana, MÓ   LONG'));
  assert.ok(matchesSearch('Carcano Clara Savannah', 'sav carcano'));
  assert.ok(matchesSearch('Carcano Clara Savannah', ''));
  assert.equal(
    matchesSearch('Carcano Clara Savannah', 'carcano triana'),
    false,
  );
});
test('impede equipes incompletas e referências quebradas', () => {
  assert.throws(
    () =>
      validateCatalog(
        monsters,
        [{ ...defenses[0], team: ['nora'] }],
        [],
        skills,
      ),
    /três monstros/,
  );
  assert.throws(
    () =>
      validateCatalog(
        monsters,
        [{ ...defenses[0], team: ['nora', 'triana', 'ausente'] }],
        [],
        skills,
      ),
    /inexistente/,
  );
  assert.throws(
    () =>
      validateCatalog(
        monsters,
        defenses,
        [{ ...counters[0], defenseId: 'ausente' }],
        skills,
      ),
    /defesa inexistente/,
  );
});
test('impede IDs duplicados e monstros 5★ em torres 4★, inclusive no ataque', () => {
  assert.throws(
    () => validateCatalog(monsters, [defenses[0], defenses[0]], [], skills),
    /IDs duplicados/,
  );
  assert.throws(
    () =>
      validateCatalog(
        monsters,
        [
          {
            ...defenses[0],
            tower: '4star',
            team: ['nora', defenses[0].team[1], defenses[0].team[2]],
          },
        ],
        [],
        skills,
      ),
    /5★ em torre 4★/,
  );
  assert.throws(
    () =>
      validateCatalog(
        monsters,
        defenses,
        [
          {
            ...counters[0],
            defenseId: defenses[0].id,
            team: ['nora', counters[0].team[1], counters[0].team[2]],
          },
        ],
        skills,
      ),
    /ataque 5★/,
  );
});
test('exige ordem de turno pertencente ao time e URL de fonte válida', () => {
  assert.throws(
    () =>
      validateCatalog(
        monsters,
        defenses,
        [{ ...counters[0], turnOrder: ['carcano'] }],
        skills,
      ),
    /ordem de turnos/,
  );
  assert.throws(
    () =>
      validateCatalog(
        monsters,
        defenses,
        [
          {
            ...counters[0],
            sources: [{ title: 'Inválida', url: 'javascript:alert(1)' }],
          },
        ],
        skills,
      ),
    /fontes/,
  );
});
