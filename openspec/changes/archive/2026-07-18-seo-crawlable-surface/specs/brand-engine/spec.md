## ADDED Requirements

### Requirement: Engine renders into a container and preserves static content
The engine SHALL render the comparison UI into the element with id `app`, falling back to `document.body` when no such element exists. It SHALL NOT destroy or overwrite static content that lives outside its render container, so generator-owned crawlable blocks in a brand page survive rendering.

#### Scenario: Static block survives rendering
- **WHEN** a brand page containing `<div id="app"></div>` followed by a static `seo:body` block is rendered by the engine
- **THEN** the comparison UI appears inside `#app` and the static block remains present in the DOM

#### Scenario: Fallback when no container is present
- **WHEN** the engine runs on a page with no `#app` element
- **THEN** it renders into `document.body` as before

#### Scenario: Delegated behaviour still works
- **WHEN** the engine has rendered into `#app` and a user clicks a section header or changes a slot select
- **THEN** section collapsing and slot re-rendering behave exactly as when rendering into the body
