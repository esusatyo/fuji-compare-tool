## Why

After PR #78 merged (2026-11-07), a plausibility scan of the whole catalogue
(density, filter vs barrel, aperture order, minimum focus distance vs
magnification, year vs mount launch, regional/USD price ratios, citation
coverage) found errors that are live on the site, and the PR #78 review left
a list of doubts for the next sweep. The owner asked to fix all of them in
one follow-up PR, double-checking each value and storing the source of every
correction.

- **Eight more minimum focus distances stored 10x too large**, all first-party
  Nikon/Sony zooms and macros from the August refreshes (#25, #27, #40). The
  PR #78 guard (>= 150 cm and > 3.5x the longest focal length) let them
  through because they sit at 1.6x-3.4x. Each stored magnification is only
  possible at one tenth of the stored distance.
- **Prices that contradict each other**: Nikon Yongnuo 35mm f/1.8 DA (USD 135
  vs AUD 499), Nikon Samyang 14mm f/2.8 (USD 429 vs EUR 799 / SGD 999),
  Fujifilm 7Artisans 27mm / 55mm f/1.4 / 18mm f/6.3 II (EUR about 2x USD), and
  42 current items whose CAD price is under 1.1x USD.
- **Release years**: the Fujifilm Samyang 8mm and 14mm are dated 2011, before
  X-mount existed; 40 Samyang manual-focus entries are dated 2020 from a store
  listing; 18 other years are estimates; 88 come from store listing dates.
- **Cross-mount disagreements** where the same lens has different specs on
  different mounts (magnification, blades, smallest aperture, weather
  sealing, filter size), plus the Fujifilm Samyang 100mm macro and Tamron
  150-500 entries and inconsistent `afType` labels for the same motor.
- **Standing doubts**: Sony FX5 `maxBurst` placeholder, Panasonic S1R photo
  that may show an S1/S1H, Thypoch M diameters (front diameter, not the
  widest point), Fujifilm TTArtisan 35mm f/0.95 dimensions.

## What Changes

- Each value is re-read from the maker (or, where the maker does not publish
  it, a reputable dealer or launch news) and the source is stored on the entry
  (`specSources` / `priceSource` / `imageSource`, with a note saying what was
  corrected from what).
- `tests/helpers/schema.js`: tighten the minimum-focus-distance guard to
  >= 150 cm and > 1.4x the longest focal length (the largest real ratio in the
  catalogue is 1.11, Leica APO-Telyt-M 135mm at 150 cm), with tests.
- Regional prices follow the owner's rule (2026-10-24): a confirmed local
  price is stored and cited; otherwise `null` + `priceIncomplete: true`, no
  ratio estimates. Current cameras keep all seven currencies.
- Where a value cannot be confirmed either way, it stays as it is and is
  listed in PROGRESS.md and the PR description instead of being guessed.

**Out of scope:** citing the ~660 lenses and ~125 cameras that have no
`specSources` at all (a coverage gap, not a known error; separate pass), the
ASIN backfill, and the whole-catalogue multi-source price check.
