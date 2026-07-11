## 1. Engine: hash read/write

- [x] 1.1 Add `parseHash()` to engine.js: parse `#<mode>` / `#<mode>=<slugs>` into `{ mode, ids }`, validating each slug against that mode's items with per-slot `defaultSelected[i]` fallback; tolerate partial/duplicate slugs
- [x] 1.2 Add `updateHash()`: write `#${currentMode}=${selectedIds.join(',')}` via `history.replaceState`
- [x] 1.3 Init: replace the `location.hash === '#lenses'` check with `parseHash()` — apply mode + both-mode selections before first render; do NOT write the hash on load
- [x] 1.4 Slot-change handler: call `updateHash()` after `setSelectedId`
- [x] 1.5 Mode toggle: replace inline `history.replaceState(null, '', '#' + currentMode)` with `updateHash()`
- [x] 1.6 Brand switcher: forward only the mode portion (`#` + currentMode) instead of the raw hash

## 2. Tests (Tier 2, jsdom)

- [x] 2.1 New `tests/logic/url-state.test.js` following the existing Tier 2 harness pattern (JSDOM with explicit `url:` including hash): load-with-full-hash round-trip, lens deep link, invalid-slug per-slot fallback, partial hash, legacy `#lenses`, clean visit leaves hash empty
- [x] 2.2 Same file: selection change writes hash with all 3 slugs; mode switch writes the new mode's selection; brand switcher navigation drops slugs but keeps mode
- [x] 2.3 Run `npm test` — full suite green (confirm existing pickers/root-redirect tests unaffected)

## 3. Validation & wrap-up

- [x] 3.1 `openspec validate shareable-comparison-urls --strict` passes
- [ ] 3.2 Manual smoke test via local server: share a hash URL between two browser tabs, verify round-trip and graceful fallback on a mangled slug
