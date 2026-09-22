import { readFile, writeFile, mkdir, access, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const endpoint = 'https://swarfarm.com/api/v2/monsters/';
const skillEndpoint = 'https://swarfarm.com/api/v2/skills/';
const dataPath = resolve(root, 'src/data/monsters.json');
const skillsPath = resolve(root, 'src/data/skills.json');
const previous = JSON.parse(await readFile(dataPath, 'utf8'));
const previousBySource = new Map(
  previous.map((m) => [
    m.swarfarmId ?? Number(m.source?.match(/\/(\d+)\/$/)?.[1]),
    m,
  ]),
);
async function request(url, binary = false) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: binary ? 'image/png' : 'application/json',
          'User-Agent': 'SW-Help catalog importer',
        },
        signal: AbortSignal.timeout(60000),
      });
      if (!response.ok)
        throw Object.assign(new Error(`${response.status}: ${url}`), {
          status: response.status,
        });
      if (!binary) return await response.json();
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a')
        throw new Error(`Retrato PNG inválido: ${url}`);
      return bytes;
    } catch (error) {
      if (error.status === 404 || attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** attempt));
    }
  }
}
async function requestAll(source, label) {
  const rows = [];
  let next = source;
  let expected = 0;
  while (next) {
    const url = new URL(next);
    if (url.origin !== new URL(source).origin)
      throw new Error(`Origem de paginação inesperada em ${label}.`);
    const page = await request(url);
    expected ||= page.count;
    rows.push(...page.results);
    console.log(`${label}: ${rows.length}/${expected}`);
    next = page.next;
  }
  if (rows.length !== expected)
    throw new Error(`${label} incompletas; dados locais preservados.`);
  return rows;
}
let raw;
const input = process.argv.indexOf('--input');
if (input !== -1) {
  raw = JSON.parse(await readFile(process.argv[input + 1], 'utf8'));
} else {
  raw = await requestAll(endpoint, 'Monstros');
}
if (
  !Array.isArray(raw) ||
  raw.length < previous.length ||
  new Set(raw.map((m) => m.id)).size !== raw.length
)
  throw new Error('Catálogo incompleto ou com IDs duplicados.');
const slug = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const ids = new Map(
  raw.map((m) => [
    m.id,
    previousBySource.get(m.id)?.id ??
      `${slug(m.name) || 'monster'}-${m.element.toLowerCase()}-${m.id}`,
  ]),
);
for (const id of previousBySource.keys())
  if (!ids.has(id))
    throw new Error(`Registro existente ausente na fonte: ${id}`);
const byId = new Map(raw.map((m) => [m.id, m]));
const familyName = (m) => {
  const seen = new Set();
  while (m.awakens_from && byId.has(m.awakens_from) && !seen.has(m.id)) {
    seen.add(m.id);
    m = byId.get(m.awakens_from);
  }
  return m.name;
};
const records = raw.map((m) => {
  if (!/^[\w.-]+\.png$/.test(m.image_filename))
    throw new Error(`Nome de retrato inválido: ${m.id}`);
  const old = previousBySource.get(m.id);
  const stats = [
    m.max_lvl_hp,
    m.max_lvl_attack,
    m.max_lvl_defense,
    m.crit_rate,
    m.crit_damage,
    m.resistance,
    m.accuracy,
  ];
  return {
    id: ids.get(m.id),
    swarfarmId: m.id,
    com2usId: m.com2us_id,
    name: m.name,
    element: m.element.toLowerCase(),
    naturalStars: m.natural_stars,
    aliases: old?.aliases ?? [],
    familyId: m.family_id,
    family: familyName(m),
    archetype: m.archetype,
    awakenLevel: m.awaken_level,
    obtainable: m.obtainable,
    speed: m.speed,
    maxLevelStats: stats.every(Number.isFinite)
      ? {
          hp: m.max_lvl_hp,
          attack: m.max_lvl_attack,
          defense: m.max_lvl_defense,
          critRate: m.crit_rate,
          critDamage: m.crit_damage,
          resistance: m.resistance,
          accuracy: m.accuracy,
        }
      : undefined,
    skillIds: m.skills,
    skillUpsToMax: m.skill_ups_to_max ?? 0,
    sources: m.source.map((source) => ({
      id: source.id,
      name: source.name,
      description: source.description,
      farmable: source.farmable_source,
    })),
    awakensFrom: ids.get(m.awakens_from) ?? null,
    awakensTo: ids.get(m.awakens_to) ?? null,
    leaderSkill: m.leader_skill
      ? {
          attribute: m.leader_skill.attribute,
          amount: m.leader_skill.amount,
          area: m.leader_skill.area,
          element: m.leader_skill.element?.toLowerCase() ?? null,
        }
      : null,
    image: old?.image ?? `/monsters/${m.image_filename}`,
    source: `${endpoint}${m.id}/`,
    imageSource: `https://swarfarm.com/static/herders/images/monsters/${m.image_filename}`,
  };
});
let rawSkills;
const skillsInput = process.argv.indexOf('--skills-input');
if (skillsInput !== -1) {
  rawSkills = JSON.parse(await readFile(process.argv[skillsInput + 1], 'utf8'));
} else {
  rawSkills = await requestAll(skillEndpoint, 'Habilidades');
}
if (
  !Array.isArray(rawSkills) ||
  new Set(rawSkills.map((skill) => skill.id)).size !== rawSkills.length
)
  throw new Error('Habilidades incompletas ou com IDs duplicados.');
