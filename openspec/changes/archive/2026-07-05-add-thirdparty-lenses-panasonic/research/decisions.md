# Panasonic Third-Party Lenses — Decisions

## Storage (D1)
Denormalized per-brand entries in `panasonic/data.js`. No shared catalogue, no
`mount` field on the object. Mount (L vs MFT) is expressed via dropdown group
label + `focalLengthEquiv` (2.0× MFT, native L). Same-design copies for other
brands live in their own files. Cross-mount overlap in `research/lenses.md` only.

## Slug convention + cross-mount collision (D2)
`<maker>-<focal>-<aperture>[-mount|line]`. Because Sigma ships for both L and
MFT, **append a discriminator to avoid slug collisions**: e.g. `sigma-30mm-f14-l`
(L DC DN) vs `sigma-30mm-f28-dn` (MFT DN). Where focal/aperture already differ, no
suffix needed. `manufacturer` matches `MANUFACTURER_COLORS` casing.
`manufacturer: 'OM System'` for all M.Zuiko (note Olympus era in name/line).

## `manufacturer` values
L-mount: `Sigma`, `Leica`, `Voigtländer`, `Samyang`, `Laowa`, `TTArtisan`,
`7Artisans`, `Astrhori`. MFT: `OM System`, `Sigma`, `Voigtländer`, `Sirui`,
`Laowa`, `7Artisans`, `TTArtisan`, `Meike`, `Yongnuo`.

## Dropdown group order (D3)
LUMIX S (existing), then L-mount third-party: Sigma (L-mount), Leica (L-mount),
Voigtländer (L-mount), Other (L-mount). LUMIX G (existing), then MFT third-party:
OM System (MFT), Sigma (MFT), Voigtländer (MFT), Sirui (MFT), Other (MFT). Group
labels carry the mount so systems never blur.

## engine.js MANUFACTURER_COLORS additions (D4)
Add `OM System`, `Leica`, `Laowa`, `Sirui`, `Meike`, `Yongnuo`, `Astrhori` (skip
any added by sibling changes). Present: Sigma, Samyang, Voigtländer, TTArtisan,
7Artisans.

## Pricing / ASIN / images (D5)
Current: 7 currencies; derived → `priceIncomplete: true`. ASIN = verified plain
product, else search fallback. `imageUrl` from manufacturer page; gaps in
KNOWN_IMAGE_GAPS.panasonic. OM System/Sigma widely stocked → ASINs easy to find.

## Scope boundary (D7)
In: full current Sigma L line; representative Leica SL; current OM System / recent
Olympus M.Zuiko; Sigma MFT DN/DC DN; Voigtländer Nokton f/0.95; Laowa specialty;
Sirui Sniper AF; popular budget makers. Out: vintage non-micro Four Thirds,
cine/anamorphic, teleconverters, exhaustive Leica, retired clones.
