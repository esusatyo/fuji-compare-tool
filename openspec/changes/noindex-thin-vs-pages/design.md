## Context

`scripts/generate-seo.js` emits two kinds of vs-page:

- **Same-brand pages** (`<brand>/vs/<a>-vs-<b>.html`), from `curatedPairs(cams)`:
  - Rule 1: successors within a model line.
  - Rule 2: each current body with its two nearest USD-price neighbours.
  - Rule 3: a fallback for brands with fewer than two current bodies.
- **Cross-brand pages** (`vs/<brand>-<a>-vs-<brand>-<b>.html`), from the hand-curated `CROSS_BRAND_MATCHUPS`.

Every page is listed in `sitemap.xml`. Rules 2 and 3 depend on prices, so each price refresh adds and removes URLs. On production today (`origin/main` 637dd05) that means 291 vs-pages and 303 sitemap URLs.

`research/data.md` has the page-level evidence. In summary:

| Page type | Pages with any signal |
|---|---|
| Successor pairs | 46% |
| Cross-brand | 25% |
| Price-neighbour | 17% |

- 202 pages have no Search Console impressions.
- 11 pages that had impressions were deleted by price churn.

`research/query-evidence.md` adds the query-level view and sets the evidence bar this change uses: a page earns indexing with a click, or ≥5 impressions, or ≥2 distinct named queries. 29 pages meet it (including 4 that churn deleted). Its Appendix A "keep 89" list in `data.md` is superseded by that bar.

## Goals / Non-Goals

**Goals:**
- Ask Google to judge only pages with real evidence of demand, plus the "new vs previous model" pages of recent launches, while their search demand peaks.
- Make the indexable set stable: a price refresh must never remove an indexable URL.
- Bring back the 4 dropped pages that meet the evidence bar.

**Non-Goals:**
- Adding written content to vs-pages. That is the next change, and it will start with the pinned pages.
- Deleting any page, or changing the brand page, related links or other visitor-facing links.
- Changing the pairing rules themselves. Rule 2 still generates pages for visitors; they are just not indexed.
- Search Console automation. Resubmitting the sitemap stays a manual step.

## Decisions

### 1. Decide indexability in the generator, not with a robots.txt block
Non-indexable pages get `<meta name="robots" content="noindex, follow">` and are left out of the sitemap.
- *Why:* `noindex, follow` keeps link equity flowing through related links and still lets Google see the pages that are indexed.
- *Alternative rejected:* `Disallow` in robots.txt. Google can then never see the noindex, and blocked URLs can still be indexed without their content.

### 2. Indexable = pinned, or a successor pair whose newer body launched in or after `SUCCESSOR_INDEX_SINCE`
- Rule 1's pair detection moves into a shared `forEachSuccessor(cams, visit)`; `curatedPairs` uses it unchanged, and a sibling `successorPairKeys(cams)` exposes which pairs it produced. Rule 1 is price-gated only on the number line, so it is stable enough to trust automatically.
- `SUCCESSOR_INDEX_SINCE = 2025`. A successor pair is indexable when the newer body's `year` is at least this. A new release's "new vs previous model" page is therefore indexable from launch day with no manual step, which is when that search peaks.
- Older successor pairs are indexable only if pinned: the query data shows most of them earn nothing, and the ones that do (Canon R5 II/R5, R1/R3, Panasonic G9 II/G9, GH7/GH6, S9/S5) are pinned.
- The constant is a plain number, not "current year − 1", so the generated output never changes on its own when the calendar rolls over. Moving it is a deliberate edit at a Search Console review: pin any successor pair that has earned evidence first, then bump.
- *Alternatives rejected:*
  - Every successor pair (the earlier "89 pages" plan): indexes ~40 old-model pages that the query data says nobody searches for.
  - Pins only: nothing new could ever become indexable without a manual edit.
- The earlier `SUCCESSOR_NOINDEX` exclude list (Canon R8/R7, R7/R6, R3/R5, R50/R10) is dropped: all four are pre-2025 and so already non-indexable. If a future false match falls inside the window, add an exclude list then.

