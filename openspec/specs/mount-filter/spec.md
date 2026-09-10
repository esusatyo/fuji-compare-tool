# mount-filter Specification

## Purpose
Every camera and lens records the mount it belongs to, and brand pages spanning
more than one mount let a reader filter both comparison tabs down to a single
one. The mount previously existed only as prose inside dropdown-group labels,
where neither the UI nor a test could read it.

Not covered here: the full-frame vs APS-C distinction on Canon, Nikon and Sony.
Their APS-C lenses share one mount with the full-frame ones and fit those bodies
(cropping rather than failing), so that is a separate property with its own
field, in a later change.

## Requirements
### Requirement: Every item declares its mount
Every camera and every lens, in every brand, SHALL carry a `mount` field whose value is one of the ids declared in that brand's `BRAND_CONFIG.mounts`. The rule is unconditional: single-mount brands carry the field too, holding their sole mount id.

#### Scenario: Multi-mount brand items carry valid mounts
- **WHEN** Tier 1 loads `panasonic/data.js`
- **THEN** every entry in `CAMERAS` and `LENSES` has a `mount` of `'l'` or `'mft'`, and no other value appears

#### Scenario: Single-mount brand items carry the sole mount
- **WHEN** Tier 1 loads `canon/data.js`
- **THEN** every camera and lens has `mount: 'rf'`, including the RF-S APS-C lenses, which share the RF mount

#### Scenario: Item missing a mount fails the suite
- **WHEN** a lens is added to any brand without a `mount` field
- **THEN** `npm run test:data` fails naming that lens id

#### Scenario: Undeclared mount id fails the suite
- **WHEN** a camera declares a `mount` id absent from its brand's `BRAND_CONFIG.mounts`
- **THEN** `npm run test:data` fails naming the camera and the offending id

### Requirement: Brands declare their mounts
Each brand's `BRAND_CONFIG` SHALL declare a `mounts` array of `{ id, label }` objects, ordered as the chips render. A brand spanning one mount declares a one-entry array. The existing `BRAND_CONFIG.mount` display string SHALL be retained unchanged: it is landing-tile copy naming the brand's headline mount, which is deliberately not the same thing as the full list.

#### Scenario: Panasonic declares two mounts
- **WHEN** `panasonic/data.js` is loaded
- **THEN** `BRAND_CONFIG.mounts` is `[{ id:'l', label:'L-Mount' }, { id:'mft', label:'Micro Four Thirds' }]` and `BRAND_CONFIG.mount` still reads `'L-Mount / MFT'`

#### Scenario: Landing tiles are unchanged
- **WHEN** `node scripts/generate-seo.js` runs after this change
- **THEN** every generated file is byte-identical to before, the Fujifilm tile still reading `X-Mount` and the Sigma tile `L-Mount`

#### Scenario: Declared mount with no items fails the suite
- **WHEN** a brand declares a mount id that no camera and no lens uses
- **THEN** `npm run test:data` fails naming that id

### Requirement: A dropdown group belongs to exactly one mount
Every entry in `DROPDOWN_GROUPS` and `LENS_DROPDOWN_GROUPS` SHALL contain items of exactly one mount, in every brand.

#### Scenario: Mixed group fails the suite
- **WHEN** an MFT lens id is added to an `(L-Mount)` labelled group in `panasonic/data.js`
- **THEN** `npm run test:data` fails naming the group label and the disagreeing ids

#### Scenario: Panasonic box cameras sit in separate groups
- **WHEN** `panasonic/data.js` `DROPDOWN_GROUPS` is inspected
- **THEN** `bs1h` and `bgh1` are in different groups, one L-Mount and one Micro Four Thirds

### Requirement: Camera mounts agree with their sensor
A camera's `mount` SHALL be consistent with its `sensorType`: a Micro Four Thirds sensor implies `mft`, a Foveon APS-C/APS-H sensor implies `sa`, a `43.8×32.9mm GFX` sensor implies `g`, Fujifilm's X-Trans, Bayer and 1" sensors imply `x`, and any sensor in a single-mount brand implies that brand's sole mount.

#### Scenario: Mistyped mount is caught
- **WHEN** a Micro Four Thirds Lumix body is given `mount: 'l'`
- **THEN** `npm run test:data` fails naming the camera and both the declared and derived values

### Requirement: Fixed-lens bodies belong to their lineup's mount
A camera with no interchangeable mount SHALL carry the mount of the lineup it belongs to rather than being omitted, so it remains visible when that mount is filtered.

#### Scenario: X100VI appears under X-Mount
- **WHEN** the Fujifilm cameras tab is filtered to X-Mount
- **THEN** `x100vi`, `x-half` and the other fixed-lens X bodies appear in the slot dropdowns

#### Scenario: GFX100RF appears under G-Mount
- **WHEN** the Fujifilm cameras tab is filtered to G-Mount
- **THEN** `gfx100rf` appears alongside the interchangeable GFX bodies

