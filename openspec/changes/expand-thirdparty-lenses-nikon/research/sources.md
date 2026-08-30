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

## Sigma+Tamron batch, new-lens search (2026-08-30)

- **T1** `https://www.tamron.com/global/consumer/lenses/nikon_z/` — Tamron's
  own current Nikon Z Di III/Di III-A lineup page. Listed 12 lenses total;
  diffed against the 6 already entered, surfacing 6 candidates: 12-20mm
  f/2.8 (A084), 16-30mm f/2.8 G2 (A064), 28-75mm f/2.8 G2 (A063), 35-100mm
  f/2.8 (A078), 70-180mm f/2.8 VC G2 (A065), 90mm f/2.8 Macro (F072).
- **T1** `https://www.tamron.com/global/consumer/lenses/a084/spec.html`,
  `.../a064/spec.html`, `.../a063/spec.html`, `.../a078/spec.html`,
  `.../a065/spec.html`, `.../f072/spec.html` — Nikon-Z-specific weight/length
  (and Sony E figures alongside, for the mount-delta note) for each of the 6
  new entries. All confirm a genuine Nikon Z mount entry exists (not just
  Sony E) with its own dimensions.
- **T1** `https://www.tamron.com/global/consumer/news/detail/a063z_20240314.html`
  — Nikon Z launch announcement for 28-75mm G2: "$999 USD / $1,399 CAD",
  on sale 2024-04-18, "$100 more than the E-mount version."
- **T1** `https://tamron-americas.com/tamron-announces-new-12-20mm-f2-8-for-sony-e-and-nikon-z-mount/`
  — 12-20mm Nikon Z: "$1,799 USD / $2,399 CAD", ships 2026-08-27.
- **T1** `https://tamron-americas.com/announced-ultra-wide-angle-16-30-mm-g2-trinity-sony-nikon/`
  — 16-30mm G2: "Both mounts will retail for $929 USD." No CAD given; none
  found on any independent source either — left `null`, not guessed.
- **T1** `https://tamron-americas.com/launch-announcement-35-100-lens/` —
  35-100mm: "$929 for Nikon Z" (Sony E $899). Corroborated (T2, independent):
  dailycameranews.com and provideocoalition.com both separately report the
  $1,299 CAD figure — the independence test passes (different outlets, not
  quoting each other or a shared feed).
- **T1** `https://tamron-americas.com/70-180-g2-for-nikon-z-mount/` —
  70-180mm G2: "The lens will retail for $1,149 USD / $1,549 CAD", ships
  2025-10-23.
- **T1** `https://tamron-americas.com/tamron-announces-new-90mm-macro/` —
  90mm macro: "$699 USD / $949 CAD", available 2024-10-24, same price both
  mounts.
