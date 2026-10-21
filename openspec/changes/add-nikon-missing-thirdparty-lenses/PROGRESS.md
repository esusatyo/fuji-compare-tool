# Progress — Nikon missing third-party lenses

**Resume at:** 2.7 Thypoch / SG-image
**Meike done 2026-10-21 (4 lenses):** AF 85 f/1.4 MIX II, AF 56 f/1.7 Air, AF 23 f/1.4, AF 35 f/2. Shared optics from the Sony entries; Z size/weight from B&H Nikon Z listings; USD and image from Meike's Z store listing (all USD equal the Sony E prices).
**7Artisans done 2026-10-21 (13 lenses):** 10 f/2.8 II, 75 f/1.4, 18 f/5.6, AF 10 f/2.5 Fisheye, AF 24 f/1.8, AF 135 f/1.8, 14 f/2.8, 10 f/3.5, 10 f/2.8 Fisheye, 25 f/1.8, 9 f/5.6, 60 f/2.8 2X Macro, 18 f/6.3 II. Shared optics cloned from the Sony entries; Z size/weight from each B&H Nikon Z listing (7Artisans publishes specs as images). USD = store Z variant regular (compare-at) price — all equal to the Sony E prices.
**TTArtisan done 2026-10-21 (7 lenses):** 50 f/1.2, Tilt 35 f/1.4, 14 f/2.8, 40 f/2.8 Macro, Tilt-Shift 17 f/4, 35 f/1.4, 11 f/2.8 Fisheye. Maker tables give one spec set for all mounts (weight as a range); the Z size/weight are each lens's B&H Nikon Z listing. USD = store Z variant price (no compare-at). Z-specific product shots where the store has them (SKU-Z files). Nikon's "Other" dropdown group split into Yongnuo / TTArtisan / 7Artisans / Meike, as on sony/.
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
| Voigtländer + Zeiss | 5 | 5 | 0 | 63bfe4e |
| TTArtisan | 22 | 7 | 15 | f2506c2 |
| 7Artisans | 25 | 13 | 12 | 0381050 |
| Meike | 18 | 4 | 14 | (this commit) |

## Skipped (with reason)
- Laowa ACRIS 35mm f/2.8 1X Macro (Z AF version, $449, 570g): Laowa gives dimensions for EF only and B&H's Z listing has none — Z length unknown.
- Laowa 12mm f/2.8 Zero-D (original): DSLR-era design (owner rule from the Sony pass). MF 14-blade variants of the 10mm/12mm Lite: same optics as the AF entries already in the data.

- TTArtisan, B&H Z listing has no lens dimensions and TTArtisan gives only size diagrams: 50mm f/2, Tilt 50mm f/1.4, 100mm f/2.8 2X Macro, APS-C 10mm f/2, 17mm f/1.4, 500mm f/6.3, APS-C 50mm f/0.95, 50mm f/1.4 ASPH.
- TTArtisan, Z dimensions on B&H but the lens weight only as TTArtisan's cross-mount range (owner question: enter the range's upper figure?): APS-C 23mm f/1.4 (60 x 40.5mm; 222~250g), 7.5mm f/2 Fisheye (72 x 57mm; 343~370g), APS-C 25mm f/2 (59 x 31mm; 166~189g), APS-C 35mm f/0.95 (63 x 43mm; 247~267g).
- TTArtisan, not at B&H and no maker table: AF 24mm f/3.8 mini (new 2026-10, 57g, E/Z), AF 32mm f/2.8 (Z), 21mm f/1.5. Out of scope: M 100mm f/2.8 Bubble (M42/M only), 90mm f/1.25 (GFX/XCD only), Leica-M lenses.
- 7Artisans, B&H Z listing has no lens dimensions: 35mm f/1.4 Mark III, 7.5mm f/2.8 II Fisheye, 35mm f/1.4 (APS-C), 35mm f/5.6, 6mm f/2 Fisheye, 35mm f/1.2 Mark II. Z dimensions but no Z weight: 50mm f/1.2 (62 x 68mm), 12mm f/2.8 Mark II (70 x 66mm). Not at B&H in Z: 25mm f/0.95, 50mm f/0.95, 35mm f/0.95, 60mm f/2.8 II (APS-C). AF 50/85 f/1.8 'for L' listings are L-mount only.
- Meike, B&H Z listing has no lens dimensions: AF 33mm f/1.4, MF 10mm f/2, AF 85mm f/1.4 (I), MF 50mm f/0.95, MF 7.5mm f/2.8 Fisheye, AF 55mm f/1.8 Pro, AF 55mm f/1.4. Not at B&H in Z, no maker size: MF 50mm f/1.2 FF, AF 25mm f/1.7 Air, MF 25mm f/0.95, MF 35mm f/0.95, MF 60mm f/2.8 Macro, MF 12mm f/2.8, MK 85mm f/2.8 Macro (2019 pre-sale listing). 85mm f/1.8 Pro Mark II: same version question as on sony/ (owner: skip).

## Method (reuse from the Sony pass)
- Gaps: diff each maker's `products.json` handles and names against `productUrl`s/names (a handle can be a substring of another maker's URL — check by name).
- Specs: maker's own table for the Z column; B&H Nikon Z listing where the maker publishes specs only as images or omits Z dimensions. Maker wins on conflict.
- Prices: regular (compare-at) price for the Z variant; B&H strikethrough when the maker has no US store.
- One commit per batch with this file and tasks.md updated; raise ASIN_GAP_BASELINE per batch.
