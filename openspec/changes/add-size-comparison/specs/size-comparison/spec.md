## ADDED Requirements

### Requirement: Items are drawn to one scale from their stated dimensions
The size drawing SHALL represent each item by an outline whose drawn dimensions are its stored dimensions multiplied by a single scale shared by every item and every view in that drawing. Cameras SHALL be drawn in front (width × height), top (width × depth) and side (depth × height) views; lenses in front (diameter) and side (length × diameter) views. The drawing SHALL include a credit-card outline (85.6 × 53.98 mm) at the same scale. It SHALL offer an overlay layout and a side-by-side layout, defaulting to overlay at viewports 600px and wider and to side by side below. An item missing any dimension SHALL NOT be drawn. The drawing SHALL be produced by one module used both in the browser and by the generator.

#### Scenario: Shared scale
- **WHEN** a 129.5 mm-wide and a 131.3 mm-wide camera are drawn together
- **THEN** the ratio of their drawn widths is 129.5 : 131.3 in every view, and the credit card's drawn width stands in the ratio 85.6 to them

#### Scenario: Lens
- **WHEN** two lenses are compared on a brand page
- **THEN** each is drawn as a circle of its diameter and a side outline of its length × diameter

#### Scenario: Missing dimension
- **WHEN** an item has no stored depth
- **THEN** it is not drawn and its table cells show "—"

### Requirement: The tool shows a live size section near the bottom of the table
On brand pages (cameras and lenses), the compare page and the homepage, the comparison table SHALL include a "Size" section after the last spec section and before References whenever at least one shown item has full dimensions. It SHALL redraw when an item, the slot count or the mode changes, SHALL skip empty slots, and SHALL NOT be hidden by "Show differences only". With two or more items it SHALL state the differences in a sentence and a table with a difference column. It SHALL carry a note that the outlines are makers' stated outer dimensions and that sources are listed under References.

#### Scenario: Changing a camera
- **WHEN** a visitor replaces one of two compared cameras
- **THEN** the Size section redraws with the new camera's outline and the sentence and table update

#### Scenario: Position
- **WHEN** a comparison renders
- **THEN** the Size section is immediately before the References section

#### Scenario: One item
- **WHEN** only one camera is shown
- **THEN** it is drawn beside the credit-card outline, with no difference sentence

### Requirement: Indexable pairs get a dedicated static size page
For every pair whose vs-page is indexable, the generator SHALL write a static size page at the vs-page's path with `size/` in place of `vs/`, containing the pair's size drawing in both layouts, the difference sentence, a dimensions-and-weight table, the accuracy note, the pair's reference links, and links to the pair's vs-page and to the interactive tool. The page SHALL be complete without JavaScript, SHALL be linked extensionless, SHALL appear in the sitemap, and SHALL be linked from at least one other page. No size page SHALL exist for a pair whose vs-page is not indexable.

#### Scenario: Same-brand pair
- **WHEN** `fujifilm/vs/x100vi-vs-x100v` is indexable and the generator runs
- **THEN** `fujifilm/size/x100vi-vs-x100v.html` exists, is in the sitemap, and its table matches both cameras' data

#### Scenario: Noindexed pair
- **WHEN** a pair's vs-page carries `noindex`
- **THEN** no size page is generated for it

#### Scenario: Stale page
- **WHEN** a pair stops being indexable and the generator is rerun
- **THEN** its size page is removed

### Requirement: vs-pages carry a compact size section
Every vs-page SHALL contain a pre-rendered size drawing and difference sentence after its spec table and before its references, and SHALL link to the pair's dedicated size page when one exists.

#### Scenario: Link to the full page
- **WHEN** a vs-page's pair has a size page
- **THEN** its size section links to it with a clean URL

### Requirement: An interactive size page exists at /size/
The site SHALL provide `/size/`, the cross-brand comparison tool with the Size section first, with its own title, description and crawlable introduction, linking every dedicated size page. It SHALL be in the sitemap.

#### Scenario: Size first
- **WHEN** a visitor opens `/size/`
- **THEN** the Size section is the first section of the table and is expanded

### Requirement: Size interactions are counted anonymously
Switching the layout SHALL report `size-view:<page>:<overlay|side>`, and a size drawing entering the viewport SHALL report `size-seen:<pathname>` once per page load. `privacy.html` SHALL list both.

#### Scenario: Layout switch
- **WHEN** a visitor on the compare page switches to side by side
- **THEN** `size-view:compare:side` is reported
