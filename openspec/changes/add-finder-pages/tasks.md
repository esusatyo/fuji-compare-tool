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

Assumed, not yet confirmed (confirm before the task that depends on it):
- "Hidden" for a missing price applies only while a price filter or price sort is active (task 2.2).
- Lens finder at `/lenses/`; one PR for both (task 3.1).
- Focal length filter uses the full-frame equivalent (task 3.2).
- The six camera presets listed in design.md; no lens presets at launch (task 4.1).

## 0. Before starting

- [ ] 0.1 Owner answers the open decisions: focal length basis (equivalent vs engraved), the six camera presets, whether any lens presets ship

## 1. Shared module

- [ ] 1.1 `finder.js`: field definitions for cameras and lenses, `sensorFormat`, `isAutofocus`, `matches`, `compare`, `parseState` / `formatState`; `tests/logic/finder.test.js` (every camera classifies, every lens classifies, each filter, range overlap, price rule per currency, grammar round-trip, bad input dropped)

## 2. Camera finder

- [ ] 2.1 Generator: `cameras/index.html` with every camera as a row, controls, head, canonical, sitemap entry, stale-file removal; `tests/data/finder-pages.test.js` (every camera once, links resolve, attributes match the data)
- [ ] 2.2a Browser side of `finder.js`: filtering, sorting, result count, empty state, discontinued switch; `tests/logic/finder-page.test.js` (jsdom)
- [ ] 2.2b URL state (read on load and on hashchange, written on change)
- [ ] 2.2c Currency selector, price column, and the "hidden: no price" note
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

- [ ] 5.1a Homepage card(s) and footer links on every page (`engine.js` footer, `about.html`, `privacy.html`, generator templates)
- [ ] 5.1b Share cards `og/cameras.png` + `og/lenses.png` (presets reuse them); needs Chrome
- [ ] 5.2 Usage events and the `privacy.html` list
- [ ] 5.3 `CLAUDE.md` (architecture entry, how to add a preset, new-brand checklist if anything changes)

## 6. Verify

- [ ] 6.1 `npm test`, `npm run test:links`, `openspec validate add-finder-pages --strict`
- [ ] 6.2 Screenshots at desktop and 390 px, both themes; PR with the open risks listed
- [ ] 6.3 After merge: verify live, owner real-phone check, ask before any Search Console indexing request, archive this change

## Progress notes

(Empty. Add dated notes here for anything a later session must know: half-finished tasks, surprises, things tried that failed.)
