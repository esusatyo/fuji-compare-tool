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
- [ ] 1.6 Owner approves both drafts' final text.

## 2. Generator

- [ ] 2.1 A guide source format: prose with `{{placeholders}}`, a data query, declared claims, front matter
      (query evidence, dates, links).
- [ ] 2.2 Guide page template following design G3/G4 (static H1, short answer, table, chart, sections,
      links, method note, Article JSON-LD).
- [ ] 2.3 Chart renderer: static inline SVG plus the table of the same numbers.
- [ ] 2.4 `/articles/` index page; sitemap entries; share cards.
- [ ] 2.5 Links to guides from the homepage, `/size/` and relevant brand pages.

## 3. Tests

- [ ] 3.1 Generated guides match the committed files (existing freshness pattern).
- [ ] 3.2 Every internal link in a guide resolves and points at an indexable page.
- [ ] 3.3 Every declared claim holds for the current data; no unresolved placeholder in the output.
- [ ] 3.4 One H1, a title of at most 60 characters, a meta description of 140–160 characters, Article JSON-LD.

## 4. Styles and analytics

- [ ] 4.1 Article and chart styles in `engine.css`, tokens only, both themes, 375px wide without sideways scroll.
- [ ] 4.2 `article-link` event; update `privacy.html`.

## 5. Publish and measure

- [ ] 5.1 Publish "The lightest APS-C cameras, ranked" and "The lightest zoom lenses, ranked by mount"; preview
      check in both themes and on a phone.
- [ ] 5.2 PR; owner real-device check.
- [ ] 5.3 After merge: verify live, ask the owner before requesting indexing, log a baseline, review after 4–8 weeks.
