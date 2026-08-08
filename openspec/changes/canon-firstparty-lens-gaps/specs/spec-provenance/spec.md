# spec-provenance

## ADDED Requirements

### Requirement: Entries MUST support per-field source attribution

The schema MUST accept an optional `specSources` object on camera and lens
entries, mapping a field or field-group name to the `https` URL the value was
taken from. It MUST remain optional so existing entries stay valid, and MUST be
validated whenever it is present.

#### Scenario: An entry records provenance for a composite of sources

- **GIVEN** a lens whose dimensions came from one source and whose aperture
  blade count came from the manufacturer
- **WHEN** the entry is written with `specSources: { dimensions: '<url-a>', blades: '<url-b>' }`
- **THEN** schema validation passes
- **AND** each recorded value is retained verbatim for later display

#### Scenario: An entry omits provenance entirely

- **GIVEN** any of the camera or lens entries that predate this capability
- **WHEN** the schema validates the entry with no `specSources` key
- **THEN** validation passes with no error

#### Scenario: A non-https source is rejected

- **GIVEN** an entry with `specSources: { weight: 'http://example.com/lens' }`
- **WHEN** the schema validates the entry
- **THEN** validation fails naming the offending key
- **AND** the same occurs for a value that does not parse as a URL

#### Scenario: A key naming an absent field is rejected

- **GIVEN** an entry with `specSources: { oisStops: '<url>' }` where the entry
  has no `oisStops` value
- **WHEN** the schema validates the entry
- **THEN** validation fails, so provenance cannot drift from the data it describes

### Requirement: Source reliability MUST be recorded alongside the URL

Research ledgers MUST record, for every source URL, what it was used for and its
reliability class, because a source's trustworthiness varies by field. A source
whose spec tables are accurate may be unreliable for mount availability.

#### Scenario: An aggregator source is recorded with its limits

- **GIVEN** a spec taken from an aggregator whose tables have been validated but
  whose mount attribution has been shown to be unreliable
- **WHEN** the source is recorded in `research/sources.md`
- **THEN** it is marked with its class
- **AND** the recorded note states which fields it may and may not be trusted for

#### Scenario: A rejected source is retained

- **GIVEN** a published figure that was deliberately not used, because it
  described a different mount variant
- **WHEN** the research is recorded
- **THEN** the rejected source and the reason for rejecting it are retained
- **AND** a later pass can see why the entered value differs from that page
