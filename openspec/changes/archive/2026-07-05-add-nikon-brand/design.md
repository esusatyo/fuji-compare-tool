## Context

The tool is a zero-dependency static site. A shared `engine.js` + `engine.css`
render any brand whose `<brand>/data.js` defines a fixed set of globals
(`BRAND_CONFIG`, `SERIES_COLORS`, `CAMERAS`, `CAMERA_ORDER`, `DROPDOWN_GROUPS`,
`LENSES`, `LENS_DROPDOWN_GROUPS`, `REGISTERED_BRANDS`). Three brands ship today —
`fujifilm/`, `canon/`, and `sony/`. The root `index.html` is a redirector that
sends visitors to a brand directory based on `localStorage['brand']`.

Tests are two-tier: **Tier 1 (data)** auto-discovers every brand directory via
`brandDirs()` and validates each against `tests/helpers/schema.js`; **Tier 2
(logic)** loads brands into jsdom and exercises engine behaviour (winners,
currency, pickers, buy-links, root redirect). Brand-specific camera fields are
validated conditionally by `brandSections.includes('<slug>')` in `schema.js`,
and brand-specific spec sections in `engine.js` carry a `brand: '<slug>'` tag
that is only rendered when the slug is in `BRAND_CONFIG.brandSections`.

This change adds Nikon as a fourth brand with a **comprehensive** Z-mount dataset
(~14+ bodies incl. discontinued, ~30–45 first-party Z lenses) by following the
reusable `add-camera-brand` skill.

## Goals / Non-Goals

**Goals:**
- Nikon renders, compares, switches, and prices identically to existing brands
  through the unchanged engine and UI.
- Nikon data is accurate: every RRP, spec, `productUrl`, `asin`, and `imageUrl`
  cross-checked against ≥2 reputable sources before entry.
- The full test suite (`npm test`) stays green, with Nikon covered by the
  auto-discovered data tests plus new Nikon-specific validation.
- The work is **resumable in small batches** so it survives token limits.

**Non-Goals:**
- No engine/UI redesign; no new currencies; no change to existing brands' data
  beyond adding Nikon to their `REGISTERED_BRANDS`.
- No F-mount DSLRs and no F-to-Z adapted (FTZ) lenses — Z-mount mirrorless only.
- No third-party (Sigma/Tamron/Viltrox) Z-mount lenses in this change.
- No change to the default brand (first-time visitors still land on Canon).
- Live network link-checking remains opt-in (`RUN_LINK_TESTS`).

## Decisions

### D1: Self-contained `nikon/data.js` cloned from the `canon/` template
Canon/Sony are the closest analogues (interchangeable-lens, full-frame + APS-C,
same field shape). We copy the file structure and replace data. **Alternative:**
factor shared config into a common module — rejected, it would break the
"each brand is one standalone browser script" invariant the loader/tests rely on.

### D2: Nikon-specific spec section + schema fields
Add one `brand: 'nikon'` section to `engine.js` `SPEC_SECTIONS`, and validate the
new camera fields in `schema.js` under `brandSections.includes('nikon')`.
Section id `'nikon'`, label "Nikon Imaging", with these Nikon-distinctive rows
(chosen so they don't duplicate universal fields — base sections already show
`processor`, `logVideo`/N-Log, and `subjectDetection`):
- `expeed` (string|null) — EXPEED processor generation ("EXPEED 7"/"EXPEED 6").
- `nRaw` (string|null) — internal N-RAW max resolution ("8.3K"/"6K") or none.
- `pixelShift` (string|null) — High-Res Pixel Shift max output ("96MP"/"180MP").
- `preCapture` (boolean) — Pre-Release Capture (C30/C120 pre-burst).

Mirrors Fuji's `filmSims`/`xApp`, Canon's `dpafPoints`/`clogTiers`, and Sony's
`logProfile`/`aiAf`/`realtimeTracking`. The section is render-gated, so it
appears only on Nikon pages.

### D3: Registration wired in all brands (the test enforces parity)
`config.test.js` asserts every brand's `REGISTERED_BRANDS` lists the same slugs
and that each slug has a directory. So Nikon must be added to `fujifilm/data.js`,
`canon/data.js`, `sony/data.js`, **and** `nikon/data.js`, and `'nikon'` added to
`VALID_BRANDS` in the root `index.html`. A new `MANUFACTURER_COLORS['Nikon']`
entry in `engine.js` gives Nikon lenses a branded placeholder card.

### D4: Series & dropdown grouping
`series` values drive `SERIES_COLORS` and grouping. Proposed Nikon series:
`'Z (Full-frame)'`, `'Z (APS-C)'`, `'Z (Retro)'` (Zf / Zfc). `DROPDOWN_GROUPS`
grouped by era/line like Canon's. Lens `manufacturer:'Nikon'`,
`line` ∈ {`'S-Line'`, `'NIKKOR Z'` (non-S FX), `'DX'`}, `type` ∈
{`'Prime'`,`'Zoom'`}. Accent colour = Nikon yellow (`#ffd200`) on a near-black
hero (`#1a1700`).

### D5: Data sourcing & pricing
USD = exact current US list price (RRP). Non-USD currencies: use confirmed
regional RRP where found, else derive via `scripts/compute-prices.js` ratios and
mark `priceIncomplete: true` where a real figure is still missing. Discontinued
bodies may carry `null` for non-USD currencies. Images prefer Wikimedia Commons
(stable https), sourced/verified via `scripts/fetch-images-commons.js` +
`verify-images.js`. ASINs looked up on Amazon US; Buy links are generated
per-currency by the engine from `asin` (no `buyUrl`).

### D6: Resumability via batched tasks
Because the dataset is large and tokens are limited, `tasks.md` is split into
small, independently-committable batches (scaffold → wiring → schema/engine →
camera batches by line → lens batches by line → images → tests). Each batch ends
with `npm test` (or `test:data`) as a checkpoint, so an interrupted session can
resume at the first unchecked task with no lost context.

## Risks / Trade-offs

- **[Inaccurate specs/prices across ~50 items]** → Enforce ≥2-source cross-check
  per datum; lean on `schema`/`completeness`/`referential` tests to catch shape
  errors; mark unverified regional prices `priceIncomplete`.
- **[`REGISTERED_BRANDS` drift breaks `config.test.js`]** → Single task updates
  all four brand files together; checkpoint test immediately after.
- **[Missing brand-field validation lets bad Nikon data through]** → Add Nikon
  branch to `schema.js` in the same batch that introduces the fields.
- **[Token exhaustion mid-dataset]** → Batched, checkpointed `tasks.md` (D6);
  partial Nikon data still passes tests as long as each entered item is complete.
- **[Image hotlinks rot]** → Prefer Wikimedia Commons; `imageUrl` is nullable
  (engine falls back to a coloured placeholder card; gaps allowlisted in
  `KNOWN_IMAGE_GAPS.nikon`).

## Migration Plan

Purely additive. Deploy = ship the new/edited static files. Rollback = delete
`nikon/` and revert the `REGISTERED_BRANDS` / `index.html` / `engine.js` /
`schema.js` edits; existing brands are unaffected. No data migration.

## Open Questions

- Final exact Nikon-field set for the brand section (D2) — resolved during apply
  once specs are gathered; schema + engine + section land in one batch.
- Exact comprehensive body/lens membership list — enumerated by the research
  task (`research/`) and reviewed before bulk data entry.
