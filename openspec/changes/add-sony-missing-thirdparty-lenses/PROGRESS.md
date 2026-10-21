# Progress — Sony missing third-party lenses

**Resume at:** 2.5 Laowa — 34 candidates mapped (scratch method below); read each lens's spec table BY HAND
**Laowa notes (2026-10-19):**
- Candidates (venuslens slug → laowa.com.au slug) are the E-capable lenses minus the 3 already in the data (90 macro, 15 f/2, 10 Cookie) and minus bundles ("The …"), cine, probe, Magic Shift Converter.
- **Trap:** laowa.com.au table rows include WooCommerce SHIPPING placeholders ("9.5 × 7 cm", "0.503 kg") and unit typos ("254 kg"). Never take Dimensions/Weight from the first table row; use the lens's own spec row (often a second "Dimensions"/"Weight" row) and cross-check against venuslens.net's product page (Chrome; in-page fetch of /product/<slug>/ works, output truncates ~1000 chars).
- Sony E variation regular prices (venuslens, 2026-10-19): Acris 35 449; Aksen 749; 4.5-10 399; 17 TS 1249; Argus 33 449; 105 STF 699; 11 RL 549; 200 f/2 AF 1999; 180 macro 499; 12 Lite 699; 8-15 699; 15 f/4.5 macro 399; 55 TS 1249; 100 TS 1249; 15 Cookie 399; 12-24 shift 699; 10 f/2.8 AF 799; 8-16 549; Argus 28 599; 58 macro 499; 12-24 f/5.6 649; 20 shift 1099; Argus 45 599; 85 macro 449; Argus 35 649; 15 shift 1199; 14 RL 449; 9 RL 599; 65 macro 399; 4mm 199; 100 macro 499; 10-18 599; 9mm 399; 25 ultra macro 399.
- Images: use laowa.com.au / laowalenses.ca (venuslens images fail when embedded).
**Branch:** canon-sony-lens-refresh (rebased onto main 2026-10-21; now worked from worktree refresh-camera-data-sep2026, local branch csr-continue)   **Last green commit:** 427328a Canon: check third-party RF prices

## Method (reuse)
- Find gaps: diff each maker's Shopify `products.json` handles against `productUrl`s.
- Specs: product page spec table / infographic; locate with `tesseract` OCR, confirm every figure by eye.
- Prices: Shopify regular price (compare-at when on sale) — owner rule.
- One commit per maker batch, with this file and tasks.md updated in the same commit.

## Batches
| Maker | Candidates | Entered | Skipped | Committed |
|---|---|---|---|---|
| Viltrox | 23 | 21 | 2 (404, cine) | 4c4b97e |
| Samyang | 33 | 32 | 1 (3-lens set) | 98cc6ab |
| Sigma | 18 (+8 renamed) | 17 | 1 (no US price) | 52d6307 |
| Tamron | 14 | 14 | 0 (4 DSLR out of scope) | d366f95 |
| Laowa | 34 | — | — | in progress |

## Deferred / skipped (with reason)

## Open questions for the user
- ~~Samyang compare-at inflated on AF 24-60 / AF 24-70~~ — RESOLVED 2026-10-21: owner chose the selling price ($549 / $699); regional prices recomputed from it.
- Samyang MF images show the DSLR-mount barrel (noted per entry).

## Notes
- ASIN gap baseline raised per batch (no per-lens ASIN lookups); run check-prices-and-buy-links ASIN backfill after the pass.
