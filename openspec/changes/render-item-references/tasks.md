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

- [ ] 5.1 Implement the generator's own `collectReferences(item)` — same behavior as engine.js's, Node-side
- [ ] 5.2 In `vsPageHTML()` (same-brand) and `crossVsPageHTML()` (cross-brand), append a References `<tbody>` to the existing `vs-card` table: one row per reference kind, one `<td>` per camera column, same link attributes/truncation as task 3.4/3.5
- [ ] 5.3 Add `data-goatcounter-click`/`data-goatcounter-title` to vs-page reference links matching the `reference-click:<kind>:<hostname>` convention
- [ ] 5.4 Run `node scripts/generate-seo.js`, commit regenerated output

## 6. Tests

- [x] 6.1 Logic tier: References section renders last, 4 labelled rows, "—" for empty cells, no collapse toggle/behavior, Product-page fallback + dedup, multi-entry stacking, title fallback, safe link attributes, reference-click tracking (`tests/logic/references.test.js` + `tests/logic/analytics.test.js`) — engine.js side done; generator-side escaping covered when task 5 lands (generate-seo.js already runs everything through `esc()`)
- [x] 6.2 Logic tier: compare page mixing brands shows each slot's own references independent of the others
- [ ] 6.3 Logic tier: parity test — `engine.js`'s and `generate-seo.js`'s collectors return identical output for the same sample items (pull a few real items per brand covering: full coverage, zero-`specSources` coverage, Commons `imageCredit`, spec-source-equals-product-url)
- [ ] 6.4 `npm run test:links` — record any newly-checked spec/price/image source URLs that fail; do not fix in this change (list them in the PR description as follow-up leads)

## 7. Skill doc updates (groundwork for next sweep)

- [ ] 7.1 `refresh-camera-data` skill: instruct citations to include `title` going forward
- [ ] 7.2 `check-prices-and-buy-links` skill: same, for `priceSource`
- [ ] 7.3 `add-thirdparty-lenses` skill: same, for `specSources`/`priceSource`/`imageSource` on new entries

## 8. Verify

- [ ] 8.1 `npm test` green (data + logic tiers)
- [ ] 8.2 Browser check via preview server: a brand page, the 4-slot compare page, and one vs-page, each in light and dark theme and at phone width (~400px) — confirm truncation, "—" cells, always-expanded section, and clickable links
- [ ] 8.3 `openspec validate render-item-references --strict` passes
