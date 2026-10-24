## 1. Currency display

- [x] 1.1 Comparison-table price row: tagged-USD fallback; highlight only when every selected item has a local price
- [x] 1.2 Discontinued launch price labelled USD
- [x] 1.3 Logic tests for both; preview a USD-only lens and a discontinued item in a non-USD currency

## 2. Multiple price citations

- [x] 2.1 Schema: `priceSource` is one citation or a non-empty list
- [x] 2.2 References (engine.js and generate-seo.js) render every price citation; link test checks each
- [x] 2.3 Tests: schema guard, references parity fixture, rendered order

## 3. Rules in the skills

- [x] 3.1 refresh-camera-data: multi-source price rule (replaces the single-source wording), USD-only rule for new lenses
- [x] 3.2 check-prices-and-buy-links and add-thirdparty-lenses: same rules
- [x] 3.3 Validate, npm test, PR body, push

## 4. Price audit of this PR's own lenses (2026-10-24)

An offline audit (cross-mount USD spread, regional/USD ratios, citation basis) found prices in PR #78 that break the rules above.

- [x] 4.1 Sony: 83 new lenses (Viltrox, Samyang, Sigma, Tamron batches of 2026-10-19) carry regional prices that exactly match `compute-prices.js`'s ratio formula: clear them (`null` + `priceIncomplete: true`), as the PR says new lenses are USD-only
- [ ] 4.2 Samyang: lenses still stored at the store's compare-at price move to the selling price (owner rule), checked against the Samyang store and B&H
- [ ] 4.3 Voigtländer Nokton 40/1.2, Nokton Classic 35/1.4, Portrait Heliar 75/1.8: the Canon RF and Sony E prices disagree by 14-47%; re-check across stores
- [ ] 4.4 Siblings: Thypoch Simera 35 Z/E (stored at a $549 compare-at), Viltrox 33/56 f/1.4 E and TTArtisan 56 f/1.8 Z (left at the old price when their siblings were fixed), 7Artisans 60mm 2x RF
- [ ] 4.5 npm test, test:links, PR body, review listing, push
