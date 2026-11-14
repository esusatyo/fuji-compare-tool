## Why

A camera is bought as a kit — a body and the lenses that go on it — and the question a buyer
actually has is "what will this system weigh, and what will it cost?". The site already holds
everything needed to answer it: every one of the 232 cameras and 1,532 lenses has a weight,
and all but four (announced, not yet priced) have a US list price. Today a visitor can compare
bodies with bodies and lenses with lenses, but never add them up. No comparison site reviewed
so far (including PetaPixel's PixelMeter, Nov 2026) totals a kit from sourced figures.

## What Changes

- **A kit builder page at `/kit/`.** Pick a body with the same type-to-search picker as the
  rest of the site, then add up to six lenses. The lens search offers only lenses for that
  body's mount, drawn from every brand file — a Leica SL3 is offered Sigma and Panasonic
  L-Mount lenses — with each shared-mount lens listed once.
- **Two kits side by side** (owner decision, 2026-11-14). The second kit is optional. Each
  shows its body and lenses itemised (weight, price, Buy link, remove) and, underneath, its
  totals: weight (grams, ounces in small text), price, the focal range the lenses cover
  (full-frame equivalent) and the filter thread sizes they need. With two kits, the lighter
  and the cheaper total are highlighted and one sentence states the difference.
- **Honest price totals** (owner decision, 2026-11-14). A total is shown in the chosen
  currency only when every priced item in both kits has a list price in it; otherwise both
  kits are priced in US dollars and a note names the items that had no local price.
  Currencies are never mixed or converted. A discontinued item counts at the price held for
  it and is marked; an announced item with no price is left out of the total and named.
- **Fixed-lens cameras are a complete kit**: they can be picked as a body, take no lenses,
  and show their built-in lens.
- **Shareable**: the kits live in the URL fragment (`#kit=<body>,<lens>…;<body>,<lens>…`),
  so the existing Share button works.
- **Linked** from a homepage card beside "Compare camera sizes", from the footer of every
  page, and in the sitemap. No pre-made static kit pages.
- Anonymous events: `kit-body`, `kit-lens`, `kit-remove`, `kit-pair`, plus the existing
  picker, buy, view, currency and share events with `kit` as the page. `privacy.html` lists them.

## Decisions

All agreed with the owner, 2026-11-14:

1. Two kits side by side; the second is optional.
2. A local-currency total only when every priced item has that price; otherwise US dollars for everything, with a note.
3. Discontinued items count at their stored price, marked; unpriced items are excluded and named.
4. Fixed-lens cameras are allowed as a lens-less kit.
5. A homepage card and a footer link on every page; no static kit pages.
6. Focal range and filter sizes are shown in the totals.

## Out of scope

- Lens-fit warnings beyond the mount (an APS-C lens on a full-frame body crops; the data has
  no format field yet) and adapters (M lenses on L bodies).
- Retail bundle pricing: the total is the sum of individual list prices, and says so.
- A drawing of the kit (needs lens-on-body, which the size work has not built).
- More than two kits, more than six lenses per kit, a "buy everything" button, accounts or
  saved kits.

## Capabilities

### New Capabilities
- `kit-builder`: the `/kit/` page, its totals rules, lens matching and URL state.

### Modified Capabilities
- `home-landing`: a link card to `/kit/`.

## Impact

- New `kit.js` (pure kit maths: lens catalogue, totals, focal range, filter sizes, verdict,
  hash grammar; a browser script the tests require directly).
- `engine.js` / `engine.css`: a kit page mode (`COMPARE_CONFIG.kit`) that reuses the picker
  popover, header, currency switcher, share button and buy links.
- New `kit/index.html`; `scripts/generate-seo.js` (head and body blocks, sitemap entry,
  homepage card, footer links).
- `analytics.js`, `privacy.html`, `CLAUDE.md`, the `add-camera-brand` skill.
- Tests: `tests/logic/kit.test.js`, `tests/logic/kit-page.test.js`, `tests/data/kit-page.test.js`.
