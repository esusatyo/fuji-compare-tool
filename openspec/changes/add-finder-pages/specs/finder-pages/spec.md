## ADDED Requirements

### Requirement: Camera finder lists every camera in served HTML
The generator SHALL write `/cameras/` containing every camera from every brand file exactly once as a table row, readable without JavaScript, each name linking to its brand page on that camera. The page SHALL be in the sitemap and linked extensionless.

#### Scenario: Complete without scripts
- **WHEN** `/cameras/` is fetched without running JavaScript
- **THEN** every camera in the data appears once with its sensor, megapixels, weight and price

### Requirement: Lens finder lists every lens once in served HTML
The generator SHALL write `/lenses/` containing every lens once, with a lens stored in several brand files for the same mount folded to one row, each name linking to a brand page's lens tool on that lens.

#### Scenario: Shared-mount lens
- **WHEN** an L-Mount lens is stored in the Panasonic, Sigma and Leica files
- **THEN** `/lenses/` lists it once

### Requirement: Filters and sorting narrow the list
The finders SHALL let a visitor filter and sort the rows in the browser. Cameras: brand, sensor format, mount or fixed lens, maximum price, maximum weight, minimum megapixels, stabilisation, weather sealing, viewfinder, earliest year. Lenses: mount, maker, prime or zoom, focal length range, maximum f-number, maximum weight, maximum price, autofocus, stabilisation, weather sealing, filter thread. The page SHALL show how many items match.

#### Scenario: Combined camera filters
- **WHEN** a visitor chooses full-frame and a maximum weight of 500 g
- **THEN** only full-frame cameras weighing 500 g or less remain, and the count matches

#### Scenario: Zoom overlap
- **WHEN** a visitor sets a focal length range of 30–40mm
- **THEN** a 24–70mm zoom and a 35mm prime both match, and an 85mm prime does not

#### Scenario: Nothing matches
- **WHEN** no item matches
- **THEN** the page says so and offers to clear the filters

### Requirement: Discontinued items are hidden until asked for
Discontinued items SHALL be hidden by default and shown, marked, when the visitor turns on the discontinued switch.

#### Scenario: Default
- **WHEN** a finder opens with no state
- **THEN** no discontinued item is visible

### Requirement: Prices follow the selected currency without conversion
The price column, price filter and price sort SHALL use the selected one of the seven currencies. Prices SHALL never be converted. While a maximum price is set or the list is sorted by price, an item with no price in that currency SHALL be hidden and the page SHALL state how many were hidden and why; otherwise such an item SHALL stay listed with an empty price.

#### Scenario: Regional price missing
- **WHEN** the currency is AUD, a maximum price is set, and a matching camera has no AUD price
- **THEN** that camera is hidden and the page reports one item hidden for lacking an AUD price

### Requirement: Finder state is addressable
The filter, sort, currency and discontinued state SHALL be written to the URL hash and restored from it. Unknown keys and invalid values SHALL be ignored.

#### Scenario: Shared link
- **WHEN** `/cameras/#sensor=full-frame&maxweight=500&sort=weight` is opened
- **THEN** the page shows that filter and order

### Requirement: Compare from the camera finder
The camera finder SHALL let a visitor tick two to four cameras and open the cross-brand comparison on them.

#### Scenario: Three cameras
- **WHEN** three rows are ticked and "Compare these" is used
- **THEN** `/compare/` opens with those three cameras selected

### Requirement: Preset list pages come from configuration
The generator SHALL write one static page per entry in `SITE_CONFIG.finderPresets`, at `/<kind>/<slug>`, containing exactly the items that match the preset's filters in the preset's sort order, limited to its `limit` when set. A preset's filters SHALL use the finder's own state keys. The generator SHALL fail on an unknown key or sort, a duplicate or reserved slug, or a preset matching nothing. Preset pages SHALL be indexable, in the sitemap, and linked from their finder.

#### Scenario: Add a preset
- **WHEN** an entry is added to `finderPresets.cameras` and the generator runs
- **THEN** its page exists, is linked from `/cameras/` and is in the sitemap

#### Scenario: Remove a preset
- **WHEN** an entry is removed and the generator runs
- **THEN** its page and sitemap entry are removed

#### Scenario: Misconfigured preset
- **WHEN** a preset names a filter key the finder does not define
- **THEN** the generator stops with an error naming the preset and the key
