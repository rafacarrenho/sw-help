# Speed Tick Mobile Emblem Alignment Design

## Objective

Keep the existing Speed Tick emblem composition and visual weight while
correcting the misalignment between its rounded SPD block and rotated decorative
squares on mobile viewports.

## Cause

Below 760 px, the shared `.intro-emblem` container becomes 90×90 pixels, while
the Speed Tick-specific `.speed-tick-icon` remains 110×110 pixels. The grid's
intrinsic track starts the larger child at the container's top-left corner,
placing the child center 10 pixels to the right and below the decorative center.

## Design

- Preserve the 110×110 rounded SPD block and the existing rotated squares.
- On viewports up to 760 px, position `.speed-tick-icon` from the center of its
  `.intro-emblem` parent with 50% coordinates and a -50% translation.
- Scope the correction to `.speed-tick-icon`; the shared Siege Counter emblem
  remains unchanged.
- Keep the existing behavior that hides the emblem at 460 px and below.

## Validation

- Verify equal horizontal and vertical centers at 461, 500, 600, and 760 px.
- Confirm the page creates no horizontal overflow.
- Inspect mobile screenshots to ensure the rounded block and rotated squares are
  visually concentric.
- Run formatting, unit tests, build, and the Speed Tick end-to-end tests.
