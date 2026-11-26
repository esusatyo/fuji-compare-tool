## Context

Static pages are generator-owned (`scripts/generate-seo.js`), built from brand `data.js` files,
and must be complete without JavaScript. Vs-pages, size pages, mount pages and guides already
follow that pattern; a camera page reuses their building blocks:

| Section | Existing source |
|---|---|
| Headline specs | `KeySpecs.tiles()` for one item; `VS_ROWS` formatters for the full table |
| Citations | `collectReferences()` / `referenceRowsHTML()` (one column) |
| Size drawing | `SizeDiagram.block({ entries: [one camera] })` (the credit card is always drawn) |
| Prices | `prices` (7 currencies; `null` → "—"; pre-release → "Price not announced") |
| Predecessor / successor | `forEachSuccessor()` (rule 1 of the vs-page pairing) |
| Mount and lens count | `mountModel()` → `/mount/<slug>`, `nLenses` |
| Vs and size links | the generated pair lists (`withPins(curatedPairs())`, `resolveMatchups()`) |
| Structured data | `productLd()`, `breadcrumbLd()`, `ldScript()` |

## Decisions (proposed)

### URL: `/<brand>/<slug>`
- File `fujifilm/x-t5.html`, URL `https://comparecameraspecs.com/fujifilm/x-t5` (extensionless,
  per the site's URL rule). Relative links resolve against `/fujifilm/`, like the brand page's.
- The brand tool keeps `/fujifilm/#cameras=x-t5`; the hash never reaches the server, so the two
  can't collide. A test fails if a camera slug equals a reserved directory or file stem
  (`vs`, `size`, `data`, `index`).
- Why not `/camera/<brand>-<slug>`: it separates the page from its brand's hub, and the brand
  prefix duplicates what the directory already says.

### Pilot rule (recommended: current cameras in ≥2 pinned vs-pages)
Pins are the site's only evidence of search demand (a click, ≥5 Google impressions, or ≥2 named
queries). A camera in two or more pinned pages has demand on more than one query. Today that is
18 cameras: Canon EOS R5 II, R50, R1, R5, R50 V, R10, R6 III; Sony a1 II, a7 V; Panasonic S9,
G9 II, S1 II, S1H, S1R II; Fujifilm X-T50, X-M5; Nikon ZR, Z5 II. The set moves with the pins,
so it stays evidence-led without a hand-kept list. Widening is one rule change.

The plan's alternative, "the cameras in indexable vs-pages", is 60 cameras (51 current) today,
three times the intended pilot.

### Indexability
Mirrors the vs-pages: pilot pages are indexable and in the sitemap; others (if generated) carry
`noindex, follow` and stay out of the sitemap; noindexed pages are never linked from the
brand table.

### Title and description
- Title: `<Brand> <Name> Specs, Size & Weight` (≤60 characters for every current camera, tested).
- Description built from the data only: sensor, IBIS, weight, dimensions, USD price.
- `<h1>`: `<Brand> <Name>`, one per page (the static-`<h1>` test covers it).

### What the page does not do
No prose verdicts, no "pros and cons", no review language, no ratings in structured data.
Specs, sizes, prices and sources, as everywhere else on the site.

## Risks

- **Scaled content.** Mitigated by the small, evidence-led pilot, the data-only content and the
  measurement gate before widening.
- **Cannibalisation** with vs-pages and size pages on "X vs Y" queries is unlikely (different
  query shape), but the review should check that vs-page impressions don't fall.
- **Thin pages for cameras with sparse data**: the pilot rule picks well-covered current
  bodies; a test requires the core fields (sensor, weight, dimensions, a USD price or
  pre-release flag, ≥1 spec citation) before a page is indexable.
