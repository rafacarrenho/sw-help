import type {
  Monster,
  MonsterSkill,
  DefenseBase,
  CounterBase,
  CounterDefinition,
} from './types.ts';
import { counterStatNames } from './counter-stats.ts';
import { getTickBreakpoint } from './speed-tick.ts';

const counterStatKeys = new Set<string>(counterStatNames);

export function validateCounterDefinitions(
  monsters: Monster[],
  defenses: DefenseBase[],
  definitions: CounterDefinition[],
): void {
  const fail = (message: string): never => {
    throw new Error(`Configuração de counter inválida: ${message}`);
  };
  const monsterIds = new Set(monsters.map(({ id }) => id));
  const defenseMap = new Map(defenses.map((defense) => [defense.id, defense]));
  const definitionIds = definitions.map(({ id }) => id);

  if (new Set(definitionIds).size !== definitionIds.length)
    fail('IDs genéricos duplicados.');
  if (definitionIds.some((id) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)))
    fail('ID genérico inválido.');

  for (const definition of definitions) {
    if (
      !Array.isArray(definition.team) ||
      definition.team.length !== 3 ||
      new Set(definition.team).size !== 3 ||
      definition.team.some((id) => !monsterIds.has(id))
    )
      fail(`equipe de ${definition.id}.`);
    if (!Array.isArray(definition.matchups) || definition.matchups.length === 0)
      fail(`confrontos de ${definition.id}.`);

    const matchupIds = definition.matchups.map(({ defenseId }) => defenseId);
    if (new Set(matchupIds).size !== matchupIds.length)
      fail(`defesas duplicadas em ${definition.id}.`);

    for (const matchup of definition.matchups) {
      const defense = defenseMap.get(matchup.defenseId);
      if (!defense)
        fail(`defesa ${matchup.defenseId} de ${definition.id} não existe.`);

      if (
        matchup.killOrder !== undefined &&
        (!Array.isArray(matchup.killOrder) ||
          matchup.killOrder.length !== defense!.team.length ||
          new Set(matchup.killOrder).size !== matchup.killOrder.length ||
          matchup.killOrder.some((id) => !defense!.team.includes(id)))
      )
        fail(`ordem de eliminação de ${definition.id}.${matchup.defenseId}.`);

      const runeOverrides = matchup.overrides?.runes;
      if (runeOverrides !== undefined) {
        if (!Array.isArray(runeOverrides))
          fail(`overrides de runa de ${definition.id}.${matchup.defenseId}.`);
        const runeMonsterIds = runeOverrides.map(({ monsterId }) => monsterId);
        if (
          new Set(runeMonsterIds).size !== runeMonsterIds.length ||
          runeMonsterIds.some((id) => !definition.team.includes(id))
        )
          fail(`overrides de runa de ${definition.id}.${matchup.defenseId}.`);

        for (const rune of runeOverrides) {
          if (rune.sets !== undefined && !rune.sets.trim())
            fail(`sets de runa de ${definition.id}.${matchup.defenseId}.`);
          if (
            rune.stats !== undefined &&
            (typeof rune.stats !== 'object' ||
              rune.stats === null ||
              Object.entries(rune.stats).some(
                ([key, value]) =>
                  !counterStatKeys.has(key) ||
                  (value !== null && (!Number.isInteger(value) || value < 0)),
              ))
          )
            fail(`atributos de runa de ${definition.id}.${matchup.defenseId}.`);
          if (
            rune.preferredStats !== undefined &&
            (!Array.isArray(rune.preferredStats) ||
              new Set(rune.preferredStats).size !==
                rune.preferredStats.length ||
              rune.preferredStats.some((stat) => !counterStatKeys.has(stat)))
          )
            fail(
              `atributos preferidos de ${definition.id}.${matchup.defenseId}.`,
            );
        }
      }
    }
  }
}

