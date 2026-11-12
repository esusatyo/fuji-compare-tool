## 1. Setup

- [x] 1.1 Archive `resolve-open-data-doubts` (merged in #84)
- [x] 1.2 Create this change and PROGRESS.md

## 2. Pre-release items

- [x] 2.1 `preRelease` flag in the schema (USD may be null, all-currency exemption, not with `discontinued`) with data tests
- [x] 2.2 Price cell reads "Price not announced" for a pre-release item with no price, with a logic test; document the flag in CLAUDE.md

## 3. New items

- [x] 3.1 Sigma fp2 (sigma)
- [x] 3.2 Nikkor Z 120-300mm f/2.8 TC VR S (nikon)
- [x] 3.3 Sony FE 8-14mm F3.5 Fisheye G (sony)
- [x] 3.4 Sigma 16-300mm F3.5-6.7 DC OS, Nikon Z (nikon)
- [x] 3.5 Tamron 16-50mm F2.8 A, Nikon Z and Fujifilm X (nikon, fujifilm)
- [x] 3.6 Viltrox AF 35mm F1.4 Pro, Sony E and Nikon Z (sony, nikon)
- [x] 3.7 Laowa 24mm f/2 Zero-D Tilt-Shift (every mount the catalogue covers)
- [ ] 3.8 Thypoch Sculptor AF 23mm f/1.4 (fujifilm, plus other shipped mounts)
- [x] 3.9 Sigma 50mm F1.4 CL DG Contemporary, Sony E and L-Mount (pre-release, no price)

## 4. Verify

- [ ] 4.1 `npm test` and `RUN_LINK_TESTS=1 npm run test:links` pass; PR opened
