## 1. Setup

- [x] 1.1 Create change folder, `PROGRESS.md`, research ledgers

## 2. SG-image (new maker)

- [x] 2.1 Enumerate X-mount lineup from the maker; record in `research/lenses.md`
- [x] 2.2 Add `SG-image` to `MANUFACTURER_COLORS`
- [x] 2.3 Enter lenses + `── SG-image ──` group; images; prices; `npm run test:data`; commit

## 3. Voigtländer (complete X-mount)

- [x] 3.1 Enumerate X-mount lineup from Cosina; record in `research/lenses.md`
- [x] 3.2 Enter missing lenses into `── Voigtländer ──`; images; prices; test; commit

## 4. Laowa (complete X-mount)

- [x] 4.1 Enumerate X-mount lineup from Venus Optics; record in `research/lenses.md`
- [x] 4.2 Enter missing lenses into `── Laowa ──`; images; prices; test; commit

## 5. Verify

- [ ] 5.1 `node scripts/generate-seo.js`; `npm test` green
- [ ] 5.2 `node scripts/verify-images.js fujifilm`; `RUN_LINK_TESTS=1 npm run test:links`
- [ ] 5.3 Preview eyeball in lenses mode
- [ ] 5.4 `openspec validate add-fujifilm-thirdparty-lenses --strict`; open PR
