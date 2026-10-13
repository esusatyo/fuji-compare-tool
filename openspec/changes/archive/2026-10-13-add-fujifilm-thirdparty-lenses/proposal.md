## Why

Fujifilm's X-mount third-party set skips one autofocus maker entirely and lists
only part of two makers' lineups:

- **SG-image** — a budget Chinese maker with AF X-mount primes (AF 25mm f/1.8,
  AF 55mm f/1.8 STM). It isn't on the site at all, and it competes directly
  with the TTArtisan/Viltrox/Meike AF primes that are.
- **Voigtländer** — only 2 X-mount entries (NOKTON 35mm f/0.9, ULTRON 27mm f/2),
  though Cosina makes more X-mount lenses.
- **Laowa** — 5 X-mount entries; Venus Optics sells more X-mount designs.

## What Changes

- Add every current SG-image X-mount lens that can be sourced, with a new
  `── SG-image ──` dropdown group and a `MANUFACTURER_COLORS` entry.
- Fill out the Voigtländer and Laowa X-mount lineups, inside the existing
  `── Voigtländer ──` / `── Laowa ──` groups.
- Scope follows the `add-thirdparty-lenses` skill: no cine, anamorphic or
  adapter-only designs, and no full-frame-only designs without an X version.
  A lens whose required specs can't be sourced is skipped and logged in
  `PROGRESS.md`.

## Impact

- `fujifilm/data.js` (`LENSES`, `LENS_DROPDOWN_GROUPS`), `engine.js`
  (`MANUFACTURER_COLORS`, one new key), `scripts/price-overrides/fujifilm.json`
  if confirmed regional RRPs are found, regenerated SEO pages.
- No engine logic changes.
