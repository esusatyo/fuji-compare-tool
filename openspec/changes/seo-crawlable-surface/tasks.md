## 1. Search Console (do first — unblocks measurement, not code)

- [ ] 1.1 Verify `comparecameraspecs.com` in Google Search Console (DNS TXT via Cloudflare is easiest given the domain is already there)
- [ ] 1.2 Submit `https://comparecameraspecs.com/sitemap.xml` and record the baseline: indexed page count, impressions, queries
- [ ] 1.3 Run URL Inspection on `/`, `/canon/`, and one vs-page; note for each whether Google reports content found — this is the before-picture the rest of the change is judged against

## 2. Engine render container (unblocks every static block)

- [ ] 2.1 Change `engine.js:399` to render into `document.getElementById('app') || document.body`
- [ ] 2.2 Add `<div id="app"></div>` to `tests/helpers/load-brand.js:63`'s JSDOM boot document
- [ ] 2.3 Add `<div id="app"></div>` to each of the 5 `<brand>/index.html` bodies, before the script tags
- [ ] 2.4 Tier 2 test: static content placed outside `#app` survives engine render
- [ ] 2.5 Tier 2 test: engine still renders when no `#app` exists (fallback)
- [ ] 2.6 Run `npm test` — all 268 existing tests must still pass before going further

## 3. Generator: body-block plumbing

- [ ] 3.1 Generalize `withHeadBlock(html, block, file)` into `withBlock(html, block, file, begin, end)`, preserving the "markers missing → throw" behaviour; keep head-block callers working
- [ ] 3.2 Add `SEO_BODY_BEGIN` / `SEO_BODY_END` marker constants
- [ ] 3.3 Add `<!-- seo:body:begin -->` / `<!-- seo:body:end -->` markers to the 5 brand `index.html` bodies, after `#app`
- [ ] 3.4 Add the same markers to root `index.html`'s body
- [ ] 3.5 Unit-level check: a file missing either body marker makes the generator exit non-zero

## 4. Generator: brand-page static blocks

- [ ] 4.1 Write `brandBodyBlock(brand, data, site)` — brand prose with live camera/lens counts, plus links to that brand's curated vs-pages
- [ ] 4.2 Wire it into `buildAll()` so brand `index.html` gets both head and body blocks
- [ ] 4.3 Add minimal styles for the block to `engine.css` (it renders below the tool; must not fight the existing layout)
- [ ] 4.4 Regenerate and eyeball one brand page in the browser at `http://localhost:3456/canon/` — tool on top, links below, nothing overlapping

## 5. Generator: vs-page related comparisons

- [ ] 5.1 Write `relatedPairs(allPairs, a, b)` — other curated pairs sharing camera `a` or `b`, ranked (shared-camera first, then newer year, then USD, then slug), capped at 6
- [ ] 5.2 Render a "Related comparisons" list into `vsPageHTML()` using it
- [ ] 5.3 Test: related links are deterministic across two generator runs
- [ ] 5.4 Test: every related link target exists in the generated file set

## 6. Landing page

- [ ] 6.1 Write `rootBodyBlock(site, brands)` — h1, descriptive copy, one card per registered brand with live counts linking to `./<brand>/`, plus a deterministic selection of vs-page links
- [ ] 6.2 Rewrite the root redirect script: redirect only when `localStorage['brand']` is a valid registered brand; otherwise fall through and render. Keep `location.replace` and hash preservation
- [ ] 6.3 Add landing-page styles (self-contained in root `index.html`, matching `about.html`/`privacy.html` conventions)
- [ ] 6.4 Tier 2 test: no `localStorage['brand']` → no redirect, landing content present
- [ ] 6.5 Tier 2 test: valid `localStorage['brand']` → `location.replace` to that brand, hash preserved
- [ ] 6.6 Tier 2 test: invalid `localStorage['brand']` value → no redirect, landing content present (behaviour change — previously redirected to Canon)
- [ ] 6.7 Update the existing root-redirect Tier 2 tests that assert unconditional redirect; they encode the removed requirement and will fail by design

## 7. Orphan prevention

- [ ] 7.1 Tier 1 test: build `buildAll()` in memory, extract every `<a href>`, resolve relative to each containing file, assert every generated page except the root is linked from at least one other page — failing with the orphan's path
- [ ] 7.2 Same test: assert every internal href resolves to a path that exists in the generated set (catches typo'd links)
- [ ] 7.3 Confirm the test actually fails when a link is removed — introduce a break, watch it fail, revert. An orphan test that can't fail is worthless, and this bug already shipped once undetected

## 8. Verify and ship

- [ ] 8.1 Regenerate everything: `node scripts/generate-seo.js`
- [ ] 8.2 `npm test` — full suite green, including the anti-staleness test proving committed output matches the generator
- [ ] 8.3 `RUN_LINK_TESTS=1 npm run test:links` — the new internal links are relative, but confirm nothing broke
- [ ] 8.4 Browser pass at `http://localhost:3456/`: fresh profile → landing page renders; click into a brand; reload `/` → now redirects (localStorage set); clear storage → landing page again
- [ ] 8.5 Fetch a page with JS disabled (or `curl`) and confirm the root and brand pages contain real body content and links in the served HTML
- [ ] 8.6 `openspec validate seo-crawlable-surface --strict`
- [ ] 8.7 Branch, commit, PR (omit the session link per repo convention)

## 9. After merge (measurement — the point of the exercise)

- [ ] 9.1 Re-run URL Inspection on `/` and `/canon/` in Search Console; request indexing for the root
- [ ] 9.2 At ~2 weeks: compare indexed page count against the 1.2 baseline — the vs-pages should start appearing
- [ ] 9.3 At ~4–6 weeks: review Search Console queries. If comparison terms are landing on vs-pages, the cluster works and cross-brand pages become the obvious next change
