## ADDED Requirements

### Requirement: Search engines are notified of changed pages
The site SHALL serve its IndexNow key file at the root. After each successful production deploy, it SHALL submit to IndexNow the sitemap URLs whose pages changed in the deployed commit range, plus any URLs dropped from the sitemap in that range. It SHALL NOT submit URLs that are neither in the current sitemap nor dropped from it.

#### Scenario: A vs-page changes
- **WHEN** a push to `main` changes `vs/sony-a7r-vi-vs-nikon-z8.html`, which is in the sitemap, and the Workers Builds deploy succeeds
- **THEN** `https://comparecameraspecs.com/vs/sony-a7r-vi-vs-nikon-z8` is submitted to IndexNow

#### Scenario: A noindexed page changes
- **WHEN** a push changes a vs-page that is not in the sitemap
- **THEN** that URL is not submitted

#### Scenario: A page leaves the sitemap
- **WHEN** a push removes a URL from `sitemap.xml`
- **THEN** that URL is submitted, so the engine re-crawls it and sees the removal

#### Scenario: Brand data changes
- **WHEN** a push changes `sony/data.js`
- **THEN** `https://comparecameraspecs.com/sony/` is submitted

#### Scenario: Deploy fails
- **WHEN** the Workers Builds check for the pushed commit fails or does not finish within the timeout
- **THEN** nothing is submitted
