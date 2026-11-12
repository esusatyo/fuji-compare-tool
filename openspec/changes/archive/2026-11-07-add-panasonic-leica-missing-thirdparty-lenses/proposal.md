## Why

After the Sony and Nikon catalogue-gap passes, the owner asked for the same
on Panasonic and Leica (2026-10-22). Panasonic's page is missing lenses in
three ways: 14 Sigma L-Mount lenses and 21 OM System lenses that are already
entered and verified on the Sigma and Olympus pages, Leica's SL lenses, and
the L-Mount / MFT lenses from Laowa, Samyang and the budget makers. Leica's
page has no third-party lenses at all.

Owner decision (2026-10-22): Leica gets M-mount third-party lenses **and
every full-frame L-Mount lens Panasonic's page lists** (LUMIX S, Sigma,
Laowa, Viltrox, Samyang, budget makers); Leica's SL lenses go onto
Panasonic's page. Sigma's page stays first-party only.

## What Changes

- **Copies of verified same-mount entries.** Sigma L-Mount lenses from
  `sigma/data.js`, OM System lenses from `olympus/data.js` and Leica SL lenses
  from `leica/data.js` are copied into `panasonic/data.js` unchanged — one
  physical product, one mount. The LUMIX G 35-100 II goes the other way into
  `olympus/data.js`.
- **New Panasonic lenses** from the makers' catalogues, L-Mount and MFT, with
  `specSources` / `priceSource` / `imageSource`, a USD price and a dropdown
  group (`priceIncomplete:true` where non-USD prices weren't examined). New
  MFT lenses are mirrored into `olympus/data.js`, as earlier MFT passes did.
- **Leica L-Mount:** every full-frame L lens on Panasonic's page is mirrored
  into `leica/data.js`.
- **Leica M-Mount:** Voigtländer VM, Zeiss ZM, TTArtisan, 7Artisans and
  Thypoch M lenses.
- `tests/data/shared-mount.test.js` gains Leica ↔ Panasonic and
  Leica ↔ Sigma rows, so the copies cannot drift apart.
- Skip and log lenses without published dimensions/weight for the mount.

**Out of scope:** APS-C L-Mount lenses (no Panasonic body uses them, matching
the existing exclusion of Sigma's DC DN L lenses; Leica's own TL lenses stay
Leica-only), cine/T-stop lenses, lenses sold for a mount only with an
adapter, bundles, teleconverters, discontinued third-party M lenses.

## Impact

`panasonic/data.js`, `olympus/data.js`, `leica/data.js`, `engine.js`
(MANUFACTURER_COLORS for any new maker), `tests/data/shared-mount.test.js`,
`tests/data/links-offline.test.js` (ASIN baseline / allowed hosts),
`tests/data/completeness.test.js` (image gaps, shared links), generated SEO
pages.
