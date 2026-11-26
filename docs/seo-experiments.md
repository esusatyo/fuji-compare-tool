# SEO experiments — comparecameraspecs.com

Every change made to move search traffic is logged here when it ships, with the metric it
should move, the numbers before it, and the date to look again. Results are written in only
at review time, from Search Console, Bing Webmaster Tools and GoatCounter. Never estimate
or backfill one.

How to use it:

- Add a row when a change ships (the date it reached production, not the date the PR opened).
- Copy the baseline from data pulled before the change. If the baseline is a snapshot taken
  partway through an earlier experiment, say so.
- At the review date, fill in **Result** with the same metrics and windows as the baseline,
  then say what you conclude, including "no detectable effect".
- GoatCounter referrer and page counts include interaction events, so use them for shares
  (which page, which source), not as pageview totals.

## Baseline snapshot (pulled 2026-11-26, from the SEO plan of that date)

| Source | Window | Numbers |
|---|---|---|
| GoatCounter | 30 days (Oct 26 – Nov 26) | 366 pageviews; weekly 45, 50, 110, 142, then 19 so far that week (the Nov 9–22 bump was Reddit, mostly `/fujifilm`, 131 views). Referrers: Reddit ~220, Bing 75, DuckDuckGo 24, Google 2. Pages: home 144, brand pages 175, vs-pages 21, guides 5, size 4, mount 2, methodology 3. |
| Google Search Console | 28 days | 2 clicks, 139 impressions, average position 58.6. |
| Google Search Console | 90 days | 4 clicks, 757 impressions, average position 69.8. `/` 563 impressions; `canon/vs/eos-r50v-vs-eos-r50` 19; `vs/nikon-zf-vs-fujifilm-x-t5` 18. Head terms ("compare cameras", "camera size comparison") at position 60–90. |
| Google indexing | as of 2026-11-26 | 49 indexed, 133 not (redirect 46, noindex 33, 404 32, discovered 12, crawled-not-indexed 8). Sitemap read Nov 22 with 122 URLs; the report had not caught up with the 65 new size, mount and guide URLs. |
| Bing Webmaster | weekly, Oct 19 → Nov 16 | Impressions 359, 458, 368, 315, 246. Positions flat at 7–8 for "camera comparison" and "camera size comparison". |
| Bing Webmaster | 5 weeks to Nov 22 | Homepage 1,663 of ~1,750 page impressions, 31 clicks (~1–2% CTR). No size, guide or mount page has an impression. Index 141–147 pages, 0 5xx errors. |

## Experiments

| # | Change | Shipped | Metric | Baseline | Review | Result |
|---|---|---|---|---|---|---|
| 1 | **Homepage title and description lead with size and weight** (PR #81) | 2026-10-25 | Bing homepage CTR and impressions for "camera comparison" / "camera size comparison"; Google position of `/` on the same head terms | Pre-change baseline is recorded with PR #81. Mid-test snapshot (2026-11-26): Bing homepage 1,663 impressions / 31 clicks in 5 weeks, position 7–8; Google `/` 563 impressions in 90 days, position 60–90. | late Jan 2027 | not yet reviewed |
| 2 | **Size pages and `/size/`**: to-scale drawings in the tool and on vs-pages, one size page per indexable vs-pair (PR #91) | 2026-11-13 | Google and Bing impressions and clicks on `/size/` and `*/size/*` pages; size-intent queries ("X vs Y size") | Bing: no size page has an impression (5 weeks to Nov 22). GoatCounter: size pages 4 views in 30 days. Google: not yet in the indexing report. | 2027-01-12 (with the guides review; no date was set when it shipped) | not yet reviewed |
| 3 | **Guides**: data-led `/guides/` pages (lightest APS-C cameras, lightest APS-C zoom lenses) (PR #100), plus the first dated article (PR #103, 2026-11-21) | 2026-11-17 | Google and Bing impressions and clicks on `/guides/*` and `/articles/*`; GoatCounter views of those pages | GoatCounter: guides 5 views in 30 days. Bing: 0 impressions on any guide. | measure 2026-12-15 → 2027-01-12, verdict 2027-01-12 | not yet reviewed |
| 4a | **Vs-page "Lens mount" row names the mount** (`Z-Mount` vs `X-Mount`, `Fixed lens: …`) instead of "Interchangeable" on both sides; 253 of 289 vs-pages read "Interchangeable" twice (PR `seo-quick-wins-2026-11`) | on merge (fill in) | Content correctness; no traffic metric of its own. Watch vs-page engagement (`specs-seen` events on vs-pages) | vs-pages 21 views in 30 days | 2027-01-07 | not yet reviewed |
| 4b | **Static `<h1>`** on the 8 brand pages and `/compare/`, `/size/`, `/kit/`, so crawlers that don't run JavaScript see a heading (same PR) | on merge (fill in) | Bing impressions and clicks on brand pages and `/compare/` | Bing: the homepage takes 1,663 of ~1,750 page impressions in 5 weeks, so every other page together has ~90. GoatCounter: brand pages 175 views in 30 days (`/fujifilm` 131 during the Reddit bump). | 2027-01-07 | not yet reviewed |
| 4c | **`WebSite` + `Organization` JSON-LD on `/`** (same PR). Fixes how the site is named in Google results, not where it ranks | on merge (fill in) | The site name Google shows above the homepage result ("Compare Camera Specs" vs the bare domain) | Not recorded before the change: check what Google shows at the first review. | 2027-01-07 | not yet reviewed |
| 4d | **`BreadcrumbList` JSON-LD** on vs, size, mount, guide and article pages, 347 pages (same PR) | on merge (fill in) | Search Console → Enhancements → Breadcrumbs (valid items); breadcrumbs shown in results; Bing CTR on vs-pages | No breadcrumb markup before the change (0 items). Google: 2 clicks, position 58.6 in 28 days; vs-pages 21 GoatCounter views in 30 days. | 2027-01-07 | not yet reviewed |
| 4e | **Structured-data validation test** (same PR). A guard, not a traffic lever | on merge (fill in) | Search Console structured-data errors stay at 0 | Rich Results Test, live `vs/nikon-zf-vs-fujifilm-x-t5`, 2026-11-26: 5 valid items, 0 errors, non-critical warnings only (no review/aggregateRating, no Offer availability, no merchant shipping/returns) | 2027-01-07 | not yet reviewed |
