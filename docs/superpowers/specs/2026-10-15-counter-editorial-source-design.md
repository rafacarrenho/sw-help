# Counter Editorial Source Design

## Context

Siege counters are editorial content maintained by PlayerDojo. External pages may inspire research, but they are not the published source of a counter and must not be presented as attribution on counter pages.

The current counter model still carries a `sources` collection through the canonical data, matchup overrides, resolved counter type, validation, and Siege detail interface. This creates a visible section that conflicts with the editorial ownership rule.

Historical and technical documentation may continue recording research references when that context helps future maintainers. This change is limited to the counter product model and its user-facing content.

## Decision

Remove source attribution from Siege counters as a product capability.

- Counter definitions will not accept a `sources` field.
- Matchup overrides will not accept a `sources` field.
- Resolved and localized counter objects will not expose source metadata.
- The Siege detail page will not render a Sources section for counters.
- Canonical counter data will contain no source entries.
- Counter-focused SEO copy will no longer promise external source attribution.
- Historical design documents will remain unchanged.

Monster acquisition sources and other unrelated uses of source metadata remain in place.

## Data migration

Every `sources` property will be removed from `src/data/counters.json`, including empty collections and populated external links. No replacement field or implicit attribution string will be added.

The counter types and resolver will be simplified so new source metadata cannot be passed through the application accidentally. Catalog validation will reject a counter definition or matchup override that contains the removed field, protecting the model at runtime even when untyped JSON is supplied.

## Interface and content

The counter card on the Siege detail page will end after its strategy and build information. It will have no source heading, list, or outbound attribution link.

Localized Siege message keys used only by the removed section and CSS selectors used only by its presentation will be removed. SEO descriptions in all supported locales will describe counter details without mentioning external references.

## Repository guidance

`AGENTS.md` will state that PlayerDojo is the editorial source for Siege counters and that counter data and interfaces must not add source fields, source sections, or external attribution links. The rule will explicitly allow historical and technical documentation to preserve research context.

## Verification

Automated coverage will verify that:

- Counter data contains no `sources` property.
- Counter validation rejects the removed property at both definition and matchup override levels.
- Resolved counters do not expose source metadata.
- A counter page does not render the removed heading or an external attribution link.
- Existing counter resolution, localization, catalog, and navigation behavior remains valid.

The complete change will be checked with `pnpm test`, `pnpm build`, and `pnpm test:e2e`.
