# Add Lens Comparison Mode — Plan

## Context
The site currently compares Fujifilm cameras only. The user wants a second mode — **Lens Comparison** — that lets users compare X-mount lenses from Fujifilm (XF/XC) and third-party manufacturers (Sigma, Tamron, Viltrox, TTArtisan, 7Artisans, Samyang, Voigtländer). Both modes should share the same reusable UI layout. Users switch between modes via a toggle in the header.

---

## File to Modify
`/Users/enricosusatyo/Projects/fuji-compare-tool/index.html`

---

## Architecture: Making the Engine Generic

The key insight is that the rendering engine (`renderAll`, `renderSlot`, `renderTable`, `computeWinners`, `formatVal`) is already data-driven via `SPEC_SECTIONS`. The refactor makes it fully mode-agnostic by introducing a `MODE_CONFIG` lookup keyed by `currentMode`.

### New state variables (replace line 1257-1259)
```js
let currentMode = 'cameras';  // 'cameras' | 'lenses'
let selectedCameraIds = ['x-s20', 'x-t50', 'x100vi'];
let selectedLensIds = ['xf-23mm-f14-lm-wr', 'xf-35mm-f14', 'sigma-56mm-f14'];
let currentCurrency = 'AUD';
let numSlots = 3;
```

### `MODE_CONFIG` object
```js
const MODE_CONFIG = {
  cameras: {
    items: CAMERAS,
    dropdownGroups: DROPDOWN_GROUPS,
    specSections: SPEC_SECTIONS,
    selectedIds: () => selectedCameraIds,
    setSelectedId: (i, v) => { selectedCameraIds[i] = v; },
    heroEyebrow: 'X Series & GFX',
    heroTitle: '<span>Fujifilm</span> Camera Comparison',
    heroSubtitle: 'Compare up to 3 cameras side-by-side across all generations',
    headerTitle: 'Camera Compare',
    supportsCurrency: true,
  },
  lenses: {
    items: LENSES,
    dropdownGroups: LENS_DROPDOWN_GROUPS,
    specSections: LENS_SPEC_SECTIONS,
    selectedIds: () => selectedLensIds,
    setSelectedId: (i, v) => { selectedLensIds[i] = v; },
    heroEyebrow: 'X Mount Lenses',
    heroTitle: '<span>Fujifilm</span> Lens Comparison',
    heroSubtitle: 'Compare X-mount lenses from Fujifilm, Sigma, Tamron, Viltrox & more',
    headerTitle: 'Lens Compare',
    supportsCurrency: false,  // USD-only for lenses
  },
};
function cfg() { return MODE_CONFIG[currentMode]; }
```

### Functions to genericize (7 call sites)
Each function replaces hardcoded `CAMERAS` / `SPEC_SECTIONS` / `DROPDOWN_GROUPS` / `selectedIds` with `cfg().items` / `cfg().specSections` / `cfg().dropdownGroups` / `cfg().selectedIds()`:

| Function | Line | Change |
|----------|------|--------|
| `buildSelectHTML()` | ~1281 | `DROPDOWN_GROUPS` → `cfg().dropdownGroups`, `CAMERAS[id]` → `cfg().items[id]` |
| `renderSlot()` | ~1302 | `CAMERAS[id]` → `cfg().items[id]`, price/link logic branches by mode |
| `computeWinners()` | ~1335 | `CAMERAS[id]` → `cfg().items[id]` |
| `renderTable()` | ~1363 | `SPEC_SECTIONS` → `cfg().specSections`, `CAMERAS[...]` → `cfg().items[...]` |
| `renderAll()` | ~1408 | Update hero/header text from `cfg()` |
| `attachSlotListeners()` | ~1426 | `selectedIds[idx]` → `cfg().setSelectedId(idx, val)` |
| `buildPlaceholder()` | ~1268 | Branch by mode for camera SVG vs lens SVG fallback |

---

## Mode Toggle UI

### HTML (inside `#site-header`, between brand and controls)
```html
<div class="mode-toggle" id="mode-toggle">
  <button class="mode-btn active" data-mode="cameras">Cameras</button>
  <button class="mode-btn" data-mode="lenses">Lenses</button>
</div>
```

### CSS (~20 lines)
```css
.mode-toggle {
  display: flex;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.15);
}
.mode-btn {
  padding: 5px 14px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.6);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
}
.mode-btn.active { background: var(--fuji-red); color: white; }
.mode-btn:hover:not(.active) { color: rgba(255,255,255,0.85); }
```

