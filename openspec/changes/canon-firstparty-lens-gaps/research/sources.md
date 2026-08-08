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

---

## Canon first-party research — run 3 (2026-08-08): the 5 blocked lenses resolved, and a correction

**Correction to run 2:** the VCM-prime "dimensions bug" claim was wrong. An
independent T2 source (`the-digital-picture.com`, Bryan Carnathan — a
long-established, methodical reviewer who publishes both the manufacturer's
own spec **and** his own independent measurement side by side) confirms the
RF 24/35/50mm f/1.4 L VCM primes **genuinely share identical barrel
dimensions** — `76.5 × 99.3mm` on all three, matching Canon AU exactly. Canon
deliberately built this trio on one shared barrel; three lenses returning the
same number is a real design choice, not a template collision. The 35mm's
apparent "reversal" was AU printing the pair as L×D on that one page instead
of D×L — same values, different column order, not a wrong number.

The genuinely-confirmed bug from run 2 stands: the two supertelephoto pairs
(400mm f/2.8 / 600mm f/4, and 800mm f/5.6L / 1200mm f/8L) really did have
templated/wrong AU dimensions, now proven by independent measurement rather
than by suspicion:

| lens | AU showed | real manufacturer spec (the-digital-picture.com) |
|---|---|---|
| RF 800mm f/5.6L IS USM | `69 × 92.9mm` | `163 × 432mm` |
| RF 1200mm f/8L IS USM | `69 × 92.9mm` (same wrong pair again) | `168 × 537mm` |

