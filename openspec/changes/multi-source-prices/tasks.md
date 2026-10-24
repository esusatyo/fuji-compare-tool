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
- [ ] 3.3 Validate, npm test, PR body, push