### Requirement: The chip row filters both tabs
The engine SHALL render a filter chip row above the comparison table containing `All` plus one chip per qualifying mount, on both the Cameras and the Lenses tab. When fewer than two mounts qualify in the active mode, no chip row SHALL be present in the DOM.

#### Scenario: Chip row renders for a multi-mount brand
- **WHEN** the Panasonic page loads
- **THEN** a chip row labelled `Mount` renders with `All`, `L-Mount` and `Micro Four Thirds`, with `All` active

#### Scenario: No chip row for a single-mount brand
- **WHEN** the Canon page loads
- **THEN** no chip row element exists in the DOM and the compare header is laid out as before

#### Scenario: Chips restrict the pickers
- **WHEN** the user activates `Micro Four Thirds` on the Panasonic lenses tab
- **THEN** every `<option>` offered in every slot dropdown is an MFT lens, and no L-Mount optgroup is rendered

### Requirement: One item is enough to earn a chip
A mount SHALL earn a chip in a mode when it has one or more items in that mode. A mount with no items in a mode SHALL NOT be offered in that mode.

#### Scenario: Sigma lens tab hides the SA chip
- **WHEN** the Sigma page is switched to the Lenses tab
- **THEN** no chip row renders, because SA-Mount has no lenses and L-Mount alone is not a choice

#### Scenario: Sigma camera tab shows both chips
- **WHEN** the Sigma page is on the Cameras tab
- **THEN** chips for `L-Mount` (3 cameras) and `SA-Mount` (2 cameras) both render

#### Scenario: A single-item mount is still offered
- **WHEN** a brand has a mount with exactly one camera and a second mount with more
- **THEN** both chips render, and activating the single-item chip is permitted

### Requirement: The table renders as few as one slot
The number of rendered slots SHALL clamp to the number of items the active mount offers in the active mode, down to a floor of one, and SHALL restore the user's chosen slot count when the filter returns to `All`. At one slot no winner highlighting SHALL be applied, since a single value wins every row trivially.

#### Scenario: Filtering to a single-item mount renders one slot
- **WHEN** the active mount offers exactly one item in the active mode
- **THEN** one slot renders, `--num-slots` is `1`, and the remaining slot elements are hidden

#### Scenario: No winners at one slot
- **WHEN** the table is rendered with one slot
- **THEN** no cell carries the `winner` class

#### Scenario: Returning to All restores the slot count
- **WHEN** the user activates `All` after a single-slot filter
- **THEN** the slot count returns to the user's chosen value, clamped by the viewport as before

#### Scenario: Mobile clamp still applies
- **WHEN** the viewport is below the 600px breakpoint and the active mount offers three or more items
- **THEN** two slots render, exactly as today

### Requirement: Activating a chip swaps out-of-mount slots
Activating a mount chip SHALL replace each slot holding an item outside that mount with the first item of that mount in dropdown order that is not already selected in another slot, and leave in-mount slots untouched. Activating `All` SHALL change no selection.

#### Scenario: Out-of-mount slots are replaced
- **WHEN** the Panasonic cameras tab shows S5 II, S1R II and GH7, and the user activates `Micro Four Thirds`
- **THEN** the two L-Mount slots are replaced by MFT bodies, the GH7 slot is untouched, and no body appears twice

#### Scenario: All preserves a cross-mount comparison
- **WHEN** the user has S5 II and GH7 selected and activates `All`
- **THEN** both selections remain

#### Scenario: The swapped selection is shareable
- **WHEN** a chip activation changes the selection
- **THEN** the URL hash is rewritten to the new slugs, and reloading that URL reproduces the same table

### Requirement: The active mount survives the mode toggle when it can
Switching between the Cameras and Lenses tabs SHALL keep the active mount when that mount qualifies in the destination mode, and SHALL fall back to `All` when it does not.

#### Scenario: Filter carries across tabs
- **WHEN** a Panasonic user filtered to `Micro Four Thirds` switches to the Lenses tab
- **THEN** the Lenses tab opens filtered to `Micro Four Thirds`

#### Scenario: Filter falls back when the mount has no chip
- **WHEN** a Sigma user filtered to `SA-Mount` on the Cameras tab switches to the Lenses tab
- **THEN** the Lenses tab opens unfiltered, with no chip row

### Requirement: The filter is not persisted
The active mount SHALL NOT be written to the URL hash or to `localStorage`. A page load SHALL always start on `All`.

#### Scenario: Reload resets the chip
- **WHEN** a user filters to `L-Mount` and reloads the page
- **THEN** the chip row shows `All` active, while the selected slugs from the hash are restored as usual

### Requirement: New data records its mount
The research skills that add or refresh camera and lens data SHALL instruct that every new entry records its `mount` at entry time, alongside the existing sourcing rules.

#### Scenario: Skill guidance names the field
- **WHEN** `add-camera-brand`, `add-thirdparty-lenses` or `refresh-camera-data` is read
- **THEN** each states that a new camera or lens entry must carry a `mount` id declared by its brand
