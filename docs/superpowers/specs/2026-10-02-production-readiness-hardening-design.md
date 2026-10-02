# Production readiness hardening

**Date:** 2026-10-02

## Goal

Prepare SW Help for production with current stable dependencies, consistent
product documentation, stronger browser security defaults, and targeted
accessibility and interface fixes without redesigning the application.

## Product status

- Update `AGENTS.md` so Siege Counter, SPD Tuning, SPD Tick, and all other
  published tools are described as active and enabled.
- Remove the instruction that makes Siege Counter the exclusive current
  priority or disables SPD tools.
- Preserve all existing product and data-model conventions.

## Dependencies

- Update every direct dependency and development dependency to its latest
  stable release, including TypeScript 7.
- Use pnpm exclusively and regenerate only `pnpm-lock.yaml`.
- Adapt application or tooling configuration when a current stable dependency
  introduces an incompatibility; do not silently downgrade it.
- Re-run a production dependency audit after the update and document any
  remaining transitive findings.

### Compatibility decision discovered during implementation

`@astrojs/check` 0.9.10, the latest stable release, explicitly rejects
TypeScript 7.0 and supports TypeScript 5 or 6. No stable compatible replacement
is currently published; Astro's suggested TypeScript 7 path is experimental
and requires TypeScript 7.1 or newer. Production validation therefore keeps
TypeScript 6.0.3, the latest stable supported version, until the stable Astro
checker adds TypeScript 7 support. All other direct dependencies remain on
their latest stable releases.

## Accessibility

- Remove accessible-name overrides from brand, monster-card, and defense-card
  links when those overrides omit visible link text.
- Let the visible link content participate in each accessible name.
- Keep decorative icons hidden from assistive technology where appropriate.
- Localize natural-star announcements in monster cards.
- Apply the same accessible-name behavior to cards created by client-side
  filtering.

## Catalog pagination

- Render previous and next anchors only when the corresponding destination
  exists.
- Preserve progressive enhancement: server-rendered links work without
  JavaScript, while filtering and browser-history navigation can create or
  remove the appropriate controls dynamically.
- Use event delegation for client-created pagination links and retain normal
  modified-click behavior.
- Never expose a link beyond the first or last catalog page.

## Interface copy and legibility

- Increase the speed-comparison status label from 10 px to the project minimum
  of 12 px while preserving the compact card layout.
- Replace three-period interface ellipses with the single ellipsis character in
  localized search placeholders and similar user-visible copy.

## Security

- Add Cloudflare Pages static response headers through `public/_headers`.
- Apply a pragmatic Content Security Policy limited to the origins and resource
  types used by the static application.
- Retain inline script and style compatibility in this iteration because Astro
  structured data and current bootstrapping use inline content.
- Deny framing and object embedding, prevent MIME sniffing, restrict referrer
  data and browser permissions, and upgrade insecure subresource requests.
- Give fingerprinted Astro assets an immutable long-lived cache policy.
- Escape less-than characters in the embedded monster index JSON so imported
  data cannot terminate its script element.

A nonce- or hash-based strict CSP and the related inline-script architecture
refactor are intentionally outside this change.

## Testing

- Update automated tests for absent boundary pagination links and dynamic
  pagination behavior.
- Add focused assertions for the generated security headers where practical.
- Run `pnpm audit --prod`, `pnpm test`, `pnpm format:check`, `pnpm build`, and
  `pnpm test:e2e`.
- Inspect representative generated HTML for pagination, localized accessible
  text, safe JSON serialization, and copied header configuration.

## Success criteria

- Project instructions describe every published tool as active and enabled.
- Direct dependencies use their latest stable versions and the complete test
  suite passes on them.
- Visible link text is included in accessible names.
- Boundary pages contain no invalid or destinationless pagination anchors.
- No project-owned user-interface label is smaller than the documented 12 px
  minimum in the changed area.
- User-facing loading/search copy uses typographic ellipses.
- Production output includes the intended security and asset-cache headers.
- The embedded monster catalog payload is safely serialized.
