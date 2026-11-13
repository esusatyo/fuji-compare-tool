## Why

A comparison table is mostly rows where the cameras are the same (both have a hot shoe, both
take SD cards). The reader wants the rows where they are not. PetaPixel's PixelMeter offers a
"Show differences only" switch with a count; we had winner highlighting but no way to hide
the sameness. And our winner highlight took the column's own accent (purple, teal), which
reads as "this is column A", not "this one is better".

## What Changes

- A **"Show differences only"** checkbox above the spec table on every tool page (brand
  pages, `/compare/`, the homepage once two cameras are picked), with a count:
  "25 of 38 specs differ". On: rows whose cells all read the same are hidden, and so is any
  section left empty. Off by default; not stored in the URL or between visits.
- **Winning cells are green** — one dedicated colour (`--win`, `--win-tint`) in every column
  and both themes — instead of the column accent.
- **A dead heat has no winner.** When every compared item has the same value, no cell is
  highlighted (previously all of them were). A tie for best among some still highlights each.
- One anonymous event: `diff-only:<page>:<on|off>`; `privacy.html` lists it.

## Capabilities

### New Capabilities
- `spec-table`: differences-only filtering and winner presentation of the comparison table.

## Impact

- `engine.js` (`renderTable`, `computeWinners`), `engine.css` (two tokens per theme, winner
  rule, toggle bar), `analytics.js`, `privacy.html`.
- Tests: `tests/logic/differences.test.js`; tie tests in `winners.test.js` updated.
- Stacked on `add-search-picker` (PR #88): it changes the same `renderTable` code and covers
  the homepage embed that PR introduces.
