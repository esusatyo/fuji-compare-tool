## Context

The tool is a zero-dependency static site. A shared `engine.js` + `engine.css`
render any brand whose `<brand>/data.js` defines a fixed set of globals
(`BRAND_CONFIG`, `SERIES_COLORS`, `CAMERAS`, `CAMERA_ORDER`, `DROPDOWN_GROUPS`,
`LENSES`, `LENS_DROPDOWN_GROUPS`, `REGISTERED_BRANDS`). Four brands ship today —
`fujifilm/`, `canon/`, `sony/`, and `nikon/`. The root `index.html` is a
redirector that sends visitors to a brand directory based on
`localStorage['brand']`.

Tests are two-tier: **Tier 1 (data)** auto-discovers every brand directory via
`brandDirs()` and validates each against `tests/helpers/schema.js`; **Tier 2
(logic)** loads brands into jsdom and exercises engine behaviour (winners,
currency, pickers, buy-links, root redirect). Brand-specific camera fields are
validated conditionally by `brandSections.includes('<slug>')` in `schema.js`,
and brand-specific spec sections in `engine.js` carry a `brand: '<slug>'` tag
that is only rendered when the slug is in `BRAND_CONFIG.brandSections`.

This change adds Panasonic as a fifth brand with a dataset spanning **two
systems** — full-frame L-mount (Lumix S) and Micro Four Thirds (Lumix G/GH) —
covering current + notable discontinued bodies and first-party lenses, by
following the reusable `add-camera-brand` skill.

## Goals / Non-Goals

**Goals:**
- Panasonic renders, compares, switches, and prices identically to existing
  brands through the unchanged engine and UI.
- Panasonic data is accurate: every RRP, spec, `productUrl`, `asin`, and
  `imageUrl` cross-checked against ≥2 reputable sources before entry.
- The full test suite (`npm test`) stays green, with Panasonic covered by the
  auto-discovered data tests plus new Panasonic-specific validation.
- The work is **resumable in small batches** so it survives token limits.

**Non-Goals:**
- No engine/UI redesign; no new currencies; no change to existing brands' data
  beyond adding Panasonic to their `REGISTERED_BRANDS`.
- No third-party L-mount Alliance lenses (Sigma/Leica) and no third-party MFT
  lenses (Olympus/OM, Sigma, Voigtländer) — first-party Panasonic LUMIX glass
  only (both LUMIX S for L-mount and LUMIX G for MFT).
- No Four Thirds (original 4/3 DSLR) bodies or lenses — mirrorless MFT only.
- No change to the default brand (first-time visitors still land on Canon).
- Live network link-checking remains opt-in (`RUN_LINK_TESTS`).

## Decisions

### D1: Self-contained `panasonic/data.js` cloned from the `canon/` template
Canon/Sony/Nikon are the closest analogues (interchangeable-lens, multiple
formats, same field shape). We copy the file structure and replace data.
**Alternative:** factor shared config into a common module — rejected, it would
break the "each brand is one standalone browser script" invariant the
loader/tests rely on.

### D2: Panasonic-specific spec section + schema fields
Add one `brand: 'panasonic'` section to `engine.js` `SPEC_SECTIONS`, and
validate the new camera fields in `schema.js` under
`brandSections.includes('panasonic')`. Section id `'panasonic'`, label
"Panasonic Video", with these Panasonic-distinctive rows (chosen so they don't
duplicate universal fields — base sections already show `processor`,
`logVideo`, and `subjectDetection`):
- `vLog` (string|null) — V-Log / V-Log L gamma support ("V-Log"/"V-Log L"/null).
- `dualNativeIso` (boolean) — Dual Native ISO sensor technology.
- `openGate` (string|null) — Open Gate (full-sensor) max capture ("6.4K"/"5.8K")
  or `null` if unsupported.
- `proResInternal` (boolean) — internal Apple ProRes / ProRes RAW recording.

Mirrors Fuji's `filmSims`/`xApp`, Canon's `dpafPoints`/`clogTiers`, Sony's
`logProfile`/`aiAf`, and Nikon's `nRaw`/`pixelShift`. The section is
render-gated, so it appears only on Panasonic pages.

