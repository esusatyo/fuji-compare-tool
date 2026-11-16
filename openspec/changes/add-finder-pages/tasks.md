One commit per task, each ending with `npm test` green. One PR, targeting `main`.

## 0. Before starting

- [ ] 0.1 Owner answers the open decisions: focal length basis (equivalent vs engraved), the six camera presets, whether any lens presets ship

## 1. Shared module

- [ ] 1.1 `finder.js`: field definitions for cameras and lenses, `sensorFormat`, `isAutofocus`, `matches`, `compare`, `parseState` / `formatState`; `tests/logic/finder.test.js` (every camera classifies, every lens classifies, each filter, range overlap, price rule per currency, grammar round-trip, bad input dropped)

## 2. Camera finder

- [ ] 2.1 Generator: `cameras/index.html` with every camera as a row, controls, head, canonical, sitemap entry, stale-file removal; `tests/data/finder-pages.test.js` (every camera once, links resolve, attributes match the data)
- [ ] 2.2 Browser side of `finder.js`: filtering, sorting, result count, discontinued switch, URL state, currency selector and the "hidden: no price" note; `tests/logic/finder-page.test.js` (jsdom)
- [ ] 2.3 "Compare these" for 2–4 ticked rows → `/compare/#…`
- [ ] 2.4 Styles in `engine.css` (after the main RESPONSIVE block for phone rules), both themes; phone layout with a collapsible filter panel

## 3. Lens finder

- [ ] 3.1 Generator: `lenses/index.html` from `KitBuilder.catalogue()`, each lens once, linked to its brand page; tests as 2.1
- [ ] 3.2 Lens controls (mount, maker, type, focal range, aperture, filter thread, autofocus); jsdom tests
- [ ] 3.3 Measure the page's size and load on a throttled profile; record the numbers in the PR

## 4. Presets

- [ ] 4.1 `SITE_CONFIG.finderPresets` with the six camera presets and an empty lens list; generator validation (throws on unknown key/sort, duplicate or reserved slug, empty result)
- [ ] 4.2 Generate `/cameras/<slug>` pages, link them from `/cameras/`, sitemap; tests (rows equal `Finder.matches` over the data, order equals the sort, a preset added in a test fixture produces a page)

## 5. Site wiring

- [ ] 5.1 Homepage card(s), footer links on every page, `og/cameras.png` + `og/lenses.png` (presets reuse them)
- [ ] 5.2 Usage events and the `privacy.html` list
- [ ] 5.3 `CLAUDE.md` (architecture entry, how to add a preset, new-brand checklist if anything changes)

## 6. Verify

- [ ] 6.1 `npm test`, `npm run test:links`, `openspec validate add-finder-pages --strict`
- [ ] 6.2 Screenshots at desktop and 390 px, both themes; PR with the open risks listed
- [ ] 6.3 After merge: verify live, owner real-phone check, ask before any Search Console indexing request, archive this change
