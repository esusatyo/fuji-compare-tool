# Nikon Third-Party Lenses — Decisions

## Storage (D1)
Denormalized per-brand entries in `nikon/data.js`. No shared catalogue, no
`mount` field, no cross-mount UI. Cross-mount overlap recorded in
`research/lenses.md` only.

## Slug convention (D2)
`<maker>-<focal>-<aperture>[-variant]`, lowercase, aperture without decimal.
`manufacturer` matches `MANUFACTURER_COLORS` casing; `line` = sub-brand.

## `manufacturer` values
`Sigma`, `Tamron`, `Viltrox`, `Samyang`, `Voigtländer`, `Laowa`, `TTArtisan`,
`7Artisans`, `Meike`, `Yongnuo`.

## Dropdown group order (D3)
Existing Nikon groups first, then: Sigma, Tamron, Viltrox, Samyang, Voigtländer,
Laowa, `── Other ──` (TTArtisan/7Artisans/Meike/Yongnuo).

## engine.js MANUFACTURER_COLORS additions (D4)
Add `Laowa`, `Meike`, `Yongnuo` (skip if a sibling change added them). Present:
Sigma, Tamron, Viltrox, Samyang, Voigtländer, TTArtisan, 7Artisans.

## Rebadge de-duplication (D7)
Exclude any Tamron design Nikon sells as first-party Nikkor — keep it first-party,
do not add a duplicate Tamron-branded entry. Only add the Tamron Z entry where
Tamron sells it directly for Z.

## Pricing / ASIN / images (D5)
Current: 7 currencies; derived → `priceIncomplete: true`. ASIN = verified plain
product, else search fallback. `imageUrl` from manufacturer page; gaps recorded
in KNOWN_IMAGE_GAPS.nikon.

## Scope boundary (D7)
In: currently-shipping third-party Z AF (Sigma/Tamron/Viltrox/Samyang) + notable
Voigtländer/Laowa + representative TTArtisan/7Artisans/Meike/Yongnuo. Out:
cine/rehoused, anamorphic, teleconverters, retired clones.
