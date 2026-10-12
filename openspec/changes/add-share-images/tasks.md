## 1. Spike: layout and size budget

- [ ] 1.1 Add a pure `shareCardHTML(page)` to `scripts/generate-seo.js` for the vs-card only (tokens, logo lockup, names, 4 spec rows, scale silhouettes), and export it
- [ ] 1.2 Render 3 sample cards (same-brand, cross-brand, a pair with a missing dimension) with a throwaway Chrome screenshot; check them by eye at full size and at a 1.91:1/square crop
- [ ] 1.3 Measure PNG sizes and project the total for about 305 pages; if it's over about 20 MB, apply the design's fallback (noindexed same-brand vs-pages use the brand card) and record the numbers in design.md

## 2. Card builders

- [ ] 2.1 Finish the vs-card (brand names on cross-brand cards, silhouette omitted on missing width/height, "front, to scale" label)
- [ ] 2.2 Add brand, compare, home and site card variants
- [ ] 2.3 Add `sharePages()` enumerating every generated page → `{ imagePath, alt, cardHTML }`, reusing the existing vs/brand/trust page lists so the two can't diverge

## 3. Head tags

- [ ] 3.1 Emit `og:image`, `og:image:width/height/alt`, `twitter:image` and `twitter:card=summary_large_image` from `metaBlock`, `vsPageHTML`, `crossVsPageHTML`, `identityHeadBlock` and `compareHeadBlock`
- [ ] 3.2 Run `node scripts/generate-seo.js`; confirm the diff touches head blocks only

## 4. Renderer

- [ ] 4.1 Write `scripts/render-share-images.js`: Chrome lookup (`CHROME_BIN` or the macOS default, error otherwise), hash each card's HTML, render missing/stale cards 4 at a time at 1200×630, delete orphans, write `og/manifest.json`
- [ ] 4.2 Run the full render; commit `og/`
- [ ] 4.3 Add an `/og/*` cache rule to `_headers` (max-age 86400, stale-if-error)

## 5. Tests and hook

- [ ] 5.1 Add `tests/data/share-images.test.js`: every page's image exists, is 1200×630 (reuse the touch-icon PNG decoder), manifest hash matches, no orphan PNGs or manifest entries, no `<img>` or price in any card HTML, tags present and absolute on every page
- [ ] 5.2 Extend `tests/data/seo.test.js` or its spec-matching assertions for the new tags where it already checks head blocks
- [ ] 5.3 Extend `.githooks/pre-commit`: after `generate-seo.js`, run the renderer if Chrome exists, stage `og/`, else skip
- [ ] 5.4 Prove the gate: change one camera's `weight` locally, rerun only the generator, and confirm `npm test` fails naming the image and command; revert
- [ ] 5.5 Update CLAUDE.md (architecture bullet for share images + the rebrand flow now also runs `render-share-images.js`); `npm test` green; `openspec validate add-share-images --strict`

## 6. Ship and verify

- [ ] 6.1 Open the PR; on the Workers preview, fetch 3 image URLs (200, `image/png`) and run the preview vs-page through a card validator
- [ ] 6.2 After merge: check 3 production URLs (home, a brand page, a cross-brand vs-page) in a card validator and with a real paste into Discord or a Reddit post-preview
