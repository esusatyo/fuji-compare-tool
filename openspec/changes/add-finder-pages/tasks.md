One commit per task, each ending with `npm test` green. One PR, targeting `main`.

## Resume here (read first in a new session)

- Branch `add-finder-pages`, worktree `.claude/worktrees/finder-pages` (symlink `node_modules` to the primary checkout's). Check `git log --oneline main..HEAD` and `git status` before anything else: the last commit names the last finished task; uncommitted work belongs to the first unticked task.
- Tick a task in the same commit that finishes it. If a task is left half done, write what is done and what is next under "Progress notes" at the bottom and commit that too (a `WIP <task id>` commit is fine).
- Record every owner decision in "Decisions" below the moment it is given.
- Not pushed and no PR until the owner asks. The owner merges. Every PR targets `main`.

## Decisions

Settled by the owner (2026-11-16):
- Camera finder at `/cameras/`.
- Both cameras and lenses are in this change.
- Preset pages ship now and are configured in `SITE_CONFIG.finderPresets`.
- Prices in all seven currencies, never converted; an item with no price in the selected currency is hidden, and the page says so.
- Discontinued items hidden by default, with a switch to show them.

Owner said "execute the plan now" (2026-11-16) without answering these, so the build follows the recommendations below. Each is listed in the PR for the owner to confirm or change:
- "Hidden" for a missing price applies only while a price filter or price sort is active (task 2.2).
- Lens finder at `/lenses/`; one PR for both (task 3.1).
- Focal length filter uses the full-frame equivalent (task 3.2).
- The six camera presets listed in design.md; no lens presets at launch (task 4.1).

## 0. Before starting

- [x] 0.1 Open decisions: building on the recommendations (see Decisions); owner confirms in PR review

## 1. Shared module

- [x] 1.1 `finder.js`: field definitions for cameras and lenses, `sensorFormat`, `isAutofocus`, `matches`, `compare`, `parseState` / `formatState`; `tests/logic/finder.test.js` (every camera classifies, every lens classifies, each filter, range overlap, price rule per currency, grammar round-trip, bad input dropped)

## 2. Camera finder

- [x] 2.1 Generator: `cameras/index.html` with every camera as a row, controls, head, canonical, sitemap entry, stale-file removal; `tests/data/finder-pages.test.js` (every camera once, links resolve, attributes match the data)
- [ ] 2.2a Browser side of `finder.js`: filtering, sorting, result count, empty state, discontinued switch; `tests/logic/finder-page.test.js` (jsdom)
- [ ] 2.2b URL state (read on load and on hashchange, written on change)
- [ ] 2.2c Currency selector, price column, and the "hidden: no price" note
- [ ] 2.3 "Compare these" for 2–4 ticked rows → `/compare/#…`
- [ ] 2.4 Styles in `engine.css` (after the main RESPONSIVE block for phone rules), both themes; phone layout with a collapsible filter panel

## 3. Lens finder

- [x] 3.1 Generator: `lenses/index.html` from `KitBuilder.catalogue()`, each lens once, linked to its brand page; tests as 2.1
- [ ] 3.2 Lens controls (mount, maker, type, focal range, aperture, filter thread, autofocus); jsdom tests
- [ ] 3.3 Measure the page's size and load on a throttled profile; record the numbers in the PR

## 4. Presets

- [ ] 4.1 `SITE_CONFIG.finderPresets` with the six camera presets and an empty lens list; generator validation (throws on unknown key/sort, duplicate or reserved slug, empty result)
- [ ] 4.2 Generate `/cameras/<slug>` pages, link them from `/cameras/`, sitemap; tests (rows equal `Finder.matches` over the data, order equals the sort, a preset added in a test fixture produces a page)

## 5. Site wiring

- [ ] 5.1a Homepage card(s) and footer links on every page (`engine.js` footer, `about.html`, `privacy.html`, generator templates)
- [ ] 5.1b Share cards `og/cameras.png` + `og/lenses.png` (presets reuse them); needs Chrome
- [ ] 5.2 Usage events and the `privacy.html` list
- [ ] 5.3 `CLAUDE.md` (architecture entry, how to add a preset, new-brand checklist if anything changes)

## 6. Verify

- [ ] 6.1 `npm test`, `npm run test:links`, `openspec validate add-finder-pages --strict`
- [ ] 6.2 Screenshots at desktop and 390 px, both themes; PR with the open risks listed
- [ ] 6.3 After merge: verify live, owner real-phone check, ask before any Search Console indexing request, archive this change

## Progress notes

Add dated notes here for anything a later session must know: half-finished tasks, surprises, things tried that failed.

- 2026-11-16: the engine keeps no stored currency (it defaults to AUD on every load), so the finder does not share a storage key with it as design.md first said. The finder defaults to USD (the static HTML is in USD, like the mount pages) and keeps the chosen currency in the URL (`cur=`).
- 2026-11-16: sensor formats are `medium-format`, `full-frame`, `aps-h`, `aps-c`, `four-thirds`, `1-inch`, `small` (the Olympus TG compacts' 1/2.3"). The Four Thirds *sensor* is labelled "Four Thirds", not "Micro Four Thirds" (that is the mount).
- 2026-11-16: 2.1 and 3.1 were done in one commit: the shared footer links both finders, and the link test fails while either page is missing.
- 2026-11-16: rows carry `data-id` plus one packed `data-f` attribute (field order in `Finder.FIELDS`), the name comes from the link text, and the camera compare checkboxes are added by the script. Sizes: `/cameras/` 101 KB (15 KB gzip), `/lenses/` 488 KB (66 KB gzip), above the 300 KB estimate.
- 2026-11-16: "Viewfinder" = `evfType` set, or a Leica M's `focusingSystem: 'Rangefinder'`. Data problem found, not fixed here (needs owner approval per verify-specs): Fujifilm X-T100 and X-T200 have no `evfType` although both have an EVF, so the finder lists them as having no viewfinder.
- 2026-11-16: cameras have a separate `lens` filter (interchangeable / fixed) and `mount` filter; a mount choice matches interchangeable bodies only, because fixed-lens cameras carry their system's mount id (X100 → `x`, Olympus TG → `mft`).
