# Canon RF third-party lens sources (round 2)

Per-source ledger — every URL read during this round, what it was used for,
and its reliability class. T1 maker's own site (incl. regional) · T2
independent measurement/review · T3 retailer (price/availability only) · T4
aggregator (tables only, never mount attribution) · NEWS dated announcement
(`year` only).

Record sources for rejected facts too, with the reason — that's what stops a
later pass "correcting" a right value to a wrong one.

## TTArtisan deferred batch (2026-08-29)

**Scope note:** `ttartisan.com` (the maker's primary domain, tier 1 in round
1) was completely unreachable this round — both `WebFetch` (`connect
ECONNREFUSED`) and direct browser navigation (error page, no response) on
every URL tried, including the bare domain root. This is a strictly worse
starting point than round 1 (which could at least reach spec-table prose via
curl + a browser UA). Everything below therefore leans on `ttartisan.store`
(the maker's Shopify storefront — still T1, it's an official sales channel
the maker operates, not a reseller) plus NEWS-tier announcements and T3
retailer SKU listings for corroboration.

- **https://ttartisan.store/products.json?limit=250** (T1) — Shopify's
  standard product-catalogue JSON feed. Used to get the full 75-product list
  with `handle` (URL slug) and each product's `options` (incl. the `Mount`
  option's `values` array = every mount the store currently sells that
  product in). This is the **authoritative "what ships now" list** — more
  reliable than the spec-table prose on individual product pages, which goes
  stale when a mount is added/dropped (see the 25mm F2 and 23mm F1.4 cases
  below, where the prose and the live Mount selector disagreed).
- **https://ttartisan.store/products/aps-c-35mm-f1-4** (T1) — spec table
  (focal/aperture/MFD/blades/filter/elements/weight/mount), Mount selector,
  and the "Size" table row's image
  (`https://cdn.shopify.com/s/files/1/0433/2224/5282/files/C34.png`),
  downloaded and read directly (legible at native resolution, no cropping
  needed) — gave per-mount L×⌀ for E/X/EOS-M/M43 (56×44), Z (63×42), **RF
  (63×42)**, L-mount (60×43). Used for `ttartisan-35mm-f14-apsc`.
- **https://ttartisan.store/products/ttartisan-17mm-f1-4-apsc-lens** (T1) —
  checked and **rejected as an RF candidate**: Mount selector lists `Sony E /
  Fuji X / EOS-M / M43 / Nikon Z / L mount` only, spec-table prose says
  `Mount E / X / Z / L / M43` — both agree, no RF. Used to defer
  `ttartisan-17mm-f14-apsc`.
