## 1. Generator

- [ ] 1.1 Add `lastmodManifest()` and page-content hashing to `scripts/generate-seo.js`; emit `<lastmod>` per sitemap entry and `sitemap-lastmod.json` as a generated artifact
- [ ] 1.2 Seed the first manifest from git history and regenerate; `npm test` green

## 2. Tests

- [ ] 2.1 Extend `tests/data/seo.test.js`: every sitemap URL has a `<lastmod>` matching the manifest, the manifest covers exactly the sitemap, hashes match current content, and `lastmodManifest` keeps/stamps/drops correctly

## 3. Workflow and docs

- [ ] 3.1 Pre-commit hook stages `sitemap-lastmod.json`; CLAUDE.md documents `<lastmod>`
- [ ] 3.2 Data skills (refresh-camera-data, add-thirdparty-lenses, check-prices-and-buy-links, fetch-product-images, add-camera-brand) say regeneration moves `<lastmod>` and the manifest is committed with the data change; fix the claim in `docs/seo-manual-tasks.md`

## 4. Growth backlog

- [ ] 4.1 Write `docs/growth-backlog.md` with the four deferred growth ideas (homepage quick-compare, size-comparison pages, static brand-page specs, earning links) and the evidence behind each

## 5. After merge

- [ ] 5.1 Confirm the live sitemap carries `<lastmod>`; resubmit it in Google Search Console
- [ ] 5.2 Archive this change