- **T1** product images (maker's own, no imageCredit per Step 5 option 2) —
  verified live (curl HTTP 200, `image/webp`) and visually confirmed by
  rendering each one (barrel text matches the lens name exactly, e.g. "16-30mm
  F/2.8 Di III VXD G2" engraved on the ring) before use:
  `tamron-americas.com/wp-content/uploads/2026/06/a084z-style.webp`,
  `.../2026/08/a0641200-x-1200-eisa-wht-1024x1024.webp`,
  `.../2026/04/a063-1200-x-1200-wht-1024x1024.webp`,
  `.../2026/08/a078-1200-x-1200-eisa-wht.webp`,
  `.../2026/04/a065-1200-x-1200-wht.webp`,
  `.../2026/04/f072-1200-x-1200-wht-1024x1024.webp`. Note: the Sony batch's
  `completeness.test.js` comment (2026-08-17) had found "no dedicated hero
  photo, only spec diagrams/icons" for the 12-20mm/16-30mm-G2 product pages
  at that time — the site has since gained real hero photos (12-20mm shipped
  2026-08-27, ten days after that note), so that finding is now stale for
  these Nikon entries specifically. Left the Sony `KNOWN_IMAGE_GAPS` entries
  alone since that's a different brand file, not re-checked here.
- **T1** `https://www.tamron.com/global/consumer/lenses/a036/spec.html`
  (28-75mm f/2.8 Di III RXD, **G1**, model A036) and
  `https://www.tamron.com/global/consumer/lenses/a056/spec.html` (70-180mm
  f/2.8 Di III VXD, **G1**, model A056) — both state "Mount: SONY E Mount
  (End of sale)", no Nikon Z ever offered. This is what the pre-existing
  "excludes 17-28/28-75/70-180, sold as Nikkor Z" comment in `nikon/data.js`
  was actually describing (the G1 originals lack a Z SKU) — but the
  "sold as Nikkor Z" rebadge claim itself is unconfirmed by anything found
  this pass and reads as a probable misreading of round-1's research notes.
  Comment corrected in `nikon/data.js` to state what's actually verified
  (no Z SKU for the G1s) rather than repeat the unconfirmed rebadge theory.
- **Rejected**: `tamron-20-40mm-f28` (Di III VXD) — WebSearch + DPReview
  forum threads ("Tamron 20-40mm F/2.8 to Z mount?", "...adapted to Nikon
  Z") confirm Sony-E-only; not on tamron.com's Nikon Z lineup page. Not
  entered.
- **Rejected**: `tamron-50-300mm-f45-63` (Di III VC VXD) — DustinAbbott.net
  review and B&H listing both Sony-E-only; not on tamron.com's Nikon Z
  lineup page (only the already-entered 50-400mm appears there). Not
  entered. (Distinguish carefully from the already-shipped Nikon Z
  `tamron-50-400mm-f45-63` — different lens, easy to conflate by focal
  length alone.)
- **T3** B&H per-mount SKUs (price/availability corroboration only, per
  sourcing tiers — never the sole source for mount existence, always paired
  with the tamron.com T1 spec page above): 1986709-REG (A084Z700, 12-20mm),
  1904846-REG (AFA064Z700, 16-30mm G2), 1818564-REG (AFA063Z700, 28-75mm G2),
  1950504-REG (AFA078Z700, 35-100mm), 1925472-REG (AFA065Z700, 70-180mm G2),
  1854122-REG (AFF072Z700, 90mm macro). B&H itself 403s to both `curl` and
  `WebFetch` (bot-blocked, consistent with the skill's documented trap) —
  these SKUs came from WebSearch result snippets/titles, not a fetched page;
  used only as corroboration alongside the T1 tamron.com pages, never alone.
- **T3** Amazon ASINs (plain, non-bundle Nikon-Z-mount listings, title
  verified to mention "Nikon Z" explicitly): B0FJT7ZSJP (16-30mm G2),
  B0D1W1SRGT (28-75mm G2), B0GS3K7GBB (35-100mm), B0FVKQ6FFV (70-180mm G2),
  B0DLHPZDGB (90mm macro). No ASIN found for 12-20mm — too new (shipped
  2026-08-27, 3 days before this entry); left `asin:null` (safe, falls back
  to Amazon search).
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
## Laowa + Samyang batch (2026-08-30)

### Samyang investigation (do this first — see PROGRESS.md for full narrative)

- **Git history**: `git log --all -p -- nikon/data.js | grep -n samyang` found
  the removal commit `9266255` ("Fix dead product links across
  Nikon/Panasonic/third-party lenses; remove 2 bad entries", 2026-07-13):
  round 1 had entered exactly one Samyang lens, `samyang-135mm-f18` (AF
  135mm F1.8), sourced from
  `https://samyangus.com/products/135mm-f1-8-af-full-frame-telephoto-nikon-z`.
  That commit removed it with the stated reason "Samyang's Nikon Z lineup
  doesn't include this lens (their AF 135mm F1.8 is Sony E-only)" — a
  deliberate mount-fabrication fix, the same class of error as the
  `tamron-11-20mm-f28` removal in PR #25, not an unrelated link-rot cleanup.
- **T1** `https://samyangus.com/collections/nikon-z` — Samyang's official US
  storefront's own Nikon-Z-mount collection filter. Independently re-verified
  from scratch (not trusting the removed entry or any old claim): the
  collection returns exactly **2 products**, both tagged "Manual Focus" in
  the left-rail facets — `14mm F2.8 Full Frame Ultra Wide Angle (Nikon Z)`
  and `85mm F1.4 Full Frame Telephoto (Nikon Z)`. No AF lens appears.
- **T2** `https://nikonrumors.com/2026/03/05/samyang-is-waiting-on-licensing-from-nikon-to-start-making-z-mount-lenses.aspx`
  and `https://www.digitalcameraworld.com` (2026-04-08 piece, "Will Samyang
  ever make AF Nikon Z lenses? Not until it becomes officially licensed") —
  both confirm, independently of the maker, that Nikon has **not** licensed
  Samyang for AF Z-mount lenses as of early-to-mid 2026. This resolves the
  apparent contradiction: the 135mm f/1.8 AF removal was correct (Samyang
  cannot ship AF Z lenses without Nikon's license), but Samyang's classic
  **manual-focus, no-electronic-contact** lenses don't need that license and
  have shipped in Z-mount since 2019 — they were simply never entered.
- **T1** `https://samyangus.com/products/14mm-f2-8-full-frame-ultra-wide-angle-nikon-z`
  (SKU SYZ14-N) — full Specifications accordion; page prose: "the first 14mm
  prime lens with precision manual focus control to be available in Nikon Z
  mount... As Samyang's first lens for Nikon Z mount". Customer reviews
  dated back to 2019-12-30, confirming a real, long-standing listing (not
  freshly staged for this check).
- **T1** `https://samyangus.com/products/85mm-f1-4-full-frame-telephoto-nikon-z`
  (SKU SYZ85-N) — full Specifications accordion; reviews dated back to
  2020-09-13.

### Laowa Nikon Z re-enumeration

- **T1** `https://www.venuslens.net/shop/?product_cat=camera-lenses&product_view=list&product_count=200` —
  full 72-product camera-lens shop listing, read end-to-end. Cross-referenced
  every product's mount-availability prose/dropdown against "Nikon Z". Found
  21 lenses genuinely shipping in Nikon Z beyond the 3 already entered
  (`laowa-10mm-f4-cookie`, `laowa-15mm-f2`, `laowa-90mm-f28-macro`) — see
  research/lenses.md for the full per-lens ledger with individual T1/T2
  citations. Excluded as out-of-scope: probe lenses (24mm T14 2X
  Probe/PeriProbe — waterproof macro-photography tools, not conventional
  stills lenses) and cine-only T-stop variants (12mm T2.9 Zero-D Cine, 15mm
  T2.1 Zero-D Cine, 7.5mm T2.9 MFT Cine) per the skill's cine/specialty
  exclusion.
- **Trap encountered and resolved**: `laowa-65mm-f-2-8-2x-ultra-macro-apo`'s
  own Specifications-tab "Mounts" row is stale (lists only Fuji X/Sony
  E/Canon EF-M), but the *live* Mount purchase dropdown on the same page and
  the page's own description prose ("The lens features Fujifilm X, Sony E,
  Nikon Z and Canon M，RF mount") both list Nikon Z — trusted the
  dropdown/prose (what a buyer can actually select and check out with) over
  the evidently-outdated static spec-table row, consistent with the skill's
  "always confirm mount against the maker" guidance applied at the
  most-current layer of the maker's own page.
- **T1 (regional)** `laowalenses.ca` (Laowa's official Canada storefront) used
  extensively as a fallback/corroboration source — several lenses' full
  numeric spec tables (elements/groups, min aperture, per-mount weight
  breakdowns) render cleanly there via WebFetch where venuslens.net's own
  React-driven "Specifications" tab required browser interaction (Cloudflare
  bot-check + client-side tab switching) to reveal.
- **T2** jonasraskphotography.com — used for 2 Argus-series lenses (33mm
  f/0.95, and general corroboration): a genuine hands-on reviewer who
  publishes full maker-style tech-spec blocks in every review, useful when
  venuslens.net's own Specifications tab is empty for a given SKU.
- **Conflict resolved, `laowa-argus-33mm-f-0-95-cf-apo` minimum aperture**:
  3 independent T2 hands-on reviews (jonasraskphotography.com,
  photorumors.com, digitalcameraworld.com) state f/16; one outlier
  (sonyalpha.blog, an AI-summarized aggregator page) claims f/11 with a
  "surprisingly" framing that reads as a misreading of the DOF-scale marking
  rather than a genuine physical-limit finding. Majority-independent T2 (f/16)
  used; both recorded in research/lenses.md.
