## Why

The site is a set of tools: a brand page, a vs-page or a size page answers "compare X with Y" well,
but there is very little text on it for a search engine to match to the questions people actually
type. Google's SEO Starter Guide says content people find useful "will likely influence your
website's presence" more than anything else it lists. Our evidence agrees:

- The strongest queries in both Bing and Search Console are about **size and weight**
  ("camera size comparison", "compare cameras size", "camera dimensions comparison"), and only
  the homepage earns impressions for them (Bing, Nov 3–14 2026: 723 of the site's impressions).
- The site holds data nobody else publishes in one place: weight with battery and card,
  dimensions, sensor, stabilization, video, price and launch year for every mirrorless body
  across eight brands, kept current by the refresh and verify-specs work.
- Outreach to photography sites has started (Nov 2026). A ranking or chart is a much better
  thing to pitch than a tool's homepage.

## What changes

- A new **articles** section: short, data-led articles at `/articles/<slug>`, plus a `/articles/`
  index. Each article answers one search question, with numbers built from `data.js` by the
  generator and prose written or approved by the owner.
- An **article structure guideline** (design.md) that every guide follows: title, meta,
  headings, the answer up front, the ranked table, the chart, internal links, method note and
  structured data.
- The first article: **"The lightest APS-C cameras, ranked"**, drafted in
  `drafts/lightest-aps-c-cameras.html` for the owner to review before anything is built.

## Not in this change

- No bulk generation. The launch set is 3–5 articles, each tied to a query we can see in Bing
  or Search Console.
- No blog-style posts that don't use our data (beginner tips, news). They would compete with
  much stronger sites and add little.
- No change to vs-pages, size pages or the tool.

## Impact

- `scripts/generate-seo.js`: a guide template, the guides index, sitemap entries and share cards.
- New `guides/` content source (prose plus a data query per guide) and generated pages.
- Tests: freshness, links resolve to indexable pages, prose claims still true for the data.
- `engine.css`: article and chart styles using existing tokens.
- Homepage, `/size/` and brand pages link to relevant guides.
