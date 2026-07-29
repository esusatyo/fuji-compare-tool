# Tasks — Canon third-party lens expansion

One line per batch. A batch is done when its lenses are entered, grouped,
`npm run test:data` is green, and `PROGRESS.md` is updated **in the same commit**.

## Setup
- [x] Branch `expand-thirdparty-lenses-canon` off `main`
- [x] Change scaffold + `PROGRESS.md`
- [x] `npm test` green on the untouched baseline (409 pass)

## Research (citations before data)
- [ ] Sigma RF-S follow-up: confirm which of 12/1.4, 15/1.4, 17-40/1.8, 16-300 ship in RF-S
- [ ] Tamron RF lineup re-check (anything past 11-20 / 18-300)
- [ ] Viltrox RF lineup re-check (did the rumoured RF-S AF primes ship?)
- [ ] TTArtisan native RF MF primes + dimensions
- [ ] 7Artisans native RF MF primes + dimensions
- [ ] Laowa RF top-up (58/2.8, 100/2.8 2× macro)

## Data batches
- [ ] Sigma batch entered + grouped + green
- [ ] Tamron batch entered + grouped + green
- [ ] Viltrox batch entered + grouped + green
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