export function validateCatalog(
  monsters: Monster[],
  defenses: DefenseBase[],
  counters: CounterBase[],
  skills?: MonsterSkill[],
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
  const skillMap = skills
    ? new Map(skills.map((skill) => [skill.id, skill]))
    : undefined;
  if (skills && skillMap!.size !== skills.length)
    fail('IDs duplicados em habilidades.');
  for (const skill of skills ?? []) {
    if (
      !Number.isInteger(skill.id) ||
      skill.id <= 0 ||
      !skill.name?.trim() ||
      !Number.isInteger(skill.slot) ||
      skill.slot < -1 ||
      (skill.cooltime !== null &&
        (!Number.isInteger(skill.cooltime) || skill.cooltime < 0)) ||
      !Number.isInteger(skill.hits) ||
      !Number.isInteger(skill.maxLevel) ||
      skill.maxLevel < 1 ||
      !Array.isArray(skill.levelProgress) ||
      !Array.isArray(skill.effects) ||
      !Array.isArray(skill.scalesWith) ||
      !/^https:\/\//.test(skill.source)
    )
      fail(`habilidade ${skill.id}.`);
  }
  const sourceIds = monsters.flatMap((monster) =>
    monster.swarfarmId === undefined ? [] : [monster.swarfarmId],
  );
  if (new Set(sourceIds).size !== sourceIds.length)
    fail('IDs SWARFARM duplicados.');
  for (const monster of monsters) {
    if (
      !monster.name?.trim() ||
      !['fire', 'water', 'wind', 'light', 'dark', 'pure'].includes(
        monster.element,
      )
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
    if (monster.swarfarmId !== undefined) {
      if (
        !Number.isInteger(monster.swarfarmId) ||
        monster.swarfarmId <= 0 ||
        !monster.family?.trim() ||
        !Number.isInteger(monster.familyId)
      )
        fail(`origem ou família de ${monster.id}.`);
      if (
        ![0, 1, 2].includes(monster.awakenLevel!) ||
        typeof monster.obtainable !== 'boolean' ||
        !Number.isFinite(monster.speed) ||
        monster.speed! < 0
      )
        fail(`forma ou atributos de ${monster.id}.`);
      if (
        monster.maxLevelStats &&
        Object.values(monster.maxLevelStats).some(
          (value) => !Number.isFinite(value) || value < 0,
        )
      )
        fail(`atributos de nível máximo de ${monster.id}.`);
      if (
        !Array.isArray(monster.skillIds) ||
        new Set(monster.skillIds).size !== monster.skillIds.length ||
        monster.skillIds.some(
          (id) => !Number.isInteger(id) || (skillMap && !skillMap.has(id)),
        ) ||
        !Number.isInteger(monster.skillUpsToMax) ||
        monster.skillUpsToMax! < 0
      )
        fail(`habilidades de ${monster.id}.`);
      if (
        !Array.isArray(monster.sources) ||
        monster.sources.some(
          (source) =>
            !Number.isInteger(source.id) ||
            source.id <= 0 ||
            !source.name?.trim() ||
            typeof source.description !== 'string' ||
            typeof source.farmable !== 'boolean',
        )
      )
        fail(`fontes de obtenção de ${monster.id}.`);
      for (const relative of [monster.awakensFrom, monster.awakensTo])
        if (relative && !monsterMap.has(relative))
          fail(`forma inexistente em ${monster.id}.`);
      if (
        monster.leaderSkill &&
        (!monster.leaderSkill.attribute?.trim() ||
          !monster.leaderSkill.area?.trim() ||
          !Number.isFinite(monster.leaderSkill.amount) ||
          monster.leaderSkill.amount <= 0 ||
          (monster.leaderSkill.element &&
            !['fire', 'water', 'wind', 'light', 'dark'].includes(
              monster.leaderSkill.element,
            )))
      )
        fail(`habilidade de líder de ${monster.id}.`);
    }
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
  }
  for (const defense of defenses) {
    if (!['example', 'documented'].includes(defense.status))
      fail(`status de ${defense.id}.`);
    if (!['4star', 'open'].includes(defense.tower))
      fail(`torre de ${defense.id}.`);
    const allFourStar = defense.team.every(
      (id) => monsterMap.get(id)!.naturalStars === 4,
    );
    if (allFourStar && defense.tower !== '4star')
      fail(`time 4★ em torre aberta: ${defense.id}.`);
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
      !Array.isArray(counter.turnOrder) ||
      new Set(counter.turnOrder).size !== counter.turnOrder.length ||
      counter.turnOrder.some((id) => !counter.team.includes(id))
    )
      fail(`ordem de turnos de ${counter.id}.`);
    if (
      !Array.isArray(counter.runes) ||
      new Set(counter.runes.map(({ monsterId }) => monsterId)).size !==
        counter.runes.length ||
      counter.runes.some(
        (rune) =>
          !counter.team.includes(rune.monsterId) ||
          !rune.sets?.trim() ||
          (rune.stats !== undefined &&
            (typeof rune.stats !== 'object' ||
              rune.stats === null ||
              Object.entries(rune.stats).some(
                ([key, value]) =>
                  !counterStatKeys.has(key) ||
                  !Number.isInteger(value) ||
                  value < 0,
              ))) ||
          (rune.preferredStats !== undefined &&
            (!Array.isArray(rune.preferredStats) ||
              new Set(rune.preferredStats).size !==
                rune.preferredStats.length ||
              rune.preferredStats.some(
                (stat) =>
                  !counterStatKeys.has(stat) ||
                  rune.stats?.[stat] !== undefined,
              ))),
      )
    )
      fail(`runas de ${counter.id}.`);
    if (!Number.isInteger(counter.tick) || !getTickBreakpoint(counter.tick))
      fail(`Tick de ${counter.id}.`);
    if (
      !Array.isArray(counter.sources) ||
      counter.sources.some(
        (source) => !source.title?.trim() || !/^https?:\/\//.test(source.url),
      )
    )
      fail(`fontes de ${counter.id}.`);
    if (
      counter.killOrder !== undefined &&
      (!Array.isArray(counter.killOrder) ||
        counter.killOrder.length !== defense!.team.length ||
        new Set(counter.killOrder).size !== counter.killOrder.length ||
        counter.killOrder.some((id) => !defense!.team.includes(id)))
    )
      fail(`ordem de eliminação de ${counter.id}.`);
  }
}
