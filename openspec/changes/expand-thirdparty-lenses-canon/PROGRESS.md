# Progress — Canon third-party lenses (round 2)

**Resume at:** All 5 maker batches done and merged (Sigma+Tamron, Viltrox,
Yongnuo/Meike/Samyang/Zeiss, 7Artisans, TTArtisan). Ready for final
verification (full test suite, `verify-images.js`, `test:links`,
`generate-seo.js`) and PR.

**Branch:** expand-thirdparty-lenses-canon   **Last green commit:** 635bdb8 (7Artisans batch merge)

## Baseline (before this round)

29 total: Sigma 10, TTArtisan 5, Laowa 5, Tamron 3, 7Artisans 3, Yongnuo 2,
Viltrox 1. See `openspec/changes/archive/2026-08-05-expand-thirdparty-lenses-canon/`
for the full prior research ledger — read it before re-researching anything,
especially the "Rejected candidates" and "Deferred with unresolved source
conflicts" tables.

## Batches

| Maker | Researched | Entered | Dropdown | Images | Prices | Committed |
|---|---|---|---|---|---|---|
| Sigma + Tamron re-check | ✅ both lineups enumerated, 0 new | ✅ N/A — 0 new | ✅ N/A | ✅ N/A | ✅ N/A | 6046cbe |
| Viltrox re-check | ✅ no change | — | n/a | n/a | n/a | 9769bce |
| TTArtisan deferred (9 of 14) | ✅ 9/9 | ✅ 7 | ✅ | ✅ | ✅ | 284a5d4 |
| 7Artisans deferred | ✅ 14/14 researched | 0 entered — all blocked, see below | n/a | n/a | n/a | fb4bbf5 |
| Yongnuo + Meike/Samyang/Zeiss re-check | ✅ | ✅ 2 (Samyang) | ✅ | ✅ | ✅ | 2e4dd6b |

## Batch 5 summary (2026-08-29)

