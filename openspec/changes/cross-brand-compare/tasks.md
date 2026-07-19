## 1. Registry refactor (zero behavior change)

- [x] 1.1 Grep-audit engine.js, scripts/generate-seo.js, and tests for every bare brand-global read (`BRAND_CONFIG`, `SERIES_COLORS`, `CAMERAS`, `CAMERA_ORDER`, `DROPDOWN_GROUPS`, `LENSES`, `LENS_DROPDOWN_GROUPS`, `REGISTERED_BRANDS`) and list the touch points
- [x] 1.2 Wrap all five `<brand>/data.js` files in the registry IIFE (first/last lines only; data bodies byte-identical — verify with `git diff --stat`)
- [x] 1.3 Update `engine.js` to resolve the active brand's dataset from `window.BRAND_DATA` (single entry on brand pages); move `MODE_CONFIG` construction from top-level eval into init
- [x] 1.4 Update `tests/helpers/load-brand.js` to the registry shape; keep brand auto-discovery working
- [x] 1.5 Update `scripts/generate-seo.js` data loading to the registry (reuse the load-brand helper if practical); regenerate and confirm output is byte-identical (`git diff --exit-code` on generated files)
- [x] 1.6 Run `npm test` — full tier-1 + tier-2 suite green with no assertion changes

## 2. Registry tests

- [ ] 2.1 Tier-1: registry-shape test — each brand registers exactly the eight dataset keys under its slug and leaks no bare globals when evaluated
- [ ] 2.2 Tier-1: multi-load test — evaluate all five data.js files in one jsdom context in shuffled order; five intact entries, no throw
- [ ] 2.3 Tier-1: schema check that no camera slug contains `:`

## 3. Engine cross-brand mode

- [ ] 3.1 Add `COMPARE_CONFIG` detection and cross-brand init path (merged brand-grouped dropdown groups, namespaced `<brand>:<slug>` ids, neutral header/hero from COMPARE_CONFIG, no lens toggle, no brand switcher writes to `localStorage['brand']`)
- [ ] 3.2 Per-item brand resolution: item lookup, `SERIES_COLORS` placeholder styling, and Amazon-search Buy fallback using the owning brand's name
- [ ] 3.3 Generalize slots to 2–4: pure `effectiveSlots(choice, width)` helper, generated slot cells (drop hardcoded `slot-3-hide` triple), `--num-slots` CSS for 4 columns, slot-count control on the compare page, resize re-clamp preserving choice
- [ ] 3.4 Cross-brand section visibility: brand-tagged section renders when any selected camera's brand matches; foreign cells render "—" and are excluded from `computeWinners`
- [ ] 3.5 Hardening pass: every spec `fn` (all brands' brand-tagged specs included) returns safely on cameras missing its fields
- [ ] 3.6 Compare-page hash: write `#cameras=<brand>:<slug>,…` with the user's chosen count via `replaceState`; parse on init to restore slot count (clamp [2,4]) and selection with per-slot fallback; no hash rewrite during init

## 4. Compare page + entry points

- [ ] 4.1 Create `compare/index.html`: neutral accent, inline `COMPARE_CONFIG` (hero copy, default selection e.g. `fujifilm:x-t5, sony:a7-iv, canon:eos-r6-iii`, slot bounds), loads engine.css → site-config.js → all five data.js → engine.js; verify from `file://` and the local server
- [ ] 4.2 Add compare-page SEO head block (title, meta description, canonical) via generate-seo.js and add `/compare/` to the sitemap
- [ ] 4.3 Entry points: "All brands" compare card on the landing page (generator-owned), cross-brand link on every brand page, compare page links back to brand pages
- [ ] 4.4 Manual preview pass at 1200px / 700px / 500px: 4-slot layout, mobile clamp, section dashes, winner colors, buy links

## 5. Compare-page tests (tier 2, jsdom)

- [ ] 5.1 Test scaffolding: helper that assembles a compare-page DOM with all five brands + COMPARE_CONFIG
- [ ] 5.2 Render tests: default render; cross-brand duplicate prevention; 4-slot render; brand-grouped dropdowns
- [ ] 5.3 Slot-count tests: unit tests for `effectiveSlots`; jsdom resize clamp to 2 and restore to choice
- [ ] 5.4 Section tests: brand-tagged section appears/disappears with matching camera; "—" in foreign cells; one-camera-from-each-brand renders every brand section without throwing
- [ ] 5.5 Winner/price tests: cross-brand winner highlighting; discontinued + priceIncomplete items from different brands side by side with non-USD currency; no mismatched currency symbols
- [ ] 5.6 Buy-link test: ASIN-less camera's Buy href is an Amazon search containing the owning brand's name
- [ ] 5.7 Hash tests: write/parse round-trip incl. slot count; per-slot fallback on bad brand prefix and bad slug; count clamping; `history.length` unchanged; clean visit leaves URL clean
- [ ] 5.8 Regression: full existing suite still green (`npm test`)

## 6. Cross-brand SEO pages

- [ ] 6.1 Curate `CROSS_BRAND_MATCHUPS` (~60–100 pairs spanning all five brands, price-peer and segment-peer matchups); document selection rationale in a comment
- [ ] 6.2 Generator: emit `vs/<brandA>-<slugA>-vs-<brandB>-<slugB>.html` reusing the vs-page template with both brand names in title/meta/JSON-LD and CTA to `../compare/#cameras=…`; fail hard on unresolvable matchup entries
- [ ] 6.3 Interlinking: cross-brand pages in sitemap.xml and the landing-page cluster; related-comparisons block on each page links to sibling cross-brand and same-brand vs-pages (no orphans)
- [ ] 6.4 Tests: tier-1 matchup validation (every entry resolves, no duplicate pairs, both sides different brands); generated-output checks (file exists per matchup, CTA hash well-formed, sitemap contains each page, no orphan pages)
- [ ] 6.5 Regenerate all SEO output, run `npm test`, spot-check three generated pages in the browser

## 7. Wrap-up

- [ ] 7.1 Update CLAUDE.md (registry invariant replaces the bare-globals description; compare page in architecture list) and the add-camera-brand skill if it references the old data.js shape
- [ ] 7.2 `openspec validate cross-brand-compare --strict` passes; run link tests (`npm run test:links`) once before the PR that ships generated pages
