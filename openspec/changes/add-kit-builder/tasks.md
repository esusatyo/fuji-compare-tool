## 1. Kit maths (`kit.js`)

- [x] 1.1 `kit.js`: lens catalogue (mount match, shared-mount de-duplication, browse groups), `takesLenses`, `sanitize`
- [x] 1.2 `priceView`, `totals`, `focalRange`, `filterSizes`, `verdict`
- [x] 1.3 `parseHash` / `formatHash`
- [x] 1.4 `tests/logic/kit.test.js` covering 1.1–1.3 against real brand data

## 2. The page

- [x] 2.1 `kit/index.html` loader (`COMPARE_CONFIG.kit`), `kit.js` before `engine.js`
- [x] 2.2 `engine.js`: kit mode — state, render, picker hooks, URL state, events
- [x] 2.3 `engine.css`: kit layout (two columns at every width), winner highlight, both themes
- [x] 2.4 `tests/logic/kit-page.test.js` (jsdom): pick body, add/remove lens, totals, fallback note, fixed-lens body, hash round trip

## 3. Generator and links

- [ ] 3.1 `generate-seo.js`: head and body blocks for `kit/index.html`, sitemap entry
- [ ] 3.2 Homepage card beside "Compare camera sizes"; footer link on every page
- [ ] 3.3 `tests/data/kit-page.test.js`; regenerate

## 4. Analytics, privacy, docs

- [ ] 4.1 Events + `analytics.js` grammar; `privacy.html`
- [ ] 4.2 `CLAUDE.md`, `add-camera-brand` skill (add `data.js` to `kit/index.html`)

## 5. Verify and ship

- [ ] 5.1 `npm test`, `npm run test:links`, `openspec validate add-kit-builder --strict`
- [ ] 5.2 Browser check (desktop, 390px frame, both themes)
- [ ] 5.3 PR; ask the owner for a real-device check
