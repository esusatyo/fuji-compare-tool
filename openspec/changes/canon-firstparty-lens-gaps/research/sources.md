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
