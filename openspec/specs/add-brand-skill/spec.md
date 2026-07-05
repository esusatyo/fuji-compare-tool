# Add-Camera-Brand Skill

### Requirement: Reusable add-camera-brand skill

The system SHALL provide a reusable, brand-agnostic skill (e.g.
`.claude/skills/add-camera-brand/SKILL.md`) that documents and drives the
end-to-end procedure for adding any new camera brand to the tool. The skill MUST
be parameterised by brand (not Sony-specific) and MUST cover, in order:
research & source-validation of the brand's cameras and lenses; scaffolding the
`<brand>/data.js` and `<brand>/index.html` from the existing template; wiring
registration (`REGISTERED_BRANDS` in all brands, root `index.html`
`VALID_BRANDS`, `MANUFACTURER_COLORS`); adding an optional brand-specific spec
section and matching schema validation; reusing the price/image helper scripts;
and verifying the test suite is green.

The skill MUST emphasise resumability — instructing that data entry proceed in
small, independently-committable, test-checkpointed batches — so the procedure
survives interruption.

#### Scenario: Skill is discoverable and brand-agnostic

- **WHEN** a user asks to add a new camera brand (e.g. Nikon)
- **THEN** the skill is surfaced and its steps apply to that brand by
  substituting the brand name/slug, with no Sony-specific assumptions

#### Scenario: Skill enumerates the full wiring checklist

- **WHEN** the skill is followed for a new brand
- **THEN** it lists every required edit point (new brand dir, all brands'
  `REGISTERED_BRANDS`, root `VALID_BRANDS`, `MANUFACTURER_COLORS`, optional
  engine spec section + `schema.js` branch) and ends with running `npm test`
