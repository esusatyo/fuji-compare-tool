# Design — Add Leica Brand

Owner decisions from the 2026-09-14 kickoff are logged in
`research/decisions.md` §1. Anything marked **(task N)** is decided during that
task and written back here.

---

## 1. Scope: five lines, one brand

**Decision.** One `leica` brand covering SL, TL/CL, M digital, Q and the
fixed-lens compacts. The owner explicitly included all five.

- **S system excluded** — the S (Typ 006/007) and S3 are medium-format DSLRs;
  every brand here is mirrorless-only.
- **Film M bodies excluded** (M6, M-A, MP) — the dataset is digital cameras.
- **Digital M rangefinders are in**, although "mirrorless" is usually said of
  EVF bodies: they have no reflex mirror, and the owner included them.
- **Task 1.4 verdicts (owner, 2026-09-14):**
  - Compacts: **large-sensor only** — D-Lux (Typ 109), D-Lux 7, D-Lux 8,
    V-Lux (Typ 114), V-Lux 5, C-Lux. The small-sensor 2008–2012 generations
    are out.
  - **Leica X included** — X1, X2, X Vario, X-E (Typ 102), X (Typ 113),
    X-U (Typ 113). Same class as Fujifilm X100 / Sigma DP.
  - **SOFORT 2 excluded** — an instant-print camera; most spec rows would be
    empty.
  - **TL lenses included**, discontinued SL lenses not — without TL lenses the
    all-discontinued TL/CL bodies would have no native glass on the page.

## 2. Mounts: `l` reused exactly, new `m`, fixed lenses by precedent

`mounts: [{ id:'l', label:'L-Mount' }, { id:'m', label:'M-Mount' }]`.

- `l` must be byte-identical to Panasonic/Sigma's entry —
  `mounts.test.js` "a mount id means the same thing in every brand".
- `m` is new site-wide; no collision.
- **Fixed-lens bodies (Q, compacts)**: `mount: 'l'` + `lensType: 'Fixed'`,
  rendered by `cameraMountLabel()` as "Fixed lens (L-Mount system)". This is the
  X100 / Sigma DP / Olympus TG precedent — the field is a system tag, not a
  compatibility claim. The owner considered a new `fixed` id and chose
  precedent (2026-09-14). Consequence, accepted: Q3 appears under the L-Mount
  filter chip, as X100VI does under X-Mount.
