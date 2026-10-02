# Technical audit fixes

**Date:** 2026-10-02

## Goal

Resolve the approved structural, SEO, localization, and package-manager issues
without changing the visual design, translating imported skill content, or
optimizing the monster catalog payload in this iteration.

## Scope

### Permanent redirects

- Add `public/_redirects` for Cloudflare Workers Static Assets.
- Replace the legacy English and Portuguese catalog, Siege, and SPD tool URLs
  with real HTTP 301 redirects to the current canonical routes.
- Use ordered wildcard and placeholder rules so query strings remain usable and
  the redirect file stays below Cloudflare's dynamic-rule limit.
- Remove the Astro pages whose only purpose is generating meta-refresh redirect
  documents.
- Keep all current canonical pages unchanged.

### Catalog pagination

- Render the previous and next anchors only when the corresponding page exists.
- The final catalog page must not contain an `href` for page 25 in either
  language.
- Preserve the client-side filtered pagination behavior.

### Product documentation

- Update the README to state that SPD Tuning and SPD Tick are active tools.
- Keep Siege Counter described as the current product priority.
- Update the feature and structure descriptions to match the current
  multi-tool, bilingual application.

### Element localization

- Build catalog element options from `elementLabelsFor(locale)` instead of the
  Portuguese-only exported constant.
- English pages must display Fire, Water, Wind, Light, and Dark.
- Portuguese pages must continue to display Fogo, Água, Vento, Luz, and Trevas.

### Imported English content

- Do not translate monster skill names, descriptions, effects, or other imported
  English prose.
- On Portuguese pages, mark only those imported English text fragments with
  `lang="en"` so assistive technology can switch pronunciation correctly.
- Do not change the document-level `lang="pt-BR"` or Portuguese interface copy.

### pnpm-only workflow

- Delete `package-lock.json`.
- Remove npm installation, development, build, and test commands from the
  README.
- Add the repository's pnpm version to `package.json` through `packageManager`.
- Keep `pnpm-lock.yaml` as the only dependency lockfile.

## Out of scope

- Open Graph or Twitter preview images.
- Translation of imported monster and skill data.
- Changes to the monster catalog loading strategy or payload size.
- Visual redesigns, new tools, or new content.

## Catalog optimization follow-up

The catalog currently embeds the complete monster summary index in every
paginated HTML document even though a static JSON endpoint already exists. A
future change can retain the 48 server-rendered cards for no-JavaScript access,
remove the full embedded index, and fetch the JSON index only when filters or
client-side pagination are used. The JSON response would then be cached across
catalog pages. This proposal requires its own approval because it changes the
catalog's runtime data flow and offline/error behavior.

## Testing

- Extend unit or E2E coverage for localized element options.
- Verify that the last catalog pages do not expose a next-page link.
- Verify representative legacy routes return HTTP 301 and preserve their
  destination paths and query strings under Wrangler.
- Run `pnpm test`, `pnpm build`, and `pnpm test:e2e`.
- Run `pnpm format:check`; generated or imported files may be added to
  `.prettierignore` only when formatting them would create noisy data-only
  changes.
- Confirm the final worktree contains no npm lockfile and no undocumented source
  changes.

## Success criteria

- Legacy URLs return real HTTP 301 responses in the production-equivalent
  Wrangler server.
- Canonical routes, sitemap entries, hreflang links, and 404 behavior remain
  unchanged.
- No generated catalog page links to page 25.
- Element labels match the current locale.
- Imported English skill text is explicitly marked only where it appears inside
  Portuguese documents.
- Project documentation and lockfiles consistently require pnpm.
