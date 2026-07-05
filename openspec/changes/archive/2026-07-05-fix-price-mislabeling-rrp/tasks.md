## 1. Display fix — shared price renderer

- [x] 1.1 Extract a single `renderPrice(item)` helper in `engine.js` that returns the price markup: selected-currency value with its symbol when non-null; else `USD $<n>` (USD symbol + explicit "USD" tag); else "Price unavailable"; preserving the existing discontinued "Discontinued / Launch: $X" branch.
- [x] 1.2 Replace the lens slot price logic (`engine.js:~438–442`) to use `renderPrice`, removing the `?? prices.USD`-with-local-symbol path.
- [x] 1.3 Replace the camera slot price logic (`engine.js:~449–459`) to use the same helper, confirming output matches current camera behavior.
- [x] 1.4 Fix the comparison-table price row (`engine.js:~248`) so its fallback uses the same tagged-USD / "Price unavailable" rule instead of `|| l.prices.USD` with the local symbol.

## 2. RRP labeling & disclaimer

- [x] 2.1 Add an "RRP" label to the left of the slot price value (markup + muted style in `engine.css`).
- [x] 2.2 Relabel the comparison-table price field to "RRP (list price)".
- [x] 2.3 Rewrite the footer disclaimer (`engine.js:~361`) to describe approximate manufacturer list prices (RRP) that may differ from live retail, and point to the Buy link for current pricing; remove "launch prices".

## 3. Pricing-data guardrail

- [x] 3.1 Define the `priceIncomplete` flag convention for live items whose non-USD RRP cannot be sourced; document it where the data schema is described.
- [x] 3.2 Add a data-tier test asserting every non-discontinued, non-`priceIncomplete` item has non-null values for all seven currencies, failing with the offending item id + currency.
- [x] 3.3 Run `npm test` and confirm the new test passes (flagging current gaps as either backfilled or `priceIncomplete`).

## 4. Backfill local-currency RRPs

- [x] 4.1 Backfill AUD RRPs for all USD-only live items (default-view currency), Canon and Fujifilm.
- [x] 4.2 Backfill EUR, GBP, JPY, CAD, SGD RRPs for live items; mark `priceIncomplete` where a figure genuinely can't be sourced.
- [x] 4.3 Verify discontinued items are left on the existing discontinued-display path (not backfilled).

## 5. Verify

- [x] 5.1 Run `npm test` (Tier 1 data + Tier 2 logic) and confirm green.
- [ ] 5.2 Manually preview both brands in AUD and one other currency; confirm the RF 24-105mm f/4 L IS USM and other formerly-mislabeled items show correct symbols, the "RRP" label, and the updated disclaimer.
