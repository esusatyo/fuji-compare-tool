## Context

`engine.js` renders three kinds of page from `window.BRAND_DATA`: a brand page (one brand,
cameras + lenses), and `/compare/` (all brands, cameras, ids `brand:slug`, switched on by
`window.COMPARE_CONFIG`). Slots were `<select class="slot-select">` rebuilt on every render.
The homepage loaded no engine: it was a static landing page with a stored-brand redirect.

## Decisions

**D1 — One picker, in the engine, on every page.** The homepage needs search before any data
exists, which argued for a separate `picker.js`. Instead the engine itself runs on the
homepage (it is 20 KB gzipped) with an empty catalogue, and the picker reads whichever source
is available: the generated name index until the brand files land, the catalogue after. One
renderer, one search function, no second script on every page.

**D2 — Button + one shared popover, not an inline input per slot.** Slots are re-rendered on
every state change; an input living inside one would lose focus mid-typing. The popover is a
single element appended to `<body>` on first use. The list is built only while open, so four
slots no longer each carry every `<option>`.

**D3 — Empty query = the old dropdown.** With nothing typed the list is the full catalogue
under the dropdown-group headings (era, mount, maker), opened at the current item. Browsing is
something our grouped lists do better than PixelMeter's bare search box; it is kept.

**D4 — Matching (`searchTokens` / `searchForms` / `searchScore`, all pure).** Lower-case,
strip accents, split on anything that is not a letter, digit or dot; drop "mark"/"mk"; "56mm"
→ "56"; "f1.4" → "f" + "1.4". Each side is compared in two readings — as typed, and with
generation numerals made arabic (`iv`→`4`, `z6iii`→`z63`) — both also squashed to one string.
A query word that prefixes the item's brand (two letters or more) is set aside, so "fuji xt5"
works although "Fujifilm" is not in the name. Score: 0 whole name · 1 name starts with it
(1.5 if only mid-word) · 2 every word is a word of the name · 3 every word starts one, or only
a brand was typed · 4 appears inside (3+ characters) · 5 every word appears somewhere. Ties:
current before discontinued, newer first, shorter name, list order. Capped at 60 results.
A test asserts every camera is the top result for its own full name.

**D5 — Homepage = embed mode of the compare page** (`COMPARE_CONFIG.embed`). `injectEmbed()`
writes a bar (count buttons; currency + share, hidden until something is picked), the slot
row and a `<div id="compare-table">` into `#app`; header, hero, footer and `<main>` stay the
generator's. Slots hold `null` until picked — `withFillers()` fills nothing in embed mode —
and `computeWinners`, `sectionVisible`, `renderTable` and the hash treat `null` as "no item":
blank cells (not a dash), never a winner, not in the link. One filled slot renders as a spec
sheet with no winners.

**D6 — Data on demand.** `ensureData()` appends one `<script>` per `COMPARE_CONFIG.dataScripts`
entry when a picker first opens (so specs are usually present by the time a camera is chosen),
on a pick, or at load when the URL names cameras. `hydrateCatalogue()` fills `CAMERAS`,
`DROPDOWN_GROUPS` and the mount lookup *in place* — `MODE_CONFIG` holds references. Until then
a picked slot shows its name (from the index) and "Loading specs…"; a failed fetch shows a
retry. All-or-nothing: the eight files are fetched together rather than per brand, which would
need the engine's load-time constants made lazy. Per-brand loading is a possible later saving.

**D7 — The index is inline in `index.html`**, inside the generated body block, as part of the
`COMPARE_CONFIG` literal (`<` escaped). The pre-commit hook already regenerates and stages
`*.html`, and the freshness test already fails on a stale `index.html`; a separate file would
need both taught about it. `dataScripts` and the index derive from the brand directories, so
adding a brand needs no homepage edit.

**D8 — Slot count on the homepage is three buttons** in the bar, default 2 (the common "X vs
Y"); other pages keep their dropdown in the label cell. Hidden below 600px, where two columns
show regardless. With nothing picked, the label column is dropped and the slot row is not
sticky (it would follow the visitor down the brand cards).

**D9 — Redirect removed, plumbing kept.** The inline redirect script is deleted. Brand pages
still write `localStorage['brand']` and logos still link `/?brands` (now an inert parameter):
the owner asked for removal "for now", and leaving those makes reinstating it a one-script
change instead of a regeneration of ~300 pages. The `VALID_BRANDS` clauses in the per-brand
data specs are moot while the redirect is off and are left untouched for the same reason.

**D10 — Phones.** The popover is a fixed full-screen sheet with a Cancel button; its top and
height track `window.visualViewport` so the list ends at the on-screen keyboard. The input is
16px (smaller makes iOS zoom the page).

## Risks

- **Real devices.** The sheet/keyboard behaviour was checked only in a phone-width frame on
  desktop Chrome. iOS Safari and an iPad need a hands-on check before this is called done
  (see memory: simulated mobile has missed layout bugs here before).
- **Homepage weight after first interaction**: ~420 KB gzipped of brand data, same as
  `/compare/` loads up front.
- **Returning visitors** lose the shortcut to their brand; the brand cards are one click away.
