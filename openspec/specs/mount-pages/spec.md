# mount-pages Specification

## Purpose
TBD - created by archiving change add-mount-pages. Update Purpose after archive.
## Requirements
### Requirement: Each lens mount with lenses has a static page
The generator SHALL write one page per mount that has at least one lens, at `/mount/<slug>`, where the slug is the mount's label lower-cased with spaces as hyphens and `-mount` appended when the label does not already end in it. The page SHALL list every interchangeable-lens camera of that mount from every brand, and every lens of that mount from every brand with each lens appearing once, grouped by maker with links to each maker's group. Discontinued items SHALL be included and marked; fixed-lens cameras SHALL NOT be listed. The page SHALL be complete without JavaScript, SHALL be in the sitemap and SHALL be linked extensionless.

#### Scenario: Shared mount
- **WHEN** the generator runs
- **THEN** `/mount/l-mount` lists L-Mount cameras from Leica, Panasonic and Sigma, and every L-Mount lens once

#### Scenario: Address names the mount
- **WHEN** the Micro Four Thirds page is generated
- **THEN** its address is `/mount/micro-four-thirds-mount`

#### Scenario: Fixed-lens camera
- **WHEN** a Leica Q3 (fixed lens, L system) exists in the data
- **THEN** it does not appear on `/mount/l-mount`

#### Scenario: Mount without lenses
- **WHEN** a mount has bodies but no lenses (Sigma SA)
- **THEN** no page is generated for it

### Requirement: An index lists every mount page
The generator SHALL write `/mount/` linking every mount page with its camera and lens counts and the brands that make bodies for it.

#### Scenario: Index links
- **WHEN** the generator runs
- **THEN** `/mount/` links every mount page and no other mount address

### Requirement: Brand pages link their mount pages
Each brand page's crawlable at-a-glance section SHALL link the mount page of every mount the brand declares that has a page.

#### Scenario: Panasonic
- **WHEN** the Panasonic brand page is generated
- **THEN** it links `/mount/l-mount` and `/mount/micro-four-thirds-mount`

