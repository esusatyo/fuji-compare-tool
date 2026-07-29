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
- [ ] TTArtisan native RF MF primes + dimensions
- [ ] 7Artisans native RF MF primes + dimensions
- [ ] Laowa RF top-up (58/2.8, 100/2.8 2× macro)

## Data batches
- [x] Sigma batch entered + grouped + green
- [x] Tamron batch entered + grouped + green
- [x] Viltrox batch — nothing to enter
- [ ] TTArtisan batch entered + grouped + green
- [ ] 7Artisans batch entered + grouped + green
- [ ] Laowa batch entered + grouped + green

## Cross-cutting
- [ ] `MANUFACTURER_COLORS` covers every `manufacturer` used
- [ ] Images: maker image or Commons+`imageCredit`; rest allowlisted with reasons
- [ ] `node scripts/compute-prices.js canon lenses` — all 7 currencies filled
- [ ] `node scripts/verify-images.js canon` clean
- [ ] `dataVerified` bumped + `node scripts/generate-seo.js` re-run
- [ ] `npm test` fully green
- [ ] Preview eyeballed in lenses mode
- [ ] PR opened
