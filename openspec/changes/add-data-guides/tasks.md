## How to work this change

- Branch `search-and-marketing`. One commit per task, with its tick here. `npm test` green at every commit.
- Owner decisions are recorded in design.md (2026-11-17). The owner approves each article's final text before it publishes.

## 1. Drafts (owner review)

- [x] 1.1 Article structure guideline (design.md).
- [x] 1.2 Draft the first article: `drafts/lightest-aps-c-cameras.html`.
- [x] 1.3 Owner reviews the draft and the guideline; record decisions D1–D4.
- [x] 1.4 Apply the review: `/articles/` URLs, site byline, lead-ins before tables and charts, the
      owner's X-S20 note; pin the noindexed pairs the first article links to.
- [x] 1.5 Draft the second article: `drafts/lightest-zoom-lenses.html`; `drafts/build-drafts.js`
      builds both drafts and checks their links and claims.
- [x] 1.6 Owner approves both drafts for `/guides/` (2026-11-17); final text sign-off at the PR (4.2).

## 2. Engine (guides and articles)

- [x] 2.1 Source format: one module per page in `content/guides/` or `content/articles/` (meta, query
      evidence, `snapshot(data)`, `render(snap, kit)`, `claims(snap)`); `scripts/articles.js` loads and
      renders them (page shell, tables, bar charts); `content/` kept out of the deployed assets.
- [x] 2.2 Port both drafts to `content/guides/`; drop `drafts/` and `build-drafts.js`.
- [x] 2.3 Generator: `/guides/<slug>` and `/articles/<slug>` pages, index pages once non-empty,
      sitemap entries, share cards, Updated date from the lastmod manifest; article snapshots via
      `scripts/snapshot-article.js`.
- [x] 2.4 Styles in `engine.css` (tokens only, both themes, chart colours validated), 375px without
      sideways scroll.
- [x] 2.5 Links to guides from the homepage and `/size/`.
- [x] 2.6 `guide-link` / `article-link` events; update `privacy.html`.

## 3. Tests

- [ ] 3.1 Every guide link resolves to an existing, indexable page; hash slugs resolve.
- [ ] 3.2 Every declared claim holds; no unresolved placeholder in the output.
- [ ] 3.3 One H1, title of at most 60 characters, meta description of 140–160, Article JSON-LD with
      the site as author, the date at the top.
- [ ] 3.4 Articles render from their snapshot (a data change can't move them); the articles index
      is absent while there are no articles.

## 4. Publish and measure

- [ ] 4.1 Preview check in both themes and at phone width.
- [ ] 4.2 PR; owner approves the final text and does a real-device check.
- [ ] 4.3 After merge: verify live, ask the owner before requesting indexing, log a baseline, review
      after 4–8 weeks.
