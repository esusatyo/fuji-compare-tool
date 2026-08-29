# Canon RF third-party lens candidate ledger (round 2)

One row per candidate, filled during research before any data entry. Rejected
candidates stay in the table with a reason so a later pass doesn't
re-research them. See `openspec/changes/archive/2026-08-05-expand-thirdparty-lenses-canon/research/lenses.md`
for round 1's ledger (34 rows including TTArtisan/7Artisans dimension tables)
— don't duplicate its confirmed facts, only its still-open items.

## TTArtisan deferred batch (9 of round 1's original 14-lens list)

Round 1 entered 5 of 14 TTArtisan RF SKUs (`ttartisan-50mm-f14-asph`,
`ttartisan-tilt-50mm-f14`, `ttartisan-500mm-f63`, `ttartisan-50mm-f12`,
`ttartisan-50mm-f095`) and deferred the other 9, all blocked on
`diameter`/`length` — TTArtisan's own site (ttartisan.com) prints no
dimensions and quotes weight as a cross-mount range.

**The unlock applied this round**: `ttartisan.store` (Shopify storefront,
different domain from ttartisan.com) renders a per-mount "Size" comparison
graphic as a **raster image** next to the spec table — invisible to text
extraction, but each mount's diameter/length figures are baked into the pixels
and readable by downloading the image and viewing it (a canvas crop + a small
stdlib-only PNG decoder was needed for one oversized image whose fine print
didn't survive the standard viewer's downsampling — see `sources.md`).

`ttartisan.com` itself was **completely unreachable this round** (browser and
fetch both failed to connect, not merely blocked/slow) — a strictly worse
starting point than round 1, when curl+browser-UA could at least reach its
spec-table prose. Every fact below therefore comes from ttartisan.store
(product option selector = mount availability; spec-table prose = optics;
Size image = dimensions) corroborated by NEWS-tier release announcements and
retailer SKU listings for RF availability/price sanity-check.

