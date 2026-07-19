# Design — Cross-Brand Camera Comparison

## Context

Each `<brand>/data.js` is a standalone browser script declaring top-level `const`
globals (`BRAND_CONFIG`, `CAMERAS`, …). `engine.js` reads those bare globals and
builds `MODE_CONFIG` at script-eval time. Loading two brand files on one page
throws `SyntaxError: Identifier 'CAMERAS' has already been declared`, so no page
can currently show two brands at once. The engine renders a fixed 3-slot layout
(2 below the 600 px breakpoint), brand-tagged `SPEC_SECTIONS` render only when
the slug is in `BRAND_CONFIG.brandSections`, and shareable hashes use bare slugs.
`scripts/generate-seo.js` and `tests/helpers/load-brand.js` both evaluate brand
files and read the same globals.

## Goals / Non-Goals

**Goals:**
- Load all five brand datasets on one page without breaking the
  "each brand is one self-contained script" invariant, `file://` support, or the
  existing brand-page URLs and behavior.
- A `/compare/` page: any camera from any brand per slot, 2–4 slots (mobile
  clamped to 2), cross-brand winner highlighting, all brand-tagged sections
  visible, shareable hashes, correct per-brand buy links and card colors.
- Curated static cross-brand vs-pages feeding SEO traffic into `/compare/`.
- Test coverage for the registry shape, the compare page's behaviors, and the
  generated pages.

**Non-Goals:**
- Cross-brand **lens** comparison (mount-specific; stays per-brand).
- Changing brand-page slot count (stays 3/2) or their bare-slug hash URLs.
- A shared lens catalog, minification, or any build step.
- Auto-generating all possible cross-brand pairs (curated list only — full
  cartesian would be ~4,000 thin pages).

## Decisions

### 1. Registry via mechanical IIFE wrap (not fetch/eval, not modules)

Each `data.js` becomes:

```js
window.BRAND_DATA = window.BRAND_DATA || {};
window.BRAND_DATA['fujifilm'] = (() => {
  // …every existing const, byte-for-byte unchanged…
  return { BRAND_CONFIG, SERIES_COLORS, CAMERAS, CAMERA_ORDER,
           DROPDOWN_GROUPS, LENSES, LENS_DROPDOWN_GROUPS, REGISTERED_BRANDS };
})();
```

Only the first two and last few lines of each file change; the 1,100–2,600-line
data bodies are untouched, so the refactor reviews as a diff-shape check.

*Alternatives rejected:* `fetch()` + `new Function` scoping (breaks `file://`,
where `fetch` of local files is blocked); ES modules (breaks the zero-build,
plain-script invariant and all existing loaders); renaming globals per brand
(touches every identifier, huge diff).

### 2. Engine resolves data from the registry; page kind is declared, not inferred

`engine.js` stops reading bare globals. Brand pages register exactly one entry
and the engine uses it — behavior is pixel-identical. `compare/index.html`
declares a small inline `COMPARE_CONFIG` (hero copy, default selection, slot
bounds) before loading all five `data.js` files; the engine branches on
`COMPARE_CONFIG`'s presence rather than counting registry entries, so page
intent is explicit and a future partial load can't silently flip modes.
`MODE_CONFIG` construction moves from top-level eval into init (it currently
closes over globals at parse time).

### 3. Namespaced ids `<brand>:<slug>` on the compare page only

Compare-page selection ids, hash slugs, and dropdown option values are
`fujifilm:x-t5`-style. Brand pages keep bare slugs, so no existing URL changes.
`:` is safe — a tier-1 test asserts no camera slug contains it. The owning brand
resolved from the id prefix drives: item lookup, `SERIES_COLORS` for the card,
`BRAND_CONFIG.name` in the Amazon search fallback for buy links (today the
engine uses the page brand's name — wrong for cross-brand), and brand-tagged
section matching.

### 4. Slot count: state generalization + one breakpoint

`numSlots` generalizes to 2–4 with a slot-count control (2 | 3 | 4) rendered
only on the compare page. Effective slots =
`min(userChoice, viewportAllows)` where viewports `< 600px` allow 2 (the
existing breakpoint — no new breakpoints). On resize the layout re-clamps but
the user's choice is preserved and restored when the viewport widens. The
`--num-slots` CSS var already drives the grid; slot cells become generated
(`slot-0…slot-3`) instead of the hardcoded three, and the written hash always
carries the user's chosen count, not the clamped count (mirrors the existing
"all three slugs even when two shown" rule).

