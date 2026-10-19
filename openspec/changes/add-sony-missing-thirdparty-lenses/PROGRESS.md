# Progress — Sony missing third-party lenses

**Resume at:** 2.3 Sigma — diff sigma-global.com E-mount lens list against sony/data.js (30 present); prices via sigmaphoto.com (MNT=Sony in sigma.py)
**Branch:** canon-sony-lens-refresh (worktree ../fuji-compare-canon-sony)   **Last green commit:** 427328a Canon: check third-party RF prices

## Method (reuse)
- Find gaps: diff each maker's Shopify `products.json` handles against `productUrl`s.
- Specs: product page spec table / infographic; locate with `tesseract` OCR, confirm every figure by eye.
- Prices: Shopify regular price (compare-at when on sale) — owner rule.
- One commit per maker batch, with this file and tasks.md updated in the same commit.

## Batches
| Maker | Candidates | Entered | Skipped | Committed |
|---|---|---|---|---|
| Viltrox | 23 | 21 | 2 (404, cine) | 4c4b97e |
| Samyang | 33 | 32 | 1 (3-lens set) | (this commit) |

## Deferred / skipped (with reason)

## Open questions for the user
- Samyang US compare-at prices used as USD (owner rule) look inflated on two zooms: AF 24-60 f/2.8 $1,399 (selling $549), AF 24-70 f/2.8 $1,299 (selling $699).
- Samyang MF images show the DSLR-mount barrel (noted per entry).

## Notes
- ASIN gap baseline raised per batch (no per-lens ASIN lookups); run check-prices-and-buy-links ASIN backfill after the pass.
