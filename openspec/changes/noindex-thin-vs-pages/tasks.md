One commit per task, with that task's tick included in the commit. All work ships in one PR from branch `noindex-thin-vs-pages`.

## 1. Generator: pins and indexability

- [ ] 1.1 Expose which same-brand pairs come from rule 1 (successor) in `scripts/generate-seo.js`, for example `successorPairKeys(cams)` built on the existing `romanLine`/`numberLine` logic. Leave the output of `curatedPairs` unchanged.
- [ ] 1.2 Add `SUCCESSOR_NOINDEX`, seeded with the four Canon false matches:
  - `canon/vs/eos-r8-vs-eos-r7`
  - `canon/vs/eos-r7-vs-eos-r6`
  - `canon/vs/eos-r3-vs-eos-r5`
  - `canon/vs/eos-r50-vs-eos-r10`
- [ ] 1.3 Add `PINNED_VS_PAIRS`, seeded with the 50 impression-earning live pages from `research/data.md` Appendix A (every row there that isn't a zero-impression successor), plus the 4 restores:
  - `panasonic/vs/s1-ii-vs-s1h`
  - `sony/vs/fx3-vs-a7s-iii`
  - `fujifilm/vs/x-t50-vs-x100v`
  - `canon/vs/eos-r50v-vs-eos-r10`
- [ ] 1.4 Resolve pins in `buildAll`:
  - union same-brand pins into each brand's pairs in pinned slug order, dropping any reversed duplicate;
  - check that cross-brand pins match a `resolveMatchups` file;
  - throw on unknown brand, slug or page, or on an `a === b` pair.
- [ ] 1.5 Compute `indexable` per page (pinned, or successor and not excluded). Emit `<meta name="robots" content="noindex, follow">` in `vsPageHTML` and `crossVsPageHTML` heads for non-indexable pages.
- [ ] 1.6 Pass only indexable vs-page paths to `sitemapXML`. Leave `robots.txt` unchanged.

## 2. Tests (Tier 1, `tests/data/seo.test.js` unless noted)

- [ ] 2.1 Replace the "sitemap covers … every vs-page" test: the sitemap must contain every indexable vs-page and no page whose HTML contains `noindex`.
- [ ] 2.2 Every generated vs-page has exactly one of: a robots `noindex, follow` meta tag, or a sitemap entry. Neither-or-both fails.
- [ ] 2.3 Every `PINNED_VS_PAIRS` entry is generated at exactly its path and is indexable. Add a unit test that a pin naming an unknown slug makes `buildAll` throw.
- [ ] 2.4 Every successor pair not in `SUCCESSOR_NOINDEX` is indexable. Each `SUCCESSOR_NOINDEX` entry is a real generated page, so a stale exclude fails the test.
- [ ] 2.5 `robots.txt` has no `Disallow` rule matching `/vs/`.
- [ ] 2.6 Run `node scripts/generate-seo.js` and then `npm test`. Confirm:
  - the sitemap has about 101 URLs (89 vs-pages + root, 8 brand pages, compare, About, Privacy);
  - the 4 restored pages exist;
  - the orphan and links tests pass.

## 3. Redirect

- [ ] 3.1 Add `_redirects` with `/vs/canon-eos-r1-vs-sony-a9-iii /vs/sony-a9-iii-vs-canon-eos-r1 301`. Check that `tests/data/orphan-links.test.js` and `links-offline` don't treat the file as a page.
- [ ] 3.2 On the branch's Cloudflare preview, check with `curl -sI` that the 301 fires. If `_redirects` isn't honoured in front of `main: _worker.js`, move the redirect into `_worker.js` as an exact-match map (with a Tier "Worker" test) and delete `_redirects`.

## 4. Verify and document

- [ ] 4.1 Run `npm run test:links` (a URL set changed, per the standing rule).
- [ ] 4.2 On the preview, spot-check:
  - one noindexed page and one indexable page serve the right robots meta;
  - the preview's `sitemap.xml` count is correct;
  - the 4 restored URLs return 200.
- [ ] 4.3 Update CLAUDE.md's "Adding / changing things" with what makes a vs-page indexable, how to pin or unpin one, and that pins throw when a camera is removed.
- [ ] 4.4 `openspec validate noindex-thin-vs-pages --strict` passes. Open the PR (no session link).

## 5. After merge (manual)

- [ ] 5.1 Deploy, then check the live sitemap count, the 301, and the robots meta on production. Resubmit `sitemap.xml` in Search Console.
- [ ] 5.2 About 8 weeks after deploy: re-pull Search Console pages and queries, then promote or demote pins per design.md Migration step 3. Log the result in the SEO usage log.
