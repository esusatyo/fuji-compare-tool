---
name: verify-specs
description: Audit existing camera and lens specs for factual correctness against the maker's own published figures — weight, dimensions, sensor, EVF/LCD, IBIS, burst, video, weather sealing, optical formula, focus distance and the rest — and record a durable specSources citation for every item checked. Scope can be a camera brand, a lens maker across all brands (e.g. all Sigma lenses), a mount (e.g. L-mount), or just one or a few named items. Research first, report mismatches, apply only what the owner approves. Use when the user wants to check, verify, audit or fact-check specs, find wrong data, or add spec citations to uncited items.
metadata:
  author: fuji-compare-tool
  version: "1.4"
---

Check that the specs already in the dataset are **true**, not just well-formed.

**Conventions and owner decisions live in `docs/data-methodology.md`** (the single
source of truth, and the basis of the public methodology page). The table in
Step 3 restates it for convenience; if they disagree, the methodology doc wins.
Every new owner decision goes into that doc's tables **and** its decision log,
with the date, the reason and the item that triggered it, before this skill is
updated.

`npm test` proves the data is structurally valid; it cannot tell a wrong weight
from a right one. This skill re-reads each item's specs from its maker, reports
every disagreement, and — once the owner approves — fixes the values and leaves
a `specSources` citation behind so the next audit starts from evidence.

