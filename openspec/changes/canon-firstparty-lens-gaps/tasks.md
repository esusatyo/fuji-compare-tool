# Tasks — Canon first-party lens gaps

Work in batches by family. After each batch: `npm run test:data`, then commit the
green checkpoint. Record every source in `research/sources.md` **as you go** —
not at the end, when the tab is closed and the figure is already in the file.

## 1. Provenance groundwork (do first — it changes how every later batch is entered)

- [ ] 1.1 Add optional `specSources` to `validateLens`/`validateCamera` in
      `tests/helpers/schema.js`: an object keyed by field name → source URL, all
      values `https`. Optional, so the 424 existing lenses stay valid.
- [ ] 1.2 Decide and document the granularity rule in `CLAUDE.md`: one entry per
      *field group* actually sourced separately (e.g. `dimensions`, `weight`,
      `price`, `year`), not one per scalar — otherwise it's unmaintainable.
- [ ] 1.3 Add a test asserting every `specSources` value parses as an `https` URL
      and that no key names a field absent from the entry.

## 2. Super-telephoto L primes (4) — 2/4 entered, 2026-08-08

- [x] 2.1 `RF 400mm f/2.8 L IS USM` — entered as `rf-400mm-f28-l-is-usm`
- [x] 2.2 `RF 600mm f/4 L IS USM` — entered as `rf-600mm-f4-l-is-usm`
- [ ] 2.3 `RF 800mm f/5.6 L IS USM` — **blocked on dimensions only**; every other
      field sourced and recorded in `research/sources.md`. `canon.com.au`'s
      dimensions row is templated/unreliable for this lens (see sources.md) —
      needs Canon USA (currently IP-blocked) or a T2 review with real measurements.
- [ ] 2.4 `RF 1200mm f/8 L IS USM` — same blocker, same status; specs recorded.
- [ ] 2.5 Dropdown ids + `npm run test:data` + commit

## 3. The f/11 sibling and remaining primes (4) — 2/4 entered, 2026-08-08

- [x] 3.1 `RF 600mm f/11 IS STM` — entered as `rf-600mm-f11-is-stm`. While
      building it, three likely errors surfaced in the existing
      `rf-800mm-f11-is-stm` sibling (groups, length, afType) — see
      "Existing shipped data" in `research/sources.md`. Not fixed here.
- [ ] 3.2 `RF 24mm f/1.4 L VCM` — blocked on dimensions only, same as group 2.
- [ ] 3.3 `RF 35mm f/1.4 L VCM` — blocked on dimensions only.
- [ ] 3.4 `RF 50mm f/1.4 L VCM` — blocked on dimensions only.
- [x] 3.5 `RF 85mm f/1.2 L USM DS` — entered as `rf-85mm-f12-l-usm-ds`. Confirmed
      a distinct SKU (Canon AU lists it separately from the non-DS `rf-85mm-f12-l-usm`
      already in the dataset); dimensions/weight/elements/groups/blades all match
      the non-DS twin exactly, consistent with DS being a coating-only variant.
- [x] 3.6 Dropdown ids + test + commit — done for the 4 entered lenses.

## 4. Specialty / VR fisheyes (3)

- [ ] 4.1 `RF 5.2mm f/2.8 L Dual Fisheye`
- [ ] 4.2 `RF-S 3.9mm f/3.5 Dual Fisheye`
- [ ] 4.3 `RF-S 7.8mm f/4 Dual STM VR`
- [ ] 4.4 Decide how a dual-fisheye's `focalLength`/`focalLengthEquiv` should
      read — these are stereoscopic pairs, and a naive 1.6× on the RF-S ones is
      misleading. Document the choice in `CLAUDE.md` if it sets a precedent.
- [ ] 4.5 Dropdown ids + test + commit

## 5. Zooms (10)

- [ ] 5.1 `RF 10-20mm f/4 L IS STM`
- [ ] 5.2 `RF 15-30mm f/4.5-6.3 IS STM`
- [ ] 5.3 `RF 28-70mm f/2 L USM`
- [ ] 5.4 `RF 28-70mm f/2.8 IS STM`
- [ ] 5.5 `RF 24-105mm f/2.8 L IS USM Z`
- [ ] 5.6 `RF 24-240mm f/4-6.3 IS USM`
- [ ] 5.7 `RF 70-200mm f/2.8 L IS USM Z` — distinct from the non-Z already present
- [ ] 5.8 `RF 100-300mm f/2.8 L IS USM`
- [ ] 5.9 `RF 200-800mm f/6.3-9 IS USM`
- [ ] 5.10 Dropdown ids + test + commit

## 6. Corrections and fills on existing entries

- [ ] 6.1 Verify `RF 85mm f/1.4 L IS USM` against Canon — the product appears to
      be the **RF 85mm f/1.4 L VCM**. Correct the name (and any spec that moved
      with it) if confirmed.
- [ ] 6.2 Fill regional prices for the 9 `priceIncomplete` first-party lenses:
      `rf-14mm-f14-l-vcm`, `rf-20mm-f14-l-vcm`, `rf-45mm-f12-stm`,
      `rf-85mm-f14-l-vcm`, `rf-20-50mm-f4-l-is-usm-pz`,
      `rf-7-14mm-f28-35-l-fisheye-stm`, `rf-16-28mm-f28-is-stm`,
      `rf-75-300mm-f4-56`, `rfs-14-30mm-f4-63-is-stm-pz`. Remove the flag only
      where a real RRP is found — do not let `compute-prices.js` ratios silently
      become "confirmed" prices.
- [ ] 6.3 Backfill `productUrl` for `rf-45mm-f12-stm`,
      `rf-20-50mm-f4-l-is-usm-pz`, `rf-16-28mm-f28-is-stm`.

## 7. The systemic fix

- [ ] 7.1 Add a **lineup-completeness cross-check** step to
      `.claude/skills/refresh-camera-data/SKILL.md`: for each brand, enumerate the
      maker's full current lens/body lineup and diff it against the dataset,
      reporting anything present upstream but absent locally. This is what would
      have caught these 21.
- [ ] 7.2 Add the source-recording requirement to that skill and to
      `add-thirdparty-lenses`, pointing at `specSources` and the ledger.
- [ ] 7.3 Note in both skills that Wikipedia's `Category:Canon RF lenses` is
      near-empty and useless for enumeration; the lineup table inside the
      `Canon RF lens mount` article is the usable source.

## 8. Close out

- [ ] 8.1 `node scripts/compute-prices.js canon lenses`
- [ ] 8.2 `node scripts/generate-seo.js`
- [ ] 8.3 Full `npm test` green
- [ ] 8.4 Run the same completeness diff for the other four brands and record the
      counts — do **not** fix them here, but say how big the problem is.
