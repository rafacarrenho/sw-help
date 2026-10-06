# Blocking Consent Layer Design

## Objective

Keep the first-layer privacy choice visually and interactively above every part
of PlayerDojo, including the desktop sidebar, mobile drawer, navigation
backdrop, and dropdown menus. A visitor must record a privacy choice before
using the site, while retaining a genuine path to continue with essential
storage and contextual advertising only.

## Chosen approach

Wrap the existing compact consent notice in a viewport-sized blocking layer.
The layer uses a dimmed backdrop and a stacking level higher than every site
navigation surface. The notice remains anchored to the bottom of the viewport
and keeps the existing two first-layer actions:

- `Cookie settings` opens the detailed preferences modal.
- `Accept all` stores both optional categories as enabled.

The settings modal remains above the blocking layer and continues to provide
`Accept all`, `Essential only`, and `Confirm my choices`. This preserves a
freely selectable non-personalized path while requiring the visitor to make an
explicit choice before navigating.

## Interaction and accessibility

- While no preference exists, background scrolling and pointer interaction are
  blocked.
- When the first layer appears, keyboard focus starts on `Accept all`, the
  primary action. Leaving focus unset was rejected because the surface is modal
  and the background is unavailable to keyboard users.
- Keyboard focus is contained within the first-layer notice. `Tab` and
  `Shift+Tab` cycle through its privacy-policy link and two actions.
- `Escape` does not dismiss the first layer because doing so would restore an
  undecided, interactive page.
- Opening settings transfers focus into the modal. Closing settings without a
  saved preference restores the blocking first layer and returns focus to the
  settings button.
- Once a choice is stored, both blocking surfaces disappear, background
  scrolling is restored, and focus returns to the initiating control when
  appropriate.
- Reopening preferences from the footer opens only the settings modal; it does
  not recreate the mandatory first-visit layer because a choice already exists.

## Responsive behavior

On desktop, the backdrop covers the entire viewport, including the sidebar,
while the notice spans the viewport bottom. On mobile, the same backdrop covers
the header and drawer; the notice keeps its stacked full-width buttons. The
detailed settings modal remains full-screen on small viewports.

## Implementation boundaries

- Update `PrivacyConsent.astro` to manage the new first-layer wrapper, focus
  containment, and body locking state.
- Update `global.css` so the first layer and settings modal form the highest
  stacking hierarchy in the application.
- Do not change the stored privacy preference schema, Analytics loading rules,
  or Adsterra selection logic.
- Extend the consent end-to-end tests to verify background interception, focus
  containment, Escape behavior, settings transitions, and scroll restoration.

## Validation

Run `pnpm test`, `pnpm build`, and the consent-focused Playwright tests on both
desktop and mobile. Inspect the first layer and modal visually at both viewport
sizes, then run the full end-to-end suite after the production build.