Why it exists: errors that passed every test for months — the X-T50 marked
weather-sealed (Fujifilm never claims it; fixed PR #92), 19 of 22 Sigma L-Mount
lenses carrying Sony E-mount dimensions, a fabricated Tamron lens in Nikon.

**What this skill does NOT do** (hand off instead):
prices and ASINs → `check-prices-and-buy-links`; new releases and dead
`productUrl`s → `refresh-camera-data`; images → `fetch-product-images`;
adding lenses → `add-thirdparty-lenses`. If you notice one of those while
verifying, note it under "Seen in passing" in the report — don't fix it here.

---

## Step 0 — Resolve the scope

The user may name any of these, alone or combined:

| User says | Flag |
|---|---|
| a camera brand — "Nikon", "check Canon" | `--brand nikon` (cameras **and** lenses in that file) |
| a lens maker — "all Sigma lenses", "Viltrox" | `--maker sigma` (lenses only, across **every** brand file) |
| a mount — "L-mount", "MFT lenses", "RF" | `--mount l` (every brand file that uses it) |
| specific items — "X-T5 and the Z 50mm f/1.8 S" | `--items x-t5,"Z 50mm f/1.8 S"` (slug, `brand:slug`, or a name substring) |
| narrowing — "only cameras", "only the uncited ones", "skip discontinued" | `--kind cameras`, `--uncited`, `--current` |

Resolve it with the bundled script — never by eyeballing a data file:

```bash
node .claude/skills/verify-specs/scope.js                      # coverage overview, no list
node .claude/skills/verify-specs/scope.js --maker sigma --uncited
node .claude/skills/verify-specs/scope.js --items x-t5,sigma-56mm-f14
```

It prints one `brand:slug` line per item with mount and citation status,
uncited first. Read its `!` lines:

- **`matched N items`** — a bare slug like `sigma-56mm-f14` exists in several
  brand files, and each one is a **different mount** with its own specs.
  Verify each separately; if the user plainly meant one ("the Fuji one"), ask
  or narrow with `brand:slug`.
- **`NO MATCH`** — tell the user; don't guess a near miss.
- **"Sigma" is ambiguous**: the `sigma` *brand* (Sigma cameras + Sigma's
  L-Mount lenses in `sigma/data.js`) vs. the `Sigma` *maker* (every Sigma lens
  in every brand file). Ask which unless the wording settles it.

**No scope given?** Don't sweep 1,700 items. Show the coverage overview and
propose one batch — default suggestion: one brand's **current, uncited
cameras** (cameras are few and heavily viewed).

**Batching.** Work in batches of **~15 items**. A scope bigger than one batch:
state the total and the batch plan, verify batch 1, report, then continue only
on the owner's go-ahead. A half-checked brand is reported as half-checked —
never summarise "Nikon looks clean" from the first 15 of 230.

One agent at a time on this repo. Do the research yourself, sequentially; no
parallel subagents or forks unless the owner explicitly allows it for this
session.

---

## Step 1 — Set up a ledger

Branch off a fresh `origin/main` (in a worktree if the primary checkout is on
someone else's branch — other sessions share it). Create the ledger
`docs/spec-verification/<YYYY-MM-DD>-<scope>.md` (example rows are
illustrative):

```markdown
# Spec verification — <scope> — <date>
Scope command: `node .claude/skills/verify-specs/scope.js --maker sigma --uncited`
Batches: 1/4 (items 1–15)

| item | field | stored | source value | normalised | verdict | source (tier) |
|---|---|---|---|---|---|---|
| nikon:z-50mm-f1-8-s | weight | 415 | 415 g | 415 | ok | nikon.com/… (T1) |
| canon:sigma-56mm-f14 | length | 55.7 | 59.5 mm | 59.5 | **MISMATCH** | sigma-global.com/… RF tab (T1) |
```

Write rows **as you read each page**, and commit the ledger at the end of every
batch. Sessions die mid-run; the ledger is how the next one resumes without
re-reading 40 pages.

---

## Step 2 — Find the source for each item

**Tier 1 — the maker's own spec page for *this mount*** is the authority and
is sufficient alone: the item's `productUrl`, the maker's global site, or an
official regional site (`canon.com.au`, `sigma-photo.co.uk`, `laowa.com.au`,
`fujifilm-x.com/<region>/`) — the regional ones are the practical route when
the global domain is blocked. The maker's spec PDF or press release also
counts. Start with any existing `specSources` URL on the item.

**Tier 2 — independent measurement** (LensTip, Opticallimits, DPReview,
ephotozine, Dustin Abbott, admiringlight). Reach for it when tier 1 is
missing, ambiguous, looks physically wrong, or lumps mounts together. Not a
reprinted press release.

**Never** a source for a spec: retailers (T3 — price only, one shared
distributor feed), aggregator databases (T4 — lensfinder.org's tables matched
tier 1 exactly while its mount attribution was ~30% wrong; it also soft-404s),
rumour sites, AI summaries, or **another brand's `data.js`** (copied errors are
exactly what this skill hunts).

Traps already paid for — check these before trusting a page:

- **Units drift per brand file.** Leica stored `lcdDots`/`evfDots` as raw dot counts (2332800) while every other brand uses thousands and millions, so the site printed "2,332,800K dots" and Leica won every resolution row. Before verifying a brand, grep its file for `lcdDots:[0-9]{5,}` / `evfDots:[0-9]{3,}` and other out-of-range magnitudes. (2026-11-17)
- **The same lens in several brand files must agree** (`tests/data/shared-mount.test.js`): a fix to a Sigma, Panasonic, Laowa or OM lens in one brand file has to be mirrored into every other file that holds that slug for the same mount (e.g. `panasonic/` ↔ `leica/`, `sigma/`, `olympus/`). (2026-11-16)

- **Combined spec tables.** A third-party page listing "Sony E / Nikon Z /
  Canon RF / L-Mount" often prints *one* set of figures, usually one mount's.
  Weight and length genuinely differ by mount (L-Mount barrels run ~2 mm
  shorter than E). Use the per-mount tab, or tier 2, never the lumped row.
- **`canon.com.au`'s "Dimensions (retracted)" row is templated garbage** for
  many lenses (identical figures on unrelated supertelephotos). Its other
  fields are reliable. Get dimensions elsewhere.
- **`usa.canon.com` geo-blocks** (clean 403, Akamai ref) — don't retry, go
  regional. `electronics.sony.com` blocks plain fetches but loads in Chrome.
- A 403 is a bot block, not proof of anything. Try Chrome automation, then a
  regional site, then tier 2.
- **Revisions are separate entries.** "II" / "Mark II" / a redesign is its own
  item; don't "correct" the original's specs to the successor's (or the
  reverse). Check the page is for exactly this model.

No tier-1 or tier-2 source for an item after reasonable effort → verdict
**unverifiable**, listed in the report with what you tried. Never "verify"
from memory.

### Per-brand source recipes (learned 2026-11-14/15, re-check if a page moves)

Most maker sites block plain fetches, so work in Chrome: open one page on the
maker's domain, then `fetch()` the rest **from that same origin** inside
`javascript_tool` and parse with `DOMParser` (much faster than navigating
page by page, and immune to the 403s). Launch big fetch loops without awaiting
them (store results on `window`) and poll, since a single call times out after about 45 s.
Results over about 1,000 chars get truncated, so return compact diffs, not pages; and the
extension blocks output that looks like cookies/query strings, so strip URLs
and odd characters from what you return. Write `\x5c` rather than a backslash-u
escape in the JS you send, or the tool rejects the call.

