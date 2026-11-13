## How to work this change (read first; written so any session or model can resume)

- Worktree `.claude/worktrees/size-comparison`, branch `add-size-comparison`. It was cut from
  `add-differences-toggle` (PR #89), which sits on `add-search-picker` (PR #88). **Before
  coding**: once #88 and #89 are merged, `git merge origin/main` here (generated files —
  `sitemap.xml`, `sitemap-lastmod.json`, `index.html` — take main's, then
  `node scripts/generate-seo.js`).
- If the worktree is missing: `git worktree add .claude/worktrees/size-comparison add-size-comparison`
  and `ln -s ../../../node_modules node_modules` inside it.
- To resume: `git log --oneline origin/main..HEAD` and the ticks below. Start at the first
  unticked box. One commit per task, including its tick; `npm test` green at each.
- Commit with the hook on (`git config core.hooksPath` must print `.githooks`). Push with
  `git -c credential.helper='!gh auth git-credential' push -u https://github.com/esusatyo/fuji-compare-tool.git add-size-comparison`.
- Read `design.md` first; D1–D13 are settled except the two "Open points" at its end.
- One PR for the whole change. PR body must not contain a claude.ai session link.
- No parallel agents on this repo.

## 0. Confirm with the owner

- [ ] 0.1 Design "Open points": imperial small print (D8), and that size pages cover the 45
      indexable pairs only.

## 1. Drawing module

- [ ] 1.1 `size.js`: `box`, `CARD`, `facts`, `rows` (design D2, D7, D8) with the
      `module.exports` tail. `tests/logic/size.test.js`: boxes from real cameras and lenses,
      missing dimension → null, sentence wording incl. equal and all-equal cases, rows.
- [ ] 1.2 `SizeDiagram.svg` (D3, D4): three views (two for lenses), overlay and side-by-side,
      credit card, labels, `role="img"` + `aria-label`. Tests parse the SVG and check every
      outline's width/height against data × one scale, card ratio, 1–4 entries.
- [ ] 1.3 Move the share cards' `silhouetteHTML` onto `SizeDiagram` (D10). Share-image
      manifest test must stay green with **no** re-rendered card; if a hash changes, the
      refactor changed pixels — fix it rather than re-render.

## 2. Tool section

- [ ] 2.1 Load `size.js` before `engine.js` on every brand `index.html`, `compare/index.html`
      and root `index.html`; teach `tests/helpers/load-brand.js`, `load-compare.js` and
      `load-home.js` to run it. A data test asserts every page that loads `engine.js` loads
      `size.js` first.
- [ ] 2.2 `renderSizeSection()` in `engine.js`, called before `renderReferencesSection()`
      (D5): drawing, sentence, table, note; layout switch (`sizeLayout`, default by viewport
      width); lens mode; skips empty slots; untouched by "Show differences only".
- [ ] 2.3 Styles in `engine.css` (section, switch, table, note; both themes; phone width).
- [ ] 2.4 Tests in `tests/logic/size.test.js`: position (before `.refs-section`), redraw on
      pick / slot count / mode, one item, homepage empty slots, differences toggle leaves it,
      layout switch + `size-view` event, default layout at 390px vs 1024px.

## 3. Static pages

- [ ] 3.1 `sizeSectionHTML(a, b, link)` in `generate-seo.js`; emit it from `vsPageHTML` and
      `crossVsPageHTML` after the spec card (D10). Regenerate; freshness test green.
- [ ] 3.2 `sizePageHTML` / `crossSizePageHTML` (D6) and wire into `buildSite` next to the
      vs-page loop, gated by the same `indexable` result; sitemap paths; stale-file removal
      covers `size/` directories. Regenerate (~45 new files).
- [ ] 3.3 `tests/data/size-pages.test.js`: one size page per indexable vs-page and none
      otherwise; table values equal the data; canonical/OG; no `.html` hrefs; each page is
      linked from somewhere; both layouts present in the HTML; reference rows present.
- [ ] 3.4 vs-page size sections link to the size page exactly when it exists (test).

## 4. /size/ page and homepage card

- [ ] 4.1 `COMPARE_CONFIG.sizeFirst` in `engine.js`: Size section first and expanded. Test.
- [ ] 4.2 `size/index.html` loader + generated head/body blocks (D11), listing every size
      page by brand. Sitemap. Share card: reuse the compare card.
- [ ] 4.3 Homepage card between the brand grid and the intro (D12); order test in
      `tests/logic/root-page.test.js` extended.

## 5. Analytics and docs

- [ ] 5.1 `size-seen` in `analytics.js`; grammar comment; `privacy.html`; analytics tests
      (size pages load `count.js` + `analytics.js` like vs-pages).
- [ ] 5.2 `CLAUDE.md` (size.js, `/size/`, size pages, "new brand → add its script to
      `size/index.html`"), `add-camera-brand` skill, growth backlog item 2 status.

## 6. Verify and ship

- [ ] 6.1 Browser check on `python3 scripts/preview.py`: a brand page (cameras, lenses),
      `/compare/`, homepage, `/size/`, one same-brand and one cross-brand size page, a
      vs-page; both themes; a 390px frame.
- [ ] 6.2 `npm run test:links`.
- [ ] 6.3 `openspec validate add-size-comparison --strict`; open the PR.
- [ ] 6.4 Owner: real-device check (phone layout of the drawing).
- [ ] 6.5 After merge: verify live; **ask the owner before** requesting indexing in Search
      Console; archive the change; review Bing/Google "size" impressions and landings under
      `/size/` after 4–8 weeks.
