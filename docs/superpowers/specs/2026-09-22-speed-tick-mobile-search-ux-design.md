# Spd Tick Mobile Search UX

## Objective

Improve the monster search combobox on mobile so the open keyboard leaves useful
space for the result list and closes after a monster is selected. Desktop
behavior must remain unchanged.

## Interaction design

- On viewports up to 820 px wide, focusing the monster search smoothly scrolls
  the monster field toward the top of the viewport.
- The scroll target is the complete monster selector, with a top margin that
  keeps it visible below the fixed mobile header.
- Selecting a monster by pointer or Enter updates the selected monster, closes
  the dropdown, and removes focus from the search input. Removing focus lets
  mobile browsers dismiss the virtual keyboard.
- Escape retains its current behavior: it closes the dropdown without changing
  the selected monster or forcing a blur.
- Viewports wider than 820 px retain the current focus and scrolling behavior.

## Implementation

- Add a mobile-only `scroll-margin-top` rule to the monster selector.
- Add a small focus helper in `src/pages/spd-tick.astro` that checks the same
  820 px media query and schedules `scrollIntoView` for the next animation
  frame. Scheduling it avoids scrolling before the focus layout settles.
- Extend the existing `selectMonster` function to blur the search input after
  closing the options, so both pointer and keyboard selection share the same
  behavior.

## Accessibility and reduced motion

- Keep the existing combobox roles, expanded state, active descendant, and
  keyboard navigation intact.
- Use instant scrolling when the user requests reduced motion; otherwise use a
  smooth scroll.
- Do not blur while typing, navigating options, or dismissing with Escape.

## Verification

- Add an end-to-end assertion that pointer selection removes focus and closes
  the listbox.
- Add an end-to-end mobile test that focusing the search scrolls the selector
  below the mobile header.
- Add an end-to-end desktop assertion that focusing the search does not trigger
  page scrolling.
- Run `pnpm test`, `pnpm build`, and `pnpm test:e2e` after building.
