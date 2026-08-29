# Canon RF third-party lens sources (round 2)

Per-source ledger — every URL read during this round, what it was used for,
and its reliability class. T1 maker's own site (incl. regional) · T2
independent measurement/review · T3 retailer (price/availability only) · T4
aggregator (tables only, never mount attribution) · NEWS dated announcement
(`year` only).

Record sources for rejected facts too, with the reason — that's what stops a
later pass "correcting" a right value to a wrong one.

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
