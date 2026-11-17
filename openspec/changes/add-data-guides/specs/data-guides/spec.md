## ADDED Requirements

### Requirement: Data-led guides answer one search question
The site SHALL publish guides at `/articles/<slug>`, each answering one search question, with every number in the page generated from the brand data files. Each guide SHALL have a static H1, a first paragraph that answers the question, internal links only to indexable pages, a method note and a visible updated date.

#### Scenario: Numbers follow the data
- **WHEN** a camera's weight changes in its `data.js` and the generator is rerun
- **THEN** every guide that uses that camera shows the new weight in its table, chart and prose

#### Scenario: A stale claim fails the tests
- **WHEN** the data no longer supports a claim a guide declares (for example which brand led most years)
- **THEN** `npm test` fails and names the guide and the claim

#### Scenario: Links stay indexable
- **WHEN** a guide links to a comparison page that is noindexed or missing
- **THEN** `npm test` fails and names the link
