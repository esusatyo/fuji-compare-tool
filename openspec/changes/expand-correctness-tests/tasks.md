## 1. Helpers

- [ ] 1.1 Add `tests/helpers/link-policy.js` exporting `ALLOWED_HOSTS` (suffix-match list seeded from hosts present in both brands' data), an `IMAGE_EXT` set, and small helpers (`hostAllowed(url)`, `isImageUrl(url)`).
- [ ] 1.2 If useful, add a render-sweep helper to `tests/helpers/dom.js` (e.g. `eachItemInSlot(window, ids, cb)`) so the rendered-output and placeholder tests share one loop.

## 2. Rendered-output suite (Tier 2)

- [ ] 2.1 Add `tests/logic/rendered-output.test.js`: for each brand, load `{ engine: true }`, pass every camera through a slot, and assert `#compare-table` text contains none of `undefined`, `null`, `NaN`, `[object Object]`.
- [ ] 2.2 Repeat in lenses mode (via `clickMode`) for every lens.
- [ ] 2.3 In the same pass, assert every `.spec-value` cell has non-empty trimmed text (em-dash counts).

## 3. Placeholder / icon suite (Tier 2)

- [ ] 3.1 Add `tests/logic/placeholders.test.js`: for each item, render it in a slot and assert — `imageUrl` present → `<img class="cam-photo">` with non-empty `alt`; absent → `.cam-placeholder` with a non-empty resolved background colour. Cover both cameras and lenses modes.

## 4. Offline link hygiene (Tier 1)

- [ ] 4.1 Add `tests/data/links-offline.test.js`: every `imageUrl`/`buyUrl`/`productUrl` parses with `new URL()`, is `https`, and its host is in `ALLOWED_HOSTS`.
- [ ] 4.2 Assert every `imageUrl` path ends with an image extension from `IMAGE_EXT`.
- [ ] 4.3 Assert no `imageUrl`, `buyUrl`, or `productUrl` is shared by two distinct product ids (collect maps, report collisions).
- [ ] 4.4 Assert every non-discontinued camera and lens has a non-null `buyUrl`.

## 5. Data plausibility (Tier 1)

- [ ] 5.1 Add `tests/data/plausibility.test.js`: define documented USD-anchored ratio bands per currency; assert each present non-null non-USD price falls within its band.
- [ ] 5.2 Assert text fields (`name`, `tagline`, …) have no `TODO`/`TBD`/`???` residue and no leading/trailing whitespace; taglines within a max length.
- [ ] 5.3 Assert no duplicate `name` within `CAMERAS` and within `LENSES`.

## 6. Network link checker (Tier 3, opt-in)

- [ ] 6.1 Implement `checkUrl(url, kind)` in `tests/links/links.test.js`: `fetch` HEAD→GET fallback, realistic User-Agent, ~8s `AbortController` timeout, concurrency cap.
- [ ] 6.2 Add an on-disk cache (`tests/links/.link-cache.json`, gitignored) with a TTL; apply the existing FAIL/WARN status policy and image `Content-Type` check; remove the `todo` marker once wired.
- [ ] 6.3 Add `tests/links/.link-cache.json` to `.gitignore`.

## 7. Verify

- [ ] 7.1 Run `npm test`; fix any genuine data/engine defects the new offline suites surface (or add a documented allowlist entry following the `KNOWN_IMAGE_GAPS` convention).
- [ ] 7.2 Run `npm run test:links` once to confirm the network checker executes and classifies correctly (allow warnings; expect no hard 404/410 failures).
- [ ] 7.3 Update `tests/README.md` to describe the new suites.
