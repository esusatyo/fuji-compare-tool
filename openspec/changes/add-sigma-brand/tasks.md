# Tasks — Add Sigma Brand

> **Resumability:** work top-to-bottom. Each numbered group is an independent,
> committable batch ending in a test checkpoint. If a session is interrupted,
> resume at the first unchecked `- [ ]`. A partially-entered dataset stays green
> as long as **each entered item is complete**. Commit after each green
> checkpoint; ship the whole thing as **one PR** at group 10.
>
> **Execution constraints (owner, 2026-09-07):** everything below ships in a
> **single PR**, and work runs **at most one agent at a time** — no parallel
> subagents, no parallel worktrees. Data-entry batches are sequential even
> though cameras and lenses look independent; a past isolated-worktree run
> produced a stale-baseline mess, and serial batches keep every checkpoint
> against the true current tree.

## 1. Research & source the Sigma lineup

- [x] 1.1 Enumerate every digital camera Sigma has released, then scope to
  non-DSLR bodies → **18** in `research/cameras.md` (L-Mount ×3, Foveon
  mirrorless ×2, dp Quattro ×4, DP Merrill ×3, DP Compact ×6). The six SA-mount
  DSLRs are excluded and the reasoning is recorded there and in design §1.
- [x] 1.2 Enumerate the L-Mount first-party lens catalogue → `research/lenses.md`
  (46 current catalogue entries; 22 already in `panasonic/data.js`, ~14 new
  full-frame DG, ~10 APS-C DC pending mount confirmation, plus discontinued
  predecessors).
- [x] 1.3 Fix entry conventions — series labels, slugs, Sigma field set, Foveon
  MP convention, pricing/image rules → `research/decisions.md`.
- [x] 1.4 **Confirm L-Mount availability per lens** for group B in
  `research/lenses.md`, on each lens's own sigma-global.com product page. Record
  the verdict inline; drop anything that is E/X-only. (Group C is out of scope —
  see 7.3.) → **all 13 confirmed L-Mount + Sony E**, specs captured 2026-09-07.
- [x] 1.5 Re-verify the 22 ported entries against the live catalogue → **all 22
  still listed** in Sigma's current catalogue; none fabricated, none dropped.
  Per-entry spec re-check still happens at port time (task 7.1).

## 2. Schema and scope prerequisites

- [x] 2.1 Lower the camera `year` floor in `tests/helpers/schema.js` from
  `min: 2010` to `min: 2008`, matching the lens floor already in that file
  (design §2).
- [x] 2.2 Add **negative tests for `schema.js`** — `tests/data/schema-guards.test.js`.
  Nothing currently asserts the schema *rejects* anything, so the floor change in
  2.1 is invisible to the suite and a bug in `checkField` itself would be silent.
  Assert `validateCamera`/`validateLens` return errors for: a `year` below the
  floor (2007) and above the ceiling (2028); a missing required field; a `null`
  in a non-nullable field; a wrong-typed field; a `type` outside
  `['Prime','Zoom']`; a zoom whose `focalLengthMin` ≥ `focalLengthMax`; a
  non-positive USD price; a malformed `asin`. Assert a known-good fixture
  returns **zero** errors, so the tests can't pass by rejecting everything.
- [x] 2.3 `npm test` — still green with no Sigma data yet.

> The L-Mount APS-C 1.5× crop rule for CLAUDE.md is **no longer needed** — it
> existed only for the `DC` lenses dropped in 7.3. Re-add it if group C is ever
> picked up.

## 3. Scaffold the Sigma brand directory

- [x] 3.1 `cp panasonic/index.html sigma/index.html`; update `<title>`
  ("Sigma Camera & Lens Comparison").
- [x] 3.2 Create `sigma/data.js` from `panasonic/data.js`, keeping the registry
  IIFE wrap; set the key to `window.BRAND_DATA['sigma']`. Fill `BRAND_CONFIG`
  and `SERIES_COLORS` per `research/decisions.md`; leave `CAMERAS`, `CAMERA_ORDER`,
  `DROPDOWN_GROUPS`, `LENSES`, `LENS_DROPDOWN_GROUPS` empty.
- [x] 3.3 `node --check sigma/data.js`.

## 4. Wire registration, engine section and schema (before bulk data)

- [x] 4.1 Add `{ slug: 'sigma', name: 'Sigma' }` to `REGISTERED_BRANDS` in **all
  six** `data.js` files (identical sets — `config.test.js` enforces).
