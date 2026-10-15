# Siege counter coverage and text policy

Date: 2026-10-15
Status: Approved design

## Objective

Expand the Siege Counter catalog with the community counter suggestions approved by the product owner, while allowing build details to be completed incrementally. Remove Unicode U+2014 from the entire repository and prevent it from returning.

## Scope

- Add 20 approved offense compositions covering 18 defenses.
- Add both approved alternatives for Morris / Rex / Shumar and Seara / Jeogun / Lamiella.
- Exclude the 9 counter suggestions explicitly rejected by the product owner.
- Do not add rune sets, turn order, kill order, or Tick values for the new counters yet.
- Preserve existing complete counters and their build details.
- Add localized neutral guidance for every new counter in all supported locales.
- Record the community source for every new counter.
- Replace every existing Unicode U+2014 occurrence in repository text with an ASCII hyphen or context-appropriate punctuation.
- Add documentation and automated enforcement that prohibit Unicode U+2014.

## Data model

Counter definitions may omit `turnOrder`, `runes`, and `tick` while their build is incomplete.

The resolver produces a stable runtime shape:

- missing `turnOrder` becomes an empty array;
- missing `runes` becomes an empty array;
- missing `tick` becomes `null`.

Resolved counters therefore keep arrays for turn and rune data and use `number | null` for Tick. Existing definitions with complete data continue to resolve without changes.

The matchup-level override model follows the same Tick semantics and may explicitly provide a numeric Tick when one is known.

## Presentation

Every absent value in the counter build table is displayed as the single ASCII character `-`.

For an absent Tick:

- each speed cell displays only `-`;
- the interface does not display `Tick -`;
- required additional speed is not calculated.

For a known Tick, the existing `Tick N` label and required-speed calculation remain unchanged.

Missing rune sets and missing turn sequence also display `-`. Existing counter stats and other application placeholders will use the same ASCII placeholder.

## Counter content

Each new counter is a separate counter definition with one matchup. This keeps future rune, order, Tick, and instruction refinements isolated per defense.

The localized instruction is intentionally neutral and identifies the entry as a community suggestion whose build details will be added later. No win rate, validation claim, or undocumented tactical detail will be invented.

No `killOrder` is added in this delivery, including for source suggestions that mention a preferred target. Target priorities can be added during the later build-detail pass requested by the product owner.

## Unicode U+2014 policy

The repository policy in `AGENTS.md` will explicitly forbid Unicode code point U+2014 in source code, content, tests, assets, and documentation. The forbidden glyph will not be written literally in the rule.

An automated unit test will recursively scan repository files while excluding generated, dependency, and Git-internal directories. It will construct the forbidden character with `String.fromCodePoint(0x2014)` so the test does not contain the character it rejects. If the byte sequence is found, the test reports the affected paths and fails.

Existing occurrences in application source, localized content, SVG metadata, tests, and historical design documents will be replaced. Existing assertions will be updated to expect `-`.

## Validation

Automated coverage will verify:

- incomplete counter definitions normalize correctly;
- catalog validation accepts `null` only for an absent Tick and continues validating numeric Tick values;
- missing Tick, rune, sequence, stat, and speed values render or format as `-`;
- the approved counter definition and matchup totals are correct;
- all supported locales cover every counter definition;
- no repository file contains Unicode U+2014.

The completed implementation will be checked with:

1. `pnpm test`
2. `pnpm build`
3. `pnpm test:e2e`

## Expected result

The catalog grows from 4 to 24 counter definitions and from 21 to 41 resolved matchups. The 20 new entries cover 18 previously uncovered defenses. Users receive useful counter compositions immediately, and rune, order, and Tick details can be added later without another schema change.
