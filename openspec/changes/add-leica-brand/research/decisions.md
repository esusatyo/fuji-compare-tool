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

## 3. Task 1.1 — camera enumeration calls (2026-09-14)

- **40 core bodies** (SL 6, TL/CL 4, M 23, Q 7); compact / Leica X / SOFORT
  candidates listed separately in `research/cameras.md` for task 1.4.
- **Special editions excluded** — Leica issues many cosmetic editions (Titanium,
  Black Paint, Reporter, Metal Gray, anniversary); only functionally or
  optically distinct bodies are entries. Monochrom variants *are* distinct
  (different sensor) and get entries.
- **Rumoured bodies excluded** (Q3 43 Monochrom, M11-R, M12). A 2026-09-02
  roundup lists them as unannounced; re-check before ship (task 8.2).
- **M series split `M` / `M Monochrom`; Q stays one `Q` series** (reasoning in
  `research/cameras.md`) — provisional until task 1.3.
- **Three source conflicts** flagged ⚠ for resolution at entry: M-P (Typ 240)
  year, V-Lux 5 year, Q2 Monochrom exact RRP.
- **Access notes**: cameradecision.com returns 403 and macfilos.com 401 to
  WebFetch; Leica's newsroom index is client-rendered. Individual
  leica-camera.com press URLs and Wikipedia pages fetch fine.
- For task 1.2: Leica announced the **Summicron-M 66 f/2** (Classic Line) on
  2026-09-03; confirm whether it's a regular catalogue lens or limited edition.

## 4. Task 1.4 — owner scope verdicts (2026-09-14), taken before task 1.2

Done out of order on purpose: three of the four questions only needed task
1.1's camera list, and the fourth (TL lenses) decides what task 1.2 enumerates,
so answering first saves 1.2 from researching lenses that might be dropped.

- **Compacts: large-sensor only** (recommended) — D-Lux (Typ 109) / 7 / 8
  (4/3), V-Lux (Typ 114) / 5 and C-Lux (1"). The 2008–2012 small-sensor
  Panasonic twins are out.
- **Leica X: included** (recommended) — 6 bodies, 2009–2016.
- **SOFORT 2: excluded** (recommended).
- **TL lenses: included; discontinued SL lenses: excluded** (recommended).
- Knock-on: series `X`, `D-Lux`, `V-Lux`, `C-Lux` all map to `l` + `lensType:
  'Fixed'`; design §3's regex gains `X`. Total bodies: **52**.

## 5. Task 1.2 — lens enumeration calls (2026-09-14)

- **~48–49 lenses**: M 25, SL 16–17, TL 7 (`research/lenses.md`).
- **`year` = version year, not design year** (design §5 revised). The Summicron-M
  50 f/2 formula dates from 1979, but the lens on sale is a later version; the
  site's Year row means "when this product came out" for every other brand.
- **Classic Line reissues are regular catalogue lenses**, not editions: Summaron-M
  28, Thambar-M 90, Noctilux-M 50 f/1.2, Summilux-M 35 "Steel Rim", Summilux-M 50
  Classic. The Summicron-M 66 is the exception (660-unit limited edition) → out.
- **A dealer listing isn't proof a lens is current**: the Tri-Elmar-M 16-18-21 is
  still listed (out of stock) but was discontinued in January 2025. The reverse
  also happens: Summilux-M 24 and Summilux-M 90 have live leica-camera.com pages
  but aren't on the dealer page. Every ⚠ status gets a leica-camera.com product
  page check at entry.
- **Summilux-SL 50 f/1.4 has two lenses with the same name** (2015 original,
  2026 compact redesign). Per the lens-revisions memory they're separate entries;
  the original is only in scope if Leica still sells it.
- **Access notes**: alikgriffin.com returns 403; the dealer's SL collection URL
  guesses 404; Leica's 2016–2017 press-release archive URLs return navigation
  only. DPReview launch articles were the reliable TL source.
