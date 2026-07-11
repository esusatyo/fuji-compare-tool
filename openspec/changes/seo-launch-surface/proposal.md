## Why

The site is invisible to search engines and unready for public launch: brand pages are empty JS shells with no meta description, canonical, or Open Graph tags; there is no sitemap or robots.txt; no crawlable content exists for the "camera A vs camera B" queries that drive comparison-site traffic; and the site has no About/Privacy pages or accurate data-freshness statement. This change covers launch-roadmap Phases C (SEO surface), D (prerendered vs-pages), and E (trust pages) in one branch/PR at the user's request.

## What Changes

- New root `site-config.js` — single source of truth for `baseUrl` (clearly-fake placeholder until launch), site name, and data-verified date. Loaded by every brand page; read by the generator script. Swapping the real domain at launch = edit this one file + rerun the generator.
- New `scripts/generate-seo.js` — regenerates, from brand data + site-config: per-brand `<head>` SEO blocks (between marker comments in each `index.html`), curated static `"X vs Y"` comparison pages at `<brand>/vs/<a>-vs-<b>.html` with real crawlable spec tables and JSON-LD, `sitemap.xml`, and `robots.txt`. Generated output is committed; a Tier 1 test fails if it goes stale.
- Curated pairing rules (not all pairs, avoiding thin-content penalties): same-series consecutive generations, plus price-neighbour rivals among non-discontinued cameras (~20–40 pages per brand).
- New static `about.html` and `privacy.html` at root.
- Footer: config-driven "data last verified" date (replacing the stale hardcoded "April 2026"), About/Privacy links, and an empty affiliate-disclosure slot (activated post-launch).

## Capabilities

### New Capabilities
- `seo-surface`: site-config, per-page meta/canonical/OG tags, robots.txt, sitemap.xml, and prerendered vs-pages with staleness guarantees.
- `site-pages`: About and Privacy pages plus footer trust elements (freshness date, page links, disclosure slot).

### Modified Capabilities

(none — the price-display footer disclaimer wording is unchanged)

## Impact

- New files: `site-config.js`, `scripts/generate-seo.js`, `about.html`, `privacy.html`, `robots.txt`, `sitemap.xml`, `<brand>/vs/*.html` (generated), `tests/data/seo.test.js`, `tests/logic/footer.test.js`.
- Modified: `engine.js` (footer), each `<brand>/index.html` (site-config script tag + marker-delimited SEO head block), root `index.html` (meta), `tests/helpers/load-brand.js` (evaluate site-config.js like the real page does).
- No changes to brand `data.js` files; zero runtime dependencies added (generator is dev-time, reuses jsdom via the existing test loader).
