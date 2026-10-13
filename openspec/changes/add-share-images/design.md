## Context

Head tags are generator-owned on every page: `metaBlock` (brand and root), `vsPageHTML`, `crossVsPageHTML`, `identityHeadBlock` (About/Privacy) and `compareHeadBlock` each write `og:title/description/url` and `twitter:card=summary`, but no image. That gives about 305 pages: home, About, Privacy, `compare/`, 8 brand pages, about 218 same-brand and 73 cross-brand vs-pages. Of those vs-pages, 45 are indexable and the rest are `noindex, follow`.

What already exists to build on:
- `scripts/render-touch-icon.js` renders a PNG from generator-supplied SVG/HTML by calling headless Chrome's `--screenshot`, and `tests/data/touch-icon.test.js` decodes the committed PNG with a zero-dependency decoder to check it. That's the same pattern needed here, scaled up.
- `identityToken()` and `logoMark()` in `generate-seo.js` give the brand tokens and mark from the single rebrand sources.
- Cameras store `width`/`height`/`depth` (mm), `sensorMP`, `ibisStops`, `weight` and `year`.

Constraints: the site stays zero-dependency and works without a build step at deploy time, `generate-seo.js` stays pure and deterministic, and the pre-commit hook must stay network-free.

## Goals / Non-Goals

**Goals:**
- Every page shares as a large image card that says what the page is.
- Vs-cards are specific enough that a Reddit reader can tell the comparison from the preview alone.
- Stale or missing cards fail `npm test`, as stale head blocks already do.

**Non-Goals:**
- **Product photos on cards.** Commons photos are mostly CC BY/BY-SA, so a composite is an adaptation that needs on-image attribution and, for BY-SA, would put the card itself under BY-SA. Manufacturer press shots are used on-page only to depict the product in context, and baking them into our own promotional graphic goes beyond that. The scale silhouettes carry the visual instead. Revisit separately if wanted.
- **Cards for interactive states.** A shared `/fujifilm/#cameras=x-t5,x-s20` shows the Fujifilm brand card, because crawlers never see the hash. A per-state card would need a Worker rendering images on request, which is a separate change if share data shows it matters.
- **On-demand cards for any selection.** These would need crawlable share URLs plus Worker-side rendering, and they're deferred until the share-button data shows interactive links get shared.
- Light-theme cards, localized cards, and per-lens cards (lenses have no vs-pages).

## Decisions

**1. Render at author time with headless Chrome and commit the PNGs.** The rejected alternative was a Worker route that renders on request (satori + resvg-wasm). That would add runtime dependencies and a bundling step to a Worker that has none today, and it would make a social-crawler fetch depend on CPU limits at the edge. Committed PNGs are static, cacheable and inspectable in PR diffs, and they follow the touch-icon precedent.

**2. Split the pure builder from the impure renderer.** `shareCardHTML(page)` lives in `generate-seo.js`: it's pure, uses tokens and data only, and returns a self-contained 1200×630 HTML document. `render-share-images.js` only screenshots. Freshness is checked against a **hash of the card HTML** stored in `og/manifest.json`, not against pixels, because Chrome's font rasterisation differs between machines and a pixel check would fail for no real reason. The test recomputes every page's card HTML hash and compares it with the manifest. Manifest entries without pages, and PNGs without manifest entries, both fail.

**3. Put no prices or other frequently changing data on cards.** Price refreshes are the most common data edit. With prices kept off the cards, a routine price pass re-renders nothing. Vs-card rows are sensor MP, IBIS (stops or "none"), weight and year. Brand cards show counts, which only change when cameras or lenses are added, so those edits already trigger generation.

