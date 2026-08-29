# Canon RF third-party lens sources (round 2)

Per-source ledger — every URL read during this round, what it was used for,
and its reliability class. T1 maker's own site (incl. regional) · T2
independent measurement/review · T3 retailer (price/availability only) · T4
aggregator (tables only, never mount attribution) · NEWS dated announcement
(`year` only).

Record sources for rejected facts too, with the reason — that's what stops a
later pass "correcting" a right value to a wrong one.

## Batch: Sigma + Tamron re-check (2026-08-29)

| URL | Tier | Used for | Notes |
|---|---|---|---|
| https://www.sigma-global.com/en/special/sigma_rfmount_lenses/ | T1 | Enumerate Sigma's full current Canon RF lineup | Sigma's own dedicated RF-mount landing page. Lists exactly the 10 lenses already in `canon/data.js`: 12mm/15mm/16mm/23mm/30mm/56mm f/1.4 DC(DN), 10-18mm f/2.8, 18-50mm f/2.8, 17-40mm f/1.8, 16-300mm f/3.5-6.7. No new SKU. |
| https://www.tamron.com/global/consumer/lenses/canon_rf/ | T1 | Enumerate Tamron's full current Canon RF lineup | Lists exactly the 3 already entered: B060 (11-20mm f/2.8), B070 (17-70mm f/2.8), B061 (18-300mm f/3.5-6.3). No new SKU. |
| https://tamron-americas.com/canon/ | T1 | Cross-check + re-confirm `tamron-17-70mm-f28` RF-specific dims | Tamron's US regional site, same 3-lens list; restates B070's RF-specific 117.3 mm / 530 g, matching the stored entry exactly. |
| https://rfshooters.com/threads/in-depth-review-of-tamron%E2%80%99s-17-70-f2-8-for-rf-since-it%E2%80%99s-release.6322/ | — (forum, not a spec source) | Confirm whether a tier-2 review of the RF B070 exists yet | Canon-RF-focused forum thread explicitly asking for an in-depth review; replies note only YouTube coverage exists, no written measured review. Used as evidence of *absence* of a tier-2 source, not as a spec source itself. |
| https://www.the-digital-picture.com/Reviews/Tamron-17-70mm-F2-8-Di-III-A-VC-RXD-Lens.aspx | rejected as tier-2 for RF | Checked as a candidate tier-2 review | 403s to direct fetch; archive.org's closest snapshot is dated 2026-03-22, which pre-dates the RF ship date (2026-07-02) — so even if reachable, this page covers the original E/X-mount lens, not the RF copy. Not usable as RF-specific corroboration. |
| https://dustinabbott.net/2021/01/tamron-17-70mm-f2-8-di-iii-a-vc-rxd-b070-review/ + https://dustinabbott.net/2023/07/tamron-17-70mm-f2-8-vc-rxd-x-mount-review/ | rejected as tier-2 for RF | Checked as a candidate tier-2 review | Both are reviews of the 2021 Sony E-mount and 2023 Fujifilm X-mount copies respectively — no RF-mount review found on the site as of 2026-08-29. |
| https://www.photographytalk.com/tamron-17-70mm-f-2-8-review-the-aps-c-zoom-lands-on-canon-rf-and-nikon-z/ | T4 | Corroborate `tamron-17-70mm-f28`'s RF dims | Independently states the same per-mount breakdown as Tamron's own site (RF 530 g/117.3 mm) but the piece is a spec-comparison writeup, not a hands-on test — no first-person measurement claims, reads consistent with the "LLM-generated aggregator prose" pattern flagged in round 1's ledger. Logged as corroboration only; not counted as the tier-2 lineage. |
| https://www.dpreview.com/news/6760897095/tamron-17-70mm-f2p8-rf-z-mount-canon-nikon | blocked | Attempted as a possible tier-2/news source | DPReview 403s WebFetch (known blocker, per skill notes) and Bash `curl` was not attempted given the other sources already answered the question. |

## Viltrox re-check (2026-08-29)

- https://viltrox.com/collections/camera-lenses — **T1.** Browsed directly.
  16 products shown, mount filter options list `E-mount, FE-mount, X-mount,
  Z-mount, L-mount, M-mount, DL-mount, PL-mount` — **no Canon RF/RF-S filter
  exists at all.** Confirms Canon is fully absent from Viltrox's own current
  storefront, not merely under-stocked.
- https://viltrox.com/search?q=85mm+RF — **T1.** On-site search for the
  existing lens's own model terms returns 9 results, all Sony/Nikon/Fuji/
  L-mount/PL-mount; zero Canon RF matches.
- https://viltrox.com/products/viltrox-85mm-f18-rf-mount-canon-markii —
  **T1, guessed URL, 404.** No live product page under this or any
  RF-pattern slug I could construct.
