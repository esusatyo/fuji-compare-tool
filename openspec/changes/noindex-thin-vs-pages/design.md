## Context

`scripts/generate-seo.js` emits two kinds of vs-page:

- **Same-brand pages** (`<brand>/vs/<a>-vs-<b>.html`), from `curatedPairs(cams)`:
  - Rule 1: successors within a model line.
  - Rule 2: each current body with its two nearest USD-price neighbours.
  - Rule 3: a fallback for brands with fewer than two current bodies.
- **Cross-brand pages** (`vs/<brand>-<a>-vs-<brand>-<b>.html`), from the hand-curated `CROSS_BRAND_MATCHUPS`.

Every page is listed in `sitemap.xml`. Rules 2 and 3 depend on prices, so each price refresh adds and removes URLs. On production today (`origin/main` 637dd05) that means 291 vs-pages and 303 sitemap URLs.

`research/data.md` has the full evidence and the page-by-page keep and noindex lists. In summary:

| Page type | Pages with any signal |
|---|---|
| Successor pairs | 46% |
| Cross-brand | 25% |
| Price-neighbour | 17% |

- 202 pages have no Search Console impressions.
- 11 pages that had impressions were deleted by price churn.

## Goals / Non-Goals

**Goals:**
- Ask Google to judge only pages that have evidence of search demand (impressions) or match the most common comparison search (successor pairs).
- Make the indexable set stable: a price refresh must never remove an indexable URL.
- Bring back the 4 dropped pages that earned 5 or more impressions.

**Non-Goals:**
- Adding written content to vs-pages. That is the next change, and it will start with the 21 pages that have 5 or more impressions.
- Deleting any page, or changing the brand page, related links or other visitor-facing links.
- Changing the pairing rules themselves. Rule 2 still generates pages for visitors; they are just not indexed.
- Search Console automation. Resubmitting the sitemap stays a manual step.

## Decisions

### 1. Decide indexability in the generator, not with a robots.txt block
Non-indexable pages get `<meta name="robots" content="noindex, follow">` and are left out of the sitemap.
- *Why:* `noindex, follow` keeps link equity flowing through related links and still lets Google see the pages that are indexed.
- *Alternative rejected:* `Disallow` in robots.txt. Google can then never see the noindex, and blocked URLs can still be indexed without their content.

### 2. Indexable = pinned, or a successor pair not on an exclude list
- Add `curatedPairs` tagging: return, or expose through a sibling `successorPairKeys(cams)`, which pairs came from rule 1. Rule 1 is price-gated only on the number line, so it is stable enough to trust automatically. This also means a new release's "new vs previous model" page is indexable from launch day with no manual step.
- Add `SUCCESSOR_NOINDEX`, a short list of known rule-1 false matches, starting with Canon R8/R7, R7/R6, R3/R5 and R50/R10. These share a number stem but are not one model line. An exclude list is simpler than tightening the stem regex, which would change the generated page set for every brand.
- *Alternative rejected:* an indexability rule driven only by impression data. Nothing new could ever become indexable without a manual edit.

### 3. `PINNED_VS_PAIRS`: explicit, fails loudly, keeps URL order
- It is a flat list of page paths, as their URLs appear: `'panasonic/vs/s1-ii-vs-s1h'` and `'vs/sony-a1-ii-vs-canon-eos-r1'`.
- **Same-brand pins** are unioned into that brand's pair set *in the exact slug order written*, so a restored page keeps the URL Google already knows. If the rules also produce the pair in the other order, the pin's order wins and the rule's duplicate is dropped.
- **Cross-brand pins** must name an existing `CROSS_BRAND_MATCHUPS` page. That list is hand-curated and therefore already stable; for those pages the pin only marks indexability.
- **A pin that names an unknown brand or slug, or a missing cross page, throws.** This follows the `resolveMatchups` convention: a typo is caught by the generator, not by a crawler months later.
- Seed list: the 50 impression-earning live pages plus the 4 restores listed in the proposal.

### 4. The 301 lives in `_redirects`
- Add `_redirects` with one line: `/vs/canon-eos-r1-vs-sony-a9-iii /vs/sony-a9-iii-vs-canon-eos-r1 301`.
- Workers Static Assets supports `_redirects` alongside the existing `_headers`.
- *Fallback, if it isn't honoured with `main: _worker.js`* (check on the preview deploy, see Open Questions): add a small exact-match redirect map to `_worker.js`, run before `env.ASSETS.fetch()`.

### 5. Leave related links and the brand-page body block unchanged
Visitors still get every comparison. The orphan test and the links test keep their current meaning.

## Risks / Trade-offs

- **Noindexing a page that would have ranked later.**
  - Mitigation: only pages with zero impressions over 10 weeks are affected.
  - Mitigation: noindex is reversible by adding a pin.
  - Mitigation: the 8-week review promotes any noindexed pair that starts appearing in Search Console queries.
- **Google only sees `noindex` when it crawls, and most of these pages have never been crawled.**
  - This is accepted: dropping them from the sitemap is the main effect.
  - The meta tag stops them being indexed later through internal links.
- **Pinned pairs outlive their cameras,** for example if a pinned camera is removed from `data.js`.
  - Mitigation: the generator throws, so the pin must be removed deliberately in the same PR.
- **The thin evidence base: 1.1K impressions and 6 clicks in total.**
  - Mitigation: the decision rule only acts where the evidence is zero; it doesn't try to rank pages that have data.
- **`_redirects` may not apply in front of a Worker `main`.**
  - Mitigation: verify on the preview deploy, with a `_worker.js` fallback (Decision 4).

## Migration Plan

1. Merge, deploy, then fetch the live sitemap and check its count (about 101). Also check that one noindexed and one indexable page serve the right robots meta, that the 4 restored URLs return 200, and that the 301 works.
2. Resubmit `sitemap.xml` in Search Console.
3. About 8 weeks after deploy, run a Search Console review:
   - promote noindexed pairs that appear in queries by adding pins;
   - drop pins for discontinued-body successor pairs that still have 0 impressions;
   - record the outcome in the SEO log.
4. **Rollback:** revert the PR and regenerate. Nothing is deleted, so a rollback is lossless.

## Open Questions

- Does `_redirects` apply when `wrangler.jsonc` sets `main: _worker.js`? Check on the preview deploy before merging.
- Should successor pairs where *both* bodies are discontinued stay indexable? Rule 1 already requires the newer body to be current, so none exist today. Revisit at the 8-week review.
