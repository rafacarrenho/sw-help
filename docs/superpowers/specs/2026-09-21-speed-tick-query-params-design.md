# Speed Tick Shareable Query Parameters Design

## Objective

Make every confirmed Speed Tick result shareable through the browser URL. The
page must restore the selected monster, tower percentage, leader filter, and
Swift state when a shared link is opened.

## URL contract

The page owns four independent parameters:

```text
monster=<stable catalog ID>
tower=<integer from 0 through 15>
leader=<available speed-leader percentage>
swift=1
```

- Monster uses the stable catalog ID rather than its display name to avoid
  collisions and name changes.
- Default values are omitted: no monster, 15% tower, all leaders, and Swift
  disabled produce `/spd-tick/` without owned query parameters.
- Unrelated parameters are preserved when filters change.
- Invalid owned values fall back to their defaults and are removed when the URL
  is normalized.

Example:

```text
/spd-tick/?monster=anne-fire-181&tower=0&leader=24&swift=1
```

## State flow

- On initial load, `pageshow`, and `popstate`, parse and validate the URL before
  rendering the filters, selected-monster summary, and table.
- Confirming a monster, changing tower or leader, and toggling Swift update the
  URL immediately with `history.replaceState`.
- Typing in the monster search clears the confirmed monster and removes only
  the `monster` parameter. Search text is transient and is not shared.
- Clearing a selection returns calculations to base SPD 100 while preserving
  the other valid filter parameters.
- URL synchronization must not open the monster dropdown or move focus.

## Architecture

- Pure helpers in `src/lib/speed-tick.ts` parse and serialize the query state.
  They receive the valid monster IDs and leader percentages, so validation does
  not duplicate catalog knowledge.
- The Speed Tick page applies the parsed state to existing controls and calls
  the existing render path. Rendering serializes the normalized confirmed state
  back into the URL.
- The parser and serializer preserve unknown parameters and the current hash.

## Validation

- Unit tests cover defaults, complete round trips, invalid values, and
  preservation of unrelated parameters.
- End-to-end tests cover URL changes from every filter, direct opening of a
  complete shared link, correct Anne calculations, clearing the monster, and
  restoration through browser navigation events on desktop and mobile.
- Run formatting, unit tests, build, and targeted Speed Tick end-to-end tests.
