## Context

The tool is a zero-dependency static site. A shared `engine.js` + `engine.css`
render any brand whose `<brand>/data.js` defines a fixed set of globals
(`BRAND_CONFIG`, `SERIES_COLORS`, `CAMERAS`, `CAMERA_ORDER`, `DROPDOWN_GROUPS`,
`LENSES`, `LENS_DROPDOWN_GROUPS`, `REGISTERED_BRANDS`). Two brands ship today —
`fujifilm/` and `canon/`. The root `index.html` is a redirector that sends
visitors to a brand directory based on `localStorage['brand']`.

Tests are two-tier: **Tier 1 (data)** auto-discovers every brand directory via
`brandDirs()` and validates each against `tests/helpers/schema.js`; **Tier 2
(logic)** loads brands into jsdom and exercises engine behaviour (winners,
currency, pickers, buy-links, root redirect). Brand-specific camera fields are
validated conditionally by `brandSections.includes('<slug>')` in `schema.js`,
and brand-specific spec sections in `engine.js` carry a `brand: '<slug>'` tag
that is only rendered when the slug is in `BRAND_CONFIG.brandSections`.

This change adds Sony as a third brand with a **comprehensive** dataset (~30+
bodies incl. discontinued, ~70 first-party lenses) plus a reusable skill so the
pattern is repeatable.

## Goals / Non-Goals

**Goals:**
- Sony renders, compares, switches, and prices identically to existing brands
  through the unchanged engine and UI.
- Sony data is accurate: every RRP, spec, `productUrl`, `asin`, and `imageUrl`
  cross-checked against ≥2 reputable sources before entry.
- The full test suite (`npm test`) stays green, with Sony covered by the
  auto-discovered data tests plus new Sony-specific validation.
- A reusable `add-camera-brand` skill captures the end-to-end procedure.
- The work is **resumable in small batches** so it survives token limits.

**Non-Goals:**
- No engine/UI redesign; no new currencies; no change to existing brands' data
  beyond adding Sony to their `REGISTERED_BRANDS`.
- No third-party (Sigma/Tamron/etc.) Sony-mount lenses in this change.
- No change to the default brand (first-time visitors still land on Canon).
- Live network link-checking (`tests/links/`) remains opt-in (`RUN_LINK_TESTS`).

## Decisions

### D1: Self-contained `sony/data.js` cloned from the `canon/` template
Canon is the closest analogue (interchangeable-lens, full-frame + APS-C, same
field shape). We copy its file structure and replace data. **Alternative:**
factor shared config into a common module — rejected, it would break the
"each brand is one standalone browser script" invariant the loader/tests rely on.

### D2: Sony-specific spec section + schema fields
Add one `brand: 'sony'` section to `engine.js` `SPEC_SECTIONS`, and validate the
new camera fields in `schema.js` under `brandSections.includes('sony')`.
Proposed Sony fields (final list confirmed during apply):
- `picProfiles` (number|null) — Picture Profile / Log support count, or
  `sLog` (string|null, e.g. `'S-Log3 / S-Cinetone'`) — Log/colour science.
- `aiAf` (boolean) — dedicated AI Processing Unit / Real-time Recognition AF.
- `realTimeTracking` (boolean) — Real-time Tracking.

Mirrors Fuji's `filmSims`/`xApp` and Canon's `dpafPoints`/`clogTiers`.
**Alternative:** universal specs only — rejected by the user; Sony parity wanted.
The section is render-gated, so it appears only on Sony pages.

### D3: Registration wired in all brands (the test enforces parity)
`config.test.js` asserts every brand's `REGISTERED_BRANDS` lists the same slugs
and that each slug has a directory. So Sony must be added to
`fujifilm/data.js`, `canon/data.js`, **and** `sony/data.js`, and `'sony'` added
to `VALID_BRANDS` in the root `index.html`. A new `MANUFACTURER_COLORS['Sony']`
entry in `engine.js` gives Sony lenses a branded placeholder card.

### D4: Series & dropdown grouping
`series` values drive `SERIES_COLORS` and grouping. Proposed Sony series:
`'Alpha (Full-frame)'`, `'Alpha (APS-C)'`, `'Cinema Line'`, `'ZV (Vlog)'`.
`DROPDOWN_GROUPS` grouped by era/line like Canon's. Lens `manufacturer:'Sony'`,
`line` ∈ {`'FE GM'`, `'FE G'`, `'FE'`, `'E'`}, `type` ∈ {`'Prime'`,`'Zoom'`}.

### D5: Data sourcing & pricing
USD = exact current US list price (RRP). Non-USD currencies: use confirmed
regional RRP where found, else derive via `scripts/compute-prices.js` ratios and
mark `priceIncomplete: true` where a real figure is still missing (Canon
precedent). Discontinued bodies may carry `null` for non-USD currencies. Images
prefer Wikimedia Commons (stable https), sourced/verified via
`scripts/fetch-images.js` + `verify-images.js`. ASINs looked up on Amazon US;
Buy links are generated per-currency by the engine from `asin` (no `buyUrl`).

### D6: Resumability via batched tasks
Because the dataset is large and tokens are limited, `tasks.md` is split into
small, independently-committable batches (scaffold → wiring → schema/engine →
camera batches by series → lens batches by line → images → tests → skill).
Each batch ends with `npm test` (or `test:data`) as a checkpoint, so an
interrupted session can resume at the first unchecked task with no lost context.

## Risks / Trade-offs

- **[Inaccurate specs/prices across ~100 items]** → Enforce ≥2-source
  cross-check per datum; lean on `schema.test.js`/`completeness.test.js`/
  `referential.test.js` to catch shape errors; mark unverified regional prices
  `priceIncomplete`. Spot-check a sample with the link tests.
- **[`REGISTERED_BRANDS` drift breaks `config.test.js`]** → Single task updates
  all three brand files together; checkpoint test immediately after.
- **[Missing brand-field validation lets bad Sony data through]** → Add Sony
  branch to `schema.js` in the same batch that introduces the fields.
- **[Token exhaustion mid-dataset]** → Batched, checkpointed `tasks.md` (D6);
  partial Sony data still passes tests as long as each entered item is complete.
- **[Image hotlinks rot / disallow embedding]** → Prefer Wikimedia Commons;
  `imageUrl` is nullable (engine falls back to a coloured placeholder card).

## Migration Plan

Purely additive. Deploy = ship the new/edited static files. Rollback = delete
`sony/` and revert the `REGISTERED_BRANDS` / `index.html` / `engine.js` /
`schema.js` edits; existing brands are unaffected. No data migration.

## Open Questions

- Final exact Sony-field set for the brand section (D2) — resolved during apply
  once specs are gathered; schema + engine + section land in one batch.
- Exact comprehensive body/lens membership list — enumerated as the first apply
  task (research checklist) and reviewed before bulk data entry.
