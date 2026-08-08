# Expand the Panasonic lineup to match what Panasonic actually sells

## Why

A full-lineup audit on 2026-08-08 (rather than the usual "what's new?" sweep)
found the Panasonic dataset was missing items in three different ways, none of
which a news-led search would surface:

1. **Recent releases** never entered — the S1IIE and G97 bodies, the S 18-40mm
   and S 100-500mm lenses.
2. **Products that were never new** — six first-party LUMIX G lenses on sale for
   a decade (7-14mm F4, 8mm Fisheye, 14mm F2.5 II, 14-42mm PZ, 35-100mm F4-5.6,
   30mm Macro). No search finds these, because nothing about them changed.
3. **A whole third-party tier** — Viltrox and Samyang both joined L-Mount in
   2026 and were absent as makers entirely; Sigma, Laowa and OM System had all
   shipped lenses since the last pass.

Two data-integrity problems surfaced alongside:

- `lumix-s-40mm-f2` carried specs copy-pasted from a sibling lens: wrong weight,
  length, diameter, filter thread, optical formula, year and price. Its `asin`
  and `productUrl` pointed at the real lens, so the entry described one product
  and linked to another.
- `lumix-g-35-100mm-f2-8-ii`'s `productUrl` had drifted to serve Panasonic's
  2023 Leica-badged redesign, i.e. a different lens from the one the entry
  described.

## What changes

- **Corrections** to 11 existing items: 9 stale USD prices (the S1H was $500
  low), one wrong `year`, and a full re-populate of `lumix-s-40mm-f2`.
- **A generation split**: the 2023 LEICA DG 35-100mm F2.8 POWER O.I.S. becomes
  its own entry; the superseded 2017 G X Vario goes `discontinued` with its
  now-wrong `productUrl`/`asin` cleared. Per the owner's rule, a lens revision
  is always a new coexisting entry — both generations stay comparable.
- **17 new items**: 5 cameras (S1IIE, G97, G100, BS1H, BGH1) and 12 lenses
  across first-party LUMIX G, Sigma, Viltrox, Samyang, Laowa and OM System.
- **Two new manufacturers** for this brand, Viltrox and Samyang.
  `MANUFACTURER_COLORS` already carries both, so `engine.js` is untouched.
- **A new `Lumix Box (Cinema)` series** for the BS1H/BGH1, which have no LCD and
  no viewfinder.
- **One schema bound relaxed**: the lens `year` floor moves 2010 → 2008, Micro
  Four Thirds' launch year, to admit the 2009 LUMIX G Vario 7-14mm F4.

## Sourcing

Every figure is recorded in `research/lenses.md` with its tier-1 maker source and,
where one exists, an independent tier-2 corroboration — including the specs that
were *rejected* and why, so a later pass doesn't "correct" a right value back to a
wrong one. Mount-specific rows were used throughout; the ledger records three
separate near-misses where a Sony E or Canon EF figure would have been taken by
default.

## Not included

The OM System 50-200mm f/2.8 IS PRO (no sourceable AF-drive type for a
non-nullable field) and the Laowa 17mm Shift-only SKU. Both are documented under
"Held back" in the ledger.