### 5. Brand-tagged sections: union of selected brands, "—" for non-members

In cross-brand mode a section tagged `brand: '<slug>'` renders when **any**
selected camera's brand matches. Cells for cameras of other brands render "—"
and are excluded from winner computation (winner logic already needs
undefined-tolerance hardening: every brand-specific `fn` must return
`undefined`/`null` safely for foreign cameras — verified by a test that renders
one camera from each brand simultaneously).

### 6. Compare-page hash grammar extends, brand pages unchanged

`/compare/#cameras=<brand>:<slug>,…` with 2–4 entries; entry count sets the
slot count (clamped to [2,4]). Unknown brand prefixes or slugs fall back
per-slot to the compare defaults, same per-slot-recovery philosophy as today.
Mode is always `cameras` on the compare page (no lens toggle rendered).

### 7. Cross-brand vs-pages: curated list in the generator, root `vs/`

`generate-seo.js` gains `CROSS_BRAND_MATCHUPS` — a hand-curated array of
`[['fujifilm','x100vi'], ['sony','a6700']]` pairs (~60–100, spanning
price-peer and same-segment matchups across all five brands). Pages emit to
root `vs/<brandA>-<slugA>-vs-<brandB>-<slugB>.html` (no single brand owns
them), reuse the existing vs-page template (spec table, ItemList/Product
JSON-LD, related links) with the interactive CTA pointing at
`/compare/#cameras=…`, and join the sitemap and homepage cluster. Every
matchup entry is validated against real slugs at generation time (generator
fails hard on a typo) and by a tier-1 test. The generator's data loading moves
to the same registry shape via the shared `load-brand.js` helper.

## Risks / Trade-offs

- [All five data files touched at once → merge pain with parallel branches] →
  The wrap is first/last-lines-only; data bodies untouched, so conflicts stay
  trivial. Land the registry PR before starting any parallel data work.
- [Missed engine assumption of a bare global (e.g. `REGISTERED_BRANDS` typeof
  check at engine.js:375)] → grep-audit for every global name during the
  refactor; tier-2 suite re-renders every brand page and must pass unchanged.
- [4 columns cramped at 600–900 px] → accepted; columns share the grid evenly
  and specs are short values. Revisit with a mid clamp only if it looks broken
  in manual preview.
- [Cross-brand vs-pages judged thin by Google] → they launch with the same
  unique-summary generation planned for existing vs-pages (separate quick-win
  work); curated pairs only, no cartesian expansion.
- [jsdom can't do real viewport resize] → clamp logic lives in a pure function
  (`effectiveSlots(userChoice, width)`) unit-tested directly; jsdom tests stub
  `innerWidth` and dispatch `resize`.
- [`priceIncomplete`/discontinued price rules differ across brands in one
  table] → no change needed: price display is already per-item, but the
  cross-brand render test asserts a discontinued + a `priceIncomplete` item
  from different brands render correctly side by side.

## Migration Plan

1. **PR 1**: registry wrap (all five `data.js`), engine registry resolution +
   `load-brand.js` + generator loader update, full existing suite green —
   zero behavior change, deployable alone.
2. **PR 1 (same PR, second commit series)**: compare page + engine cross-brand
   mode + new tests. (The refactor is only proven by its consumer; keep one PR
   as agreed, reviewable commit-by-commit.)
3. **PR 2**: `CROSS_BRAND_MATCHUPS` + generated `vs/` pages + sitemap/homepage
   regeneration.
4. Rollback: revert PR — pages are static, no data migration, no stored-state
   format changes (`localStorage['brand']` untouched; `/compare/` is not a
   brand slug and must not be written to it).

## Open Questions

- Final curated matchup list (drafted during PR 2; validated mechanically, so
  editorial-only risk).
- Default compare selection — proposal suggests
  `fujifilm:x-t5, sony:a7-iv, canon:eos-r6-iii`; confirm at implementation.