### D3: Registration wired in all brands (the test enforces parity)
`config.test.js` asserts every brand's `REGISTERED_BRANDS` lists the same slugs
and that each slug has a directory. So Panasonic must be added to
`fujifilm/data.js`, `canon/data.js`, `sony/data.js`, `nikon/data.js`, **and**
`panasonic/data.js`, and `'panasonic'` added to `VALID_BRANDS` in the root
`index.html`. A new `MANUFACTURER_COLORS['Panasonic']` entry in `engine.js`
gives Panasonic lenses a branded placeholder card.

### D4: Series & dropdown grouping (two mounts)
`series` values drive `SERIES_COLORS` and grouping. Proposed Panasonic series:
`'Lumix S (Full-frame)'`, `'Lumix GH (MFT)'`, `'Lumix G (MFT)'`.
`DROPDOWN_GROUPS` grouped by system/era like Canon's. Lens
`manufacturer:'Panasonic'`, `line` ∈ {`'LUMIX S'` (L-mount FF),
`'LUMIX G'` (MFT)}, `type` ∈ {`'Prime'`,`'Zoom'`}. MFT lens `focalLengthEquiv`
uses the 2.0× crop factor; L-mount lenses are full-frame native. Accent colour =
Lumix/Panasonic blue (`#0046ad`) on a near-black hero (`#0a1530`).

### D5: Data sourcing & pricing
USD = exact current US list price (RRP). Non-USD currencies: use confirmed
regional RRP where found, else derive via `scripts/compute-prices.js` ratios and
mark `priceIncomplete: true` where a real figure is still missing. Discontinued
bodies may carry `null` for non-USD currencies. Images prefer Wikimedia Commons
(stable https), sourced/verified via `scripts/fetch-images-commons.js` +
`verify-images.js`. ASINs looked up on Amazon US (model codes like `DC-S5M2`,
`DC-GH7`); Buy links are generated per-currency by the engine from `asin`
(no `buyUrl`).

### D6: Resumability via batched tasks
Because the dataset is large (two mounts) and tokens are limited, `tasks.md` is
split into small, independently-committable batches (scaffold → wiring →
schema/engine → camera batches by system/line → lens batches by mount/line →
images → tests). Each batch ends with `npm test` (or `test:data`) as a
checkpoint, so an interrupted session can resume at the first unchecked task
with no lost context. Commit after each green checkpoint.

## Risks / Trade-offs

- **[Inaccurate specs/prices across ~50+ items spanning two mounts]** → Enforce
  ≥2-source cross-check per datum; lean on `schema`/`completeness`/`referential`
  tests to catch shape errors; mark unverified regional prices `priceIncomplete`.
- **[Two-mount complexity — MFT crop math, mixed formats]** → MFT lenses use a
  fixed 2.0× `focalLengthEquiv`; `series`/`line` cleanly separate L-mount vs MFT
  in dropdowns; sensor `format` distinguishes bodies.
- **[`REGISTERED_BRANDS` drift breaks `config.test.js`]** → Single task updates
  all five brand files together; checkpoint test immediately after.
- **[Missing brand-field validation lets bad Panasonic data through]** → Add
  Panasonic branch to `schema.js` in the same batch that introduces the fields.
- **[Token exhaustion mid-dataset]** → Batched, checkpointed `tasks.md` (D6);
  partial Panasonic data still passes tests as long as each entered item is
  complete.
- **[Image hotlinks rot]** → Prefer Wikimedia Commons; `imageUrl` is nullable
  (engine falls back to a coloured placeholder card; gaps allowlisted in
  `KNOWN_IMAGE_GAPS.panasonic`).

## Migration Plan

Purely additive. Deploy = ship the new/edited static files. Rollback = delete
`panasonic/` and revert the `REGISTERED_BRANDS` / `index.html` / `engine.js` /
`schema.js` edits; existing brands are unaffected. No data migration.

## Open Questions

- Final exact Panasonic-field set for the brand section (D2) — resolved during
  apply once specs are gathered; schema + engine + section land in one batch.
- Exact comprehensive body/lens membership list across both mounts — enumerated
  by the research task (`research/`) and reviewed before bulk data entry.
