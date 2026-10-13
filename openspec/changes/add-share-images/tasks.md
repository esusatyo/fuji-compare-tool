## 1. Spike: layout and size budget

- [x] 1.1 Add a pure `shareCardHTML(page)` to `scripts/generate-seo.js` for the vs-card only (tokens, logo lockup, names, 4 spec rows, scale silhouettes), and export it
- [x] 1.2 Render 3 sample cards (same-brand, cross-brand, a pair with a missing dimension) with a throwaway Chrome screenshot; check them by eye at full size and at a 1.91:1/square crop (pre-check 2026-10-13: a mock vs-card rendered at 54 KB, which projects to about 16.5 MB for 305 pages)
- [x] 1.3 Measure PNG sizes and project the total for about 305 pages; if it's over about 20 MB, apply the design's fallback (noindexed same-brand vs-pages use the brand card) and record the numbers in design.md

## 2. Card builders

- [x] 2.1 Finish the vs-card (brand names on cross-brand cards, silhouette omitted on missing width/height, "front, to scale" label)
- [x] 2.2 Add brand, compare and home card variants (About/Privacy reuse the home card)
- [x] 2.3 Build every page's card (`{ path, alt, html }`) inside `buildSite()` next to the page itself, reusing the existing vs/brand/trust page lists so the two can't diverge

## 3. Head tags

- [x] 3.1 Emit `og:image`, `og:image:width/height/alt`, `twitter:image` and `twitter:card=summary_large_image` from `metaBlock`, `vsPageHTML`, `crossVsPageHTML`, `identityHeadBlock` and `compareHeadBlock`
- [x] 3.2 Run `node scripts/generate-seo.js`; confirm the diff touches head blocks only

## 4. Renderer

- [x] 4.1 Write `scripts/render-share-images.js`: Chrome lookup (`CHROME_BIN` or the macOS default, error otherwise), hash each card's HTML, render missing/stale cards 4 at a time at 1200×630, delete orphans, write `og/manifest.json`
- [x] 4.2 Add `--sheet` to the renderer: writes an uncommitted contact sheet (scratch dir) showing every card at full size plus Reddit/Discord/X-style crops, and prints its path
- [x] 4.3 Run the full render, review the contact sheet, commit `og/`
- [x] 4.4 Add an `/og/*` cache rule to `_headers` (max-age 86400, stale-if-error)

## 5. Tests and hook

- [ ] 5.1 Add `tests/data/share-images.test.js`: every page's image exists, is 1200×630 (reuse the touch-icon PNG decoder), manifest hash matches, no orphan PNGs or manifest entries, no `<img>` or price in any card HTML, every PNG under 250 KB (WhatsApp reportedly drops previews over about 300 KB), tags present and absolute on every page
- [ ] 5.2 Extend `tests/data/seo.test.js` or its spec-matching assertions for the new tags where it already checks head blocks
- [ ] 5.3 Extend `.githooks/pre-commit`: after `generate-seo.js`, run the renderer if Chrome exists, stage `og/`, else skip
- [ ] 5.4 Prove the gate: change one camera's `weight` locally, rerun only the generator, and confirm `npm test` fails naming the image and command; revert
- [ ] 5.5 Update CLAUDE.md (architecture bullet for share images + the rebrand flow now also runs `render-share-images.js`); `npm test` green; `openspec validate add-share-images --strict`

## 6. Share button

- [ ] 6.1 Add the share button beside the comparison on brand pages and `compare/` (`engine.js` + `engine.css`), with native share → clipboard → read-only-field fallbacks and no browser dialogs; check placement at phone width on a real device or the owner's iPad, not only a resized desktop window
- [ ] 6.2 Report `share-link:<brand|compare>:<mode>:<native|copy>` via `trackEvent` only on success; add it to `analytics.js`'s grammar header and `privacy.html`'s list of counted interactions
- [ ] 6.3 Tier 2 jsdom tests: copy path (clipboard stub + "Link copied" state + event), native path (share stub + event), cancelled share (rejecting stub, no event), no-API fallback (field shown, no dialog), URL includes the selection hash

## 7. Ship and verify

- [ ] 7.1 Open the PR; on the Workers preview, fetch 3 image URLs directly (200, `image/png`, correct pixels). Card validators can't run against the preview, because its `og:image` tags point at production URLs that don't exist until merge, so validator checks wait for 7.2
- [ ] 7.2 After merge: check 3 production URLs (home, a brand page, a cross-brand vs-page) in a card validator and with a real paste into Discord or a Reddit post-preview; check that `share-link` events appear in GoatCounter
