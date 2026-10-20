# Rune Optimizer SEO Design

## Goal

Bring the Rune Optimizer to the same search-intent and FAQ standard as the
other Summoners War tools. The page should explain what the optimizer does,
what data it uses, how local processing works, and which constraints affect a
build without making performance or result guarantees.

## Options considered

### 1. Metadata only

Update the title and description without adding visible content. This is a
small change, but it would leave common player questions unanswered and would
not match the other tool pages.

### 2. Rune Optimizer specific component

Create a dedicated FAQ and related-links section. This allows custom markup,
but duplicates the shared SEO component and bypasses the existing locale
parity validation.

### 3. Extend the shared SEO content system (selected)

Add Rune Optimizer content to the existing localized SEO collection, render it
with `SeoContent`, and include it in FAQ parity checks. This preserves the same
semantics, responsive layout, internal-link behavior, and validation used by
the other tools.

## Content and metadata

- Use a localized title that includes both Summoners War and the Rune Optimizer
  intent.
- Use a localized description that mentions SWEX JSON, exact builds, local
  processing, and the player's own runes where the language reads naturally.
- Add two explanatory paragraphs about importing data, choosing a monster,
  selecting sets and constraints, and reviewing current or maximum potential.
- Add ten localized FAQs covering SWEX import, privacy, exact combinations,
  equipped and locked runes, required sets, constraints, base stats, maximum
  potential, Tick requirements, and the limits of the result.
- Add links to monster research, Spd Tuning, and the Tick calculator.

## Technical behavior

- Keep canonical URLs, hreflang, sitemap entries, breadcrumbs, and the existing
  `WebApplication` structured data unchanged because they already include the
  Rune Optimizer routes.
- Render all guide and FAQ content in static HTML through the shared Astro
  component.
- Do not add `FAQPage` structured data or promise a rich result. The visible FAQ
  is intended for users and indexable page content.
- Keep imported game skill names and descriptions out of this content. All new
  text is original PlayerDojo editorial copy.

## Validation

- Add Rune Optimizer to the FAQ parity matrix so every locale must provide ten
  complete entries.
- Extend SEO browser tests with the five localized optimizer routes and the
  English title assertion.
- Run `pnpm test`, `pnpm build`, and `pnpm test:e2e` after the production build.

## Self-review

The design contains no placeholders or unsupported claims. It reuses the
existing architecture, covers all five published locales, and is limited to
Rune Optimizer SEO content, metadata, rendering, and regression tests.
