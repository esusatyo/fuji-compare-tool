---
name: fetch-product-images
description: Find, verify and apply freely-licensed product images for cameras and lenses that are missing one — sourcing from Wikimedia Commons and other genuinely free repositories, proving each photo is the right product AND that the licence permits use, and recording the attribution the licence requires. Use when the user wants to fill in missing camera/lens images, fix a wrong or broken product photo, shrink KNOWN_IMAGE_GAPS, or audit the licensing of images already in the dataset.
metadata:
  author: fuji-compare-tool
  version: "1.2"
---

Fill in `imageUrl` for items that lack one, using images the project **actually has
the right to display**, and capture the attribution that right depends on.

Two independent things must be true for every image applied. Neither implies the other,
and both are easy to get wrong in ways no test can catch:

1. **It is the right product.** A plausible-looking wrong photo is the dominant failure
   mode here. `scripts/fetch-images.js` once returned an **Audi A1** for the Sony
   `a1-ii`, and a Commons sweep returned the **S5 II** photo for the `s5` and the
   **G9 II** photo for the `g9`. A dead link fails loudly; a wrong photo ships silently.
2. **The licence permits use, and its conditions are met.** "Found on Wikipedia" is not
   a licence. Most free licences here are CC BY / CC BY-SA, which permit commercial use
   **only with attribution** — so applying one without recording the credit puts the
   site out of compliance, not into it.

---

## Current state (audited 2026-07-26 — re-verify, don't trust these numbers)

272 items carry an image:

| Source | Count | Licence status |
|---|---|---|
| `upload.wikimedia.org` | 105 | Free. **92 of 104 unique files require attribution** (41× CC BY 2.0, 41× CC BY-SA 4.0, 4× CC BY-SA 3.0, 4× CC BY 4.0, 1× CC BY 3.0, 1× CC BY-SA 3.0 de). 12 are CC0 — no attribution needed. |
| Manufacturer / retailer hotlinks | 167 | **No licence basis.** `sigma-global.com` (59), `fujifilm-x.b-cdn.net` (75), `tamron.com` (6), `cdn.shopify.com` (10), `viltrox.com` (4), plus TTArtisan, 7Artisans, Voigtländer, Venus/Laowa, foto-erhardt. |