| maker | where the full spec lives | notes |
|---|---|---|
| Fujifilm | `fujifilm-x.com/global/products/cameras/<slug>/specifications/` (plain curl works; some older bodies redirect to the overview page, which carries the table) | rows are `.camera-specifications h6` blocks; battery gives Economy + Normal (use Normal); hybrid-finder bodies give EVF / OVF figures (split, see Step 3). A discontinued slug may redirect to an unrelated camera (x-half → x-t30): check the final URL |
| Canon (Japan, preferred since 2026-11-18) | `personal.canon.jp/product/camera/rf/<code>/spec` (lenses, e.g. `rf24-240-f4-63`, `rf-s18-150-f35-63`; codes from the links on `/product/camera/rf`) and `/product/camera/eos/<code>/spec` (cameras, e.g. `r8`, `r8mk2`) | Japanese `<tr>` rows: 最小絞り (min aperture, per focal length), 最短撮影距離 (close focus, AF時 / MF時), 最大撮影倍率 (magnification), 最大径×長さ (diameter × length). Sealing claims (防塵・防滴) are on the product page (no `/spec`), not in the table. canon.co.uk and canon.ie returned Akamai Access Denied to Chrome on 2026-11-18 |
| Canon cameras | `canon.co.uk/cameras/<slug>/specifications/` | usa.canon.com geo-blocks; canon.com.au has only a summary; read `textContent` (accordions are collapsed); IBIS stops are in footnotes; no Bluetooth version |
| Canon lenses | `canon.co.uk/lenses/<slug>/specifications/`, slugs from `/sitemap/sitemap-product-detail-page-uk-en.xml` | rows `li.product-specification-detail__list-line`; **remove `<sup>` footnotes**, because in plain text they run into the values; zooms list AF and MF figures. The "Dust/Moisture Resistance" row is unreliable (says Yes for the budget RF 75-300): confirm sealing on Canon Japan |
| Nikon | summary on `imaging.nikon.com/imaging/lineup/{mirrorless,lens/z-mount}/<slug>/`; full sheet (battery, Bluetooth) on the Nikon USA product page | battery has Energy-saving ON/OFF (use OFF); "with tripod collar" weights and "with built-in TC" magnifications are not the stored convention |
| Sony | `electronics.sony.com/.../p/<model>`: the full spec sheet is embedded JSON (`"featureValues":[{"value":…}],"name":…`); older bodies on `sony.com/electronics/support/<series>/<model>/specifications` | headline depth (not grip-to-monitor) is the stored convention; lens minimum focus is in inches with no AF/MF label, so don't compare it from there |
| Sigma | `sigma-global.com/en/lenses/<code>/`; cameras `/en/cameras/<slug>/` | one page lists every mount: read the `<Mount name>` rows for size and weight (MFT row is "Micro Four Thirds mount"); a "mount with dust and splash resistant structure" is a gasket only, so `weatherSealed` = false |
| Panasonic | `panasonic.jp/dc/products/<model>/spec.html` (cameras `DC-…`, lenses `S-…`/`H-…`) | US shop and UK/AU/SG pages show only a summary. Japanese model codes differ for some bodies (G97 = DC-G99D, G95 = DC-G99, GX9 = DC-GX7MK3, G100 = DC-G100V, G100D = DC-G100DV). Bodies with CFexpress/XQD + SD list two CIPA sets: use the SD set. Lens magnification: the first figure is native, the bracketed one is 35mm-equivalent. The server is slow (about 8 s per page) |
| OM System | `explore.omsystem.com/us/en/<slug>` | "Maximum image magnification" gives the MFT figure, then the 35mm one; some pages give only the 35mm figure (halve it) or none. Weights may include the tripod foot. A few pages have no spec table |
| OM System / Olympus (full sheets, incl. discontinued) | `jp.omsystem.com/product/dslr/<code>/spec.html` (cameras; redirects to the real path or to an archived `cms/record/<dslr\|compact>/<code>/spec.pdf`) and `jp.omsystem.com/product/lens/<type>/<line>/<code>/spec.html` | Japanese. Codes: em1mk3, em10mk4, epl10, om1mk2, om5mk2, `pen/pen` (2026 PEN), `compact/tg7`. The archived PDFs are screenshots with no text layer: OCR them with macOS Vision (`VNRecognizeTextRequest`, ja-JP, tile ~1,600 px), since tesseract has no Japanese here. Viewfinder magnification is native (divide by 2; store the finder-style maximum). A 403 on a PDF means it does not exist (E-P1/2/3/5, E-PL1/2/3, E-PM1, TG-1/2) |
| Leica | `leica-camera.com/en-US/photography/<cameras\|lenses>/<line>/<slug>/technical-specification`; slugs from `/sitemap.xml` (24 child sitemaps) | many older `sites/default/files/pm-…pdf` links now 404/502. Leica's lens pages contain copy errors (a diameter copied from another lens, a scale contradicting its own object field): cross-check against the object field and against sibling pages before applying. Weights for SL bodies are without battery |
| Thypoch, TTArtisan | store.thypoch.com / ttartisan.store (maker's own Shopify) | read in Chrome; `.json` endpoints are blocked. TTArtisan gives weight ranges across mounts |
| Zeiss ZM | zeiss.com | Access Denied (Akamai) to curl and Chrome on every regional path, as of 2026-11-17: unverifiable |
| Tamron | `tamron.com/global/consumer/lenses/<model>/spec.html` or `tamron-americas.com/product/<slug>/` "Technical Specifications" | per-mount length and weight in parentheses |
| Laowa | `venuslens.net/product/<slug>/` | one figure for all mounts (owner-accepted); search `/?s=<focal>&post_type=product` when a slug 404s |
| Voigtländer | `cosina.co.jp/voigtlander/en/<mount>/<slug>/` | plain curl works (2026-11-17, all 34 VM/MFT pages read). Weights are listed per finish / Type I-II; the stored value only has to match one |
| Viltrox, 7Artisans | specs only in images / multi-lens comparison tables | treat as unverifiable rather than map columns by guess |
| Yongnuo, Samyang US | yongnuo.eu, samyangus.com are distributors | not T1; use the maker's own site |

---

## Step 3 — Compare field by field

Fields in scope (everything factual and spec-like):

- **Cameras:** `year`, `sensorMP`, `sensorType`, `processor`, `width`,
  `height`, `depth`, `weight`, `weatherSealed`, `lcdSize`, `lcdDots`,
  `lcdType`, `evfType`, `evfDots`, `evfMag`, `faceDetection`,
  `subjectDetection`, `maxBurst`, `ibis`, `ibisStops`, `maxVideoRes`,
  `logVideo`, `bluetooth`, `wifi`, `cardSlots`, `batteryLife`, `usbCharging`,
  `lensType`/`lensSpec`, plus the brand's own fields (`filmSims`, `dpafPoints`,
  `expeed`, `vLog`, `monochrom`, … — see the `brandSections` branches in
  `tests/helpers/schema.js`).
