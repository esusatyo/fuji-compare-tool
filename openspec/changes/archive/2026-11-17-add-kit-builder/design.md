## Context

`engine.js` renders a row of 2–4 slots of one kind (cameras or lenses) and a spec table under
them. A kit is a different shape — one body plus a list of lenses, summed — but everything
around it is the same: the header, theme, currency switcher, the type-to-search picker with
its phone sheet, the share button and the Amazon buy links. `size.js` set the pattern for a
feature with its own logic: a small module of pure functions, loaded before the engine, that
tests can `require` directly.

Facts checked on `main` (2026-11-14):
- Every camera and lens has `weight`; 4 lenses (pre-release) have no `prices.USD`.
- 963–1,170 of 1,532 lenses have no price in a given non-USD currency.
- L-Mount lenses are stored in three brand files and Micro Four Thirds in two; the copies
  carry identical weight and USD price (132 of 139 L names and all 116 MFT names repeat).
- 35 cameras are `lensType: 'Fixed'`; they carry a `lensSpec` string. Sigma's two SA-Mount
  bodies have no lenses in the data.
- Mount ids are site-wide (`l` means L-Mount in every brand file; a Tier 1 test pins it).

## Goals / Non-Goals

**Goals:** total weight and price for one or two kits from stored figures; lens choice
limited to the body's mount across brand files; totals a reader can check by adding the rows;
a shareable URL; no new dependency.

**Non-Goals:** see the proposal's out-of-scope list.

## Decisions

### A page mode of the engine, with the maths in `kit.js`
`COMPARE_CONFIG.kit` switches the cross-brand page into kit mode. The engine keeps the header,
hero, footer and the picker popover; in place of the slot row and spec table it renders
`#kit-app`. The picker is reused through four small hooks (what it lists, what is already
taken, what the noun is, what a pick does) keyed by a string slot id (`0:body`, `1:lens`)
instead of a slot number. *Alternative considered:* a standalone page script. It would have to
duplicate the picker (about 300 lines with tested keyboard and phone behaviour), the currency
and buy-link rules and the header, and the two copies would drift.

`kit.js` (`window.KitBuilder`, also `module.exports`) holds everything that is arithmetic or
parsing and has no DOM: `catalogue`, `lensGroups`, `takesLenses`, `sanitize`, `priceView`,
`totals`, `focalRange`, `filterSizes`, `verdict`, `parseHash`, `formatHash`.

### Lens matching: mount id across every brand file, one entry per lens
The lens list for a body is every lens whose `mount` equals the body's, from all brand files.
Copies of one lens are folded by `mount + name`. The entry kept is the copy in the brand file
whose brand name equals the lens's `manufacturer` (a Sigma lens resolves to `sigma:`), else
the first copy in `REGISTERED_BRANDS` order — a rule that does not depend on the chosen body,
so a shared link names the same id whoever opens it. Any copy's id in a URL is accepted and
normalised to that entry. In the browse list the body's own brand file comes first.

### One price currency for the whole page
`priceView(items, currency)` looks at every priced item in both kits. If each has a price in
the chosen currency, that currency is used; otherwise USD is used **for every row and both
totals**, so a total can always be checked against its rows and the two kits stay comparable.
An item with no USD price (pre-release) is excluded from totals and named. Discontinued items
count at their stored price and are marked in their row.

### Totals and the verdict
Weight is the sum of stored weights. The lighter kit's weight and the cheaper kit's price are
highlighted when both kits have a body and the figures differ; price is only compared when
neither kit has an unpriced item. The verdict sentence is written from the same numbers.
Focal range is the lowest and highest full-frame-equivalent focal length among the kit's
lenses, parsed from `focalLengthEquiv`; filter sizes are the distinct non-null `filterThread`
values.

### URL state
`#kit=<body>[,<lens>…][;<body>[,<lens>…]]`, ids as `<brand>:<slug>`. On load each kit is
sanitised: unknown body → empty kit; lenses that are unknown, duplicated, of another mount, or
on a fixed-lens body are dropped; at most six kept. The hash is written on the first change
and removed when both kits are empty. Changing a kit's body keeps the lenses that still fit.

### Layout
Two columns at every width (the compare page also shows two on phones). Each column is a
card: title, body photo and picker, body row, lens rows, "Add a lens", then the totals pinned
to the card's foot so they line up across columns.

## Risks / Trade-offs

- **USD fallback is common.** Most third-party lenses have no regional price, so many kits
  total in USD while another currency is selected. Accepted (owner decision 2): it is stated
  in a note, and the alternative is a total that silently mixes currencies.
- **Camera weight basis.** Sampled bodies store the with-battery-and-card weight, but the
  field is not audited across all 232. The note says weights are makers' stated figures.
- **Two columns on a phone are narrow** (~175px). Rows stack name over figures. Needs the
  owner's real-device check.
- **Engine branches.** Kit mode adds `IS_KIT` branches to the picker and render paths; kept
  to named hooks so brand and compare pages are untouched (their tests must stay green).
