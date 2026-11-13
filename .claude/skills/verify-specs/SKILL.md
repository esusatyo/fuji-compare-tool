---
name: verify-specs
description: Audit existing camera and lens specs for factual correctness against the maker's own published figures — weight, dimensions, sensor, EVF/LCD, IBIS, burst, video, weather sealing, optical formula, focus distance and the rest — and record a durable specSources citation for every item checked. Scope can be a camera brand, a lens maker across all brands (e.g. all Sigma lenses), a mount (e.g. L-mount), or just one or a few named items. Research first, report mismatches, apply only what the owner approves. Use when the user wants to check, verify, audit or fact-check specs, find wrong data, or add spec citations to uncited items.
metadata:
  author: fuji-compare-tool
  version: "1.0"
---

Check that the specs already in the dataset are **true**, not just well-formed.

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
| `minFocusDist` | **cm**, from the focal plane; zooms = shortest across the range (`0.121 m` → `12.1`) |
| `maxMagnification` | decimal (`1:2` → `0.5`); zooms = max across range |
| `maxAperture` | f-number at the wide end; never a T-stop |
| `lcdDots` | thousands of dots (`1840`) |
| `evfDots` | millions of dots (`3.69`) |
| `evfMag` | 35mm-equivalent magnification (`0.8`) |
| `batteryLife` | CIPA shots |
| `focalLengthEquiv` | native × crop (X/E APS-C/DX/TL 1.5, RF-S 1.6, MFT 2.0, FF 1.0); dual-fisheye lenses take no crop |
| `year` | first shipping year **in this mount**, not the design's original launch |
| `weatherSealed` | `true` **only** if the maker claims sealing/dust- and splash-resistance. A review calling it "robust", or a rear mount gasket alone, is `false`. Silence from the maker = `false` |
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
values in the ledger with a one-line reason. Never average. Also record values
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
   `npm run test:links`.
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

---

## Checklist

- [ ] Scope resolved with `scope.js`; collisions/no-matches raised; batch plan stated
- [ ] Ledger written while reading, committed each batch
- [ ] Every field compared after normalisation; conventions checked against siblings
- [ ] Report posted before any data edit; only approved changes applied
- [ ] `specSources` added for every sourced item; `dataVerified` untouched
- [ ] `npm test` green (+ `test:links` if a URL changed); one commit per batch
- [ ] Open items recorded in memory; new traps added to this skill
