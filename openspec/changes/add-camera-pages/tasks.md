## 0. Approval (owner)

- [ ] 0.1 Owner approves the design and answers the open questions in proposal.md (URL shape, pilot rule, non-pilot and discontinued cameras, lenses, finder links)

## 1. Pages

- [ ] 1.1 `generate-seo.js`: camera page model (specs, citations, size, prices, predecessor/successor, mount + lens count, vs/size links)
- [ ] 1.2 Camera page template, `Product` + `BreadcrumbList` JSON-LD, share card
- [ ] 1.3 Pilot indexability rule, sitemap entries, `noindex` for the rest (per owner decision), stale-file removal
- [ ] 1.4 `tests/data/camera-pages.test.js` (reserved slugs, titles ≤60 characters, core fields before indexing, links resolve); regenerate; render share cards

## 2. Links

- [ ] 2.1 Brand at-a-glance table links indexable camera pages
- [ ] 2.2 Vs-page product cards and mount pages link camera pages
- [ ] 2.3 Analytics event grammar, `privacy.html`

## 3. Docs, measurement and ship

- [ ] 3.1 `CLAUDE.md`; `docs/seo-experiments.md` row (metric: model-name query impressions; review 6–8 weeks after ship)
- [ ] 3.2 `npm test`, `npm run test:links`, `openspec validate add-camera-pages --strict`, screenshots
- [ ] 3.3 PR

## 4. Optional: "Which should you pick?" on vs-pages (only if the owner approves templates)

- [ ] 4.1 Owner approves sentence templates
- [ ] 4.2 Generate from `KeySpecs` verdict rules; test that every sentence is backed by a differing value
