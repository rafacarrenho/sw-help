# Speed Tick Monster Combobox Design

## Objective

Replace the native monster select and its detached preview with a searchable,
accessible combobox. The user can type a monster name, see matching monsters
with portraits, and select one without losing the existing tower and speed
leader filters.

## Default state

- No monster is selected when the page loads.
- The search field is empty and uses `Buscar monstro` as its placeholder.
- The selected-monster summary reads `Nenhum monstro selecionado` and keeps a
  64×64 portrait frame visible with a neutral `?` placeholder. This frame has
  the same dimensions as a selected monster portrait to prevent layout shift.
- Tick calculations use 100 as the base monster speed until a result is
  explicitly selected.
- Tower SPD and speed leader filters remain fully functional in this state.

## Search and results

- The monster field is an editable search input with combobox semantics.
- Opening or focusing an empty field displays the complete monster catalog,
  sorted alphabetically by name.
- Searching filters that catalog in the frontend from the first typed
  character and matches both the awakened name and the original unawakened
  name without distinguishing uppercase, lowercase, or accents.
- The popup viewport displays exactly six fixed-height monster rows. Additional
  results remain available through vertical scrolling.
- The list is virtualized: only the visible rows and a small overscan buffer are
  mounted in the DOM. A spacer preserves the full scroll range, so displaying
  the complete catalog does not create thousands of option elements or image
  requests at once.
- Every result contains the monster portrait and primary name. Awakened forms
  also display the original unawakened name underneath in compact secondary
  text; forms without an earlier awakening do not repeat their own name. An
  image fallback is shown if the portrait cannot load.
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
  the neutral portrait placeholder returns, and calculations return to base
  speed 100.
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
  result, and `Escape` closes the popup. Keyboard navigation scrolls and mounts
  virtualized options as necessary.
- Pointer selection works without the input blur discarding the chosen result.
- Clicking outside the component closes the popup without creating a
  selection.
- The active option has a visible state, and existing readable text-size and
  focus standards remain intact on desktop and mobile.

## Implementation boundaries

- The existing serialized monster catalog remains the source for IDs, names,
  base speed, portrait URLs, and awakening relationships. The unawakened name
  is resolved by following `awakensFrom` to the root form, which also supports
  second-awakened monsters.
- Search normalization and result rendering run entirely in the frontend;
  there are no network requests.
- Scroll-driven virtual rendering is batched with `requestAnimationFrame`.
- Result elements are created with DOM APIs and monster names are assigned with
  `textContent`.
- The existing tower and speed leader controls, table columns, and calculations
  keep their current behavior.
- On mobile, the monster control occupies the complete first row. Tower SPD and
  speed leader share the second row in two equal-width columns. Desktop keeps
  the existing three-column layout.
- Only Tick 5 and Tick 6 rows receive the special visual highlight. Tick 4
  remains a normal table row in both the initial server-rendered table and
  client-side recalculations.

## Validation

- Unit tests continue to cover the Tick calculations and speed leader values.
- End-to-end coverage verifies the base-100 initial state, the full catalog on
  empty focus, the six-row viewport, virtualized scrolling, accent-insensitive
  matching by awakened and unawakened names, compact secondary names, portrait
  results, keyboard selection, pointer selection, no-results state, clearing a
  selection, the stable portrait frame, tower changes, speed leader filtering,
  image fallback, and mobile overflow.
- End-to-end coverage also verifies the mobile filter grid and that only Tick 5
  and Tick 6 have the special row class before and after recalculation.
- Run formatting, `pnpm test`, `pnpm build`, and the Speed Tick end-to-end tests.
- Inspect desktop and mobile screenshots after the automated checks.
