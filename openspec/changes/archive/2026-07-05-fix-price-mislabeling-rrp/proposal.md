## Why

When a camera or lens has no price for the selected currency (e.g. AUD is `null`), the engine falls back to the raw USD number but still renders it with the local currency symbol — so the RF 24-105mm f/4 L IS USM shows "A$1,199" when 1,199 is the USD list price (real AU RRP ≈ A$1,599). This mislabels prices on ~37 Canon + ~23 Fujifilm items (mostly lenses) and makes the app look wrong against the live Amazon Buy link. Even with correct data, a stored list price legitimately differs from a live marketplace price, so the field needs to be honestly labeled as RRP.

## What Changes

- Fix the lens price renderer and the comparison-table price row so a `null` local-currency price never renders the USD number with a foreign currency symbol — match the existing camera fallback behavior (tagged `USD $…` or "Price unavailable").
- Add an **"RRP"** label to the left of the price in the slot display, so users understand the figure is a list price and may differ from the live Amazon Buy link price.
- Relabel the comparison-table price field to **"RRP (list price)"** and fix the misleading "approximate launch prices" footer disclaimer to describe RRP / list pricing and point to the Buy link for live prices.
- Backfill local-currency RRPs (AUD, EUR, GBP, JPY, CAD, SGD) for the USD-only items in both brand datasets.
- Add a data-tier guardrail test asserting non-discontinued items carry a full currency price set (or an explicit allowed-incomplete flag), so a `null` price can't silently regress into a mislabeled fallback again.

## Capabilities

### New Capabilities
- `price-display`: How prices are rendered in slots and the comparison table — RRP labeling, the disclaimer wording, and the rule that a missing local-currency price is never shown with a mismatched currency symbol.
- `pricing-data`: Integrity rules for the per-item `prices` data — which currencies a live (non-discontinued) item must populate, and how incomplete pricing is flagged, enforced by an automated test.

### Modified Capabilities
<!-- None — no existing specs in openspec/specs/. -->

## Impact

- `engine.js`: lens slot renderer (`~438–442`), camera/lens table price row (`~248`), slot price markup + RRP label, footer disclaimer (`~361`).
- `canon/data.js`, `fujifilm/data.js`: backfilled local-currency `prices` values; possible `priceIncomplete` (or equivalent) flag for genuinely unavailable cases.
- `tests/`: new data-tier guardrail test for currency price completeness.
- No change to the Amazon Buy link wiring (already currency-aware and live).
