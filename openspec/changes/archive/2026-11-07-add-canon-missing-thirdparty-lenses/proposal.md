## Why

Canon is the one brand that never had the catalogue-gap pass Sony, Nikon,
Panasonic, Olympus and Leica got in PR #78. Its 39 third-party lenses date
from the August round (archived `2026-08-05-expand-thirdparty-lenses-canon`
plus the unarchived `expand-thirdparty-lenses-canon`). Diffing the makers'
own catalogues against `canon/data.js` on 2026-10-22 found about 60 RF lenses
that were never entered: Laowa sells ~30 RF lenses (5 entered), 7Artisans ~12,
TTArtisan ~8, plus Voigtländer (3 RF Noktons, none entered), Thypoch (2),
Samyang (1) and a handful of Meike/Yongnuo leads. Canon's licensing restricts
only autofocus lenses, so the gap is almost entirely manual focus.

The owner also asked (2026-10-22) to make third-party USD prices consistent.
Earlier passes took a maker store's compare-at ("regular") price as USD even
where the store never charges it, while the owner's later decisions (Samyang
AF 24-60/24-70, Thypoch M, Fujifilm Simera 28) settled on the price a major US
dealer actually charges as its regular price. 47 entries across Sony,
Fujifilm and Canon still carry a store compare-at that was being undercut by
a store "sale" when it was read, some by more than half.

## What Changes

- Enter every RF/RF-S lens from the in-scope makers whose non-nullable specs
  can be sourced, with `mount:'rf'`, specSources / priceSource / imageSource,
  a USD price, `priceIncomplete:true` (non-USD not examined, as in the other
  gap passes) and a per-maker dropdown group.
- Order: Laowa → Voigtländer → TTArtisan → 7Artisans → Thypoch / Samyang →
  Meike / Yongnuo → Sigma / Tamron / Viltrox re-check.
- Skip and log lenses without published RF dimensions/weight.
- Price consistency: for each of the 47 compare-at entries, check the major
  US dealer's (B&H) regular price. Where the dealer sells at the store's
  "sale" level as its regular price, the compare-at is not a real price and
  USD moves to the dealer's regular; where the dealer's regular matches the
  compare-at, the sale was temporary and USD stays. Regional prices of a
  changed entry are recomputed where they were ratio-derived.
- Normalise the one `afType:'Manual Focus'` to `'Manual'` (529 other manual
  lenses use `'Manual'`).

**Out of scope:** cine/T-stop lenses, probes, kits/bundles, adapters and
converters, DSLR-era designs (owner decision on Laowa), EF-M lenses (a
different mount), AF lenses sold only for EF and used through an adapter.

## Impact

`canon/data.js`; `sony/data.js` and `fujifilm/data.js` (price fixes);
`nikon/data.js` (afType); `engine.js` MANUFACTURER_COLORS if a maker is new
to Canon's colour set; `tests/data/links-offline.test.js` (ASIN baseline);
`tests/data/completeness.test.js` (image gaps); generated SEO pages.
