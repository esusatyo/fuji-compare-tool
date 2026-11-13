## How to work this change

- Worktree `.claude/worktrees/diff-toggle`, branch `add-differences-toggle`, stacked on
  `add-search-picker` (PR #88). Merge #88 first, then this.

## 1. Build

- [x] 1.1 `renderTable`: per-row "differs" from rendered cells across filled slots; toggle bar
      with count; hide identical rows and emptied sections when on; no bar under two items.
- [x] 1.2 `computeWinners`: no winner on a dead heat.
- [x] 1.3 `--win` / `--win-tint` tokens in both themes; `.spec-value.winner` uses them.
- [x] 1.4 `diff-only:<page>:<on|off>` event; `analytics.js` grammar; `privacy.html`.
- [x] 1.5 Tests: `differences.test.js`; `winners.test.js` tie cases.

## 2. Ship

- [x] 2.1 Browser check on the local preview (compare page, toggle on, light theme).
- [ ] 2.2 Open the PR against `add-search-picker`.
- [ ] 2.3 After merge: archive this change.
