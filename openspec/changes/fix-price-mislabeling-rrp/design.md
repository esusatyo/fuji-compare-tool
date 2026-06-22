## Context

Prices live per-item in each brand's `data.js` as a `prices` object keyed by the seven supported currencies. The engine renders prices in two places:

- **Slot display** (`engine.js:~438–442` for lenses, `~449–459` for cameras).
- **Comparison-table price row** (`engine.js:~248`).

The camera slot renderer already handles a missing local-currency price gracefully (shows a tagged `USD $…` fallback or "Discontinued / Price unavailable"). The lens slot renderer and the table row instead do `prices[currentCurrency] ?? prices.USD` (or `|| prices.USD`) while still emitting the local currency symbol, so a USD number gets a foreign symbol — the "A$1,199" bug. Roughly 37 Canon + 23 Fujifilm items (mostly lenses) only have USD populated.

The Amazon Buy link is already currency-aware and points at the live listing, so "current price" is already served there; the stored number is a list price (RRP).

## Goals / Non-Goals

**Goals:**
- No price ever renders a USD value with a non-USD symbol.
- Users can tell at a glance the figure is an RRP/list price (explicit "RRP" label), reducing confusion vs the live Buy-link price.
- A single shared code path governs the fallback for cameras, lenses, slot, and table.
- Local-currency RRPs are backfilled for live items, with a test that prevents regression.

**Non-Goals:**
- No separate "current retail price" field or live price scraping — the Buy link covers live pricing.
- No change to the Buy-link / ASIN wiring.
- No currency auto-conversion from USD (conversions drift and would be wrong by tax/region); prices remain explicit per currency.

## Decisions

**1. Extract one `renderPrice(item)` helper.** Centralize the symbol/fallback logic so lenses, cameras, slot, and table all share it. Behavior: if `prices[currentCurrency]` is non-null → show it with that currency's symbol; else if `prices.USD` is non-null → show `USD $<n>` (USD symbol + explicit "USD" tag); else → "Price unavailable". Discontinued items keep their existing "Discontinued / Launch: $X" branch. _Alternative considered:_ patch each call site independently — rejected, that's how the lens/table paths drifted from the camera path in the first place.

**2. "RRP" label as a left-side tag in the slot.** Add a small `RRP` element (e.g. `<span class="price-rrp-label">RRP</span>`) to the left of the slot price value, styled muted. Table price row label becomes "RRP (list price)". _Alternative considered:_ tooltip only — rejected, not visible enough to defuse the Amazon-mismatch confusion.

**3. Incomplete-pricing flag for genuine gaps.** Introduce an explicit `priceIncomplete: true` (or equivalent) flag for live items whose non-USD RRP truly can't be sourced, so the guardrail test can distinguish "not yet filled / unavailable" from "regression". Flagged items display via the USD fallback. _Alternative considered:_ allow any null silently — rejected, defeats the guardrail.

**4. Guardrail test in the data tier.** Iterate every brand dataset; for each non-discontinued, non-flagged item assert all seven currencies are non-null, failing with the offending item id + currency. Lives alongside the existing data-tier tests.

## Risks / Trade-offs

- **Backfilled RRPs go stale over time.** → Acknowledge via the disclaimer + "RRP" label; live price stays on the Buy link. The `check-prices-and-buy-links` / `refresh-camera-data` skills already exist to refresh periodically.
- **Sourcing 6 currencies × ~60 items is effortful and error-prone.** → Prioritize AUD (default view), live models, and lenses; allow `priceIncomplete` for genuine gaps so the change isn't blocked on 100% coverage.
- **Refactor could alter camera price output.** → The shared helper must reproduce the current camera behavior exactly (discontinued branch, USD fallback tag); covered by existing + new tests.

## Migration Plan

Phased, each independently shippable:
1. Display fix + shared `renderPrice` helper + RRP label + disclaimer (no data needed; fixes the visible symptom immediately).
2. Add the `priceIncomplete` flag concept + guardrail test (test may start tolerant, then tighten as data lands).
3. Backfill local-currency RRPs per brand/currency.

Rollback: revert the engine/data commits; no persisted state or external dependencies involved.
