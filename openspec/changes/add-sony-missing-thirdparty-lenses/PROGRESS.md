# Progress — Sony missing third-party lenses

**Resume at:** 2.8 TTArtisan (~20 E)
**Zeiss done 2026-10-21 (8 lenses):** Batis 18/40 CF/135, Touit 12/50M, Otus ML 35/50/85 (new 2025 manual line). Specs from zeiss.com per-line Technical Data tables (use "Diameter max." and "Length (Without Lens Caps)", E column); USD from B&H. Batis 25/85 were wrongly marked discontinued (Zeiss lists them, B&H stocks them new) — now current; Batis 85, Loxia 35, Touit 32 had wrong sizes (with-caps length / focus-ring diameter) — corrected. Loxia 25/50/85 NOT added: B&H no longer stocks Loxia (one Loxia 50 at clearance), no citable US price. 5 image gaps (Zeiss has only family shots; Commons has nothing).
**Voigtländer done 2026-10-21 (13 lenses):** Cosina's E-mount list (17 current, 3 already in) — specs from each EN product page; USD = B&H regular (strikethrough) price, a fall sale was on. Existing Nokton 40 f/1.2 $799 -> $1099. **Trap:** a Cosina page's FIRST image (…P00…) is a sample photo, not the lens — use the `…-01` file. That bug was live on sony APO-Lanthar 35/50 and panasonic+olympus Nokton 25 f/0.95; all fixed here.
**Laowa done 2026-10-21 (35 lenses):** specs from venuslens.net store API descriptions (Laowa's own spec tables; laowa.com.au attributes are copies, not a 2nd source). B&H Sony E listings filled what Laowa leaves out or gives for another mount only: min apertures, ACRIS/8-15/12mm Lite E dimensions, and diameter-vs-length order (Laowa's "A x B" order is inconsistent: 9mm and 25mm are length x diameter). Images: first laowa.com.au gallery shot (mostly files named *FE/*SE); 4 gapped (RL 9/11/14 galleries show only the Leica M barrel; 15mm Shift's image is a copy of the 20mm Shift's). Typo fixed: 12mm Lite MFD "14mm" -> 14cm.
**Found in other brands (fix in the Nikon refresh / follow-up):** nikon laowa-25mm-f28-25-5x-macro and laowa-17mm-f4-tilt-shift have length/diameter swapped; nikon laowa-argus-33mm-f095 minAperture 16 (B&H/Fuji: f/11); nikon laowa-15mm-f45-shift uses the 20mm Shift's photo; fujifilm laowa-4mm-f28-fisheye and laowa-12-24mm-f56-shift have length/diameter swapped vs Laowa's order.
**Not entered — owner decided 2026-10-21 to leave out:** DSLR-era designs still sold with a Sony FE mount: 105mm f/2 STF, 60mm f/2.8 2X Macro, 15mm f/4 Wide Angle Macro, 12mm f/2.8 Zero-D (original). Also skipped: bundles, cine, probe, Aurogon microscope, MSC, 10mm Cookie silver (same lens).
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
| Laowa | 39 | 35 | 4 (DSLR-era FE, owner: out) | fb9e34d |
| Voigtländer | 13 | 13 | 0 | fe9691e |
| Zeiss | 11 | 8 | 3 (Loxia, discontinued) | (this commit) |

## Deferred / skipped (with reason)

## Open questions for the user
- ~~Samyang compare-at inflated on AF 24-60 / AF 24-70~~ — RESOLVED 2026-10-21: owner chose the selling price ($549 / $699); regional prices recomputed from it.
- Samyang MF images show the DSLR-mount barrel (noted per entry).

## Notes
- ASIN gap baseline raised per batch (no per-lens ASIN lookups); run check-prices-and-buy-links ASIN backfill after the pass.
