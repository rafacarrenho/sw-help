import type { Monster, Defense, Counter } from './types.ts';

export function validateCatalog(
  monsters: Monster[],
  defenses: Defense[],
  counters: Counter[],
): void {
  const fail = (message: string): never => {
    throw new Error(`Catálogo inválido: ${message}`);
  };
  for (const [label, entries] of [
    ['monstros', monsters],
    ['defesas', defenses],
    ['counters', counters],
  ] as const) {
    const ids = entries.map((entry) => entry.id);
    if (new Set(ids).size !== ids.length) fail(`IDs duplicados em ${label}.`);
    if (ids.some((id) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)))
      fail(`ID inválido em ${label}.`);
  }
  const monsterMap = new Map(monsters.map((monster) => [monster.id, monster]));
  const defenseMap = new Map(defenses.map((defense) => [defense.id, defense]));
  for (const monster of monsters) {
    if (
      !monster.name?.trim() ||
      !['fire', 'water', 'wind', 'light', 'dark'].includes(monster.element)
    )
      fail(`monstro ${monster.id}.`);
    if (
      !Number.isInteger(monster.naturalStars) ||
      monster.naturalStars < 1 ||
      monster.naturalStars > 5
    )
      fail(`estrelas de ${monster.id}.`);
    if (
      !Array.isArray(monster.aliases) ||
      monster.aliases.some((alias) => typeof alias !== 'string')
    )
      fail(`aliases de ${monster.id}.`);
    if (monster.image && !monster.image.startsWith('/monsters/'))
      fail(`retrato deve ser local: ${monster.id}.`);
  }
  for (const entry of [...defenses, ...counters]) {
    if (
      !Array.isArray(entry.team) ||
      entry.team.length !== 3 ||
      new Set(entry.team).size !== 3
    )
      fail(`a equipe ${entry.id} precisa de três monstros distintos.`);
    if (entry.team.some((id) => !monsterMap.has(id)))
      fail(`monstro inexistente em ${entry.id}.`);
    if (entry.leader && !entry.team.includes(entry.leader))
      fail(`líder fora da equipe em ${entry.id}.`);
    if (!['example', 'documented'].includes(entry.status))
      fail(`status de ${entry.id}.`);
  }
  for (const defense of defenses) {
    if (!['4star', 'open'].includes(defense.tower))
      fail(`torre de ${defense.id}.`);
    if (!defense.label?.trim() || !defense.description?.trim())
      fail(`descrição de ${defense.id}.`);
    if (
      defense.tower === '4star' &&
      defense.team.some((id) => monsterMap.get(id)!.naturalStars > 4)
    )
      fail(`monstro 5★ em torre 4★: ${defense.id}.`);
  }
  for (const counter of counters) {
    const defense = defenseMap.get(counter.defenseId);
    if (!defense) fail(`defesa inexistente em ${counter.id}.`);
    if (
      defense!.tower === '4star' &&
      counter.team.some((id) => monsterMap.get(id)!.naturalStars > 4)
    )
      fail(`ataque 5★ em torre 4★: ${counter.id}.`);
    if (
      !counter.title?.trim() ||
      !counter.strategy?.trim() ||
      !counter.caution?.trim()
    )
      fail(`texto de ${counter.id}.`);
    if (
      !Array.isArray(counter.turnOrder) ||
      new Set(counter.turnOrder).size !== counter.turnOrder.length ||
      counter.turnOrder.some((id) => !counter.team.includes(id))
    )
      fail(`ordem de turnos de ${counter.id}.`);
    if (
      !Array.isArray(counter.steps) ||
      counter.steps.some((step) => typeof step !== 'string' || !step.trim())
    )
      fail(`passos de ${counter.id}.`);
    if (
      !Array.isArray(counter.runes) ||
      counter.runes.some(
        (rune) => !counter.team.includes(rune.monsterId) || !rune.sets?.trim(),
      )
    )
      fail(`runas de ${counter.id}.`);
    if (
      !Array.isArray(counter.sources) ||
      counter.sources.some(
        (source) => !source.title?.trim() || !/^https?:\/\//.test(source.url),
      )
    )
      fail(`fontes de ${counter.id}.`);
    if (counter.status === 'documented' && counter.sources.length === 0)
      fail(`counter documentado sem fonte: ${counter.id}.`);
  }
}
