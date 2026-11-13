## Context

- Data: `width`, `height`, `depth`, `weight` on every camera; `length`, `diameter`, `weight`
  on every lens. All millimetres and grams. No shape data — bounding boxes only.
- `scripts/generate-seo.js` already draws front outlines to a shared scale for share cards
  (`silhouetteHTML`, `vsCardHTML`), formats sizes (`sizeText`) and decides which vs-pages are
  indexable (`pins`, `successorPairKeys`, `SUCCESSOR_INDEX_SINCE`) inside `buildSite`.
- `engine.js` `renderTable()` builds the spec sections, then `renderReferencesSection()`.
- vs-pages load no engine; they are static HTML plus `analytics.js` and `theme.js`.

## Decisions

**D1 — One drawing module, `size.js`, used by the browser and the generator.** A standalone
script (no imports) that defines `window.SizeDiagram` and ends with
`if (typeof module !== 'undefined') module.exports = SizeDiagram;`. `engine.js` calls it at
render time; `generate-seo.js` `require`s it. One implementation, so the tool and the static
pages cannot drift — unlike `collectReferences`, which is duplicated and held together by a
parity test. It is not a shared import between brand files or the engine's data: it is a
sibling script like `theme.js`. Loaded with a plain `<script src>` before `engine.js`
everywhere the engine loads, and on size pages for the layout switch.

**D2 — API (all pure, strings out).**
- `SizeDiagram.box(item, kind)` → `{ w, h, d, weight }` in mm/g. `kind` is `'camera'`
  (`width`,`height`,`depth`) or `'lens'` (a lens is a cylinder: `w = h = diameter`,
  `d = length`). Returns `null` if any dimension is missing — the item is then listed in the
  table with "—" and not drawn.
- `SizeDiagram.svg(entries, { layout, kind })` → one `<svg>` holding the three views.
  `entries` is `[{ label, color, box }]`, 1–4 of them.
- `SizeDiagram.facts(a, b)` → the sentence parts for two boxes (see D7).
- `SizeDiagram.rows(entries)` → the table rows (label, per-item value, difference).
- `SizeDiagram.CARD = { w: 85.6, h: 53.98 }` (ISO/IEC 7810 ID-1).

**D3 — Geometry.** The SVG `viewBox` is in millimetres, so every view and every item shares
one scale by construction; CSS sizes the SVG (`width: 100%`, capped). Three views left to
right, each labelled: **Front** (w × h), **Top** (w × d), **Side** (d × h). Cameras are
rounded rectangles (radius ~6% of the shorter side, capped). Lenses: Front is a circle of
the diameter; Top and Side are the same d × diameter rounded rectangle, so lens mode draws
**Front** and **Side** only. *Overlay*: outlines share a baseline and a centre line per
view, drawn largest-area first with a translucent fill and a solid stroke. *Side by side*:
items in a row per view, bottom-aligned. The credit card is drawn once, dashed and labelled
"credit card", beside the Front view (85.6 × 53.98, landscape). Width and height of the
largest item are dimensioned on the Front view; everything else is in the table. Text in the
SVG is kept to view labels and item names; numbers live in the HTML table, which is the
accessible alternative (`role="img"` + an `aria-label` summarising the items).

**D4 — Colours** are the column accents already in `engine.css` (odd columns
`--accent-primary`, even `--accent-secondary`), referenced as CSS variables so both themes
work; slots 3 and 4 repeat them with a dashed stroke. The share-card renderer passes literal
hex values, as today.

**D5 — Tool section (`engine.js`).** `renderSizeSection()` returns a `.spec-section
.size-section` and is called in `renderTable()` after the spec sections and before
`renderReferencesSection()`. Header "Size", collapsible like any section. Shown when at
least one visible slot holds an item with a full box; one item draws alone next to the card
(no sentence, no difference column). It is **not** affected by "Show differences only". The
layout choice is page state (`sizeLayout`), defaulting to overlay at ≥600px and side by side
below; the switch is two buttons re-rendered with the table. In lens mode `kind` is `'lens'`.
Empty homepage slots are skipped.

**D6 — Static pages.** `buildSite` already computes `indexable(rel, a, b)` per pair; a size
page is generated exactly when that is true (same-brand) or the cross-brand file is pinned.
- `<brand>/size/<a>-vs-<b>.html` and `size/<brandA>-<a>-vs-<brandB>-<b>.html`, the vs-page's
  filename under `size/` instead of `vs/`. Linked and canonicalised extensionless.
