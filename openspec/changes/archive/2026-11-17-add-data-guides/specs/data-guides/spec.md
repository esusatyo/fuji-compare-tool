## ADDED Requirements

### Requirement: Data-led guides answer one search question
The site SHALL publish guides at `/guides/<slug>`, each answering one search question, with every number in the page generated from the brand data files. Each guide SHALL have a static H1, the byline and its Updated date at the top, a first paragraph that answers the question, internal links only to existing indexable pages, a method note and the same date in its closing note.

#### Scenario: Numbers follow the data
- **WHEN** a camera's weight changes in its `data.js` and the generator is rerun
- **THEN** every guide that uses that camera shows the new weight in its table, chart and prose
- **AND** that guide's Updated date and sitemap `<lastmod>` move to the day of the change

#### Scenario: Unchanged guides keep their date
- **WHEN** the generator is rerun on a later day with no change that affects a guide
- **THEN** that guide's Updated date stays the same

#### Scenario: A stale claim fails the tests
- **WHEN** the data no longer supports a claim a guide declares (for example which brand led most years)
- **THEN** `npm test` fails and names the guide and the claim

#### Scenario: Links stay indexable
- **WHEN** a guide links to a page that is noindexed or missing, or to a deep link whose slug no longer resolves
- **THEN** `npm test` fails and names the link

### Requirement: Dated articles are frozen snapshots
The site SHALL publish dated articles at `/articles/<slug>`, rendered from a data snapshot committed with the article and showing a Published date at the top. The `/articles/` index SHALL exist only while at least one article does.

#### Scenario: A data change leaves articles alone
- **WHEN** a camera in an article's snapshot changes in its `data.js` and the generator is rerun
- **THEN** the article's page is unchanged

#### Scenario: No articles yet
- **WHEN** `content/articles/` holds no article
- **THEN** no `/articles/` index is generated and none is in the sitemap
