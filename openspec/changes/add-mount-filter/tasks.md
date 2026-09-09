Worked on one branch (`add-mount-filter`) and shipped as **one PR**. Each group ends in a **Checkpoint**: run the stated gate, commit, and only then tick the boxes above it. A box is ticked when the work is done and its gate passed — never in advance.

## 1. Mount declarations

- [x] 1.1 Add `BRAND_CONFIG.mounts` to all six brands — fujifilm `x`/`g`, panasonic `l`/`mft`, sigma `l`/`sa`, canon `rf`, nikon `z`, sony `e` — each entry `{ id, label }`
- [x] 1.2 Keep `BRAND_CONFIG.mount` as the landing-tile display string, with a comment naming the split of duties between it and `mounts` (see design decision 3)
- [x] 1.3 Leave `scripts/generate-seo.js` untouched — the tile copy must not move
- [x] 1.4 Update `tests/data/config.test.js` — keep the `mount` string assertions, add `mounts` array shape checks (non-empty, unique ids, each entry has `id` and `label`)
- [x] 1.5 Split Panasonic's `── Lumix Box (cinema / live event) ──` group into an L-Mount group (`bs1h`) and a Micro Four Thirds group (`bgh1`)
- [x] **Checkpoint A** — `npm test` green **and** `node scripts/generate-seo.js` produces no diff (`git status` clean for generated files). Commit: *"Declare BRAND_CONFIG.mounts beside the landing-tile mount string"*

## 2. Per-item mount data

