# Progress — Canon third-party lenses

**Resume at:** run complete — PR #22 open, archive after merge. The only
remaining tail is TTArtisan/7Artisans, blocked on unpublished dimensions.
**Branch:** expand-thirdparty-lenses-canon   **Last green commit:** see `git log -1`

Baseline at start of run: **14** third-party Canon lenses, all
`priceIncomplete: true`, 6 of 14 without an image. Now **21**, none carrying
`priceIncomplete`, 8 of 21 without an image.

## Batches
| Maker | Researched | Entered | Dropdown | Images | Prices | Committed |
|---|---|---|---|---|---|---|
| Sigma (follow-up) | ✅ 4/4 | ✅ 4 | ✅ | ✅ maker imgs | ✅ 7 cur | ✅ |
| Tamron (re-check) | ✅ 3/3 | ✅ 1 new | ✅ | ✅ maker img | ✅ 7 cur | ✅ |
| Viltrox (re-check) | ✅ no change | — | — | — | — | ✅ |
| TTArtisan | ✅ | ⛔ 0 — see deferred | — | — | — | ✅ |
| 7Artisans | ✅ | ⛔ 0 — see deferred | — | — | — | ✅ |
| Laowa (top-up) | ✅ 2/2 | ✅ 2 | ✅ | allowlisted | ✅ 7 cur | ✅ |
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
- ~~Laowa 58mm / 100mm 2× macros~~ — **both resolved and entered.** Laowa
  Canada (the official regional distributor) serves the spec table venuslens.net
  hides behind Cloudflare, and cameralabs supplied the rule that settles the
  100mm: "DSLR versions are about 30mm shorter and 15g lighter than the
  mirrorless versions". So 125 mm / 638 g is the EF row and RF is 155 mm /
  650 g. Both are allowlisted for images — no reachable maker photo.
- **TTArtisan** — 14 lenses do ship in RF and the official spec tables *are*
  reachable (curl + browser UA; WebFetch 404s on their URL encoding). The
  blocker is that TTArtisan **publishes no diameter or length for any lens in
  its catalogue**, and quotes weight as a range spanning all mounts rather than
  per mount. `diameter`/`length` are schema-required, so this is a wall, not a
  gap. Full enumeration with the specs they *do* publish is in
  `research/lenses.md`. Also: none of their nine AF lenses come in RF.
- **7Artisans** — 42 RF-capable SKUs via `7artisans.store/products.json`, none
  publishing dimensions; 7artisans.com serves no crawlable spec table. About
  half the RF list is cine/anamorphic and out of scope regardless.

## Not in scope but worth a follow-up
- **9 first-party Canon lenses** still carry `priceIncomplete: true`, so they
  remain USD-only. This run deliberately touched third-party only.
- ASINs: 16 of 21 third-party lenses still have `asin: null` (search
  fallback). `check-prices-and-buy-links` owns that backfill.

## Open questions for the user
- (none)
