## Why

`canon/data.js` currently ships 29 third-party lenses (Sigma 10, TTArtisan 5,
Laowa 5, Tamron 3, 7Artisans 3, Yongnuo 2, Viltrox 1), the result of the
archived `2026-08-05-expand-thirdparty-lenses-canon` change (PR #22, which
took it from 14 → 29). That change's own research already answered the
scope-level questions for Canon RF and is carried forward here rather than
re-derived: Canon only opened RF-S AF licensing to Sigma/Tamron in 2024 and
still has no third-party full-frame RF AF; Viltrox's RF-S AF primes were
pulled after a 2022 cease-and-desist and only the 85mm f/1.8 RF II AF lens
ships natively; Meike routes third-party AF around Canon via EF-mount, not
native RF, so it's out of scope; no native RF Samyang or Zeiss exists. Those
facts need re-verifying (a licensing or C&D situation can change), not
re-researching from zero.

What that change explicitly left on the table:
- **TTArtisan**: 14 RF SKUs identified, only 5 entered — the other 9 were
  blocked because TTArtisan's own site publishes no diameter/length and
  quotes weight as a range spanning every mount, and the aggregator route
  (lensfinder.org) that filled some gaps has ~30%-wrong mount attribution.
  **A later Fujifilm pass in this repo found a real unlock for this exact
  problem**: ttartisan.store (not ttartisan.com) renders per-mount dimensions
  as an **image diagram** next to a "Size" table row, invisible to WebFetch's
  text extraction but readable via Chrome browser automation
  (`document.querySelectorAll('td')` → find the Size row → read the
  adjacent `<img>`). Worth applying here before re-deferring the same 9.
- **7Artisans**: ~42 RF-capable SKUs exist per their own `products.json`, only
  3 entered. Same "no published dimensions" blocker, same potential unlock.
- Both makers' entered/deferred lists are two-plus months old — re-scope
  against current SKUs, not just the old deferred list.
- **Sigma/Tamron/Viltrox/Yongnuo**: not re-checked since Aug 5 — worth a fresh
  pass for anything shipped since.

## What Changes

- Re-verify the four scope facts above against each maker's current site.
- **TTArtisan + 7Artisans**: retry the deferred lenses using the
  ttartisan.store/7artisans.store image-diagram dimension technique; enter
  whatever becomes sourceable, re-defer (with an updated reason) what doesn't.
- **Sigma, Tamron, Viltrox, Yongnuo**: re-scope each maker's current RF/RF-S
  listing against what's already entered; add anything new.
- Wire any new `manufacturer` into `MANUFACTURER_COLORS`, group new lenses
  into `── <Maker> ──` `LENS_DROPDOWN_GROUPS`, source images and 7-currency
  prices per the skill's steps 5-6.

## Storage decision (unchanged, denormalized)

Same convention as the other 4 brands: each lens is a self-contained
Canon-mount entry (weight/length/price/`asin`/`productUrl`/`imageUrl` all
RF-specific), no shared catalog, no `mount` field.