- https://www.newsshooter.com/2021/11/05/viltrox-85mm-f-1-8-af-lens-for-canon-rf/
  — **NEWS**, dated 2021-11-05. Original RF announcement: 530g, 10 el/7 gr,
  9 blades, 72mm filter, 80cm MFD, STM, $399. This is the *first-generation*
  RF release, pre-dating the "RF II" revision now in the dataset — recorded
  so a future pass doesn't mistake 530g for the current figure.
- https://petapixel.com/2021/11/10/viltrox-unveils-85mm-f-1-8-autofocus-lens-for-canon-rf-mount/
  — **NEWS**, 2021-11-10. Same original-RF figures (530g, 72mm filter,
  80cm MFD, 10/7, 9 blades, $369-400 range). Corroborates newsshooter, same
  generation.
- https://www.gearfocus.com/products/viltrox-af-85mm-f18-rf-ii-lens-for-canon-rf-14290
  — **T3** (retailer). Direct WebFetch blocked by a bot-check wall; content
  recovered via search-engine snippet instead, which quoted "484g... the
  lightest of the 85mm autofocusing options available for Canon RF" and
  "80 x 95mm" dimensions for the **"RF II"**-labeled listing — matches the
  dataset's weight (484g) exactly; its 95mm quoted length is close to but not
  identical to the dataset's 92mm (both plausibly round differently from the
  same maker figure; not treated as a conflict worth overriding on a T3
  source alone).
