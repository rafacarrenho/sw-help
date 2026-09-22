# Siege Speed Tuning Design

## Objective

Add a Speed Tuning tool focused exclusively on Siege and Guild Battle teams.
The tool calculates the minimum displayed green rune SPD required for the
second and third monsters to move in the selected left-to-right order without
being cut, starting from the first monster's entered rune SPD.

The implementation should feel native to SW Help, reuse the existing monster
catalog and Speed Tick rounding rules, and avoid Arena and RTA behavior.

## Scope

- Add a `/spd-tuning/` page and enable its sidebar navigation item.
- Support exactly three ordered monster slots.
- Use the first slot as the tuning anchor: the user enters its displayed green
  rune SPD.
- Calculate the minimum displayed green rune SPD and resulting combat SPD for
  slots two and three.
- Support the Siege/GvG tick constant, speed tower, valid speed leaders, Swift,
  attack-bar boosts, speed buffs, speed-increasing artifact effects, and
  single-target boost selection.
- Keep the tool entirely frontend and static.

Out of scope:

- Arena, RTA, dungeon, and PvE tuning modes.
- Four-monster teams.
- Rune optimization or rune inventory import.
- Win rates, validation claims, or other invented gameplay data.
- Sharing state through URL parameters in the first version.

## Data model

Monster identity, image, element, base SPD, leader skill, and skill IDs continue
to come from the existing files in `src/data/`.

Speed tuning capabilities use a hybrid model:

1. Derive standard attack-bar boosts and speed buffs from `skills.json`.
2. Store explicit exceptions and special targeting rules in
   `src/data/speed-tuning.ts`.

The normalized client payload for a monster contains:

- catalog ID, name, image, element, and base SPD;
- an optional Siege-valid speed leader;
- maximum known ATB boost percentage;
- ATB target scope: all remaining allies or one selected later slot;
- whether the monster can apply a team-relevant SPD buff;
- a short source skill label for explaining the detected effect.

Every `Increase ATB` effect that can affect a later ally is treated as a tuning
boost, including conditional effects; the explicit `Usar boost` control lets
the user state that the condition will occur. Self-only ATB gains, enemy ATB
manipulation, and absorption that cannot benefit a later ally are not team
boosts. Exceptions cover effects whose target or maximum skilled value cannot
be inferred safely from the catalog. When multiple supported boost skills
exist, the greatest known fully skilled percentage is the default. The
percentage remains editable from 0% through 100% so users can handle unusual
conditions and future balance changes.

SPD buffs use the standard 30% combat-speed modifier. A monster's speed buff is
considered relevant only when its skill can affect a later ally. Exceptions may
override this classification.

## Interface

The page follows the established SW Help dark visual language and typography.
Its introduction identifies the tool as Siege/GvG Speed Tuning.

### Global controls

- `Torre SPD`: a select from 0% to 15%, defaulting to 15%.
- A compact explanation that slot order is left to right on desktop and top to
  bottom on mobile.
- A reset action that restores the 15% tower and empties all slots.

### Monster slots

Three cards are displayed in attack order. Each card contains:

- an accessible monster search combobox;
- portrait, monster name, element, and base SPD;
- a `Usa Swift` checkbox;
- a mutually exclusive `Usar liderança` control when that monster has a valid
  Siege speed leader;
- detected ATB and SPD-buff controls when applicable;
- a result area.

Slot one includes an editable `SPD das runas (+verde)` field and reports its
combat SPD. Slots two and three report `SPD mínima (+verde)` and calculated
combat SPD. Results are recalculated immediately after any relevant change.

An ATB booster exposes `Usar boost`, enabled by default when the monster is
selected, plus an editable percentage initialized to the maximum known value.
For single-target boosts, the control includes only later slots as valid
targets. A boost can never target its own or an earlier slot.

A supported SPD buffer exposes `Usar buff de SPD`, enabled by default. The
artifact field `Efeito de aumento de SPD +%` starts at 0% and appears only on a
slot that can receive a speed buff from an earlier enabled provider.

On desktop, the three cards form a row connected by subtle directional cues.
On narrow screens they stack vertically and preserve the same order. Main text
uses at least 16 px, secondary text 14 px, and short labels at least 12 px.

## Leader rules

Only speed leaders with these scopes are offered:

- General/global;
- Guild;
- Element.

Arena and Dungeon leaders are not offered. Exactly one active leader is
allowed across the team. Selecting one automatically clears the previous
selection. General and Guild leaders apply to all three monsters. Element
leaders apply only to monsters of the leader skill's declared element.

Changing or removing the selected leader recalculates every result.

## Calculation

Siege uses a tick constant of `0.0007`. The first monster establishes the turn
window for the followers.

