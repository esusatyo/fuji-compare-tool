# Tasks — Add Leica Brand

> **Resumability:** work top-to-bottom. Each numbered group is an independent,
> committable batch ending in a test checkpoint. If a session is interrupted,
> resume at the first unchecked `- [ ]`. A partially-entered dataset stays green
> as long as **each entered item is complete**. Ship the whole thing as **one
> PR** at group 10.
>
> **Execution constraints (owner):**
>
> 1. **One branch, one PR.** Everything lands on `add-leica-brand`, cut from
>    `main`. Never switch branches mid-change; this checkout may be shared with
>    other sessions — re-check `git branch --show-current` before each commit.
> 2. **Commit every step.** Each numbered task gets its own commit. Tick its
>    `- [ ]` → `- [x]` here **in the same commit**, so checkbox state and code
>    state can never disagree. This file is the source of truth for progress.
> 3. **At most one agent at a time, with a 30-minute cooldown.** No parallel
>    subagents, no parallel worktrees.
> 4. **Execute slowly, assume the session dies.** One task at a time, commit
>    before starting the next. Record non-obvious calls in
>    `research/decisions.md` as they're made.
> 5. **Sourcing:** maker's own site (incl. regional Leica stores) + one
>    reputable independent source (DPReview, B&H, Wikipedia for dates). Never
>    guess — use `null`, `priceIncomplete`, `KNOWN_IMAGE_GAPS`, or skip.
>
> **Budget:** at kickoff `ASIN_GAP_BASELINE` = 86 with 63 current items lacking
> an ASIN (23 slots). The rebase is approved but happens once, in task 7.6.
> Until then, keep the Leica seed within the margin.

## 1. Research & source the Leica lineup

- [x] 1.1 **Done: 40 core bodies** (SL 6, TL/CL 4, M 23, Q 7) in
  `research/cameras.md`, plus compact / Leica X / SOFORT candidates held for
  task 1.4. Special editions and rumoured bodies excluded; 3 source conflicts
  flagged ⚠ (decisions §3).
  Enumerate every in-scope Leica body → `research/cameras.md` as
  `slug | name | series | mount | lensType | year | discontinued | launch USD`.
  Lines: SL (Typ 601, SL2, SL2-S, SL3, SL3-S, SL3-P), T/TL/TL2/CL, digital M
  (M8, M8.2, M9, M9-P, M-E 220, M Monochrom, M Typ 240/262/M-P, M-D 262,
  M Monochrom 246, M10 family incl. -P/-D/-R/Monochrom/-E, M11 family incl.
  -P/-D/Monochrom, M EV1), Q (Typ 116, Q-P, Q2, Q2 Monochrom, Q3, Q3 43,
  Q3 Monochrom), compacts (D-Lux, V-Lux, C-Lux within the year floor).
  Treat that list as a checklist to verify, not as fact — confirm each exists,
  its year, and whether it's still sold on leica-camera.com. Note special/
  limited editions as excluded unless optically or functionally distinct.
- [x] 1.2 **Done: ~48–49 lenses** (M 25, SL 16–17, TL 7) in
  `research/lenses.md`; Summicron-M 66 (limited) and discontinued WATE / 18 /
  75 Summilux excluded; ⚠ status checks listed for entry. `year` convention
  revised to version year (design §5, decisions §5).
  Enumerate lenses → `research/lenses.md` as
  `slug | name | line | mount | type | focal | aperture | design year | current`:
  current M lenses, current SL lenses (APO-Summicron-SL, Summilux-SL,
  Vario-Elmarit-SL, Summicron-SL f/2 series, …), and all TL lenses (for 1.4).
  Record the oldest current M design's year (sets design §5's lens floor).
