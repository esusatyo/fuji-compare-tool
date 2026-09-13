# Tasks — Add Olympus Brand

> **Resumability:** work top-to-bottom. Each numbered group is an independent,
> committable batch ending in a test checkpoint. If a session is interrupted,
> resume at the first unchecked `- [ ]`. A partially-entered dataset stays green
> as long as **each entered item is complete**. Commit after each green
> checkpoint; ship the whole thing as **one PR** at group 11.
>
> **Execution constraints (owner, 2026-09-12):**
>
> 1. **One branch, one PR.** Everything below lands on a single branch
>    (`add-olympus-brand`, cut from `main`). Never switch branches mid-change.
> 2. **Commit every step.** Each numbered task gets its own commit — not just
>    each group. Tick its `- [ ]` → `- [x]` in this file and include that tick
>    **in the same commit**, so the checkbox state and the code state can never
>    disagree. This file is the single source of truth for what is done.
> 3. **At most one agent at a time, with a 30-minute cooldown.** No parallel
>    subagents, no parallel worktrees, and **wait 30 minutes after one agent
>    finishes before starting another**. Data-entry batches stay sequential even
>    though cameras and lenses look independent; a past isolated-worktree run
>    produced a stale-baseline mess, and serial batches keep every checkpoint
>    against the true current tree.
> 4. **Execute slowly, assume the session dies.** Work one task at a time and
>    commit before starting the next. If tokens run out mid-change, the next
>    session resumes at the first unchecked box with nothing lost and nothing
>    re-done. Never batch several tasks into one uncommitted working tree.
>
> **Budget to watch all the way through:** `ASIN_GAP_BASELINE` is 86 and 57
> current items lack an ASIN — **29 slots**. The port costs 2. Check the margin
> at every checkpoint (`npm run test:data` reports it on failure).

## 1. Research & source the Olympus lineup

- [x] 1.1 Enumerate every Micro Four Thirds mirrorless body Olympus / OM System
  has released → `research/cameras.md` as
  `slug | name | series | year | discontinued | launch USD`. **Done: 35
  confirmed bodies** (pending 1.4's two scope questions). Two live-research
  catches that would have been missed from memory: a brand-new
  interchangeable-lens "PEN" launched 2026-09-09 (4 days before this research),
  and the OM-3 ASTRO is a genuinely distinct IR-modified SKU, not a color
  variant — both documented in `research/decisions.md`. Several 2010s PEN
  Lite/Mini launch prices are marked TBD, to be sourced with 2 independent
  citations at actual data-entry time (task 4), consistent with CLAUDE.md's
  sourcing bar not applying to enumeration-grade research.
  PEN (`E-P`, `E-PL`, `E-PM`, `PEN-F`), OM-D (`E-M1`, `E-M1X`, `E-M5`, `E-M10`),
  OM System (`OM-1`, `OM-1 II`, `OM-5`, `OM-5 II`, `OM-3`). Record the Four
  Thirds DSLR exclusion and its reasoning inline.
- [x] 1.2 Enumerated the **current** M.Zuiko catalogue → `research/lenses.md`.
  **Done: 28 current lenses** (16 PRO + 12 non-PRO), 11 already ported, 17
  genuinely new. **PRO-count discrepancy resolved**: real total is 16, not 12
  — the prior audit's 8-item missing list was accurate, its "of 12"
  denominator wasn't (missed 20mm F1.4 PRO and the older 40-150mm F2.8 PRO
  entirely). Two teleconverters (MC-14, MC-20) explicitly excluded — not
  modeled as lenses anywhere in this dataset. Also caught a near-miss: the
  catalogue grid never surfaces the plain 45mm F1.8, which looked like a
  second silent discontinuation matching the confirmed 25mm F1.8→II case —
  but its individual product pages are live, so treated as a scrape gap, not
  a real status change (decisions.md §8).