- [x] 2.1 Write a throwaway seeding script in the scratchpad (not committed) that derives each camera's mount from `sensorType` and each lens's from its dropdown group, and inserts a `mount:` token into all six data files
- [x] 2.2 Run it, then prove mechanically that nothing else moved: stripping every inserted `mount:'…', ` token from each file reproduces the HEAD version byte-for-byte (stronger than reading 810 near-identical diff hunks, and far cheaper)
- [x] 2.3 Hand-check the judgement calls: `x100vi`, `x-half` and the X100 line → `x`; `gfx100rf` → `g`; `l10` → `mft`; `bs1h` → `l`; `bgh1` → `mft`; both `sd-quattro` bodies → `sa`; every Canon RF-S lens → `rf` (same mount, not a separate one)
- [x] **Checkpoint B** — `npm test` green (tests don't require the field yet, so this only proves nothing broke). Commit: *"Record the mount on every camera and lens"*

## 3. Tier 1 tests

- [x] 3.1 Add `mount` validation to `tests/helpers/schema.js` — required on every camera and lens, must be an id declared in the brand's `mounts`
- [x] 3.2 Create `tests/data/mounts.test.js`: every declared mount id is used by at least one item, and every item resolves to a declared id
- [x] 3.3 Add the per-group agreement test — every dropdown group's members share one mount, in all six brands
- [x] 3.4 Add the camera re-derivation test — `mount` must agree with what `sensorType` implies, using the mapping in design decision 6
- [x] 3.5 Sanity-check the guards actually bite: temporarily mistype one camera's mount and one lens's group, confirm each named failure, then revert
- [x] **Checkpoint C** — `npm run test:data` green with no engine changes yet. Commit: *"Add Tier 1 guards for per-item mounts"*

## 4. Engine: chip row and filtering

- [x] 4.1 Add `mountsForMode(mode)` — declared mounts having ≥1 item in that mode; returns empty when fewer than two qualify
- [x] 4.2 Add `activeMount` state (default `null` = All) and `itemsInMount(mode, id)` honouring dropdown order
- [x] 4.3 Render the chip row in `injectBody()` inside `#compare-header` above the slot pickers — `role="group"`, `aria-pressed` buttons, matching the mode/theme toggle idiom; omit the element entirely when `mountsForMode()` is empty
- [x] 4.4 Filter `buildSelectHTML()` by `activeMount`, dropping optgroups that end up empty
- [x] 4.5 Implement the auto-swap rule on chip activation — replace out-of-mount slots with the first free in-mount item in dropdown order, leave in-mount slots untouched, no-op on `All`
- [x] 4.6 Call the existing `updateHash()` after a swap so the new selection stays shareable
- [x] 4.7 On mode toggle, keep `activeMount` when it qualifies in the destination mode, otherwise reset to `All`; re-render the chip row for the new mode
- [x] **Checkpoint D** — `npm test` green; manual pass on `python3 scripts/preview.py 3456` over Panasonic and Fujifilm (both tabs) and Canon (confirm nothing moved). Commit: *"Add the mount filter chip row to brand pages"*

## 5. Engine: single-slot rendering

The riskiest group — it touches the slot-count path that PR #51 already found sharp edges in. Kept separate so it can be reviewed and reverted on its own.

- [x] 5.1 Clamp the effective slot count to the number of items the active mount offers, floor of 1, without disturbing the existing viewport clamp — **pulled forward into group 4**: Sigma's SA-Mount has 2 cameras against a 3-slot layout, so without the clamp the third slot keeps an L-Mount camera the filter claims to have excluded. Correctness today, not future-proofing
- [x] 5.2 Suppress winner highlighting in `computeWinners()` when only one slot renders
- [x] 5.3 Restore the user's chosen slot count when the filter returns to `All`
- [x] 5.4 Handle the "Cameras to compare" select while a single-item mount is active — it must not offer a count the filter cannot fill
- [x] 5.5 Add the one-column grid case to `engine.css` (`--num-slots: 1`) — **no change needed**: the grid is already `repeat(var(--num-slots), 1fr)`, which collapses to one column on its own. Verified rather than assumed
- [x] **Checkpoint E** — `npm test` green; manually verify by temporarily filtering a brand to a one-item mount (no real one exists, so drive it from a scratchpad fixture). Commit: *"Render a single-slot table when a mount offers one item"*

## 6. Styling

- [ ] 6.1 Style the chip row in `engine.css` using existing design tokens; active chip mirrors `.mode-btn.active`
- [ ] 6.2 Verify wrapping and tap-target size below the 600px breakpoint, where the table is clamped to 2 slots
- [ ] 6.3 Check both themes (dark-neutral default and light "Lavender & Sand")
- [ ] **Checkpoint F** — visual pass on the preview server at desktop and mobile widths, both themes. Commit: *"Style the mount filter chip row"*

## 7. Tier 2 tests

- [ ] 7.1 jsdom: chip row present for Fujifilm/Panasonic/Sigma, absent for Canon/Nikon/Sony and for `compare/`
- [ ] 7.2 jsdom: activating a chip restricts every slot dropdown to that mount
- [ ] 7.3 jsdom: auto-swap replaces out-of-mount slots, preserves in-mount ones, produces no duplicate selection, and updates the hash
- [ ] 7.4 jsdom: Sigma lenses tab renders no chip row; Sigma cameras tab renders both chips
- [ ] 7.5 jsdom: mode toggle carries the active mount when it qualifies and falls back to `All` when it does not
- [ ] 7.6 jsdom: single-slot rendering — one slot, `--num-slots: 1`, no winner classes, slot count restored on `All`
- [ ] **Checkpoint G** — `npm test` green. Commit: *"Add Tier 2 coverage for the mount filter"*

## 8. Docs

- [ ] 8.1 Rewrite CLAUDE.md's "no `mount` field" paragraph — describe the `mount` field, why the one-brand-one-mount reasoning no longer holds, and the "one group, one mount" invariant
- [ ] 8.2 Note in CLAUDE.md's "Adding / changing things" that every new camera or lens records its `mount`, and that `BRAND_CONFIG` declares `mounts` (not a `mount` string)
- [ ] 8.3 Update `add-camera-brand`, `add-thirdparty-lenses` and `refresh-camera-data` so research records the mount at entry time
- [ ] **Checkpoint H** — re-read CLAUDE.md's data-model section end to end for contradictions with the new field. Commit: *"Document the mount field and record it during research"*

## 9. Ship

- [ ] 9.1 `npm test` green
- [ ] 9.2 `RUN_LINK_TESTS=1 npm run test:links` — no URLs changed in this work, so this is a regression check only
- [ ] 9.3 `node scripts/generate-seo.js` produces no diff
- [ ] 9.4 `openspec validate add-mount-filter --strict`
- [ ] 9.5 Final manual pass: all six brands, both tabs, both themes, desktop and mobile widths
- [ ] **Checkpoint I** — open one PR from `add-mount-filter` covering the whole change
