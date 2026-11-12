## ADDED Requirements

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
