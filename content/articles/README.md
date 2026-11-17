# Dated articles

Pieces about one period ("cameras released in 2026", "camera prices, November 2026"),
published at `/articles/<slug>` with the period in the slug. Unlike a guide
(`content/guides/`), an article never changes after it is published.

1. Write `content/articles/<slug>.js` with the same exports as a guide (see the header of
   `scripts/articles.js`); `published` is the publish date shown at the top.
2. Freeze its data: `node scripts/snapshot-article.js <slug>` writes `<slug>.snapshot.json`.
   The generator renders the article from that file only, so later data changes never move it.
3. Run `node scripts/generate-seo.js`. The `/articles/` index and its sitemap entry appear with
   the first article.

The only later edit is a link to the newer edition.