**4. Draw silhouettes to scale.** Both bodies are drawn as simple rounded-rect front views (the same visual language as the engine's placeholder SVG) at a shared mm-to-px scale from `width` × `height`, labelled with the dimensions. This makes each card unique and conveys information. It also previews the size-comparison idea at no extra cost. A camera missing dimensions renders without a silhouette rather than with a guessed one.

**5. Incremental rendering, run by the hook when Chrome is present.** The renderer re-renders only cards whose hash changed or whose PNG is missing, and deletes orphans. Chrome launches once per card at about 0.5 s each, run 4 at a time: a full run takes about a minute, and a typical incremental run is 0–5 cards. The hook calls it after `generate-seo.js` when `CHROME_BIN` or the default macOS path exists. It needs no network, which keeps within the hook's "no external fetches" rule. Without Chrome, the hook skips it and the test failure prints `node scripts/render-share-images.js`.

**6. Image paths mirror page paths under `og/`.** Use absolute URLs from `siteConfig().baseUrl` (platforms require them). About and Privacy reuse the home card (`og/home.png`); a separate identical image would only add a file.

**7. Use dark tokens only, in a fixed layout.** The logo lockup sits at top-left, the title is set large, the content block sits below, and the domain sits at bottom-right. Keep about 60 px of safe margin, because some platforms crop toward 1.91:1 or square-center. Layout is checked by eye on 3 sample cards before a full render.

**8. The share button is a measuring instrument first.** It sits in the page hero, directly above the comparison, not in the site header or the sticky compare header: both are already tight on narrow screens (the sticky header's label column is hidden below 600px, and the unresolved iPad header issue lives in the site header). It uses `navigator.share` where it exists (on phones, that's how people post into the Reddit or Discord apps) and `navigator.clipboard.writeText` elsewhere. If neither is available, it shows the URL in a selected read-only field, with no `alert()`. The shared URL is exactly `location.href` (the existing `#mode=…` grammar), so this change makes no URL-format decision; it leaves the hash-to-query-string question to the on-demand-cards follow-up. The event is `share-link:<brand|compare>:<cameras|lenses>:<native|copy>`, fired when the share sheet opens or the copy succeeds, so it counts intent, not completed posts (the share sheet doesn't report which app was chosen, and cancelling it fires no event). Vs-pages get no button: their address bar already holds a clean, crawlable URL that previews with its own card.

## Risks / Trade-offs

- [The repo grows by about 10–18 MB of PNGs, and churns whenever a card changes] → measure 3 sample cards first (task 1). If the projected total exceeds about 20 MB, same-brand noindexed vs-pages fall back to their brand card. Indexable and cross-brand pages always keep their own card.
  *Measured 2026-10-13 (spike):* three vs-cards rendered at 66, 75 and 75 KB with a flat background. A radial-gradient background doubled that to 118–129 KB, so the background stays flat. About 302 cards × ~72 KB ≈ **22 MB**, just over the 20 MB line. With the fallback, about 115 own cards ≈ 8 MB. **Decision (owner, 2026-10-13): option (a), every page gets its own card**, so a shared link to any vs-page previews that exact pair.
- [A contributor without Chrome can't refresh cards] → the test names the command, CI isn't affected (it only checks hashes), and the only source of stale cards is a data edit that changes card fields.
- [Reddit and Facebook cache previews per URL for days] → expected for already-shared URLs. Verify with the platforms' debuggers after deploy rather than assuming.
- [Font differences between machines change how cards look but not their hashes] → cosmetic only. The system font stack avoids missing-font fallbacks.
- [Silhouettes imply a precision that rectangles don't have] → label them as "front, to scale" with the W×H figures, and keep the shapes deliberately schematic.

- [Pre-merge previews can't be validated by social platforms] → `og:image` is an absolute production URL (taken from `site-config.js`, with no build step to rewrite it per deploy), so a validator pointed at a Workers preview fetches a production image that doesn't exist yet. Review cards locally (`render-share-images.js --sheet`, or `scripts/preview.py` at `/og/...png`), and confirm the preview serves the files. Run real validators after merge.

## Migration Plan

Additive. Ship the tags and images together in one PR so no tag ever points at a missing image. Rolling back means reverting the PR, which restores `summary` cards. After deploy, run 3 representative URLs through a card validator and do a real paste into Discord or a Reddit post-preview.

## Open Questions

- Should product photos come later, for Commons-only items with a visible credit line on the card? This is deferred to the owner, and nothing in this change prevents it.
