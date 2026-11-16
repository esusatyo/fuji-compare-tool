## Shape: pre-rendered rows + one small script

The dataset is small (232 cameras, ~1,245 lenses), so there is no query engine.

1. **`scripts/generate-seo.js`** writes one `<table>` per finder with every item as a row.
   Each row carries the values the filters need as `data-*` attributes (numbers as numbers,
   categories as short ids, the seven prices as one compact attribute). The page is complete
   and readable without JavaScript.
2. **`finder.js`** (`window.Finder`, also `require`d by the generator and tests — the
   `kit.js` / `size.js` pattern) holds the pure parts: the field definitions for each kind,
   `parseState` / `formatState` (the URL grammar), `matches(item, state, currency)`,
   `compare(a, b, sort, currency)`, and the derived categories (`sensorFormat`,
   `isAutofocus`). In the browser it reads the rows once into plain objects, then on every
   control change sets `hidden` on rows and re-appends them in sorted order.
3. The finders do **not** load `engine.js` or any `<brand>/data.js`. They load `theme.js`,
   `analytics.js` and `finder.js` only.

One definition table drives everything: the controls rendered by the generator, the `data-*`
attributes, the URL grammar, the presets' validation, and the tests.

## Fields

**Cameras** — brand; sensor format (derived from `sensorType`: `medium-format`,
`full-frame`, `aps-h`, `aps-c`, `mft`, `1-inch`, plus whatever else the data needs — a test
fails on any camera that does not classify); lens (`fixed` or a mount id); price (max);
weight (max); megapixels (min); `ibis`, `weatherSealed`, viewfinder (`evfType` present);
year (min); discontinued switch. Columns shown: name (link to the brand page on that
camera), brand, announced, sensor, megapixels, stabilisation, viewfinder, weight, price.
Left out on purpose: burst (not one basis across brands) and battery life (22 cameras have
none).

**Lenses** — mount; maker; `type` (prime/zoom); focal length (a range; a lens matches when
its own range overlaps it); max aperture (f-number at most N); weight (max); price (max);
autofocus (derived from `afType`, the rule the mount pages' "Focus" column already uses);
`ois`; `weatherSealed`; filter thread (exact size; lenses without one never match a chosen
size); discontinued switch. Lenses come from `KitBuilder.catalogue()` so a shared-mount lens
appears once, and link to the maker's own brand file as the mount pages do (`linkOf`).
No "Compare these" for lenses in this change: the lens tool compares within one brand page.

**Focal length basis: open decision** (recommendation: full-frame equivalent, so "35mm"
means one field of view on every mount; the alternative is the engraved focal length).

## Prices and currency

- A currency selector (the same seven currencies, the same `localStorage` key the tool uses)
  sets the price column, the price filter and the price sort.
- No conversion, ever. An item with no price in the selected currency shows "—".
- While a **max price** is set or the table is **sorted by price**, items with no price in
  that currency are hidden, and a line under the controls says
  "N cameras hidden: no AUD price. Switch to USD to see them." Without a price filter or
  price sort they stay listed with "—".
- Discontinued items show their USD launch price, labelled as such.
- Pre-release items with no announced price read "Price not announced".

## URL grammar

`#<key>=<value>&…`, only non-default values written, e.g.
`/cameras/#sensor=full-frame&maxweight=500&sort=weight` or
`/lenses/#mount=e&type=prime&maxaperture=1.8&maxprice=600&cur=USD&sort=price`.
Multi-value keys are comma lists (`brand=sony,nikon`). Unknown keys and bad values are
dropped silently. `disc=1` shows discontinued items.

## Presets (extensible by configuration)

```js
// site-config.js
finderPresets: {
  cameras: [
    { slug: 'lightest-full-frame', title: 'Lightest Full-Frame Cameras',
      filters: { sensor: 'full-frame' }, sort: 'weight', limit: 25 },
    …
  ],
  lenses: [],
}
```

- A preset is a saved finder state: `filters` uses exactly the URL grammar's keys, so a
  preset can express anything the page can, and nothing else. `sort` and optional `limit`,
  `intro` (one sentence) and `currency` (default USD) complete it.
- The generator writes `/<kind>/<slug>` containing only the matching rows, in order, with a
  "Change these filters" link to the finder on the same state. Preset pages are static (no
  script needed), indexable, in the sitemap, and linked from their finder page.
- The generator **throws** on an unknown filter key, an unknown sort, a duplicate or reserved
  slug, or a preset that matches nothing. Discontinued items are excluded unless the preset
  sets `disc`.
- Titles must not state a count or a price that the data could make false; the page prints
  the live count itself.
- Initial camera presets (owner can edit the list): lightest full-frame, cheapest
  full-frame, lightest APS-C, highest resolution, fixed-lens compacts, weather-sealed under
  US$1,500.

## Page weight

`/cameras/` is small. `/lenses/` is about 300 KB uncompressed (estimate). Accepted for now;
if it proves slow on a real phone, the fallback is to require a mount before rendering rows
from a generated JSON file. Not built unless needed.

## Share cards and analytics

- One card each for `/cameras/` and `/lenses/`; preset pages reuse their finder's card
  (as About/Privacy reuse the home card).
- Events: `finder-filter:<kind>:<key>`, `finder-sort:<kind>:<key>`,
  `finder-compare:<n>`, `finder-item:<kind>`, `finder-preset:<kind>:<slug>`,
  `finder-hub:<home|footer>`. Filter values are not sent. `privacy.html` lists them.

## Risks

- **Unmeasured demand** for the preset pages. Mitigation: six only; review with the other
  usage data after 4–8 weeks and prune or add through config.
- **Thin or duplicate pages.** A preset that nearly equals a mount page or another preset
  adds nothing; keep presets distinct.
- **Phone layout.** Wide tables scroll sideways (the mount-table pattern with a sticky name
  column); filters collapse into a panel. Needs a real-phone check by the owner.
- **Derived categories drift** when a new sensor or focus-motor wording appears. Mitigation:
  tests fail on anything unclassified.
