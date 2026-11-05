## 1. Setup

- [x] 1.1 Create change, PROGRESS.md and catalogue diff

## 2. Canon RF maker batches

- [x] 2.1 Laowa
- [x] 2.2 Voigtländer
- [x] 2.3 TTArtisan
- [x] 2.4 7Artisans
- [x] 2.5 Thypoch + Samyang
- [x] 2.6 Meike + Yongnuo
- [x] 2.7 Sigma / Tamron / Viltrox re-check

## 3. Price consistency

- [x] 3.1 Dealer regular price for every compare-at entry (47), decision per entry
- [x] 3.2 Apply USD changes and recompute ratio-derived regional prices
- [x] 3.3 Normalise afType 'Manual Focus' → 'Manual'

## 4. Verify

- [x] 4.1 npm test, image check, test:links, generate-seo
- [x] 4.2 Preview /canon/ in lenses mode
- [x] 4.3 PR #78 body update

## 5. Owner review follow-ups (2026-10-22)

- [x] 5.1 Flag the Laowa RL lengths (17 entries) in the PR description for owner review
- [x] 5.2 Tamron 16-50mm F2.8 A: re-verify the Canon and Sony E entries (Sony was already added in the Sony pass)
- [x] 5.3 Landing/About lens counts: count each lens once (same mount + same id)
- [x] 5.4 refresh-camera-data skill: third-party USD = B&H rule
- [x] 5.5 TTArtisan cross-mount weight ranges: stay skipped; look for per-mount weights
- [x] 5.6 Review listing (Artifact) of every lens added in this PR, with sources and flags
- [x] 5.7 Verify, PR body, push

## 6. Owner decisions (2026-11-05)

- [x] 6.1 Laowa RL 9/11/14mm (17 entries): keep Laowa's single published size and weight on every mount; cite Laowa's live page, an archived copy of its spec table (Wayback Machine) and that mount's B&H listing with its figures
- [x] 6.2 Samyang AF 85mm f/1.4 FE (first generation) and 8mm f/3.5 Fisheye CS II, Sony E: discontinued; USD becomes the launch price ($699, 2019) and Adorama's last list price ($299); AF 85 year 2018 -> 2019 (announced March 2019)
- [x] 6.3 Voigtländer Nokton 40mm f/1.2: Sony E $1,099 and Canon RF $749 kept as they are
- [x] 6.4 Leica Summilux-M 90 f/1.5 image: Leica moved the file (404 in test:links) -> the product page's current og:image
- [x] 6.5 Verify (npm test 866/866, test:links pass), PR body, review listing answers, push

## 7. Owner follow-ups (2026-11-05, second round)

- [x] 7.1 Seven minimum-focus distances stored 10x too large (already on main): re-read from the maker (B&H for Meike) and fixed, with a citation on each; schema guard rejects MFD >= 150 cm and > 3.5x the longest focal length
- [x] 7.2 Samyang 8mm f/3.5 Sony E: Adorama's discontinued listing ($299) cited as its price source (done in 6.2)
- [ ] 7.3 Document the remaining doubts for the next sweep (cross-mount spec conflicts, estimated release years) in the PR description; verify, push