- **Yongnuo**: 4 new AF candidates found on yongnuo.eu's RF category beyond
  the 2 already entered (23mm f/1.4 APS-C, 35mm F1.8 R DA DSM, 50mm F1.8
  R-mount, 85mm F1.8R II) — all genuine "R Mount" (= Canon RF) products, but
  **none entered**: the first 3 publish no weight/length/diameter/filter/
  MFD/elements/groups/blades on any reachable page (same pattern as round
  1's TTArtisan/7Artisans blocker); the 4th ("II") has full specs but reads
  suspiciously like the original product's own long-published numbers
  re-served under a new URL — flagged as ambiguous rather than entered as a
  probable duplicate. Full detail + all 4 candidates in `research/lenses.md`.
- **Meike**: AF re-confirmed EF-adapter-only (round 1 stands; RF-labelled
  listings are cine kits, out of scope anyway). **MF is a real, previously
  unchecked gap** — meikeglobal.com sells at least a native-RF MF prime
  (10mm F2.0 APS-C) plus RF-mount MF full-frame primes (50mm F1.7, 50mm
  F1.2) via Amazon. Not entered (time budget) — flagged for a dedicated
  Meike MF pass.
- **Samyang**: **round 1's "no native RF Samyang" was wrong.** Samyang has
  sold native Canon RF lenses since Feb 2019. Entered 2: `samyang-14mm-f28`
  (MF 14mm F2.8 RF, one of Samyang's first two RF lenses, still current) and
  `samyang-12mm-f2-rf-s` (AF 12mm F2 RF-S, Samyang's first RF-S lens,
  shipping since Jan 2025). A sibling MF 85mm F1.4 RF (announced alongside
  the 14mm in 2019) and a possible AF 14mm F2.8 RF surfaced but weren't
  independently verified this round — see `research/lenses.md`.
- **Zeiss**: re-confirmed absent from RF, with the sharper underlying fact
  that Zeiss has discontinued every mirrorless/DSLR consumer stills line
  company-wide (Loxia/Batis/Milvus/Otus) — RF was never a special case, no
  current mount at all has a new Zeiss stills lens except a handful of
  legacy DSLR (EF/F) primes kept in production by demand.
- `MANUFACTURER_COLORS['Samyang']` already existed (added for another
  brand) — no engine.js change needed.
- New `── Samyang ──` dropdown group added to `LENS_DROPDOWN_GROUPS`,
  ordered after Tamron / before Viltrox.
- `npm test` green (416/416) after `node scripts/generate-seo.js`.

## 7Artisans batch — findings (2026-08-29)

Re-pulled `7artisans.store/products.json` fresh (121 products). After
excluding cine/T-stop lenses (out of scope), the discontinued EF-M mount
(`Canon EOS-M` is not RF), the 3 already-entered lenses, and one accessory
(PL adapter kit), **14 non-cine candidates remain, none entered this pass.**

The `.store` dimension-diagram technique from round 1 is confirmed still
real (validated against the 3 existing entries — `7artisans-9mm-f56`'s page
still shows the exact Φ70mm × 86mm that's in `data.js`), but it does **not**
generalize across the catalogue:
- Several candidate pages (50mm f/1.05, 55mm f/1.4 Mark II) use an older page
  template with no numeric spec grid or dimension diagram at all.
- One candidate (35mm f/0.95 APS-C) has a full spec grid but **no dimension
  diagram anywhere on the page** (confirmed to footer).
- One candidate (60mm f/2.8 full-frame 2X ultra-macro) has a weight figure in
  marketing prose (about 550g) but no numeric grid or diagram.
- One candidate (14mm f/2.8, a very recent release) has the richest template
  seen — full spec grid *and* a "Product Parameters" dimension-diagram
  section — but the diagram's underlying element (a rounded-corner
  canvas/video component) never renders any content, confirmed via repeated
  waits, a fresh reload, and a pixel-region zoom capture. Its weight figure
  is also explicitly marked "(E)" (Sony E-mount only), so even a working
  diagram wouldn't have resolved the RF-specific weight.

Full per-candidate detail (spec-grid presence, diagram presence, sourced
partial figures) is in `research/lenses.md` and `research/sources.md` under
their 2026-08-29 sections.

## Confirmed unchanged

**Viltrox (re-checked 2026-08-29).** No new Canon RF/RF-S Viltrox product
exists. Findings:
- **viltrox.com's own store lists zero Canon-mount products of any kind** —
  its mount filter (`E-mount, FE-mount, X-mount, Z-mount, L-mount, M-mount,
  DL-mount, PL-mount`) doesn't even include Canon as an option, and an
  on-site search for "85mm RF" returns nine results, none of them RF. This
  is a stronger signal than round 1 had: Canon isn't just under-served, it's
  entirely absent from the maker's own storefront.
- **The 2022 cease-and-desist is the same historical event round 1 already
  found**, not a new dispute — a DPReview headline ("Canon told them to stop
  selling all RF mount products") reads as fresh but dates to 2022-08-29,
  corroborated by Canon Germany's official statement (fstoppers.com,
  2022-09-05).
- **RF-S AF primes (23/33/56mm f/1.4) remain unshipped.** A December 2025
  rumor (thenewcamera.com) claims Viltrox got "full authorization from
  Canon" as an "official partner" for RF-S lenses landing "first half of
  2026." As of today (2026-08-29, past that window), nothing has shipped —
  Viltrox's own most recent roadmap news (2026-08-20, 2026-04-10) covers
  L-mount and NAB announcements only, no Canon mention. Treated as an
  unconfirmed claim, not a scope change; still out per the skill's "verify
  against the maker, not a rumor" rule.
- **Existing `viltrox-85mm-f18` entry re-verified, no drift found.** No
  tier-1 page exists to check against (see above), but current retailer
  listings (B&H, GearFocus) still sell it under the same "RF II" name with
  the same 484g/92×80mm/72mm-filter/80cm-MFD/10-7-9/$399 figures already in
  the dataset. The 530g figure from the original Nov 2021 announcement
  belongs to a first-generation RF release that "RF II" (lighter, and what's
  actually sold today) superseded — not a data error, just two real
  generations. `productUrl:null`/`imageUrl:null` stay as-is; both are
  already correctly allowlisted in `completeness.test.js` (2026-08-17 note).
- Full citation trail in `research/sources.md` and `research/lenses.md`.

## TTArtisan batch — findings (2026-08-29)

TTArtisan is now **12 total** (5 from round 1 + 7 this batch):
`ttartisan-50mm-f14-asph`, `ttartisan-tilt-50mm-f14`, `ttartisan-500mm-f63`,
`ttartisan-50mm-f12`, `ttartisan-50mm-f095`, `ttartisan-35mm-f14-apsc`,
`ttartisan-23mm-f14-apsc`, `ttartisan-10mm-f2-asph-apsc`,
`ttartisan-tilt-35mm-f14-apsc`, `ttartisan-tilt-shift-17mm-f4-asph`,
`ttartisan-14mm-f28-asph`, `ttartisan-100mm-f28-2x-macro`.

## TTArtisan deferred-batch outcome (2026-08-29)

**The unlock worked**: `ttartisan.store`'s per-mount "Size" comparison image
gave real RF-specific diameter/length for 7 of the 9 lenses round 1 deferred
— see `research/lenses.md` for full citations. `ttartisan.com` (round 1's
primary tier-1 source) was **completely unreachable this round** (connection
refused, both WebFetch and browser) — a worse starting point than round 1,
made up for entirely by the store technique.

**Entered (7):** APS-C 35mm f/1.4, APS-C 23mm f/1.4, APS-C 10mm f/2 ASPH,
Tilt APS-C 35mm f/1.4, Tilt-Shift 17mm f/4 ASPH, 14mm f/2.8 ASPH, 100mm f/2.8
2X Macro. The last one also resolves round 1's open "TS-100-Macro naming
hazard" question (see ledger) — it's the plain macro, not a tilt-shift
product.

**Still deferred (2), narrower reasons than round 1's blanket one:**
- `ttartisan-17mm-f14-apsc` (APS-C 17mm F1.4) — round 1 believed this shipped
  in RF; this round found the *opposite* on the maker's own current
  storefront (Mount selector + spec prose both omit RF). A 2022 RF SKU
  existed at retail historically but appears delisted from TTArtisan's
  current catalogue.
- `ttartisan-25mm-f2-apsc` (APS-C 25mm F2) — RF *is* a live add-to-cart Mount
  option, but neither the spec-table prose nor — critically — the page's own
  per-mount Size **image** (which only has 3 columns: E/X, Z, M43) include an
  RF entry. The unlock technique doesn't help here because the maker hasn't
  published the diagram for this mount yet, not because of an image-reading
  problem.

**New-since-round-1 scope check:** re-scanned all 75 products on
`ttartisan.store` (`products.json`). Two Canon-RF-capable lenses exist that
were **not** on round 1's original 14-lens list and are **not yet entered**:
- `90mm-f1-25` — "90mm F1.25 Multi Mounts" (Sony E/Nikon Z/Canon RF/L
  mount/Fuji GFX/X1D)
- `ttartisan-21mm-f1-5` — "21mm F1.5 Multi Mounts" (Sony E/Nikon Z/Canon RF)

Neither was researched/entered this batch (out of the assigned scope: this
batch was "unblock the 9 deferred", not "find new SKUs") — flag for the next
Sigma/Tamron/Viltrox/Yongnuo re-check pass or a dedicated follow-up.
Also confirmed via the same scan: none of TTArtisan's `AF`-prefixed lenses
(17mm f/1.8 Air, 40mm F2, 75mm F2, 56mm F1.8, 35mm F1.8, 27mm F2.8) carry a
Canon RF mount option — consistent with this project's established scope
fact that TTArtisan AF lenses aren't RF-licensed. `TTARTISAN 100mm f/2.8
Macro Tilt-Shift RF` was also seen referenced externally (a 2026 RF add for
the *separate* `ts100` tilt-shift macro product, distinct from the plain
macro entered this batch) — also not researched/entered, same reason.

## Deferred / skipped (with reason)

(carried forward from the archived round — see its PROGRESS.md; nothing new
from the Viltrox batch — see "Confirmed unchanged" above)

- Yongnuo: 4 candidates found beyond the 2 already entered (3 no-spec-table
  skips, 1 ambiguous flag) — see `research/lenses.md`
- Meike: native-RF MF catalogue found (10mm F2.0 confirmed, likely more) —
  needs its own maker batch with full Step 2 spec sourcing
- Samyang: MF 85mm F1.4 RF and a possibly-real AF 14mm F2.8 RF surfaced but
  weren't independently verified — need a direct lksamyang.com/samyangus.com
  tier-1 read before entering
- **Sigma + Tamron re-check (2026-08-29): no new lenses, both lineups
  confirmed unchanged and complete.** Sigma's own Canon-RF landing page
  (`sigma-global.com/en/special/sigma_rfmount_lenses/`) lists exactly the 10
  lenses already in `canon/data.js`; Tamron's (`tamron.com/.../canon_rf/` and
  `tamron-americas.com/canon/`) lists exactly the 3 already entered. Nothing
  deferred — there was nothing new to defer.
- `tamron-17-70mm-f28` re-verified (was flagged in round 1 as needing a
  tier-2 check once time passed): still no independent hands-on review of
  the RF copy exists ~2 months post-launch (confirmed via an rfshooters.com
  forum thread explicitly asking for one — only YouTube coverage exists).
  All stored figures (530 g, 117.3 mm, 67 mm filter, $749) re-confirmed
  correct against tamron-americas.com; a `specSources` block was added to
  the entry recording the re-check and the tier-2 absence, plus a T4
  corroborating source (photographytalk.com, spec-comparison not a
  measurement). Nothing needed correcting. This item can come off the
  "needs re-verification" list; a genuine tier-2 review, if one appears in a
  later pass, would still be worth adding.

7Artisans candidates deferred this pass (all lack a sourceable
`length`/`diameter` pair, which is non-nullable):

- `7artisans-6mm-f2` (6mm f/2.0 APS-C fisheye) — not checked for template
  richness yet; untried.
- `7artisans-12mm-f28-ii` (12mm f/2.8 Mark II APS-C) — untried.
- `7artisans-14mm-f28` (14mm f/2.8 full-frame, new release) — spec grid
  sourced (F2.8-F22, Φ77mm filter, 13/9 elements/groups, 116° AOV, 10
  blades, manual focus, metal) but weight is Sony-E-specific (about 504g)
  and the dimension-diagram element renders empty (likely broken video
  component, not a timing issue) — re-check next pass in case 7Artisans
  fixes the storefront component, or source length/diameter from a
  corroborating retailer listing (B&H/Amazon box dims) instead.
- `7artisans-75mm-f14` (75mm f/1.4 full-frame) — untried.
- `7artisans-10mm-f28` (original 10mm f/2.8 fisheye, pre-Mark-II) — untried;
  round 1 already captured partial specs for this exact lens (filter none,
  MFD 17cm, f22 min, 570g, 11/8 elements/groups, 68x87mm L x diameter, store
  USD 256.00) blocked only on `year` at the time — worth checking if that
  old partial data plus a fresh year lookup is enough to enter without
  needing the diagram again.
- `7artisans-35mm-f14` (original 35mm f/1.4 APS-C, pre-Mark-III) — untried.
- `7artisans-25mm-f095` (25mm f/0.95 APS-C) — round 1 also captured partial
  specs (filter 52mm, MFD 25cm, f16 min, 587g, 11/9 elements/groups, 100x62mm
  L x diameter, store USD 143.40) blocked on `year`, with a flagged
  sanity-check concern (587g/100mm looked heavy/long for an APS-C 25mm) —
  re-verify that concern before trusting the old figures.
- `7artisans-50mm-f095` (50mm f/0.95 APS-C) — untried.
- `7artisans-60mm-f28-2x-macro` (60mm f/2.8 full-frame 2X ultra-macro) —
  weight sourced (about 550g, confirmed shown on a Canon EOS R body) but no
  length/diameter; page has no numeric grid or diagram at all.
- `7artisans-60mm-f28-ii-macro` (60mm f/2.8 Mark II APS-C macro) — untried.
- `7artisans-55mm-f14-ii` (55mm f/1.4 Mark II APS-C) — checked, older
  template, no numeric specs beyond marketing prose at all.
- `7artisans-50mm-f105` (50mm f/1.05 full-frame) — checked, older template,
  no numeric specs beyond marketing prose at all.
- `7artisans-35mm-f56` (35mm f/5.6 full-frame) — untried.
- `7artisans-35mm-f095` (35mm f/0.95 APS-C) — checked, full spec grid
  sourced (weight 369g, 11/8 elements/groups, 12 blades, Φ52mm filter, MFD
  0.37m, f0.95-16, 43.9° AOV, stepless aperture ring, metal body, USD RRP
  $249 — do not use the $149.25 sale price seen at read time) but **no
  dimension diagram anywhere on the page** — confirmed scrolled to footer.
  Closest to enterable of anything checked; only length/diameter missing.
- `7artisans-75mm-f28-ii` (7.5mm f/2.8 Mark II APS-C fisheye) — untried.

**Next-pass recommendation:** try Amazon/AliExpress listing "package
dimensions" as a tier-3 corroborating source for `35mm-0-95` and
`60mm-f-2-8-2x-macro` specifically, since both have every other field sourced
tier-1 and are blocked on exactly one pair of numbers each. For the 6
completely-untried candidates, check template richness first (does the page
have a numeric spec grid at all?) before investing in the diagram hunt.

(carried forward from the archived round — see its PROGRESS.md for older
TTArtisan/7Artisans deferred items pre-dating this round, plus the two
TTArtisan items from this batch above)

## Open questions for the user

- Yongnuo `yongnuo-85mm-f18-ii`: is this worth entering with the "II" page's
  own published specs despite the near-duplicate-of-the-original pattern, or
  should it stay deferred until Yongnuo's site reliability on this lens
  family improves? Left un-entered pending guidance.