- [x] 4.2 Add `'sigma'` to `VALID_BRANDS` in the root `index.html`.
- [x] 4.3 Add `<script src="../sigma/data.js"></script>` to `compare/index.html`,
  before `engine.js`.
- [x] 4.4 Add a `[sigma]` case to `tests/logic/root-redirect.test.js`.
- [x] 4.5 Add the `brand: 'sigma'` "Foveon & L-Mount" section to `SPEC_SECTIONS`
  in `engine.js` — rows for `foveonGen`, `shutterType`, `internalStorage`, `lLog`.
- [x] 4.6 Add the `brandSections.includes('sigma')` branch to
  `tests/helpers/schema.js` validating those four fields.
- [x] 4.7 Add `BRAND_CARD_ACCENTS['sigma']` in `scripts/generate-seo.js`.
- [x] 4.8 `MANUFACTURER_COLORS` — confirm the existing `'Sigma'` entry is
  reused as-is; **no change expected**.
- [x] 4.9 `npm test` green (empty-but-wired brand).

## 5. Camera data — batch 1: current L-Mount (first green checkpoint)

> Needs ≥4 cameras before the picker-dedup test is satisfiable, so this batch
> runs to 5 bodies. `defaultSelected: ['bf', 'fp-l', 'fp']`.

- [x] 5.1 `fp` scope question resolved 2026-09-07 — **the `fp` is in**, entered as
  a normal body despite its box/cinema leanings.
- [x] 5.2 Enter `bf`, `fp-l`, `fp` with all 7 currencies, full specs, `asin`,
  `productUrl`, `imageUrl`, and the four Sigma fields.
- [x] 5.3 Enter `sd-quattro`, `sd-quattro-h` (discontinued, USD-only allowed).
- [x] 5.4 Update `CAMERA_ORDER` + `DROPDOWN_GROUPS`; `npm run test:data`.

## 6. Camera data — batch 2: Foveon fixed-lens compacts — DEFERRED

> **Deferred to a follow-up change (owner decision 2026-09-07).** The 13
> fixed-lens Foveon compacts could not be sourced to the two-source bar without
> heavy per-body digging: imaging-resource.com, ephotozine.com and
> cameradecision.com all 403 automated fetches, and Wikipedia lacks `maxBurst`,
> `batteryLife` and launch USD for most of them — all required fields.
>
> The two `sd Quattro` bodies **were** kept, against the original deferral,
> because the engine needs three `defaultSelected` cameras and the picker-dedup
> test needs a fourth outside that set: a brand page cannot render with three.
> Both are fully sourced from Sigma's own spec pages plus DPReview.

- [ ] 6.1 Enter the 4 dp Quattro bodies (`dp0`–`dp3`).
- [ ] 6.2 Enter the 3 DP Merrill bodies.
- [ ] 6.3 Enter the 6 original DP compacts (`dp1`, `dp1s`, `dp1x`, `dp2`,
  `dp2s`, `dp2x`) — `dp1`/`dp2`/`dp1s` are pre-2010 and depend on task 2.1.
- [ ] 6.4 Update `CAMERA_ORDER` + `DROPDOWN_GROUPS`; `npm run test:data`.
- [ ] 6.5 Checkpoint: all **18** cameras entered, `CAMERA_ORDER` matches
  `CAMERAS` exactly, every camera in exactly one dropdown group.

## 7. Lens data

- [x] 7.1 Port the 22 existing L-Mount entries from `panasonic/data.js`
  (verbatim; see design §5), regrouped into first-party Art/Contemporary/Sports
  dropdown groups. `npm run test:data`.
- [x] 7.2 Enter the ~14 new full-frame `DG` lenses confirmed L-Mount in 1.4.
  `npm run test:data`.
- [x] 7.3 APS-C `DC` L-Mount lenses — **skipped** (decision 2026-09-07): no Sigma
  body is APS-C L-Mount, so they'd only serve a Leica CL/TL owner. Deferred, not
  rejected; see `research/lenses.md` group C.
- [x] 7.4 Add discontinued predecessors (`research/lenses.md` group D).
- [ ] 7.5 Add the **same-mount drift guard** — `tests/data/shared-mount.test.js`.
  For any lens slug present in both `panasonic/data.js` and `sigma/data.js`
  (both L-Mount, one physical product), assert the two entries agree on their
  mount-invariant fields: `name`, `manufacturer`, `line`, `type`, focal lengths,
  `maxAperture`/`minAperture`, `elements`, `groups`, `blades`, `weight`,
  `length`, `diameter`, `filterThread`, `afType`, `weatherSealed`, `ois`, `year`.
  Drive it off a declared `SAME_MOUNT_BRANDS = [['panasonic','sigma','L-Mount']]`
  table so a future L/MFT-sharing brand is one line. Prices, `asin` and URLs are
  compared as a **warning list**, not a failure — they are sourced separately.