### JS mode switch handler
```js
document.getElementById('mode-toggle').addEventListener('click', e => {
  const btn = e.target.closest('.mode-btn');
  if (!btn || btn.dataset.mode === currentMode) return;
  currentMode = btn.dataset.mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // Update hero text
  document.querySelector('.hero-eyebrow').textContent = cfg().heroEyebrow;
  document.querySelector('.hero-title').innerHTML = cfg().heroTitle;
  document.querySelector('.hero-subtitle').textContent = cfg().heroSubtitle;
  document.querySelector('.header-title').textContent = cfg().headerTitle;
  // Show/hide currency selector
  document.querySelector('.header-controls').style.display = cfg().supportsCurrency ? '' : 'none';
  // URL hash for bookmarking
  history.replaceState(null, '', `#${currentMode}`);
  renderAll();
});
```

### URL hash support (on init)
```js
if (location.hash === '#lenses') {
  currentMode = 'lenses';
  // update toggle button active state
}
```

---

## Lens Data Structure

### `LENSES` object (~50 lenses, keyed by slug)
```js
'xf-23mm-f14-lm-wr': {
  name: 'XF 23mm f/1.4 R LM WR',
  manufacturer: 'Fujifilm',
  line: 'XF',
  type: 'Prime',            // 'Prime' | 'Zoom'
  focalLength: 23,           // mm (primes)
  focalLengthMin: null,      // mm (zooms)
  focalLengthMax: null,      // mm (zooms)
  focalLengthEquiv: '35mm',  // 35mm equivalent
  maxAperture: 1.4,
  minAperture: 16,
  weight: 375,               // grams
  length: 77.8,              // mm
  diameter: 67,              // mm
  filterThread: 58,          // mm or null
  minFocusDist: 19,          // cm
  maxMagnification: 0.1,
  elements: 15,
  groups: 10,
  blades: 9,
  afType: 'Linear Motor',   // 'Linear Motor' | 'Stepping Motor' | 'DC Motor' | 'Manual'
  weatherSealed: true,
  ois: false,
  oisStops: null,
  year: 2022,
  discontinued: false,
  priceUSD: 899,
  buyUrl: 'https://www.bhphotovideo.com/...',
  imageUrl: 'https://fujifilm-x.b-cdn.net/...',
  productUrl: 'https://www.fujifilm-x.com/global/products/lenses/xf23mmf14-r-lm-wr/',
}
```

### `LENS_DROPDOWN_GROUPS` (organized by manufacturer)
```
- Fujifilm XF Primes (~13 lenses)
- Fujifilm XF Zooms (~8 lenses)
- Fujifilm XC (~3 lenses)
- Sigma (~7 lenses)
- Tamron (~4 lenses)
- Viltrox (~6 lenses)
- Other: TTArtisan, 7Artisans, Samyang, Voigtländer (~6 lenses)
```

### `LENS_SPEC_SECTIONS` (4 sections)

1. **Overview** — Manufacturer, Type (Prime/Zoom), Year, Status
2. **Optical Design** — Focal Length, Focal Length (35mm equiv), Max Aperture, Min Aperture, Elements, Groups, Diaphragm Blades
3. **Focus & Stabilization** — Min Focus Distance, Max Magnification, AF Motor Type, OIS, OIS Stops
4. **Physical & Price** — Weight, Length, Diameter, Filter Thread, Weather Sealed, Price (USD), Buy Link

---

## Lens Placeholder SVG

Use manufacturer-based color coding (similar to series colors for cameras):
```js
const MANUFACTURER_COLORS = {
  'Fujifilm':     { bg: '#1a2a1a', text: '#80c080' },
  'Sigma':        { bg: '#1a1a2a', text: '#8080c0' },
  'Tamron':       { bg: '#2a1a1a', text: '#c08080' },
  'Viltrox':      { bg: '#2a2a1a', text: '#c0c080' },
  'TTArtisan':    { bg: '#1a2a2a', text: '#80c0c0' },
  'Samyang':      { bg: '#2a1a2a', text: '#c080c0' },
  'Voigtländer':  { bg: '#252518', text: '#c0b880' },
  '7Artisans':    { bg: '#1e2a20', text: '#90c8a0' },
};
```

Lens SVG fallback: a simple lens barrel icon (cylinder + front element circle).

---

## Implementation Steps

### Step 1: Genericize the rendering engine
- Add `currentMode`, rename `selectedIds` → `selectedCameraIds` + `selectedLensIds`
- Add `MODE_CONFIG` (cameras-only initially), `cfg()` helper
- Replace all 7 hardcoded references in render functions with `cfg().*` accessors
- **Verify camera mode works identically before proceeding**

### Step 2: Add mode toggle UI
- HTML toggle buttons in site header
- CSS for `.mode-toggle` / `.mode-btn`
- JS click handler: switch `currentMode`, update hero/header text, show/hide currency, `renderAll()`
- URL hash support (`#cameras` / `#lenses`)

