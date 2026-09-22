# Speed Tick Calculation Correction Design

## Objective

Correct the rune-speed requirement displayed by Speed Tick so it matches the
game's combat-speed rounding and the reference calculator supplied by the user.
Add support for monsters using a Swift rune set without changing the existing
Tick, tower, leader, or monster-selection flows.

## Research findings

- Normal combat adds 7% of combat speed to the attack bar per Tick. The existing
  integer breakpoints remain valid: 477, 358, 286, 239, 205, 179, 159, 143, and
  130 SPD for Tick 3 through Tick 11.
- Tower and leader percentages stack additively against base SPD. They must not
  be applied as sequential multipliers.
- Combat SPD rounds upward after base SPD, percentage bonuses, and flat rune SPD
  are combined.
- Swift contributes exactly 25% of base SPD internally. The green SPD displayed
  by the game includes the Swift contribution rounded upward, so calculations
  that accept or return green SPD must remove that display-only rounding excess.
- The reference calculator implements this convention with a `swiftPenalty`.
  The closed-form equation below was compared against its search loop across
  2,430 combinations with no differences.

Research references:

- https://00peanuts.pages.dev/apps/sw-tick-calculator/
- https://00peanuts.pages.dev/apps/sw-tick-calculator/js/app.js
- https://swcalc.cz/game-mechanics
- https://www.foosw.com/speed_tuner

## Calculation

For integer base SPD, tower percentage, leader percentage, and displayed green
SPD:

```text
towerLeader = base × (tower + leader) / 100
swiftExact = base × 25 / 100
swiftPenalty = usesSwift ? ceil(swiftExact) - swiftExact : 0
combatWithoutGreen = ceil(base + towerLeader - swiftPenalty)
requiredGreen = max(0, breakpoint - combatWithoutGreen)
```

Because green SPD is an integer and `ceil(x + integer) = ceil(x) + integer`,
this is equivalent to testing candidate speeds one by one, while being simpler
and deterministic.

Example for Anne at 102 base SPD, 15% tower, no leader, and no Swift:

```text
Tick 5 = 286 - ceil(102 + 102 × 15 / 100)
       = 286 - 118
       = +168 SPD
```

This corrects the current +169 result and matches the supplied calculator.

## Interface

- Add an unchecked `Usa Swift` checkbox to the filter bar.
- Desktop uses four columns: monster, tower, leader, and Swift.
- Mobile keeps the monster field on the full first row and tower plus leader on
  the second row; Swift occupies a compact full-width third row.
- Changing Swift recalculates the table immediately and preserves the selected
  monster, tower percentage, and leader filter.
- Clarify that table results represent required green bonus SPD, the value shown
  beside base SPD in the monster's in-game rune stats.

## Validation

- Unit tests cover the supplied Anne example, all displayed Tick rows, leader
  bonuses, exact-integer percentage cases, invalid input, and Swift rounding.
- End-to-end tests verify the initial unchecked state, live recalculation,
  selection preservation, desktop/mobile placement, and the Anne reference
  values with Swift off and on.
- Run formatting, unit tests, build, targeted Speed Tick end-to-end tests, and
  desktop/mobile visual inspection.
