## Context

`engine.js` keeps comparison state in module-scope variables (`currentMode`, `selectedCameraIds`, `selectedLensIds` — engine.js:330–332). The URL hash today carries only the mode: init reads `location.hash === '#lenses'` (engine.js:687), the mode toggle writes `#${currentMode}` via `history.replaceState` (engine.js:648), and the brand switcher forwards the raw hash to the target brand page (engine.js:655–657). Selection changes (engine.js:624–628) never touch the URL. Both selection arrays always hold 3 slugs even when the responsive layout shows 2 slots (`numSlots`).

Constraints: hash-only state (site must work from `file://` and any static host, no server routing); each brand page is a standalone script, slugs are brand-local; no new dependencies; Tier 2 tests run in jsdom.

## Goals / Non-Goals

**Goals:**
- Every comparison state (mode + 3 selected slugs) has a copy-pasteable URL.
- Loading such a URL reproduces the comparison exactly.
- Malformed/unknown hashes degrade gracefully to defaults — never a broken page.
- Legacy `#cameras` / `#lenses` URLs keep their current meaning.
- Deep-link target format for the future vs-page generator (roadmap Phase D).

**Non-Goals:**
- Currency in the URL (localStorage/default is fine; keeps URLs short).
- Cross-brand selections (post-launch roadmap item).
- `hashchange` listening / back-button navigation between selections (`replaceState` intentionally creates no history entries).
- Query-string or path-based routing.

## Decisions

**1. Hash grammar: `#<mode>` or `#<mode>=<slug>,<slug>,<slug>`**
Extends the existing `#cameras`/`#lenses` convention instead of inventing a new scheme, so every existing URL stays valid by construction. Alternative considered: `#c=...&l=...` (both modes' selections in one hash) — rejected; only the active mode is visible, and shorter URLs share better.

**2. Always write all 3 slugs, even at 2 visible slots.**
The selection arrays are always length 3; `numSlots` is a responsive display concern. A URL shared from a phone opens with the same third camera a desktop user would see. Alternative (write `numSlots` slugs) makes the URL depend on the sharer's window width — surprising and lossy.

**3. Per-slot fallback on parse.**
`parseHash` validates each slug against the active mode's `items`; an unknown/duplicate-of-invalid/missing slug falls back to that slot's `defaultSelected[i]`. Whole-hash rejection (all-or-nothing) was considered and rejected: a URL with one renamed slug should still show the other two cameras the sharer intended. Duplicate valid slugs are tolerated (the UI already only soft-prevents duplicates via disabled options).

**4. Single `updateHash()` writer using `history.replaceState`.**
Called from the slot-change handler and the mode toggle (replacing the existing inline `replaceState`). `replaceState` over `location.hash =` assignment avoids polluting history with an entry per dropdown change. Init does NOT call `updateHash()` when the page loads with a bare/empty hash — a user who just visits `/fujifilm/` shouldn't see the URL grow until they interact.

**5. Brand switcher forwards mode only.**
`location.href = ../<slug>/#<mode>` (drop the `=<slugs>` part). Slug lists are brand-local; forwarding them verbatim would put dangling foreign slugs in the target page's URL (harmless due to decision 3, but misleading if then re-shared before any interaction). This narrows the brand-picker spec's "preserving any hash fragment" to "preserving the mode".

**6. No URL-encoding of slugs.**
Slugs are schema-constrained (`tests/helpers/schema.js`) to lowercase alphanumerics and hyphens — safe in a fragment as-is. A test-suite invariant already enforces slug shape; no escaping layer needed.

## Risks / Trade-offs

- [Stale URLs after a slug rename/removal] → per-slot default fallback renders a sensible page; the hash self-corrects on first interaction.
- [jsdom `history.replaceState` + `location.hash` fidelity] → jsdom supports both; tests construct the JSDOM with an explicit `url:` containing the hash, matching the existing Tier 2 harness pattern.
- [Hash written only on interaction, not on load] → a copied URL right after load of a bare `/fujifilm/` page shares defaults implicitly; acceptable — defaults are deterministic per brand.

## Migration Plan

Pure additive front-end change; no data migration. Rollback = revert the PR. Existing bookmarks (`#lenses`) unaffected.

## Open Questions

None — behavior for every edge (empty hash, bare mode, invalid slug, duplicates, brand switch) is decided above.
