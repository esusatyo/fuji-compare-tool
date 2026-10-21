# Progress — Panasonic + Leica missing third-party lenses

**Resume at:** 3.3 (TTArtisan L)
**3.2 done 2026-10-22 (19 Laowa L lenses):** Aksen 45 / 17.5, 35 TS 0.5x, 11 / 14 / 9 RL, 12 Lite (MF), 8-15 fisheye, 15 0.5x macro, 55 / 100 TS, 10 f/2.8 (MF), Argus 28, 58 2X, 20 / 15 Shift, 100 2X macro, 10-18, 25 2.5-5X. Shared optics cloned from the Sony entries (slug + `-l`); size/weight from Laowa where it gives one figure for all mounts (cross-checked against each B&H L-Mount listing) or an L/RF figure (12 Lite MF L 475g; 8-15 RF = 20mm flange like L); USD = venuslens L variation regular. L versions of the 12mm Lite and 10mm are manual focus (AF is E/Z only) -> afType Manual. 55 TS: B&H L listing gives 162mm (the 100mm TS's length), Laowa's 168.5mm used. 100 2X macro: Laowa doesn't list L; B&H L 155mm / 638g used. Images reuse the Sony shots; 6 gapped (RL x3 and 15 Shift as on sony/nikon; 12 Lite and 10mm MF L: Laowa only shows the AF E barrel).
**3.1 done 2026-10-22:** Samyang AF 35-150 f/2-2.8 L added (Samyang US store L spec table: 1,206g / 155.4mm / 0.32m / 0.184x; USD = B&H $1,399, the store shows it sold out at a $1,199 sale vs $1,499 compare-at). Fixed sony samyang-35-150mm-f2-28: year 2024 -> 2023, min aperture 16 -> 22, max magnification 0.175 -> 0.18, USD $1,499 compare-at -> $999 selling (= B&H; same rule as the 24-60/24-70), regional recomputed. Viltrox: B&H and the store list only the 6 L lenses already entered (+ cine). Sirui L = cine/anamorphic only; Yongnuo has no L lenses.
**2.2 done 2026-10-22:** 21 OM System lenses copied verbatim from olympus/data.js into Panasonic's OM System Primes/Zooms groups (all had ASINs); LUMIX G X Vario 35-100 f/2.8 II copied into olympus/data.js with its image gap.
**2.1 done 2026-10-22:** 14 Sigma L lenses copied verbatim from sigma/data.js (shared-mount test now compares 38 shared ids) into the existing Sigma Primes/Zooms groups; 18 Leica SL lenses copied from leica/data.js into new "Leica SL Primes / Zooms (L-Mount)" groups. ASIN baseline +4 (copies that had none).
**Branch:** canon-sony-lens-refresh (local csr-continue, worktree refresh-camera-data-sep2026); same PR as Canon/Sony/Nikon (#78)
**Owner decision 2026-10-22:** Leica gets M-mount third-party lenses and every full-frame L lens on Panasonic's page; Leica SL lenses go onto Panasonic's page; Sigma's page stays first-party only.

## Catalogue diff (2026-10-22)
Makers' store catalogues (Shopify `products.json`, venuslens Woo Store API) and the sibling brand files vs `panasonic/data.js` / `leica/data.js`. Counts are candidates before spec checks; APS-C L-Mount lenses are out of scope (no Panasonic body uses them; same rule that already leaves Sigma's DC DN L lenses out).

### Copies of entries already verified in another brand file
| From | To | Count | Notes |
|---|---|---|---|
| sigma/data.js | panasonic | 14 | 13 current + 24-70 f/2.8 DG DN (I) discontinued |
| leica/data.js (SL) | panasonic | 18 | TL lenses (APS-C) stay Leica-only |
| olympus/data.js | panasonic | 21 | all current M.Zuiko lenses not yet on Panasonic |
| panasonic/data.js | olympus | 1 | LUMIX G X Vario 35-100 f/2.8 II (discontinued) |
| panasonic (all full-frame L) | leica | ~75+ | LUMIX S, Sigma, Laowa, Viltrox, Samyang + this pass's new L lenses |

### New lenses
| Maker | Mount | In data | Candidates | Notes |
|---|---|---|---|---|
| Samyang | L | 1 | 1 | AF 35-150mm f/2-2.8 L |
| Viltrox | L | 6 | 0 | store's 6 L lenses all present |
| Laowa | L | 4 | ~25 | full-frame Zero-D / macro / shift / RL / Cookie / Argus 28 |
| TTArtisan | L | 0 | ~14 | AF 50/75/85 Neo, AF 40, tilt/tilt-shift, 11 fisheye, 14, 50 f/1.4, 90 f/1.25, 100 macro, 500 |
| 7Artisans | L | 0 | ~14 | AF 10/24/35/40/50/85/135, MF 10/14/18/35/75 |
| Meike | L | 0 | ~11 | AF 24 MIX, 35 Pro, 35 f/2, 50 f/1.8, 55 Pro, 85 Pro/SE II/f/1.4/II, MF 50 f/1.2 / f/1.7 |
| SG-image | L | 0 | 3 | AF 35 f/2.2, MF 24 f/6.3, MF 50 f/1.8 |
| Laowa | MFT | 2 | ~6 | Argus 25 f/0.95, 17 f/1.8, 50 2X macro, 4mm, 4.5-10 CF, Aksen |
| Voigtländer | MFT | 1 | ~6 | Nokton f/0.95 series, Super Nokton 29 f/0.8 |
| TTArtisan | MFT | 1 | ~12 | APS-C MF line in M43 |
| 7Artisans | MFT | 3 | ~12 | APS-C MF line in M43 |
| Meike | MFT | 0 | ~13 | MF line for M43 |
| SG-image | MFT | 0 | ~8 | MF line for M43 |
| Samyang | MFT | 0 | ~12 | MF line, MFT column of Samyang's per-mount tables |
| Voigtländer | M | 0 | ~30 | VM line |
| Zeiss | M | 0 | ~9 | ZM line |
| TTArtisan | M | 0 | ~10 | |
| 7Artisans | M | 0 | ~6 | |
| Thypoch | M | 0 | ~8 | Simera 21/28/35/50/75, Ksana 21/35, Eureka 28 |
| Laowa | M | 0 | ~6 | RL 9/11/14, 15 f/2, 15 Cookie, 12-24, 85 macro |

## Batches
| Batch | Candidates | Entered | Skipped | Committed |
|---|---|---|---|---|
| 2.1 Sigma L + Leica SL copies | 32 | 32 | 0 | 4e1b295 |
| 2.2 OM System → Panasonic, LUMIX 35-100 II → Olympus | 22 | 22 | 0 | 09f2b67 |
| 3.1 Samyang + Viltrox L | 1 | 1 (+1 Sony fix) | 0 | 557b846 |
| 3.2 Laowa L | 23 | 19 | 4 | (this commit) |

## Skipped
### Laowa L (3.2)
- ACRIS 35mm f/2.8 1X Macro: L version is manual focus; Laowa gives weights for E/Z/EF only and dimensions for EF only; B&H's L listing has no dimensions or weight (same as the Nikon skip).
- 12-24mm f/5.6 Zoom (non-shift): Laowa's per-mount lengths cover M/RF/E/Z, not L; B&H's L listing has no dimensions.
- 15mm f/5 Cookie FF: Laowa gives E (35.2mm/138g) and M (25mm/104g) only; B&H's L listing has weight (140g) but no dimensions.
- 85mm f/5.6 2x Ultra Macro: Laowa's weights cover RF/Z/FE/M (with hood and caps), not L; B&H's L listing has no weight.
- Out of scope (APS-C on L): 4.5-10mm CF fisheye, 9mm f/2.8 Zero-D, 10mm f/4 Cookie, 65mm 2x macro, 4mm fisheye, 12-24mm Zoom Shift CF, 8-16mm CF; cine / probe / Aurogon microscope lenses; 17mm Shift-only and 15mm f/4.5R (14-blade) SKUs are variants of entered designs.
