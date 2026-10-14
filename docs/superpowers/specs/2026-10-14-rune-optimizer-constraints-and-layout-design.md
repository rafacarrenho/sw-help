# Rune Optimizer Constraints and Layout Design

## Goal

Simplify the optimizer configuration, derive the account SPD tower from the imported SWEX JSON, and let stat constraints be entered as either total or rune-additional values without changing the optimizer engine's total-stat contract.

## Clean configuration layout

- Remove the repeated border, rounded background, and internal padding from Rune Pool, Stat Constraints, and Combat Speed.
- Keep every section visible in one continuous form.
- Separate sections with typography, whitespace, and a subtle horizontal divider only.
- Preserve responsive stacking and prevent horizontal page overflow.

## Rune Pool

- Keep the existing inventory, locked-rune, and protected-monster controls.
- Add a “Remove all” action beside the protected-monster list.
- The action clears every monster from `excludedMonsterIds` and rerenders the list.
- Disable the action while the protected-monster list is empty.

## Account SPD tower

- Read the modern SWEX `wizard_skill_list` entry whose `skill_id` is `14`.
- Accept both object-map and array representations.
- Convert its level to the in-game Sky Tribe Totem percentage, including level 20 as 15%.
- Store the sanitized level and percentage in `AccountSnapshot`; do not retain unrelated account identifiers.
- Remove the editable SPD tower input from Combat Speed.
- Show the imported percentage as read-only account data and use it in every Tick query.
- Legacy stored snapshots without the field temporarily retain the previous 15% default until the user imports a new JSON.

## Constraint display modes

- Add an “Exclude base stats” checkbox to Stat Constraints.
- With the checkbox off, every constraint is displayed as a total monster stat.
- With the checkbox on, HP, ATK, DEF, and SPD are displayed as rune-additional values.
- CR, CD, RES, and ACC remain total values in both modes.
- The optimizer query continues to receive total values only.

## Floors, caps, and conversion

- Selecting a monster resets constraint minimums to that monster's floors and clears maximums.
- In total mode, the floor for every stat is its monster base value.
- In exclude-base mode, HP, ATK, DEF, and SPD have a floor of zero; CR, CD, RES, and ACC keep their monster base values.
- CR, RES, and ACC retain a hard ceiling of 100.
- Filled minimum and maximum values are clamped to the active floor and ceiling. Blank maximums remain blank.
- Switching modes converts filled HP, ATK, DEF, and SPD values by subtracting or adding the corresponding base value. This preserves the same effective total constraint.
- Presets set semantic total targets first, then display the equivalent value for the active mode.

## Data flow

1. SWEX import normalizes runes, monsters, artifacts, and the SPD tower into a sanitized snapshot.
2. Selecting a catalog monster supplies its base stat floors to the constraint interface.
3. The constraint interface stores displayed values in the selected display mode.
4. Query creation converts rune-additional flat constraints back to total constraints.
5. The optimizer continues to compare completed total stats against total constraint ranges.

## Testing

- Import tests cover object-map and array `wizard_skill_list` forms and confirm level 20 produces 15%.
- Privacy tests confirm unrelated account and session identifiers remain absent.
- Browser tests cover the clean section layout, Remove all, tower readout, monster-populated floors, mode conversion, lower bounds, and percentage caps.
- Existing current/maximum projection, preset, Tick, and result tests continue to pass.
- Validate with `pnpm test`, `pnpm build`, and `pnpm test:e2e`.