| slug | name | maker | line | type | year | disc | src1 (tier 1) | src2 (tier) | notes / conflicts |
|---|---|---|---|---|---|---|---|---|---|
| ttartisan-35mm-f14-apsc | TTArtisan APS-C 35mm F1.4 | TTArtisan | APS-C | Prime | 2020 | no | https://ttartisan.store/products/aps-c-35mm-f1-4 (T1) | https://www.dpreview.com/news/2604832160/ttartisan-releases-an-80-35mm-f1-4-lens-for-aps-c-mirrorless-camera-systems (NEWS, original 2020 launch, non-RF) | RF confirmed via store's own Mount selector (product also ships in RF-S bodies R7/R10/R50/R100 per its Canon RF-mount application table) and B&H SKU C3514-B-RF. Weight given as a **single** figure "Around 180g" (not a cross-mount range, unlike its siblings) — no ambiguity to resolve. Size image gave RF-specific 63mm(L)×42mm(⌀), which also resolves round 1's unarbitrated 3-way dimension conflict (ø56×44 / 44×56 / 44×42) — those were other mounts (E/X/EOS-M/M43 = 56×44), not RF. `year` = original design's global launch (2020); the RF SKU's own add-date is unconfirmed (not in scope of the ≤1-month new-release rule, so not blocking — matches round-1's precedent of using the design's launch year for these budget MF primes). |
| ttartisan-23mm-f14-apsc | TTArtisan APS-C 23mm F1.4 | TTArtisan | APS-C | Prime | 2021 | no | https://ttartisan.store/products/aps-c-23mm-f1-4-black (T1) | https://www.dpreview.com/news/1450535557/ttartisan-announces-23mm-f-1-4-wide-angle-prime-for-aps-c-camera-systems.amp (NEWS, Nov 2021 announcement) | RF confirmed in store's Mount selector (Canon RF-mount application table lists R7/R10/R50/R100) and B&H SKU C2314-BS-RF. Weight published as a range ("around 222~250g") — no independent RF-specific measurement found, so top-of-range (250g) used per round-1's established convention (RF/L tend to be the heaviest mount for these designs; not independently re-confirmed for this specific lens). Size image gave RF-specific 63mm(L)×41mm(⌀). `year` = original design launch (announced Nov 2021, shipped ~Dec 2021/Jan 2022); RF add-date unconfirmed. |
| ttartisan-10mm-f2-asph-apsc | TTArtisan APS-C 10mm F2 ASPH | TTArtisan | APS-C | Prime | 2023 | no | https://ttartisan.store/products/102 (T1) | https://petapixel.com/2023/12/18/ttartisans-new-10mm-f-2-aps-c-lens-is-ultra-wide-and-costs-just-160/ (NEWS, Dec 2023) | RF confirmed in store Mount selector + spec-line ("Mount E/X/Z/M43/RF") + B&H SKU C1020-B-RF (title literally "TTArtisan 10mm f/2.0 Lens (Canon RF)"). Weight range "Around 333~345g" — top-of-range (345g) used, same convention/caveat as above. Filter is "72mm (external filter holder)" (bulbous front, no direct thread) — recorded as `filterThread: 72` since it's a real accessory size, not "no filter possible". Size image gave RF-specific 61mm(L)×63mm(⌀). `year` = 2023 (Dec 2023 announcement covered E/X/Z/M43/RF together per PetaPixel/B&H, so RF plausibly shipped at launch — not independently reconfirmed per-mount). |
| ttartisan-tilt-35mm-f14-apsc | TTArtisan Tilt APS-C 35mm F1.4 | TTArtisan | APS-C | Prime | 2025 | no | https://ttartisan.store/products/tilt-35mm-f1-4 (T1) | https://petapixel.com/2025/05/09/ttartisans-new-tilt-35mm-f-1-4-lens-offers-creative-depth-of-field-control/ (NEWS, May 9 2025) and https://www.canonrumors.com/ttartisan-launches-the-rf-35mm-f-1-4-tilt-lens-for-aps-c/ (NEWS, confirms RF at/near launch) | Distinct product from the non-tilt `ttartisan-35mm-f14-apsc` above (different optical formula: 7E/6G vs same count but different MFD/filter/blades — Tilt version has a manual ±8° tilt mechanism, 360° rotation, no autofocus obviously since both are MF). RF confirmed in store Mount selector; Canon Rumors' own headline is "RF 35mm f/1.4 Tilt Lens for APS-C". Weight range "Around 341~350g" — top-of-range (350g) used, same convention. Size image gave RF-specific 66mm(L)×61mm(⌀). `year` = 2025 (announced May 2025 across Sony E/Fuji X/Nikon Z/Canon RF/M43 together per the announcement coverage). |
| ttartisan-tilt-shift-17mm-f4-asph | TTArtisan Tilt-Shift 17mm F4 ASPH | TTArtisan | Full Frame | Prime | 2026 | no | https://ttartisan.store/products/tilt-shift-17mm-f4-asph (T1) | https://www.newsshooter.com/2025/10/10/ttartisan-17mm-f4-tilt-shift/ (NEWS, Oct 2025 launch for Sony E/Fuji GFX only) + https://nikonrumors.com/2026/03/08/ttartisan-announced-a-new-17mm-f-4-tilt-shift-lens-for-nikon-z-mount.aspx/ (NEWS, confirms Nikon Z/Canon RF/Leica L added March 2026) | **RF-specific year is precisely dated for once**: launched Oct 2025 for Sony E + Fuji GFX only; Nikon Z, Canon RF and L-mount followed in March 2026 per Nikon Rumors — so `year: 2026` for this RF entry specifically (not 2025, which was E/GFX-only). Real customer review on the store page explicitly confirms RF-mount use ("I am using this on several Canon RF mount cameras"). Filter: "not support" (bulbous front, no accessory holder mentioned unlike the 14mm/10mm above) → `filterThread: null`. Weight range "Around 1051~1060g" — midpoint (1055g) used since this range is narrow and no independent per-mount measurement exists to justify picking an extreme. Size images: two separate diagrams on the page — first compares Sony E vs Fuji GFX only (107mm/100mm height × 88mm width), second compares Z/L/RF (this is the one with the illegible-at-default-resolution text, resolved via the stdlib PNG-decode crop — see `sources.md`); RF-specific figures: 88mm(L) × 113mm(⌀). |
| ttartisan-14mm-f28-asph | TTArtisan 14mm F2.8 ASPH | TTArtisan | Full Frame | Prime | 2025 | no | https://ttartisan.store/products/14mm-f2-8 (T1) | https://photorumors.com/2025/08/22/new-ttartisan-14mm-f-2-8-asph-full-frame-ultra-wide-angle-lens-for-e-z-rf-l-announced-196/ (NEWS, Aug 22 2025, "for E/Z/RF/L announced" — all four mounts together) | RF confirmed at launch (all 4 mounts announced simultaneously, unlike the 17mm tilt-shift above). Filter "77mm (external filter holder)" → recorded as `filterThread: 77`. Weight range "Around 437~445g" — midpoint (441g) used (narrow range, no independent measurement). Size image gave RF-specific 65mm(L)×75mm(⌀). `year: 2025`. |
| ttartisan-100mm-f28-2x-macro | TTArtisan 100mm F2.8 2X Macro | TTArtisan | Full Frame | Prime | 2024 | no | https://ttartisan.store/products/100mm-f2-8macro (T1) | https://petapixel.com/2024/07/12/ttartisan-simplifies-100mm-f-2-8-2x-macro-lens-by-removing-tilt-and-shift/ (NEWS, July 2024, "available in a wide range of lens mounts, including E, EF, F, GF, L, RF, X, and Z") | **Resolves round 1's "TS-100-Macro naming hazard"**: round 1 found the ttartisan.com page slugged `full-frame-lenses/TS-100-Macro` titled itself "100mm F2.8 Macro 2X" (non-tilt name) while external reviews described a tilt-shift 100mm at $339, and flagged the two as possibly conflated. This round found ttartisan.store lists them as **two genuinely separate products**: this plain (non-tilt) "100mm F2.8 2X Macro" — filter 67mm, MFD 0.25m, weight 700-748g, price **$339.00** — and a distinct "Tilt-Shift 100mm F2.8 2X Macro" (`ts100` handle, not entered — wasn't on round 1's original 14-lens list, is a newer/different SKU). All four of this plain macro's figures (filter, MFD, weight range, and now the $339 price) match round 1's ttartisan.com-scraped table for `TS-100-Macro` **exactly**, confirming: round 1's `TS-100-Macro` URL slug refers to *this* plain macro (the slug is a historical/internal code, not a tilt-shift marker), not the separate tilt-shift product. PetaPixel's article itself explains the lineage: this plain 2:1 macro is a 2024 **simplified re-release of an earlier 2023 tilt-shift 100mm** ("TTArtisan Simplifies 100mm f/2.8 2x Macro Lens By Removing Tilt and Shift") — so the "tilt-shift" description round 1 found attached to Pergear's listing was for the lens's *predecessor*, not this SKU. Weight range "Around 700~748g" — midpoint (724g) used. Size image gave RF-specific 72mm(L)×148mm(⌀), the largest diameter of any TTArtisan RF entry in this dataset (this is a large medium-telephoto macro, consistent). `year: 2024`. |

