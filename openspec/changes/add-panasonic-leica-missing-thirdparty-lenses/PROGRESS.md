# Progress — Panasonic + Leica missing third-party lenses

**Resume at:** 2.2 (copies: OM System → Panasonic; LUMIX 35-100 II → Olympus)
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
| 2.1 Sigma L + Leica SL copies | 32 | 32 | 0 | (this commit) |

## Skipped