- [x] 7.6 Checkpoint: every lens in exactly one `LENS_DROPDOWN_GROUPS` entry;
  `defaultSelected` resolves.

## 8. Images, pricing and ASINs

- [x] 8.1 `node scripts/fetch-images-commons.js sigma cameras` **without**
  `--apply`; eyeball the map, then re-run with `--apply`.
- [x] 8.2 Populate `KNOWN_IMAGE_GAPS['sigma']` for anything unresolved; run
  `node scripts/verify-images.js sigma`.
- [x] 8.3 Clear `priceIncomplete` on ported lenses, then
  `node scripts/compute-prices.js sigma lenses --recompute`; put confirmed
  regional figures in `scripts/price-overrides/sigma.json`.
- [ ] 8.4 Backfill `asin`s via the **check-prices-and-buy-links** skill.

## 9. Link & ASIN hygiene

> These tasks belong to the **`expand-correctness-tests`** change and are
> delivered early here, because this PR is the one that creates same-mount
> duplicate URLs and ASINs. That change's remaining scope (rendered-output
> sweep, placeholder integrity, data plausibility, the network link checker)
> stays open and is **not** part of this PR. Run these *after* group 8 so they
> see the final URLs and ASINs.

- [x] 9.1 Add `tests/data/links-offline.test.js`: every `imageUrl`/`productUrl`
  parses with `new URL()`, is `https`, and its host is in `ALLOWED_HOSTS`.
  There is no `buyUrl` in the data — do not test for one.
- [x] 9.2 Assert every `imageUrl` path ends with a known image extension.
- [x] 9.3 Assert no `imageUrl`/`productUrl` is shared by two ids **within one
  brand**, minus a reviewed `KNOWN_SHARED_LINKS` allowlist. Do **not** compare
  across brands (98 legitimate cross-brand duplicates). Seed the allowlist from
  the 6 existing within-brand pairs after reviewing each. All 6 reviewed
  2026-09-07 and all are legitimate — including the Nikon 7Artisans 25/35/50mm
  trio, which 7Artisans sells as ONE listing with variants; the shared photo is
  the maker's official family shot of all three barrels (confirmed visually).
- [x] 9.4 Assert entries sharing an `asin` agree on `manufacturer` and have
  closely-similar `name`s (Amazon parent listings legitimately carry mount
  variants, so sharing is allowed — describing a different product is not).
- [x] 9.5 Ratchet ASIN coverage: assert the count of non-discontinued items
  lacking an `asin` stays at or below a recorded baseline (56 of 670 on
  2026-09-07; this PR should lower it).
- [~] 9.6 Retire the stale `buyUrl` capability specs — REMOVED/ADDED deltas are
  authored in `openspec/changes/expand-correctness-tests/specs/`; OpenSpec applies
  them to `openspec/specs/` at archive time, not before merge. — the REMOVED deltas for
  `brand-engine`'s "Buy button disabled when no URL provided" and
  `canon-eos-r`'s "Buy button handling for Canon items", plus the ADDED
  `brand-engine` requirement describing the real per-currency/ASIN behaviour.

## 10. Verify, ship, close out

- [ ] 10.1 `node scripts/generate-seo.js` (or let the pre-commit hook do it).
- [ ] 10.2 `npm test` fully green.
- [ ] 10.3 `RUN_LINK_TESTS=1 npm run test:links` — **required**, URLs changed.
- [ ] 10.4 Manual pass on `python3 scripts/preview.py 3456` → `/sigma/`:
  dropdown groups, brand switch in/out, currency switching, winner
  highlighting, the Foveon section, Buy links, and `/compare/` cross-brand
  with a Sigma body selected.
- [ ] 10.5 `openspec validate add-sigma-brand --strict` **and**
  `openspec validate expand-correctness-tests --strict`.
- [ ] 10.6 Open **one** PR covering everything above.
- [ ] 10.7 After merge: archive `add-sigma-brand` (`/opsx:archive`); tick the
  delivered tasks in `expand-correctness-tests` and leave it open for its
  remaining scope; propose the follow-up `add-thirdparty-lenses-sigma`
  (Panasonic, Leica, Samyang, Viltrox, Laowa L-Mount).
