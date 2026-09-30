## Why

Of the 291 generated vs-pages, only 71 have any search or traffic signal. 202 have never had a Google impression, and Search Console lists 194 URLs as "Discovered – currently not indexed". Google judges quality at the site level from what it indexes, and its scaled-content policy targets name-swapped template pages. Asking it to evaluate ~290 near-identical pages is a risk with no measured upside.

Separately, the price-neighbour pairing rule regenerates the URL set on every price refresh. That has already deleted 11 pages that were earning impressions, including `/panasonic/vs/s1-ii-vs-s1h` (1 click, 47 impressions), and is why 404s in Search Console rose from 3 to 21 in September.

Data behind both points (GSC Jul 16–Sep 24 2026, GoatCounter all-time) is in `research/data.md`.

## What Changes

- **Split generated comparison pages into indexable and noindex sets.** A page is indexable if it is pinned or is a successor pair (excluding a short list of successor-rule false matches). All other pages still render and stay linked for visitors, but carry `<meta name="robots" content="noindex, follow">`.
- **Sitemap lists only indexable pages.** It drops from 303 to about 101 URLs: 89 vs-pages plus root, brand, compare, About and Privacy.
- **Add a pinned-pairs list (`PINNED_VS_PAIRS`) to the generator.** A pinned pair is always generated and always indexable, whatever the pairing rules produce. Seed it with the 50 pages that earned impressions, plus 4 pages dropped by price churn that had ≥5 impressions:
  - `panasonic` s1-ii vs s1h
  - `sony` fx3 vs a7s-iii
  - `fujifilm` x-t50 vs x100v
  - `canon` eos-r50v vs eos-r10
- **301 the reversed-order cross-brand URL** `/vs/canon-eos-r1-vs-sony-a9-iii` to `/vs/sony-a9-iii-vs-canon-eos-r1`.
- **Keep the other 6 dropped URLs (1–3 impressions each) as 404s.** They will drop out of Search Console.

No page is deleted, and no visitor-facing link or UI changes.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `seo-surface`:
  - The vs-page requirement gains pinned pairs that survive rule changes, plus an indexability split.
  - The sitemap requirement changes from "every vs-page" to "every indexable page".
  - New requirement: non-indexable generated pages carry `noindex, follow`.

## Impact

- **Code:**
  - `scripts/generate-seo.js`: pinned pairs merged into `curatedPairs` output and cross-brand matchups, an indexability decision, a robots meta tag in `vsPageHTML`/`crossVsPageHTML`, and `sitemapXML` input.
  - `_redirects`: new, for the one 301 (or `_worker.js` if the assets layer doesn't honour it; see design).
- **Generated output:** 202 vs-pages gain a robots meta tag; `sitemap.xml` shrinks; 4 restored vs-pages reappear.
- **Tests:** `tests/data/seo.test.js` (sitemap contents, indexability, pinned pairs resolve, restored pages exist) and the orphan and links tests (4 new pages).
- **Operations:** after deploy, resubmit the sitemap in Search Console, then review in about 8 weeks (see design).
