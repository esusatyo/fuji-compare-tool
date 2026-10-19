# Progress — Sony missing third-party lenses

**Resume at:** 2.2 Samyang — samyangus.com products.json (Sony E AF list; exclude Lens Station bundles / "copy-of" duplicates)
**Branch:** canon-sony-lens-refresh (worktree ../fuji-compare-canon-sony)   **Last green commit:** 427328a Canon: check third-party RF prices

## Method (reuse)
- Find gaps: diff each maker's Shopify `products.json` handles against `productUrl`s.
- Specs: product page spec table / infographic; locate with `tesseract` OCR, confirm every figure by eye.
- Prices: Shopify regular price (compare-at when on sale) — owner rule.
- One commit per maker batch, with this file and tasks.md updated in the same commit.

## Batches
| Maker | Candidates | Entered | Skipped | Committed |
|---|---|---|---|---|
| Viltrox | 23 | 21 | 2 (404, cine) | (this commit) |

## Deferred / skipped (with reason)

## Open questions for the user
- (none)

## Notes
- ASIN gap baseline raised per batch (no per-lens ASIN lookups); run check-prices-and-buy-links ASIN backfill after the pass.
