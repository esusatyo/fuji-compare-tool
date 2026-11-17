## ADDED Requirements

### Requirement: Homepage hash names the picked cameras
On the root page the hash SHALL use the compare-page grammar `#cameras=<brand>:<slug>[,…]` and SHALL list exactly the cameras in the visible slots, omitting empty slots. With no camera picked the URL SHALL carry no hash. Loading the root page with such a hash SHALL restore those cameras in order, show as many slots as there are valid entries (at least 2, at most 4, subject to the mobile clamp) and fetch the brand data without further interaction. Entries that are not known cameras, and repeated entries, SHALL be dropped; a hash with no valid entry SHALL leave the page in its empty state.

#### Scenario: Link from a comparison
- **WHEN** a visitor picks the X-T5 and the A7 IV on the root page
- **THEN** the URL is `/#cameras=fujifilm:x-t5,sony:a7-iv`

#### Scenario: Opening a shared link
- **WHEN** a visitor opens `/#cameras=fujifilm:x-t5,sony:a7-iv,canon:eos-r6-iii`
- **THEN** three slots name those cameras at once and the three-column table renders when the data has loaded

#### Scenario: Unknown entries
- **WHEN** a visitor opens `/#cameras=nope:x,nikon:zf`
- **THEN** the Nikon Zf is in the first slot, the second is empty, and the URL is rewritten to `#cameras=nikon:zf`

#### Scenario: Emptying has no hash
- **WHEN** no slot on the root page holds a camera
- **THEN** the URL has no hash
