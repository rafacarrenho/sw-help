# Responsive Navigation Refactor

## Objective

Give the application more usable horizontal space on desktop and replace the
current stacked mobile navigation with an accessible off-canvas menu.

## Desktop behavior

- The sidebar starts expanded at 264 px when the user has not chosen a state.
- A control inside the sidebar toggles between the expanded state and a compact
  80 px state.
- The compact state keeps the brand symbol and navigation icons visible while
  hiding labels, badges, group labels, and supporting content.
- Active, disabled, hover, focus, and tooltip/accessible-label behavior remain
  understandable when only icons are visible.
- The workspace margin follows the sidebar width with the same short motion.
- The desktop preference is persisted in `localStorage`, so full-page navigation
  and later visits preserve the expanded or compact state.
- A small script in the document head restores the compact class before paint,
  avoiding an expanded-to-compact layout flash. Storage access is guarded so
  privacy restrictions fall back safely to the expanded state.

## Mobile behavior

- At 760 px and below, the sidebar starts closed and no longer occupies page
  space.
- Mobile ignores the persisted desktop preference and always starts closed.
- A sticky mobile header contains a compact brand and a menu button.
- Opening the menu slides an up-to-320 px drawer from the left above the page
  and adds a dark backdrop over the remaining content.
- The expanded drawer preserves the desktop navigation hierarchy and supporting
  information in a mobile-sized layout.
- The drawer closes through its close button, backdrop click, Escape key, or
  navigation to another page.
- While open, background scrolling is locked and focus is moved into the drawer;
  on close, focus returns to the menu trigger.

## Structure

- Keep navigation markup centralized in `src/layouts/Layout.astro`.
- Add explicit controls, state hooks, and a small inline controller without
  introducing a framework dependency.
- Keep layout and responsive presentation in `src/styles/global.css` using
  state attributes/classes and CSS custom properties.
- Extend `src/components/Icon.astro` only for any navigation-control glyphs.

## Accessibility and resilience

- Toggle buttons expose `aria-expanded`, `aria-controls`, and descriptive names.
- The backdrop is not a second unlabeled control; the drawer retains a visible
  close button.
- Motion respects `prefers-reduced-motion`.
- With JavaScript disabled, desktop navigation remains expanded and mobile
  navigation remains available through a CSS fallback rather than becoming
  unreachable.

## Verification

- Add end-to-end coverage for desktop collapse/expand and initial state.
- Add mobile coverage for open/close, backdrop, Escape, scroll lock, and focus
  restoration.
- Run `pnpm test`, `pnpm build`, and `pnpm test:e2e` after the build.

## Control and tooltip refinement

- In the expanded desktop sidebar, the collapse control belongs to the same
  header row as the brand and aligns to its right edge.
- In the compact desktop sidebar, the control moves below the centered brand
  symbol and shares the same horizontal center as every navigation icon.
- Compact navigation items expose a styled tooltip to the right on both hover
  and keyboard focus. A single tooltip layer is positioned outside the sidebar
  so it is not clipped by scrolling, and its text is associated with the active
  item through `aria-describedby`.
- The mobile header uses a balanced three-column layout: menu trigger on the
  left, brand centered, and an equal spacer on the right. This matches the
  left-hand origin of the drawer.
- Mobile keeps a visible close control inside the drawer and returns focus to
  the left-hand trigger when closing.
