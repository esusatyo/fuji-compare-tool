# Canon RF third-party lens sources (round 2)

Per-source ledger — every URL read during this round, what it was used for,
and its reliability class. T1 maker's own site (incl. regional) · T2
independent measurement/review · T3 retailer (price/availability only) · T4
aggregator (tables only, never mount attribution) · NEWS dated announcement
(`year` only).

Record sources for rejected facts too, with the reason — that's what stops a
later pass "correcting" a right value to a wrong one.

## Yongnuo batch (2026-08-29)

- https://yongnuo.eu/lenses/eos-rf-ef/ — T1. Full catalogue listing for the
  "CANON EOS RF/EF/R" category, 13 products. Used to enumerate candidates
  beyond the 2 already entered.
- https://yongnuo.eu/lenses/eos-rf-ef/yn-23mm-f-1-4-aps-c-lens-for-r-mount/ — T1.
  Confirms RF-S mount, no dimension spec table. Rejected (see lenses.md).
- https://yongnuo.eu/lenses/eos-rf-ef/yn35mm-f1-8r-da-dsm/ — T1. Confirms RF
  mount (works FF+APS-C), no dimension spec table. Rejected.
- https://yongnuo.eu/lenses/eos-rf-ef/yn-50mm-f1-8-dsm-for-r-mount-cameras/ — T1.
  Confirms RF mount, no dimension spec table. Rejected.
- https://yongnuo.eu/lenses/eos-rf-ef/yn85mm-f1-8r-df-dsm-ii/ — T1. Full spec
  table but specs read as a near-copy of the original (non-"II") product's
  long-published specs. Flagged as ambiguous, not entered.
- https://yongnuo.eu/lenses/eos-rf-ef/85f1-8r-df-dsm/ — T1. The original
  (already-entered) product's live page — re-checked to compare against the
  "II" page. Confirms the known template-mixup bug (page prose describes
  Fujifilm X-mount, not Canon RF) already noted in the entered lens's
  imageSource — a documented reliability issue with this exact page.
- https://th.hkyongnuo.com/products/yn35mm-f18r-da-dsm — T1 (Yongnuo's HK/Thai
  storefront). No spec table; only price ($150) and mount confirmation.
- https://th.hkyongnuo.com/products/50f18r-df — T1. No spec table; only price
  ($150). Raw HTML's only numeric field is a cart `data-Weight:0.25` (kg) —
  a shipping-weight bracket, not a bare-lens spec. Rejected as a source for
  `weight`.
- https://th.hkyongnuo.com/products/23mmf14 — T1. No spec table beyond an
  unverifiable "approx. 360g" in marketing prose.
- WebSearch summaries citing "183g" (35mm), "360g" (23mm), "143g/55mm/67mm"
  (50mm) — **not used**: these are AI-summarized aggregations of search
  snippets, not a specific page I read and verified myself. Recorded here so
  a later pass knows they were seen and rejected, not missed.

## Meike re-check (2026-08-29)

- meikeglobal.com/collections (AF/cine listings) — T1, via WebSearch snippets
  (direct WebFetch 404s on guessed collection URLs — the site's collection
  slugs weren't guessable from outside). Confirms Canon-RF AF-adjacent
  products are cine (T-stop) kits only, out of scope.
- meikeglobal.com/products/10mm-f2-0rf — T1 (found via WebSearch, not
  directly fetched this round due to time budget). Title: "10mm F2.0 Aps-C
  Prime Manual Focus Wide Angle Lens for RF Mount" — confirms a genuine
  native-RF MF product exists. Needs a direct fetch + full spec read next
  pass before entering.
- Amazon listings for "Meike MK-50mm F1.7" and "Meike MK-50mm F1.2 RF" —
  T3, price/availability corroboration only that Meike sells RF-mount MF
  full-frame primes through US retail.

## Samyang re-check (2026-08-29)

- https://www.lksamyang.com/en/product/product-view.php?seq=410 — T1. Full
  spec table for MF 14mm F2.8 RF. This is Samyang's current global product
  site (samyangglobal.com and samyangus.com both redirect/link here for
  detailed specs).
- https://www.lksamyang.com/en/product/product-view.php?seq=657 — T1. Full
  spec table for AF 12mm F2 RF-S.
- https://samyangus.com/products/14mm-f2-8-full-frame-ultra-wide-angle-canon-rf
  — T1 (Samyang's own US storefront). Price, live-sale confirmation, product
  image.
- https://samyangus.com/products/samyang-af-12mm-f2-0-rf-s-ultra-wide-angle-lens
  — T1. Price, live-sale confirmation, product image.
- https://www.photographyblog.com/news/samyang_mf_14mm_f2_8_rf_and_mf_85mm_f1_4_rf_lenses_for_canon_rf
  — NEWS (via WebSearch snippet). Confirms 28 Feb 2019 as the announcement
  date for Samyang's first two Canon RF lenses (14mm F2.8 + 85mm F1.4, both
  MF). The 85mm wasn't researched further this round.
- www.jessops.com product listing for "Samyang MF 14mm f/2.8 Lens - Canon RF"
  — T3. Corroborates the 14mm is still a current, actively-stocked SKU (not
  a discontinued 2019 relic), independent of Samyang's own site.

## Zeiss re-check (2026-08-29)

- sonyalpharumors.com "Australian distributor confirms that Zeiss is exiting
  the Photo Business: No more Batis, Loxia, Milvus or Otus lenses!" — NEWS
  (distributor statement, via WebSearch). Company-wide discontinuation of
  every mirrorless/DSLR consumer stills line, not RF-specific.
- petapixel.com "Zeiss Is Still Making These Six DSLR Lenses Because They're
  So Popular" (June 2026) — NEWS. Confirms the sole remaining production is
  a handful of DSLR-mount (EF/F) classics — never RF, never mirrorless.
- zeiss.com/photonics-and-optics/en/photography/products.html — T1, fetched
  directly; only returns category-level copy ("Lenses for Mirrorless System
  Cameras" / "for SLR Cameras" / "for Rangefinder Cameras" / "for
  Videography"), no individual current SKU list — corroborates via the two
  sources above rather than superseding them.