### 3. `PINNED_VS_PAIRS`: explicit, fails loudly, keeps URL order
- It is a flat list of page paths, as their URLs appear: `'panasonic/vs/s1-ii-vs-s1h'` and `'vs/sony-a1-ii-vs-canon-eos-r1'`.
- **Same-brand pins** are merged into that brand's pair set *in the exact slug order written*, so a restored page keeps the URL Google already knows. If the rules produce the pair in the other order, the pin's order replaces it in place; a pin the rules don't produce is appended, so rule-generated output (brand-page links, related links) doesn't shift.
- **Cross-brand pins** must name an existing `CROSS_BRAND_MATCHUPS` page. That list is hand-curated and therefore already stable; for those pages the pin only marks indexability.
- **A pin that names an unknown brand or slug, a missing cross page, or the same camera twice, throws.** This follows the `resolveMatchups` convention: a typo is caught by the generator, not by a crawler months later.
- Seed list: the 29 pages that meet the evidence bar in `research/query-evidence.md`.

### 4. The 301 lives in `_redirects`
- Add `_redirects` with one line: `/vs/canon-eos-r1-vs-sony-a9-iii /vs/sony-a9-iii-vs-canon-eos-r1 301`.
- Workers Static Assets supports `_redirects` alongside the existing `_headers`.
- *Fallback, if it isn't honoured with `main: _worker.js`* (check on the preview deploy, see Open Questions): add a small exact-match redirect map to `_worker.js`, run before `env.ASSETS.fetch()`.

### 5. Leave related links and the brand-page body block unchanged
Visitors still get every comparison. The orphan test and the links test keep their current meaning.

## Risks / Trade-offs

- **Noindexing a page that would have ranked later.**
  - Mitigation: affected pages earned at most 4 impressions in 10 weeks, from at most one distinct query.
  - Mitigation: noindex is reversible by adding a pin.
  - Mitigation: the 8-week review promotes any noindexed pair that starts appearing in Search Console queries.
- **Google only sees `noindex` when it crawls, and most of these pages have never been crawled.**
  - This is accepted: dropping them from the sitemap is the main effect.
  - The meta tag stops them being indexed later through internal links.
- **Pinned pairs outlive their cameras,** for example if a pinned camera is removed from `data.js`.
  - Mitigation: the generator throws, so the pin must be removed deliberately in the same PR.
- **The thin evidence base: 1.1K impressions and 6 clicks in total.**
  - Mitigation: the bar only needs one click, five impressions or two distinct queries, and pins are cheap to add at the review.
- **`SUCCESSOR_INDEX_SINCE` is never bumped,** so the window grows.
  - Accepted: rule 1 still requires the newer body to be current, so the set stays bounded by the current lineup. The 8-week review is the prompt to bump it.
- **`_redirects` may not apply in front of a Worker `main`.**
  - Mitigation: verify on the preview deploy, with a `_worker.js` fallback (Decision 4).

## Migration Plan

1. Merge, deploy, then fetch the live sitemap and check its count (54). Also check that one noindexed and one indexable page serve the right robots meta, that the 4 restored URLs return 200, and that the 301 works.
2. Resubmit `sitemap.xml` in Search Console.
3. About 8 weeks after deploy, run a Search Console review:
   - promote noindexed pairs that meet the evidence bar by adding pins;
   - consider moving `SUCCESSOR_INDEX_SINCE`, pinning any successor pair with evidence first;
   - record the outcome in the SEO log.
4. **Rollback:** revert the PR and regenerate. Nothing is deleted, so a rollback is lossless.

## Open Questions

- Does `_redirects` apply when `wrangler.jsonc` sets `main: _worker.js`? Check on the preview deploy before merging.
- OM System OM-3 vs OM-1 is a rule-1 pair but not strictly one model line (retro body, same sensor). It is a real head-to-head, so it stays indexable; revisit at the 8-week review.
