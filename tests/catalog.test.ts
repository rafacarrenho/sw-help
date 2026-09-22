import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { validateCatalog } from '../src/lib/validate.ts';
import { matchesSearch } from '../src/lib/search.ts';
import {
  filterMonsters,
  readMonsterFilters,
  leaderText,
} from '../src/lib/monster-catalog.ts';
import {
  SPEED_TICK_BREAKPOINTS,
  additionalSpeedPercentOptions,
  getLeaderOptions,
  getPossibleSpeedLeaders,
  requiredAdditionalSpeed,
  requiredAdditionalSpeedPercent,
} from '../src/lib/speed-tick.ts';
import { monsterById } from '../src/data/catalog.ts';
import type { Monster, Defense, Counter } from '../src/lib/types.ts';

const read = (name: string) =>
  JSON.parse(
    readFileSync(new URL(`../src/data/${name}.json`, import.meta.url), 'utf8'),
  );
const monsters: Monster[] = read('monsters');
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
      }) - 65.79710144927535,
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
    87,
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
      ),
    /SWARFARM duplicados/,
  );
  assert.throws(
    () =>
      validateCatalog([{ ...monsters[0], awakensTo: 'missing-form' }], [], []),
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
      ),
    /habilidade de líder/,
  );
});

test('catálogo completo é válido e os retratos locais existem', () => {
  assert.doesNotThrow(() => validateCatalog(monsters, defenses, counters));
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
    () => validateCatalog(monsters, [{ ...defenses[0], team: ['nora'] }], []),
    /três monstros/,
  );
  assert.throws(
    () =>
      validateCatalog(
        monsters,
        [{ ...defenses[0], team: ['nora', 'triana', 'ausente'] }],
        [],
      ),
    /inexistente/,
  );
  assert.throws(
    () =>
      validateCatalog(monsters, defenses, [
        { ...counters[0], defenseId: 'ausente' },
      ]),
    /defesa inexistente/,
  );
});
test('impede IDs duplicados e monstros 5★ em torres 4★, inclusive no ataque', () => {
  assert.throws(
    () => validateCatalog(monsters, [defenses[0], defenses[0]], []),
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
      ),
    /5★ em torre 4★/,
  );
  assert.throws(
    () =>
      validateCatalog(monsters, defenses, [
        {
          ...counters[0],
          defenseId: defenses[0].id,
          team: ['nora', counters[0].team[1], counters[0].team[2]],
        },
      ]),
    /ataque 5★/,
  );
});
test('exige fonte em counter documentado e ordem de turno pertencente ao time', () => {
  assert.throws(
    () =>
      validateCatalog(monsters, defenses, [
        { ...counters[0], status: 'documented' },
      ]),
    /sem fonte/,
  );
  assert.throws(
    () =>
      validateCatalog(monsters, defenses, [
        { ...counters[0], turnOrder: ['carcano'] },
      ]),
    /ordem de turnos/,
  );
  assert.throws(
    () =>
      validateCatalog(monsters, defenses, [
        {
          ...counters[0],
          sources: [{ title: 'Inválida', url: 'javascript:alert(1)' }],
        },
      ]),
    /fontes/,
  );
});
