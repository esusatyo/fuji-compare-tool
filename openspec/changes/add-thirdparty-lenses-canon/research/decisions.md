# Canon Third-Party Lenses — Decisions

## Storage (D1)
Denormalized per-brand entries in `canon/data.js`. No shared catalogue, no
`mount` field, no cross-mount UI. Cross-mount overlap in `research/lenses.md`
only.

## Slug convention (D2)
`<maker>-<focal>-<aperture>[-variant]`, lowercase, aperture without decimal.
`manufacturer` matches `MANUFACTURER_COLORS` casing; `line` = sub-brand. RF-S vs
FF RF conveyed by `focalLengthEquiv` (1.6× RF-S) + focal/aperture, not a schema
field.

## `manufacturer` values
`Sigma`, `Tamron`, `Viltrox`, `Samyang`, `Yongnuo`, `TTArtisan`, `7Artisans`,
`Laowa`, `Meike`.

## Dropdown group order (D3)
Existing Canon groups first, then: Sigma, Tamron, Viltrox, `── Other ──`
(Samyang/Yongnuo/TTArtisan/7Artisans/Laowa/Meike).

## engine.js MANUFACTURER_COLORS additions (D4)
Add `Laowa`, `Meike`, `Yongnuo` (skip if a sibling change added them). Present:
Sigma, Tamron, Viltrox, Samyang, TTArtisan, 7Artisans.

## RF-availability rule (D6/D7)
Only include lenses **confirmed shipping in RF or RF-S**. Exclude EF-via-adapter,
lenses only in E/X/Z, cine/anamorphic, teleconverters. Do not pad — Canon's
third-party set is genuinely the smallest.

## Pricing / ASIN / images (D5)
Current: 7 currencies; derived → `priceIncomplete: true`. ASIN = verified plain
product (RF/RF-S SKU, not EF), else search fallback. `imageUrl` from manufacturer
page; gaps in KNOWN_IMAGE_GAPS.canon.
