## ADDED Requirements

### Requirement: Citation objects support an optional title
The shared citation schema (`{url, tier, note, date}`, used by `specSources[]`, `priceSource`, and `imageSource`) SHALL accept an optional `title` field. When present, `title` MUST be a non-empty string. `note` remains an internal research field and SHALL NOT be rendered on any page.

#### Scenario: Citation with a title validates
- **WHEN** a citation object includes `title: 'Fujifilm X-E5 official product page'`
- **THEN** the schema validator accepts it

#### Scenario: Citation without a title still validates
- **WHEN** a citation object omits `title` (as all citations do today)
- **THEN** the schema validator accepts it, since `title` is optional

#### Scenario: Empty-string title is rejected
- **WHEN** a citation object includes `title: ''`
- **THEN** the schema validator rejects it as it does for empty `note`

### Requirement: Reference collection produces four fixed rows per item
For any camera or lens item, a reference collector SHALL produce exactly four rows, in this order: **Spec source**, **Price source**, **Image source**, **Product page**. Each row is a list of zero or more `{text, url}` entries.

- **Spec source** row is built from `item.specSources[]`.
- **Price source** row is built from `item.priceSource` (single entry).
- **Image source** row is built from `item.imageSource`, or `item.imageCredit.source` when the item has no `imageSource` but does have an `imageCredit` (Wikimedia Commons images).
- **Product page** row is built from `item.productUrl`, skipping generic brand-index URLs that end in `/cameras/`.

Each entry's `text` SHALL be its citation's `title` when present, otherwise the entry's URL with the scheme and a leading `www.` stripped (e.g. `https://www.adorama.com/x` → `adorama.com/x`).

#### Scenario: Item with all four source types populated
- **WHEN** an item has `specSources`, `priceSource`, `imageSource`, and `productUrl` all set to distinct URLs
- **THEN** the collector returns four rows, each with exactly one entry, in Spec/Price/Image/Product order

#### Scenario: Item with only a product URL
- **WHEN** an item has `productUrl` set but no `specSources`, `priceSource`, or `imageSource`/`imageCredit`
- **THEN** the collector returns Spec/Price/Image rows empty and a Product page row with one entry

#### Scenario: Item with multiple spec sources
- **WHEN** `item.specSources` has two entries with different URLs
- **THEN** the Spec source row contains two entries, in the array's original order

#### Scenario: Commons-sourced image falls back to imageCredit.source
- **WHEN** an item has `imageCredit.source` set (a Wikimedia Commons image) and no `imageSource`
- **THEN** the Image source row contains one entry using `imageCredit.source` as the URL

### Requirement: Spec-source entries matching the product URL are deduplicated
When a `specSources[]` entry's `url` is identical to `item.productUrl`, that entry SHALL be omitted from the Spec source row (it still appears once, in the Product page row).

#### Scenario: Spec source duplicates the product page
- **WHEN** `item.specSources` contains one entry whose `url` equals `item.productUrl`
- **THEN** the Spec source row is empty and the Product page row contains that URL once

#### Scenario: Spec source differs from the product page
- **WHEN** `item.specSources` contains an entry whose `url` differs from `item.productUrl`
- **THEN** both the Spec source row and the Product page row show their respective entries

### Requirement: Every item shows at least one reference
Because `productUrl` is populated on every camera and lens, the collector SHALL always produce a non-empty Product page row for any item that has a `productUrl`, guaranteeing at least one reference is shown regardless of `specSources`/`priceSource`/`imageSource` coverage.

#### Scenario: Item with zero citation objects
- **WHEN** an item (e.g. a Panasonic or Sigma entry with no `specSources`/`priceSource`/`imageSource`) has only `productUrl` set
- **THEN** the collector still returns a non-empty Product page row

### Requirement: References section renders on interactive comparison pages
The engine SHALL render a "References" section as the last section of the spec table on brand pages and the cross-brand compare page, using the same section/row markup as other spec sections, re-rendered whenever the selected items change. Unlike other sections, it SHALL always be expanded: it SHALL NOT have a collapse toggle and SHALL NOT respond to a header click.

Each of the four rows SHALL render one cell per visible slot (2–4 depending on `numSlots`), showing that slot's item's entries for that row, or "—" when empty. No winner highlighting is applied to reference rows.

#### Scenario: References section appears last
- **WHEN** any brand page or the compare page renders its spec table
- **THEN** a section titled "References" is the final section, after all spec sections

#### Scenario: References section has no collapse toggle
- **WHEN** the References section header is clicked
- **THEN** the section body does not collapse (no `.collapsed` class is toggled), unlike every other section

#### Scenario: Compare page shows brand-appropriate references
- **WHEN** the cross-brand compare page has slots showing cameras from two different brands
- **THEN** each slot's reference cells reflect that camera's own citations, independent of the other slots

#### Scenario: Empty row renders an em dash
- **WHEN** a selected item has no entries for the Image source row
- **THEN** that slot's Image source cell renders "—"

### Requirement: References render on static vs-pages
Same-brand and cross-brand static vs-pages (`scripts/generate-seo.js` output) SHALL render the same four-row reference set inside the existing comparison table (`vs-card`), as an additional `<tbody>` below the spec rows — not as a separate card or section — with one column per camera, matching the page's existing two-column layout.

#### Scenario: Same-brand vs-page includes references
- **WHEN** a same-brand vs-page (e.g. `fujifilm/vs/x-t5-vs-x-t50.html`) is generated
- **THEN** its comparison table includes Spec source/Price source/Image source/Product page rows for both cameras

#### Scenario: Cross-brand vs-page includes references
- **WHEN** a cross-brand vs-page is generated
- **THEN** its comparison table includes reference rows for both cameras, each brand's own citations independent of the other

#### Scenario: Generator and engine agree on output
- **WHEN** the same item's data is passed to both the `engine.js` collector and the `scripts/generate-seo.js` collector
- **THEN** both return identical `{kind, text, url}` sequences

### Requirement: Long reference links truncate visually without breaking the click target
A reference link whose displayed text would overflow its cell SHALL be truncated with CSS ellipsis while remaining a single clickable element pointing at the full URL, and SHALL expose the full URL via a `title` attribute for hover.

#### Scenario: Long URL is visually clipped
- **WHEN** a reference entry's display text is longer than its cell's available width
- **THEN** the rendered text is clipped with an ellipsis, but the anchor's `href` is the full, untruncated URL

#### Scenario: Clipped link is still clickable
- **WHEN** a user clicks anywhere on a truncated reference link
- **THEN** navigation follows the full `href`, not a clipped version

### Requirement: Reference links are tracked and open safely
Every reference link SHALL open in a new tab with `rel="noopener nofollow"`. Interactive pages SHALL report a click via `trackEvent('reference-click:<row-kind>:<hostname>', ...)`; static vs-pages SHALL report the equivalent via a `data-goatcounter-click` attribute. `privacy.html` SHALL document this event alongside the site's other tracked interactions.

#### Scenario: Reference link has safe attributes
- **WHEN** any reference link renders, on either page type
- **THEN** it has `target="_blank"` and `rel="noopener nofollow"`

#### Scenario: Reference click is tracked
- **WHEN** a user clicks a reference link on an interactive page
- **THEN** `trackEvent` is called with a path of the form `reference-click:<row-kind>:<hostname>`
