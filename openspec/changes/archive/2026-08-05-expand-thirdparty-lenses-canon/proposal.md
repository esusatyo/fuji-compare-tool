## Why

Canon has the thinnest third-party lens coverage of the five brands — **14
entries** vs Sony 51, Fujifilm 46, Panasonic 39, Nikon 26. Some of that gap is
real (Canon only licensed RF-S autofocus to Sigma and Tamron in 2024, and still
has no third-party full-frame RF AF), but the rest is unfinished work: the
archived `2026-07-05-add-thirdparty-lenses-canon` change explicitly deferred
three batches — the newer Sigma RF-S lenses, and the TTArtisan / 7Artisans
manual-focus primes it had researched but never entered.

Every one of Canon's 14 third-party lenses also carries `priceIncomplete: true`,
so each shows a lone USD figure on the card. That flag makes
`scripts/compute-prices.js` skip the item, so the regional prices never arrive.

## What Changes

- **Sigma follow-up batch** — the RF-S lenses released after the first pass:
  12mm F1.4 DC DN, 15mm F1.4 DC DN, 17-40mm F1.8 DC Art, 16-300mm F3.5-6.7 DC OS
  (each confirmed shipping in RF-S before entry).
- **Tamron / Viltrox re-check** — re-verify the RF lineups for anything added
  since July 2026 (Viltrox RF-S AF primes were rumoured for 2026).
- **TTArtisan + 7Artisans manual-focus RF primes** — the batch the previous
  change researched and deferred. Canon blocks third-party AF, so these makers
  ship native RF only as MF; that is in scope.
- **Laowa top-up** — the previously identified 58mm f/2.8 and 100mm f/2.8 2× macro.
- **Prices** — fill all seven currencies for Canon third-party lenses (existing
  and new) via `compute-prices.js`, dropping the reflexive `priceIncomplete`.
- **Images** — reduce `KNOWN_IMAGE_GAPS.canon` where a maker product image or a
  Commons file exists; keep the rest allowlisted with a stated reason.

## Scope Boundary

- **In:** native RF / RF-S lenses shipping today, AF where licensed, MF from
  budget/specialty makers.
- **Out:** EF-mount via adapter, cine/anamorphic, teleconverters, announced-
  but-not-shipping lenses, and any lens whose specs cannot be corroborated by
  two independent sources (logged as a deferred tail instead).

## Method

Run under `add-thirdparty-lenses` **v1.1**: two independent source lineages per
lens (tier 1 maker page + tier 2 independent review; retailers are price-only),
citations recorded in `research/lenses.md` before data entry, field
normalisation per the skill's convention table, and a `PROGRESS.md` updated in
the same commit as each batch so the run is resumable.
