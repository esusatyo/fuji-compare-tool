## How to work this change

- Worktree `.claude/worktrees/search-picker`, branch `add-search-picker` (from main 3c4d911).
- One PR, several commits; `npm test` green at each. PR body must not contain a session link.
- Read `design.md` first; D1–D10 are settled with the owner (2026-11-13).

## 1. Picker on every page (engine.js, engine.css)

- [x] 1.1 Pure search: `searchTokens`, `searchForms`, `searchScore`, `searchItems` (design D4).
- [x] 1.2 `.slot-picker` button replaces `<select class="slot-select">`; one shared popover
      (`#picker-pop`): browse list with group headings, ranked results while typing, disabled
      "Added" items, keyboard (arrows / Enter / Escape / Tab), outside press closes, focus returns.
- [x] 1.3 `selectItem()` is the single pick path; `picker-pick:<page>:<search|browse>` event.
- [x] 1.4 Styles: button, popover, full-screen sheet below 600px sized to `visualViewport`.
- [x] 1.5 Tests: `tests/helpers/dom.js` drives the picker; existing tests ported;
      `tests/logic/search-picker.test.js`.

## 2. Homepage embed

- [x] 2.1 Engine: `COMPARE_CONFIG.embed` — `injectEmbed()`, empty (`null`) slots through
      winners / sections / table / hash, count buttons, idle (non-sticky, label-less) slot row.
- [x] 2.2 Engine: name index, `ensureData()` / `hydrateCatalogue()`, loading and retry states,
      `quick-compare:first|pair`.
- [x] 2.3 Generator: `cameraIndex()`, `homeConfigScript()`, `#app` section + hero line in
      `rootBodyBlock()`; `index.html` loads `engine.js`; regenerate.
- [x] 2.4 Remove the stored-brand redirect from `index.html`.
- [x] 2.5 Tests: `tests/helpers/load-home.js`, `home-embed.test.js`, `root-page.test.js`
      (replaces `root-redirect.test.js`).

## 3. Docs

- [x] 3.1 `privacy.html` and the `analytics.js` grammar list the two new events.
- [x] 3.2 `CLAUDE.md`, `add-camera-brand` skill (no `VALID_BRANDS` step), growth backlog status.

## 4. Verify and ship

- [x] 4.1 Browser check on the local preview: homepage (search, pick, count, shared link),
      a brand lens page, phone-width frame.
- [x] 4.2 `npm run test:links` (URLs unchanged by this change — run anyway per house rule). Green 2026-11-13.
- [x] 4.3 Open the PR (#88).
- [ ] 4.4 Owner: real-device check — iPhone Safari (sheet + keyboard), iPad, Android Chrome.
- [ ] 4.5 After merge: verify live, archive this change, review the events after 4–8 weeks.
