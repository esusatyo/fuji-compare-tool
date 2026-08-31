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

## Yongnuo + Meike batch (2026-08-31)

- **T1** `https://yongnuo.eu/lenses/nikon-z-f/` — the maker's own "NIKON Z/F"
  category page; lists 13 products, 10 of them genuine Z-mount (the rest are
  F-mount "N"-suffix DSLR lenses on the same page). Used to confirm mount
  existence for every Yongnuo candidate this round — the golden rule ("always
  confirm mount availability against the maker") applied before trusting any
  spec-tracker page.
- **T1** `https://yongnuo.eu/yn-11mm-f-1-8-lens-for-nikon-aps-c/` and
  `https://yongnuo.eu/yn-23mm-f-1-4-aps-c/` — two Yongnuo Z-mount products
  live at URLs *outside* the `/lenses/nikon-z-f/` path structure but still
  explicitly titled "for Nikon"/"Z Mount"; caught by checking yongnuo.eu's
  own category-page links directly rather than assuming a single URL prefix
  covers the whole catalogue.
- **T1** `https://th.hkyongnuo.com/products/yn85mm-f18z-df-dsm` — Yongnuo's
  Thai regional storefront (same maker, official regional site per the
  skill). Static curl of the raw HTML surfaces a full spec table embedded in
  the page's own descriptive copy (`Weight 405g`, `Max Diameter and Length
  Φ67×88mm`, `Filter Diameter 58mm`, `Lens Construction 8 groups 9 elements`,
  `Aperture Blades 7 blades`) plus a JSON-LD `offers.price: "360"` —
  `yongnuo.eu`'s own page for the same SKU (checked first) is a marketing-copy
  page with no dimensional spec table at all, a pattern that recurred for
  most Yongnuo/Meike product pages this round: **the maker's marketing pages
  and its (or a regional distributor's) full-catalogue/spec pages are not
  the same document**, and only the latter carries dimensions.
- **T1 (weak — marketing copy only, no dimensions)**
  `https://yongnuo.eu/lenses/nikon-z-f/yn50mm-f1-8z-da-dsm/`,
  `.../yongnuo-35mm-f-1-8-aps-c-lens-for-nikon-z-mount-camera-.../` — confirm
  mount + APS-C format + partial specs (148g / 182g weight, "equivalent focal
  length" crop statements) but no length/diameter/filter/MFD/elements —
  supplemented by zsystemuser.com (T2) below.
- **T2** `https://www.zsystemuser.com/z-mount-lenses/third-party-lenses/third-party-autofocus-lense/yongnuo-lenses/` —
  Thom Hogan's Nikon-Z-specific third-party AF lens tracker. Its sitemap
  (`https://www.zsystemuser.com/about-z-system-user/sitemap.html`) lists
  every current Yongnuo and Meike Z-mount lens page by exact URL — used as
  the enumeration backbone for this batch, then individually fetched per
  lens for full spec tables. Cross-verified against this dataset's existing
  `yongnuo-50mm-f18` entry (417g/87mm/68mm) before trusting it for new
  entries — exact match. See the "Note on zsystemuser.com" at the end of
  `research/lenses.md` for why this counts as a single T2 lineage, not
  several independent ones, despite covering many lenses.
- **T2** individual zsystemuser.com spec pages fetched (one per lens, exact
  URLs recorded in `research/lenses.md`'s table): `yongnuo-85mm-f18z-df-dsm`,
  `yongnuo-11mm-f18-da-dsm-wl`, `yongnuo-23mm-f14-da-dsm-wl`,
  `yongnuo-33mm-f14-da-dsm-wl`, `yongnuo-35mm-f18-da-dsm-wl`,
  `yongnuo-50mm-f18-da-dsm`, `yongnuo-56mm-f14-da-dsm-wl`,
  `meike-24mm-f14-lens-specifi`, `meike-50mm-f18`, `meike-55mm-f18-pro-lens`
  (dims missing — deferred), `meike-85mm-f18-pro-lens`.
- **Rejected**: Yongnuo YN16mm F1.8 DF DSM — zsystemuser.com lists it (DX
  coverage despite the "DF" = full-frame naming convention holding everywhere
  else in the lineup — an internal contradiction), but it does **not** appear
  on yongnuo.eu's own Nikon Z/F category page (fetched fresh this round).
  Deferred, not entered, pending direct re-verification against the maker.
- **T1** `https://meikeglobal.com/` — homepage's "AF Lens Lineups" block
  names all five current AF series (PRO/MIX/NEO/SE/AIR) by their exact
  member lenses; used to scope the maker's current catalogue before
  searching individual products. Also surfaced "MEIKE 25mm f1.7 Air ... for
  Nikon" as a "New Release" — too new for a second source this round,
  deferred (see research/lenses.md rejects table).
- **T1** `https://meikeglobal.com/products/3518proz` — Meike 35mm F1.8 Pro's
  own product page. Confirmed this is an **image-only marketing description**
  (a long series of lifestyle photos and an MTF-chart graphic, verified by
  scrolling the full page to its footer) with **no text or image spec table**
  at all — not a case of missing a collapsed tab, genuinely absent. This
  pattern recurred across every Meike AF product page checked this round;
  Meike's site is good for mount/price/current-catalogue confirmation but not
  for dimensional specs.
- **T3** `https://www.amazon.com/dp/B0FFSZTV4N` (Meike 35mm F1.8 Pro, Nikon Z
  SKU) — "Item details" panel: 404g weight, confirmed Nikon Z mount + f/1.8
  max aperture, ASIN B0FFSZTV4N. "About this item" bullets: "10 groups 12
  elements, including 3 ED lenses and 2 aspherical lens" (elements/groups).
  No length/diameter/filter/blades/MFD on this listing — supplemented by the
  Digital Camera World review below.
- **T2** `https://www.digitalcameraworld.com/cameras/lenses/meike-35mm-f-1-8-pro-af-review` —
  Matthew Richards, published 2026-02-02. Full independent spec table:
  400g/93×74mm/58mm filter/0.35m MFD/0.13x/12 elements/10 groups/9 blades,
  states weather-sealed, mount options "Nikon Z (FX), Sony E (FE)" with "no
  noted variations" between them.
- **T2** `https://www.phillipreeve.net/blog/review-meike-24mm-f-1-4-mix/` —
  independent hands-on review corroborating zsystemuser's Meike 24mm F1.4 MIX
  elements/groups (15/12) exactly and supplying length×diameter (107×79mm,
  not on either T1 or the T2 spec tracker); not counted as a required second
  source (zsystemuser already serves that role) but recorded for confidence.
- **T3** B&H Photo lens-compare tool, `bhphotovideo.com/compare/BHitems` —
  used once, successfully, for Meike 50mm F1.8's length/diameter (Φ68.6×
  59.5mm, a single unambiguous row, no conflicting figure found elsewhere) —
  the only field missing from both T1 and T2 for that lens. **Trap found and
  not used**: the same tool's compare pages for Meike 55mm F1.8 Pro returned
  three different, mutually contradictory diameter/length pairs across three
  separate comparison URLs (67×76mm / 76.2×88.9mm / 67×73.5mm) — Google's
  search-result snippets interleave figures from *both* compared products
  without reliably labelling which column belongs to which lens, so a
  snippet-only reading is not trustworthy here; the page itself would need
  to be opened and its column headers read directly to disambiguate, which
  this round's budget didn't allow. Recorded as a caution for future passes
  using this same tool: verify column attribution before trusting a
  Google-snippet-only compare-page reading.
- **Session note**: this batch's WebSearch tool budget was already exhausted
  (200/200) from earlier work in this session before any Yongnuo/Meike
  research began. All web research this batch used `WebFetch` plus the
  Chrome extension's browser tools (navigation, `find`, `javascript_tool` for
  reading `<a href>` lists off Google result pages) as a substitute —
  slower and noisier (Amazon/B&H sometimes return 403/503 to `WebFetch`
  directly, requiring the logged-in browser instead) but functionally
  equivalent for this purpose. Future runs should raise
  `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` or start research before other
  batches burn the shared budget.

## TTArtisan + 7Artisans batch (2026-08-31)

- **T1** `https://ttartisan.store/collections/af-lens` — the maker's own "AF
  Lens" collection, 13 products; the Mount filter facet ("Nikon Z (11)")
  cross-checked against `/products.json` variant data to identify which of
  the 13 support Z.
- **T1** `https://ttartisan.store/products/ttartisan-af-23mm-f1-8` — full
  spec table (210g, APS-C, 11E/9G, 9 blades, 52mm filter, 0.3m MFD, 62°
  AoV) + Size diagram image (Z: 62×64mm). $127.
- **T1** `https://ttartisan.store/products/ttartisan-af-35mm-f1-8` (page
  title "AF 35mm F1.8 Ⅱ") — full spec table (176~193g, APS-C, 10E/7G, 9
  blades, 52mm filter, 0.4m MFD, 45° AoV) + Size diagram (Z: 51×66mm,
  cross-checked identical across Black/Silver color variants). $125.
- **T1** `https://ttartisan.store/products/56mm` (page title "AF 56mm
  F1.8") — full spec table (233~245g, APS-C, 10E/9G, 9 blades, 52mm filter,
  0.5m MFD, 28° AoV) + Size diagram (Z: 70×65mm). $158 reg / $129 sale.
- **T1** `https://ttartisan.store/products/ttartisan-af-75mm-f2` — full
  spec table (326-340g, Full-Frame, 10E/7G, 9 blades, 62mm filter, 0.75m
  MFD, 32° AoV) + Size diagram (Z: 76×67mm). $199.
- **T1** `https://ttartisan.store/products/af-40mm-f2` — full spec table
  (166~176g, Full Frame, 9E/6G, 7 blades, 52mm filter, 0.4m MFD, 57° AoV) +
  Size diagram (Z: 46×65mm). $168.
- **T1** `https://ttartisan.store/products/af-17mm-f1-8-air` — full spec
  table (161~178g, APS-C, 14E/10G, 6 blades, 52mm filter, 0.18m MFD, 81°
  AoV) + Size diagram (Z: 51×65mm). $148.
- **T1** `https://ttartisan.store/products/ttartisan-af-50mm-f1-8-neo` —
  full spec table (156~167g, Full-frame, 12E/8G, 7 blades, 52mm filter,
  0.48m MFD, 45° AoV) + Size diagram (Z: 54×66mm). $89.
- **T1** `https://ttartisan.store/products/ttartisan-af-85mm-f1-8-neo` —
  full spec table (332~338g, Full-frame, 12E/8G, 11 blades, 62mm filter,
  0.8m MFD, 29° AoV) + Size diagram (Z: 92×70mm). $99.
- **Method note**: the "Size" spec-table row on every ttartisan.store product
  page renders per-mount length/diameter as an image, not text — invisible
  to `WebFetch`'s markdown conversion. Read via the Chrome browser extension:
  `find` (locate the "Size" row) → `computer scroll_to` → `computer
  screenshot`, then read the callout numbers directly off the rendered
  image. Confirmed working for all 8 lenses above (same technique the Canon
  round found for this same store).
- **Session note**: `WebFetch` hit this session's monthly spend limit midway
  through 7Artisans research (after the TTArtisan section above was already
  complete). All research past that point used the Chrome browser extension
  (`navigate` + `get_page_text` + `javascript_tool`) instead, which draws
  from a separate budget.
