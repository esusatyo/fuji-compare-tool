## Why

The site's crawlable SEO surface is built but unreachable. The generator emits 143 static vs-pages with real spec tables and JSON-LD — and **not a single page links to any of them**. They exist only in `sitemap.xml`. A sitemap gets a URL crawled; internal links are what tell a search engine a page matters and pass authority to it, so the entire vs-page investment is currently earning a fraction of what it should.

Two structural problems compound it: the root URL — the most authoritative URL on the domain, and the natural target for head terms like "compare camera specs" — is an empty `<body>` that JS-redirects to `/canon/`, so it can rank for nothing. And every brand page (`/canon/`, `/sony/`, …) renders 100% client-side, because `engine.js` overwrites `document.body`, leaving no crawlable content and no place to put internal links.

Cloudflare RUM confirms there is no search traffic yet (48 of 51 recent page loads were self-referred, zero from search engines), and it structurally cannot report on crawlers. This change builds the surface Google needs before measurement is meaningful.

## What Changes

- **Root page becomes a real, indexable landing page** listing all five brands with crawlable copy and links to each brand page and a selection of vs-pages. **BREAKING** for the `brand-picker` contract: the redirect is no longer unconditional.
  - First-time visitors and crawlers (no `localStorage['brand']`) get the landing page.
  - Returning visitors (valid `localStorage['brand']`) still redirect straight to their brand, hash preserved.
  - This is not cloaking: the branch is on client-side stored state, never on user-agent. A crawler sees exactly what a first-time human sees.
- **`engine.js` renders into a `<div id="app">` container** instead of `document.body`, so static server-authored content outside the container survives rendering. **BREAKING** for the brand-page loader contract: each `<brand>/index.html` body gains `#app` plus a generated static block.
- **Brand pages gain a generator-owned static block** — crawlable intro copy with the brand's live camera/lens counts, and links to that brand's vs-pages.
- **Each vs-page gains "related comparisons" links** to other vs-pages for the same brand, turning 143 orphans into a connected cluster.
- **Sitemap/robots unchanged** — already correct.

Explicitly **out of scope**: cross-brand comparison pages ("Canon R6 II vs Sony A7 IV"). High-value for search but a separate change; the one-brand-per-page invariant stands.

## Capabilities

### New Capabilities
- `home-landing`: the root page as an indexable landing page — its crawlable content, brand links, and how it coexists with the stored-preference redirect.

### Modified Capabilities
- `brand-picker`: "Root page defaults to Canon" currently requires the redirect to happen "with no user interaction" for visitors with no stored preference. That becomes: redirect only when a valid preference is stored; otherwise render the landing page.
- `brand-engine`: add a requirement that the engine renders into `#app` and MUST NOT destroy static content outside it.
- `seo-surface`: add internal-linking requirements (brand-page static blocks, vs-page related links) so no generated page is orphaned; extend the existing anti-staleness guarantee to the new generated blocks.

## Impact

- **`index.html`** (root) — redirect script rewritten; real body content, generator-owned.
- **`engine.js`** — render target changes from `document.body` to `#app` (line ~399); brand-page loaders gain `#app`.
- **`<brand>/index.html`** × 5 — gain `#app` and a generated static block with seo markers.
- **`scripts/generate-seo.js`** — emits landing-page body, brand static blocks, related-comparison links; picks related pairs deterministically.
- **143 `vs/*.html`** — regenerated with related links.
- **`tests/`** — `tests/data/seo.test.js` (anti-staleness) extends to new blocks; Tier 2 jsdom tests assert the engine preserves static content and the root page's conditional redirect. New test: no generated page is orphaned.
- **Risk**: `engine.js` and the root redirect are shared by every brand; the anti-staleness test means any data edit without regeneration fails `npm test`, as today.