For each monster, unbuffed combat SPD is based on base SPD, tower, applicable
leader percentage, displayed green rune SPD, and the Swift rounding adjustment
already used by Speed Tick:

```text
swiftExact = baseSPD * 25 / 100
swiftPenalty = usesSwift ? ceil(swiftExact) - swiftExact : 0
combatSPD = ceil(
  baseSPD
  + baseSPD * (towerPercent + applicableLeaderPercent) / 100
  + displayedGreenSPD
  - swiftPenalty
)
```

Swift is already included in the game's displayed green SPD, so it changes the
rounding correction rather than adding another 25% to combat SPD.

For a follower at turn offset `iteration`, the minimum combat SPD is solved
from the same tick-window relationship as the reference calculator:

```text
anchorTicks = ceil(1 / (anchorCombatSPD * 0.0007))
numerator = anchorCombatSPD * 0.0007 * (anchorTicks + iteration)
            - accumulatedApplicableATBBoost / 100

speedBuffModifier = 1 + 0.30 * (1 + artifactSPDIncrease / 100)
denominator = elapsed normal ticks * 0.0007
              + elapsed buffed ticks * 0.0007 * speedBuffModifier

minimumCombatSPD = floor(numerator / denominator)
```

The required displayed green SPD is the smallest non-negative integer that
reaches the calculated minimum combat SPD after base, tower, leader, and Swift
rounding. A bounded integer verification around the closed-form candidate
guards against floating-point and boundary errors.

Slot two uses boosts and buffs from slot one. Slot three uses enabled boosts
and buffs from slots one and two. Team-wide effects apply to every later slot;
single-target effects apply only to their selected later target. ATB boosts are
additive and clamped to the valid 0% through 100% input range per provider.

If an earlier calculated result would cause slots two and three to invert, the
slot-two requirement is raised as needed so the requested left-to-right order
remains valid.

## State and interaction

The page owns a single three-slot state model. Every input change passes through
one normalization and recalculation path so leader exclusivity, target
validity, conditional fields, and results cannot drift apart.

Selecting a new monster resets only monster-derived options in that slot:

- Swift becomes unchecked;
- its leader becomes inactive;
- supported boost and SPD-buff controls use their detected defaults;
- invalid boost targets fall back to the nearest later slot;
- user-entered rune SPD and artifact percentage reset to zero.

Removing an earlier monster invalidates downstream results but does not erase
the later selections. A clear inline message tells the user which prior slot is
required.

Numeric inputs reject non-numeric values and normalize on blur. Negative values
become zero; tower is limited to 0–15; ATB and artifact percentages are limited
to 0–100. Incomplete or invalid calculation inputs display an explanatory
placeholder instead of a misleading speed.

## Architecture

- `src/lib/speed-tuning.ts`: pure normalization, leader applicability, combat
  SPD, tick-window, accumulated-effect, and minimum-rune-SPD functions.
- `src/data/speed-tuning.ts`: documented exception metadata for effects that
  cannot be safely inferred from the skill catalog.
- `src/pages/spd-tuning.astro`: static page markup, serialized normalized
  catalog data, and client-side orchestration.
- `src/styles/speed-tuning.css`: page-specific responsive layout and states.
- `src/layouts/Layout.astro`: adds the active `speed-tuning` section and enables
  navigation.

The calculation library must remain independent of the DOM so its edge cases
can be tested directly.

## Accessibility

- Every control has a visible label or screen-reader name.
- Search comboboxes follow the accessible behavior already established by Spd
  Tick, including keyboard navigation and active-option announcements.
- Conditional controls remain in predictable reading order.
- Results use live status text without moving keyboard focus.
- Color is not the only signal for incomplete, active, or successful states.
- Desktop and mobile preserve the logical slot and tab order.

## Validation

Unit tests cover:

- combat SPD with tower, General/Guild leader, elemental match/mismatch, and
  Swift rounding;
- minimum follower SPD without boosts;
- team-wide and single-target ATB boosts;
- cumulative boosts from slots one and two;
- SPD buff activation timing and artifact modifiers;
- leader exclusivity and supported Siege scopes;
- invalid and boundary inputs;
- maintaining slot-two-before-slot-three order.

End-to-end tests cover:

- opening the newly enabled navigation entry;
- selecting all three monsters through the comboboxes;
- entering slot-one rune SPD and receiving slot-two/slot-three results;
- toggling Swift, leader, ATB boost, target, and SPD buff;
- editing boost and artifact percentages;
- reset behavior;
- keyboard interaction and mobile stacking.

Before completion, run `pnpm test`, `pnpm build`, and `pnpm test:e2e` after the
build. Perform desktop and mobile visual inspection of the completed page.

## Reference

The tick-window model and Siege constant are based on the public reference
implementation at:

- https://swspeedtuner.com/
- https://github.com/jaykeblakk/SWSpeedTuner
