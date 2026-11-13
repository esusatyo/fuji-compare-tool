# catalogue-data-integrity Specification

## Purpose
TBD - created by archiving change fix-catalogue-data-errors. Update Purpose after archive.
## Requirements
### Requirement: Minimum focus distance is plausible for the focal length

A lens's `minFocusDist` (cm) SHALL NOT be 150 cm or more while also exceeding
1.4 times its longest focal length in millimetres; the schema test MUST reject
such a value as a likely unit error (a figure entered 10x too large).

#### Scenario: Zoom entered 10x too large

- **WHEN** a 24-70mm zoom stores `minFocusDist: 240`
- **THEN** the schema test fails, naming the entry and the likely unit error

#### Scenario: Real long minimum focus distances pass

- **WHEN** a 600mm lens stores 420 cm, a 135mm rangefinder lens 150 cm, or a
  21mm rangefinder lens 70 cm
- **THEN** the schema test passes

### Requirement: Every correction is cited

A value corrected by this change SHALL carry a citation on the entry
(`specSources`, `priceSource` or `imageSource`) naming the source it was
re-read from and recording the previous value in the citation note.

#### Scenario: Corrected spec value

- **WHEN** a spec field is changed by this change
- **THEN** the entry's `specSources` includes a citation whose note states the
  old and new value

#### Scenario: Unconfirmable value

- **WHEN** a doubted value cannot be confirmed or refuted from a reputable
  source
- **THEN** it is left unchanged and listed in the change's PROGRESS.md

### Requirement: Open data doubts are resolved or recorded

A value listed as doubtful after a data pass SHALL either be confirmed or
corrected from a cited source, or stay unchanged with the reason recorded in
the change's PROGRESS.md and the project's open-questions list; it MUST NOT be
replaced by an estimate.

#### Scenario: Source found

- **WHEN** a reputable source settles a doubted value
- **THEN** the entry carries that value and a citation noting the old value

#### Scenario: No source found

- **WHEN** no reputable source settles a doubted value
- **THEN** the value is left as is and PROGRESS.md records what was tried

