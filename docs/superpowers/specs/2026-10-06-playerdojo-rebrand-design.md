# PlayerDojo domain and brand migration

**Date:** 2026-10-06

## Goal

Rebrand the public site from SW Help to PlayerDojo and make
`https://www.playerdojo.com` the single canonical production origin without
changing the existing localized or Summoners War route structure.

## Brand direction

- Use `PlayerDojo` as the written brand everywhere visible to users, search
  engines, social previews, and machine-readable metadata.
- Preserve the existing crossed-swords symbol, gold accent, dark palette, and
  general visual structure.
- Update the header, mobile header, sidebar, footer, accessible labels, and
  wordmark so `Player` and `Dojo` are visually distinguishable while remaining
  one brand name.
- Keep the current crossed-swords favicon because it is brand-neutral and
  remains the approved PlayerDojo symbol.
- Keep the supporting line `GAME TOOLS & GUIDES` because the portal is intended
  to expand beyond Summoners War.

## Canonical domain

- Set Astro's production `site` to `https://www.playerdojo.com`.
- Use the same origin in sitemap, robots, `llms.txt`, canonical links,
  `hreflang`, Open Graph URLs, breadcrumbs, and structured data.
- Preserve current route paths such as `/summoners-war/...` and `/pt/...` so the
  migration does not introduce unnecessary URL changes.
- Treat the apex domain `https://playerdojo.com` as an alternate host that must
  permanently redirect to `https://www.playerdojo.com` at the DNS/hosting
  layer. The repository will document this deployment requirement because a
  static Astro build cannot enforce a host-only redirect by itself.
- Keep the previous Workers hostname out of generated production metadata. A
  redirect from that hostname to the equivalent canonical URL should be added
  at the hosting layer if the deployment platform allows it.

## Content and metadata

- Replace SW Help with PlayerDojo in the shared title suffix, default title,
  Open Graph site name, schema.org `WebSite` references, copyright, footer,
  accessibility labels, SEO copy, and `llms.txt`.
- Preserve Summoners War keywords and page-specific titles. The rebrand must
  not dilute descriptions that currently target Siege, monsters, SPD, or Tick
  searches.
- Update both English and Brazilian Portuguese messages.
- Update the package name and README so the active project documentation uses
  the PlayerDojo identity.
- Historical specifications and plans remain unchanged because they document
  the state and decisions that existed when they were written.

## Internal identifiers

- Rename current brand-specific analytics markers and sidebar storage keys to
  PlayerDojo equivalents.
- Read the legacy sidebar storage key once as a compatibility fallback and
  migrate its value to the new key, preserving the user's collapsed navigation
  preference.
- Do not rename game-specific identifiers, route names, component names, or
  repository paths when they do not expose the old brand.

## Deployment behavior

- Generated pages must reference only the `www.playerdojo.com` canonical host.
- The apex-to-www redirect must use HTTP 301 or 308 and preserve the full path
  and query string.
- Both apex and `www` DNS records must be connected to the production hosting
  provider before launch.
- HTTPS must be active for both hosts before the redirect is enabled.

## Testing

- Update automated expectations for document titles, canonical URLs,
  `hreflang`, sitemap entries, Open Graph site name, structured data, branding,
  analytics markers, and navigation storage.
- Add or retain coverage proving that generated sitemap and robots endpoints
  use `https://www.playerdojo.com`.
- Run `pnpm test`.
- Run `pnpm build`.
- Run `pnpm test:e2e` against the generated build because the migration affects
  global layout, navigation, SEO, and static metadata endpoints.
- Search the active source, public assets, tests, README, package metadata, and
  generated output for obsolete SW Help and Workers-host references. Historical
  design and plan documents are excluded from this final scan.

## Success criteria

- Users see PlayerDojo consistently in desktop, mobile, footer, and page titles.
- Every indexable URL points to `https://www.playerdojo.com` as its canonical
  origin.
- Sitemap, robots, `llms.txt`, Open Graph, and structured data agree on the same
  brand and host.
- Existing localized and Summoners War paths continue to work unchanged.
- No active production surface identifies the site as SW Help.
- Tests and the production build complete successfully.

## Out of scope

- Renaming the GitHub repository or local directory.
- Creating new tools, routes, or game content.
- Redesigning the approved sword symbol, palette, or page layouts.
- Purchasing additional domains or social media handles.
- Performing DNS or hosting-dashboard changes without access to the provider.
