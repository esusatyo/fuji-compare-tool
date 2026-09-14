## Why

Every camera/lens can already carry `specSources`, `priceSource`, and `imageSource`/`imageCredit` citation objects (added in PR #32, validated by `tests/helpers/schema.js`), but nothing on the site renders them. Readers currently have no way to verify a spec, price, or photo against where it came from. The data model is in place and partially populated (Fujifilm/Nikon/Canon have real citations; Panasonic/Sigma/Sony are sparse) — this change adds the missing display layer, on both the interactive comparison pages and the static vs-pages, using `productUrl` (always present) as a guaranteed fallback so every item shows at least one reference today. Coverage will keep growing in future refresh/price-check sweeps; this change only adds the rendering and the `title` field those sweeps will start filling in.

## What Changes

- Add an optional `title` field to the shared citation schema (`{url, tier, note, date}` → `+title`) in `tests/helpers/schema.js`. `note` remains internal research text and is never rendered.
- Add a `collectReferences(item)` helper (in `engine.js`, mirrored in `scripts/generate-seo.js` since the generator cannot import the browser script) that returns four fixed rows — **Spec source**, **Price source**, **Image source**, **Product page** — each a de-duplicated list of `{text, url}`, with `productUrl` used as the Product page row and as a fallback so no row set is ever completely empty.
- Render a **References** section on interactive pages (`engine.js`'s `renderTable()`): last section in the spec table, using the existing `spec-section`/`spec-row` markup so it inherits collapse styling, mobile slot behavior, and per-brand "—" handling on the compare page — but starts (and stays) expanded, with no collapse toggle.
- Render a **References** block inside the existing `vs-card` table on same-brand and cross-brand static vs-pages (`scripts/generate-seo.js`), as an additional `<tbody>` below the spec rows — not a separate card.
- Style long reference links with CSS text-overflow ellipsis (`min-width:0` + `overflow:hidden`) so long URLs truncate visually but remain fully clickable, with the full URL in `title=` for hover.
- Track reference clicks via `trackEvent('reference-click:<kind>:<hostname>', ...)` on interactive pages and `data-goatcounter-click` on vs-pages; add the event to `privacy.html`'s list of counted events.
- Regenerate all vs-pages via `node scripts/generate-seo.js`.
- Update the `refresh-camera-data`, `check-prices-and-buy-links`, and `add-thirdparty-lenses` skills to record a `title` on every new citation going forward.

## Capabilities

### New Capabilities
- `item-references`: the citation `title` field, the four-row reference collection/dedup/fallback logic, and its rendering on both interactive pages and static vs-pages.

### Modified Capabilities
(none — no existing requirement's behavior changes; this only adds a new section/row set to the table)

## Impact

- `tests/helpers/schema.js` — citation schema gains `title`.
- `engine.js` / `engine.css` — new `collectReferences()`, References section rendering, `.ref-link` styling, `trackEvent` calls.
- `scripts/generate-seo.js` — generator-side reference collector + `<tbody>` block on same-brand and cross-brand vs-page templates; regenerated output for every brand's vs-pages.
- `privacy.html` — one new line documenting the `reference-click` event.
- `.claude/skills/refresh-camera-data/`, `.claude/skills/check-prices-and-buy-links/`, `.claude/skills/add-thirdparty-lenses/` — citation-writing guidance gains `title`.
- Tests: new logic-tier coverage for the collector/rendering (both engine and generator, checked for parity), new data-tier coverage for `title`, and `test:links` gains spec/price/image source URLs to check (any it finds dead are reported, not fixed, per this change's scope).