- **Lenses:** `year`, `focalLength`/range, `focalLengthEquiv`, `maxAperture`,
  `minAperture`, `weight`, `length`, `diameter`, `filterThread`,
  `minFocusDist`, `maxMagnification`, `elements`, `groups`, `blades`,
  `afType`, `ois`/`oisStops`, `weatherSealed`.
- **Out of scope:** `tagline`, `prices`, `asin`, `imageUrl`, `productUrl`
  (other skills own them).

**Normalise before you compare** — most "disagreements" are definitional:

| Field | Convention in this dataset |
|---|---|
| lens `weight` | grams, bare lens: no hood, caps or tripod collar |
| camera `weight` | grams, **with battery and card** (X-T5 557, A7 IV 658) — the maker's "including battery and memory card" figure |
| lens `length` | mm, mount flange to front, zoom at shortest |
| lens `diameter` | max barrel diameter, not filter thread |
| camera `width`×`height`×`depth` | mm, maker's headline figures |
| `minFocusDist` | **cm**, from the focal plane; zooms = shortest across the range (`0.121 m` → `12.1`). Where AF and MF figures differ, the **AF** figure (owner rule 2026-11-18) |
| `maxMagnification` | decimal (`1:2` → `0.5`); zooms = max across range; **AF** figure where AF and MF differ (owner rule 2026-11-18) |
| `maxAperture` | f-number at the wide end; never a T-stop |
| `minAperture` | variable-aperture zooms: the **wide-end** minimum (Canon "22 (24mm) / 36 (240mm)" → 22; owner rule 2026-11-18). Fixed-aperture lenses with no iris (SG-image 50mm f/1.8 shaped-aperture) store min = max |
| `elements`/`groups` | the maker's current page wins over an older stored count, even when it looks odd (owner, 2026-11-18: OM 40-150 f/4 PRO → 19) |
| `lcdDots` | thousands of dots (`1840`) |
| `evfDots` | millions of dots (`3.69`) |
| `evfMag` | 35mm-equivalent magnification (`0.8`); divide native by the crop (APS-C 1.5, RF-S 1.6, APS-H 26.7/36, MFT 2.0). **Hybrid optical/electronic finders** (X100 / X-Pro): the **optical** figure (X100VI 0.52; owner rule 2026-11-18) |
| camera `weight` from a body-only page | use the maker's with-battery figure for the identical body (OM-3 ASTRO = OM-3 496; owner 2026-11-18) |
| `sensorMP` | effective MP; **Foveon** = top-layer figure (sd Quattro 19.6 / H 25.5, not 29.5 / 38.6; owner rule 2026-11-18) |
| `ibisStops` | the **body-only** figure, never Sync IS / Dual I.S. 2 with a stabilised lens (owner rule 2026-11-18; OM System quotes both, Panasonic quotes B.I.S. vs Dual I.S. 2) |
| `batteryLife` | CIPA shots — where the maker gives several modes, the **Normal** (not Economy) figure (owner rule 2026-11-14). **Nikon: Energy-saving OFF**; **Panasonic: the SD-card set** when CFexpress/XQD and SD are listed separately (both confirmed 2026-11-18) |
| hybrid-finder battery | `batteryLifeEvf` + `batteryLifeOvf`, `batteryLifeLcd: null`, `batteryLife` = the EVF figure (schema-enforced; owner rule 2026-11-18). X100VI 310/450, X100V 350/420, X100F 270/390, X-Pro3 370/440, X-Pro2 250/350 |
| battery split | **Split** (owner rule 2026-11-15) where the maker publishes both: `batteryLifeLcd` (screen) + `batteryLifeEvf` (viewfinder; `null` without one), `batteryLife` = the screen figure (schema-enforced). Canon, Sony, Nikon and Panasonic publish both; makers that give one figure per mode (Fujifilm Normal/Economy, Leica, Sigma) stay on `batteryLife` |
| burst | **Split** (owner rule 2026-11-14): `maxBurstMech` = top mechanical-shutter rate (an electronic-first-curtain rate counts as mechanical — it uses the mechanical rear curtain; owner rule 2026-11-15), `maxBurstElec` = top electronic rate *including* crop modes, `maxBurstElecCrop` = that rate's crop factor (omit if none), `maxBurst` = the faster of the two (schema-enforced). `null` = no such shutter / not published. **Nikon**: the C30/C60/C120 high-speed frame capture modes are excluded (confirmed 2026-11-18). A rate that no maker source lists (Leica Q2 "20 fps") is not used. Convert a camera to the split fields when you verify it; if the source is ambiguous for either rate, leave it on legacy `maxBurst` and list it |
| `focalLengthEquiv` | native × crop (X/E APS-C/DX/TL 1.5, RF-S 1.6, MFT 2.0, FF 1.0); dual-fisheye lenses take no crop |
| `year` | first shipping year **in this mount**, not the design's original launch |
| `weatherSealed` | `true` **only** if the maker claims sealing/dust- and splash-resistance. A review calling it "robust", or a rear mount gasket alone, is `false`. Silence from the maker = `false`. Weather resistance that needs an accessory (adapter ring + filter on X100VI/GFX100RF) = `false` (owner rule 2026-11-14). Two maker pages that disagree (Canon UK says sealed, Canon Japan silent) → find a third maker source; until then `false` (owner, 2026-11-18: EOS R8, RF 75-300). Canon Japan confirms the RF 16-28 f/2.8 IS STM, so it is `true` |
| `afType` | the maker's own motor name (`VXD`, `HLD`, `Stepping Motor`, `Manual focus`) |

