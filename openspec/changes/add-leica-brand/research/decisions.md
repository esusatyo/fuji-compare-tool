# Research decisions — Leica brand (running log)

Append a numbered section for every decision made during a task, with the task
number and date. Newest at the bottom.

## 1. Owner kickoff decisions (2026-09-14)

- **Systems in scope**: SL, TL/CL, M digital rangefinders, Q + rebadged
  compacts (all four offered options chosen).
- **M lenses**: current catalogue only; lower the lens year floor if a current
  design predates 2008.
- **Fixed-lens cameras**: follow precedent — system mount id + `lensType: 'Fixed'`.
  (Owner first picked a new `fixed` id on an under-informed recommendation;
  re-asked once the existing `cameraMountLabel()` mechanism was found, and chose
  precedent.)
- **ASIN baseline**: rebase `ASIN_GAP_BASELINE` for the Leica population in a
  dedicated commit that names each item. At kickoff main had 63 current items
  without an ASIN against a baseline of 86 (23 free slots).
- **Housekeeping done first**: Olympus was already merged (#59) and archived;
  the stale `add-olympus-brand` worktree and local branch were removed, and its
  one unmerged commit (AGENTS.md → symlink) was ported to PR #63.

## 2. Lessons carried over from the Olympus onboarding

- The pre-commit hook runs `generate-seo.js` on any `data.js` change and it
  crashes on an unresolvable `heroCamera` / `defaultSelected`; the render-logic
  suite needs ≥4 cameras and ≥4 lenses. So the scaffold commit (task 2.2)
  must carry a small, **fully researched** seed — never stubs.
- Product pages can show a sale price as if it were list price; cross-check
  against a catalogue listing that shows the strikethrough.
- Text fetches misread dimension diagrams; verify width/EVF magnification
  against the image when a figure looks off.
- `root-redirect.test.js` has two brand lists (redirect case + crawlable-landing
  list), and `KNOWN_IMAGE_GAPS` needs a brand key.
- Leica's catalogue pages (`/photography/lenses/m`, `/sl`) render product lists
  client-side; WebFetch sees only navigation. Use per-product pages, the
  regional online store, or Wikipedia/DPReview lists as the enumeration spine.

## 3. Task 1.1 — camera enumeration calls (2026-09-14)

- **40 core bodies** (SL 6, TL/CL 4, M 23, Q 7); compact / Leica X / SOFORT
  candidates listed separately in `research/cameras.md` for task 1.4.
- **Special editions excluded** — Leica issues many cosmetic editions (Titanium,
  Black Paint, Reporter, Metal Gray, anniversary); only functionally or
  optically distinct bodies are entries. Monochrom variants *are* distinct
  (different sensor) and get entries.
- **Rumoured bodies excluded** (Q3 43 Monochrom, M11-R, M12). A 2026-09-02
  roundup lists them as unannounced; re-check before ship (task 8.2).
- **M series split `M` / `M Monochrom`; Q stays one `Q` series** (reasoning in
  `research/cameras.md`) — provisional until task 1.3.
- **Three source conflicts** flagged ⚠ for resolution at entry: M-P (Typ 240)
  year, V-Lux 5 year, Q2 Monochrom exact RRP.
- **Access notes**: cameradecision.com returns 403 and macfilos.com 401 to
  WebFetch; Leica's newsroom index is client-rendered. Individual
  leica-camera.com press URLs and Wikipedia pages fetch fine.
- For task 1.2: Leica announced the **Summicron-M 66 f/2** (Classic Line) on
  2026-09-03; confirm whether it's a regular catalogue lens or limited edition.

## 4. Task 1.4 — owner scope verdicts (2026-09-14), taken before task 1.2

Done out of order on purpose: three of the four questions only needed task
1.1's camera list, and the fourth (TL lenses) decides what task 1.2 enumerates,
so answering first saves 1.2 from researching lenses that might be dropped.

- **Compacts: large-sensor only** (recommended) — D-Lux (Typ 109) / 7 / 8
  (4/3), V-Lux (Typ 114) / 5 and C-Lux (1"). The 2008–2012 small-sensor
  Panasonic twins are out.
- **Leica X: included** (recommended) — 6 bodies, 2009–2016.
- **SOFORT 2: excluded** (recommended).
- **TL lenses: included; discontinued SL lenses: excluded** (recommended).
- Knock-on: series `X`, `D-Lux`, `V-Lux`, `C-Lux` all map to `l` + `lensType:
  'Fixed'`; design §3's regex gains `X`. Total bodies: **52**.

## 5b. Task 1.5 — price sources per currency (2026-09-15)

Leica's own site is a working online store for only 3 of the 7 site currencies;
the rest need a separate authorized-dealer source or fall back to
`compute-prices.js` / `priceIncomplete`.

| Currency | Source | Notes |
|---|---|---|
| USD | leica-camera.com/en-US | full store, list price shown |
| GBP | leica-camera.com/en-GB | full store, VAT-inclusive |
| EUR | leica-camera.com/de-DE | full store, VAT-inclusive (Germany as the EUR reference, matching the other brands' convention) |
| AUD | leica-store.com.au | leica-camera.com/en-AU is informational-only and links out to this authorized retailer |
| SGD | leica-store.sg | leica-camera.com/en-SG is informational-only and links out to this authorized retailer |
| JPY | store.leica-camera.jp | linked from leica-camera.com/ja-JP as "Official Leica Camera Japan Online Store" |
| CAD | vistek.ca | **no Leica-run Canadian store** — leica-camera.com/en-CA serves the generic `/en-int/` page with no CAD. Vistek is confirmed as an authorized Leica dealer (listed on leica-camera.com's own dealer-locator page) and stocks current SL bodies with CAD pricing (e.g. SL3-P at CAD $9,435 — spot-checked, re-verify per item at entry) |

Where an item's CAD (or any currency) can't be confirmed via these sources,
follow CLAUDE.md as normal: `compute-prices.js` for an approximate figure, or
`priceIncomplete: true` (lenses) / a documented substitute source (cameras).

## 5a. Task 1.3 — entry conventions (2026-09-15)

- **10 series**, each satisfying design §3's regex (`/^M/` → `m`; everything
  else → `l`): `SL`, `TL`, `CL`, `M`, `M Monochrom`, `Q`, `X`, `D-Lux`, `V-Lux`,
  `C-Lux`. T (Typ 701)/TL/TL2 share series `TL`; CL is its own series (one
  body) so its dropdown group can carry an honest label.
- **`SERIES_COLORS`** (dark bg + a distinct accent per series, matching the
  site's existing dark-card pattern):
  ```
  SL:           { bg: '#1c1c1c', text: '#d64541' }  // graphite / Leica red
  TL:           { bg: '#242320', text: '#c9a876' }  // bronze
  CL:           { bg: '#1e2420', text: '#8fae8f' }  // olive
  M:            { bg: '#141414', text: '#c0c0c8' }  // silver chrome
  'M Monochrom':{ bg: '#0d0d0d', text: '#9a9a9a' }  // grayscale
  Q:            { bg: '#1a1a1a', text: '#4fa8d8' }  // blue
  X:            { bg: '#22201c', text: '#d9b45c' }  // amber
  'D-Lux':      { bg: '#1c1f24', text: '#6f9bd0' }  // steel blue
  'V-Lux':      { bg: '#241c20', text: '#c98fae' }  // mauve
  'C-Lux':      { bg: '#201c24', text: '#a68fd0' }  // violet
  ```
- **Slug scheme** — already used consistently in `research/cameras.md` and
  `research/lenses.md`: cameras kebab-case the model name (`m11-p`, `q3-43`,
  `d-lux-8`, `x-u-typ-113`); lenses are
  `<line>-<focal>mm-f<aperture-digits>[-asph][-qualifier]`
  (`summicron-m-50mm-f2`, `apo-summicron-sl-21mm-f2-asph`).
- **Dropdown groups** (camera): `── SL ──`, `── TL / CL ──`, `── M ──`,
  `── M Monochrom ──`, `── Q ──`, `── Leica X ──`, `── D-Lux ──`,
  `── V-Lux ──`, `── C-Lux ──`. All but `── M ──`/`── M Monochrom ──` are
  mount `l` — satisfies "one group, one mount." Newest-first within each group.
- **Dropdown groups** (lens): `── SL Primes ──`, `── SL Zooms ──`,
  `── Noctilux-M & Summilux-M ──`, `── Summicron-M & APO-Summicron-M ──`,
  `── M Wide-Angle & Tele (Elmarit / Elmar) ──`, `── TL Lenses ──`.
- **Leica spec section — confirmed as design §6's 4 candidates**, all
  sourceable across the dataset: `monochrom` (bool), `focusingSystem`
  (`'Rangefinder'` / `'EVF'` / `'Rangefinder + EVF'` — M bodies are
  `Rangefinder` except the EVF-only M EV1; SL/Q are `EVF`; CL has a small
  built-in EVF, TL/X do not), `contentCredentials` (bool — true only from
  M11-P/SL3-S/Q3-era bodies on), `internalStorageGB` (nullable — only the
  M11 and Q3 families have any).
- **`BRAND_CONFIG.mount` = `'L-Mount'`** (not `'L-Mount & M-Mount'` as design
  §2 speculated) — matches the established single-headline-mount convention
  CLAUDE.md documents for Fujifilm, and Sigma's own precedent (its tile also
  says `'L-Mount'` despite also spanning SA-Mount). Corrected in design.md.
- **`heroCamera`: tentatively `'sl3'`** — current, well-covered by press
  photography; confirmed or swapped once task 7's image search runs.
- **`afType`**: M lenses = `'Manual'` (already decided). SL lenses take their
  real official AF-system name per lens at entry (e.g. "Dual Synchro Drive"
  for the Super-APO-Summicron-SL 21) — no blanket default.
- **Summilux-SL 50 duplicate-name resolved**: only the current (2026,
  compact) version is entered. The discontinued 2015 original falls under
  task 1.4's "no discontinued SL lenses," so it is not a lens-revision pair
  here — just one current lens.

## 5. Task 1.2 — lens enumeration calls (2026-09-14)

- **~48–49 lenses**: M 25, SL 16–17, TL 7 (`research/lenses.md`).
- **`year` = version year, not design year** (design §5 revised). The Summicron-M
  50 f/2 formula dates from 1979, but the lens on sale is a later version; the
  site's Year row means "when this product came out" for every other brand.
- **Classic Line reissues are regular catalogue lenses**, not editions: Summaron-M
  28, Thambar-M 90, Noctilux-M 50 f/1.2, Summilux-M 35 "Steel Rim", Summilux-M 50
  Classic. The Summicron-M 66 is the exception (660-unit limited edition) → out.
- **A dealer listing isn't proof a lens is current**: the Tri-Elmar-M 16-18-21 is
  still listed (out of stock) but was discontinued in January 2025. The reverse
  also happens: Summilux-M 24 and Summilux-M 90 have live leica-camera.com pages
  but aren't on the dealer page. Every ⚠ status gets a leica-camera.com product
  page check at entry.
- **Summilux-SL 50 f/1.4 has two lenses with the same name** (2015 original,
  2026 compact redesign). Per the lens-revisions memory they're separate entries;
  the original is only in scope if Leica still sells it.
## 6. Task 5.3 — M8.2 and M9 US launch price unsourceable, skipped for now (2026-09-17)

`prices.USD` is non-nullable (schema.js requires a positive number for every
item, discontinued or not) — unlike every other currency, it has no
`priceIncomplete`-style escape. The M8 ($4,795), M9-P ($7,995), M-E Typ 220
($5,450) and M Monochrom ($7,950) all have solidly sourced US launch prices
(DPReview review/announcement pages, one with an exact quote). **M8.2 and M9
do not** — both surface reliably in UK pricing (£s) across DPReview's
announcement articles, but no source found states a US dollar figure.

Tried, across a research agent plus my own follow-up: DPReview (live review
+ specs + ~15 archived Wayback snapshots), Wikipedia (EN + DE), Ken Rockwell
(blocked), Imaging Resource (blocked), B&H (blocked), PetaPixel (404),
PhotographyBlog (404), Red Dot Forum (404), camera-wiki.org (no price),
Leica Rumors (404), general web search (WebSearch quota exhausted this
session). The ~$6,995 figure often repeated for the M9 online has no
citable primary source I could find.

**Decision: skip both from this batch rather than enter a guessed number**
(CLAUDE.md's "if a non-nullable field can't be sourced, skip rather than
guess," generalized from lenses to this case). Batch 5.3 shipped 4 of its
planned 6 cameras (M8, M9-P, M-E Typ 220, M Monochrom). M8.2 and M9 are a
named follow-up — try again with a fresh WebSearch budget, or ask the owner
if they have a source, before task 5.8's final camera pass. This does not
block landing the `m` mount (task 4.4), since M8 alone is enough to use it.

- **Access notes**: alikgriffin.com returns 403; the dealer's SL collection URL
  guesses 404; Leica's 2016–2017 press-release archive URLs return navigation
  only. DPReview launch articles were the reliable TL source.
