## ADDED Requirements

### Requirement: Each slot has a searchable picker
Every comparison slot, on brand pages (cameras and lenses), the compare page and the homepage, SHALL show its item on a button that opens a picker containing a search field and a list of items. The page SHALL have at most one picker open at a time. With nothing typed the list SHALL contain every item the slot may hold, in dropdown-group order under its group headings, restricted to the active mount filter when one is set. An item held by another visible slot SHALL be listed as unavailable and SHALL NOT be selectable. Selecting an item SHALL put it in the slot, close the picker and return focus to the slot's button.

#### Scenario: Browsing with nothing typed
- **WHEN** a user opens a slot's picker on the Fujifilm page and types nothing
- **THEN** the list shows every Fujifilm camera under the same group headings, in the same order, as `DROPDOWN_GROUPS`

#### Scenario: Duplicate prevention
- **WHEN** slot 2 holds the X-T5 and the user opens slot 1's picker
- **THEN** the X-T5 is listed as added and clicking it changes nothing

#### Scenario: Mount filter applies to search
- **WHEN** the Micro Four Thirds filter is active on the Panasonic lens page and the user types "sigma"
- **THEN** only Micro Four Thirds lenses are listed

### Requirement: Search matches the way people type model names
Typed text SHALL be matched against item names ignoring case, accents and punctuation. Roman and arabic generation numbers SHALL be equivalent, the words "Mark"/"Mk" and a focal length's "mm" SHALL be optional, and a word that prefixes the item's brand (or a lens's maker) SHALL narrow the results to that brand without needing to appear in the item's name. Results SHALL be ranked so that an exact name precedes names that merely begin with or contain the query, with ties going to current items before discontinued ones and newer before older. Every item SHALL be the first result for its own full name.

#### Scenario: Punctuation-blind
- **WHEN** a user types "xt5"
- **THEN** the Fujifilm X-T5 is the first result and the X-T50 follows

#### Scenario: Generation numbers
- **WHEN** a user types "a7 4", "a7iv" or "A7 IV"
- **THEN** the Sony A7 IV is the first result

#### Scenario: Brand word
- **WHEN** a user on the compare page types "fuji xt5"
- **THEN** the results are the Fujifilm X-T5 and X-T50

#### Scenario: Lens shorthand
- **WHEN** a user on the Fujifilm lens page types "56 1.2"
- **THEN** every result is a 56mm f/1.2 lens

#### Scenario: No match
- **WHEN** a user types text that matches nothing
- **THEN** the list says no items match, showing the typed text as text, and Enter does nothing

### Requirement: The picker is operable by keyboard and dismissible
While the picker is open, the Down and Up arrow keys SHALL move a highlight through the selectable items, wrapping at either end and skipping unavailable ones; Enter SHALL select the highlighted item; Escape SHALL close the picker and return focus to the slot's button. When text is typed, the best selectable match SHALL be highlighted so that Enter takes it. A press outside the picker SHALL close it. Below the 600px breakpoint the picker SHALL be presented full-screen with a visible way to cancel.

#### Scenario: Type and Enter
- **WHEN** a user opens a picker, types "gfx100 ii" and presses Enter
- **THEN** the GFX100 II is in that slot, the picker is closed, and the URL hash names it

#### Scenario: Escape
- **WHEN** a user presses Escape in an open picker
- **THEN** the picker closes, the slot is unchanged and its button has focus

### Requirement: Picks report how the item was found, never the text
Each pick SHALL report an anonymous `picker-pick:<page>:<search|browse>` event alongside the existing swap event. The typed text SHALL NOT be sent anywhere.

#### Scenario: Typed pick
- **WHEN** a user types a query on the compare page and selects a result
- **THEN** `picker-pick:compare:search` is reported and no reported event contains the query