**Attribution is now built and enforced** (PR #18, 2026-07-27, landed the day after this skill did): every `upload.wikimedia.org` `imageUrl` must carry a matching `imageCredit` object (`author`, `licence`, `licenceUrl`, `source`), checked by `checkImageCredit` in `tests/helpers/schema.js` and rendered in a credits block on `about.html` by `scripts/generate-seo.js`. Steps 5–6 below are about *using* that machinery for whatever you add this run, not building it from scratch.

The 167 manufacturer hotlinks are a separate, pre-existing decision — publicity product shots used to depict the product they advertise. That is common practice and low-risk, but it is **not** "copyright free". Don't silently convert them, and don't add new ones under this skill without flagging the trade-off.

---

## Where images may come from

**Tier 1 — Wikimedia Commons.** The default. Every file carries machine-readable
licence metadata via the API, so licence and attribution are provable rather than assumed.

**Tier 2 — other genuinely free repositories**, only when Commons has nothing:
- Manufacturer press/newsroom assets **with explicit written permission for editorial
  reuse** — quote the permission text and link it. Rare; most "press kits" are not free.
- Openverse (`openverse.org`) — aggregates CC-licensed images; still verify licence at
  the source, not via the aggregator.
- Public-domain sources (US federal works, expired copyright, explicit CC0 releases).

**Tier 3 — the manufacturer's own official product page**, only when Tiers 1–2 turn up
nothing, and only with the owner's explicit go-ahead (given 2026-08-17: "let's do it"
for the remaining gaps — the earlier default was to flag this trade-off and stop, and
that default still applies to anything not covered by that decision). This is **not**
a free licence — it's the same "a product photo may depict the product it's selling"
retail norm already covering the dataset's 167 pre-existing manufacturer hotlinks
(`sigma-global.com`, `fujifilm-x.b-cdn.net`, `tamron.com`, etc.), extended to fill
remaining gaps rather than left as a closed, historical set:
- Source the image from the model's **own current official product page** on the
  manufacturer's site — not a press kit, not a retailer, not a fan/review site hosting
  a re-uploaded copy. A page that no longer exists (common for cameras discontinued
  10–20 years ago, e.g. Panasonic's DMC-L10) has no Tier 3 candidate either; don't
  substitute a retailer or archive copy for it.
- Record the page as an `imageSource` citation (see step 5) — this is what makes a
  Tier 3 image different from an untracked hotlink: every one added under this tier
  must be traceable back to the exact page it came from.
- Still subject to step 3's correctness bar in full — generation suffixes, wrong
  mount, non-product images are rejected exactly as they would be from Commons.

**Never acceptable:** Google Images results, Amazon/B&H/retailer product shots, review-site
photographs, Pinterest, stock previews, watermarked images, or anything whose licence you
cannot name and cite. **English Wikipedia article images are a trap** — many product photos
there are uploaded under a *non-free fair-use* rationale that applies to Wikipedia only.
Always resolve to the **Commons** file and read its licence. If a file is on Wikipedia but
not Commons, treat it as non-free unless proven otherwise.

---

## Steps

### 1. Establish the gap list
Read `KNOWN_IMAGE_GAPS` in `tests/data/completeness.test.js` and sweep all brands for
`imageUrl: null`. Distinguish:
- **Genuinely new products** (no free photo exists yet — e.g. `fx5`, announced days ago).
  Expect to fail; don't force it.
- **Older items** where a photo plausibly exists but earlier fuzzy matching missed or
  rejected it.
- **Third-party lenses** — mostly absent from Commons entirely.

State the counts back to the user before doing bulk work.

### 2. Search — start with the existing script
`scripts/fetch-images-commons.js` already implements curated-category + strict
model-token matching. **Run it dry first** (no `--apply`):

```bash
node scripts/fetch-images-commons.js <brand> [cameras|lenses|all]
```

Do **not** use `scripts/fetch-images.js` — its own header documents that its fuzzy
name-match returns wrong subjects. `scripts/apply-images.js` is a historical one-off for
Canon; don't generalise it.

For items the script misses, query the Commons API directly — search the model's
category (`Category:Sony Alpha 7R V`), then file search with strict model tokens.

### 3. Prove it is the right product
For each candidate, before accepting it:
- The normalised filename **and** the Commons file-page description must contain the
  model's distinguishing tokens. Reject if the token only *nearly* matches — `a1` must
  not match `A1` in an unrelated product, `s5` must not match `S5 II`.
- **Generation suffixes are the classic trap.** A file for "Lumix S5 II" is not the `s5`.
  Require the suffix to match exactly, including its absence.
- Reject non-product images: logos, diagrams, sensor/rear-only shots, sample photographs
  *taken with* the camera, screenshots, video stills, packaging, people holding gear.
- Confirm the MIME type really is `image/*`.
- **Look at the image.** Read it with the Read tool and confirm the visible body/lens
  markings match the model name. This is the only check that catches a correctly-named
  file containing the wrong photo, and it is why `a9-ii` was visually verified before
  being accepted.

When uncertain, **leave the gap**. An empty placeholder is honest; a wrong photo is a
factual error about a product a shopper may buy.

### 4. Prove the licence permits use
Query the Commons API for each accepted file and read `extmetadata`:

```
https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo
  &iiprop=extmetadata&titles=File:<NAME>
```

Record from the response: `LicenseShortName`, `Artist`, `LicenseUrl`, `AttributionRequired`,
`Restrictions`, and the file-page URL.

- **Accept:** CC0, public domain, CC BY (any version), CC BY-SA (any version).
- **Reject:** anything with `NonCommercial`/`NC`, `NoDerivatives`/`ND`, a non-empty
  `Restrictions` field (trademark/personality rights), "fair use", "non-free", or a
  missing/unparseable licence. A file whose licence you cannot read is a reject, not a
  maybe.
- If `p.missing` is set, the file is **not on Commons** — do not use it.

Never infer a licence from the fact that a file is hotlinkable, or from a sibling file in
the same category.

### 5. Record the source — for every image, not just Commons ones
CC BY and CC BY-SA permit use **only** if credit is given, so the credit must be stored
alongside the URL — an image whose attribution was never captured cannot be lawfully
displayed later, and cannot be reconstructed after the fact once nobody remembers which
file a thumbnail came from. **Never leave sourcing only in the chat transcript or the
step-8 report — if it isn't written into `<brand>/data.js`, it isn't recorded.**

**Commons images (the normal case): automated, don't hand-write the object.** After
applying new `upload.wikimedia.org` URLs, run:

```bash
node scripts/fetch-image-credits.js <brand> --apply
```

This queries the Commons API, strips HTML from the `Artist` field, and inserts
`imageCredit:{ author, licence, licenceUrl, source }` right after each `imageUrl` — safe
to re-run, existing credits refresh in place. `tests/helpers/schema.js`'s
`checkImageCredit` already *requires* a complete `imageCredit` on any
`upload.wikimedia.org` `imageUrl` and rejects one on any other URL, so a Commons image
applied without running this script fails `npm test` rather than shipping silently
uncredited.

**Tier 2/3 images (Openverse, permitted press assets, manufacturer product pages): use
`imageSource`, hand-written, on every one.** `checkImageCredit` only accepts
`imageCredit` on `upload.wikimedia.org` URLs — it errors if set on anything else, because
Tier 2/3 images aren't attribution-under-a-free-licence the way a Commons photo is. Use
the separate `imageSource` field instead (added 2026-08-17,
`tests/helpers/schema.js`'s `checkSources`, same `{url, tier, note, date}` citation shape
`specSources`/`priceSource` already use):

```js
imageUrl:'https://www.manufacturer.com/products/model/hero-shot.jpg',
imageSource: { url:'https://www.manufacturer.com/products/model/', tier:'T1',
               note:'official product page, front 3/4 view, model badge legible', date:'2026-08-17' },
```

No script populates this one — the citation records *which page you actually verified
the image on*, so write it by hand as you apply each image, not after the fact. Don't
apply a Tier 2/3 image and defer the citation to "later" — later is how the 167
pre-existing manufacturer hotlinks ended up with no recorded source at all, which is the
exact gap this field exists to close going forward. It's optional at the schema level
(existing untracked hotlinks aren't retroactively required to gain one), but mandatory in
practice for anything *this skill* applies from here on.

### 6. Confirm the credit renders
The About-page credits block already exists (`imageCreditsBlock` in
`scripts/generate-seo.js`, iterates every item's `imageCredit`) — this step is a check,
not a build, for **Commons** images specifically. `imageSource` citations are provenance
for re-verification, not licence attribution, so they deliberately don't need a public
credits-page entry — confirm instead that `node scripts/generate-seo.js` still runs clean
and `about.html`'s credited-photo count only grew by the Commons images this run added,
not the Tier 2/3 ones.

### 7. Apply, verify, test
Apply only reviewed matches — patch `imageUrl` (+ `imageCredit`) in `<brand>/data.js`,
then remove those ids from `KNOWN_IMAGE_GAPS`. The completeness test fails if a gapped
item gains an image, so the allowlist self-cleans.

```bash
node scripts/verify-images.js [brand]   # every imageUrl returns image/*
npm test                                # schema, completeness, referential
npm run test:links                      # 404/410 fail; 403 only warns
```

### 8. Report
Per brand: images added, gaps remaining and why, licence breakdown of what was added, and
any item where the *only* candidate was rejected for correctness or licence — the user may
want to source those manually.

---

## Related: `BRAND_CONFIG.heroCamera`

If the brand config carries a `heroCamera` slug (in flight on the design-system work at
the time of writing — verify it exists before relying on this), its selection is coupled
to this skill: CLAUDE.md defines it as "whichever current body has a clean
freely-licensed/official product photo", **not** the technical flagship. So filling an
image gap can make a better hero candidate available, and removing/replacing an image can
invalidate the current choice. When this skill changes a current body's image, re-check
whether the brand's `heroCamera` is still the best-photographed option, and say so in the
step-8 report rather than changing it silently.

## Guardrails

- **Never apply an image you have not both seen and licence-checked.** Correct-and-unfree
  and free-and-wrong are equally unusable.
- **Never apply an image whose source isn't durably recorded in `data.js`.** Commons →
  run `fetch-image-credits.js`; Tier 2/3 → hand-write `imageSource` (see step 5). A source
  that exists only in this run's chat transcript is lost the moment the session ends.
- **Never guess or assume a licence.** Cite the file page for every one.
- **Never use English Wikipedia's non-free fair-use product photos.**
- **Prefer a gap to a guess.** `KNOWN_IMAGE_GAPS` is a documented exception, not a failure.
- **Don't churn working images.** Only replace one that is broken, wrong, or non-free.
- **Manufacturer hotlinks (Tier 3) require the owner's go-ahead first — this is not a
  free default.** The owner gave that go-ahead for this dataset's remaining gaps on
  2026-08-17 ("let's do it"), specifically because the same "depicts the product it
  sells" norm already covers 167 pre-existing images here — so a *future* run of this
  skill on *this* repo may treat Tier 3 as standing approval for closing gaps the same
  way, but still needs the current **official product page** for each item (not a press
  kit, not a retailer, not an old page that's gone 404 for a discontinued model — see
  Tier 3 above) and an `imageSource` citation, no exceptions. A different repo, or a
  request to touch *existing* hotlinks (replace/re-license/audit them), is a new
  trade-off — flag it and let the user decide again rather than assuming this consent
  carries over.
- Hotlinking `upload.wikimedia.org` is acceptable for this project's scale; don't
  re-host Commons files without checking the licence's share-alike terms.
