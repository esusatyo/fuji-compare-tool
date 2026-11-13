## Why

The 2026-11-12 new-model check found eight products, announced between September and November 2026, that are missing from the data. The owner asked (2026-11-13) to add all of them, plus announced products that are not on sale yet, with the price left empty when the announcement gives none. The owner also ruled that cine-style lenses stay out for now (the Fujifilm GF19-35mm T3.5 PZ is skipped).

The schema requires a positive USD price on every item, so a lens announced without a price cannot be entered today.

## What Changes

- **New `preRelease: true` flag** for an officially announced item that is not on sale yet.
  - A pre-release item may have `prices.USD: null`; with no USD, every other currency must be `null` too.
  - A current camera that is pre-release is exempt from the all-seven-currencies rule.
  - The flag must not sit on a discontinued item.
  - When an item with no price is selected, the price cell reads "Price not announced" instead of "Price unavailable".
- **New items** (each sourced from the maker, mount-specific, with a citation):
  1. Sigma fp2 (sigma)
  2. Nikkor Z 120-300mm f/2.8 TC VR S (nikon)
  3. Sony FE 8-14mm F3.5 Fisheye G (sony)
  4. Sigma 16-300mm F3.5-6.7 DC OS, Nikon Z (nikon)
  5. Tamron 16-50mm F2.8 A, Nikon Z and Fujifilm X (nikon, fujifilm)
  6. Viltrox AF 35mm F1.4 Pro, Sony E and Nikon Z (sony, nikon)
  7. Laowa 24mm f/2 Zero-D Tilt-Shift, in every mount the catalogue covers
  8. Thypoch Sculptor AF 23mm f/1.4 (fujifilm, plus any other mount it ships for)
  9. Sigma 50mm F1.4 CL DG Contemporary, Sony E and L-Mount: announced, no price, ships spring 2027
- **Housekeeping:** archive `resolve-open-data-doubts` (merged in #84).

**Out of scope:** cine lenses (owner rule); rumoured or leaked products (Nikon Z70, Fujifilm X-T6, Sony 16-28mm f/2 GM, OM System 40-150mm R II and 45mm f/1.8 II); the Panasonic S9 Titanium colour variant.

## Impact

- `tests/helpers/schema.js`, a data test for the flag, a logic test for the price cell, `engine.js` (`renderPriceHTML`), and CLAUDE.md (data model).
- `sigma/`, `nikon/`, `sony/`, `fujifilm/` data files, plus `leica/` and `panasonic/` for the L-Mount lenses; regenerated sitemap files.
