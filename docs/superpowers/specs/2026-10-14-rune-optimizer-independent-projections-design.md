# Rune optimizer: independent current and maximum searches

## Problem

Showing current and maximum totals for the same selected build is misleading. The best runes in their current state can differ from the best runes after projected upgrades, so the two modes must be treated as independent searches rather than two presentations of one build.

## Search behavior

- Keep the explicit “Current / Maximum” selector and default to “Maximum”.
- Run the complete optimization using only the selected projection.
- Apply the selected projection to candidate pruning, constraints, Tick validation, objective scoring, exact-search bounds, and result ordering.
- A current search may return different rune IDs from a maximum search.
- Changing the projection hides the previous results because they belong to a different query.

## Result model

- Return only the calculated stats for the selected projection in each build result.
- Do not return a paired current/maximum build summary.
- Keep the projection on the query so the interface can label the result correctly.
- Continue deriving individual rune upgrade limits from the imported rune data; those limits explain each rune and do not represent a second optimized build.

## Interface

- Show one objective card labeled “Current result” or “Maximum result”.
- For direct stats such as SPD, show the selected build's additional and total values.
- For damage, show only the selected build's estimated damage.
- Restore the compact stats table with `Base`, `Additional`, and `Total` columns for the selected build.
- Do not show current and maximum columns or scores at the same time.

## Compatibility and validation

- Queries without a projection continue to use maximum values.
- Imported snapshots need no migration.
- Unit tests must prove that current and maximum searches can choose different rune IDs, enforce constraints and Tick in the selected mode, and return only selected stats.
- E2E tests must verify a single labeled result, compact table columns, result invalidation when the mode changes, and successful searches in both modes on desktop and mobile.
- Validate with `pnpm test`, `pnpm build`, and `pnpm test:e2e`.
