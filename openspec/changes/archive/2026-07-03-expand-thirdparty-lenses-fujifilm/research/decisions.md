# Fujifilm Third-Party Lens Expansion — Decisions

## Storage (D1)
Continue the existing denormalized per-brand pattern in `fujifilm/data.js` (the
pattern this change set standardised). No shared catalogue, no `mount` field, no
cross-mount UI. Cross-mount overlap in `research/lenses.md` only.

## Slug convention (D2)
Match existing Fujifilm entries: `<maker>-<focal>-<aperture>[-variant]`,
lowercase, aperture without decimal. New: `sigma-18mm-f14`,
`viltrox-air-40mm-f25`, `zeiss-touit-32mm-f18`, `laowa-9mm-f28`,
`meike-35mm-f14`. `manufacturer` matches `MANUFACTURER_COLORS`; `line` = sub-brand
(Air / Touit / …).

## `manufacturer` values
`Sigma`, `Tamron`, `Viltrox`, `Zeiss`, `Voigtländer`, `Laowa`, `Meike`,
`TTArtisan`, `7Artisans`, `Samyang`.

## Dropdown group order (D3)
Keep existing order; grow Sigma / Viltrox / Other; add `── Zeiss ──`,
`── Laowa ──`, `── Meike ──` after the current groups. Every existing + new lens
in exactly one group.

## engine.js MANUFACTURER_COLORS additions (D4)
Add `Zeiss`, `Laowa`, `Meike` (same three the Sony change adds — skip if already
present). Present: Sigma, Tamron, Viltrox, Samyang, Voigtländer, TTArtisan,
7Artisans.

## Scope boundary (D7) — APS-C only
In: complete Sigma DC DN; Viltrox Air + AF; Zeiss Touit (discontinued); Laowa X
specialty; Meike AF; expanded TTArtisan/7Artisans. Out: full-frame-only designs
with no X version, cine/anamorphic, teleconverters, retired clones.

## Re-verification (D5)
Re-check the pre-existing 23 entries' price/`asin`/`productUrl`/`imageUrl` against
current sources; update stale, flag newly discontinued. Use
`check-prices-and-buy-links`.

## Pricing / ASIN / images
Current: 7 currencies; discontinued (Touit) USD-only; derived →
`priceIncomplete: true`. ASIN = verified plain product, else search fallback.
`imageUrl` from manufacturer page; gaps in KNOWN_IMAGE_GAPS.fujifilm.
