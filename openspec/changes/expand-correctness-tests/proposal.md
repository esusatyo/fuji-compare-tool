## Why

The current harness validates data *structure* (schema, referential integrity) and *engine logic* (winners, pickers, currency), but nothing verifies what the user actually sees: that every camera/lens renders without leaking `undefined`/`null`/`NaN` into the table, that placeholders/icons resolve, that links point at the right places, and that price/text data is internally plausible. These are exactly the "wrong data, broken link, missing icon/text" defects that slip past the existing tests because each data object is individually schema-valid yet still wrong in aggregate.

## What Changes

- Add a **rendered-output** suite (Tier 2): drive the engine through every camera and every lens and assert the compare table never renders the literal strings `undefined`, `null`, `NaN`, or `[object Object]`, and that every spec row produces a value or the em-dash placeholder (never an empty/blank cell).
- Add a **placeholder/icon integrity** suite (Tier 2): `buildPlaceholder` yields valid markup for every item in both modes — an `<img>` with a non-empty `alt` when `imageUrl` is set, otherwise an SVG placeholder whose series/manufacturer colour resolves.
- Add an **offline link hygiene** suite (Tier 1): every `imageUrl`/`buyUrl`/`productUrl` parses as a real `https` URL, its host is in an expected-domain allowlist, `imageUrl` ends in an image extension, no two different products share the same image/buy/product URL (copy-paste guard), and every non-discontinued item has a `buyUrl`.
- Add **data plausibility** checks (Tier 1): per-currency prices sit within sane ratio bands of the USD price (catches order-of-magnitude/decimal entry errors), no duplicate `name` within `CAMERAS`/`LENSES`, and text fields carry no placeholder residue (`TODO`/`TBD`/`???`), no surrounding whitespace, and taglines stay within a length budget.
- **Implement the stubbed network link checker** (Tier 3): wire `checkUrl` with `fetch` (HEAD→GET, realistic UA, timeout, concurrency cap, on-disk cache) and the documented status policy, so `npm run test:links` actually verifies link liveness. Remains opt-in (`RUN_LINK_TESTS=1`), never blocking.

## Capabilities

### New Capabilities
- `test-coverage`: Correctness guarantees the automated suites enforce across all brands — rendered output, placeholder/icon integrity, link validity (offline + opt-in network), and data plausibility.

### Modified Capabilities
<!-- None — openspec/specs/ has no existing capability to modify. -->

## Impact

- New test files under `tests/data/` and `tests/logic/`; the existing `tests/links/links.test.js` stub is implemented.
- Possible new helper(s) in `tests/helpers/` (expected-domain allowlist, render sweep, link fetcher + cache).
- No production code changes expected; if a test surfaces a real defect (e.g. a missing field a formatter assumes), that data/engine fix is handled separately.
- `package.json` test scripts unchanged in shape; new offline suites run under `npm test`, the network suite stays behind `npm run test:links`.
- All suites continue to auto-discover every brand directory (no per-brand wiring).
