import type { APIRoute } from 'astro';
import { routePath } from '../i18n';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://sw-help.rafabcarrenho.workers.dev');
  const absolute = (path: string) => new URL(path, origin).href;
  const link = (
    label: string,
    route: Parameters<typeof routePath>[0],
    locale: 'en' | 'pt-BR',
  ) => `- [${label}](${absolute(routePath(route, locale))})`;

  const content = `# SW Help

> Free, independent Summoners War tools for Siege counters, monster research, SPD tuning, speed comparison, and combat tick breakpoints. SW Help is a community project and is not affiliated with Com2uS.

## English

${link('Summoners War tools', 'home', 'en')}: Overview of every SW Help tool.
${link('Siege Counter', 'siegeCounter', 'en')}: Search registered Summoners War Siege defenses and review offense ideas.
${link('Monster Database', 'monsters', 'en')}: Search monster stats, skills, leader effects, and forms imported from SWARFARM.
${link('SPD Tuning', 'speedTuning', 'en')}: Plan a Summoners War team turn order with speed leads, towers, and combat speed effects.
${link('Speed Comparison', 'speedComparison', 'en')}: Compare two monsters and estimate the additional SPD needed to move first.
${link('SPD Tick Calculator', 'speedTick', 'en')}: Calculate combat tick breakpoints from base SPD, runes, towers, leads, and Swift.

## Português

${link('Ferramentas de Summoners War', 'home', 'pt-BR')}: Visão geral das ferramentas do SW Help.
${link('Siege Counter', 'siegeCounter', 'pt-BR')}: Pesquise defesas do Cerco e consulte ideias de times para o ataque.
${link('Catálogo de monstros', 'monsters', 'pt-BR')}: Consulte atributos, habilidades, efeitos de líder e formas importadas do SWARFARM.
${link('SPD Tuning', 'speedTuning', 'pt-BR')}: Planeje a ordem de turno considerando líder de velocidade, torre e efeitos de combate.
${link('Comparador de SPD', 'speedComparison', 'pt-BR')}: Compare dois monstros e estime a SPD adicional necessária para jogar primeiro.
${link('Calculadora de Tick de SPD', 'speedTick', 'pt-BR')}: Calcule breakpoints de Tick considerando SPD base, runas, torre, líder e Swift.

## Discovery

- [XML sitemap](${absolute('/sitemap.xml')}): Canonical and localized URLs available for crawling.
- [Robots policy](${absolute('/robots.txt')}): Crawling policy for this site.

## Notes

- Use the canonical HTML pages above as the authoritative source.
- Calculators are planning aids; players should confirm runes, artifacts, passives, and battle conditions in game.
- Monster and skill data is imported from SWARFARM. Summoners War names, portraits, and game characters belong to Com2uS.
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
