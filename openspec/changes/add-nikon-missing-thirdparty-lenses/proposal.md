## Why

After the Sony catalogue-gap pass, the owner asked for the same pass on
Nikon (2026-10-21). Diffing the makers' own catalogues against
`nikon/data.js` found roughly 100 Z-mount lenses that were never entered:
Laowa, TTArtisan, 7Artisans, Meike and SG-image each sell 10–25 Z lenses the
data lacks, plus a handful from Viltrox, Tamron, Voigtländer, Zeiss and
Thypoch.

## What Changes

- Enter every Z-mount lens from the in-scope makers whose non-nullable specs
  can be sourced, with `mount:'z'`, specSources / priceSource / imageSource,
  a USD price and a dropdown group (`priceIncomplete:true` where non-USD
  prices weren't examined, as in the Sony pass).
- Order: Viltrox → Tamron → Laowa → Voigtländer → Zeiss → TTArtisan →
  7Artisans → Meike → Thypoch / SG-image → Yongnuo.
- Skip and log lenses without published Z-mount dimensions/weight.

**Out of scope:** cine/T-stop lenses, probes, Leica-M lenses sold for Z only
with an adapter, DSLR-era (F-mount) designs, bundles/kits, teleconverters.
Samyang and Sigma have no Z lenses missing (Samyang's Z line is the two MF
lenses already entered; Sigma's is the three DC DN primes).

## Impact

`nikon/data.js`, `engine.js` (MANUFACTURER_COLORS for any new maker),
`tests/data/links-offline.test.js` (ASIN baseline / allowed hosts),
`tests/data/completeness.test.js` (image gaps), generated SEO pages.