**Method going forward:** `the-digital-picture.com`'s
`Reviews/Lens-Specifications.aspx?Lens=<id>` pages are the single richest
source found this session — manufacturer spec *and* independently measured
figures for weight, dimensions, elements/groups, blades, MFD, magnification,
IS stops, weather sealing, AF motor, filter size, year, all in one page.
WebFetch gets 403'd on this domain; Chrome reaches it fine. The lens ID isn't
derivable from the name — get it from the `<select>` compare-tool's `option
value="<id>"` on any spec page (all lenses are listed there), not from the
friendly review-page URL.

### The 5 previously-blocked lenses — entered

All 5 now in `canon/data.js`, each dimension cross-validated against the
independent measurement, not taken from AU alone:

| slug | dims (mfr spec) | weight | elements/groups | blades | AF | year | USD |
|---|---|---|---|---|---|---|---|
| `rf-24mm-f14-l-vcm` | 76.5×99.3mm | 515g | 15/11 | 11 | VCM + Nano USM | 2024 | $1,499 |
| `rf-35mm-f14-l-vcm` | 76.5×99.3mm | 555g | 14/11 | 11 | VCM + Nano USM | 2024 | $1,499 |
| `rf-50mm-f14-l-vcm` | 76.5×99.3mm | 580g | 14/11 | 11 | VCM + Nano USM | 2024 | $1,399 |
| `rf-800mm-f56-l-is-usm` | 163×432mm | 3140g | 26/18 | 9 | Nano USM | 2022 | $16,999 |
| `rf-1200mm-f8-l-is-usm` | 168×537mm | 3340g | 26/18 | 9 | Nano USM | 2022 | $19,999 |

Sources: `canon.com.au/camera-lenses/<slug>` for AUD RRP, blades, MFD,
magnification, IS stops, focus drive (all confirmed correct on every field
except dimensions on the two supertelephotos); `the-digital-picture.com` for
dimensions, weather sealing, and AF motor detail; DPReview/PetaPixel/Fstoppers
announcement coverage for launch USD price and year.

⚠️ Minor unresolved discrepancies, noted rather than silently resolved:
- 35mm VCM weight: AU says 555g, the-digital-picture.com's manufacturer-spec
  figure (converted from their own imperial rounding) says 550g. Used AU's
  555g (direct metric, no unit round-trip). 5g, immaterial either way.
- 35mm VCM AF motor: AU's structured table says "VCM + Nano USM" uniformly for
  all three primes; the-digital-picture.com's prose says "VCM, USM" for the
  35mm specifically (vs "VCM, Nano USM" for 24mm and 50mm). Used AU's
  structured field for consistency across the trio.
- 800mm f/5.6L IS stops: AU's structured table says 4; the-digital-picture.com
  says 4.5 (a more precise CIPA figure). Used 4.5 (the more precise number);
  1200mm f/8L's IS stops agree exactly between both sources (4.0), no
  discrepancy there.
- 1200mm f/8L USD: DPReview/Fstoppers coverage all confirm $19,999 launch
  price directly — no discrepancy, included for completeness of the pattern.

The `length` schema cap (`tests/helpers/schema.js`) was 500mm — too low for
the RF 1200mm f/8L's genuine 537mm. Raised to 600mm; this is real Canon data,
not an entry error.

### Bugs fixed in the already-shipped `rf-800mm-f11-is-stm` entry

Cross-checked against **two independent sources** —
`canon.com.au/camera-lenses/rf-800mm-f11-is-stm` (T1) and
`the-digital-picture.com` Lens=1513 (T2, incl. its own independent
measurement) — which agree with each other on every field below. The shipped
entry disagreed with both:

| field | was | now | evidence |
|---|---|---|---|
| `groups` | 7 | 8 | both sources agree: 11 elements / **8** groups |
| `length` | 351.8 | 281.8 | AU's own retracted spec; corroborated by the-digital-picture's independent *measurement* of 290.7mm (close, independent methodology). 351.8 is closer to the **extended** figure (~358.9–361.8mm per both sources) with what looks like a single-digit transposition (361.8 → 351.8) |
| `diameter` | 101.8 | 101.6 | both sources agree on 101.6mm |
| `blades` | 7 | null | neither source publishes a blade count for this fixed-aperture design — now possible since `blades` is nullable |
| `minAperture` | 32 | 11.0 | both sources confirm the aperture is **fixed** at f/11 with no range (`f/11.0-11.0`) |
| `afType` | `'Nano USM'` | `'STM'` | both sources say STM (matching the lens's own name, "IS STM") — Nano USM is never used on this budget f/11 pair, only on the L-series |
| `filterThread` | null | 95 | both sources confirm a genuine 95mm **front** filter thread (not drop-in, unlike the L-series supertelephotos) |
| `weatherSealed` | true | false | both sources say `N` |

Eight fields, not the three originally suspected. Given the density of errors
found once actually checked, this entry's original sourcing looks to have been
guessed rather than verified.

### Same-family bug in my own newly-entered `rf-600mm-f11-is-stm` (run 2)

Cross-checking its 800mm sibling above turned up the same mistake in my own
entry from run 2: `filterThread` was set to `null` on the assumption these
f/11 primes use rear drop-in filters like the L-series supertelephotos.
`the-digital-picture.com` Lens=1511 confirms a genuine 82mm **front** filter
thread (matching the "Lens Cap: E-82II" already noted from AU). Fixed to `82`.
Its other fields (weatherSealed: false, minAperture: 11, blades: null,
afType: STM) were independently confirmed correct by this same source.

---

## Canon first-party research — run 4 (2026-08-08): the final 12 lenses (3 fisheye/dual + 9 zooms)

Same method as run 3: `the-digital-picture.com` for the full spec table
(manufacturer spec dimensions, weight, elements/groups, blades, MFD,
magnification, IS stops, weather sealing, AF motor, filter size, year), Canon
Australia for AUD RRP and a verified `productUrl` (found via targeted
`WebSearch` for the exact `canon.com.au/camera-lenses/<slug>` URL rather than
guessing — AU slugs remain inconsistent, e.g. `rf-10-20mm-f4l-is-stm` has no
hyphen before "l" while `rf-15-30mm-f4-5-6-3-is-stm` spells out every digit).
USD launch prices from DPReview/PetaPixel/Fstoppers/CanonRumors announcement
coverage, cross-checked against a second outlet wherever the first search was
ambiguous about launch vs. current street price.

### Entered (12) — canon lens count 72 → 84

**Fisheye / VR-dual (3):**

| slug | dims (mfr) | weight | elements/gr | blades | AF | year | USD / AUD |
|---|---|---|---|---|---|---|---|
| `rf-52mm-f28-l-dual-fisheye` | 121.1×53.5mm | 350g | 12/10 | 7 | **Manual only** | 2021 | $1,999 / ratio |
| `rfs-39mm-f35-stm-dual-fisheye` | 112×53mm | 289g | 11/8 | 7 | STM | 2024 | $1,099 / $1,999 |
| `rfs-78mm-f4-stm-dual` | 68.6×40.6mm | 131g | 9/7 | 7 | STM | 2024 | $450 / $799 |

All three: `filterThread: null` except the 7.8mm (`58`); none weather-sealed
except the RF 5.2mm L (`true`). The RF 5.2mm is the only one of the three that
is genuinely manual-focus-only — confirmed directly (`AF Motor Type: MF Only`),
not assumed from the "L" branding.

**Zooms (9):**

| slug | dims (mfr) | weight | elements/gr | blades | AF | year | USD / AUD |
|---|---|---|---|---|---|---|---|
| `rf-10-20mm-f4-l-is-stm` | 83.7×112mm | 570g | 16/12 | 9 | STM | 2023 | $2,299 / ratio |
| `rf-15-30mm-f45-63-is-stm` | 76.6×88.4mm | 390g | 13/11 | 7 | STM | 2022 | $549 / ratio |
| `rf-28-70mm-f2-l-usm` | 103.8×139.8mm | 1430g | 19/13 | 9 | USM | 2018 | $2,699 / ratio |
| `rf-28-70mm-f28-is-stm` | 76.5×92.2mm | 495g | 15/12 | 9 | STM | 2024 | $1,099 / $1,919 |
| `rf-24-105mm-f28-l-is-usm-z` | 88.5×199mm | 1330g | 23/18 | 11 | Dual Nano USM | 2023 | $2,999 / $5,399 |
| `rf-24-240mm-f4-63-is-usm` | 80.4×122.5mm | 750g | 21/15 | 7 | Nano USM | 2019 | $900 / $1,719 |
| `rf-70-200mm-f28-l-is-usm-z` | 88.5×199mm | 1107g | 18/15 | 11 | Dual Nano USM | 2024 | $2,999 / $5,399 |
| `rf-100-300mm-f28-l-is-usm` | 128×323.4mm | 2650g | 23/18 | 9 | Dual Nano USM | 2023 | $9,499 / ratio |
| `rf-200-800mm-f63-9-is-usm` | 102.3×314.1mm | 2050g | 17/11 | 9 | Nano USM | 2023 | $1,899 / $3,499 |

`maxAperture`/`minAperture` for the two variable-max-aperture zooms
(15-30mm, 24-240mm, 200-800mm) follow the established dataset convention:
`maxAperture` = the wide-end widest aperture, `minAperture` = the long-end
smallest aperture (most restrictive), matching how the existing
`rf-24-105mm-f4-71-is-stm` and `rf-75-300mm-f4-56` entries already encode this.

⚠️ **`rf-24-105mm-f28-l-is-usm-z` and `rf-70-200mm-f28-l-is-usm-z` share
identical AUD RRP ($5,399) and near-identical USD ($2,999 both) and dimensions
(88.5×199mm both).** Checked this is not a repeat of the run-3 template-bug
pattern: these are genuinely two different Canon "Z-series" hybrid lenses
launched a year apart, independently confirmed via DPReview announcement
coverage for each (Nov 2023 and Oct 2024 respectively) with their own distinct
weights (1330g vs 1107g) and elements/groups (23/18 vs 18/15). Canon appears to
have deliberately built both on the same outer barrel/AUD price tier. Recorded
here so a future pass doesn't mistake the coincidence for a bug and "fix" it.

### `focalLengthEquiv` decision for dual-fisheye/VR lenses (was task 4.4)

Documented in `CLAUDE.md`: dual-fisheye/VR lenses don't get a crop multiplier
applied — `focalLengthEquiv` equals the native focal length even on the RF-S
(APS-C) body. These lenses produce twin circular-fisheye images for
stereoscopic VR/3D, not a single rectilinear frame; the standard
"35mm-equivalent" framing concept doesn't apply and a multiplier would mislead
a reader comparing them against ordinary lenses.

### Bonus fix: `RF 85mm f/1.4 L IS USM` → `RF 85mm f/1.4 L VCM` (task 6.1, resolved)

This change's own `research/lenses.md` flagged this existing entry's name as
likely wrong back when the 21-lens gap was first enumerated. With the same
tooling already open for the 12-lens batch above, resolved it directly rather
than leave it for later — Lens=1749 on `the-digital-picture.com` confirms the
real product is the **RF 85mm f/1.4 L VCM**, and the existing entry turned out
to be wrong on far more than the name:

| field | was | now | evidence |
|---|---|---|---|
| `name` | `RF 85mm f/1.4 L IS USM` | `RF 85mm f/1.4 L VCM` | the product doesn't exist under the old name; `afType` already correctly said `'VCM'`, contradicting the entry's own name |
| `weight` | 1410g | 636g | off by **more than 2×** — the-digital-picture.com's manufacturer spec, matching the real VCM-family lens |
| `length` / `diameter` | 95.5 / 93.8mm | 99.3 / 76.5mm | shares the VCM trio's barrel (76.5×99.3mm), confirmed independently |
| `filterThread` | 82 | 67 | matches VCM family (67mm), not the L-USM family (82mm) |
| `minFocusDist` | 70 | 75 | manufacturer spec, 750mm |
| `year` | 2024 | 2025 | confirmed announcement year |
| `productUrl` | `usa.canon.com/shop/p/rf85mmf14lisusm` (a slug for a product that doesn't exist) | `canon.com.au/camera-lenses/rf-85mm-f1-4l-vcm` (verified real) | — |
| `prices` | `USD:2999` + `priceIncomplete:true` with implausible partial AUD/CAD | `USD:1649`, other currencies ratio-derived | $1,649 MSRP confirmed via CineD/TechRadar/cpricewatch; `asin` (`B0FPZBRPTQ`) was the one field already correct — confirmed against Amazon's own listing |
| `elements`/`groups`/`blades`/`maxMagnification`/`weatherSealed`/`ois`/`afType` | — | unchanged | independently confirmed correct as originally entered |

The density and size of the errors (weight off by 2.2×, a `productUrl` slug for
a nonexistent product) matches the pattern already seen on `rf-800mm-f11-is-stm`
in run 3 — another sign that some of this dataset's older entries were guessed
rather than sourced. Worth a dedicated audit pass at some point, separate from
this change's scope.

### Not entered, and why

Nothing from the original 21-lens gap list remains unentered.
