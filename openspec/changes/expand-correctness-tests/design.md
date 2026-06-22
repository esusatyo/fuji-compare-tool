## Context

The harness loads each brand's `data.js` (and optionally `engine.js`) into jsdom via `helpers/load-brand.js`, exposing data globals as cloned JSON and engine globals live. Tests auto-iterate `brandDirs()`. Existing tiers: Tier 1 data (`tests/data/`), Tier 2 logic (`tests/logic/`), Tier 3 links (`tests/links/`, stubbed and opt-in). `helpers/dom.js` drives the engine through real DOM events; `helpers/schema.js` holds field validators.

Key facts that shape the new tests:
- The compare table is built by `renderTable()`; each spec cell is `formatVal(spec, item)`, which already maps `null`/`undefined`/false to an em-dash/cross. A leaked literal `"undefined"`/`"NaN"` therefore means a spec `fn` returned a bad value (e.g. string concatenation over a missing field), not a missing null-guard in the renderer.
- Images are remote Wikimedia/retailer URLs rendered by `buildPlaceholder()` as `<img ... onerror=SVG fallback>`; when `imageUrl` is absent an SVG placeholder is rendered using `seriesColor()` / `MANUFACTURER_COLORS`.
- `imageUrl`/`buyUrl`/`productUrl` are optional and only schema-checked as "https string"; nothing checks host, extension, or duplication.

## Goals / Non-Goals

**Goals:**
- Catch defects visible to users: bad rendered text, unresolved icons/placeholders, wrong/duplicated links, implausible prices, residual placeholder text.
- Keep the default `npm test` fast, deterministic, and offline.
- Make the network link suite genuinely functional but opt-in and non-flaky-by-default (cached, warn-not-fail on anti-bot statuses).
- Auto-cover every brand with zero per-brand wiring, matching existing suites.

**Non-Goals:**
- No production/UI behaviour changes; tests only.
- No attempt to make network link checks part of CI gating.
- No image pixel/visual-regression testing — markup and reference validity only, not rendered appearance.
- Not fixing any data defects the new tests surface — those are follow-up edits.

## Decisions

### Rendered-output sweep drives the real engine
For each brand, load with `{ engine: true }`, then for cameras (and again for lenses via `clickMode`) set each slot through every item id using `setSlot` and read `#compare-table` `textContent`. Assert it contains none of `undefined`, `null`, `NaN`, `[object Object]`. To keep runtime bounded, iterate all items across the three slots in batches rather than rendering every 3-item permutation (a per-item pass through one slot exercises every `fn(item)`).

*Alternative considered:* call each `spec.fn(item)` directly without rendering. Rejected — it would miss `fmt`/`formatVal` integration and the boolean/em-dash mapping, which is exactly where display bugs live. Driving the DOM tests the real path.

### Empty-cell check rides the same render pass
After rendering, assert every `.spec-value` cell has non-empty trimmed text (the em-dash counts as content). Catches a `fn` that returns `''`.

### Placeholder/icon test calls the render path, not internals
Assert via the rendered slot DOM: when `imageUrl` is set the slot contains an `<img class="cam-photo">` with non-empty `alt`; otherwise it contains a `.cam-placeholder` with a resolved background colour. This re-uses `seriesColor`/`MANUFACTURER_COLORS` through the engine rather than reaching into them.

### Offline link hygiene uses `new URL()` + a shared domain allowlist
A new `helpers/link-policy.js` exports `ALLOWED_HOSTS` (suffix match: wikimedia/wikipedia, amazon TLDs, manufacturer + known retailer domains) and a `kindOf`/extension helper. Tests parse every URL with `new URL()` (catches malformed), assert host suffix ∈ allowlist, assert `imageUrl` path ends in `.jpg|.jpeg|.png|.webp|.gif|.svg`, and build maps to detect a URL reused across different product ids. `buyUrl` presence is required only for non-discontinued items. The allowlist is intentionally a suffix allowlist so subdomains/regional TLDs pass; adding a new retailer is a one-line edit.

*Alternative considered:* regex-validate URLs. Rejected — `new URL()` is the correct parser and gives host/pathname for free.

### Price plausibility uses lenient ratio bands keyed to USD
With `prices.USD` as the anchor, assert each present non-null currency falls inside a band (e.g. JPY 60×–220×, EUR/GBP/CAD/AUD/SGD 0.5×–2.5× — bands chosen wide enough to never flag legitimate regional pricing, narrow enough to catch a decimal slip or a USD value pasted into JPY). Bands live as a small table in the test with a comment explaining the intent and how to widen them.

*Risk-aware choice:* bands are deliberately generous; the goal is catching order-of-magnitude mistakes, not auditing FX accuracy.

### Network checker: HEAD→GET with cache, warn-not-fail
Implement `checkUrl(url, kind)` in the existing `tests/links/links.test.js` scaffold: `fetch` HEAD first, fall back to GET on 405/501, realistic `User-Agent`, ~8s `AbortController` timeout, small concurrency cap. Results cached to `tests/links/.link-cache.json` (gitignored) with a TTL so reruns are cheap. Apply the file's documented policy: `404/410` fail; `403/429/503` warn; images must return `Content-Type: image/*`. Stays behind `RUN_LINK_TESTS=1`.

## Risks / Trade-offs

- **Render sweep runtime grows with catalogue size** → Single-slot pass per item (O(items)), not permutations; batch and reuse one loaded window per brand/mode. Keep an eye on total `npm test` time.
- **Domain allowlist needs maintenance when a new retailer is added** → Suffix-match keeps it short; a failure names the offending host so the fix is obvious (add one suffix). Acceptable, and it's the point — an unexpected host should be reviewed.
- **Price bands could false-positive on a genuinely unusual price** → Bands are wide and documented; a real outlier can be widened or the item allowlisted, mirroring the `KNOWN_IMAGE_GAPS` pattern already in the repo.
- **Network suite flakiness** → Off by default, cached, warns on anti-bot statuses; never gates CI. No change to default `npm test` reliability.
- **A new test may surface an existing data defect** → That's the intended value; the fix is a separate data edit, and the test documents the expectation.

## Migration Plan

Purely additive test code. Add new spec files + helper(s); implement the existing link stub. Add `tests/links/.link-cache.json` to `.gitignore`. No rollback complexity — revert the new files. If a new offline test fails on current data, either fix the data or, for a documented exception, add an allowlist entry following the existing `KNOWN_IMAGE_GAPS` convention.

## Open Questions

- Exact membership of `ALLOWED_HOSTS` — seed from the hosts currently present in both brands' data; expand as needed.
- Final price-band multipliers — start lenient, tighten only if they prove too loose to catch real mistakes.