- B&H compare-tool listing (`bhphotovideo.com/c/compare/...BHitems/1671223-REG_...`)
  — **T3** (retailer), title-only ("Viltrox AF 85mm f/1.8 RF II Lens for
  Canon RF"); direct product-page WebFetch blocked (403, consistent with the
  skill's documented DPReview/retailer-blocking note extending to B&H here).
  Confirms current commercial naming is "RF II," not the plain original.
- https://www.dpreview.com/news/3875526045/viltrox-representative-reports-canon-told-them-to-stop-selling-all-rf-mount-products
  — **NEWS**, dated 2022-08-29 (confirmed via search — this is the *same*
  2022 C&D event round 1 already found, not a new/second dispute; the
  headline reads as if new but the story is four years old).
- https://fstoppers.com/gear/canon-breaks-silence-viltrox-lenses-615442 —
  **NEWS**, 2022-09-05. Canon Germany's official statement confirming the
  RF cease-and-desist (IP/patent infringement, not a licensing negotiation).
- https://thenewcamera.com/viltrox-rf-s-lenses-incoming-for-canon-in-2026/ —
  **NEWS**, published 2025-12-12, updated 2025-12-21. Claims Viltrox got
  "full authorization from Canon" for RF-S lenses coming "first half of
  2026." Unconfirmed by any shipped product as of this check (2026-08-29) —
  treated as an unverified claim, not a scope fact, until something actually
  ships on viltrox.com or a maker RF product page appears.
- https://photorumors.com/2026/08/20/viltrox-roadmap-four-new-lenses-for-l-mount-and-more/
  — **NEWS**, 2026-08-20 (9 days before this check). Roadmap covers L-mount
  only (50mm f/2, 40mm f/2.5, 20mm f/2.8, 14mm f/4) plus a Rohde
  collaboration teaser — no Canon RF/RF-S mention. Strong signal that
  nothing Canon-mount is imminent from Viltrox's own current announcements.
- https://www.digitalcameraworld.com/cameras/lenses/viltrox-confirms-new-lenses-are-coming-this-month-but-as-a-photographer-ive-spotted-several-key-hints-in-the-teaser
  — **NEWS**, 2026-04-10. NAB Show teaser, L-mount only, no RF mention.
- https://www.cameralabs.com/viltrox-af-85mm-f1-8-ii-review/ — **T2**
  (independent review), but explicitly **not** RF — covers the "Mark II"
  generation for Sony E/Nikon Z/Fuji X only (548g there, different mount).
  Read to confirm the "II" generation is a real lighter redesign across
  mounts, not RF-specific evidence; not used for any RF figure.
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
## 7Artisans (2026-08-29)

- **T1** `https://7artisans.store/products.json?limit=250` — full current
  catalogue (121 products, single page, no pagination needed). Used to
  re-derive the RF-capable SKU list from the products' own `variants[].option*`
  values (the mount list), not from any aggregator. Filtered to
  `Canon RF`/`Canon RF-S`/`Canon EOS-R`/`Canon EOS-RF`/`Canon R`/`EOS-R mount`
  tokens; `Canon EOS-M` (EF-M, not RF) explicitly excluded — this is the same
  aggregator-mount-attribution trap the skill warns about, just self-inflicted
  if not careful, since 7Artisans' own storefront lists EOS-M as a distinct
  "mount" option alongside EOS-R.
- **T1** `https://7artisans.store/products/9mm-f-5-6-full-frame-wide-angle-lens-for-e-l-r-z`
  (already-entered `7artisans-9mm-f56`) — re-read via Chrome browser
  automation to validate the dimension-diagram technique still works. The
  page's `Φ70mm × 86mm` diagram matches the entered `diameter:70, length:86`
  exactly, confirming this is a live, working source pattern for at least
  some SKUs.
- **T1** `https://7artisans.store/products/35mm-0-95` (35mm f/0.95 APS-C) —
  read in full via browser (scrolled to footer). Has a complete plain-text
  spec grid (weight 369g "about"; 11 elements/8 groups; 12 blades; Φ52mm
  filter; MFD 0.37m; f/0.95-16; 43.9° field of view; stepless/declicked
  aperture ring; metal body) but **no dimension diagram anywhere on the
  page** — confirmed by scrolling the entire product page to its footer.
  USD list price $249 (struck through; $149.25 shown as a "Sale" price at
  read time — **$249 is the RRP to use, not the sale figure**, per the
  skill's "sale price is not RRP" rule).
- **T1** `https://7artisans.store/products/50mm-f1-05` (50mm f/1.05
  full-frame) — read in full via browser. Uses 7Artisans' older/simpler page
  template: hero images, a mount-compatibility chart (rangefinder/Sony/etc.),
  then straight to "You may also like" and the footer. **No numeric spec grid
  and no dimension diagram at all.** Rejected for this pass — insufficient
  sourceable fields.
- **T1** `https://7artisans.store/products/7artisans-55mm-f1-4-mark-ii-aps-c-portrait-lens-for-sony-e-nikon-z-fuji-fx-canon-eos-m-olympus-m43-mirrorless-cameras`
  (55mm f/1.4 Mark II APS-C) — read in full via browser. Same older template
  as the 50mm f/1.05 page: no numeric spec grid, no dimension diagram.
  Rejected for this pass.
- **T1** `https://7artisans.store/products/60mm-f-2-8-full-frame-2x-ultra-macro-lens-for-e-rf-z`
  (60mm f/2.8 full-frame 2X ultra-macro) — read in full via browser. Marketing
  copy states "550g Lightweight Journey" (weight ≈550g) and shows the lens
  mounted on a Canon EOS R body explicitly. No numeric spec grid, no
  dimension diagram present anywhere on the page (confirmed to footer).
  Weight alone is not enough — `length`/`diameter` are non-nullable — so this
  stays deferred despite having one real figure.
- **T1** `https://7artisans.store/products/14mm-f-2-8-full-frame-wide-angle-lens-for-sony-e-canon-eos-r-nikon-z-panasonic-l`
  (14mm f/2.8 full-frame, apparently a very recent release — full RRP $299,
  sale price $209.30 at read time) — read in full via browser. Has the
  richest template of anything checked this pass: full numeric spec grid
  (Aperture Range F2.8-F22; Filter Size Φ77mm; Optical Construction 13
  elements/9 groups; Angle of View 116°; Diaphragm Blades 10; **Weight ≈504g
  marked "(E)"** i.e. Sony E-mount specific, not confirmed for RF; Lens Type
  Prime; Focusing Manual; Lens material Metal) plus a "Lens structure"
  cutaway diagram (no dimensions in it) and a "Product Parameters" heading
  immediately followed by what is structurally a rounded-corner
  canvas/video element that **never rendered any content** — tried: scrolling
  to it from both directions, a fresh page reload + single-direction scroll,
  a 6-second wait at rest, and a `zoom` capture of the exact pixel region
  (returned uniform near-black, no text/lines at any zoom level). This reads
  as a broken or region-blocked video asset on 7Artisans' storefront, not a
  scroll-triggered lazy-load timing issue. **Rejected for this pass**: even
  if the diagram had rendered, the weight figure is explicitly Sony-E-only
  and would need a Canon RF-specific confirmation before entry anyway (per
  the skill's "beware the combined spec table" caution, generalized to a
  combined *mount-tagged* weight on an otherwise mount-agnostic manual lens).

**Traps not previously documented, now confirmed:**
- 7artisans.store's own storefront still lists `Canon EOS-M` (EF-M mount,
  discontinued, not RF) as a selectable "mount" alongside `Canon EOS-R` on
  many product pages — a `products.json` filter for anything containing
  "Canon" without excluding EOS-M would wrongly inflate the RF-capable count
  by roughly a third of the catalogue.
- The richer template (numeric spec grid + dimension diagram) is **not**
  applied uniformly across 7Artisans' catalogue — it appears to correlate
  with newer product-page redesigns (the 3 already-entered full-frame primes,
  and the newly-released 14mm f/2.8) rather than being universal. Several
  older/simpler full-frame and APS-C listings (50mm f/1.05, 55mm f/1.4 II)
  still use a template with no numeric specs at all beyond what's mentioned
  in marketing prose.