### Step 3: Add lens data (~700-900 lines)
- `LENSES` object with ~50 lens entries (all specs researched via web)
- `LENS_ORDER` array
- `LENS_DROPDOWN_GROUPS` by manufacturer
- Need to web-search for exact specs (weight, dimensions, filter size, min focus, magnification, elements/groups, blades, price, buy URLs, image URLs) for each lens

### Step 4: Add lens spec sections & config
- `LENS_SPEC_SECTIONS` (4 sections as described above)
- `MANUFACTURER_COLORS` for placeholder SVG
- `buildLensPlaceholder()` with lens barrel SVG
- Complete `MODE_CONFIG.lenses` entry

### Step 5: Lens slot rendering
- `renderSlot()`: For lenses, show USD price directly (no currency selector), show "Buy" link → `buyUrl`
- Fetch product images from manufacturer websites for `imageUrl` fields

### Step 6: QA & verification
- Preview both modes, verify mode switching preserves state
- Check responsive behavior (2/3 columns) in both modes
- Verify winner highlighting works for lens specs
- Commit and push

---

## Estimated Scope
- **~900-1100 new lines** (dominated by ~700-900 lines of lens data)
- **~30-40 modified lines** (genericizing render functions)
- **~100 lines** of new mode-switching logic, CSS, config
- No breaking changes to existing camera mode

---

## Lenses to Include (~50 total)

### Fujifilm XF Primes (13)
XF 8mm f/3.5 R WR, XF 14mm f/2.8 R, XF 16mm f/1.4 R WR, XF 18mm f/1.4 R LM WR, XF 23mm f/1.4 R LM WR, XF 23mm f/2 R WR, XF 27mm f/2.8 R WR, XF 33mm f/1.4 R LM WR, XF 35mm f/1.4 R, XF 35mm f/2 R WR, XF 50mm f/2 R WR, XF 56mm f/1.2 R WR, XF 90mm f/2 R LM WR

### Fujifilm XF Zooms (8)
XF 10-24mm f/4 R OIS WR, XF 16-55mm f/2.8 R LM WR II, XF 18-55mm f/2.8-4 R LM OIS, XF 50-140mm f/2.8 R LM OIS WR, XF 55-200mm f/3.5-4.8 R LM OIS, XF 70-300mm f/4-5.6 R LM OIS WR, XF 100-400mm f/4.5-5.6 R LM OIS WR, XF 150-600mm f/5.6-8 R LM OIS WR

### Fujifilm XC (3)
XC 15-45mm f/3.5-5.6 OIS PZ, XC 16-50mm f/3.5-5.6 OIS, XC 35mm f/2

### Sigma (7)
16mm f/1.4 DC DN, 23mm f/1.4 DC DN, 30mm f/1.4 DC DN, 56mm f/1.4 DC DN, 10-18mm f/2.8 DC DN, 18-50mm f/2.8 DC DN, 100-400mm f/5-6.3 DG DN OS

### Tamron (4)
11-20mm f/2.8 Di III-A RXD, 17-70mm f/2.8 Di III-A VC RXD, 18-300mm f/3.5-6.3 Di III-A VC VXD, 150-500mm f/5-6.7 Di III VC VXD

### Viltrox (6)
AF 13mm f/1.4, AF 23mm f/1.4, AF 33mm f/1.4, AF 56mm f/1.4, AF 85mm f/1.8, AF 75mm f/1.2 PRO

### Other (6)
TTArtisan AF 27mm f/2.8, TTArtisan AF 35mm f/1.8, 7Artisans AF 35mm f/1.4, Samyang AF 12mm f/2.0, Voigtländer NOKTON 35mm f/0.9, Voigtländer ULTRON 27mm f/2

---

## Verification
1. `preview_start "Fuji Compare"` → screenshot camera mode (should be unchanged)
2. Click "Lenses" toggle → screenshot lens mode
3. Switch back to "Cameras" → verify state preserved
4. Test responsive (2-column mobile) in lens mode
5. Test section collapse, winner highlighting, dropdown duplicate prevention in lens mode
6. Test URL hash: load `#lenses` directly
7. Commit and push to GitHub
