## How to work this change (read first; written so any session or model can resume)

- Worktree `.claude/worktrees/size-pages`, branch `size-comparison`, cut from main at bc73777
  (after #88). The earlier branch `add-size-comparison` (stacked on the unmerged #89 branch) is
  superseded — the owner asked for a fresh branch on main.
- The differences toggle (#89) is **not** on main; PR #90 re-lands it. Both touch
  `renderTable()` in `engine.js`: this change adds `renderSizeSection()` calls around the
  spec-section loop. Whichever merges second has a small, mechanical conflict there — keep
  both: the size section stays outside "Show differences only".
- If the worktree is missing: `git worktree add .claude/worktrees/size-pages size-comparison`
  and `ln -s ../../../node_modules node_modules` inside it.
- To resume: `git log --oneline origin/main..HEAD` and the ticks below. Start at the first
  unticked box. One commit per task, including its tick; `npm test` green at each.
- Commit with the hook on (`git config core.hooksPath` must print `.githooks`). Push with
  `git -c credential.helper='!gh auth git-credential' push -u https://github.com/esusatyo/fuji-compare-tool.git size-comparison`.
- Read `design.md` first; D1–D13 are settled (the two open points were confirmed 2026-11-13).
- One PR for the whole change. PR body must not contain a claude.ai session link.
- No parallel agents on this repo.

## 0. Confirm with the owner

- [x] 0.1 Confirmed by the owner 2026-11-13: millimetres and grams with inches/ounces in small
      text; size pages for the indexable pairs only.

## 1. Drawing module

- [x] 1.1 `size.js`: `box`, `CARD`, `facts`, `rows` (design D2, D7, D8) with the
      `module.exports` tail. `tests/logic/size.test.js`: boxes from real cameras and lenses,
      missing dimension → null, sentence wording incl. equal and all-equal cases, rows.
- [x] 1.2 `SizeDiagram.block` (D3, D4; see design "As built"): three views (two for lenses), overlay and side-by-side,
      credit card, labels, `role="img"` + `aria-label`. Tests parse the SVG and check every
      outline's width/height against data × one scale, card ratio, 1–4 entries.
- [x] 1.3 **Dropped.** Share cards keep their own `silhouetteHTML`: card freshness is a hash of
      the card's HTML, so any change to that markup re-renders all ~300 PNGs for no visible gain.

## 2. Tool section

- [x] 2.1 Load `size.js` before `engine.js` on every brand `index.html`, `compare/index.html`
      and root `index.html`; teach `tests/helpers/load-brand.js`, `load-compare.js` and
      `load-home.js` to run it. A data test asserts every page that loads `engine.js` loads
      `size.js` first.
- [x] 2.2 `renderSizeSection()` in `engine.js`, called before `renderReferencesSection()`
      (D5): drawing, sentence, table, note; layout switch (`sizeLayout`, default by viewport
      width); lens mode; skips empty slots; untouched by "Show differences only".
- [x] 2.3 Styles in `engine.css` (section, switch, table, note; both themes; phone width).
- [x] 2.4 Tests in `tests/logic/size.test.js`: position (before `.refs-section`), redraw on
      pick / slot count / mode, one item, homepage empty slots, differences toggle leaves it,
      layout switch + `size-view` event, default layout at 390px vs 1024px.

## 3. Static pages

- [x] 3.1 `sizeSectionHTML(a, b, link)` in `generate-seo.js`; emit it from `vsPageHTML` and
      `crossVsPageHTML` after the spec card (D10). Regenerate; freshness test green.
- [x] 3.2 `sizePageHTML` / `crossSizePageHTML` (D6) and wire into `buildSite` next to the
      vs-page loop, gated by the same `indexable` result; sitemap paths; stale-file removal
      covers `size/` directories. Regenerate (~45 new files).
- [x] 3.3 `tests/data/size-pages.test.js`: one size page per indexable vs-page and none
      otherwise; table values equal the data; canonical/OG; no `.html` hrefs; each page is
      linked from somewhere; both layouts present in the HTML; reference rows present.
- [x] 3.4 vs-page size sections link to the size page exactly when it exists (test).

## 4. /size/ page and homepage card

- [x] 4.1 `COMPARE_CONFIG.sizeFirst` in `engine.js`: Size section first and expanded. Test.
- [x] 4.2 `size/index.html` loader + generated head/body blocks (D11), listing every size
      page by brand. Sitemap. Share card: reuse the compare card.
- [x] 4.3 Homepage card between the brand grid and the intro (D12); order test in
      `tests/logic/root-page.test.js` extended.

## 5. Analytics and docs

- [x] 5.1 `size-seen` in `analytics.js`; grammar comment; `privacy.html`; analytics tests
      (size pages load `count.js` + `analytics.js` like vs-pages).
- [x] 5.2 `CLAUDE.md` (size.js, `/size/`, size pages, "new brand → add its script to
      `size/index.html`"), `add-camera-brand` skill, growth backlog item 2 status.

## 6. Verify and ship

- [x] 6.1 Browser check on the local preview (desktop Chrome, dark theme): `/size/`, a
      cross-brand size page in both layouts, a vs-page, the Sony lens page, the homepage card,
      and a 390px frame of a size page and `/size/`. **Not checked: the light theme.**
- [x] 6.2 `npm run test:links`: one failure not from this change — 13 Canon `usa.canon.com/cameras/…`
      product URLs answer 404 to the checker (Canon blocks command-line requests; unverified). Separate follow-up.
- [x] 6.3 `openspec validate add-size-comparison --strict`; PR #91 opened.
- [ ] 6.4 Owner: real-device check (phone layout of the drawing).
- [ ] 6.5 After merge: verify live; **ask the owner before** requesting indexing in Search
      Console; archive the change; review Bing/Google "size" impressions and landings under
      `/size/` after 4–8 weeks.
