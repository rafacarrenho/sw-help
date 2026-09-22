import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { validateCatalog } from '../src/lib/validate.ts';
import { matchesSearch } from '../src/lib/search.ts';
import {
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
  combatSpeed,
  getSiegeSpeedLeader,
  getSpeedTuningCapabilities,
  minimumRuneSpeedForCombat,
  tuneFollower,
} from '../src/lib/speed-tuning.ts';
import { monsterById } from '../src/data/catalog.ts';
import { skillById } from '../src/data/skill-catalog.ts';
import type {
  Monster,
  MonsterSkill,
  Defense,
  Counter,
} from '../src/lib/types.ts';

const read = (name: string) =>
  JSON.parse(
    readFileSync(new URL(`../src/data/${name}.json`, import.meta.url), 'utf8'),
  );
const monsters: Monster[] = read('monsters');
const skills: MonsterSkill[] = read('skills');
const defenses: Defense[] = read('defenses');
const counters: Counter[] = read('counters');

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
});

test('Speed Tuning normaliza boosts, buffs e lideranças de Siege', () => {
  assert.deepEqual(
    getSpeedTuningCapabilities(monsterById.get('bernard-wind-368')!, skillById),
    {
      atbBoost: {
        percent: 30,
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
      scope: 'single',
      skillId: 81,
      skillName: 'Resurge',
    },
  );
  assert.deepEqual(
    getSpeedTuningCapabilities(monsterById.get('dova-light-981')!, skillById),
    {
      atbBoost: {
        percent: 100,
        scope: 'single',
        skillId: 1429,
        skillName: "Rabbit's Agility",
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
      monsterById.get('belladeon-light-1299')!,
      skillById,
    ).atbBoost,
    {
      percent: 30,
      scope: 'team',
      skillId: 2221,
      skillName: 'Mobilize',
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
    baseSpeed: 103,
    towerPercent: 15,
    leaderPercent: 19,
    usesSwift: true,
  });
  assert.deepEqual(talisman, {
    runeSpeed: 182,
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
test('exige fonte em counter documentado e ordem de turno pertencente ao time', () => {
  assert.throws(
    () =>
      validateCatalog(
        monsters,
        defenses,
        [{ ...counters[0], status: 'documented' }],
        skills,
      ),
    /sem fonte/,
  );
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
