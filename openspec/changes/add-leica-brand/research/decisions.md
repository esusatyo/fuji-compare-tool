# Research decisions — Leica brand (running log)

Append a numbered section for every decision made during a task, with the task
number and date. Newest at the bottom.

## 1. Owner kickoff decisions (2026-09-14)

- **Systems in scope**: SL, TL/CL, M digital rangefinders, Q + rebadged
  compacts (all four offered options chosen).
- **M lenses**: current catalogue only; lower the lens year floor if a current
  design predates 2008.
- **Fixed-lens cameras**: follow precedent — system mount id + `lensType: 'Fixed'`.
  (Owner first picked a new `fixed` id on an under-informed recommendation;
  re-asked once the existing `cameraMountLabel()` mechanism was found, and chose
  precedent.)
- **ASIN baseline**: rebase `ASIN_GAP_BASELINE` for the Leica population in a
  dedicated commit that names each item. At kickoff main had 63 current items
  without an ASIN against a baseline of 86 (23 free slots).
- **Housekeeping done first**: Olympus was already merged (#59) and archived;
  the stale `add-olympus-brand` worktree and local branch were removed, and its
  one unmerged commit (AGENTS.md → symlink) was ported to PR #63.

## 2. Lessons carried over from the Olympus onboarding

- The pre-commit hook runs `generate-seo.js` on any `data.js` change and it
  crashes on an unresolvable `heroCamera` / `defaultSelected`; the render-logic
  suite needs ≥4 cameras and ≥4 lenses. So the scaffold commit (task 2.2)
  must carry a small, **fully researched** seed — never stubs.
- Product pages can show a sale price as if it were list price; cross-check
  against a catalogue listing that shows the strikethrough.
- Text fetches misread dimension diagrams; verify width/EVF magnification
  against the image when a figure looks off.
- `root-redirect.test.js` has two brand lists (redirect case + crawlable-landing
  list), and `KNOWN_IMAGE_GAPS` needs a brand key.
- Leica's catalogue pages (`/photography/lenses/m`, `/sl`) render product lists
  client-side; WebFetch sees only navigation. Use per-product pages, the
  regional online store, or Wikipedia/DPReview lists as the enumeration spine.
