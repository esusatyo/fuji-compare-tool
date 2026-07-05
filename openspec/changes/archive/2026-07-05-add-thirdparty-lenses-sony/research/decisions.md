# Sony Third-Party Lenses — Decisions

## Storage (D1)
Denormalized per-brand entries in `sony/data.js`. No shared catalogue, no `mount`
field, no cross-mount UI. Same-design copies for other mounts are separate
entries in their own brand files (or absent). Cross-mount overlap is recorded in
`research/lenses.md` only, to avoid re-researching optics — it does not change the
stored Sony entry.

## Slug convention (D2)
`<maker>-<focal>-<aperture>[-variant]`, lowercase, aperture without decimal:
`sigma-18-50mm-f28`, `tamron-28-75mm-f28-g2`, `viltrox-27mm-f12`,
`zeiss-batis-25mm-f2`, `voigtlander-nokton-40mm-f12`, `laowa-15mm-f2`.
Disambiguate same focal/aperture with `-ii`/line suffix.

## `manufacturer` values (must match MANUFACTURER_COLORS)
`Sigma`, `Tamron`, `Samyang`, `Viltrox`, `Zeiss`, `Voigtländer`, `Laowa`,
`TTArtisan`, `7Artisans`, `Meike`. `line` records sub-brand (Art / Contemporary /
Di III / Batis / Loxia / Touit / Nokton / APO-Lanthar / LAB / Air).

## Dropdown group order (D3)
Existing Sony groups first, then: Sigma, Tamron, Samyang, Viltrox, Zeiss,
Voigtländer, Laowa, `── Other ──` (TTArtisan/7Artisans/Meike).

## engine.js MANUFACTURER_COLORS additions (D4)
Add `Zeiss`, `Laowa`, `Meike` (bg/text pairs matching the palette style).
Already present: Sigma, Tamron, Viltrox, Samyang, Voigtländer, TTArtisan,
7Artisans. New coverage test asserts no lens manufacturer is uncoloured.

## Pricing / ASIN / images (D5)
Current: 7 currencies; discontinued (Zeiss): USD-only. Derived regional →
`priceIncomplete: true`. ASIN = verified plain product; else search fallback.
`imageUrl` from manufacturer page; placeholder gaps recorded in KNOWN_IMAGE_GAPS.

## Scope boundary (D7)
In: all current native-AF (Sigma/Tamron/Samyang/Viltrox); all notable
manual/specialty (Zeiss incl. discontinued, Voigtländer, Laowa); representative
popular TTArtisan/7Artisans/Meike. Out: cine/rehoused, anamorphic,
teleconverters, long-tail clones without retailer presence.
