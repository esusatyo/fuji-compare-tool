## Why

Canon's first-party RF coverage is the weakest part of the dataset, and it's the
part users are most likely to look for. The brand file carries **34 Canon-branded
RF/RF-S lenses against a real lineup of ~55** — roughly **62% coverage** — while
third-party coverage was expanded twice in the same period. The omissions are not
obscure: the entire super-telephoto L line (400/2.8, 600/4, 800/5.6, 1200/8), the
RF 28-70mm f/2 L, the RF 100-300mm f/2.8 L, the RF 200-800mm, all three newer
VCM primes, and the RF 600mm f/11 — whose direct sibling, the RF 800mm f/11, *is*
present. A comparison tool that offers the 800mm f/11 but not the 600mm f/11
looks broken rather than incomplete.

Nine of the 34 lenses already present carry `priceIncomplete: true` (USD-only),
and three of those also lack a `productUrl`.

Separately, this gap existed for months without detection. `refresh-camera-data`
looks for *newly released* gear; nothing ever asked "is the existing lineup fully
represented?" That blind spot is the reason this proposal also changes a skill.

## What Changes

- **Enter the 21 missing Canon RF/RF-S lenses**, in batches by family, each
  sourced from Canon's own product pages and recorded in the citation ledger.
- **Verify one suspected naming error**: the dataset's `RF 85mm f/1.4 L IS USM`
  does not match Canon's product name (`RF 85mm f/1.4 L VCM`). Confirm and correct.
- **Fill the 9 `priceIncomplete` first-party lenses** with regional RRPs, and
  backfill the 3 missing `productUrl`s.
- **Add a lineup-completeness cross-check to `refresh-camera-data`** so a missing
  *existing* product is caught, not just a missing new release. This is the
  systemic fix — without it the same drift recurs on every brand.
- **Introduce `specSources`** — per-field provenance on lens and camera entries,
  so references can eventually be surfaced in the UI (owner's stated goal). Every
  lens entered by this change populates it; existing entries are backfilled
  opportunistically, not retroactively in bulk.

## Capabilities

### New Capabilities
- `spec-provenance`: per-field source attribution for camera and lens specs,
  recorded in the data and exposed for cross-checking.

### Modified Capabilities
<!-- None — the lens data itself has no capability spec. -->

## Impact

- `canon/data.js` — 21 new `LENSES` entries, dropdown group additions, 9 price
  fills, 3 `productUrl` backfills, 1 name correction.
- `tests/helpers/schema.js` — optional `specSources` validation.
- `tests/data/completeness.test.js` — image-gap allowlist entries for any new
  lens without a freely-licensed photo.
- `.claude/skills/refresh-camera-data/SKILL.md` — new completeness cross-check
  step; source-recording requirement.
- `.claude/skills/add-thirdparty-lenses/SKILL.md` — source-recording requirement,
  kept consistent with the above.
- Generated artifacts (`index.html`, `canon/index.html`, vs-pages) regenerate
  from the lens-count change.
- No engine changes: `Canon` already has a `MANUFACTURER_COLORS` entry, and the
  super-telephotos introduce no new spec fields.
