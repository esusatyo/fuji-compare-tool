# Progress — Canon missing third-party lenses + price consistency

**Resume at:** 2.1 (Laowa)
**Branch:** csr-continue → origin canon-sony-lens-refresh (PR #78)
**Baseline 2026-10-22:** 39 third-party Canon lenses — Sigma 11, TTArtisan 12,
Laowa 5, Tamron 3, 7Artisans 3, Samyang 2, Yongnuo 2 (discontinued), Viltrox 1
(discontinued).

## Catalogue diff (2026-10-22)

Store catalogues read on 2026-10-21 (Shopify `products.json`, Laowa's Woo Store
API) and filtered to RF / EOS-R variants; EOS-M variants are EF-M, a different
mount, and are excluded.

| Maker | RF in catalogue, not in data | Notes |
|---|---|---|
| Laowa | ~30 | ACRIS 35, Aksen 45 / 17.5, 4.5-10 fisheye, 17 TS, 35 TS, 180 macro, 12 Lite, 8-15 fisheye, 15 f/4.5 macro, 55 TS, 100 TS, 15 Cookie, 12-24 shift, 10 f/2.8, 8-16, Argus 28 / 33 / 35 / 45, 12-24, 20 shift, 85 f/5.6, 15 shift, 14 RL, 11 RL, 65 2x, 4mm, 9mm, 25 2.5-5x (+ Argus 25 on laowa.com.au). Out: cine, probes, kits, MSC, Aurogon, 12mm f/2.8 Zero-D (DSLR-era) |
| 7Artisans | ~12 | 6 f/2, 14 f/2.8, 75 f/1.4, 60 f/2.8 2X, 35 f/1.4 APS-C, 25 f/0.95, 50 f/0.95, 10 f/2.8 fisheye (I), 60 f/2.8 II, 35 f/5.6, 35 f/0.95, 7.5 f/2.8 II |
| TTArtisan | ~8 | APS-C 35 f/0.95, APS-C 25 f/2, 50 f/2, 11 f/2.8 fisheye, 90 f/1.25, APS-C 40 macro, APS-C 7.5 f/2, 21 f/1.5, Tilt-Shift 100 f/2.8 |
| Voigtländer | 3 | Nokton 50 f/1, 40 f/1.2, 75 f/1.5 (RF versions) |
| Thypoch | 2 | Simera 28 f/1.4, Simera 35 f/1.4 |
| Samyang | 1 | MF 85mm f/1.4 RF |
| Meike | ? | none on meikeglobal.com for RF; MF RF primes reported at retailers |
| Yongnuo | 4 leads | from August: 23 f/1.4 APS-C, 35 f/1.8 DA, 50 f/1.8, 85 f/1.8R II (no specs then) |
| SG-image, Viltrox | 0 | SG-image sells EF-M, not RF; Viltrox's RF AF lenses were withdrawn |

## Batches

| Batch | Added | Skipped | Commit |
|---|---|---|---|

## Price consistency

47 compare-at entries (sony 23, fujifilm 22, canon 2): samyangus.com 37,
viltrox.com 5, 7artisans.store 2, meikeglobal.com 2, ttartisan.store 1.
Sale/compare-at ratio at read time 0.39 (7Artisans 25 f/0.95, fujifilm) to
0.94 (Meike 25 f/1.8, fujifilm).

## Skipped (with reason)
