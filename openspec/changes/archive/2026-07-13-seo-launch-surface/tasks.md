## 1. Site config + engine footer (Phases C/E core)

- [x] 1.1 Create root `site-config.js` (`SITE_CONFIG` global: placeholder `baseUrl`, `siteName`, `dataVerified: '2026-07-03'`) with TODO(launch) comment
- [x] 1.2 Add `<script src="../site-config.js"></script>` before `data.js` in every brand `index.html`
- [x] 1.3 engine.js footer: `SITE_CONFIG.dataVerified`-driven "last verified" line (typeof-guarded), About/Privacy links, empty `#affiliate-disclosure` element; drop hardcoded "April 2026"
- [x] 1.4 `tests/helpers/load-brand.js`: evaluate `site-config.js` before `data.js`, expose `SITE_CONFIG` to tests

## 2. SEO generator (Phases C/D)

- [x] 2.1 Add `<!-- seo:begin -->/<!-- seo:end -->` markers to each brand `index.html` and root `index.html`
- [x] 2.2 `scripts/generate-seo.js`: pure builders (head blocks w/ description+canonical+OG/Twitter, vs-page HTML, sitemap, robots) + CLI that writes everything; fail loudly on missing markers
- [x] 2.3 Pairing rules: model-line successors derived from slug structure (roman-numeral generations + digit-count tiers with ±40% price gate; newer not discontinued) + two nearest USD-price neighbours among non-discontinued, deduped
- [x] 2.4 vs-page template: title/desc/canonical, JSON-LD (ItemList of Products), intro, spec table from schema-guaranteed fields, deep link `../index.html#cameras=<a>,<b>`, link to About
- [x] 2.5 Run the generator; commit `<brand>/vs/*.html`, `sitemap.xml`, `robots.txt`, updated head blocks

## 3. Trust pages (Phase E)

- [x] 3.1 `about.html` — what/how sourced/who; self-contained; links to tool and privacy
- [x] 3.2 `privacy.html` — cookieless Umami, localStorage prefs, outbound Amazon links; self-contained

## 4. Tests & wrap-up

- [x] 4.1 `tests/data/seo.test.js` (Tier 1): regenerate in memory, byte-compare vs committed vs-pages/sitemap/robots/head blocks; sitemap covers every brand + vs page; pair-count sanity (≪ all-pairs)
- [x] 4.2 `tests/logic/footer.test.js` (Tier 2): verified date renders from config, About/Privacy links present, disclosure slot empty, graceful without SITE_CONFIG
- [x] 4.3 `npm test` green; `openspec validate seo-launch-surface --strict` passes
- [ ] 4.4 Manual smoke test: open a vs-page locally, click through to preselected comparison
