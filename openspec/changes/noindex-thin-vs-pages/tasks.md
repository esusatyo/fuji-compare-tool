One commit per task, with that task's tick included in the commit. All work ships in one PR from branch `noindex-thin-vs-pages`.

## 1. Generator: pins and indexability

- [x] 1.1 Move rule 1's pair detection into a shared `forEachSuccessor(cams, visit)` in `scripts/generate-seo.js`, and expose `successorPairKeys(cams)` built on it. Leave the output of `curatedPairs` unchanged.
- [x] 1.2 Add `SUCCESSOR_INDEX_SINCE = 2025`: a successor pair whose newer body's `year` is at least this is indexable without a pin.
- [x] 1.3 Add `PINNED_VS_PAIRS`, seeded with the 29 pages that meet the evidence bar in `research/query-evidence.md`. They include the 4 restores:
  - `panasonic/vs/s1-ii-vs-s1h`
  - `sony/vs/fx3-vs-a7s-iii`
  - `fujifilm/vs/x-t50-vs-x100v`
  - `canon/vs/eos-r50v-vs-eos-r10`
- [x] 1.4 Resolve pins in `buildAll`:
  - merge same-brand pins into each brand's pairs in pinned slug order: replace a reversed rule pair in place, append any pair the rules don't produce;
  - check that cross-brand pins match a `resolveMatchups` file;
  - throw on unknown brand, slug or page, or on an `a === b` pair.
- [x] 1.5 Compute `indexable` per page (pinned, or a successor pair whose newer body launched in or after `SUCCESSOR_INDEX_SINCE`). Emit `<meta name="robots" content="noindex, follow">` in `vsPageHTML` and `crossVsPageHTML` heads for non-indexable pages.
- [x] 1.6 Pass only indexable vs-page paths to `sitemapXML`. Leave `robots.txt` unchanged.

## 2. Tests (Tier 1, `tests/data/seo.test.js` unless noted)

- [x] 2.1 Replace the "sitemap covers … every vs-page" test: the sitemap must contain every indexable vs-page and no page whose HTML contains `noindex`.
- [x] 2.2 Every generated vs-page has exactly one of: a robots `noindex, follow` meta tag, or a sitemap entry. Neither-or-both fails.
- [x] 2.3 Every `PINNED_VS_PAIRS` entry is generated at exactly its path and is indexable. Add a unit test that a pin naming an unknown slug makes `buildAll` throw.
- [x] 2.4 Every successor pair whose newer body launched in or after `SUCCESSOR_INDEX_SINCE` is indexable; every other unpinned page is not.
- [x] 2.5 `robots.txt` has no `Disallow` rule matching `/vs/`.
- [x] 2.6 Run `node scripts/generate-seo.js` and then `npm test`. Confirm:
  - the sitemap has 54 URLs (42 vs-pages + root, 8 brand pages, compare, About, Privacy);
  - the 4 restored pages exist;
  - the orphan and links tests pass.

## 3. Redirect

- [x] 3.1 Add `_redirects` with `/vs/canon-eos-r1-vs-sony-a9-iii /vs/sony-a9-iii-vs-canon-eos-r1 301`. Check that `tests/data/orphan-links.test.js` and `links-offline` don't treat the file as a page.
- [x] 3.2 On the branch's Cloudflare preview, check with `curl -sI` that the 301 fires. If `_redirects` isn't honoured in front of `main: _worker.js`, move the redirect into `_worker.js` as an exact-match map (with a Tier "Worker" test) and delete `_redirects`.

## 4. Verify and document

- [x] 4.1 Run `npm run test:links` (a URL set changed, per the standing rule).
- [x] 4.2 On the preview, spot-check:
  - one noindexed page and one indexable page serve the right robots meta;
  - the preview's `sitemap.xml` count is correct;
  - the 4 restored URLs return 200.
- [x] 4.3 Update CLAUDE.md's "Adding / changing things" with what makes a vs-page indexable, how to pin or unpin one, that pins throw when a camera is removed, and when to move `SUCCESSOR_INDEX_SINCE`.
- [x] 4.4 `openspec validate noindex-thin-vs-pages --strict` passes. Open the PR (no session link).

## 5. After merge (manual)

- [ ] 5.1 Deploy, then check the live sitemap count, the 301, and the robots meta on production. Resubmit `sitemap.xml` in Search Console.
- [ ] 5.2 About 8 weeks after deploy: re-pull Search Console pages and queries, then promote pins and consider moving `SUCCESSOR_INDEX_SINCE` per design.md Migration step 3. Log the result in the SEO usage log.
