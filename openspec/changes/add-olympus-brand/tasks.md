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
- [ ] 1.2 Enumerate the **current** M.Zuiko catalogue → `research/lenses.md`
  (~30). Mark which of the 11 already in `panasonic/data.js` port directly, and
  flag the 8 missing PRO lenses a prior audit identified (7-14mm F2.8, 12-45mm
  F4, 8-25mm F4, 50-200mm F2.8 IS, 90mm F3.5 Macro IS, 150-400mm F4.5 TC1.25X IS,
  300mm F4 IS, 8mm F1.8 Fisheye). **Resolve the PRO-count discrepancy here**:
  that audit says "6 of 12 current PRO lenses" but lists 8 missing — 6 + 8 = 14,
  so its total or its list is wrong. Count the live `m-zuiko-pro` collection
  page and record the real figure; 6 PRO entries exist in `panasonic/data.js`.
- [ ] 1.3 Fix entry conventions — series labels + `SERIES_COLORS`, slug scheme,
  the Olympus field set, MFT 2.0× equivalence, pricing/image rules →
  `research/decisions.md`.
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
- [ ] 1.5 Re-verify the 11 portable M.Zuiko entries against the live catalogue —
  still sold, specs unchanged, `discontinued` accurate. Carry forward the open
  **`omsystem-25mm-f18` → `25mm F1.8 II`** question from the prior audit: the US
  store now sells a redesigned II (156g vs the stored 136g), which per the
  coexisting-revisions rule points at a **new entry + the original flipped to
  discontinued**, in both files. Decide it here, don't discover it at port time.

## 2. Scaffold the Olympus brand directory

- [ ] 2.1 `cp panasonic/index.html olympus/index.html`; update the `<title>`
  ("Olympus Camera & Lens Comparison").
- [ ] 2.2 Create `olympus/data.js` from `panasonic/data.js`, keeping the registry
  IIFE wrap; set the key to `window.BRAND_DATA['olympus']`. Fill `BRAND_CONFIG`
  (incl. `mounts: [{ id:'mft', label:'Micro Four Thirds' }]` byte-identical to
  Panasonic's, `mount: 'Micro Four Thirds'`, `brandSections: ['olympus']`) and
  `SERIES_COLORS`; leave `CAMERAS`, `CAMERA_ORDER`, `DROPDOWN_GROUPS`, `LENSES`,
  `LENS_DROPDOWN_GROUPS` empty.
- [ ] 2.3 `node --check olympus/data.js`.

## 3. Wire registration, engine section and schema (before bulk data)

- [ ] 3.1 Add `{ slug: 'olympus', name: 'Olympus' }` to `REGISTERED_BRANDS` in
  **all seven** `data.js` files (identical sets — `config.test.js` enforces).
- [ ] 3.2 Add `'olympus'` to `VALID_BRANDS` in the root `index.html`.
- [ ] 3.3 Add `<script src="../olympus/data.js"></script>` to
  `compare/index.html`, before `engine.js`.
- [ ] 3.4 Add an `[olympus]` case to `tests/logic/root-redirect.test.js`.
- [ ] 3.5 Add the `brand: 'olympus'` "Computational Photography" section to
  `SPEC_SECTIONS` in `engine.js` — `liveND`, `hiResShot`, `proCapture`,
  `liveComposite` (design §5).
- [ ] 3.6 Add the `brandSections.includes('olympus')` branch to
  `tests/helpers/schema.js` validating those four fields.
- [ ] 3.7 Add `BRAND_CARD_ACCENTS['olympus']` in `scripts/generate-seo.js` — a
  teal, not a blue (design §6).
- [ ] 3.8 Confirm `MANUFACTURER_COLORS` needs **no change** — `OM System`,
  `Panasonic`, `Sigma`, `Laowa`, `Voigtländer` all already present.
- [ ] 3.9 `npm test` — green with an empty Olympus dataset except the
  known-failing `heroCamera` assertion; land 4.1 in the same commit if it blocks.

## 4. Camera data, in batches

> First green checkpoint needs **≥4 cameras** with `defaultSelected` naming 3 of
> them (the engine renders 3 slots; the picker-dedup logic test needs a 4th).

- [ ] 4.1 **Batch A — current OM System bodies** (~5): OM-1 Mark II, OM-1, OM-3,
  OM-5 Mark II, OM-5. All 7 currencies required. Set `heroCamera` to whichever
  has a clean freely-licensed or official product photo. `npm run test:data`.
- [ ] 4.2 **Batch B — OM-D E-M1 line** (E-M1X, E-M1 III, E-M1 II, E-M1).
- [ ] 4.3 **Batch C — OM-D E-M5 / E-M10 lines.**
- [ ] 4.4 **Batch D — PEN-F and the E-P line.**
- [ ] 4.5 **Batch E — PEN Lite (E-PL) and PEN Mini (E-PM) tail.**
- [ ] 4.6 After each batch: extend `CAMERA_ORDER` (must match `CAMERAS` exactly)
  and `DROPDOWN_GROUPS` (every camera in exactly one group), then
  `npm run test:data`. Discontinued bodies may be USD-only and may have
  `asin: null` without touching the ratchet.

## 5. First-party M.Zuiko lens data

- [ ] 5.1 **Port the 11 existing entries** from `panasonic/data.js` verbatim
  (optic fields + `prices.USD` must match exactly — group 6 enforces it), then
  apply the 1.5 verdict on `omsystem-25mm-f18`.
- [ ] 5.2 **The 8 missing PRO lenses** from task 1.2 — full T1 specs from
  explore.omsystem.com.
- [ ] 5.3 **Remaining current Premium / standard primes and zooms** to reach the
  ~30 target.
- [ ] 5.4 Build `LENS_DROPDOWN_GROUPS` (`── M.Zuiko PRO ──`, `── M.Zuiko
  Primes ──`, `── M.Zuiko Zooms ──`); every lens in exactly one group.
  `npm run test:data` after each batch.

## 6. Shared-mount guard (land with the first ported lens)

- [ ] 6.1 Add `['panasonic', 'olympus', 'Micro Four Thirds']` to
  `SAME_MOUNT_BRANDS` in `tests/data/shared-mount.test.js`.
- [ ] 6.2 Run it and drive the disagreement list to zero. Treat every diff as a
  real question — which file is right? — not as something to paper over. This is
  the pass that catches a stale price or a wrong barrel dimension.

## 7. Third-party MFT lenses (owner-approved into this change)

- [ ] 7.1 Port Panasonic's **28 current Lumix G / Leica DG** lenses as
  third-party entries; `manufacturer: 'Panasonic'`, group
  `── LUMIX G (MFT) ──` (split Primes/Zooms if it reads long).
- [ ] 7.2 Port the remaining **6 MFT third parties** — Sigma ×3, Laowa ×2,
  Voigtländer ×1 — into `── Sigma (MFT) ──` and
  `── Laowa & Voigtländer (MFT) ──`.
- [ ] 7.3 Re-run group 6; the shared set is now ~45 ids. `npm run test:data`.

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
