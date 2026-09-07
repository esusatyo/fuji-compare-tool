## REMOVED Requirements

### Requirement: Buy button handling for Canon items

**Reason**: Obsolete on two counts. Canon items no longer carry a `buyUrl`
(no item in any brand does, measured 2026-09-07), and buy links are no longer
sourced from "Amazon AU, B&H, or KEH" — they are generated per-currency from
`asin` against the regional Amazon marketplace. Canon is not special here, so
the behaviour is covered by the brand-engine requirement rather than a
Canon-specific one.