const referencedSkillIds = new Set(records.flatMap((m) => m.skillIds));
const skillRecords = rawSkills
  .filter((skill) => referencedSkillIds.has(skill.id))
  .map((skill) => ({
    id: skill.id,
    name: skill.name,
    description: skill.description,
    slot: skill.slot,
    cooltime: skill.cooltime,
    hits: skill.hits,
    passive: skill.passive,
    aoe: skill.aoe,
    random: skill.random,
    maxLevel: skill.max_level,
    levelProgress: skill.level_progress_description,
    effects: skill.effects.map((entry) => ({
      name: entry.effect.name,
      description: entry.effect.description,
      isBuff: entry.effect.is_buff,
      type: entry.effect.type,
      chance: entry.chance,
      quantity: entry.quantity,
      note: entry.note,
    })),
    multiplierFormula: skill.multiplier_formula,
    scalesWith: skill.scales_with,
    source: `${skillEndpoint}${skill.id}/`,
  }));
if (skillRecords.length !== referencedSkillIds.size)
  throw new Error(
    'Uma ou mais habilidades referenciadas não foram encontradas.',
  );
// Fail before changing the catalog if the upstream schema breaks a known invariant.
const { validateCatalog } = await import('../src/lib/validate.ts');
const defenses = JSON.parse(
  await readFile(resolve(root, 'src/data/defenses.json'), 'utf8'),
);
const counters = JSON.parse(
  await readFile(resolve(root, 'src/data/counters.json'), 'utf8'),
);
validateCatalog(records, defenses, counters, skillRecords);
await mkdir(resolve(root, 'public/monsters'), { recursive: true });
const jobs = [...new Map(records.map((m) => [m.image, m])).values()];
let cursor = 0;
let downloaded = 0;
const missingPortraits = [];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (cursor < jobs.length) {
      const monster = jobs[cursor++];
      const target = resolve(root, `public${monster.image}`);
      try {
        await access(target);
        continue;
      } catch {
        /* New portrait. */
      }
      let bytes;
      try {
        bytes = await request(monster.imageSource, true);
      } catch (error) {
        if (error.status !== 404) throw error;
        missingPortraits.push(monster.imageSource);
        const missingImage = monster.image;
        for (const record of records)
          if (record.image === missingImage) record.image = undefined;
        console.warn(`Retrato ausente na fonte: ${monster.imageSource}`);
        continue;
      }
      await writeFile(`${target}.tmp`, bytes);
      await rename(`${target}.tmp`, target);
      downloaded++;
      if (downloaded % 100 === 0)
        console.log(`Retratos baixados: ${downloaded}`);
    }
  }),
);
const metadata = {
  source: endpoint,
  skillSource: skillEndpoint,
  importedAt: new Date().toISOString(),
  count: records.length,
  skills: skillRecords.length,
  portraits: jobs.length - missingPortraits.length,
  missingPortraits,
};
await writeFile(`${dataPath}.tmp`, `${JSON.stringify(records, null, 2)}\n`);
await writeFile(
  `${skillsPath}.tmp`,
  `${JSON.stringify(skillRecords, null, 2)}\n`,
);
await rename(`${dataPath}.tmp`, dataPath);
await rename(`${skillsPath}.tmp`, skillsPath);
await writeFile(
  resolve(root, 'src/data/monsters-meta.json'),
  `${JSON.stringify(metadata, null, 2)}\n`,
);
console.log(
  `Catálogo atualizado: ${records.length} registros; ${downloaded} novos retratos.`,
);
