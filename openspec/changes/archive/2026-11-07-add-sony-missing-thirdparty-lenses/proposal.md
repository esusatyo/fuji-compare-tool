## Why

Diffing third-party makers' own store catalogues against `sony/data.js`
(2026-10-19) found roughly 180 E-mount lenses that were never entered:
Viltrox has ~30 E/FE lenses (8 in the data), Samyang ~20 AF (5), Laowa
dozens (3), and the budget makers far more. The owner asked for the full
gap to be closed over several sessions.

## What Changes

- Enter every E-mount lens from the in-scope makers whose non-nullable specs
  can be sourced from the maker (tier 1), with `mount:'e'`, specSources /
  priceSource / imageSource, seven prices, and a dropdown group.
- Order: Viltrox → Samyang → Sigma → Tamron → Laowa → Voigtländer → Zeiss →
  TTArtisan → 7Artisans → Meike → Thypoch / SG-image.
- Skip and log lenses without published dimensions/weight.

**Out of scope:** cine/anamorphic/T-stop lenses, Leica-M lenses sold for E
only via adapter, bundles/kits, teleconverters, other-mount-only products.

## Impact

`sony/data.js`, `engine.js` (MANUFACTURER_COLORS for any new maker),
`tests/data/links-offline.test.js` (ASIN baseline / allowed hosts),
generated SEO pages.
