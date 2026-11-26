## 1. Vs-page lens mount row

- [x] 1.1 `generate-seo.js`: "Lens mount" shows the mount label (or "Fixed lens: <lensSpec>"); rows called with the brand config
- [x] 1.2 `tests/data/vs-lens-mount.test.js`: no vs-page shows the same cell for two different mounts; regenerate

## 2. Static `<h1>`

- [x] 2.1 `generate-seo.js`: static `<h1 data-static-hero>` in the body block of every brand page and `/compare/`, `/size/`, `/kit/`
- [x] 2.2 `engine.js`: adopt the static `<h1>` as the hero; `engine.css` `.seo-h1`
- [x] 2.3 Tests: one `<h1>` in every generated page's static HTML; one after a jsdom render; regenerate

## 3. Homepage structured data

- [x] 3.1 `WebSite` + `Organization` JSON-LD in the root head block; title and description unchanged; test; regenerate

## 4. Breadcrumbs

- [x] 4.1 `BreadcrumbList` JSON-LD on vs-pages, size pages, mount pages, guides and articles; test; regenerate

## 5. Structured-data validation

- [x] 5.1 `tests/data/structured-data.test.js`: every JSON-LD block parses, has `@context`, required fields per type, no ratings or reviews
- [x] 5.2 Rich Results Test on one live vs-page; result in the PR
  - 2026-11-26, `https://comparecameraspecs.com/vs/nikon-zf-vs-fujifilm-x-t5` (production, before this change deploys): crawled OK, 5 valid items (Product snippets 2, Merchant listings 2, Carousels 1), 0 errors. Non-critical only: `review` / `aggregateRating` (left out on purpose: no reviews exist), Offer `availability`, merchant `description` / `shippingDetails` / `hasMerchantReturnPolicy`, carousel item `url`. Breadcrumbs can only be checked after deploy.

## 6. Experiments log

- [x] 6.1 `docs/seo-experiments.md` seeded with the homepage title, size pages, guides and this change

## 7. Ship

- [ ] 7.1 `add-camera-pages` OpenSpec proposal (Phase 2, proposal only)
- [ ] 7.2 `npm test`, `openspec validate seo-quick-wins-2026-11 --strict`, PR