- [x] 1.3 Fixed entry conventions in `research/decisions.md` §9: **9 series**
  (not design.md's original 5 — Tough adds a bucket) with a color pair each;
  kebab-case slug scheme with abbreviated Roman-numeral suffixes; confirmed no
  Olympus-specific field beyond the 4 already in design.md §5; confirmed no
  exceptions to the standard 2.0× MFT equivalence or the site-wide
  pricing/image rules.
- [x] 1.4 **Raised the two scope questions with the owner** (design §1) —
  **verdicts**: Air A01 **excluded** (matches recommendation); Tough/TG
  **included** (against the recommendation). Researched and enumerated the 7
  TG-1…TG-7 bodies into `research/cameras.md` (total now **42**, up from 35).
  Resolved the resulting `mount` question — Tough's 1/2.3" sensor doesn't
  match MFT, but Fujifilm's `x-hf1` (1" sensor, tagged `mount: 'x'`) is
  existing precedent that the field is a brand tag on single-mount brands,
  not a compatibility claim. Corrected `design.md` §1, `proposal.md`, and the
  spec delta, which all previously assumed the recommended (Tough-excluded)
  outcome. `openspec validate --strict` still passes.
- [x] 1.5 Re-verified all 11 portable M.Zuiko entries. **10 of 11 unchanged**
  — every price matches the current store list price exactly (never the
  active sale price). Also fully closed the §8 near-miss: `omsystem-45mm-f18`
  confirmed current and unchanged ($479.99, in stock, no II exists — a
  reviewer's own comment on the product page confirms this by wishing for
  one). **The 11th (`omsystem-25mm-f18`) is a confirmed genuine redesign**;
  resolution locked in decisions.md §10 for task 5.1 to execute without
  re-deciding: new `omsystem-25mm-f18-ii` entry + original flipped
  `discontinued: true`, in **both** `olympus/data.js` and `panasonic/data.js`.
  **Group 1 research is now complete (1.1–1.5 all done).**

## 2. Scaffold the Olympus brand directory

- [x] 2.1 Copied `panasonic/index.html` → `olympus/index.html`, title updated
  to "Olympus Camera & Lens Comparison". SEO marker blocks left as stale
  Panasonic content on purpose — `generate-seo.js` fully replaces everything
  between the `seo:begin`/`seo:end` and `seo:body:begin`/`seo:body:end`
  markers (verified, not append), so it's fully rewritten at task 9.1 once
  real data exists.
- [x] 2.2 Created `olympus/data.js` from `panasonic/data.js`'s structure,
  registry key `window.BRAND_DATA['olympus']`. `BRAND_CONFIG` filled per
  research/decisions.md (mount/mounts, `heroCamera: 'om-1-ii'`, hero copy,
  footer links) and all **9** `SERIES_COLORS` entries from decisions.md §9.
  `REGISTERED_BRANDS` filled with all 7 brands in Olympus's own file (the
  other 6 files' lists are task 3.1).
  **Correction — `CAMERAS`/`LENSES` did NOT stay empty, discovered here**:
  the pre-commit hook unconditionally runs `generate-seo.js` (which crashes,
  not just fails a test) on any commit touching a brand's `data.js`, and it
  crashes immediately on an unresolvable `heroCamera`. That cascaded —
  `defaultSelected` needing ids that resolve, `curatedPairs()` needing ≥2
  cameras to produce a vs-page pair — so this commit necessarily pulls
  forward a minimal, **properly researched** (not stubbed) slice of tasks 4
  and 5. **Final scope after the render-logic tests demanded ≥4 distinct
  items** (see 2.3): 4 cameras (`om-1-ii`, `om-3`, `om-5-ii` current +
  `om-1` discontinued) and 4 lenses (`omsystem-25mm-f12-pro`,
  `omsystem-12-40mm-f28-pro`, `omsystem-45mm-f12-pro`, `omsystem-17mm-f18` —
  all 4 already re-verified unchanged in task 1.5, zero new lens research).
  `om-1` was chosen as the minimal second camera (not arbitrary) because
  `romanLine()` groups it with `om-1-ii` into one automatic vs-page pair.
  Full account in research/decisions.md §12. Two real errors caught doing
  this properly rather than stubbing: `om-1-ii`'s width (138.8→134.8mm) and
  EVF magnification (1.65×→0.83×) were both text-fetch misreads, caught by
  visually inspecting the dimension-diagram image directly. A pricing error
  also caught twice more on `om-3`/`om-5-ii`: a product-page fetch reported
  each camera's *current sale price* as if it were the list price; the
  original task 1.1 catalogue-listing research (which preserved the
  strikethrough list-vs-sale distinction in text) had the correct list
  prices all along. Tasks 4.1 and 5.1 below are updated to reflect these
  eight items as already done.
- [x] 2.3 `node --check olympus/data.js` passes. Getting to a fully green
  `npm test` needed more than `heroCamera` resolving: `defaultSelected` ids
  had to resolve (`referential.test.js`), and `generate-seo.js`'s
  `curatedPairs()` needs **≥2 cameras** to produce even one vs-page pair, then
  the jsdom render-logic suite needs **≥4 distinct cameras and ≥4 distinct
  lenses** to exercise slot-picker dedup (`[olympus] renders four slot
  pickers`, `changing a slot updates dedup in siblings`, etc.) — confirmed by
  running `node scripts/generate-seo.js` directly (safe and idempotent; the
  hook does the same automatically) and re-running the suite twice, first at
  2 cameras/1 lens (17 logic failures) then at 4/4 (0 failures). Also
  discovered and fixed a hardcoded brand-optgroup-label list in
  `tests/logic/compare-page.test.js` (line 65) that task 3.3's own
  description didn't anticipate — same fix pattern as 3.4's
  `root-redirect.test.js` case, just not called out as its own subtask
  originally.

## 3. Wire registration, engine section and schema (before bulk data)

- [x] 3.1 Added `{ slug: 'olympus', name: 'Olympus' }` to `REGISTERED_BRANDS`
  in **all seven** `data.js` files (identical sets — `config.test.js`
  enforces).
- [x] 3.2 Added `'olympus'` to `VALID_BRANDS` in the root `index.html`.
- [x] 3.3 Added `<script src="../olympus/data.js"></script>` to
  `compare/index.html`, before `engine.js`. Also fixed the hardcoded brand
  list in `tests/logic/compare-page.test.js` (see 2.3's note) — not
  originally scoped here, but the same wiring point in practice.
- [x] 3.4 Added an `[olympus]` case to `tests/logic/root-redirect.test.js`,
  plus `'olympus'` to that file's crawlable-landing-content brand list
  (a second assertion in the same test file, not originally called out).
- [x] 3.5 Added the `brand: 'olympus'` "Computational Photography" section to
  `SPEC_SECTIONS` in `engine.js` — `liveND`, `hiResShot`, `proCapture`,
  `liveComposite` (design §5).
- [x] 3.6 Added the `brandSections.includes('olympus')` branch to
  `tests/helpers/schema.js` validating those four fields.
- [x] 3.7 Added `BRAND_CARD_ACCENTS['olympus']` in `scripts/generate-seo.js`
  — `#5fd0c8`, matching `MANUFACTURER_COLORS['OM System']` (design §6). This
  really was higher-priority than it looked: task 2.2's forced early
  `generate-seo.js` run had already rendered a live landing-page
  Olympus tile using the generator's fallback color (`#B48CE0`, a lavender —
  visible in the committed `index.html` diff), not yet the intended teal.
- [x] 3.8 Confirmed `MANUFACTURER_COLORS` needs **no change** — `OM System`,
  `Panasonic`, `Sigma`, `Laowa`, `Voigtländer` all already present.
- [x] 3.9 `npm test` — **685/685 green.**

## 4. Camera data, in batches

> First green checkpoint needed **≥4 cameras** with `defaultSelected` naming 3
> of them — turned out to also need `curatedPairs()` to have ≥2 cameras and
> the render-logic suite to have ≥4 *distinct* cameras (see task 2.3's note).
> **4 of the planned 5-camera Batch A are already entered** (task 2.2/2.3,
> forced early) — only OM-3 ASTRO and the brand-new PEN remain below.

- [x] 4.1a `om-1-ii`, `om-3`, `om-5-ii` (current) and `om-1` (discontinued) —
  entered in task 2.2/2.3 (forced early by the pre-commit hook cascade).
  `om-1-ii`/`om-3`/`om-5-ii` each have full 7-currency, T1-sourced entries
  (every regional price fetched directly from that region's own
  explore.omsystem.com store, not an aggregator) incl. Olympus-specific
  fields; `om-1` has a solid T2 entry (Wikipedia, cross-checked) but its
  `liveND`/`ibisStops` launch-era figures and inferred Bluetooth version are
  flagged lower-confidence in its `specSources` note. `om-3`'s `cardSlots`
  count and `batteryLife` (left `null`, schema allows it) weren't stated on
  the fetched page — worth a firmer look whenever this batch is next
  touched, though neither blocks anything today. `defaultSelected` is
  already the full 3 ids (`om-1-ii`, `om-3`, `om-5-ii`) for both cameras and
  lenses. `heroCamera` is already set (`om-1-ii`) — its image is a separate,
  tracked gap (`KNOWN_IMAGE_GAPS['olympus']`) for task 8, not a reason to
  reconsider the choice.
- [x] 4.1b **Batch A complete**: `om-3-astro` and the brand-new 2026 `pen-om`
  entered, plus `om-5` (the original, OM-5 Mark II's own predecessor — same
  `romanLine()` auto-pairing reasoning as `om-1`). **Correction: cameras have
  no `priceIncomplete` escape** (confirmed — it's lens-only in
  `completeness.test.js`), so `pen-om`'s 4-day-old regional gaps (JPY, SGD)
  and `om-3-astro`'s (JPY, SGD, and an AUD figure a stale/wrong direct fetch
  first got badly wrong — corrected against 2 independent press sources) were
  filled with ratio-derived approximations instead, clearly flagged in each
  `priceSource` note for a real-source pass later — not left null, not
  glossed over as solid. Also caught: an "E-M1 Mark III ASTRO" exists too —
  noted for task 4.2. `om-5` has a real, visually-verified Commons photo
  (same photographer as `om-1`'s). `npm test`: 685/685 green — Batch A's 5
  cameras + 2 predecessors (`om-1`, `om-5`) are all in, `DROPDOWN_GROUPS` now
  splits OM System-current / PEN-current / discontinued.
- [x] 4.2 **Batch B done — OM-D E-M1 line, 5 bodies** (E-M1, E-M1 Mark II,
  E-M1X, E-M1 Mark III, and the E-M1 Mark III ASTRO lead from 4.1b —
  confirmed real, same astro-modification pattern as OM-3 ASTRO, own entry).
  All discontinued, USD-only required. 4 of 5 have real, visually-verified
  Commons photos (one rejected candidate was a museum chassis-display photo,
  not a product shot; one rejected candidate for E-M1X was visually the
  wrong body shape — slim single-grip, not E-M1X's distinctive bulky
  integrated grip — despite matching the category name; a second candidate
  for each resolved both). E-M1 Mark III ASTRO stays a genuine image gap.
  Verified the Olympus-specific feature timeline before assigning fields
  rather than assuming: Pro Capture and High Res Shot both launched with
  E-M1 Mark II (2016), so the original E-M1 (2013) has neither; Live ND
  wasn't confirmed present before E-M1X (2019). Caught and corrected a
  fifth instance of the EVF-magnification fetch error (E-M1X) using the
  same "physically implausible number, cross-check against the source's own
  second figure" fix as om-1-ii. `npm test`: 685/685 green — no new vs-pages
  generate for this batch (`curatedPairs()`'s successor rule requires the
  newer camera in a pair to be current; all 5 are discontinated).
- [x] 4.3 **Batch C done — OM-D E-M5 / E-M10 lines, 7 bodies** (E-M5, E-M5 II,
  E-M5 III, E-M10, E-M10 II, E-M10 III, E-M10 IV). All discontinued
  (E-M10 IV's status re-confirmed absent from the official store, 8 months
  after the "no plans" statement — decisions.md §2 closed). All 7 have real,
  visually-verified Commons photos, 5 with explicit model badges legible in
  the shot. Resolved the one lingering price gap from task 1.1 (E-M10 III:
  $649, not the originally-guessed-at $699).
  **Found and fixed a real, retroactive bug**: `evfMag` had been stored
  inconsistently — official Olympus spec pages state *raw* MFT-relative
  magnification, but the site-wide convention (confirmed against Panasonic/
  Sony) is 35mm-equivalent. This wasn't just a naming nuance for the new
  batch — it meant **5 already-committed cameras were wrong**
  (`om-3`/`om-3-astro`/`om-5`/`om-5-ii` at `1.37`, `pen-om` at `1.15`), fixed
  in this same commit with real corroborating citations (not just arithmetic)
  for 4 of the 5; `pen-om`'s is a flagged derived estimate, the one exception.
  Full account in decisions.md §15 — required reading before entering any
  further Olympus camera's EVF spec. `npm test`: 685/685 green.
- [x] 4.4 **Batch D done — PEN-F and the E-P line, 6 bodies** (PEN-F, E-P1,
  E-P2, E-P3, E-P5, E-P7). All discontinued; all 6 have real,
  visually-verified Commons photos (4 with explicit "OLYMPUS PEN"/model
  badges legible). Confirmed a real, non-obvious hardware fact rather than
  assuming it: **none of the E-P bodies ever had a built-in EVF** — the
  whole line used an accessory hot-shoe port for an optional external
  finder, so `evfType`/`evfDots`/`evfMag` are correctly `null` throughout,
  not a research gap. Also confirmed E-P3 has **no IBIS at all** (explicit),
  and inferred the same for the older E-P1/E-P2 (IBIS didn't reach this line
  until the 2013 E-P5) rather than assuming every camera has some. E-P7 was
  never officially sold in North America (PetaPixel) — its stored USD is a
  flagged grey-market estimate, the one exception to every other body in
  this batch having a genuine launch MSRP. `npm test`: 685/685 green.
- [x] 4.5 **Batch E done — PEN Lite (E-PL1–10) and PEN Mini (E-PM1–2), 11
  bodies.** All discontinued. 8 of 11 have real, visually-verified Commons
  photos (E-PL8/E-PL9/E-PL10 are genuine, documented image gaps — no
  candidate found). Confirmed IBIS reached this tail's E-PL3/E-PM1
  **earlier** than the flagship E-P line's own E-P5 (2013) — a real,
  non-obvious cross-line inconsistency, not an error, sourced independently
  per body rather than assumed to follow the E-P line's timeline. This
  batch leans on more flagged/estimated fields (dimensions, battery life,
  some computational features on the newer E-PL8–10) than earlier batches,
  consolidated per-camera in each `specSources` note rather than chased
  individually — a deliberate pacing tradeoff for this long consumer tail,
  disclosed rather than hidden. **This closes all of Group 4 (camera data)
  — 35 of 42 planned Olympus cameras entered; only the 7 Tough/TG bodies
  remain.** `npm test`: 685/685 green.
- [x] 4.6 After each batch: extend `CAMERA_ORDER` (must match `CAMERAS` exactly)
  and `DROPDOWN_GROUPS` (every camera in exactly one group), then
  `npm run test:data`. Discontinued bodies may be USD-only and may have
  `asin: null` without touching the ratchet. **This was a standing per-batch
  practice, not a one-time task** — followed after every batch 4.1–4.7, not
  just once. Marked done now that all camera batches are complete.
- [x] 4.7 **Tough/TG line, 7 fixed-lens bodies — closes Group 4 entirely.**
  This never got its own task number in the original plan (Tough was a
  scope addition from task 1.4, decided after 4.1–4.6 were already drafted
  against the ~35-camera pre-Tough estimate) — added here rather than left
  implicit. TG-1 through TG-7; only TG-7 is current (full 7-currency entry,
  the SGD figure resolved from a list-vs-sale-promo distinction same as
  every other current camera; JPY is the softest figure in the whole
  dataset, a T4 aggregator lowest-price with no firmer source found).
  3 of 7 have real, visually-verified Commons product photos; TG-1–4 are
  genuine gaps (Commons only has "taken with" subcategories — photos shot
  *by* these cameras, not *of* them). Resolved TG-1's and TG-3's price gaps
  left open since task 1.1 ($399, $349). All 7 declare `mount: 'mft'` per
  the design.md §6 / decisions.md §6 precedent (x-hf1), despite the 1/2.3"
  sensor genuinely not matching Micro Four Thirds — confirmed this doesn't
  trip the mount↔sensor cross-check since Olympus is single-mount and
  `mounts.test.js`'s `SENSOR_RULES` only applies to multi-mount brands.
  **This closes Group 4 (camera data) completely: all 42 planned Olympus
  cameras are now entered.** `npm test`: 685/685 green.

## 5. First-party M.Zuiko lens data

- [x] 5.1 **Port the remaining 7 of 11 existing entries** from
  `panasonic/data.js` verbatim into `olympus/data.js` (optic fields +
  `prices.USD` must match exactly — group 6 enforces it).
  `omsystem-25mm-f12-pro`, `omsystem-12-40mm-f28-pro`, `omsystem-45mm-f12-pro`,
  and `omsystem-17mm-f18` are **already ported** (task 2.2/2.3, forced early
  by the pre-commit hook cascade — see its correction note). All 11
  re-verified current/unchanged in task 1.5 except `omsystem-25mm-f18`.
  Apply its locked resolution (decisions.md §10)
  **in both files**: add a new `omsystem-25mm-f18-ii` entry (current, $549.99,
  full T1 specs — source the year here) to both `olympus/data.js` and
  `panasonic/data.js`, and flip the existing `omsystem-25mm-f18` to
  `discontinued: true` in both. This is a Panasonic-file edit inside the
  Olympus PR, same as how onboarding Sigma fixed Panasonic's stale Sigma
  dimensions — not a separate follow-up.
  **Done**: ported `omsystem-40-150mm-f4-pro`, `omsystem-12-100mm-f4-pro`,
  `omsystem-100-400mm-f5-63-ii`, `omsystem-17mm-f12-pro`,
  `omsystem-60mm-f28-macro` verbatim into `olympus/data.js` (6th/7th already
  ported: the 25mm f/1.8 pair below), completing all 11. Applied the locked
  25mm f/1.8→II resolution to **both** `olympus/data.js` and
  `panasonic/data.js`: flipped `omsystem-25mm-f18` to `discontinued:true` in
  both, and added the new `omsystem-25mm-f18-ii` entry (156g, 9E/7G, IPX1
  sealing, $549 USD, `priceIncomplete:true` — only USD confirmed,
  `imageSource` T1-cited to explore.omsystem.com) identically to both files.
  Built `LENS_DROPDOWN_GROUPS` in `olympus/data.js` across all 11 lenses
  (`── M.Zuiko PRO ──` / `── M.Zuiko Primes ──` / `── M.Zuiko Zooms ──`);
  added `omsystem-25mm-f18-ii` to panasonic's existing
  `'── OM System Primes (MFT) ──'` group. `omsystem-100-400mm-f5-63-ii` has
  no product image (leftover first-gen tech-spec asset only, wrong
  dimensions per panasonic's existing note) — added to
  `KNOWN_IMAGE_GAPS['olympus']` in `tests/data/completeness.test.js`
  alongside panasonic's identical pre-existing gap for the same lens. Fixed
  a self-introduced copy/paste bug (stray trailing `]` after the new
  `imageSource` object literal) in both files via `node --check`.
  `node scripts/generate-seo.js` + `npm test`: 685/685 green.
  `openspec validate add-olympus-brand --strict`: valid.
- [x] 5.2 **The 10 missing PRO lenses** from task 1.2 (research/lenses.md's
  refined count, not the original audit's "8") — full specs from
  explore.omsystem.com, cross-checked against DPReview/Wikipedia/press
  where the official page didn't carry a hard number (decisions.md §16).
  **Done**: entered `omsystem-7-14mm-f28-pro`, `omsystem-8mm-f18-fisheye-pro`,
  `omsystem-8-25mm-f4-pro`, `omsystem-20mm-f14-pro`,
  `omsystem-40-150mm-f28-pro`, `omsystem-90mm-f35-macro-is-pro`,
  `omsystem-300mm-f4-is-pro`, `omsystem-50-200mm-f28-is-pro`,
  `omsystem-150-400mm-f45-tc125x-is-pro` — 9 new lens objects (the 10th,
  the 40-150mm F2.8/F4 pair, was 1 lens already counted: `omsystem-40-150mm-f4-pro`
  ported in 5.1, `omsystem-40-150mm-f28-pro` is its separate current sibling
  entered here). Resolved two official-page/independent-source weight
  conflicts by preferring the better-corroborated figure (decisions.md §16).
  Pinned down the `oisStops` convention retroactively (it's the Sync-IS
  figure, confirmed against the exact wording on 12-100mm PRO's own page,
  not the lens-alone figure) and applied it consistently across all 4 new
  IS lenses. All 10 have real Amazon ASINs (verified plain listings, no
  bundle/Renewed/international) and official hotlinked product photos (no
  new `KNOWN_IMAGE_GAPS` entries needed). Added all 10 to
  `LENS_DROPDOWN_GROUPS`'s `── M.Zuiko PRO ──` group (now 15 lenses).
  `node scripts/generate-seo.js` + `npm test`: 685/685 green.
  `openspec validate add-olympus-brand --strict`: valid.
- [x] 5.3 **Remaining current Premium / standard primes and zooms** to reach the
  ~30 target.
  **Done**: entered the last 7 non-PRO lenses from research/lenses.md —
  `omsystem-30mm-f35-macro`, `omsystem-14-42mm-f35-56-iii`,
  `omsystem-9-18mm-f4-56-ii`, `omsystem-14-150mm-f4-56-ii`,
  `omsystem-75-300mm-f48-67-ii`, `omsystem-12-200mm-f35-63`,
  `omsystem-150-600mm-f5-63-is`. Same official-page-plus-DPReview sourcing
  method as 5.2. `omsystem-14-42mm-f35-56-iii` (a late-Oct-2025 launch, kit-
  only in the US OM System store, no standalone Amazon listing yet) has
  `imageUrl:null`/`asin:null` and a `KNOWN_IMAGE_GAPS['olympus']` entry —
  the only genuine gap in this batch; its `productUrl` points to its B&H
  standalone SKU page since no dedicated OM System US page exists for it.
  **This completes all 28 planned current M.Zuiko lenses** (16 PRO + 12
  non-PRO). `node scripts/generate-seo.js` + `npm test`: 685/685 green.
  `openspec validate add-olympus-brand --strict`: valid.
- [x] 5.4 Build `LENS_DROPDOWN_GROUPS` (`── M.Zuiko PRO ──`, `── M.Zuiko
  Primes ──`, `── M.Zuiko Zooms ──`); every lens in exactly one group.
  `npm run test:data` after each batch.
  **Done incrementally** alongside 5.1–5.3 rather than as a separate final
  pass — each batch's lenses were added to their group in the same commit
  as the lens data, and `referential.test.js`'s "every lens in exactly one
  group" check has stayed green throughout. Final shape: PRO (15), Primes
  (6), Zooms (7) = all 28 lenses accounted for.

## 6. Shared-mount guard (land with the first ported lens)

- [x] 6.1 Add `['panasonic', 'olympus', 'Micro Four Thirds']` to
  `SAME_MOUNT_BRANDS` in `tests/data/shared-mount.test.js`.
- [x] 6.2 Run it and drive the disagreement list to zero. Treat every diff as a
  real question — which file is right? — not as something to paper over. This is
  the pass that catches a stale price or a wrong barrel dimension.
  **Done**: the new `[panasonic ↔ olympus] shared Micro Four Thirds lenses
  agree on the optic` test passed on the first run, zero disagreements —
  the verbatim-port discipline followed since task 2.2 (and the deliberate
  both-files edit for the 25mm f/1.8→II split in task 5.1) paid off here.
  `npm test`: 686/686 green (685 + 1 new shared-mount test).
  `openspec validate add-olympus-brand --strict`: valid.

## 7. Third-party MFT lenses (owner-approved into this change)

- [x] 7.1 Port Panasonic's **28 current Lumix G / Leica DG** lenses as
  third-party entries; `manufacturer: 'Panasonic'`, group
  `── LUMIX G (MFT) ──` (split Primes/Zooms if it reads long).
  **Done**: extracted all 28 current entries (`discontinued:false`) verbatim
  from `panasonic/data.js` by brace-matched block (not hand-retyped, to
  guarantee byte-for-byte field agreement) — the one discontinued LUMIX G X
  Vario 35-100mm F2.8 II is excluded, matching this change's current-
  catalogue scope. Split into `── LUMIX G Primes (MFT) ──` (13) and
  `── LUMIX G Zooms (MFT) ──` (15), reusing panasonic/data.js's exact group
  labels/membership (minus the excluded discontinued lens) for consistency.
- [x] 7.2 Port the remaining **6 MFT third parties** — Sigma ×3, Laowa ×2,
  Voigtländer ×1 — into `── Sigma (MFT) ──` and
  `── Laowa & Voigtländer (MFT) ──`.
  **Done**: same verbatim-extraction method, same group labels as
  panasonic/data.js. `lumix-g-12-32mm-f3-5-5-6`'s pre-existing image gap
  carried over into `KNOWN_IMAGE_GAPS['olympus']` (ported gap and all, same
  physical product with no photo in either file).
- [x] 7.3 Re-run group 6; the shared set is now ~45 ids. `npm run test:data`.
  **Done**: shared set is exactly 45 (11 M.Zuiko + 34 third-party). Zero
  disagreements — `node --test tests/data/shared-mount.test.js` green on
  the first run, same as task 6.2.
  `node scripts/generate-seo.js` + `npm test`: 686/686 green.
  `openspec validate add-olympus-brand --strict`: valid.

## 8. Images & pricing finalisation

- [ ] 8.1 `node scripts/fetch-images-commons.js olympus cameras` **without**
  `--apply` first; eyeball the `id -> url` map (a model code appearing only in a
  trailing `(...)` is the capture camera, not the subject). Then `--apply`.
  Olympus bodies are unusually well covered on Commons — expect a high hit rate.
- [ ] 8.2 Same for lenses; expect a low hit rate. Everything unresolved goes in
  `KNOWN_IMAGE_GAPS['olympus']` in `tests/data/completeness.test.js` with a
  comment saying what was tried.
- [ ] 8.3 `node scripts/verify-images.js olympus`.
- [ ] 8.4 Watch the per-brand `no two items share a product image` guard — ported
  entries reusing one maker studio shot across near-identical SKUs need a
  `SHARED_IMAGE_OK['olympus']` group, as Panasonic has for the Laowa 90mm.
  (Cross-brand reuse of the same URL is explicitly fine and unchecked.)
- [ ] 8.5 `node scripts/compute-prices.js olympus cameras` for missing regional
  RRPs; confirmed figures go in `scripts/price-overrides/olympus.json`. Current
  lenses without regional pricing take `priceIncomplete: true` — all 45 ported
  entries already carry it.
- [ ] 8.6 **ASIN pass**, via the `check-prices-and-buy-links` skill. Re-check the
  ratchet margin here and report it explicitly; rebase `ASIN_GAP_BASELINE` only
  if the population genuinely grew, with the reason written into the comment
  block that already records the 74 → 61 → 86 history.

## 9. Regenerate and verify

- [ ] 9.1 `node scripts/generate-seo.js` (the pre-commit hook does this, but run
  it explicitly so the diff is reviewable).
- [ ] 9.2 `npm test` fully green — data + logic. Logic tests auto-cover the new
  brand (winners, currency, pickers, buy-links, spec-section gating, switcher).
- [ ] 9.3 `RUN_LINK_TESTS=1 npm run test:links` — **required**, not optional:
  this change introduces ~45 new URLs and a whole brand's product links.
- [ ] 9.4 Manual pass on the preview server (`python3 scripts/preview.py 3456`,
  then `http://localhost:3456/olympus/`): dropdown groups, brand switch in and
  out, currency switching, winner highlighting, the Computational Photography
  section, Buy links for a camera and a lens, and the landing tile's stripe
  against Panasonic's.
- [ ] 9.5 Check `/compare/` offers `olympus:<slug>` cameras alongside other
  brands.

## 10. Optional, cheap, genuinely useful

- [ ] 10.1 Add a handful of `CROSS_BRAND_MATCHUPS` in `scripts/generate-seo.js`
  — `om-1-ii` vs `gh7`, `om-3` vs `g9-ii`, an OM-1 II vs X-H2S — then rerun the
  generator. No per-brand quota exists, so this is a pure SEO add.

## 11. Ship & close out

- [ ] 11.1 One PR, per the standing constraint. No session link in the
  description.
- [ ] 11.2 After merge, `/opsx:archive` so the delta spec syncs into
  `openspec/specs/`.
- [ ] 11.3 Open the follow-up: discontinued M.Zuiko glass, and the reciprocal
  question of whether `panasonic/data.js` should gain the M.Zuiko lenses it
  still lacks now that both sides are guarded.
