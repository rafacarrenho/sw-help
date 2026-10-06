import type { APIRoute } from 'astro';
import { SITE_ORIGIN } from '../config/site';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL(SITE_ORIGIN);
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', origin).href}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
