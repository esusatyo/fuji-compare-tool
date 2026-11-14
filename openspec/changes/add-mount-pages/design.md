## Decisions

### Generated, static, no engine
Mount pages are written by `scripts/generate-seo.js` like the size pages: complete HTML, no
JavaScript beyond analytics, using the vs-page shell (header, hero, footer) and the brand
pages' `.seo-table` styles. Nothing in `engine.js` changes.

### Address from the mount's own label
`BRAND_CONFIG.mounts` already holds every mount's `label`, and a Tier 1 test pins one label per
id across brands. The page slug is the label lower-cased with spaces as hyphens, with `-mount`
appended when the label does not end in it: `L-Mount` → `l-mount`, `Micro Four Thirds` →
`micro-four-thirds-mount`. No new data field. A display name adds the mount's `system` where it
has one ("G-Mount (GFX)").

### Which items
- **Cameras:** every camera whose `mount` is the page's and whose `lensType` is not `Fixed`,
  from every brand file. Current first, then discontinued; newest first within each.
- **Lenses:** every lens whose `mount` is the page's, de-duplicated with `kit.js`'s catalogue
  (a lens stored in several brand files appears once — the copy in its maker's own file).
  Grouped by maker; makers in the order they first appear in the lens dropdowns of the brand
  files that make bodies for the mount, then the rest alphabetically; lenses in dropdown order.
- A mount gets a page only when it has at least one lens.

### Columns
Cameras: camera (brand + name, opening the brand page's tool on it), announced, sensor,
stabilization, weight, price (USD) — the same wording as the vs-page table (`VS_ROWS`).
Lenses: lens, focal length (full-frame equivalent), max aperture, weight, filter, focus
(Autofocus / Manual, from `afType`), price (USD), with "Discontinued" marked.

### Long pages
Sony E has 356 lenses, ~a 200 KB page. Kept as one page with a jump list to each maker
(owner decision 6). Splitting by maker or lens type is a recorded follow-up.

## Risks
- Single-brand mounts overlap their brand page's camera table. The lens list — absent from
  every crawlable page today — is the distinct content.
- Page weight on Sony E and Nikon Z. Tables only, no images.