- **https://ttartisan.store/products/aps-c-23mm-f1-4-black** (T1) — spec
  table + Mount selector (RF present, though the RF variant shows as
  "Variant sold out or unavailable" — a stock-status flag, not evidence the
  SKU doesn't exist) + Size image
  (`.../files/C23.png`), read directly — gave RF-specific 63mm(L)×41mm(⌀).
  Used for `ttartisan-23mm-f14-apsc`.
- **https://ttartisan.store/products/aps-c-25mm-f2** (T1) — checked and
  **rejected as enterable this round despite RF appearing in the live Mount
  selector**: the spec-table prose (`Mount E / X / Z / L/ MFT`) *and* the
  Size image itself (three columns only: `E, X-mount` / `Z-mount` /
  `M43-mount`, no RF column) both omit RF. No baked-in RF dimensions exist to
  read. Used to defer `ttartisan-25mm-f2-apsc`.
- **https://ttartisan.store/products/102** (T1) — spec table + Mount
  selector (`Sony E / Fuji X / M43 / Nikon Z / Canon RF`) + Size image
  (`.../files/C10.png`), read directly — gave RF-specific 61mm(L)×63mm(⌀).
  Used for `ttartisan-10mm-f2-asph-apsc`.
- **https://ttartisan.store/products/tilt-35mm-f1-4** (T1) — spec table +
  Mount selector + Size image
  (`.../files/size_8c898f7f-0b6b-4ee0-a7ee-1dddf968f2ff.webp`, actually a PNG
  despite the `.webp` filename/URL — Shopify serves the raw file bytes
  regardless of the URL's apparent extension; `file(1)` confirms PNG),
  read directly — gave RF-specific 66mm(L)×61mm(⌀). Used for
  `ttartisan-tilt-35mm-f14-apsc`.
- **https://ttartisan.store/products/tilt-shift-17mm-f4-asph** (T1) — spec
  table + full page text (confirmed real USD price $550.00, not the $84
  decoy figure a naive first-`$`-match regex on `body.innerText` picked up
  from an unrelated "Frequently Bought Together" add-on item elsewhere on the
  page — **lesson: always read full page text for price, don't regex the
  first dollar sign**) + **two** separate Size images: (1)
  `.../files/3-size_e19ab984-9fc5-4b93-9e84-9fc18c96d309.webp` (also a PNG
  despite the extension) comparing only Sony E (107mm×88mm) vs Fuji GFX
  (100mm×88mm) — the two mounts available at original Oct-2025 launch; (2)
  `.../files/CYJ-202632-2.webp` comparing the three mounts added
  March-2026 (Z / L / RF). Image (2) is 2225×787px, and its dimension-label
  text was **illegible at native resolution through the standard image
  viewer** (downsampling destroyed the fine print, unlike every other Size
  image in this batch, all ≤2500px wide but apparently compressed
  differently) — resolved by writing a ~120-line dependency-free PNG decoder
  (`/private/tmp/.../scratchpad/ttartisan-images/pngtool.py`, stdlib
  `zlib`+`struct` only, since neither Pillow nor ImageMagick were
  installable in this sandbox) to crop just the RF-mount label region and
  upscale it 3-4x with nearest-neighbour before viewing — this made "113mm"
  legible where the full-image view showed only a black blob. Verified the
  crop was actually the RF column (not an adjacent one) by re-cropping a
  wider region that includes the "RF-Mount" text label itself. Gave
  RF-specific 88mm(L)×113mm(⌀). Used for
  `ttartisan-tilt-shift-17mm-f4-asph`.
- **https://www.newsshooter.com/2025/10/10/ttartisan-17mm-f4-tilt-shift/**
  (NEWS) — confirms Oct 2025 launch, Sony E + Fuji GFX only at that point.
- **https://nikonrumors.com/2026/03/08/ttartisan-announced-a-new-17mm-f-4-tilt-shift-lens-for-nikon-z-mount.aspx/**
  (NEWS) — confirms Nikon Z / Canon RF / Leica L added March 2026, giving a
  precise RF-specific `year: 2026` (rare — most of this batch's `year`s are
  the original design's launch, RF add-date unconfirmed).
- **https://ttartisan.store/products/14mm-f2-8** (T1) — spec table (filter
  "77mm (external filter holder)", weight "Around 437~445g") + full page text
  (confirmed real price $196.00) + Mount selector + Size image
  (`.../files/3-size.webp`, 899×421px, legible directly) — gave RF-specific
  65mm(L)×75mm(⌀). Used for `ttartisan-14mm-f28-asph`.
- **https://photorumors.com/2025/08/22/new-ttartisan-14mm-f-2-8-asph-full-frame-ultra-wide-angle-lens-for-e-z-rf-l-announced-196/**
  (NEWS) — confirms Aug 22 2025 announcement covered E/Z/RF/L simultaneously,
  so RF-specific `year: 2025` is reasonably solid (not a later add-on mount).
- **https://ttartisan.store/products/100mm-f2-8macro** (T1) — spec table
  (filter 67mm, MFD 0.25m, weight "Around 700~748g", magnification 2:1, 14
  elements/10 groups, 12 blades) + full page text (confirmed real price
  $339.00, and the very broad Mount selector: E/X/Z/RF/L/GFX/F/EF — this SKU
  spans mirrorless *and* two legacy DSLR mounts) + Size image
  (`.../files/439e6863e7bc8222f66c7f6fbee74200.png`, 2500×600px, legible
  directly, 8-column comparison) — gave RF-specific 72mm(L)×148mm(⌀). Used
  for `ttartisan-100mm-f28-2x-macro`.
- **https://ttartisan.store/products/ts100** (T1, page existence only) —
  confirmed via `products.json` that a **separate** "Tilt-Shift 100mm F2.8 2X
  Macro" product exists at this handle, distinct from `100mm-f2-8macro`
  above (different Mount list: `Sony E / Fuji X / M43 / Nikon Z / Canon RF /
  L mount`, no GFX/F/EF). Not fetched in full / not entered — it wasn't on
  round 1's original 14-lens list, so it's out of this batch's scope (it's a
  candidate for a future "new-since-round-1" pass, not a deferred item from
  the original list). Used only to resolve the TS-100-Macro naming-hazard
  question — see the ledger note on `ttartisan-100mm-f28-2x-macro`.
- **https://petapixel.com/2024/07/12/ttartisan-simplifies-100mm-f-2-8-2x-macro-lens-by-removing-tilt-and-shift/**
  (NEWS) — explains the actual product lineage: a 2023 tilt-shift 100mm f/2.8
  2x macro was **replaced/simplified** in July 2024 into a plain (non-tilt)
  version sold across E/EF/F/GF/L/RF/X/Z — i.e. today's `100mm-f2-8macro`
  store listing *is* the 2024 simplified lens, and the "tilt-shift" framing
  round 1 found attached to a $339 Pergear listing was almost certainly
  describing the *predecessor* product, not this one. Resolves the
  naming-hazard note round 1 left open.
- **B&H product-page titles** (T3, price/SKU-existence corroboration only,
  never specs) — used only to confirm an RF SKU number exists/exists
  historically, never for dimensions: `C3514-B-RF` (35mm F1.4 APS-C),
  `C2314-BS-RF` (23mm F1.4), `C1020-B-RF` (10mm F2 ASPH),
  `C1714-B-RF` (17mm F1.4 — historical, no longer on ttartisan.store, hence
  the defer).

## Technique note for future passes

`ttartisan.store`'s Size-comparison images are **not guaranteed to include
every mount the Mount selector offers** (see the 25mm F2 case) — always
check the image's own column headers against the selector, don't assume
parity. Conversely, when the Size image resolution is high (>~2000px wide)
and the dimension text renders as an illegible blob in a standard image
viewer, the numbers are usually still genuinely present in the pixels at
full resolution — a raw crop-and-upscale (canvas OR, more reliably given
this sandbox's flaky access to a live page's DOM across tool calls, a
dependency-free PNG decode from the downloaded file) recovers them rather
than that being a dead end. `pngtool.py` (this round's scratch script) is
disposable/session-local, not part of the shipped tooling.
