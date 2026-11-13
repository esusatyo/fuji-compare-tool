## ADDED Requirements

### Requirement: Landing page embeds the cross-brand comparison tool
The root page SHALL render the cross-brand camera comparison inside its own layout — one site header, one `<h1>`, one footer — directly under the hero. The tool SHALL open with empty slots, each presenting a camera search, and SHALL show no spec table until a camera is picked. Picking a camera SHALL render the table in place without navigating; with one camera it SHALL show that camera's specs and no winner highlighting, and with two or more it SHALL behave as the compare page does. The page SHALL offer a visible control to choose 2, 3 or 4 slots (default 2), subject to the two-slot clamp below the mobile breakpoint. The landing page's static, crawlable content SHALL remain in the served HTML.

#### Scenario: First visit
- **WHEN** a visitor opens the root URL
- **THEN** two empty camera-search slots show, no spec table is present, and the URL has no hash

#### Scenario: First pick shows the table
- **WHEN** the visitor searches "xt5" in the first slot and selects the X-T5
- **THEN** the X-T5's specs render below the slots on the same page, with the second column blank and no winners

#### Scenario: Second pick compares
- **WHEN** the visitor then picks a Canon EOS R6 Mark III in the second slot
- **THEN** both columns are filled, winners are highlighted, and both brands' spec sections show

#### Scenario: Choosing four
- **WHEN** a visitor at a desktop viewport chooses 4
- **THEN** four slots show, and any not yet picked stay empty

### Requirement: Landing page searches a generated index and loads brand data on demand
The root page SHALL NOT load any brand `data.js` in its HTML. `scripts/generate-seo.js` SHALL emit, in the page's generated block, an index of every brand's cameras (slug, name, year, discontinued) and the list of brand data files, both derived from the brand directories. The picker SHALL search this index before brand data is present. Brand data SHALL be fetched when a picker is first opened, when a camera is picked, or at load when the URL names cameras. While a picked camera's data is in flight its slot SHALL show the camera's name and a loading state; if the fetch fails the slot SHALL say so and offer a retry.

#### Scenario: Index matches the data
- **WHEN** a camera is added to a brand's `data.js` and the generator is rerun
- **THEN** the root page's index contains it, and a test fails if the index and the data disagree

#### Scenario: Pick before data arrives
- **WHEN** a visitor picks a camera before the brand files have loaded
- **THEN** the slot names the camera and says its specs are loading, and the table appears when they arrive

#### Scenario: Fetch failure
- **WHEN** the brand files fail to load
- **THEN** the slot keeps the pick, reports the failure and offers a retry that fetches again

### Requirement: Homepage comparison starts are counted once
The root page SHALL report `quick-compare:first` when a visitor first picks a camera and `quick-compare:pair` when two slots are first filled, each at most once per page load.

#### Scenario: Two picks
- **WHEN** a visitor picks a first and then a second camera
- **THEN** `quick-compare:first` and `quick-compare:pair` are each reported once
