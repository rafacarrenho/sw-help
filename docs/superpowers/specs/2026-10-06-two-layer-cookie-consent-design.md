# Two-layer cookie consent design

Date: 2026-10-06

## Objective

Replace the current single-panel privacy choice with a two-layer experience
inspired by CNN International while retaining PlayerDojo's visual identity and
existing versioned privacy-preference model.

## First layer

The first visit displays a compact, full-width notice with an explanation, a
Privacy Policy link, and exactly two actions:

- `Cookie settings` opens the detailed preference modal without saving;
- `Accept all` enables personalized advertising and optional analytics, saves
  the preference, and closes the notice.

No optional third-party script is loaded merely because the notice or settings
modal is visible. If a provider-documented contextual Adsterra mode is later
configured, its existing loader rules remain unchanged.

## Settings modal

The modal contains three categories:

1. Strictly necessary storage, always active and not editable;
2. Personalized advertising, off by default on a first visit;
3. Analytics, off by default on a first visit.

It includes `Accept all`, `Essential only`, and `Confirm choices` actions.
Confirming saves the two optional toggles as selected. Essential only saves
both optional choices as false. Accept all saves both as true.

Closing the modal behaves differently according to state:

- with no saved preference, close or Escape returns to the first-layer notice;
- with a saved preference, close or Escape dismisses the modal without changing
  the saved values.

The footer privacy-settings action opens the modal directly with the current
choices prefilled.

## Interaction and accessibility

- The modal uses `role="dialog"`, `aria-modal="true"`, an accessible name, and
  a backdrop.
- Opening stores the previously focused element, moves focus into the modal,
  traps Tab and Shift+Tab, and locks background scrolling.
- Escape follows the close behavior above.
- Closing restores focus to the element that opened the modal when possible.
- Toggles use native checkboxes with visible labels and descriptions.
- The desktop modal is centered with an independently scrollable body and fixed
  actions. On small screens it fills nearly the entire viewport.
- Motion respects `prefers-reduced-motion`.

## Data and events

The existing `PrivacyPreferences` version 1 object remains unchanged:

```ts
type PrivacyPreferences = {
  version: 1;
  analytics: boolean;
  personalizedAds: boolean;
  updatedAt: string;
};
```

All save actions continue to emit `playerdojo:privacy-preferences`. Existing
Adsterra and Google Analytics loaders therefore require no consent-state schema
change.

## Failure behavior

- If local storage is unavailable, the choice is applied for the current page
  through the existing event but the notice may return on the next navigation.
- Invalid stored preferences are treated as no saved choice.
- Closing settings never silently saves or changes a preference.
- Repeated clicks cannot inject duplicate analytics or advertising scripts.

## Testing

- First visit shows the notice and keeps optional scripts disabled.
- Accept all saves both optional categories as true.
- Settings opens the modal without saving.
- Essential only saves both optional categories as false.
- Confirm choices preserves the exact toggle combination.
- Closing before the first choice returns to the notice.
- Closing after a saved choice changes nothing and restores focus.
- Footer settings opens the modal directly with saved values.
- Focus trap, Escape, desktop, and mobile behavior are covered by E2E tests.
- Existing advertising and analytics tests continue to pass.

## Out of scope

- Copying CNN branding, layout measurements, or OneTrust assets;
- presenting unused IAB purposes or vendors;
- changing the Adsterra provider strategy or advertising placement;
- introducing an external CMP in this iteration.
