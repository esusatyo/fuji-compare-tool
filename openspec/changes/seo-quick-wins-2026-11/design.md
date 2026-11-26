## Context

Every page the fix touches is generator-owned (`scripts/generate-seo.js`) or a thin loader whose
crawlable content sits in a generator-owned block. The engine (`engine.js`) renders the header,
hero and tool into `#app`; static blocks follow `#app`.

## Decisions

### Lens mount row: label from `BRAND_CONFIG.mounts`
`VS_ROWS` formatters take the camera; the "Lens mount" formatter also needs the camera's brand
config, so the rows are called as `fn(camera, brandConfig)`. The text is the mount's `label`,
plus ` (<system>)` when the mount declares a `system` (Fujifilm `G-Mount (GFX)`), the same name
the mount pages use. A fixed-lens camera reads `Fixed lens: <lensSpec>` (or `Fixed lens`
without one). An unknown mount id throws, like every other generator data error. The other
tables that reuse `VS_ROWS` (brand at-a-glance, mount pages) and the key-spec tiles and size
pages do not show the row, so only vs-pages change.

Not done: linking the cell to the mount page. It would add internal links to every vs-page;
left as a follow-up for the owner to decide.

### Static `<h1>`: the static element becomes the hero
Three options were on the table: the engine demotes its `<h1>`, skips it, or adopts the static
one. Demoting would leave the page's only `<h1>` under the tool, at the bottom; skipping would
do the same. Adopting keeps one `<h1>`, at the top, in the place it renders today:

- The generator writes `<h1 class="seo-h1" data-static-hero>` as the first element of the
  body block. Its text is the hero title with tags stripped: `BRAND_CONFIG.cameras.heroTitle`
  on brand pages; on `/compare/`, `/size/` and `/kit/` the `heroTitle` of the page's
  hand-written inline `COMPARE_CONFIG` (read from the file; the generator throws if it can't
  find it).
- `injectBody()` moves that element into the hero in place of its own `<h1>`, giving it the
  engine's id, class and markup, so mode switches (`#hero-title` innerHTML) keep working.
- Without JavaScript the static `<h1>` sits above the at-a-glance section, styled by a small
  `.seo-h1` rule.

### JSON-LD
- `/`: one `@graph` with `WebSite` (`name`, `url`, `publisher`) and `Organization` (`name`,
  `url`, `logo` = `apple-touch-icon.png`, a 180×180 PNG). No `sameAs`: no verified profiles are
  on record. No `SearchAction`: the site has no search URL. It goes in the generated head block,
  which leaves `<title>` and the description untouched.
- `BreadcrumbList`: Home → section → page, as a second `<script type="application/ld+json">`.
  The middle item is the page's visible back link: same-brand vs and size pages → the brand
  page; cross-brand vs-pages → `/compare/`; cross-brand size pages → `/size/`; mount pages →
  `/mount/`; guides and articles → `/guides/` or `/articles/`. The last item is the page's
  canonical URL.
- A shared `ldScript()` serialises with `<` escaped.

### Validation
`tests/data/structured-data.test.js` walks every generated HTML file, parses each JSON-LD block,
and checks per type: `ItemList`, `ListItem`, `Product`, `Offer`, `Brand`, `Article`,
`BreadcrumbList`, `WebSite`, `Organization`. An unknown type fails, so a new type must come with
its rules. `review` and `aggregateRating` are rejected outright: the site has no reviews.

## Risks

- Every brand, compare, size, kit, vs, size, mount and guide page changes, so their sitemap
  `<lastmod>` dates move once on the regeneration day. That is accurate (the HTML did change).
- The vs-page `Product` markup may draw Rich Results warnings for missing `review` /
  `aggregateRating`. Those are reported, never filled with invented values.
