# Progress — Canon third-party lenses

**Resume at:** run complete — open the PR, then archive after merge. The next
pass starts from the deferred list below.
**Branch:** expand-thirdparty-lenses-canon   **Last green commit:** see `git log -1`

Baseline at start of run: **14** third-party Canon lenses, all
`priceIncomplete: true`, 6 of 14 without an image. Now **19**, none carrying
`priceIncomplete`, 6 of 19 without an image.

## Batches
| Maker | Researched | Entered | Dropdown | Images | Prices | Committed |
|---|---|---|---|---|---|---|
| Sigma (follow-up) | ✅ 4/4 | ✅ 4 | ✅ | ✅ maker imgs | ✅ 7 cur | ✅ |
| Tamron (re-check) | ✅ 3/3 | ✅ 1 new | ✅ | ✅ maker img | ✅ 7 cur | ✅ |
| Viltrox (re-check) | ✅ no change | — | — | — | — | ✅ |
| TTArtisan | ✅ | ⛔ 0 — see deferred | — | — | — | ✅ |
| 7Artisans | ✅ | ⛔ 0 — see deferred | — | — | — | ✅ |
| Laowa (top-up) | ✅ | ⛔ 0 — see deferred | — | — | — | ✅ |
| Prices: drop `priceIncomplete` on the pre-existing 14 | — | — | — | — | ✅ 14/14 | ✅ |

Sigma batch entered: `sigma-12mm-f14` (2025, $629), `sigma-15mm-f14` (2026,
$579), `sigma-17-40mm-f18` (2025, $919), `sigma-16-300mm-f35-67` (2025, $769).
All four confirmed shipping in Canon RF; all four use **RF-specific** weights
and dimensions, which differ from the E/X/L figures most reviews quote.

Tamron: the 17-70mm f/2.8 (B070) **shipped for RF on 2 Jul 2026** — the
previous pass had recorded it as "NOT on RF", which was true then. Entered at
the RF-specific 530 g / 117.3 mm, $749.
Viltrox: no change. The RF-S AF primes remain rumoured; the 85mm f/1.8 RF II
already in the dataset is still the only shipping native RF AF Viltrox.

Prices: `priceIncomplete` removed from all 14 pre-existing third-party lenses
and `compute-prices.js` run, so every Canon third-party lens now shows a price
in all seven currencies instead of a lone USD figure.

## Deferred / skipped (with reason)
- `tamron-17-70mm-f28` — **entered** under the new-release exception: no
  independent tier-2 review exists yet (shipped 2026-07-02). Specs are Tamron's
  own per-mount figures. **Re-verify next pass.**
- **Laowa 100mm f/2.8 2× Ultra Macro APO** — sources disagree on the RF
  variant's length and weight and no tier-1 page publishes an RF row.
  laowalenses.ca gives Ф72 × 125 mm / 638 g for *Canon EF* and Ф72 × 155 mm for
  *Sony FE*; B&H lists 155 mm / 650 g against the RF SKU; Dustin Abbott's
  RF-mount review says 125 mm / 638 g. Blades (13), MFD (24.7 cm), 2.0×, 67 mm
  filter and 12/10 construction are all agreed — only the barrel figures are
  unresolved. Needs the RF box or a Venus Optics RF spec sheet.
- **Laowa 58mm f/2.8 2× Ultra Macro APO** — same shape of problem: B&H says
  595 g, Dustin Abbott's review says 564 g, and venuslens.net blocks fetching
  so tier 1 can't arbitrate. Everything else (Ф74 × 117 mm, 13 blades, 67 mm,
  2.0×, 14/11) is agreed.
- **TTArtisan RF primes** (35/1.4, 50/1.4 ASPH, 23/1.4, 17/1.4, 75/2, 90/1.25)
  — TTArtisan's official spec pages 404, the store pages omit dimensions,
  blades and filter thread, and the RF variants show "sold out or unavailable".
  admiringlight has an RF-mount review of the 50mm f/1.4 (457 g, 0.5 m, f/1.4-16,
  $239) but no dimensions. Not enough for a complete entry.
- **7Artisans RF primes** (35/1.4, 50/0.95, 60/2.8 macro, 10/2.8 fisheye) —
  same: no reachable official spec table, B&H 403s. The cine/anamorphic RF
  lenses stay out of scope regardless.

## Not in scope but worth a follow-up
- **9 first-party Canon lenses** still carry `priceIncomplete: true`, so they
  remain USD-only. This run deliberately touched third-party only.
- ASINs: 15 of 19 third-party lenses still have `asin: null` (search
  fallback). `check-prices-and-buy-links` owns that backfill. A verified RF
  ASIN was spotted for the Laowa 100mm (`B0851QX7X5`) if it is ever entered.

## Open questions for the user
- (none)
