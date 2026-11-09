## How to work this change (read first; written so any session or model can resume)

- Worktree: `.claude/worktrees/static-brand-specs`, branch `static-brand-specs` (from main 5a2f4b6).
  Work only here. If it's missing: `git worktree add .claude/worktrees/static-brand-specs static-brand-specs`
  (or `origin/static-brand-specs`) and `ln -s ../../../node_modules node_modules` inside it.
- To resume: `git log --oneline main..HEAD` and the ticks below show what's done. Start at the
  first unticked box.
- One commit per task, including its tick here. Commit with
  `git -c core.hooksPath=.githooks commit` (the hook regenerates pages and runs `npm test`).
  Push after every commit:
  `git -c credential.helper='!gh auth git-credential' push -u https://github.com/esusatyo/fuji-compare-tool.git static-brand-specs`
- `npm test` must be green at every commit. Read `design.md` before coding; D1–D8 are settled.
- Before calling a repo helper, open it and read its contract (`withBodyBlock`, `esc`, `VS_ROWS`, `loadBrand`).
- Commit messages end with the Co-Authored-By/Claude-Session lines the session gives. PR bodies
  must NOT contain a claude.ai session link.

## 1. Generator: at-a-glance block (scripts/generate-seo.js)

- [x] 1.1 Add helpers next to `VS_ROWS`: `vsRow(label)` lookup, `sizeText(cam)`, and
      `GLANCE_COLS` (the 8 columns of design D4, each `[header, cam => value|null]`). Export
      `GLANCE_COLS`, `sizeText`. No output change yet; `npm test` green.
- [x] 1.2 Add `brandGlanceHTML(brand, data, isIndexable, pairs)` returning the
      `<section class="seo-links seo-glance">` of design D2/D3/D5/D6 (table + older line + lens line;
      table omitted when there are no current cameras; singular wording for count 1; every value `esc()`'d;
      null → `—`). Export it. Not wired in yet.
- [x] 1.3 Wire it in: `brandBodyBlock(brand, data, site, pairs, isIndexable = () => false)`
      emits `brandGlanceHTML(...)` before the existing popular-comparisons section, inside the markers.
      In `buildSite`, pass `(a, b) => indexable(\`${brand}/vs/${a}-vs-${b}.html\`, a, b)`. Check the exact `rel`
      format `indexable` expects by reading how vs-page files are keyed in `buildSite`.
      Run `node scripts/generate-seo.js` and commit the 8 regenerated brand pages, `sitemap.xml` and
      `sitemap-lastmod.json` in the same commit.

## 2. Tests for the generator (tests/data/brand-specs.test.js, new)

Use `tests/helpers/load-brand.js` (`brandDirs`, `loadBrand`) and parse each committed
`<brand>/index.html` with jsdom (`new JSDOM(html)`). Test names start with `[brand-specs]`.

- [x] 2.1 Per brand: the `.seo-glance tbody tr` count equals the number of non-discontinued
      cameras, and row order equals `CAMERA_ORDER` filtered to current cameras (compare the
      row-header text against `cam.name`).
- [x] 2.2 Per brand, per row: each cell's text equals `esc`-decoded `GLANCE_COLS[i][1](cam) ?? '—'`
      (i.e. the table matches the data, including `—` for nulls). Include one hand-written spot check
      for a known camera (e.g. Sony A7 IV's weight and size strings) so the test doesn't only compare
      the generator with itself.
- [x] 2.3 Per brand: the older-cameras line lists exactly the discontinued cameras' names in
      `CAMERA_ORDER` order. The line is absent when there are none.
- [x] 2.4 Per brand: the lens line's total equals `Object.keys(LENSES).length`; per-maker counts
      sum to the total; the brand's own maker is listed first.
- [x] 2.5 Per brand: every `<a>` in `.seo-glance` is extensionless, points at `vs/<a>-vs-<b>` for a
      file that exists, and that page is indexable (no `noindex` meta in the file). A current camera
      with no indexable pair has no link (assert at least one such case exists somewhere, or build one
      in a unit test of `brandGlanceHTML` with a fake `isIndexable` returning false).
- [x] 2.6 Unit tests of `brandGlanceHTML` with small fake `data` objects (no files):
      (a) zero current cameras → no `<table>` but the older and lens lines render;
      (b) one current camera → singular wording;
      (c) a name containing `<` / `&` is escaped;
      (d) a camera missing `depth` → size cell `—`.
- [x] 2.7 Mutation check (manual, then note it in the commit message): temporarily mark one Sony
      camera `discontinued: true` in memory (not on disk) and assert `brandGlanceHTML` moves it from
      the table to the older line. This can be a real test using a cloned data object.

## 3. Engine: footer after the static sections (engine.js)

- [ ] 3.1 Before editing, grep for `footer` in `engine.js`, `theme.js`, `analytics.js`, `tests/`
      and note any selector that assumes the footer is inside `#app`. Fix it or adjust the approach.
- [ ] 3.2 Implement design D7 at the end of `injectBody()`.
- [ ] 3.3 Tests in `tests/logic/render-container.test.js`:
      (a) with `<div id="app">` + two `<section class="seo-links">` after it, the footer ends up after
      the last section, and both sections' content is unchanged;
      (b) with no static sections, the footer stays inside `#app` (current behaviour);
      (c) theme buttons inside the moved footer still respond to clicks (if `theme.js` is loadable in
      the harness; otherwise assert the buttons exist after the move).

## 4. Styles (engine.css)

- [ ] 4.1 Add the `.seo-table-wrap` / `.seo-table` rules of design D8 next to `.seo-links`, using
      existing tokens only (both themes). `npm test` (design-system tests) green.

## 5. Docs

- [ ] 5.1 CLAUDE.md: one sentence in the Architecture section that brand pages' `seo:body` block
      now carries an at-a-glance spec table generated from `data.js` (and that the engine moves its
      footer below the static sections). Update `docs/growth-backlog.md` item 3 to "in progress: add-static-brand-specs".

## 6. Verify in a browser

- [ ] 6.1 `python3 scripts/preview.py 3456`; open `/sony/`, `/sigma/` (1 current camera), `/leica/`
      (long older line) and `/compare/` in light and dark at desktop and 375px wide. The page must not
      scroll sideways (only the table box scrolls), the footer must come last, and the tool must work.
      Take screenshots for the PR.
- [ ] 6.2 View the raw HTML (`curl -s localhost:3456/sony/ | grep -c '<tr>'`) and confirm the table is in
      the served HTML (crawler view, no JS).
- [ ] 6.3 `npm test` green; `RUN_LINK_TESTS=1 npm run test:links` is not needed (no new external URLs).

## 7. PR

- [ ] 7.1 Open the PR (title: "Static at-a-glance specs on brand pages"), with screenshots and the
      before/after crawlable text size per brand page. Ask the owner to check one brand page on a real phone.

## 8. After merge

- [ ] 8.1 Confirm live: `curl -s https://comparecameraspecs.com/sony/ | grep -c 'seo-glance'` ≥ 1.
- [ ] 8.2 Ask the owner, then use GSC URL Inspection → "Request indexing" for `/leica/`, `/olympus/`, `/sigma/`.
- [ ] 8.3 Note the baseline (brand-page impressions in Bing and GSC, Copilot citations of brand pages)
      in the SEO usage log, and re-check after 4–8 weeks.
- [ ] 8.4 Archive this change.
