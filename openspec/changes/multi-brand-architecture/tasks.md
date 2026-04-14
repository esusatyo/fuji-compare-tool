## 1. Phase 1 — Extract Engine

- [ ] 1.1 Replace hardcoded `--fuji-red` CSS variable with `--accent-color` throughout the stylesheet; keep `--fuji-dark` for the header background (it's structural, not brand)
- [ ] 1.2 Extract all CSS and rendering/state JS from `index.html` into `engine.js`; engine reads `BRAND_CONFIG` at init and applies `accentColor` to `--accent-color` on `<html>`
- [ ] 1.3 Add `brand` field to Fujifilm-specific spec sections in `SPEC_SECTIONS` (`film-simulations`: `brand: 'fujifilm'`); update `renderTable()` to skip sections whose `brand` is not in `BRAND_CONFIG.brandSections`
- [ ] 1.4 Update Buy button rendering in engine: if `item.buyUrl` is `null` or absent, render button as `disabled` with muted style instead of hiding it
- [ ] 1.5 Add brand switcher control to the site header in the engine template; reads registered brands from a `REGISTERED_BRANDS` array (defined in each brand's shell) and navigates to `../<brand>/`

## 2. Phase 1 — Fujifilm Brand Files

- [ ] 2.1 Create `fujifilm/` directory; move all Fujifilm camera + lens data from `index.html` into `fujifilm/data.js`; add `BRAND_CONFIG` constant at the top of the file
- [ ] 2.2 Create `fujifilm/index.html` as a thin shell: includes `../engine.js` and `./data.js`, defines `REGISTERED_BRANDS`, triggers engine init
- [ ] 2.3 Smoke test `fujifilm/index.html` — verify cameras mode, lenses mode, currency switcher, section collapse, winner highlighting, and mobile layout all work identically to the original `index.html`

## 3. Phase 1 — Brand Picker Root

- [ ] 3.1 Create root `index.html` as a brand picker page: renders brand cards (logo + name) for each registered brand; includes a short redirect script that checks `localStorage['brand']` and forwards to that brand's directory (defaulting to `fujifilm/`), preserving any hash fragment
- [ ] 3.2 Write `localStorage['brand']` in `engine.js` whenever a brand page loads, so the root redirect remembers the last-visited brand

## 4. Phase 2 — Canon Spec Sections

- [ ] 4.1 Add two Canon-specific spec sections to `SPEC_SECTIONS` in `engine.js`: `dpaf` (Dual Pixel AF point count, `brand: 'canon'`) and `clog` (C-Log tiers supported, `brand: 'canon'`)

## 5. Phase 2 — Canon Camera Data

- [ ] 5.1 Research and author Canon EOS R interchangeable-lens bodies (EOS R, RP, R3, R5, R5 II, R5 C, R6, R6 II, R7, R8, R10, R50, R50 II, R100, R1); cross-check specs against Wikipedia and Canon official product pages
- [ ] 5.2 Add `dpafPoints` and `clogTiers` fields to each Canon camera object where applicable
- [ ] 5.3 Add `buyUrl` to each Canon camera from Amazon AU / B&H / KEH; set `null` if no listing found

## 6. Phase 2 — Canon Lens Data

- [ ] 6.1 Research and author Canon RF prime lenses; cross-check specs (focal length, aperture, weight, dimensions, AF type, weather sealing, OIS) against Wikipedia and Canon official pages; add `buyUrl` or `null`
- [ ] 6.2 Research and author Canon RF zoom lenses using the same process

## 7. Phase 2 — Canon Brand Files

- [ ] 7.1 Create `canon/data.js` with `BRAND_CONFIG` (name, accentColor `#cc0000`, logoText `Canon`, logoAccent ``, families `['EOS R System']`, brandSections `['dpaf', 'clog']`), plus all Canon camera and lens data
- [ ] 7.2 Create `canon/index.html` shell (mirrors `fujifilm/index.html`, points to `../engine.js` and `./data.js`)
- [ ] 7.3 Smoke test `canon/index.html` — verify DPAF and C-Log sections appear, Film Simulations section is absent, Buy buttons disabled where `buyUrl` is `null`, brand switcher navigates to Fujifilm page

## 8. Final Validation

- [ ] 8.1 Verify root `index.html` brand picker: first visit redirects to Fujifilm, returning visit with stored Canon preference redirects to Canon, hash fragment preserved
- [ ] 8.2 Verify brand switcher in header: switching from Fujifilm → Canon and back works; `localStorage['brand']` updates correctly
- [ ] 8.3 Remove the original root `index.html` Fujifilm-specific content (or replace it with the brand picker) and confirm no broken links
