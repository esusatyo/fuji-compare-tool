## Why

Owner review of PR #78 (2026-10-24) settled two pricing questions:

1. **Regional prices for new lenses:** when no local price can be confirmed, the lens stays USD-only rather than getting a ratio estimate — "but ensure the currency is shown correctly in the UI". Checking the UI found two places where it isn't:
   - the comparison table's "RRP (list price)" row shows "—" for a lens with no price in the selected currency, although the `price-display` spec already requires the same tagged-USD fallback as the slot header; and with one lens priced in the selected currency and the other not, the row highlights the priced one as the cheapest, comparing A$ with nothing;
   - a discontinued item in a non-USD currency shows "Launch: $1,299" with no currency code, which reads as the selected currency's dollar.
2. **How a price is chosen and cited:** "get sources from as many reputable retailers as possible, show all the citations (which can be more than one), then pick the most sensible price — not an anomaly, not a once-off discount, not an inflated price". Today `priceSource` holds exactly one citation, so a price checked against several stores can only cite one of them, and the skills describe single-source rules (official store first for a maker's own products; B&H for third-party lenses).

## What Changes

- `price-display`: the table's price row uses the tagged-USD fallback; the cheapest-price highlight only applies when every selected item has a price in the selected currency; the discontinued launch price is labelled USD.
- `pricing-data`: `priceSource` may be one citation or a list of citations; every citation renders in the References section (interactive pages and static vs-pages) and is checked by the live link test. Prices are chosen by the multi-source rule. New lenses without a confirmed local price leave that currency `null` (`priceIncomplete: true`) instead of a ratio estimate.
- Skills (`refresh-camera-data`, `check-prices-and-buy-links`, `add-thirdparty-lenses`) describe the multi-source rule and the USD-only rule.
- Existing prices keep their single citation until their next price check; no backfill in this change.

## Impact

- `engine.js` (price row fallback + highlight rule, discontinued label, References), `scripts/generate-seo.js` (References on vs-pages), `tests/helpers/schema.js`, `tests/links/links.test.js`, logic/data tests.
- No data migration: a single-object `priceSource` stays valid.
