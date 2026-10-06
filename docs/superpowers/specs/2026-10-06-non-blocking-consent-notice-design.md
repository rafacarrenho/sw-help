# Non-blocking Consent Notice Design

## Objective

Make the existing first-layer cookie notice non-blocking while preserving every
other consent choice, storage rule, Analytics rule, and Adsterra rule already
implemented.

## Approved behavior

- The notice remains fixed across the bottom of the viewport and visually above
  the site chrome.
- The full-viewport backdrop, background blur, and click interception are
  removed.
- Page scrolling, links, sidebar controls, the mobile drawer, and dropdown menus
  remain usable while the notice is visible.
- The notice persists across navigation until the visitor records a choice.
- `Accept all` remains the initial focused control, as previously approved.
- Keyboard focus is no longer trapped inside the notice, because the page is
  navigable. After the notice controls, normal document tab order resumes.
- The first layer is no longer exposed as an `aria-modal` dialog.
- `Cookie settings` continues to open the detailed settings modal. That modal
  remains blocking, keeps its backdrop and blur, traps focus, and supports
  closing without saving.

## Unchanged behavior

The two first-layer actions, detailed categories, saved preference schema,
footer settings action, Google Analytics loading, and contextual/personalized
Adsterra selection do not change.

## Validation

Extend the consent browser tests to confirm that the notice does not lock body
scrolling, does not cover the top of the viewport, and does not trap keyboard
focus. Retain the existing modal focus tests, then run `pnpm test`, `pnpm build`,
and `pnpm test:e2e`.
