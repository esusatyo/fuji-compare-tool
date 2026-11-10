## Why

Brand pages (`/<brand>/`) are the site's richest pages, but their specs are rendered in the
browser by `engine.js`. The HTML a crawler reads is one intro sentence plus a list of vs-page
links. Google and AI answer engines (Bing Copilot, ChatGPT), most of which do not run
JavaScript, therefore see no specs, and so have nothing on these pages to rank or cite.
Evidence (Nov 2026): Bing Copilot cites almost only `/`; Google has `/leica/`, `/olympus/`
and `/sigma/` as "Discovered – currently not indexed"; size is the strongest search intent
(Bing queries and Copilot grounding queries). See `docs/growth-backlog.md` item 3.

## What Changes

- The generator-owned body block on each brand page (`seo:body` markers, written by
  `brandBodyBlock()` in `scripts/generate-seo.js`) gains, above the existing
  "Popular comparisons" list:
  - an **"<Brand> cameras at a glance"** table: one row per current (non-discontinued)
    camera with year, sensor, IBIS, max video, weight, size (W×H×D) and USD price;
  - a one-line list of **older (discontinued) cameras** in the comparison;
  - a one-line **lens summary**: total lens count and the count per maker.
- The section is visible to people, not just crawlers, and styled as a quiet reference
  appendix (`engine.css`), scrolling sideways on narrow screens.
- `engine.js` moves its `<footer>` to after the static section once it has rendered, so the
  page reads tool → at-a-glance → popular comparisons → footer. Today the static block sits
  below the footer.
- No change to vs-pages, the compare page's content, the sitemap or structured data.

## Impact

- Code: `scripts/generate-seo.js` (`brandBodyBlock` + small helpers), `engine.js`
  (footer placement), `engine.css` (table styles).
- Generated: all 8 `<brand>/index.html` files; `sitemap-lastmod.json` and `sitemap.xml`
  (brand-page dates move, automatically).
- Tests: `tests/data/seo.test.js` (or a new `tests/data/brand-specs.test.js`),
  `tests/logic/render-container.test.js`.
- Page weight: about 4–8 KB of HTML per brand page (about 2 KB gzipped).
- Measure: brand-page impressions in Bing and Google, and brand-page citations in Bing's
  AI Performance report, 4–8 weeks after deploy.
