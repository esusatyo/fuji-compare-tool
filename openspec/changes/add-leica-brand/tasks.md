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
- [ ] 1.5 Map price sources: confirm Leica's regional online stores for
  US/AU/EU(DE)/UK/JP/CA/SG list prices, and which regions don't sell online
  (→ `priceIncomplete` for lenses, or a documented source for cameras).

## 2. Scaffold the Leica brand directory

- [ ] 2.1 Copy `sigma/index.html` → `leica/index.html`, update the `<title>`.
  Leave SEO marker blocks for `generate-seo.js` to rewrite in task 8.1.
- [ ] 2.2 Create `leica/data.js` from `sigma/data.js`'s structure with registry
  key `'leica'`: `BRAND_CONFIG` (name, slug, families, `brandSections: []` for
  now, `mount`, `mounts` per design §2, `heroCamera`, hero copy,
  `defaultSelected`, footer links), `SERIES_COLORS`, `REGISTERED_BRANDS` (all
  eight). **Seed ≥4 current SL-line cameras and ≥4 current SL lenses, fully
  researched** (decisions §2 explains why a stub seed can't commit). Keep the
  seed on `l` so group 4's rule changes aren't needed yet.
- [ ] 2.3 `node --check leica/data.js`; `node scripts/generate-seo.js`;
  `npm test` green (may need group 3 pulled forward — if so, note it here).

## 3. Wire registration (before bulk data)

- [ ] 3.1 Add `{ slug: 'leica', name: 'Leica' }` to `REGISTERED_BRANDS` in all
  eight `data.js` files.
- [ ] 3.2 Add `'leica'` to `VALID_BRANDS` in root `index.html`.
- [ ] 3.3 Add `<script src="../leica/data.js"></script>` to `compare/index.html`
  before `engine.js`; check `tests/logic/compare-page.test.js` for a hardcoded
  brand list.
- [ ] 3.4 `tests/logic/root-redirect.test.js`: add a `[root] valid stored brand
  "leica"` case **and** `'leica'` to the crawlable-landing brand list (line ~105).
- [ ] 3.5 `BRAND_CARD_ACCENTS.leica` in `scripts/generate-seo.js` — non-red
  (design §8); add a comment explaining why.
- [ ] 3.6 Confirm `MANUFACTURER_COLORS['Leica']` needs no change.
- [ ] 3.7 Add `KNOWN_IMAGE_GAPS.leica` in `tests/data/completeness.test.js` if
  the seed has image gaps.
- [ ] 3.8 `npm test` green.

## 4. Test-rule adaptations (before any M, TL, Q or pre-2008 item)

- [ ] 4.1 `mounts.test.js`: let a `SENSOR_RULES` tuple name the field it tests
  (default `sensorType`); add the Leica `series` rules (design §3). Existing
  rows unchanged. Verify it fails on a deliberately wrong mount, then revert
  the probe.
- [ ] 4.2 `mounts.test.js`: add `LENS_CROP.leica` and `LENS_CROP_BY_LINE`
  (design §4). Same fail-then-revert probe with a TL lens tagged 1.0×.
- [ ] 4.3 `schema.js`: camera year floor → 2006 with comment (M8); lens floor
  → the oldest `year` actually entered (version-year convention, decisions
  §5), with a comment naming that lens.
- [ ] 4.4 Add `m` to `BRAND_CONFIG.mounts` together with the first M-mount item
  (the "every declared mount is used" test forbids declaring it earlier) — so
  this task lands with task 5.3's first commit; tick it there.
- [ ] 4.5 Leica spec section: `SPEC_SECTIONS` entry `brand: 'leica'` in
  `engine.js`, `schema.js` branch, `brandSections: ['leica']`, and backfill the
  fields on the seeded cameras. `npm test` green.

## 5. Camera data, in batches

> After each batch: extend `CAMERA_ORDER` (must equal `CAMERAS`),
> `DROPDOWN_GROUPS` (every camera exactly once, one mount per group),
> `KNOWN_IMAGE_GAPS`, then `npm run test:data`. Current bodies need all 7
> currencies; discontinued may be USD-only.

- [ ] 5.1 **Batch A — SL line** (remaining SL bodies after the seed).
- [ ] 5.2 **Batch B — T / TL / TL2 / CL.**
- [ ] 5.3 **Batch C — M8 → M (Typ 240) era** (M8, M8.2, M9, M9-P, M-E,
  M Monochrom, M 240/262, M-P, M-D, M Monochrom 246). Lands `m` (task 4.4).
- [ ] 5.4 **Batch D — M10 family.**
- [ ] 5.5 **Batch E — M11 family + M EV1.**
- [ ] 5.6 **Batch F — Q line** (`lensType: 'Fixed'`, `mount: 'l'`).
- [ ] 5.7 **Batch G — Leica X** (X1, X2, X Vario, X-E, X Typ 113, X-U).
- [ ] 5.7b **Batch H — large-sensor compacts** (D-Lux Typ 109 / 7 / 8,
  V-Lux Typ 114 / 5, C-Lux).
- [ ] 5.8 Final camera pass: `CAMERA_ORDER` newest-first within line,
  `defaultSelected` sanity, `npm test` green.

## 6. Lens data, in batches

> After each batch: `LENS_DROPDOWN_GROUPS` (every lens once, one mount per
> group), `KNOWN_IMAGE_GAPS`, `npm run test:data`. `manufacturer: 'Leica'`.
> Lenses may use `priceIncomplete: true`.

- [ ] 6.1 **Batch A — SL primes** (Super-APO/APO-Summicron-SL, Summilux-SL, APO-Macro-Elmarit-SL).
- [ ] 6.2 **Batch B — SL zooms** (Super-Vario-Elmarit-SL, Super-Vario-Elmar-SL, Vario-Elmarit-SL ×3, APO-Vario-Elmarit-SL, Vario-Elmar-SL).
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