- `BRAND_CONFIG.mount` (landing-tile headline) = **`'L-Mount'`** — task 1.3
  confirmed this matches the established single-headline-mount convention
  (Sigma's tile also says `'L-Mount'` alone despite spanning SA-Mount too).
- Fixed-lens bodies get their **own dropdown groups** so no group spans two
  mounts; they'd only share `l` groups with SL anyway, but grouping by line
  keeps labels truthful.

## 3. `SENSOR_RULES`: discriminate by `series`, not `sensorType`

The rule table maps `sensorType` regex → mount. SL3, M11 and Q3 all carry a
60 MP full-frame BSI sensor, so no `sensorType` regex can tell `l` from `m`.

**Decision.** Allow a rule to test a different camera field, and give Leica
rules on `series`:

```js
leica: [[/^M/, 'm', 'series'], [/^(SL|TL|CL|Q|X|D-Lux|V-Lux|C-Lux)/, 'l', 'series']],
```

A third tuple element names the field (default `sensorType`, so existing rows
don't change). `series` is set independently of `mount` at entry time and also
drives `SERIES_COLORS`, so it's a genuine second witness. Series strings are
fixed in task 1.3 and must satisfy these regexes.

## 4. `LENS_CROP`: per-line override for TL

`LENS_CROP` is per mount. TL lenses are APS-C (1.5×) on the same `l` mount as
full-frame SL lenses (1.0×), so a flat `{ l: 1.0 }` fails every TL lens, and
`{ l: [1.0, 1.5] }` would wave through a mistyped equivalent on either.

**Decision.** Add an optional `LENS_CROP_BY_LINE` table consulted first:

```js
const LENS_CROP = { …, leica: { l: 1.0, m: 1.0 } };
const LENS_CROP_BY_LINE = { leica: { TL: 1.5 } };
```

This matches CLAUDE.md's rule that APS-C and full-frame share one mount and
that format is a separate property.

## 5. Year floors

`schema.js` bounds `year` to 2008–2027 for cameras and lenses; the comment says
it's a typo guard, not a scoping rule.

- **Cameras**: M8 (2006) is in scope → camera floor becomes **2006**.
- **Lenses**: `year` = release year of the **version currently sold**, not the
  year its optical formula first appeared. (Revised in task 1.2: the design-year
  reading would put the current Summicron-M 50 at 1979, gutting the floor's
  value as a typo guard, and it isn't what the Year row means for any other
  brand.) The lens floor is lowered to the oldest `year` actually entered, with
  a comment naming that lens; the estimate from task 1.2 is the late 1990s.

Both are one-line `min` changes with comments, landed in group 4 before any
item that needs them.

## 6. Leica-specific spec section

**Confirmed in task 1.3** — all four candidates are sourceable:

- `monochrom` — monochrome-only sensor (M Monochrom, Q2/Q3 Monochrom).
- `focusingSystem` — `'Rangefinder'` / `'EVF'` / `'Rangefinder + EVF'` / `null`.
  M bodies are `Rangefinder` except the EVF-only M EV1; SL/Q/CL are `EVF`
  (built-in); **T/TL/TL2 are `null`** (task 5.2 correction — they have
  neither a rangefinder nor a built-in EVF, only an optional clip-on
  Visoflex accessory, so `null` is the honest value and the field is
  nullable in schema.js, not the three-enum-only field this originally said).
- `contentCredentials` — CAI content credentials (M11-P, SL3-S, Q3-era on).
- `internalStorageGB` — nullable. **Corrected in task 5.6**: the Q3 family
  has no built-in storage — Leica's own spec sheets list only an 8GB
  *buffer* (temporary burst memory, not storage), confirmed for Q3, Q3 43
  and Q3 Monochrom, so all three are `null`. Whether the M11 family has any
  is unverified until task 5.5 researches it; don't assume it does.

Each gets a `brandSections.includes('leica')` schema branch.

## 7. Pricing, ASINs, images

- **Prices**: Leica's own regional online stores are the authoritative list
  price. Record list price, never sale price (Olympus lesson: product pages
  can show a sale price as if it were list). Discontinued items may be USD-only.
- **ASINs**: Leica sells mostly through its own stores and authorised dealers.
  Items with no plain first-party Amazon listing stay `asin: null`. The baseline
  is rebased in a dedicated commit listing each item (owner approved).
- **Images**: Wikimedia Commons via `fetch-images-commons.js`; gaps go to
  `KNOWN_IMAGE_GAPS.leica`.

## 8. Series, grouping and landing-tile accent

- Series (fixed in task 1.3): expected `SL`, `TL`, `CL`, `M`, `M Monochrom`,
  `Q`, compacts per line. Each gets a `SERIES_COLORS` pair.
- `BRAND_CARD_ACCENTS.leica`: **not** a red. Canon and Fujifilm already share
  `#cc0000`, and a third red stripe would read as one brand. A chrome/silver
  neutral (proposed `#b8b2a7`) — **(task 3.5)**.
- `MANUFACTURER_COLORS['Leica']` already exists (lens cards) and is reused.

## 9. What this change does not do

- No third-party L-Mount or M-Mount lenses (Voigtländer, Zeiss, Sigma, …) —
  follow-up change, which also adds the `SAME_MOUNT_BRANDS` row.
- No discontinued M lenses (owner call).
- No retagging of other brands' fixed-lens cameras.
