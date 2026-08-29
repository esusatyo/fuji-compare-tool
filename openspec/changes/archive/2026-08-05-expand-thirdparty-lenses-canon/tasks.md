# Tasks — Canon third-party lens expansion

One line per batch. A batch is done when its lenses are entered, grouped,
`npm run test:data` is green, and `PROGRESS.md` is updated **in the same commit**.

## Setup
- [x] Branch `expand-thirdparty-lenses-canon` off `main`
- [x] Change scaffold + `PROGRESS.md`
- [x] `npm test` green on the untouched baseline (409 pass)

## Research (citations before data)
- [x] Sigma RF-S follow-up: all four confirmed shipping in Canon RF
- [x] Tamron RF lineup re-check — 17-70mm f/2.8 (B070) newly shipping for RF
- [x] Viltrox RF lineup re-check — RF-S AF primes still rumoured, no change
- [x] TTArtisan native RF MF primes — specs not sourceable, deferred
- [x] 7Artisans native RF MF primes — specs not sourceable, deferred
- [x] Laowa RF top-up — both conflicts resolved, both entered

## Data batches
- [x] Sigma batch entered + grouped + green
- [x] Tamron batch entered + grouped + green
- [x] Viltrox batch — nothing to enter
- [x] TTArtisan batch — nothing enterable
- [x] 7Artisans batch — nothing enterable
- [x] Laowa batch entered + grouped + green

## Cross-cutting
- [x] `MANUFACTURER_COLORS` covers every `manufacturer` used (no new makers)
- [x] Images: 5 new maker images; the 2 Laowa allowlisted with a stated reason
- [x] `node scripts/compute-prices.js canon lenses` — all 19 third-party lenses now priced in 7 currencies
- [x] `node scripts/verify-images.js canon` — new URLs pass; 15 pre-existing Wikimedia URLs HTTP 429 (throttling, not broken)
- [x] `node scripts/generate-seo.js` re-run; `dataVerified` left at 2026-07-13 (this run verified one brand's lenses, not the dataset)
- [x] `npm test` fully green (409)
- [x] Render checked headlessly (browser extension unavailable)
- [x] PR opened (#22)