### Deferred again, with an updated (narrower) reason

- **`ttartisan-17mm-f14-apsc` (APS-C 17mm F1.4)** — Round 1 believed this was
  "confirmed RF-available on TTArtisan's own pages". This round found the
  **opposite** on ttartisan.store, its current live storefront: both the
  Mount option selector (`Sony E / Fuji X / EOS-M / M43 / Nikon Z / L mount`
  — no RF) and the spec-table prose (`Mount E / X / Z / L / M43`) agree RF is
  **not currently sold**. A 2022-era Canon RF SKU did exist historically
  (B&H part `C1714-B-RF`, PhotoRumors 2022-09-07 "Surprise: TTartisan
  releases a new 17mm f/1.4 lens for Canon RF-mount") — so this isn't a
  fabrication on round 1's part, but the RF variant appears to have been
  discontinued/delisted from TTArtisan's own current catalogue since. Not
  entered: a maker's own storefront actively omitting a mount is stronger
  signal than a 4-year-old retailer listing that may just be unsold stock.
  Src: https://ttartisan.store/products/ttartisan-17mm-f1-4-apsc-lens (T1,
  current), https://www.bhphotovideo.com/c/product/1726418-REG/ttartisan_c1714_b_rf_17mm_f_1_4_aps_c_lens.html
  (T3, historical SKU), https://photorumors.com/2022/09/07/surprise-ttartisan-releases-a-new-17mm-f-1-4-lens-for-canon-rf-mount/
  (NEWS, 2022 launch).
- **`ttartisan-25mm-f2-apsc` (APS-C 25mm F2)** — **The narrower finding this
  round was supposed to produce.** RF *is* listed as an add-to-cart Mount
  option on the store (confirmed via the live page's Mount button group), but
  two other data sources on the very same page disagree: the spec-table prose
  says `Mount E / X / Z / L/ MFT` (no RF) and, more importantly, the page's
  own Size **image** — the exact per-mount dimension diagram this round's
  technique relies on — shows only three columns: `E, X-mount` / `Z-mount` /
  `M43-mount`. No RF column exists in the diagram at all, so there is no
  baked-in RF diameter/length to read even with the unlock applied. This
  reads as a mount TTArtisan added to the ordering system before publishing
  its dimensions (the reverse of the usual gap), not a sourcing failure on
  our part — still a skip, since `diameter`/`length` remain non-nullable and
  guessing from a same-focal-length sibling would be exactly the "never copy
  specs" mistake the skill warns against. Src:
  https://ttartisan.store/products/aps-c-25mm-f2 (T1, checked 2026-08-29 —
  Mount selector has RF, spec-table prose and Size image both omit it).
