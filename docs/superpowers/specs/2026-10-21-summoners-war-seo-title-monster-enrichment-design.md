# Summoners War SEO Titles and Monster Enrichment Design

## Goal

Improve organic click-through rate and the value of existing indexed pages
without reducing sitemap coverage. Titles should clearly identify the game and
the page intent, while monster pages should answer useful factual questions
using data already available in the project.

## Title standard

- Use the exact game name `Summoners War` in searchable page titles. Do not use
  `Summoners Wars` or rely on the ambiguous abbreviation `SW` as the primary
  game identifier.
- Format Siege defense titles as
  `Monster A + Monster B + Monster C: Summoners War Siege Defense` before the
  layout appends the `PlayerDojo` brand.
- Do not include the number of counters in the title because that value changes
  and is not the main search intent.
- Format monster titles with the monster name, element, family, game name, and
  page value. Localize the value phrase while preserving `Summoners War`.
- Keep descriptions factual and useful even when a defense has no registered
  counter.

## Monster page enrichment

Each monster page will add a short, localized summary based on existing catalog
data: natural stars, element, archetype, family, base SPD, skill count, and
registered Siege usage. It will not invent builds, win rates, recommendations,
or validation.

A dedicated overview section will expose the main skill mechanics already
imported from SWARFARM. Imported mechanic names remain in English and receive
the appropriate `lang="en"` marker on non-English pages.

## Contextual tool links

Monster pages will link directly to relevant calculators:

- SPD Tick with the current monster selected;
- SPD Comparison with the current monster selected as the ally;
- SPD Tuning with the current monster selected in the first slot;
- Rune Optimizer as the next step for account-based rune analysis.

These links strengthen internal navigation and let the user continue from
research to a concrete calculation without another catalog search.

## Scope and compatibility

- Preserve all existing monster and Siege URLs, canonicals, hreflang entries,
  structured data, and sitemap entries.
- Apply the content and title patterns to all five published locales.
- Preserve the existing visual hierarchy and mobile legibility requirements.
- Keep all content static and frontend-only.

## Validation

- Add title assertions for monster and Siege detail pages.
- Add browser coverage for the factual summary, imported mechanic language,
  and preselected calculator links.
- Run `pnpm test`, `pnpm build`, and `pnpm test:e2e` against the production
  build.

## Self-review

The design keeps the full sitemap, creates unique value from existing factual
data, avoids unsupported recommendations, and uses the full game name for a
less ambiguous search signal. It does not change routes or imported SWARFARM
content.
