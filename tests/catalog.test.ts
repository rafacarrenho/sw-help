import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { validateCatalog } from '../src/lib/validate.ts';
import { matchesSearch } from '../src/lib/search.ts';
import type { Monster, Defense, Counter } from '../src/lib/types.ts';

const read = (name: string) =>
  JSON.parse(
    readFileSync(new URL(`../src/data/${name}.json`, import.meta.url), 'utf8'),
  );
const monsters: Monster[] = read('monsters');
const defenses: Defense[] = read('defenses');
const counters: Counter[] = read('counters');

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
    () => validateCatalog(monsters, [{ ...defenses[0], tower: '4star' }], []),
    /5★ em torre 4★/,
  );
  assert.throws(
    () =>
      validateCatalog(monsters, defenses, [
        { ...counters[0], defenseId: 'carcano-vigor-triana' },
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
