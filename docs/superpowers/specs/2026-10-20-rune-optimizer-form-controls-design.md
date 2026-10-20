# Rune Optimizer Form Controls Design

## Goal

Make read-only and disabled controls look like the normal Rune Optimizer form
fields while keeping their unavailable state clear, and give native selects a
cleaner arrow with comfortable right spacing.

## Options considered

### 1. Keep native controls and only change padding

This is the smallest change, but browser-specific select arrows remain visually
inconsistent and can still sit too close to the edge.

### 2. Build custom select components

Custom popovers would provide full visual control, but add JavaScript,
accessibility responsibilities, and interaction risk without improving the
selection behavior requested here.

### 3. Standardize the existing controls with CSS (selected)

Keep native select behavior, hide only the browser arrow, and add a small
background chevron at a controlled position. Style the account-derived SPD
tower display with the same surface, border, radius, and spacing as an input,
then reduce opacity to indicate that it is read-only. Apply the same opacity and
cursor treatment to actual disabled inputs and selects.

## Visual behavior

- Selects reserve 42 px on the right for the arrow.
- The 12 by 8 px arrow is centered 14 px from the right edge and uses the muted
  text color.
- The SPD tower display keeps its value and source on one line where space
  permits, with a 12 px gap between them.
- The SPD tower display uses the same 44 px minimum height, input background,
  border, and 10 px radius as editable fields.
- Read-only and disabled controls use reduced opacity without changing to a
  flat underline or a different fill.
- Mobile layout continues to stack the Tick controls in one column.

## Accessibility and testing

- Native select semantics and keyboard behavior remain unchanged.
- Disabled controls keep the native disabled state and use a not-allowed cursor.
- Existing focus-visible outlines remain intact.
- Browser tests verify the select appearance, right padding, arrow background,
  and input-like SPD tower presentation.
- Run `pnpm test`, `pnpm build`, and `pnpm test:e2e` after implementation.

## Self-review

The design contains no placeholders, behavior changes, or new component state.
It is limited to the Rune Optimizer controls shown in the reported issue and
uses the existing form dimensions and color tokens.
