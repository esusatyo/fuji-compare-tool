---
name: fetch-product-images
description: Find, verify and apply freely-licensed product images for cameras and lenses that are missing one — sourcing from Wikimedia Commons and other genuinely free repositories, proving each photo is the right product AND that the licence permits use, and recording the attribution the licence requires. Use when the user wants to fill in missing camera/lens images, fix a wrong or broken product photo, shrink KNOWN_IMAGE_GAPS, or audit the licensing of images already in the dataset.
metadata:
  author: fuji-compare-tool
  version: "1.0"
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

**The site currently renders no attribution anywhere** (`grep -rn -i "attribution\|credit\|licen" engine.js *.html` → nothing). So the ~92 CC BY/BY-SA images in use today are technically non-compliant. Raise this with the user on the first run; fixing it is step 6.

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

### 5. Record the attribution
CC BY and CC BY-SA permit use **only** if credit is given, so the credit must be stored
alongside the URL — an image whose attribution was never captured cannot be lawfully
displayed later.

The data model has **no field for this yet**. Adding one is part of this skill's job:

```js
imageUrl:'https://upload.wikimedia.org/...',
imageCredit:{ author:'Henry Söderlund', licence:'CC BY 4.0',
              licenceUrl:'https://creativecommons.org/licenses/by/4.0/',
              source:'https://commons.wikimedia.org/wiki/File:...' },
```

CC0/public-domain items may set `imageCredit: null` (no obligation), but recording the
source is still good practice. Extend `tests/helpers/schema.js` so that **any image whose
licence requires attribution must carry a complete `imageCredit`** — that turns the
obligation into something the test suite enforces rather than something a future run
forgets. Strip HTML from the API's `Artist` field before storing it.

### 6. Surface the credit in the UI
Storing attribution isn't compliance on its own — it has to be visible. Add a credit line
to the rendered card in `engine.js` (author + licence, linking to the source file page),
or a consolidated credits section on the About page linked from each image. Keep it
unobtrusive but real. Confirm the approach with the user, since it touches shared
rendering.

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
- **Never guess or assume a licence.** Cite the file page for every one.
- **Never use English Wikipedia's non-free fair-use product photos.**
- **Prefer a gap to a guess.** `KNOWN_IMAGE_GAPS` is a documented exception, not a failure.
- **Don't churn working images.** Only replace one that is broken, wrong, or non-free.
- **Don't add new manufacturer hotlinks under this skill** — it exists to source *free*
  images. Flag the trade-off instead and let the user decide.
- Hotlinking `upload.wikimedia.org` is acceptable for this project's scale; don't
  re-host Commons files without checking the licence's share-alike terms.
