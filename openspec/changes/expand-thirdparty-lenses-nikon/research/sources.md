# Nikon Z third-party lenses — round 2 source log

Per-source log, written as each URL is read. T1 maker's own site (incl.
official regional sites) · T2 independent measurement/review · T3 retailer
(price/availability only) · T4 aggregator (tables only, never mount
attribution) · NEWS dated announcement (year only).

Record sources for facts you *rejected* too, with the reason — that's what
stops a later pass "correcting" a right value to a wrong one.

## Sigma+Tamron batch (2026-08-29, hand-merged — see PROGRESS.md)

- **T1** `https://www.tamron.com/global/consumer/lenses/a058/spec.html` —
  Nikon-Z-specific weight/length for `tamron-35-150mm-f2-28` (1,190g /
  160.1mm). Independently re-fetched by the orchestrator, confirmed exact
  match.
- **T1** `https://www.tamron.com/global/consumer/lenses/b070/spec.html` —
  Nikon-Z-specific weight/length for `tamron-17-70mm-f28` (540g / 121.3mm).
- **T1** `https://www.tamron.com/global/consumer/lenses/a067/spec.html` —
  Nikon-Z-specific weight/length for `tamron-50-400mm-f45-63` (1,180g /
  185.8mm).
- **T1** `https://www.tamron.com/global/consumer/lenses/a047/spec.html` —
  Nikon-Z-specific weight/length + magnification for
  `tamron-70-300mm-f45-63` (580g / 150.3mm / 0.20× max).
- **NEWS** `https://www.dpreview.com/news/8584835899/...` — `tamron-35-150mm-f2-28`
  Nikon-Z launch price $1,999 (2023-09-21). Blocked for WebFetch (bot-block);
  corroborated instead via WebSearch, which independently surfaced the same
  $1,999 figure plus confirmation that B&H's current list price is still
  $1,999 (Best Buy's $1,599 is a discount, not a new RRP — not used).
- **Rejected**: an untracked `scripts/price-overrides/nikon.json` found in
  the dead agent's worktree, listing CAD figures for
  `tamron-12-20mm-f28`/`tamron-35-100mm-f28`/`tamron-70-180mm-f28-g2`/
  `tamron-90mm-f28-macro` — none of these slugs exist in `nikon/data.js`.
  No source trail, no corresponding entry. Discarded as premature/stray
  content, not used.
- **T1** `sigma-global.com`'s Nikon Z mount filter — re-confirmed only the
  existing 3 DC DN primes (16/30/56mm) list Z; 18-50/10-18/23mm DC DN and all
  DG DN (full-frame) checked individually, none list Nikon Z.
- **T4** PetaPixel (2025-11-02) — corroborating-only mention that Nikon
  still blocks Sigma full-frame AF lenses from Z-mount.

## Viltrox + Voigtländer batch (2026-08-30)

- **T1** `https://viltrox.com/collections/z-mount` (+ `?page=2`) — Viltrox's own
  Z-mount category page, 32 products listed (31 lenses + 1 teleconverter).
  Diffed against the 11 already-entered lenses: 21 genuinely new. Every new
  lens's mount-specific specs (weight/size/price) verified individually on its
  own `viltrox.com/products/<slug>` page before entry, per the golden rule.
- **T1** each of 21 `viltrox.com/products/<slug>` pages — read via a live
  Chrome tab (`read_page`/`find`), not `WebFetch`, because Viltrox's spec
  table renders inside a JS-driven dialog that `WebFetch`'s markdown
  conversion mostly can't see (confirmed independently on `af-135mm-f1-8-lab-z`
  and `af-26mm-f2-8-z`: `WebFetch` returned partial specs, a live DOM read
  returned the complete table). New trap found for this batch: `af-26mm-f2-8-z`'s
  weight (170g) initially looked like a scrape error against several reviews
  citing 130g — turned out to be a genuine per-mount difference, confirmed by
  independently loading the E-mount sibling page (`af-26mm-f2-8-fe`, 130g).
  **Always check the sibling mount's own page before calling a weight
  discrepancy a bug.**
- **T1** `viltrox.com/products/<slug>.json` (Shopify product JSON endpoint) —
  used for `created_at`/`published_at` (proxy for `year` where the storefront
  gives no separate release-date text) and the first product image `src`.
  Reliable and fast; no bot-block encountered.
- **T2** DPReview / PetaPixel / Digital Camera World / Fstoppers coverage of
  the Viltrox AF 26mm F2.8 EVO (all corroborating the E-mount sample's 130g,
  not used for the Z-mount entry's weight — see above).
- **T1** `https://www.voigtlaender.de/z-mount/` (English) — Voigtländer's own
  Z-mount lens grid, 16 native designs listed. One (`Nokton 75mm f/1.5
  aspherical`) rejected: its own tile links to the E-mount product page, not
  a Z-mount one — confirmed via `document.querySelectorAll('a')` href
  inspection in a live Chrome tab, not by page text alone. This is the same
  "mount doesn't actually exist yet" trap the skill warns about, this time on
  the maker's own overview page rather than a third-party aggregator.
- **T1** each of 12 `voigtlaender.de/z-mount/<slug>/?lang=en` pages (11
  entered + 1 deferred) — `WebFetch` returned `unable to verify the first
  certificate` for every `voigtlaender.de` URL this session (both the
  overview page and individual product pages); worked around by reading the
  live-rendered page in Chrome instead (`read_page filter:all`, targeting the
  `<article>` subtree via `ref_id` when the full page exceeded the char
  limit). Voigtländer's spec table is a genuine hidden accordion (unlike
  Viltrox's dialog) — some pages carry an explicit "All information as of
  <month year>" disclaimer under the table, others don't; where absent, the
  product photo's own upload-path date (`/wp-content/uploads/<year>/<month>/…`)
  was used as the `year` source instead, noted per-entry.
- **Rejected**: B&H Photo and Amazon.com are both permission-blocked for this
  session's browser extension (`get_page_text`/`find` return "Permission
  denied for reading pages on this domain"); `WebFetch` on both returns HTTP
  403. Adorama's site search loaded but returned no matching SKU for the new
  Voigtländer Z-mount lenses (likely too new for US retail listings). The
  session's `WebSearch` budget was also exhausted (200/200) partway through
  this batch, before a retail-price check could be attempted. Net effect: the
  11 new Voigtländer entries carry an ESTIMATED `USD` price (EUR × 1.169, the
  ratio backed out from this file's own previously-verified
  `voigtlander-nokton-40mm-f12` entry: EUR 769 → USD 899) rather than a
  retailer-confirmed one. Flagged in `PROGRESS.md`'s open questions for a
  follow-up pass once retail access is available. The 21 new Viltrox prices
  ARE tier-1-sourced directly (viltrox.com shows USD list price natively, no
  conversion needed).
