import type { APIRoute } from 'astro';
import { defenses, monsters } from '../data/catalog';
import {
  PAGE_SIZE,
  filterMonsters,
  readMonsterFilters,
} from '../lib/monster-catalog';
import { routePath, type RouteName, type RouteParams } from '../i18n/index.ts';
import { SITE_ORIGIN } from '../config/site';

export const prerender = true;

type Entry = { route: RouteName; params?: RouteParams };

const totalMonsterPages = Math.ceil(
  filterMonsters(monsters, readMonsterFilters(new URLSearchParams())).length /
    PAGE_SIZE,
);

const entries: Entry[] = [
  { route: 'portalHome' },
  { route: 'home' },
  { route: 'siegeCounter' },
  { route: 'monsters' },
  { route: 'speedComparison' },
  { route: 'speedTuning' },
  { route: 'speedTick' },
  ...defenses.map(({ id }) => ({ route: 'siege' as const, params: { id } })),
  ...monsters.map(({ id }) => ({ route: 'monster' as const, params: { id } })),
  ...Array.from({ length: Math.max(0, totalMonsterPages - 1) }, (_, index) => ({
    route: 'monsterPage' as const,
    params: { page: index + 2 },
  })),
];

const escapeXml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;',
    };
    return entities[character];
  });

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL(SITE_ORIGIN);
  const absolute = (path: string) => new URL(path, origin).href;
  const urls = entries.flatMap(({ route, params = {} }) => {
    const english = absolute(routePath(route, 'en', params));
    const portuguese = absolute(routePath(route, 'pt-BR', params));
    const alternates = `
      <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(english)}" />
      <xhtml:link rel="alternate" hreflang="pt-BR" href="${escapeXml(portuguese)}" />
      <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(english)}" />`;
    return [english, portuguese].map(
      (location) => `  <url>
    <loc>${escapeXml(location)}</loc>${alternates}
  </url>`,
    );
  });
  const uniqueUrls = [...new Set(urls)];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${uniqueUrls.join('\n')}
</urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    },
  );
};
