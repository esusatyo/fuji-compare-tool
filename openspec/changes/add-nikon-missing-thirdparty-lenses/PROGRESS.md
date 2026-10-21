# Progress — Nikon missing third-party lenses

**Resume at:** 2.1 Viltrox + Tamron
**Branch:** canon-sony-lens-refresh (local csr-continue, worktree refresh-camera-data-sep2026); same PR as Canon/Sony (#78)

## Catalogue diff (2026-10-21)
Makers' store catalogues (Shopify `products.json`, venuslens Woo Store API, Cosina's Z-mount list, press) vs `nikon/data.js`. Counts are candidates before spec checks.

| Maker | In data | Candidates | Notes |
|---|---|---|---|
| Viltrox | 32 | 1 | AF 27mm f/1.2 Pro Z |
| Tamron | 12 | 1 | 20-40mm f/2.8 Di III VXD (A062) Z, on sale 2026-10-22, $729 |
| Laowa | 24 | ~12 | ACRIS 35 1X, 4.5-10 CF fisheye, 9 f/2.8 Zero-D, 12-24 f/5.6 (non-shift), Argus 35 / 45 f/0.95, 180 1.5X macro, 200 f/2 AF, RL 9/11/14, Aksen (check) |
| Voigtländer | 13 | 2 | Nokton 75mm f/1.5, Nokton Classic 35mm f/1.4 |
| Zeiss | 0 | 3 | Otus ML 35/50/85 f/1.4 (Z versions released 2025-26) |
| TTArtisan | 9 | ~25 | AF 24 mini, AF 32 f/2.8, tilt/tilt-shift, many MF APS-C/FF |
| 7Artisans | 9 | ~25 | AF 10 f/2.5, AF 24, AF 135, many MF |
| Meike | 6 | ~20 | AF 23/33/55/85 lines, MF 0.95 trio, macro |
| Thypoch | 0 | 3 | Simera 28/35/50 |
| SG-image | 0 | ~11 | AF 35 f/2.2, AF 55/85, MF line |
| Yongnuo | 9 | ~1 | 16mm f/1.8 DA DSM (check) |
| Samyang | 2 | 0 | Z line is only the two MF lenses |
| Sigma | 3 | 0 | Z line is only the three DC DN primes |

## Batches
| Maker | Candidates | Entered | Skipped | Committed |
|---|---|---|---|---|

## Skipped (with reason)

## Method (reuse from the Sony pass)
- Gaps: diff each maker's `products.json` handles and names against `productUrl`s/names (a handle can be a substring of another maker's URL — check by name).
- Specs: maker's own table for the Z column; B&H Nikon Z listing where the maker publishes specs only as images or omits Z dimensions. Maker wins on conflict.
- Prices: regular (compare-at) price for the Z variant; B&H strikethrough when the maker has no US store.
- One commit per batch with this file and tasks.md updated; raise ASIN_GAP_BASELINE per batch.