**Unit traps:** convert from the maker's metric figure, never round-trip oz/in.
Filter thread ≠ diameter.

**Before calling a mismatch on a *convention* field** (`maxBurst` mech vs
electronic, `batteryLife` LCD vs EVF, `subjectDetection` wording): look at how
two or three sibling entries in the same brand are populated. If the stored
value matches the source under a different-but-consistent convention, it's
`ok`. If the brand itself is inconsistent, that's a **convention question**
for the owner, not a correction.

Verdicts per field: **ok** · **MISMATCH** (source clearly differs after
normalising) · **rounding** (≤1 g / ≤0.5 mm / display rounding — never worth a
question; count it, don't list it) · **convention?** · **unsourced** (the
source doesn't state this field) · **unverifiable** (no usable source at all).

Sources still disagreeing after normalisation: tier 1 wins; record both
values in the ledger with a one-line reason. Never average. A held or decided
item is **re-raised** when a new T1 source contradicts the evidence the decision
was made on (2026-11-18: the RF 16-28 was about to be set "not sealed" until
Canon Japan confirmed the seal). Before calling a value "certainly wrong", read
the maker's own wording: SG-image's min = max aperture looked like an error but
is a fixed-aperture design. Also record values
you **rejected** and why — that stops the next pass "correcting" a right
number to a wrong one.

---

## Step 4 — Report BEFORE editing

Post one report per batch. Nothing is changed in `data.js` yet. (The values
below are illustrative only — not findings.)

```
## Spec verification — Sigma lenses, batch 1/4 (15 items)

### Mismatches (N) — proposed fixes
- canon:sigma-56mm-f14  length 55.7 → 59.5 mm
    sigma-global.com RF-mount tab (T1): "59.5mm". Stored value equals the E-mount tab.
- fujifilm:x-t50  weatherSealed true → false
    fujifilm-x.com spec page lists no weather resistance; Fujifilm states it for the X-T5, not the X-T50.

### Convention questions (N)
- nikon:z6-iii  batteryLife 360 = EVF CIPA figure; most Nikon entries use the monitor figure (390). Which?

### Unverifiable (N)
- leica:m-e-220  no reachable T1 page or PDF; tried leica-camera.com, Lensrentals mirror. Left as is.

### Verified clean: 11 items (+ N rounding-only differences, not changed)
### Citations to add: specSources on all 14 items that had a source
### Seen in passing (other skills): rf-20mm-f14 productUrl 404 → refresh-camera-data
```

Every proposed change names the field, old → new, the source URL and tier,
and a quote or the exact figure. If the evidence is thin, the item goes under a
question, not a fix. Report what you actually checked; a batch you didn't
finish is "batch 1 of 4 done", never a verdict on the whole scope.

---

## Step 5 — Apply what's approved

1. Edit only the approved fields, keeping the file's hand-aligned style.
2. Add or extend `specSources` on every item you got a source for, including
   the clean ones — that's half the value of the run:
   ```js
   specSources:[ { url:'https://<the page you actually read>', tier:'T1', date:'2026-11-14', title:'Sigma global product page (RF mount)' } ],
   ```
   Fields: `url`, `tier` (`T1`/`T2`/…), `date` (when you read it), `title`
   (short reader-facing label — it renders in the References section), and
   optional `note` (internal: what it was used for, any rejected value). No
   other keys — the schema rejects them. Keep an existing citation that still
   holds; append rather than replace.
3. Never touch `dataVerified` in `site-config.js` — it's a claim about the
   whole dataset, not one batch.
4. A discontinued item gets the same treatment; its maker page may now be
   archived — the maker's PDF or an archived regional page is still tier 1.
5. `npm test` must be green. If any URL in the data changed, also
   `npm run test:links` (it sweeps every citation URL too, and fails on any
   error status that survives a retry, e.g. Leica's 502 for a deleted PDF).
6. **Commit per batch** — data edits + the ledger in one commit:
   `verify-specs: <scope> batch N — X fixes, Y citations`.
7. All batches of one run go in **one** PR targeting `main`. Never merge it —
   the owner merges. No session links in the PR description.

---

## Step 6 — Leave a trail

- Unresolved items (convention questions, unverifiable, "come back after
  release") → add to the `open-data-questions` memory so the next run of this
  or `refresh-camera-data` picks them up.
- A new trap (a templated field, a mount-lumping table, a blocked domain and
  its workaround) → add it to Step 2's trap list in this file, dated.
- Every owner decision on a convention → `docs/data-methodology.md` (table row
  **and** decision log, with date, reason and triggering item), then this
  skill's Step 3 table and the other data-gathering skills
  (`add-thirdparty-lenses`, `add-camera-brand`, `refresh-camera-data`).
  Keep superseded rules in the log; that doc feeds the public methodology page.

---

## Checklist

- [ ] Scope resolved with `scope.js`; collisions/no-matches raised; batch plan stated
- [ ] Ledger written while reading, committed each batch
- [ ] Every field compared after normalisation; conventions checked against siblings
- [ ] Report posted before any data edit; only approved changes applied
- [ ] `specSources` added for every sourced item; `dataVerified` untouched
- [ ] `npm test` green (+ `test:links` if a URL changed); one commit per batch
- [ ] Open items recorded in memory; new traps added to this skill