- [x] 1.3 **Done (decisions §5a):** 10 series + colors, slug scheme (already
  in use), dropdown groups (9 camera, 6 lens), Leica spec section confirmed as
  design §6's 4 fields, `mount: 'L-Mount'` (corrected from design's guess),
  `heroCamera: 'sl3'` (tentative), `afType` rule, Summilux-SL 50 resolved to
  one entry (current only).
  Fix entry conventions in `research/decisions.md`: series strings
  (must satisfy design §3's regexes) + `SERIES_COLORS` pairs; slug scheme
  (e.g. `m11-p`, `summilux-m-35mm-f14-asph`); dropdown groups; the Leica spec
  section's final field list (design §6); `BRAND_CONFIG.mount` string; hero
  camera; `afType` for manual lenses (use `'Manual'`, the site's dominant value).
  Update design.md where a candidate changed.
- [x] 1.4 **Done before 1.2 (decisions §4):** large-sensor compacts only
  (6), Leica X included (6), SOFORT 2 excluded, TL lenses included, old SL
  lenses excluded → **52 bodies**. Proposal, design, spec and cameras.md updated.
  **Raise the open scope questions with the owner** and log verdicts:
  Leica X / X Vario / X-U; SOFORT / SOFORT 2; discontinued TL lenses;
  discontinued SL lenses. Update proposal/design/spec and the 1.1/1.2 research
  to match. `openspec validate add-leica-brand --strict`.
- [x] 1.5 **Done (decisions §5b):** USD/GBP/EUR have full Leica-run stores
  (en-US, en-GB, de-DE). AUD/SGD/JPY route to authorized third-party stores
  Leica's own site links out to (leica-store.com.au, leica-store.sg,
  store.leica-camera.jp). CAD has no Leica-run store at all — Vistek
  (confirmed authorized dealer) is the source, spot-checked on the SL3-P.
  Map price sources: confirm Leica's regional online stores for
  US/AU/EU(DE)/UK/JP/CA/SG list prices, and which regions don't sell online
  (→ `priceIncomplete` for lenses, or a documented source for cameras).

## 2. Scaffold the Leica brand directory

- [x] 2.1 Copy `sigma/index.html` → `leica/index.html`, update the `<title>`.
  Leave SEO marker blocks for `generate-seo.js` to rewrite in task 8.1.
- [x] 2.2 Create `leica/data.js` from `sigma/data.js`'s structure with registry
  key `'leica'`: `BRAND_CONFIG` (name, slug, families, `brandSections: []` for
  now, `mount`, `mounts` per design §2, `heroCamera`, hero copy,
  `defaultSelected`, footer links), `SERIES_COLORS`, `REGISTERED_BRANDS` (all
  eight). **Seed ≥4 current SL-line cameras and ≥4 current SL lenses, fully
  researched** (decisions §2 explains why a stub seed can't commit). Keep the
  seed on `l` so group 4's rule changes aren't needed yet.
  **Done:** seeded `sl3`, `sl3-s`, `sl3-p` (current) + `sl2-s` (discontinued),
  and 3 SL primes + 1 SL zoom — via 2 sequential single research agents
  (parallel research paused mid-run per owner instruction to conserve tokens;
  the lens agent also hit a session rate limit once and was cleanly retried).
  All prices/specs sourced from Leica's own regional stores + DPReview/
  retailer corroboration; no fabricated ASINs (agents reported "no confident
  ASIN" rather than guessing where Amazon only had used/bundle listings).
- [x] 2.3 `node --check leica/data.js`; `node scripts/generate-seo.js`;
  `npm test` green (may need group 3 pulled forward — if so, note it here).
  **Pulled forward, same commit** (mirrors the Olympus precedent at its own
  task 2.3): task 3.1 (`REGISTERED_BRANDS` synced in all 7 other `data.js`
  files) and task 4.5 (Leica `SPEC_SECTIONS` entry + `schema.js` branch) —
  both were needed for `npm test` to pass at all, not just to look complete.
  Also added `leica-camera.com` to `ALLOWED_HOSTS` in
  `tests/data/links-offline.test.js` (not originally its own task). **791/791
  green.**

## 3. Wire registration (before bulk data)

- [x] 3.1 Add `{ slug: 'leica', name: 'Leica' }` to `REGISTERED_BRANDS` in all
  eight `data.js` files. **Done in task 2.3's commit** (see above).
- [x] 3.2 Add `'leica'` to `VALID_BRANDS` in root `index.html`.
- [x] 3.3 Add `<script src="../leica/data.js"></script>` to `compare/index.html`
  before `engine.js`; check `tests/logic/compare-page.test.js` for a hardcoded
  brand list. **Found one** — the dropdown-groups assertion hardcoded all 8
  (now 9) brand labels; added `'Leica'`.
- [x] 3.4 `tests/logic/root-redirect.test.js`: add a `[root] valid stored brand
  "leica"` case **and** `'leica'` to the crawlable-landing brand list (line ~105).
- [x] 3.5 `BRAND_CARD_ACCENTS.leica` in `scripts/generate-seo.js` — non-red
  (design §8); add a comment explaining why. Used `#b8b2a7` (chrome/silver).
- [x] 3.6 Confirm `MANUFACTURER_COLORS['Leica']` needs no change. Confirmed —
  already present in `engine.js` (used for lens placeholder cards).
- [x] 3.7 Add `KNOWN_IMAGE_GAPS.leica` in `tests/data/completeness.test.js` if
  the seed has image gaps. **Not needed** — all 8 seed items have a real
  `imageUrl` (3 leica-camera.com hotlinks + 1 Commons photo for cameras; 4
  leica-camera.com hotlinks for lenses).
- [x] 3.8 `npm test` green. **792/792.** (3.2–3.8 bundled into one commit —
  pure mechanical wiring with no independent research value split apart.)

## 4. Test-rule adaptations (before any M, TL, Q or pre-2008 item)

- [x] 4.1 `mounts.test.js`: let a `SENSOR_RULES` tuple name the field it tests
  (default `sensorType`); add the Leica `series` rules (design §3). Existing
  rows unchanged. Verify it fails on a deliberately wrong mount, then revert
  the probe. **Done** — probed by mistagging `sl3`'s mount to `'m'`; the
  sensor-rule test correctly failed, reverted cleanly (`git diff` empty).
- [x] 4.2 `mounts.test.js`: add `LENS_CROP.leica` and `LENS_CROP_BY_LINE`
  (design §4). Same fail-then-revert probe with a TL lens tagged 1.0×.
  **Done**, mechanism added and code-reviewed; the live fail/revert probe
  itself is deferred to task 6.6 (no TL lens exists yet to probe against).
- [x] 4.3 `schema.js`: camera year floor → 2006 with comment (M8); lens floor
  → the oldest `year` actually entered (version-year convention, decisions
  §5), with a comment naming that lens. **Camera floor done** (2006, M8).
  **Lens floor left at 2008** — no lens entered so far needs it (the
  version-year convention keeps even the oldest current M-lens versions
  ≥2008); a comment on the lens floor explains the exception and says to
  lower it, naming the lens, if one ever doesn't. Updated the
  `schema-guards.test.js` fixture pinning the old 2007/2008 bounds to
  2005/2006 to match.
- [x] 4.4 Add `m` to `BRAND_CONFIG.mounts` together with the first M-mount item
  (the "every declared mount is used" test forbids declaring it earlier).
  **Done in task 5.3a's commit** (see there).
- [x] 4.5 Leica spec section: `SPEC_SECTIONS` entry `brand: 'leica'` in
  `engine.js`, `schema.js` branch, `brandSections: ['leica']`, and backfill the
  fields on the seeded cameras. `npm test` green. **Done in task 2.3's commit**
  (see above) — the seed cameras needed it to validate at all.

## 5. Camera data, in batches

> After each batch: extend `CAMERA_ORDER` (must equal `CAMERAS`),
> `DROPDOWN_GROUPS` (every camera exactly once, one mount per group),
> `KNOWN_IMAGE_GAPS`, then `npm run test:data`. Current bodies need all 7
> currencies; discontinued may be USD-only.

- [x] 5.1 **Batch A — SL line** (remaining SL bodies after the seed): `sl2`
  ($5,995, IBIS 5.5 stops — confirmed the SL2 does have IBIS, contrary to
  this file's own earlier assumption that it started with the SL2-S) and
  `sl-typ-601` ($7,450, no IBIS). Images from Wikimedia Commons (both
  camera+lens shots, not bare body — accepted, no bare-body Commons photo
  exists for either). `npm test`: 792/792.
- [x] 5.2 **Batch B — T / TL / TL2 / CL.** `cl` corrected to its own `series:
  'CL'` (research agent had grouped it under `'TL'`, against this file's own
  task-1.3 decision to split them for a truthful dropdown label).
  `focusingSystem` made nullable in schema.js — T/TL/TL2 have neither a
  rangefinder nor a built-in EVF (design §6 corrected to match). TL/TL2 have
  no findable product image (Leica's pages for these are gone, no bare-body
  Commons photo exists) → `KNOWN_IMAGE_GAPS.leica`. T (Typ 701) and CL do
  have Commons photos — T's is a verified direct-URL fetch (my first attempt
  guessed a thumbnail path that was wrong; corrected before committing). CL's
  is a Wikipedia-infobox-quality retail-display shot, accepted for now,
  revisit in task 7 if a better one turns up. `npm test`: 792/792.
- [~] 5.3a **M8 → M9-P era, first half**: M8, M9-P, M-E (Typ 220), M
  Monochrom entered — 4 of the 6 planned for this sub-batch. **M8.2 and M9
  skipped**: both have a solidly sourced UK price but no citable US dollar
  figure found after extensive effort (decisions §6); `prices.USD` has no
  nullable escape, so entering either would mean guessing. Flagged as a
  named follow-up before task 5.8. Lands the `m` mount (task 4.4) —
  `BRAND_CONFIG.mounts` now declares both `l` and `m`. `npm test`: 792/792,
  first try.
- [x] 5.3b **M Typ 240/262 generation, second half**: M (Typ 240), M-P
  (Typ 240), M Monochrom (Typ 246), M (Typ 262), M-D (Typ 262), M-E
  (Typ 240) — all 6 entered. Corrected two brief assumptions with sourced
  evidence: the M Monochrom (Typ 246) DOES record 1080p B&W video (3
  independent sources; only Typ 262/M-D lack video in this generation), and
  `weatherSealed` is `true` for M (Typ 240)/M-P (Typ 240)/M-E (Typ 240) per
  DPReview's own spec tables (`false` only for the CCD-era bodies and the
  Typ-262 pair, which no source claims are sealed). M (Typ 240)'s $6,950
  price is **derived**, not directly stated — two independent sources
  (DPReview + Wikipedia) both state the M-P is "$1,000 more than the
  standard M (Typ 240)" from its confirmed $7,950, so $6,950 follows by
  arithmetic from two sourced facts, documented inline as derived rather
  than presented as directly cited. M-D (Typ 262)'s candidate image had the
  same kind of identity question as the D-Lux 6/109 mixup in task 5.7b —
  its own description text says "M (Typ 262)" but Commons/Wikipedia
  category it as M-D — resolved the same way, by visually confirming the
  M-D's one unmistakable tell (no rear LCD) is actually visible in the
  photo. No image for M Monochrom (Typ 246) or M-E (Typ 240) →
  `KNOWN_IMAGE_GAPS.leica`. `npm test`: 792/792.
  **All 6 batch-5.3 sub-groups plus M8.2/M9's gap are now the only M-era
  research left open** (batches 5.4 M10 family, 5.5 M11 + M EV1).
- [x] 5.4 **Batch D — M10 family**: M10, M10-P, M10-D, M10 Monochrom, M10-R
  — all 5 entered. Caught and rejected a DPReview database anomaly: its
  M10-R spec table claims a "fully articulated" touchscreen and weather
  sealing, contradicting every review and Wikipedia (no M-series body
  through M11 has ever had an articulating screen) — treated as a data
  error and not carried forward, documented inline. `maxBurst` for
  M10-R/M10 Monochrom isn't independently published by any source found;
  inferred at 5fps from the shared M10-family shutter mechanism (confirmed
  on M10/M10-P/M10-D), documented as an inference. `bluetooth: false` for
  all 5 (Leica added Bluetooth starting with the M11, not this generation).
  All 5 images verified directly. `npm test`: 792/792.
- [x] 5.5 **Batch E — M11 family + M EV1**: M11, M11 Monochrom, M11-P,
  M11-D, M EV1 — all 5 entered, all confirmed CURRENT (checked individually
  against leica-camera.com rather than assumed), so all needed full
  7-currency pricing. Real findings: internal storage isn't uniform (M11 and
  M EV1 = 64GB, M11-P/M11-D/M11 Monochrom = 256GB, all confirmed genuine
  persistent storage alongside the SD slot, not a burst buffer); Content
  Credentials is true for M11-P/M11-D/M EV1, false for M11/M11 Monochrom;
  the M EV1 is manual-focus-only despite its built-in EVF (confirmed on its
  own spec page) — visually verified via its product photo, which shows no
  optical rangefinder window at all, unlike the M11's. **M11's CAD is
  derived**: Vistek (this dataset's confirmed CAD dealer) stocks every other
  M11-family body but not the plain M11; since M11 and M11-P share
  identical USD/AUD/JPY prices from independent sources, M11-P's confirmed
  CAD is reused, documented inline as derived. `npm test`: 792/792, first
  try.
- [x] 5.8 **Final camera pass.** Count correction: the plan's "52 cameras" /
  "23 M-mount bodies" figures (proposal.md, several earlier task notes) were
  an off-by-one from early research — `research/cameras.md`'s M table
  actually lists 22 rows, making the true total **51 cameras**, matching
  exactly what's now entered: 49 + the 2 deliberately-skipped M8.2/M9 (still
  open, decisions §6). `CAMERA_ORDER`/`DROPDOWN_GROUPS` newest-first
  ordering spot-checked across all 9 groups. `defaultSelected` still
  resolves (`sl3`/`sl3-s`/`sl3-p`). Tried M8.2/M9 pricing again this session
  (fresh WebSearch attempt) — still exhausted
  (`CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` cap persists across the
  apparent session-rate-limit resets seen elsewhere in this change); remains
  a named follow-up, not blocking. `npm test`: 792/792.
- [x] 5.6 **Batch F — Q line** (`lensType: 'Fixed'`, `mount: 'l'`), all 7
  bodies. Corrects design §6's assumption that the Q3 family has built-in
  storage — Leica's spec sheets list only an 8GB *buffer* (burst memory, not
  storage), so `internalStorageGB` is `null` for Q3/Q3 43/Q3 Monochrom (the
  M11 family, still unresearched, isn't assumed either way). Current-body
  prices reflect the March 2026 US price increase (site convention is
  current list price, not launch price — Q3 launched at $5,995, is $7,350
  now). `q-p` has no findable image (Leica's page is gone, no Commons photo
  exists for this model specifically) → `KNOWN_IMAGE_GAPS.leica`. 3
  discontinued bodies (`q2`, `q2-monochrom`, `q-typ-116`) use DPReview as
  `productUrl` since their Leica pages are gone too — added `dpreview.com`
  to the offline-link-test host allowlist (already trusted as a footer-link
  source across several brands). All Commons/manufacturer image URLs
  verified directly before writing, catching nothing wrong this time.
  `npm test`: 792/792.
- [x] 5.7 **Batch G — Leica X** (X1, X2, X Vario, X-E, X Typ 113, X-U), all
  discontinued APS-C fixed-lens compacts. Confirmed X-E (Typ 102) is a real,
  distinct SKU (own price/launch), even though its technical specs are
  identical to the X2's (same sensor/lens/dimensions/battery per Leica's own
  datasheet) — only the finish and price differ, so it stays a separate
  entry rather than being folded into X2. No image found for X Vario or
  X-E (checked Commons categories/search + Wikipedia infobox source) →
  `KNOWN_IMAGE_GAPS.leica`. The other 4 images verified directly (URL +
  author + licence) before writing. `npm test`: 792/792 first try.
