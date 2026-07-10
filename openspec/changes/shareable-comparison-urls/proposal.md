## Why

A specific comparison (e.g. X-T5 vs X-T50 vs X100VI) currently has no URL — the hash only encodes the mode (`#cameras`/`#lenses`) — so users cannot share or bookmark a comparison, and upcoming SEO landing pages (launch roadmap Phase D) have no way to deep-link into a preselected comparison. This is the foundation the rest of the pre-launch SEO work builds on.

## What Changes

- Extend the URL hash to encode the full selection: `#cameras=x-t5,x-t50,x100vi` and `#lenses=<slug>,<slug>,<slug>`.
- On page load, the engine parses the hash and preselects mode + items; invalid or missing slugs fall back per-slot to the brand's `defaultSelected`.
- On every selection change and mode switch, the engine rewrites the hash via `history.replaceState` (no history spam, no navigation).
- Legacy bare hashes (`#cameras`, `#lenses`, empty) keep working exactly as today: mode only, default selection.
- Brand switcher now carries only the mode across brands (`#lenses`, not the slug list), since slugs are brand-specific and would never resolve in the target brand.
- Hash-only state — no query strings or path routing — preserving the `file://` / any-static-host invariant.
- New Tier 2 jsdom tests: hash → selection on load, selection → hash on change, invalid-slug fallback, legacy-hash compatibility.

## Capabilities

### New Capabilities
- `shareable-urls`: URL-hash encoding/decoding of the current comparison (mode + selected item slugs), so any comparison state is copy-paste shareable and deep-linkable.

### Modified Capabilities
- `brand-picker`: brand-switch navigation preserves the *mode* portion of the hash only (previously: preserved any hash fragment verbatim; selection slugs are brand-specific and must not carry over).

## Impact

- `engine.js`: STATE/INIT/EVENT LISTENERS sections — hash parse on init, `replaceState` in slot-change and mode-toggle handlers, brand-switcher hash normalization.
- `tests/logic/`: new `url-state.test.js`; existing `pickers.test.js` unaffected (default behavior unchanged).
- No changes to any `<brand>/data.js`, `engine.css`, or root `index.html`.
