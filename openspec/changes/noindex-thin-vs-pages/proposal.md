## Why

Of the 291 generated vs-pages, only 71 have any search or traffic signal. 202 have never had a Google impression, and Search Console lists 194 URLs as "Discovered – currently not indexed". Google judges quality at the site level from what it indexes, and its scaled-content policy targets name-swapped template pages. Asking it to evaluate ~290 near-identical pages is a risk with no measured upside.

Query-level data sharpens that: every one of the 103 visible queries that reached a vs-page names that specific comparison, and most pages that earned impressions earned one or two in ten weeks. Real but negligible demand is not a reason to put a template page in front of Google's quality assessment.

Separately, the price-neighbour pairing rule regenerates the URL set on every price refresh. That has already deleted 11 pages that were earning impressions, including `/panasonic/vs/s1-ii-vs-s1h` (1 click, 47 impressions), and is why 404s in Search Console rose from 3 to 21 in September.

Data: `research/data.md` (GSC pages Jul 16–Sep 24 2026, GoatCounter all-time) and `research/query-evidence.md` (GSC queries Jul 16–Sep 28 2026), which defines the evidence bar used here.

## What Changes

- **Split generated comparison pages into indexable and noindex sets.** A page is indexable if it is **pinned**, or if it is a **recent successor pair**: a successor pair whose newer body launched in or after `SUCCESSOR_INDEX_SINCE` (2025). All other pages still render and stay linked for visitors, but carry `<meta name="robots" content="noindex, follow">`.
- **Add a pinned-pairs list (`PINNED_VS_PAIRS`) to the generator.** A pinned pair is always generated and always indexable, whatever the pairing rules produce. Seed it with the **29 pages that meet the evidence bar** in `research/query-evidence.md` (a click, or ≥5 impressions, or ≥2 distinct named queries). That includes 4 pages dropped by price churn, which are restored:
  - `panasonic` s1-ii vs s1h
  - `sony` fx3 vs a7s-iii
  - `fujifilm` x-t50 vs x100v
  - `canon` eos-r50v vs eos-r10
- **Indexable set: 42 vs-pages** — the 29 pins plus 13 recent successor pairs not already pinned (Canon R6 V/R6 III, R6 III/R6 II, R8 II/R8; Fujifilm X-T30 III/X-T30 II; Nikon Z5 II/Z5; OM System OM-5 II/OM-5, OM-3/OM-1; Panasonic S1R II/S1R, S1 II/S1, G97/G95; Sony A7R VI/A7R V, FX5/FX3, FX2/FX3).
- **Sitemap lists only indexable pages.** It drops from 303 to 54 URLs: 42 vs-pages plus root, 8 brand pages, compare, About and Privacy.
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
  - `scripts/generate-seo.js`: successor-pair tagging, `PINNED_VS_PAIRS` and `SUCCESSOR_INDEX_SINCE`, pinned pairs merged into each brand's pairs and checked against cross-brand matchups, an indexability decision, a robots meta tag in `vsPageHTML`/`crossVsPageHTML`, and `sitemapXML` input.
  - `_redirects`: new, for the one 301 (or `_worker.js` if the assets layer doesn't honour it; see design).
- **Generated output:** 4 restored vs-pages reappear (295 in total); the 253 non-indexable ones gain a robots meta tag; `sitemap.xml` shrinks to 54 URLs.
- **Tests:** `tests/data/seo.test.js` (sitemap contents, indexability, pinned pairs resolve, restored pages exist) and the orphan and links tests (4 new pages).
- **Operations:** after deploy, resubmit the sitemap in Search Console, then review in about 8 weeks (see design).
