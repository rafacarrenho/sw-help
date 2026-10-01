# Sitewide SEO and search-intent content design

## Goal

Improve organic discovery for English and Brazilian Portuguese searches related
to Summoners War tools, especially long-tail searches for Siege counters, monster
information, SPD tuning, SPD comparison, and SPD tick breakpoints. The work must
remain useful to players, accurate about the tool limitations, and consistent
with the existing bilingual static Astro architecture.

## Options considered

### 1. Metadata-only update

Rewrite titles and descriptions and leave page content unchanged. This is low
risk, but Google primarily builds snippets from visible page content and the
short tool pages would still answer few long-tail questions.

### 2. Many query-specific landing pages

Create separate pages for every keyword variation. This could increase URL
coverage, but would duplicate thin content and conflict with Google's guidance
against scaled search-engine-first pages.

### 3. Intent-rich canonical pages (selected)

Strengthen each existing canonical page with a distinct title, description,
clear explanatory copy, ten relevant questions and answers, and contextual
internal links. Add only structured data that accurately describes the site and
navigation. This concentrates authority on the URLs that already represent the
tools and gives players substantive answers without keyword stuffing.

## Search intent map

| Page            | Primary intent                          | Long-tail topics covered                                                   |
| --------------- | --------------------------------------- | -------------------------------------------------------------------------- |
| Home            | Summoners War tools                     | SW tools, Siege planning, monster database, SPD calculators                |
| Siege Counter   | Find an offense for a Siege defense     | Summoners War Siege counter, 4-star tower, open tower, runes, turn order   |
| Monster Catalog | Research a Summoners War monster        | monster database, base stats, skills, leader skill, element, family        |
| SPD Tuning      | Keep a team in turn order               | Summoners War speed tuning, minimum rune SPD, Arena, Siege, RTA, ATB boost |
| SPD Comparison  | Compare first-turn structural advantage | base SPD comparison, Swift, leader skill, SPD tower, rune tolerance        |
| SPD Tick        | Calculate speed breakpoints             | Summoners War tick calculator, Tick 4, Tick 5, Tick 6, bonus SPD           |
| Monster detail  | Research one named monster              | name, element, skills, stats, family, acquisition, Siege uses              |
| Siege detail    | Counter one named defense               | defense monster names, registered offenses, runes, stats, sequence         |

The official game name is always written as “Summoners War.” “SW” is used only
as a natural abbreviation, not repeated as a keyword list. No `meta keywords`
tag is added because it would not help Google Search.

## Page changes

- Give every main page a concise, localized title that identifies both the tool
  and Summoners War. Paginated catalog pages receive their page number.
- Expand every meta description into a unique summary of the specific task a
  visitor can complete.
- Rewrite hero and section copy so visible content supports the same intent as
  the title and description.
- Add a reusable, server-rendered SEO content section to each tool page. It has
  an explanatory heading, two concise paragraphs, ten visible FAQ answers, and
  contextual links to adjacent tools.
- Keep disclaimers explicit: example counters are not competitive validation,
  and calculator output cannot model every battle effect.
- Improve detail-page titles and descriptions programmatically with the actual
  monster or defense names.

## Technical SEO

- Preserve the current canonical URL, hreflang, sitemap, robots, and static HTML
  behavior.
- Add `og:site_name`, image preview/snippet crawler directives, and matching
  social metadata.
- Add `WebSite` JSON-LD on each localized home page to identify the site name.
- Add `BreadcrumbList` JSON-LD on internal pages using the same canonical
  localized routes shown in the interface.
- Do not add FAQ rich-result promises. Google currently limits regular FAQ rich
  results mainly to authoritative government and health sites; the FAQ content
  exists to help users and provide indexable answers.

## Content and component boundaries

- `src/data/seo-content.ts` owns localized explanatory copy and FAQ data.
- `src/components/SeoContent.astro` owns semantic rendering and related links.
- Existing page components choose the appropriate content and localized routes.
- `Layout.astro` remains the single owner of head metadata and global structured
  data.

## Accessibility and responsive behavior

FAQ answers remain present and visible in static HTML rather than depending on
JavaScript. Questions use heading elements in a labeled section. Text stays at
the existing 16 px body and 14 px secondary minimums, with a one-column mobile
layout and a two-column desktop FAQ grid.

## Validation

- Unit tests must continue to pass.
- Add E2E SEO assertions for unique titles, descriptions, canonical/hreflang,
  structured data, ten localized FAQs per tool page, and paginated titles.
- Run `pnpm test`, `pnpm build`, and `pnpm test:e2e` against the production build.
- Inspect representative generated HTML to confirm that FAQ answers and JSON-LD
  are server-rendered and that no duplicate title suffix is introduced.

## Self-review

The design contains no placeholders. Scope is limited to current canonical
pages, shared metadata, visible content, and validation. It explicitly avoids
new thin landing pages, unverifiable performance claims, invented win rates,
and unsupported rich-result guarantees.
