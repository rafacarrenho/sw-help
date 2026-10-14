# Rune optimizer: current and maximum values

## Goal

Make it explicit whether the optimizer is evaluating runes as they are now or at their maximum projected state, while showing both outcomes for every selected build.

## Interaction

- Add an explicit segmented control labeled “Calculate using” with “Current” and “Maximum” options.
- Default to “Maximum” to preserve the optimizer's existing behavior.
- Use the selected mode for the objective, stat constraints, Tick validation, candidate pruning, ranking, and exact-search bounds.
- Keep the selected mode when applying rune or stat presets.
- A build returned by a “Current” search is the best build for current values; its maximum values are informational. A “Maximum” search does the inverse.

## Value definitions

- **Current** uses each rune's current main-stat value, existing innate stat, current substats, and existing grinds.
- **Maximum** projects the main stat to +15 and raises existing grindable substats to the maximum applicable normal or Ancient grind.
- Neither mode invents rolls, changes substats, applies gems, or changes rune sets.
- Set bonuses apply equally to both states because the selected runes and completed sets are the same.

## Results

- Each result shows a compact pair of objective summaries labeled “Current” and “Maximum”.
- The state used to rank the search is visually highlighted.
- SPD and other direct-stat objectives show additional and total values in both states.
- Estimated damage shows the current and maximum estimated damage values side by side using the existing formula.
- The stats table contains four value columns: current additional, current total, maximum additional, and maximum total.
- The table remains horizontally scrollable on narrow screens and uses readable labels rather than relying on color alone.

## Data and optimizer changes

- Extend `OptimizerQuery` with a projection mode (`current` or `potential`).
- Preserve both current and potential vectors on every rune candidate.
- Select the active vector from the query mode for all pruning and search calculations.
- Accumulate both vectors for a completed build, apply identical set bonuses, and return both `current` and `potential` stat totals.
- Store `objectiveValue` for the selected search mode so result ordering and bounds remain internally consistent.

## Error handling and compatibility

- Existing callers that do not specify a projection mode use `potential`, preserving current behavior.
- Existing imports and local snapshots require no migration.
- Empty-result and cancellation behavior remain unchanged.

## Validation

- Unit tests cover default maximum behavior, current-mode selection, constraints and Tick evaluation in both modes, and both values on returned builds.
- E2E coverage verifies the two-state selector and the paired result labels.
- Run `pnpm test`, `pnpm build`, and `pnpm test:e2e` after generating the build.
