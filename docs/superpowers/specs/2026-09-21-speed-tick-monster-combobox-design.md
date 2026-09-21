# Speed Tick Monster Combobox Design

## Objective

Replace the native monster select and its detached preview with a searchable,
accessible combobox. The user can type a monster name, see matching monsters
with portraits, and select one without losing the existing tower and speed
leader filters.

## Default state

- No monster is selected when the page loads.
- The search field is empty and uses `Buscar monstro` as its placeholder.
- The selected-monster summary reads `Nenhum monstro selecionado` and does not
  display a portrait.
- Tick calculations use 100 as the base monster speed until a result is
  explicitly selected.
- Tower SPD and speed leader filters remain fully functional in this state.

## Search and results

- The monster field is an editable search input with combobox semantics.
- Opening or focusing an empty field displays `Digite para buscar` instead of a
  full unfiltered monster list.
- Searching begins with the first typed character and matches monster names
  without distinguishing uppercase, lowercase, or accents.
- At most eight matches are displayed at once.
- Every result contains the monster portrait and name. An image fallback is
  shown if the portrait cannot load.
- A query without matches displays `Nenhum monstro encontrado`.
- The detached portrait previously displayed beside the native select is
  removed.

## Selection and calculation flow

- A result can be selected with mouse, touch, or the keyboard.
- Selecting a result fills the input with the monster name, closes the result
  list, displays the portrait and name in the selected-monster summary, and
  recalculates the table with that monster's base speed.
- Editing or clearing the input after a selection immediately clears the
  confirmed selection. The summary returns to `Nenhum monstro selecionado`,
  the portrait is hidden, and calculations return to base speed 100.
- Text that merely matches a monster name is not considered selected until the
  user confirms a result.
- Changing tower SPD or speed leader continues to preserve the current monster
  selection, when one exists.

## Keyboard and accessibility behavior

- The input exposes `role="combobox"`, `aria-autocomplete="list"`,
  `aria-expanded`, `aria-controls`, and the active option through
  `aria-activedescendant`.
- The popup uses listbox and option semantics.
- `ArrowDown` and `ArrowUp` navigate results, `Enter` confirms the active
  result, and `Escape` closes the popup.
- Pointer selection works without the input blur discarding the chosen result.
- Clicking outside the component closes the popup without creating a
  selection.
- The active option has a visible state, and existing readable text-size and
  focus standards remain intact on desktop and mobile.

## Implementation boundaries

- The existing serialized monster catalog remains the source for IDs, names,
  base speed, and portrait URLs.
- Search normalization and result rendering run entirely in the frontend;
  there are no network requests.
- Result elements are created with DOM APIs and monster names are assigned with
  `textContent`.
- The existing tower and speed leader controls, table columns, and calculations
  keep their current behavior.
- The current responsive filter layout remains: monster and tower controls
  share the first row on mobile, while the speed leader control occupies the
  next row.

## Validation

- Unit tests continue to cover the Tick calculations and speed leader values.
- End-to-end coverage verifies the base-100 initial state, empty-search hint,
  accent-insensitive matching, portrait results, keyboard selection, pointer
  selection, no-results state, clearing a selection, tower changes, speed
  leader filtering, image fallback, and mobile overflow.
- Run formatting, `pnpm test`, `pnpm build`, and the Speed Tick end-to-end tests.
- Inspect desktop and mobile screenshots after the automated checks.
