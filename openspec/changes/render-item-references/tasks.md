## 1. Schema

- [x] 1.1 Add optional `title` field to `checkCitation()` in `tests/helpers/schema.js` (non-empty string when present); update the doc comment above `checkSources()` to mention it
- [x] 1.2 Add a data-tier test asserting: citation with `title` validates, citation without `title` validates, empty-string `title` is rejected

## 2. Reference collector (engine.js)

- [x] 2.1 Implement `collectReferences(item)` in `engine.js`: returns four rows (`spec`, `price`, `image`, `product`), each `{label, entries: [{text, url}]}`
- [x] 2.2 Spec row from `item.specSources[]`; Price row from `item.priceSource`; Image row from `item.imageSource`, falling back to `item.imageCredit.source`; Product row from `item.productUrl` (skip URLs ending `/cameras/`)
- [x] 2.3 `text` = citation `title` when present, else URL with scheme + leading `www.` stripped
- [x] 2.4 Dedup: drop a Spec source entry whose `url` equals `item.productUrl` (still shown once, in Product row)

## 3. Interactive-page rendering (engine.js + engine.css)

- [x] 3.1 In `renderTable()`, append a References section after all `SPEC_SECTIONS`, reusing `spec-section`/`section-header`/`section-body`/`spec-row`/`spec-value` markup
- [x] 3.2 References header renders without `.section-toggle` and without a click listener; body never receives `.collapsed`
- [x] 3.3 Each row renders one cell per visible slot; multiple entries in a cell stack as separate `.ref-link` elements; empty cell renders "—"; no `.winner` class applied
- [x] 3.4 Reference links: `target="_blank" rel="noopener nofollow" title="<full url>"`
- [x] 3.5 Add `.ref-link` CSS: `display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap`; `min-width:0` on the containing `.spec-value` for reference rows so ellipsis can take effect inside the existing grid

## 4. Analytics + privacy

- [x] 4.1 Reference link clicks call `track('reference-click:<row-kind>:<hostname>')` (interactive pages), delegated on `#compare-table`
- [x] 4.2 Updated `privacy.html`'s tracked-events and outbound-links paragraphs to mention References links

## 5. Static vs-pages (scripts/generate-seo.js)

- [x] 5.1 Implement the generator's own `collectReferences(item)` — same behavior as engine.js's, Node-side
- [x] 5.2 In `vsPageHTML()` (same-brand) and `crossVsPageHTML()` (cross-brand), append a References `<tbody>` to the existing `vs-card` table: a heading row, then one row per reference kind, one `<td>` per camera column, same link attributes/truncation as task 3.4/3.5 (`table-layout: fixed` added to `.vs-card table` so ellipsis has a bounded width to clip against)
- [x] 5.3 Add `data-goatcounter-click`/`data-goatcounter-title` to vs-page reference links matching the `reference-click:<kind>:<hostname>` convention
- [x] 5.4 Run `node scripts/generate-seo.js`, commit regenerated output (264 vs-pages written)

## 6. Tests

- [x] 6.1 Logic tier: References section renders last, 4 labelled rows, "—" for empty cells, no collapse toggle/behavior, Product-page fallback + dedup, multi-entry stacking, title fallback, safe link attributes, reference-click tracking (`tests/logic/references.test.js` + `tests/logic/analytics.test.js`) — engine.js side done; generator-side escaping covered when task 5 lands (generate-seo.js already runs everything through `esc()`)
- [x] 6.2 Logic tier: compare page mixing brands shows each slot's own references independent of the others
- [x] 6.3 Logic tier: parity test (`tests/logic/references-parity.test.js`) — engine.js's and generate-seo.js's collectors return identical output across 7 fixtures (full coverage, productUrl-only, Commons imageCredit fallback, spec-source-equals-productUrl dedup, untitled-citation fallback, /cameras/ index skip, multi-entry ordering)
- [x] 6.4 `npm run test:links` (`RUN_LINK_TESTS=1`, ~6 min against live data) — of 80 total failures, 52 are `product`/`image` kind (pre-existing, unrelated to this change, not investigated further here). The 28 newly-checked (`spec-source`/`price-source`/`image-source`) failures split into:
  - **5 confirmed dead (real 404s), not fixed per scope decision — follow-up leads for the next refresh/price-check sweep:**
    - `nikon/lens/laowa-58mm-f28-2x-macro` specSources: digitalcameraworld.com laowa-58mm review
    - `nikon/lens/laowa-10-18mm-f45-56` specSources: nikonrumors.com 2019 announcement
    - `nikon/lens/laowa-35mm-f28-tilt-shift-macro` specSources: nikonrumors.com 2025 announcement
    - `nikon/lens/laowa-55mm-f28-tilt-shift-macro` specSources: fstoppers.com review
    - `olympus/camera/tg-1` specSources: en.wikipedia.org/wiki/Olympus_Tough_TG-1
  - **23 are ETIMEDOUT/TLS errors** (17 price-source, mostly `voigtlaender.de` `UNABLE_TO_VERIFY_LEAF_SIGNATURE` + `fuji-store.de`/`x-kamera.de` ETIMEDOUT; 6 image-source, all `commons.wikimedia.org` ETIMEDOUT) — same failure signature as the documented sandbox fetch()-reachability gap in the `image-refresh-run-sep-2026` project memory (this sandbox can't reach some hosts that are fine from a real browser/network). **Not confirmed dead** — flagged for re-verification from outside this sandbox, not asserted as broken.

## 7. Skill doc updates (groundwork for next sweep)

- [x] 7.1 `refresh-camera-data` skill: instruct citations to include `title` going forward (`.claude/skills/` and `.agents/skills/` mirrors)
- [x] 7.2 `check-prices-and-buy-links` skill: same, for `priceSource` (`.claude/skills/` and `.agents/skills/` mirrors)
- [x] 7.3 `add-thirdparty-lenses` skill: same, for `specSources`/`priceSource`/`imageSource` on new entries (`.claude/skills/` and `.agents/skills/` mirrors)

## 8. Verify

- [x] 8.1 `npm test` green (data + logic tiers) — 713/713
- [x] 8.2 Browser check via preview server (worktree, port 3901): Fujifilm brand page, cross-brand compare page (mixed Fujifilm/Sony/Canon slots), a same-brand vs-page, and a cross-brand vs-page — confirmed the always-expanded References section (click-to-collapse is a no-op), "—" for empty cells, per-slot independence on the compare page, and CSS ellipsis truncation (verified with a GFX100 II selection, whose spec/price/image-source URLs are long enough to truncate even at desktop column width) in both light and dark theme. **Caveat:** could not verify at an actual ~400px phone viewport — `resize_window` in this Chrome-automation harness doesn't propagate to the rendered/screenshotted viewport (a known limitation, not new to this change: see the `chrome-automation-tab-is-hidden` project memory). The truncation CSS itself (`overflow:hidden`/`text-overflow:ellipsis`/`min-width:0`, `table-layout:fixed` on vs-pages) isn't viewport-width-dependent — it already triggers correctly on a narrow *column*, which is what a phone width also produces — but the mobile grid/stacking breakpoint (`engine.css`'s `<600px` rules) was not independently confirmed on a real narrow viewport for this section. Flagging for the user to spot-check on a real device/window before considering this fully verified.
- [x] 8.3 `openspec validate render-item-references --strict` passes
