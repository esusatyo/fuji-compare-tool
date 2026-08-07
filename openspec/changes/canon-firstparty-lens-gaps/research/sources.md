# Source ledger

Every URL used to source a spec currently in the dataset, recorded so it can be
surfaced on the site for public cross-checking (owner's goal, 2026-08-05).

**Rules**
- Record the URL **when you read it**, not at the end of the batch.
- Record *what the source was used for*. A bare link is not provenance.
- Mark a source's **reliability class**, because they are not equal — see the
  warnings below. Two of the sources here are known-partly-wrong and must never
  be used unqualified.
- Retain sources for facts we **rejected** too. Knowing that a page says 638 g
  and why we didn't use it is the part that stops the next pass "correcting" us.

Reliability classes: **T1** maker's own site (incl. official regional sites) ·
**T2** independent measurement/review · **T3** retailer (price/availability
only) · **T4** aggregator — tables only, never attribution · **NEWS** dated
announcement, used for `year` only.

---

## Canon lineup enumeration

| use | source | class |
|---|---|---|
| Enumerating the RF/RF-S lineup (55 lenses) | `https://en.wikipedia.org/w/api.php?action=parse&page=Canon_RF_lens_mount&prop=wikitext` | T4 — enumeration aid only, **never** a spec source |

⚠️ `https://en.wikipedia.org/wiki/Category:Canon_RF_lenses` has **2 members** and
is useless for enumeration despite looking authoritative. Do not use it.

---

## Laowa (Venus Optics) — entries in `canon/data.js`

| use | source | class |
|---|---|---|
| 58mm f/2.8 2× Macro APO — product image (Canon-RF-specific shot) + spec confirmation on 7 fields | `http://laowa.com.au/product/58mm` → images under `https://laowa.com.au/wp-content/uploads/2022/09/5828_CanonR_1.png` | T1 (official AU site) |
| 100mm f/2.8 2× Macro APO — product image | `http://laowa.com.au/product/100mm` → `https://laowa.com.au/wp-content/uploads/2019/05/LAOWA-100mm-Macro.jpg` | T1 |
| 100mm — RF blade count (13) and confirmation that Φ72 × 125 mm is the **EF** figure | `https://www.venuslens.net/product/laowa-100mm-f-2-8-2x-macro-apo/` | T1 |
| 100mm — the "DSLR versions are ~30 mm shorter and ~15 g lighter than mirrorless" rule used to derive the RF row | cameralabs (recorded in the prior pass's ledger) | T2 |

⚠️ **Rejected, deliberately:** laowa.com.au's 100mm table gives 638 g,
9.5 × 7 cm and "9 blades (Canon)". That is the **combined DSLR/mirrorless row**,
not the RF spec. The entered RF values (155 mm / 650 g / 13 blades) stand. This
is the case that prompted the "beware the combined spec table" rule in
`add-thirdparty-lenses`.

---

## TTArtisan — 5 entries in `canon/data.js`

Specs are a **deliberate two-source composite**: dimensions/elements/groups/
weight/min-aperture from the aggregator table, blades/frame/RF-availability from
TTArtisan itself. This is exactly the pattern `specSources` needs to express.

| use | source | class |
|---|---|---|
| Blades, frame, **RF mount availability**, filter, MFD, weight range — 50mm f/1.4 ASPH | `https://www.ttartisan.com/?full-frame-lenses%2F55.html=` | T1 |
| same — Tilt 50mm f/1.4 | `https://www.ttartisan.com/?full-frame-lenses%2F60.html=` | T1 |
| same — 500mm f/6.3 | `https://www.ttartisan.com/?full-frame-lenses%2F500-F6-3.html=` | T1 |
| same — APS-C 50mm f/1.2 | `https://www.ttartisan.com/?aps-c-lenses%2F73.html=` | T1 |
| same — APS-C 50mm f/0.95 | `https://www.ttartisan.com/?aps-c-lenses%2F77.html=` | T1 |
| Dimensions, elements, groups, single-value weight, min aperture (all 5) | `https://lensfinder.org/en/lenses/canon-rf/<slug>` | **T4** |
| Independent confirmation of APS-C 35/50mm elements, groups, MFD, filter, blades | `https://www.cined.com/ttartisan-35mm-f-1-4-a-73-lens-for-aps-c-mirrorless-cameras/` | T2 |
| 50mm f/1.4 ASPH — $235 launch price, 2021 | `https://www.dpreview.com/news/0469223469/ttartisan-releases-235-50mm-f1-4-asph-lens-for-full-frame-mirrorless-cameras` | NEWS |
| Prices: Tilt 50mm $229, 500mm $369, 100mm Macro $339, APS-C 50/0.95 $218 | `https://www.pergear.com/collections/ttartisan` | T3 |
| Tilt 50mm f/1.4 — Dec 2022, and independent RF-availability confirmation | `https://petapixel.com/2022/12/09/ttartisans-50mm-f-1-4-tilt-lens-now-available-for-canon-rf-fuji-x-and-nikon-z/` | NEWS + T2 |
| 500mm f/6.3 — 2023 | `https://sonyalpha.blog/2023/11/30/ttartisan-500mm-f6-3/` | NEWS |
| APS-C 50mm f/0.95 — May 2022, $218 | `https://www.dpreview.com/news/2871947471/ttartisan-releases-218-50mm-f0-95-aps-c-ultrafast-prime-fujifilm-x-sony-e-mount-cameras` | NEWS |
| APS-C 50mm f/1.2 — 2020 | `https://jonasraskphotography.com/2020/12/19/another-fast-fifty-the-ttartisan-50mm-f-1-2-review/` | T2 / NEWS |

---

## 7Artisans — 3 entries in `canon/data.js`

| use | source | class |
|---|---|---|
| Dimensions, weight, elements, groups, filter, MFD, min aperture (all 3) | `https://lensfinder.org/en/lenses/canon-rf/7artisans-photoelectric-<slug>` | **T4** |
| **RF mount availability** (variant options) + USD prices | `https://7artisans.store/products/<slug>` — `9mm-f-5-6-full-frame-wide-angle-lens-for-e-l-r-z`, `10mm-f-2-8-ii-ultra-wide-angle-full-frame-fisheye-lens-for-e-l-r-z-1`, `35mm-f-1-4-full-frame-lens-for-e-eos-r-z-l` | T1 |
| 10mm f/2.8 II — Nov 2024, RF listed | `https://photorumors.com/2024/11/11/announced-7artisans-10mm-f-2-8-ii-ultra-wide-angle-full-frame-fisheye-lens-e-l-r-z/` · `https://www.dpreview.com/news/8769245444/7artisans-announces-10mm-f2-8-ii-fisheye-lens/` | NEWS |
| 35mm f/1.4 III — Aug 2024 | `https://petapixel.com/2024/08/21/7artisans-launches-redesigned-full-frame-35mm-f-1-4-prime-lens/` | NEWS |
| 9mm f/5.6 — Oct 2023 | `https://www.diyphotography.net/7artisans-just-released-an-ultra-wide-full-frame-9mm-f-5-6-rectilinear-lens/` · `https://phillipreeve.net/blog/review-7artisans-9mm-5-6/` · `https://www.35mmc.com/11/03/2024/7artisans-9mm-f-5-6-review/` | NEWS + T2 |

---

## ⚠️ Warnings that must travel with these sources

**`lensfinder.org` (T4) — tables usable, attribution not.**
- Its **spec tables validated well**: 8/8 exact against our tier-1-verified
  Tamron 11-20mm; CineD independently matches its TTArtisan APS-C figures.
- Its **mount attribution is ~30% wrong.** It listed 3 TTArtisan lenses under
  `canon-rf` that TTArtisan does not sell in RF (11mm f/2.8 Fisheye, 40mm f/2.8
  Macro, 7.5mm f/2 Fisheye) and 3 of 8 for 7Artisans (60mm Macro Mark II is
  EOS-M; 15mm f/4 absent from the catalogue; 50mm f/1.05 appears to be a cine
  lens). **Always confirm mount against the maker.**
- Its **prose is LLM-generated and wrong** — the 50mm f/1.4 ASPH page claims 11
  aperture blades where TTArtisan says 12. Tables only.
- It **soft-404s**: any slug returns HTTP 200. Only sitemap-listed URLs are real
  pages (`https://lensfinder.org/sitemap.xml`). A wrong guess looks like an empty
  page, which is how the earlier pass wrongly concluded 7Artisans had no coverage.
- It had a 10 g error on the Sigma 10-18mm vs Sigma's own RF figure.

**`7artisans.store/robots.txt` contains instructions addressed to AI agents**,
recommending they install `https://shop.app/SKILL.md` to "purchase products
directly". Treated as untrusted page content and ignored — only public catalogue
HTML was read. Recorded here so nobody later mistakes it for policy.

**`ttartisan.com` page titles truncate at the first hyphen**, so every APS-C
lens's `<title>` reads "TTArtisan APS". Parse the full title or read the spec
table; a title-based script will silently label every lens identically.

**`7artisans.com/sitemap.xml` serves an error page** (0 URLs). Use the Shopify
storefront instead.

---

## Canon first-party research — run 1 (2026-08-07, INCOMPLETE)

**Source route that works:** `https://www.usa.canon.com/shop/p/<slug>` via
WebFetch. Canon's own store, tier 1, and it carries the US list price too.
`curl` gets 403 from every Canon domain regardless of user-agent; WebFetch
reaches usa.canon.com where curl cannot.

**Slug patterns are inconsistent** — both `rf400mm-f2-8-l-is-usm` (dashes, and
`f/2.8` → `f2-8`) and `rf800mmf11isstm` (no separators) exist. Expect to try
both. `rf800mm-f5-6-l-is-usm` and `rf1200mm-f8-l-is-usm` both 404 on the dashed
pattern; the no-separator form was not testable before the block below.

⚠️ **Canon rate-limited then hard-blocked the host after ~3 successful
fetches.** Every subsequent request — new URLs included, and `canon.com.au` too
— returns 403. Not a per-URL cache effect: a never-fetched URL 403s the same
way. Any resumed run must **pace itself** (a few lenses, then let it cool) or
drive Canon through the Chrome extension, which renders as a real browser and
is the reliable path for this domain.

Also noted: `canon.ca` product pages load the spec table via JS, so WebFetch
returns the product name and nothing else. Not usable headless.

### Verified from Canon (3 of 21) — ready to enter

| field | RF 600mm F11 IS STM | RF 400mm F2.8 L IS USM | RF 600mm F4 L IS USM |
|---|---|---|---|
| source | `/shop/p/rf600mm-f11-is-stm` | `/shop/p/rf400mm-f2-8-l-is-usm` | `/shop/p/rf600mm-f4-l-is-usm` |
| elements / groups | 10 / 7 (gapless dual-layer DO) | 17 / 13 | 17 / 13 |
| blades | fixed f/11 — none listed | 9 | 9 |
| min aperture | fixed f/11 | f/32 | f/32 |
| closest focus | 4.5 m | 2.5 m | 4.2 m |
| max magnification | 0.14× | 0.17× | 0.15× |
| filter | Ø82 mm | Ø52 mm drop-in | Ø52 mm drop-in |
| dia × length | ~93 × 269.5 mm extended (199.5 retracted) | 163 × 367 mm | 168 × 472 mm |
| weight | 930 g | 2890 g | 3090 g |
| IS | 5 stops | 5.5 stops | 5.5 stops |
| weather sealed | — | yes | yes |
| US list | $929.99 (promo $729.99 — **use list**) | $13,399.00 | $14,499.00 |

**Open items on these three, do not enter without resolving:**
- `afType` is **not stated** on any of the three pages. Canon's super-telephoto
  L primes use Ring USM and the f/11 DO primes use gear-type STM, but that must
  be sourced, not assumed.
- **RF 600mm F4 L IS USM is marked "Discontinued / no longer available" on
  Canon's own store.** That contradicts its status as a current flagship and
  would flip `discontinued: true`, changing how prices render. Verify against a
  second source before trusting the store label — it may be a stock artifact.
- The existing `rf-800mm-f11-is-stm` entry carries `blades: 7` and
  `minAperture: 32`, but that lens has a **fixed** f/11 aperture like its 600mm
  sibling. One of the two is wrong; check both against Canon and reconcile.

---

## Canon first-party research — run 2 (2026-08-08): Canon Australia route

Chrome (the extension) hits the **same IP-based Akamai block** on
`usa.canon.com` as WebFetch did — confirmed by re-testing after the full
3-hour wait: same "Access Denied", a fresh Akamai reference number each time.
The block is not client-based and not time-based; waiting does not clear it.

**`canon.com.au` works** and is a legitimate tier-1 source (an official
regional site, per the sourcing rule). Two site quirks to know before using it:

1. **Slug pattern is inconsistent.** Some lenses use no separator before the
   aperture letter (`rf-600mm-f11-is-stm`), others insert one
   (`rf-35mm-f1-4-l-vcm` vs `rf-24mm-f1.4l-vcm` for the otherwise-identical
   24mm). Guessing 404s about half the time — always confirm via
   `canon.com.au/search?q=<name>`, which reliably surfaces the real slug.
2. **The "Dimensions (mm — retracted)" field is templated and unreliable —
   confirmed by direct collision.** Independently fetched lenses returned
   *identical* dimension pairs that cannot both be real:
   - RF 800mm f/5.6L IS USM **and** RF 1200mm f/8L IS USM both show
     `69 x 92.9mm` — physically implausible for either (both are large
     supertelephotos; a 69mm barrel could not house their stated 800g+ front
     elements).
   - RF 24mm f/1.4L VCM shows `76.5 x 99.3mm`; RF 35mm f/1.4L VCM shows the
     *same two numbers reversed* (`99.3 x 76.5mm`); RF 50mm f/1.4L VCM repeats
     `76.5 x 99.3mm` exactly. Three different lenses, one recycled number pair.
   - RF 400mm f/2.8L IS USM and RF 600mm f/4L IS USM both show `168 x 472mm`
     — but Canon USA's own page (fetched independently, before the block) gives
     the 400mm as **163 × 367mm**, a real and different figure. This is the
     clearest proof: two sources for the same lens disagree, and AU's number
     matches its *neighbour* rather than the product.

   **Every other field on these same AU pages is correctly product-specific**
   — elements/groups, blades, weight, MFD, magnification, IS stops, focus
   drive, and AUD RRP all differ correctly per lens and (where cross-checked)
   match Canon USA exactly. Only the dimensions row is affected. Treat AU
   dimensions as **unverified** for any lens without an independent second
   figure; do not enter `diameter`/`length` from AU alone.
3. **AUD RRP is trustworthy and worth capturing even when you already have
   USD** — better than the ratio-derived figure `compute-prices.js` would
   otherwise produce. Recorded via `scripts/price-overrides/canon.json`.

### Entered (4) — dimensions independently verified, not from AU alone

| slug | dimensions source | AUD source |
|---|---|---|
| `rf-600mm-f11-is-stm` | AU retracted figure (93×199.5mm) matches Canon USA's own retracted figure (7.85in = 199.4mm, 3.66in = 93mm) converted independently — genuine agreement, not a collision | `canon.com.au/camera-lenses/rf-600mm-f11-is-stm` |
| `rf-400mm-f28-l-is-usm` | Canon USA direct fetch (163×367mm) — used in place of AU's colliding figure | `canon.com.au/camera-lenses/rf-400mm-f2-8-l-is-usm` |
| `rf-600mm-f4-l-is-usm` | Canon USA direct fetch (168×472mm) | `canon.com.au/camera-lenses/rf-600mm-f4-l-is-usm` |
| `rf-85mm-f12-l-usm-ds` | Cross-validated against our own existing verified `rf-85mm-f12-l-usm` (non-DS) entry — weight (1195g), dims (103.2×117.3mm), elements/groups (13/9), blades (9) are all *identical* to the twin, consistent with DS being a coating-only variant with no mechanical redesign, not a templating collision (the twin's figures were independently sourced in an earlier PR, not from this AU page) | `canon.com.au/camera-lenses/rf-85mm-f1-2l-usm-ds` |

Sources for each field: `usa.canon.com/shop/p/<slug>` (elements/groups, blades,
MFD, max mag, filter, weight, IS stops, weather sealing, USD list price — for
the two lenses fetched before the block) and `canon.com.au/camera-lenses/<slug>`
(all fields except dimensions, plus AUD RRP, plus `afType` which USA's page
text never stated). Release years: DPReview + Canon Rumors announcement
coverage (600/11: 9 Jul 2020; 400/2.8 and 600/4: Apr 2021 announce / Jul 2021
ship). USD prices are Canon's **current** store price, not the 2021 launch
price the announcement coverage quotes (400/2.8 launched at $11,999, now
$13,399; 600/4 launched at $12,999, now $14,499) — a real increase over time,
not an error.

**Correction to my own record:** an earlier message in this session claimed
AU's 400mm f/2.8 figures "match Canon USA exactly." That was said before the
numbers were actually compared side-by-side and is wrong for the dimensions
field specifically — see the collision above. Every other field does match.

### Not entered — blocked specifically on trustworthy dimensions (5)

RF 800mm f/5.6L IS USM, RF 1200mm f/8L IS USM, RF 24mm f/1.4L VCM,
RF 35mm f/1.4L VCM, RF 50mm f/1.4L VCM. For each, every other field is fully
sourced and ready (see below) — only `diameter`/`length` (schema-required,
non-nullable) are missing a trustworthy source. Canon USA would resolve this
in one fetch each if the block lifts; otherwise needs a T2 review/press kit
with real measurements.

| slug | AUD RRP | elements/groups | blades | MFD | max mag | IS | focus | weight |
|---|---|---|---|---|---|---|---|---|
| RF 800mm f/5.6L IS USM | $29,799 | 26/18 | 9 | 2.6m | 0.34x | 4 stops | Nano USM | 3140g |
| RF 1200mm f/8L IS USM | $35,099 | 26/18 | 9 | 4.3m | 0.29x | 4 stops | Nano USM | 3340g |
| RF 24mm f/1.4L VCM | $2,700 | 15/11 | 11 | 0.24m | 0.17x | none | VCM + Nano USM | 515g |
| RF 35mm f/1.4L VCM | $2,699 | 14/11 | 11 | 0.28m | 0.18x | none | VCM + Nano USM | 555g |
| RF 50mm f/1.4L VCM | $2,429 | 14/11 | 11 | 0.4m | 0.15x | none | VCM + Nano USM | 580g |

### Existing shipped data — bugs found while cross-checking, not fixed here

Building the new `rf-600mm-f11-is-stm` sibling required comparing against the
existing `rf-800mm-f11-is-stm` entry, which surfaced three likely errors in
already-shipped data (not touched in this pass — flagged for task 6.1):

- `groups:7` — Canon's own AU spec table says **8**.
- `length:351.8` — Canon's own AU spec table gives the *retracted* length as
  **281.8mm**; 351.8 may be the extended figure entered under the retracted
  field, or simply wrong. Needs the extended figure confirmed separately if
  that's what's intended.
- `afType:'Nano USM'` — Canon's own AU spec table's "Focus Drive System" row
  says **STM** for this lens (matching its own name, "IS STM"). Nano USM is
  used on the L-series primes (400/2.8, 600/4, 800/5.6, 1200/8, 85/1.2 DS) in
  this same research, never on the two f/11 budget primes. The new
  `rf-600mm-f11-is-stm` entry correctly uses `'STM'`, sourced directly from its
  own AU page — it does **not** match the sibling on this field, and that's
  intentional, not an inconsistency to "fix" toward.
- `minAperture:32` and `blades:7` on the existing 800/11 — neither figure
  appears on Canon's own USA or AU pages for either f/11 prime (fixed-aperture
  DO lenses with no conventional iris). Origin unknown; possibly guessed by an
  earlier pass. The new `rf-600mm-f11-is-stm` entry uses `minAperture:11`
  (physically correct for a fixed aperture) and `blades:null` (unverifiable)
  rather than copying the sibling's unsourced numbers.
