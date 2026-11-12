## Why

The 2026-10-19 Fujifilm refresh diffed every third-party maker's own store
catalogue (Shopify `products.json`) against `fujifilm/data.js` and found
X-mount lenses that were never entered. None are new releases; they were missed
because earlier passes enumerated from news and retailer listings rather than
the makers' full catalogues. The owner asked for a separate completeness pass.

## What Changes

- Research every X-mount lens in the catalogues of **7Artisans, TTArtisan,
  SG-image and Thypoch** that is not already in the data, plus a quick
  re-check of **Meike**'s manual-focus line (blocked in Aug 2026: no published
  barrel diameter).
- Enter each candidate whose non-nullable specs can be sourced, with `mount:'x'`,
  `specSources`/`priceSource`/`imageSource`, all seven prices, and a place in
  `LENS_DROPDOWN_GROUPS`. Skip and log the rest.
- Add `MANUFACTURER_COLORS` for any maker new to the dataset (Thypoch).

**Out of scope:** cine/anamorphic lenses, Leica-M-only designs sold for X only
via adapter, GFX lenses, teleconverters and conversion lenses, and the Laowa
GFX set (owner: "not for now").

## Impact

- `fujifilm/data.js` (`LENSES`, `LENS_DROPDOWN_GROUPS`), possibly `engine.js`
  (`MANUFACTURER_COLORS`) and `scripts/price-overrides/fujifilm.json`.
- Generated SEO pages (lens counts).
