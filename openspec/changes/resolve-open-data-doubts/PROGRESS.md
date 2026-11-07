# Progress — resolve open data doubts (after #83)

**Branch:** cleanup-archive-nov2026 (from main 5a2f4b6)
**Resume at:** 2.1

**Owner (2026-11-08):** "Please do a cleanup, and also please start the
research on the new errors you have just found." The three errors found
during #83 (Samyang 14mm X price, 8mm Fisheye II name, TTArtisan TS 17 years)
were already fixed there, so this covers the items #83 could not settle plus
two noticed while checking.

## 1.1 Cleanup (done 2026-11-08)

- 13 OpenSpec changes archived (#78, #83, #77 and four older finished ones,
  plus the two stale Canon/Nikon third-party changes). Nine legacy main specs
  got `## Purpose` / `## Requirements` so the CLI could apply deltas;
  adopt-design-system's "Engine is brand-agnostic" delta now keeps the
  registry sentences from cross-brand-compare. Left open: add-indexnow,
  add-share-images, add-sitemap-lastmod, canon-firstparty-lens-gaps (owner
  checks pending), expand-correctness-tests, expand-panasonic-lineup.
- Worktrees removed (all merged, nothing uncommitted; symlinked node_modules
  unlinked first): fuji-compare-canon-sony, -laowa-fuji, -tool-cache-fujifilm-
  images, -tool-events, -tool-oct-followups, -tool-refresh-sigma-olympus and
  .claude/worktrees add-indexnow, add-share-images, noindex-thin-vs-pages,
  sitemap-lastmod. Kept: the main checkout (on archive-add-leica-brand, with
  untracked .tmp-review/ and openspec/changes/add-olympus-brand/),
  fuji-compare-tool-main, this worktree.
- 17 merged local branches and 13 merged GitHub branches deleted (GitHub now
  has only main + this branch).
