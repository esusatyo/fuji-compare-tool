# Progress — Nikon missing third-party lenses

**Resume at:** 2.4 TTArtisan
**Voigtländer + Zeiss done 2026-10-21 (5 lenses):** Nokton 75mm f/1.5 and Nokton Classic 35mm f/1.4 (Cosina EN Z pages; B&H prices $899 / $699; existing 13 Nikon Voigtländer USD prices all still match B&H regular). Zeiss Otus ML 35/50/85 Z from zeiss.com's per-mount Technical Data (Z is 2-3mm longer and 20-40g heavier than E); B&H $2,299 / $2,499 / $2,999; images gapped as on sony/. Also fixed sony zeiss-otus-ml-35mm-f14 year 2025 -> 2026 (announced 2026-02-24).
**Laowa done 2026-10-21 (14 lenses):** Aksen 45 / 17.5, 4.5-10 CF fisheye, 200 f/2 AF, 180 1.5X macro, RL 9/11/14, Argus 25 CF APO / 35 / 45, 9mm f/2.8 Zero-D, 12-24 f/5.6 Zoom, 4mm fisheye. Shared optics cloned from the Sony entries; Z-specific figures where Laowa gives them (200mm 176.8mm long, 12-24 95.6mm), B&H Nikon Z listings for the rest (180mm Z 134.4mm / 522g; RL 11 Z matches Laowa's single figure). USD = venuslens Nikon Z variation regular price. Argus 25 isn't on Laowa's US store: specs from laowa.com.au + B&H Z listing (match), USD = B&H regular $549. Images reuse the Sony entries' shots (as the existing Nikon Laowa entries do); RL 9/11/14 gapped as on sony/.
**Viltrox + Tamron done 2026-10-21:** Viltrox's "missing" AF 27mm f/1.2 Pro was already in the data (`viltrox-27mm-f12`, productUrl null) but held the Sony E column's 560g / 92mm; corrected to the Z column (605g / 94mm) and given its Z store page + sources. Tamron 20-40mm f/2.8 (A062) Z added from tamron.com's per-mount spec table ($729, on sale 2026-10-22).
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
| Viltrox + Tamron | 2 | 1 (+1 fixed) | 0 | 859674a |
| Laowa | 16 | 14 | 2 | 7f2a8ca |
| Voigtländer + Zeiss | 5 | 5 | 0 | (this commit) |

## Skipped (with reason)
- Laowa ACRIS 35mm f/2.8 1X Macro (Z AF version, $449, 570g): Laowa gives dimensions for EF only and B&H's Z listing has none — Z length unknown.
- Laowa 12mm f/2.8 Zero-D (original): DSLR-era design (owner rule from the Sony pass). MF 14-blade variants of the 10mm/12mm Lite: same optics as the AF entries already in the data.

## Method (reuse from the Sony pass)
- Gaps: diff each maker's `products.json` handles and names against `productUrl`s/names (a handle can be a substring of another maker's URL — check by name).
- Specs: maker's own table for the Z column; B&H Nikon Z listing where the maker publishes specs only as images or omits Z dimensions. Maker wins on conflict.
- Prices: regular (compare-at) price for the Z variant; B&H strikethrough when the maker has no US store.
- One commit per batch with this file and tasks.md updated; raise ASIN_GAP_BASELINE per batch.