- Page: header (logo, back link to the brand or `/size/`), `<h1>` "<A> vs <B> size
  comparison", the sentence, **both** layouts pre-rendered (CSS shows overlay ≥600px and
  side by side below; a two-button switch, wired by a few lines of inline script, overrides
  it — the page is complete without JavaScript), the table, the note, the pair's reference
  rows (`referenceRowsHTML`), links to the pair's vs-page and to "Compare these
  interactively", and related size pages (the pair's `relatedPairs`, filtered to pairs that
  have a size page).
- Title "<Brand> <A> vs <B> Size Comparison"; description leads with the sentence.
- `og:image` reuses the pair's vs card (D10).
- Sitemap: one entry per size page plus `size/`; lastmod via the existing manifest.
- Stale size pages are removed by the generator the way stale vs-pages are.

**D7 — The sentence** (`facts`): "The <A> is 1.8 mm narrower, 5.4 mm shorter, 16 mm slimmer
and 101 g lighter than the <B>." Per dimension: narrower/wider, shorter/taller,
slimmer/deeper, lighter/heavier; a difference under 0.05 mm (or 0.5 g) is "the same width"
and grouped ("the same width and height"). All four equal → "…is the same size and weight
as…". Values to one decimal for mm, whole grams. Lenses use shorter/longer (length) and
narrower/wider (diameter).

**D8 — Units.** Millimetres and grams. The table shows inches and ounces alongside in
smaller text (`129.5 mm` · `5.10 in`); no switch. *(Owner said "millimetres and grams is
good" to this recommendation — confirm the imperial small print is wanted; dropping it is a
one-line change in `rows`.)*

**D9 — The note** under every drawing: "Outlines are each maker's stated outer dimensions,
drawn to scale as rounded boxes — real bodies have grips and viewfinder humps, and makers
do not all measure the same way. Sources for each camera are under References." On size
pages "References" is the section on the same page; in the tool it is the section directly
below.

**D10 — vs-pages.** `vsPageHTML` / `crossVsPageHTML` gain `<section id="size">` after the
spec card and before references: the overlay drawing (side by side below 600px via CSS),
the sentence, and — when the pair has a size page — a link "Full size comparison →". No
table there (the spec card already has the size and weight rows). Titles are unchanged; the
dedicated page owns the "size" query. Share cards: `silhouetteHTML` is reimplemented on
`SizeDiagram` so there is one outline routine; card pixels must not change (the share-image
manifest test will say if they do).

**D11 — `/size/` page.** `size/index.html`, a thin loader like `compare/index.html`:
site-config, every brand `data.js`, `size.js`, `engine.js`, `theme.js`, analytics, and an
inline `COMPARE_CONFIG` with `sizeFirst: true`, its own hero copy and default selection.
`sizeFirst` makes `renderTable()` put the Size section first and expanded. Generated head
block (title "Camera Size Comparison: Compare Camera Dimensions Side by Side") and body block
(intro copy, links to every size page grouped by brand — which also keeps them from being
orphans). In the sitemap. Adding a brand means adding its `<script src>` here too, as on
`compare/`; the skill and `CLAUDE.md` say so.

**D12 — Homepage card.** `rootBodyBlock` emits a new section between the brand grid and the
intro: one wide card, "Camera size comparison — see any two to four cameras drawn to scale",
linking `./size/`, with `data-goatcounter-click="size-hub"`.

**D13 — Analytics.** `size-view:<brand|compare|home|size>:<overlay|side>` from the tool's
switch via `trackEvent`; on static size pages the inline script calls `window.trackEvent`
with `size-view:page:<overlay|side>`. `size-seen:<pathname>` is owned by `analytics.js`
(IntersectionObserver on `.size-diagram`, once per load), like `specs-seen`.

## Risks

- **More templated pages.** 45 size pages sit beside 45 indexable vs-pages for the same
  pairs. They are kept distinct (D6 vs D10: the size page has three views, table and
  references; the vs-page a compact drawing and a link), but if Search Console later reports
  them as duplicates, the fallback is `noindex` on one side — a one-line change.
- **Boxes can mislead.** A deep grip makes a body's box deeper than it feels. D9's note is
  the mitigation; D3 keeps numbers out of the picture and in the table.
- **Share cards** must stay pixel-identical after D10's refactor.
- **Real devices.** The side-by-side layout at phone width needs a hands-on check.

## Open points for the owner

1. D8: keep inches/ounces in small text, or millimetres and grams only?
2. Size pages are generated for the **45 indexable** vs-pairs (my reading of "the same pairs
   who get the vs-pages", following the recommendation it answered) — not all ~295 vs-pages.
