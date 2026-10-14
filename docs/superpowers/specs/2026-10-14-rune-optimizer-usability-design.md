# Rune Optimizer Usability Design

## Goal

Make the optimizer easier to understand and operate by replacing the projection radio group with one explicit maximum-potential option, keeping configuration sections visible, and preventing percentage stats with a hard cap from accepting values above 100.

## Projection control

- Replace the current/maximum radio group and its “Calculate using” legend with one checkbox.
- The checkbox label is “Max property potential” in English and is localized in every supported locale.
- Checked means the optimizer evaluates every rune at its maximum attainable property values.
- Unchecked means the optimizer evaluates the rune values exactly as they are now.
- The checkbox is checked by default, preserving the current default behavior.
- Changing it clears any previous result so a result from one projection is never presented as the other.
- The optimizer query continues to use `potential` and `current` internally; only the user-facing control changes.

## Open configuration sections

- Remove the collapsible `details` containers around Rune Pool, Stat Constraints, and Tick.
- Render each group as an always-visible section with a heading, clear spacing, and a subtle divider or panel boundary.
- Preserve all existing controls and behavior inside each group.
- Use responsive layout rules so controls stack cleanly on small screens and avoid horizontal page overflow.
- Native selects used to choose sets, monsters, and Tick values remain selects; “remove dropdowns” refers to the collapsible configuration panels.

## Percentage caps

- CR, RES, and ACC constraint inputs receive an HTML maximum of 100.
- Values typed or pasted above 100 are clamped to 100 before a query is built.
- Presets and programmatic updates use the same normalization path.
- The query builder also clamps these three values as a defensive boundary.
- The calculation engine retains its existing result caps, ensuring computed CR, RES, and ACC never exceed 100.
- Other stats keep their existing ranges.

## Accessibility and interaction

- The potential checkbox remains keyboard accessible and has a visible focus state.
- Each open section uses a semantic heading associated with its controls.
- Existing field labels, status announcements, and calculation cancellation behavior remain intact.
- Projection controls are disabled while a calculation is running and restored when it finishes.

## Testing

- Unit tests verify CR, RES, and ACC results remain capped at 100.
- Browser tests verify the maximum-potential checkbox is checked by default and selects the potential projection.
- Browser tests switch it off, verify stale results are cleared, and verify the current projection is used after recalculation.
- Browser tests verify the three constrained percentage inputs expose and enforce a maximum of 100.
- Browser tests verify Rune Pool, Stat Constraints, and Tick are visible without expandable containers.
- Run `pnpm test`, `pnpm build`, and `pnpm test:e2e`.
