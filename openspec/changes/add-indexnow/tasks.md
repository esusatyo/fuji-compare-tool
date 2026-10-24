## 1. Key and script

- [x] 1.1 Commit the Bing-issued key file `870b934a4865448e894273f3859a8725.txt` at the repo root
- [x] 1.2 Write `scripts/indexnow.js`: pure `selectUrls({changedFiles, oldSitemap, newSitemap, baseUrl})`, sitemap parsing via `git show`, `--since/--until`, `--all`, `--dry-run`, and a POST to api.indexnow.org
- [x] 1.3 Add `tests/data/indexnow.test.js` (key file served and matching, URL selection rules) and run `npm test`

## 2. Workflow

- [x] 2.1 Add `.github/workflows/indexnow.yml`: on push to `main`, wait for the Workers Builds check to succeed, then run the script over `before..sha`
- [x] 2.2 Document IndexNow in CLAUDE.md (key location, what is pinged when, `--all` for a manual full submit)

## 3. After merge

- [ ] 3.1 Confirm the key file is served in production and that the workflow's first run succeeded
- [ ] 3.2 Owner: submit all sitemap URLs once (`node scripts/indexnow.js --all`) and check Bing's IndexNow report
- [ ] 3.3 Archive this change