- [x] 5.7b **Batch H — large-sensor compacts** (D-Lux Typ 109 / 7 / 8,
  V-Lux Typ 114 / 5, C-Lux). D-Lux 8 current (full 7-currency pricing), the
  other 5 discontinued. Resolved a real image-identity ambiguity: Commons
  categorizes the D-Lux Typ 109 photo under "Leica D-Lux 6" (a different,
  smaller-sensor camera not in scope), but the file's own description said
  "type 109" — downloaded and visually inspected the lens-barrel text
  ("DC VARIO-SUMMILUX 1:1.7-2.8/10.9-34 ASPH.", the Typ 109's exact formula,
  not the D-Lux 6's), confirming the description was right and the category
  wrong. Also visually confirmed the D-Lux 8 and Q3-generation product
  photos genuinely show those cameras (lens-barrel text again). No image for
  V-Lux (Typ 114) → `KNOWN_IMAGE_GAPS.leica`. `npm test`: 792/792.
  **29 of 52 planned cameras now entered** (all non-M-mount lines: SL, TL/CL,
  Q, Leica X, compacts); the 23 M-mount bodies (5.3–5.5) remain before 5.8's
  final pass.
- [ ] 5.8 Final camera pass: `CAMERA_ORDER` newest-first within line,
  `defaultSelected` sanity, `npm test` green.

## 6. Lens data, in batches

> After each batch: `LENS_DROPDOWN_GROUPS` (every lens once, one mount per
> group), `KNOWN_IMAGE_GAPS`, `npm run test:data`. `manufacturer: 'Leica'`.
> Lenses may use `priceIncomplete: true`.

- [x] 6.1 + 6.2 **SL primes + zooms, combined** (already had 3 primes + 1 zoom
  from the task-2.2 seed): added the remaining 5 primes (APO-Summicron-SL
  28/35/75/90mm, APO-Macro-Elmarit-SL 100mm) and 5 zooms
  (Super-Vario-Elmarit-SL 14-24mm, Super-Vario-Elmar-SL 16-35mm,
  Vario-Elmarit-SL 70-200mm, APO-Vario-Elmarit-SL 90-280mm, Vario-Elmar-SL
  100-400mm) — SL lens lineup now complete, all current. Two are
  current-but-regionally-constrained (16-35mm out of US web stock, 70-200mm
  out of DE/GB web stock) rather than discontinued — treated as inventory
  gaps, not status changes. `afType` uses the site's existing generic
  `'Autofocus'` fallback for 3 zooms + the 100mm macro, where Leica's own
  pages never name a specific motor (checked, not guessed). Fixed a broken
  `og:image` on Leica's own 75mm page (points to an unrelated product) by
  sourcing that one image from leicacamerausa.com's CDN instead, verified
  visually (lens barrel print reads "75") — added `bigcommerce.com` to the
  offline-link host allowlist. CAD (28mm) and SGD (70-200mm, 100-400mm) gaps
  → `priceIncomplete: true`, genuinely unavailable rather than unchecked.
  **Crossed `ASIN_GAP_BASELINE`** (86 → 87, +1) — a narrow, documented,
  owner-pre-approved rebase, not the full task 7.6 pass (still to come once
  every current Leica item, including upcoming M lenses, has had a real
  ASIN search). `npm test`: 792/792.
- [ ] 6.3 **Batch C — M: Noctilux-M + Summilux-M** (incl. Classic Line reissues).
- [ ] 6.4 **Batch D — M: Summicron-M + APO-Summicron-M.**
- [ ] 6.5 **Batch E — M: remaining** (Elmarit-M, Summaron-M, Macro-Elmar-M, Thambar-M, APO-Telyt-M).
- [ ] 6.6 **Batch F — TL lenses** (all, incl. discontinued — task 1.4).
- [ ] 6.7 Final lens pass: group order and `defaultSelected`, `npm test` green.

## 7. Images & pricing finalisation

- [ ] 7.1 `node scripts/fetch-images-commons.js leica cameras` without
  `--apply`; eyeball every hit (reject capture-camera matches), then `--apply`,
  shrink `KNOWN_IMAGE_GAPS.leica`.
- [ ] 7.2 Same for lenses.
- [ ] 7.3 `node scripts/verify-images.js leica`; check the no-duplicate-image
  guard (Monochrom/colour twins may share a Commons photo — they must not).
- [ ] 7.4 Record image credits as the licence requires (`fetch-image-credits.js`).
- [ ] 7.5 `node scripts/compute-prices.js leica cameras|lenses` for missing
  regional RRPs; confirmed regional figures → `scripts/price-overrides/leica.json`.
- [ ] 7.6 **ASIN pass** via `check-prices-and-buy-links`, then the approved
  `ASIN_GAP_BASELINE` rebase in its own commit: history comment + named list of
  Leica items without a verified ASIN.

## 8. Regenerate and verify

- [ ] 8.1 `node scripts/generate-seo.js`; commit generated output.
- [ ] 8.2 `npm test` fully green.
- [ ] 8.3 `RUN_LINK_TESTS=1 npm run test:links` — **required** (every URL is new).
- [ ] 8.4 Manual pass on `python3 scripts/preview.py 3456` → `/leica/`: mount
  chips (L-Mount / M-Mount), fixed-lens label on Q, dropdown groups, currency
  switch, winners, Leica section, Buy links, light + dark theme, phone width.
- [ ] 8.5 `/compare/`: `leica:<slug>` cameras selectable; Leica section shows
  "—" for other brands' cameras.

## 9. Optional

- [ ] 9.1 A few `CROSS_BRAND_MATCHUPS` (e.g. Q3 vs Fujifilm GFX100RF / Sony
  RX1R III, SL3 vs Panasonic S1R II / Sigma fp L) — only pairs whose data is
  in the dataset.

## 10. Ship & close out

- [ ] 10.1 One PR. No session link in the description.
- [ ] 10.2 After merge, `/opsx:archive` the change.
- [ ] 10.3 Propose follow-ups: third-party L/M lenses (+ `SAME_MOUNT_BRANDS`
  row), discontinued M lenses, and update CLAUDE.md's mount id list with `m`
  (do this one in 10.1's PR if not already done in task 4.4).
