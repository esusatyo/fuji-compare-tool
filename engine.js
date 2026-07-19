// ─────────────────────────────────────────────
// CAMERA COMPARE ENGINE
// Reads brand datasets from the window.BRAND_DATA registry, which each
// <brand>/data.js populates before this file executes. Brand pages
// register exactly one brand. compare/index.html registers all brands
// and declares window.COMPARE_CONFIG, which switches the engine into
// cross-brand mode: cameras only, brand-namespaced item ids
// ('fujifilm:x-t5'), and up to 4 slots. Every page — brand or compare —
// offers a "Cameras to compare" dropdown (2..MAX_SLOTS); it's hidden
// below the mobile breakpoint, where the viewport clamps to 2 anyway.
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// BRAND DATA RESOLUTION
// ─────────────────────────────────────────────
const REGISTRY = window.BRAND_DATA || {};
const COMPARE_CONFIG = window.COMPARE_CONFIG || null;
const IS_COMPARE = !!COMPARE_CONFIG;
const ACTIVE_BRAND = IS_COMPARE ? null : REGISTRY[Object.keys(REGISTRY)[0]];
const MIN_SLOTS = 2;
const MAX_SLOTS = IS_COMPARE ? 4 : 3;

// Cross-brand ids are '<brand>:<slug>'; brand-page ids are bare slugs
// owned by the page's brand. Every per-item lookup that depends on the
// owning brand (series colors, buy-link brand name, section matching)
// goes through these two helpers.
function brandOf(id) {
  return IS_COMPARE ? id.split(':')[0] : BRAND_CONFIG.slug;
}
function brandDataOf(id) {
  return (IS_COMPARE ? REGISTRY[brandOf(id)] : ACTIVE_BRAND) || null;
}

function mergedCameras() {
  const merged = {};
  for (const [slug, data] of Object.entries(REGISTRY)) {
    for (const [id, cam] of Object.entries(data.CAMERAS)) merged[`${slug}:${id}`] = cam;
  }
  return merged;
}

// One dropdown group per brand, cameras in that brand's own order.
function compareDropdownGroups() {
  const order = (Object.values(REGISTRY)[0].REGISTERED_BRANDS || [])
    .filter(b => REGISTRY[b.slug]);
  return order.map(b => ({
    label: b.name,
    ids: REGISTRY[b.slug].CAMERA_ORDER.map(s => `${b.slug}:${s}`),
  }));
}

// Synthetic config so the single-brand render paths need no branching.
// slug is null on purpose: the compare page is not a brand and must
// never be persisted as one.
function compareBrandConfig() {
  const c = COMPARE_CONFIG;
  return {
    name:        'All Brands',
    slug:        null,
    families:    [],
    brandSections: [],
    cameras: {
      heroEyebrow:  c.heroEyebrow || 'All brands',
      heroTitle:    c.heroTitle || 'Cross-Brand Camera Comparison',
      heroSubtitle: c.heroSubtitle || '',
      headerTitle:  c.headerTitle || 'All Brands',
      defaultSelected: c.defaultSelected.slice(),
    },
    lenses: { heroEyebrow: '', heroTitle: '', heroSubtitle: '', headerTitle: '', defaultSelected: [] },
    footerLinks: c.footerLinks || [],
  };
}

const BRAND_CONFIG = IS_COMPARE ? compareBrandConfig() : ACTIVE_BRAND.BRAND_CONFIG;
const CAMERAS = IS_COMPARE ? mergedCameras() : ACTIVE_BRAND.CAMERAS;
const DROPDOWN_GROUPS = IS_COMPARE ? compareDropdownGroups() : ACTIVE_BRAND.DROPDOWN_GROUPS;
const LENSES = IS_COMPARE ? {} : ACTIVE_BRAND.LENSES;
const LENS_DROPDOWN_GROUPS = IS_COMPARE ? [] : ACTIVE_BRAND.LENS_DROPDOWN_GROUPS;
const REGISTERED_BRANDS = (Object.values(REGISTRY)[0] || {}).REGISTERED_BRANDS;

// ─────────────────────────────────────────────
// CURRENCY CONFIG
// ─────────────────────────────────────────────
const CURRENCY = {
  USD: { symbol: '$',   locale: 'en-US', code: 'USD' },
  AUD: { symbol: 'A$',  locale: 'en-AU', code: 'AUD' },
  EUR: { symbol: '€',   locale: 'de-DE', code: 'EUR' },
  GBP: { symbol: '£',   locale: 'en-GB', code: 'GBP' },
  JPY: { symbol: '¥',   locale: 'ja-JP', code: 'JPY' },
  CAD: { symbol: 'C$',  locale: 'en-CA', code: 'CAD' },
  SGD: { symbol: 'S$',  locale: 'en-SG', code: 'SGD' },
};

function formatPrice(amount, cur) {
  if (!amount) return null;
  const c = CURRENCY[cur];
  if (cur === 'JPY') return c.symbol + amount.toLocaleString('ja-JP');
  return c.symbol + amount.toLocaleString('en-US');
}

// ─────────────────────────────────────────────
// AMAZON BUY LINKS (currency-aware, generated at render time)
//
// Each currency maps to its regional Amazon marketplace. When an item
// has an `asin`, the buy button links straight to that product page on
// the selected marketplace (/dp/<asin>) so the shopper lands on the real
// listing with live pricing. Items without an asin fall back to a product
// *search* on that marketplace (brand + model name), which always resolves
// — so links never break while ASINs are being filled in. EUR uses
// amazon.de (largest Eurozone marketplace); anything unmapped falls back
// to amazon.com.
// ─────────────────────────────────────────────
const AMAZON_MARKETPLACE = {
  USD: 'www.amazon.com',
  AUD: 'www.amazon.com.au',
  EUR: 'www.amazon.de',
  GBP: 'www.amazon.co.uk',
  JPY: 'www.amazon.co.jp',
  CAD: 'www.amazon.ca',
  SGD: 'www.amazon.sg',
};

function brandNameOf(id) {
  const data = brandDataOf(id);
  return (data && data.BRAND_CONFIG.name) || BRAND_CONFIG.name;
}

function amazonBuyUrl(item, cur = currentCurrency, brandName = BRAND_CONFIG.name) {
  const domain = AMAZON_MARKETPLACE[cur] || AMAZON_MARKETPLACE.USD;
  if (item.asin) return `https://${domain}/dp/${item.asin}`;
  const query = encodeURIComponent(`${brandName} ${item.name}`);
  return `https://${domain}/s?k=${query}`;
}

// ─────────────────────────────────────────────
// SERIES COLOR LOOKUP (from the item's owning brand)
// ─────────────────────────────────────────────
function seriesColor(id, series) {
  const colors = (brandDataOf(id) || {}).SERIES_COLORS;
  return (colors && colors[series]) || { bg: '#222', text: '#ccc' };
}

// ─────────────────────────────────────────────
// MANUFACTURER COLORS (for lens placeholder cards)
// Shared across brands — covers common third-party lens makers
// ─────────────────────────────────────────────
const MANUFACTURER_COLORS = {
  'Fujifilm':     { bg: '#1a2a1a', text: '#80c080' },
  'Canon':        { bg: '#1a0a0a', text: '#e08080' },
  'Sony':         { bg: '#1a1408', text: '#ffae66' },
  'Nikon':        { bg: '#1a1700', text: '#ffd54a' },
  'Panasonic':    { bg: '#0a1228', text: '#6fa8ff' },
  'Sigma':        { bg: '#1a1a2a', text: '#8080c0' },
  'Tamron':       { bg: '#2a1a1a', text: '#c08080' },
  'Viltrox':      { bg: '#2a2a1a', text: '#c0c080' },
  'TTArtisan':    { bg: '#1a2a2a', text: '#80c0c0' },
  'Samyang':      { bg: '#2a1a2a', text: '#c080c0' },
  'Voigtländer':  { bg: '#252518', text: '#c0b880' },
  '7Artisans':    { bg: '#1e2a20', text: '#90c8a0' },
  'Zeiss':        { bg: '#0f1a24', text: '#6ea8d0' },
  'Yongnuo':      { bg: '#101c26', text: '#7ab0d8' },
  'OM System':    { bg: '#0a1f26', text: '#5fd0c8' },
  'Leica':        { bg: '#2a0d0d', text: '#e06666' },
  'Laowa':        { bg: '#241014', text: '#d88a92' },
  'Sirui':        { bg: '#1c1426', text: '#a98ad8' },
  'Meike':        { bg: '#14220f', text: '#9cc878' },
};

// ─────────────────────────────────────────────
// SPEC SECTION DEFINITIONS
// Universal sections have no `brand` field.
// Brand-specific sections declare brand: '<slug>' and
// are only rendered when that slug is in BRAND_CONFIG.brandSections.
// ─────────────────────────────────────────────
const SPEC_SECTIONS = [
  {
    id: 'overview', label: 'Overview',
    specs: [
      { key: 'year',         label: 'Year Introduced',  type: 'text',    fn: c => c.year },
      { key: 'status',       label: 'Status',           type: 'text',    fn: c => c.discontinued ? '🔴 Discontinued' : '🟢 Current' },
      { key: 'series',       label: 'Camera Series',    type: 'text',    fn: c => c.series },
      { key: 'tagline',      label: 'Best For',         type: 'text',    fn: c => c.tagline },
    ]
  },
  {
    id: 'lens', label: 'Lens System',
    specs: [
      { key: 'lensType',     label: 'Lens Type',        type: 'text',    fn: c => c.lensType },
      { key: 'lensSpec',     label: 'Fixed Lens',       type: 'text',    fn: c => c.lensSpec || '—' },
    ]
  },
  {
    id: 'sensor', label: 'Sensor & Processor',
    specs: [
      { key: 'sensorMP',     label: 'Resolution',       type: 'number',  higherBetter: true,  fn: c => c.sensorMP,     fmt: v => v + ' MP' },
      { key: 'sensorType',   label: 'Sensor Type',      type: 'text',    fn: c => c.sensorType },
      { key: 'processor',    label: 'Processor',        type: 'text',    fn: c => c.processor },
    ]
  },
  {
    id: 'body', label: 'Body & Build',
    specs: [
      { key: 'dimensions',   label: 'Dimensions (W×H×D)', type: 'text', fn: c => `${c.width} × ${c.height} × ${c.depth} mm` },
      { key: 'weight',       label: 'Weight',           type: 'number',  lowerBetter: true,   fn: c => c.weight,       fmt: v => v + ' g' },
      { key: 'weatherSealed',label: 'Weather Sealed',   type: 'boolean', fn: c => c.weatherSealed },
    ]
  },
  {
    id: 'display', label: 'Display & Viewfinder',
    specs: [
      { key: 'lcdSize',      label: 'LCD Size',         type: 'text',    fn: c => c.lcdSize },
      { key: 'lcdDots',      label: 'LCD Resolution',   type: 'number',  higherBetter: true,  fn: c => c.lcdDots,      fmt: v => v ? v.toLocaleString() + 'K dots' : '—' },
      { key: 'lcdType',      label: 'LCD Type',         type: 'text',    fn: c => c.lcdType },
      { key: 'evfType',      label: 'Viewfinder',       type: 'text',    fn: c => c.evfType || 'None' },
      { key: 'evfDots',      label: 'EVF Resolution',   type: 'number',  higherBetter: true,  fn: c => c.evfDots,      fmt: v => v ? v + 'M dots' : '—' },
      { key: 'evfMag',       label: 'EVF Magnification',type: 'text',    fn: c => c.evfMag ? c.evfMag + '×' : '—' },
    ]
  },
  {
    id: 'af', label: 'Autofocus',
    specs: [
      { key: 'faceDetect',   label: 'Face / Eye Detection', type: 'boolean', fn: c => c.faceDetection },
      { key: 'subjectDet',   label: 'Subject Detection', type: 'text',   fn: c => c.subjectDetection || '—' },
      { key: 'maxBurst',     label: 'Max Burst Speed',   type: 'number', higherBetter: true,  fn: c => c.maxBurst,     fmt: v => v + ' fps' },
    ]
  },
  {
    id: 'stabilization', label: 'Image Stabilization',
    specs: [
      { key: 'ibis',         label: 'In-Body IS (IBIS)', type: 'boolean', fn: c => c.ibis },
      { key: 'ibisStops',    label: 'Compensation',      type: 'number', higherBetter: true,  fn: c => c.ibisStops,    fmt: v => v ? v + ' stops' : '—' },
    ]
  },
  {
    id: 'video', label: 'Video',
    specs: [
      { key: 'maxVideoRes',  label: 'Max Video Resolution', type: 'text', fn: c => c.maxVideoRes },
      { key: 'logVideo',     label: 'Log Video',         type: 'boolean', fn: c => c.logVideo },
    ]
  },
  {
    id: 'connectivity', label: 'Connectivity',
    specs: [
      { key: 'bluetooth',    label: 'Bluetooth',        type: 'text',   fn: c => c.bluetooth || '—' },
      { key: 'wifi',         label: 'Wi-Fi',            type: 'boolean', fn: c => c.wifi },
    ]
  },
  {
    id: 'storage', label: 'Storage',
    specs: [
      { key: 'cardSlots',    label: 'Memory Card Slots', type: 'text',  fn: c => c.cardSlots },
    ]
  },
  {
    id: 'power', label: 'Power',
    specs: [
      { key: 'batteryLife',  label: 'Battery Life (CIPA)', type: 'number', higherBetter: true, fn: c => c.batteryLife, fmt: v => v + ' shots' },
      { key: 'usbCharging',  label: 'USB Charging',      type: 'boolean', fn: c => c.usbCharging },
    ]
  },
  // ── Fujifilm-specific ──
  {
    id: 'film', label: 'Film Simulations',
    brand: 'fujifilm',
    specs: [
      { key: 'filmSims',     label: 'Film Simulation Modes', type: 'number', higherBetter: true, fn: c => c.filmSims, fmt: v => v + ' modes' },
      { key: 'xApp',         label: 'X App Compatible',  type: 'text',   fn: c => {
          if (c.xApp === true) return '✓ Yes (native)';
          if (c.xApp === 'firmware') return '✓ Yes (firmware)';
          return '—';
        }
      },
    ]
  },
  // ── Canon-specific ──
  {
    id: 'dpaf', label: 'Dual Pixel AF',
    brand: 'canon',
    specs: [
      { key: 'dpafPoints',   label: 'DPAF Points',       type: 'number', higherBetter: true, fn: c => c.dpafPoints, fmt: v => v ? v.toLocaleString() : '—' },
    ]
  },
  {
    id: 'clog', label: 'C-Log',
    brand: 'canon',
    specs: [
      { key: 'clogTiers',    label: 'C-Log Support',     type: 'text',   fn: c => c.clogTiers || '—' },
    ]
  },
  // ── Sony-specific ──
  {
    id: 'sony', label: 'Color Science & AI AF',
    brand: 'sony',
    specs: [
      { key: 'logProfile',      label: 'Log / Color Profile', type: 'text',    fn: c => c.logProfile || '—' },
      { key: 'aiAf',            label: 'AI Processing Unit',  type: 'boolean', fn: c => c.aiAf },
      { key: 'realtimeTracking',label: 'Real-time Tracking',  type: 'boolean', fn: c => c.realtimeTracking },
    ]
  },
  // ── Nikon-specific ──
  {
    id: 'nikon', label: 'Nikon Imaging',
    brand: 'nikon',
    specs: [
      { key: 'expeed',     label: 'EXPEED Generation',   type: 'text', fn: c => c.expeed || '—' },
      { key: 'nRaw',       label: 'N-RAW Internal',      type: 'text', fn: c => c.nRaw || '—' },
      { key: 'pixelShift', label: 'Pixel Shift High-Res',type: 'text', fn: c => c.pixelShift || '—' },
      { key: 'preCapture', label: 'Pre-Release Capture', type: 'boolean', fn: c => c.preCapture },
    ]
  },

  // ── Panasonic-specific ──
  {
    id: 'panasonic', label: 'Panasonic Video',
    brand: 'panasonic',
    specs: [
      { key: 'vLog',           label: 'V-Log Gamma',      type: 'text',    fn: c => c.vLog || '—' },
      { key: 'dualNativeIso',  label: 'Dual Native ISO',  type: 'boolean', fn: c => c.dualNativeIso },
      { key: 'openGate',       label: 'Open Gate Capture',type: 'text',    fn: c => c.openGate || '—' },
      { key: 'proResInternal', label: 'Internal ProRes',  type: 'boolean', fn: c => c.proResInternal },
    ]
  },
];

// ─────────────────────────────────────────────
// LENS SPEC SECTIONS
// ─────────────────────────────────────────────
const LENS_SPEC_SECTIONS = [
  {
    id: 'lens-overview', label: 'Overview',
    specs: [
      { key: 'manufacturer', label: 'Manufacturer',    type: 'text',   fn: l => l.manufacturer },
      { key: 'line',         label: 'Lens Line',       type: 'text',   fn: l => l.line },
      { key: 'lensType',     label: 'Type',            type: 'text',   fn: l => l.type },
      { key: 'year',         label: 'Year Introduced', type: 'text',   fn: l => l.year },
      { key: 'status',       label: 'Status',          type: 'text',   fn: l => l.discontinued ? '🔴 Discontinued' : '🟢 Current' },
    ]
  },
  {
    id: 'lens-optical', label: 'Optical Design',
    specs: [
      { key: 'focalLength',     label: 'Focal Length',            type: 'text',   fn: l => l.type === 'Prime' ? l.focalLength + 'mm' : `${l.focalLengthMin}–${l.focalLengthMax}mm` },
      { key: 'focalEquiv',      label: 'Focal Length (35mm eq.)', type: 'text',   fn: l => l.focalLengthEquiv },
      { key: 'maxAperture',     label: 'Max Aperture',            type: 'number', lowerBetter: true,  fn: l => l.maxAperture, fmt: v => 'f/' + v },
      { key: 'minAperture',     label: 'Min Aperture',            type: 'text',   fn: l => 'f/' + l.minAperture },
      { key: 'elements',        label: 'Elements',                type: 'text',   fn: l => l.elements },
      { key: 'groups',          label: 'Groups',                  type: 'text',   fn: l => l.groups },
      { key: 'blades',          label: 'Diaphragm Blades',        type: 'number', higherBetter: true, fn: l => l.blades, fmt: v => v + ' blades' },
    ]
  },
  {
    id: 'lens-focus', label: 'Focus & Stabilization',
    specs: [
      { key: 'minFocusDist',    label: 'Min. Focus Distance',     type: 'number', lowerBetter: true,  fn: l => l.minFocusDist,      fmt: v => v + ' cm' },
      { key: 'maxMag',          label: 'Max Magnification',       type: 'number', higherBetter: true, fn: l => l.maxMagnification,  fmt: v => v.toFixed(2) + '×' },
      { key: 'afType',          label: 'AF Motor Type',           type: 'text',   fn: l => l.afType },
      { key: 'ois',             label: 'Optical Image Stab.',     type: 'boolean', fn: l => l.ois },
      { key: 'oisStops',        label: 'OIS Compensation',        type: 'number', higherBetter: true, fn: l => l.oisStops, fmt: v => v + ' stops' },
    ]
  },
  {
    id: 'lens-physical', label: 'Physical & Price',
    specs: [
      { key: 'weight',          label: 'Weight',                  type: 'number', lowerBetter: true,  fn: l => l.weight,         fmt: v => v + ' g' },
      { key: 'length',          label: 'Length',                  type: 'number', lowerBetter: true,  fn: l => l.length,         fmt: v => v + ' mm' },
      { key: 'diameter',        label: 'Diameter',                type: 'number', lowerBetter: true,  fn: l => l.diameter,       fmt: v => v + ' mm' },
      { key: 'filterThread',    label: 'Filter Thread',           type: 'text',   fn: l => l.filterThread ? l.filterThread + 'mm' : 'Built-in hood' },
      { key: 'weatherSealed',   label: 'Weather Sealed',          type: 'boolean', fn: l => l.weatherSealed },
      { key: 'price',           label: 'RRP (list price)',         type: 'number', lowerBetter: true,  fn: l => l.prices ? (l.prices[currentCurrency] ?? null) : null, fmt: v => CURRENCY[currentCurrency].symbol + v.toLocaleString() },
    ]
  },
];

// ─────────────────────────────────────────────
// MODE CONFIG (built from brand data globals)
// ─────────────────────────────────────────────
const MODE_CONFIG = {
  cameras: {
    items: CAMERAS,
    dropdownGroups: DROPDOWN_GROUPS,
    specSections: SPEC_SECTIONS,
    selectedIds: () => selectedCameraIds,
    setSelectedId: (i, v) => { selectedCameraIds[i] = v; },
    heroEyebrow: BRAND_CONFIG.cameras.heroEyebrow,
    heroTitle:   BRAND_CONFIG.cameras.heroTitle,
    heroSubtitle:BRAND_CONFIG.cameras.heroSubtitle,
    headerTitle: BRAND_CONFIG.cameras.headerTitle,
    supportsCurrency: true,
  },
  lenses: {
    items: LENSES,
    dropdownGroups: LENS_DROPDOWN_GROUPS,
    specSections: LENS_SPEC_SECTIONS,
    selectedIds: () => selectedLensIds,
    setSelectedId: (i, v) => { selectedLensIds[i] = v; },
    heroEyebrow: BRAND_CONFIG.lenses.heroEyebrow,
    heroTitle:   BRAND_CONFIG.lenses.heroTitle,
    heroSubtitle:BRAND_CONFIG.lenses.heroSubtitle,
    headerTitle: BRAND_CONFIG.lenses.headerTitle,
    supportsCurrency: true,
  },
};
function cfg() { return MODE_CONFIG[currentMode]; }

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
let currentMode = 'cameras';
let selectedCameraIds = [...BRAND_CONFIG.cameras.defaultSelected];
let selectedLensIds   = [...BRAND_CONFIG.lenses.defaultSelected];
let currentCurrency = 'AUD';
// slotChoice is the user's picked slot count (2..MAX_SLOTS — 3 on brand
// pages, 4 on the compare page). numSlots is what the viewport allows
// right now (effectiveSlots clamps to 2 below the mobile breakpoint).
let slotChoice = IS_COMPARE
  ? Math.min(Math.max(COMPARE_CONFIG.defaultSlots || 3, MIN_SLOTS), MAX_SLOTS)
  : 3;
let numSlots = 3;

// Pure so the clamp rule is unit-testable: below the mobile breakpoint
// exactly 2 slots show; the user's choice is preserved and restored
// when the viewport widens again.
function effectiveSlots(choice, width) {
  return width >= 600 ? choice : 2;
}

function getNumSlots() {
  return effectiveSlots(slotChoice, window.innerWidth);
}

// ─────────────────────────────────────────────
// URL STATE (shareable comparison hashes)
//
// Grammar: #<mode> or #<mode>=<slug>,<slug>,<slug>. Bare-mode and empty
// hashes keep their legacy meaning — mode only, default selection — and
// the hash is never written until the user first interacts, so a plain
// visit keeps a clean URL. Unknown slugs fall back per-slot to the
// brand's defaults rather than rejecting the whole hash.
// ─────────────────────────────────────────────
function parseHash(hash) {
  const m = /^#(cameras|lenses)(?:=(.*))?$/.exec(hash || '');
  if (!m) return { mode: 'cameras', ids: null };
  const mode = m[1];
  if (m[2] === undefined) return { mode, ids: null };
  const items = MODE_CONFIG[mode].items;
  const given = m[2].split(',');
  const ids = BRAND_CONFIG[mode].defaultSelected.map(
    (def, i) => (items[given[i]] ? given[i] : def)
  );
  // On the compare page the entry count also carries the slot count.
  const count = IS_COMPARE
    ? Math.min(Math.max(given.length, MIN_SLOTS), MAX_SLOTS)
    : undefined;
  return { mode, ids, count };
}

function updateHash() {
  const ids = cfg().selectedIds();
  // Compare page: write the user's chosen count (not the responsive
  // clamp), mirroring the brand-page rule of always writing all slugs.
  const shown = IS_COMPARE ? ids.slice(0, slotChoice) : ids;
  history.replaceState(null, '', `#${currentMode}=${shown.join(',')}`);
}

// Selection slugs are brand-specific — carry only the mode across brands.
function brandSwitchHash() {
  return location.hash ? `#${currentMode}` : '';
}

// ─────────────────────────────────────────────
// BODY HTML GENERATION
// ─────────────────────────────────────────────
function buildBrandSwitcher() {
  const brands = REGISTERED_BRANDS || null;
  if (!brands || brands.length <= 1) return '';
  const allOpt = `<option value="__compare"${IS_COMPARE ? ' selected' : ''}>All brands</option>`;
  const options = brands.map(b => {
    const sel = !IS_COMPARE && b.slug === BRAND_CONFIG.slug ? ' selected' : '';
    return `<option value="${b.slug}"${sel}>${b.name}</option>`;
  }).join('');
  return `<select class="brand-switcher header-select" id="brand-switcher" aria-label="Brand">${allOpt}${options}</select>`;
}

// Reusable on every page (brand pages max out at MAX_SLOTS=3, the
// compare page at 4): lets the user choose how many slots to show,
// rendered under the "Compare" label so it sits in the same row as
// the camera slot pickers. Hidden below the mobile breakpoint via CSS
// — narrow viewports are clamped to 2 regardless (see effectiveSlots),
// so the control has nothing useful to offer there.
function buildSlotCountField() {
  if (MAX_SLOTS <= MIN_SLOTS) return '';
  let options = '';
  for (let n = MIN_SLOTS; n <= MAX_SLOTS; n++) {
    options += `<option value="${n}"${n === slotChoice ? ' selected' : ''}>${n}</option>`;
  }
  return `<div class="slot-count-field">
    <label for="slot-count-select">Cameras to compare</label>
    <select id="slot-count-select" class="slot-count-select" aria-label="Number of cameras to compare">${options}</select>
  </div>`;
}

function buildFooterLinks() {
  const links = BRAND_CONFIG.footerLinks;
  if (!links || !links.length) return 'manufacturer documentation';
  return links.map(l => `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join(', ');
}

// The verified date is a claim about when data was last audited
// (SITE_CONFIG.dataVerified), never the render date. Pages loaded
// without site-config.js simply omit the line.
function buildVerifiedLine() {
  if (typeof SITE_CONFIG === 'undefined' || !SITE_CONFIG.dataVerified) return '';
  return `<p>Specs &amp; prices last verified: ${SITE_CONFIG.dataVerified}</p>`;
}

// The Framed Duo mark, inlined so it needs no depth-relative asset path
// and works from file://. Geometry must match assets/logo.svg.
const LOGO_SVG = `<svg viewBox="0 0 64 64" width="24" height="24" aria-hidden="true" focusable="false"><path d="M4 16 V4 H16 M48 4 H60 V16 M60 48 V60 H48 M16 60 H4 V48" fill="none" stroke="#BFC6D4" stroke-width="3" stroke-linecap="round"></path><circle cx="24" cy="32" r="10" fill="#B48CE0"></circle><circle cx="40" cy="32" r="10" fill="#4FC7B0"></circle></svg>`;

// Engine pages (brand dirs, compare/) all sit one level below the root.
// ?brands suppresses the landing page's stored-brand redirect so the
// lockup reliably lands on the brand picker.
const HOME_HREF = '../?brands';

function injectBody() {
  // Render into #app when present so generator-owned static content outside
  // the container (crawlable SEO blocks) survives; fall back to the body for
  // pages/tests that don't provide the container.
  const mount = document.getElementById('app') || document.body;
  mount.innerHTML = `
<header id="site-header">
  <div class="header-brand">
    <a class="brand-home" href="${HOME_HREF}" aria-label="Compare Camera Specs — choose a brand">${LOGO_SVG}<span class="brand-wordmark">Compare Camera Specs</span></a>
    <span class="header-sep">|</span>
    <span class="header-title" id="header-title">${BRAND_CONFIG.cameras.headerTitle}</span>
  </div>
  ${IS_COMPARE ? '' : `<div class="mode-toggle" id="mode-toggle">
    <button class="mode-btn active" data-mode="cameras">Cameras</button>
    <button class="mode-btn" data-mode="lenses">Lenses</button>
  </div>`}
  ${buildBrandSwitcher()}
  <div class="header-controls">
    <select id="currency-select" class="header-select" aria-label="Currency">
      <option value="USD">USD ($)</option>
      <option value="AUD" selected>AUD (A$)</option>
      <option value="EUR">EUR (€)</option>
      <option value="GBP">GBP (£)</option>
      <option value="JPY">JPY (¥)</option>
      <option value="CAD">CAD (C$)</option>
      <option value="SGD">SGD (S$)</option>
    </select>
  </div>
</header>

<div class="page-hero">
  <div class="hero-eyebrow" id="hero-eyebrow">${BRAND_CONFIG.cameras.heroEyebrow}</div>
  <h1 class="hero-title" id="hero-title">${BRAND_CONFIG.cameras.heroTitle}</h1>
  <p class="hero-subtitle" id="hero-subtitle">${BRAND_CONFIG.cameras.heroSubtitle}</p>
</div>

<div id="compare-header">
  <div class="compare-grid" id="compare-grid-header">
    <div class="compare-label-cell${MAX_SLOTS > MIN_SLOTS ? ' compare-label-cell--compare' : ''}">
      <span class="compare-label-text">Compare</span>
      ${buildSlotCountField()}
    </div>
    ${Array.from({ length: MAX_SLOTS }, (_, i) =>
      `<div class="compare-slot${i === 2 && !IS_COMPARE ? ' slot-3-hide' : ''}" id="slot-${i}"></div>`).join('\n    ')}
  </div>
</div>

<main id="compare-table"></main>

<footer>
  <p>${BRAND_CONFIG.name} Camera ${IS_COMPARE ? '' : '&amp; Lens '}Comparison &mdash; For informational purposes only.</p>
  <p>Prices shown are approximate manufacturer list prices (RRP) and may differ from live retail prices. Use the Buy link for current pricing.</p>
  <p>Specs sourced from ${buildFooterLinks()}.</p>
  ${buildVerifiedLine()}
  <div id="affiliate-disclosure"></div>
  <p>
    <a href="../about.html">About</a>
    &middot;
    <a href="../privacy.html">Privacy</a>
    &middot;
    Created by <a href="https://esusatyo.net" target="_blank" rel="noopener">Enrico Susatyo</a>
    &middot;
    Assisted by <a href="https://claude.ai" target="_blank" rel="noopener">Claude</a>
  </p>
</footer>`;
}

// ─────────────────────────────────────────────
// ITEM PLACEHOLDER (camera or lens)
// ─────────────────────────────────────────────
function buildPlaceholder(item, id) {
  let svgHtml;
  if (currentMode === 'lenses') {
    const c = MANUFACTURER_COLORS[item.manufacturer] || { bg: '#1a1a2a', text: '#8080c0' };
    const label = item.name.length > 22 ? item.name.slice(0, 22) + '…' : item.name;
    const len = item.length || 70;
    const dia = item.diameter || 65;
    const bW = Math.max(10, Math.min(22, Math.round(10 + (len - 20) / 300 * 12)));
    const bH = Math.max(10, Math.min(20, Math.round(10 + (dia - 60) / 47 * 10)));
    const bX = Math.round((28 - bW) / 2);
    const bY = Math.round((28 - bH) / 2);
    const feH = Math.min(bH + 4, 24);
    const feX = bX + bW - 2;
    const feY = Math.round((28 - feH) / 2);
    const gR = Math.max(2, Math.min(5, Math.round(6 / item.maxAperture)));
    const gcx = feX + 1.5;
    svgHtml = `<div class="cam-placeholder" style="background:${c.bg}"><svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="${bX}" y="${bY}" width="${bW}" height="${bH}" rx="1.5" fill="${c.text}" opacity="0.28"/><rect x="${feX}" y="${feY}" width="3" height="${feH}" rx="1.5" fill="${c.text}" opacity="0.55"/><circle cx="${gcx}" cy="14" r="${gR}" fill="${c.text}" opacity="0.75"/>${gR > 2 ? `<circle cx="${gcx}" cy="14" r="${gR - 1.5}" fill="${c.text}" opacity="0.4"/>` : ''}</svg><span style="font-size:8px;font-weight:700;color:${c.text};letter-spacing:0.03em;opacity:0.9;text-align:center;line-height:1.2">${label}</span></div>`;
  } else {
    const c = seriesColor(id, item.series);
    svgHtml = `<div class="cam-placeholder" style="background:${c.bg}"><svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="5" width="26" height="14" rx="2.5" fill="${c.text}" opacity="0.35"/><rect x="8" y="1" width="12" height="5" rx="2" fill="${c.text}" opacity="0.35"/><circle cx="14" cy="12" r="5" fill="${c.text}" opacity="0.5"/><circle cx="14" cy="12" r="3" fill="${c.text}" opacity="0.7"/><circle cx="21" cy="8" r="1.5" fill="${c.text}" opacity="0.5"/></svg><span style="font-size:9px;font-weight:700;color:${c.text};letter-spacing:0.04em;opacity:0.9">${item.name}</span></div>`;
  }
  if (item.imageUrl) {
    const fallback = svgHtml.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    return `<img src="${item.imageUrl}" alt="${item.name}" class="cam-photo" onerror="this.outerHTML='${fallback}'">`;
  }
  return svgHtml;
}

// ─────────────────────────────────────────────
// BUILD DROPDOWN HTML
// ─────────────────────────────────────────────
function buildSelectHTML(currentId, slotIndex) {
  const otherIds = cfg().selectedIds().filter((_, i) => i !== slotIndex && i < numSlots);
  let html = `<select class="slot-select" data-slot="${slotIndex}">`;
  for (const grp of cfg().dropdownGroups) {
    html += `<optgroup label="${grp.label}">`;
    for (const id of grp.ids) {
      const item = cfg().items[id];
      if (!item) continue;
      const disabled = otherIds.includes(id) ? 'disabled' : '';
      const selected = id === currentId ? 'selected' : '';
      html += `<option value="${id}" ${selected} ${disabled}>${item.name} (${item.year})</option>`;
    }
    html += `</optgroup>`;
  }
  html += `</select>`;
  return html;
}

// ─────────────────────────────────────────────
// RENDER PRICE (shared by slot and table)
// Rules:
//   1. Local-currency price available → show with local symbol + RRP label
//   2. Discontinued → show "Discontinued / Launch: $X" (no RRP label)
//   3. Live item, no local price but USD exists → show tagged "USD $X" + RRP label
//   4. No price at all → "Price unavailable"
// ─────────────────────────────────────────────
function renderPriceHTML(item) {
  const prices = item.prices;
  if (!prices) return `<div class="slot-price discontinued">Price unavailable</div>`;
  const localPrice = prices[currentCurrency];
  const sym = CURRENCY[currentCurrency].symbol;
  if (localPrice != null) {
    return `<div class="slot-price"><span class="price-rrp-label">RRP</span> ${sym}${localPrice.toLocaleString()}</div>`;
  }
  if (item.discontinued) {
    return `<div class="slot-price discontinued">Discontinued<br><small>Launch: $${prices.USD?.toLocaleString() ?? 'N/A'}</small></div>`;
  }
  if (prices.USD != null) {
    return `<div class="slot-price"><span class="price-rrp-label">RRP</span> <small>USD</small> $${prices.USD.toLocaleString()}</div>`;
  }
  return `<div class="slot-price discontinued">Price unavailable</div>`;
}

// ─────────────────────────────────────────────
// RENDER SLOT HEADER
// ─────────────────────────────────────────────
function renderSlot(slotIndex) {
  const el = document.getElementById(`slot-${slotIndex}`);
  if (!el) return;
  const id = cfg().selectedIds()[slotIndex];
  const item = cfg().items[id];
  if (!item) return;

  const priceHTML = renderPriceHTML(item);
  let linkHTML;

  if (currentMode === 'lenses') {
    const viewBtn = item.productUrl
      ? `<a href="${item.productUrl}" target="_blank" rel="noopener" class="slot-link">View Product ↗</a>`
      : `<span class="slot-link na">No Link</span>`;
    const buyBtn = `<a href="${amazonBuyUrl(item, currentCurrency, brandNameOf(id))}" target="_blank" rel="noopener" class="slot-buy">Buy ↗</a>`;
    linkHTML = `<div class="slot-links">${viewBtn}${buyBtn}</div>`;
  } else {
    const linkURL = (item.productUrl && !item.productUrl.endsWith('/cameras/'))
      ? item.productUrl : null;
    const viewBtn = linkURL
      ? `<a href="${linkURL}" target="_blank" rel="noopener" class="slot-link">View Product ↗</a>`
      : `<span class="slot-link na">Discontinued</span>`;
    const buyBtn = `<a href="${amazonBuyUrl(item, currentCurrency, brandNameOf(id))}" target="_blank" rel="noopener" class="slot-buy">Buy ↗</a>`;
    linkHTML = `<div class="slot-links">${viewBtn}${buyBtn}</div>`;
  }

  el.innerHTML = `
    <div class="cam-image-wrap">${buildPlaceholder(item, id)}</div>
    ${buildSelectHTML(id, slotIndex)}
    ${priceHTML}
    ${linkHTML}
  `;
}

// ─────────────────────────────────────────────
// COMPUTE WINNERS PER SPEC ROW
// ─────────────────────────────────────────────
function computeWinners(spec) {
  const vals = cfg().selectedIds().slice(0, numSlots).map(id => spec.fn(cfg().items[id]));
  if (!spec.higherBetter && !spec.lowerBetter) return vals.map(() => false);
  const nums = vals.map(v => typeof v === 'number' ? v : null);
  if (nums.every(v => v === null)) return vals.map(() => false);
  const valid = nums.filter(v => v !== null);
  const best = spec.higherBetter ? Math.max(...valid) : Math.min(...valid);
  return nums.map(v => v !== null && v === best);
}

// ─────────────────────────────────────────────
// FORMAT SPEC VALUE
// ─────────────────────────────────────────────
function formatVal(spec, item) {
  const raw = spec.fn(item);
  if (spec.type === 'boolean') {
    return raw
      ? `<span class="check">✓</span>`
      : `<span class="cross">—</span>`;
  }
  if (raw === null || raw === undefined) return '<span class="cross">—</span>';
  if (spec.fmt && typeof raw === 'number') return spec.fmt(raw);
  return raw;
}

// ─────────────────────────────────────────────
// RENDER COMPARE TABLE
// Brand-tagged sections: on a brand page, shown iff the tag is in
// BRAND_CONFIG.brandSections; in cross-brand mode, shown iff any
// visible camera belongs to that brand (foreign cells render "—").
// ─────────────────────────────────────────────
function sectionVisible(section) {
  if (!section.brand) return true;
  if (!IS_COMPARE) return BRAND_CONFIG.brandSections.includes(section.brand);
  return cfg().selectedIds().slice(0, numSlots).some(id => brandOf(id) === section.brand);
}

function renderTable() {
  const table = document.getElementById('compare-table');
  let html = '';

  for (const section of cfg().specSections) {
    if (!sectionVisible(section)) continue;

    html += `<div class="spec-section">
      <div class="section-header" data-section="${section.id}">
        <span class="section-title">${section.label}</span>
        <span class="section-toggle open">▾</span>
      </div>
      <div class="section-body" id="body-${section.id}">`;

    for (const spec of section.specs) {
      const winners = computeWinners(spec);
      html += `<div class="spec-row">
        <div class="spec-label">${spec.label}</div>`;
      for (let i = 0; i < numSlots; i++) {
        const item = cfg().items[cfg().selectedIds()[i]];
        const winClass = winners[i] ? ' winner' : '';
        const slotHide = (i === 2 && numSlots < 3) ? ' slot-3-hide' : '';
        html += `<div class="spec-value${winClass}${slotHide}">${formatVal(spec, item)}</div>`;
      }
      html += `</div>`;
    }

    html += `</div></div>`;
  }

  table.innerHTML = html;

  document.querySelectorAll('.section-header').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const id = hdr.dataset.section;
      const body = document.getElementById(`body-${id}`);
      const toggle = hdr.querySelector('.section-toggle');
      body.classList.toggle('collapsed');
      toggle.classList.toggle('open');
    });
  });
}

// ─────────────────────────────────────────────
// FULL RE-RENDER
// ─────────────────────────────────────────────
function renderAll() {
  document.documentElement.style.setProperty('--num-slots', numSlots);

  for (let i = 0; i < MAX_SLOTS; i++) {
    const el = document.getElementById(`slot-${i}`);
    if (el) el.style.display = i < numSlots ? '' : 'none';
  }

  for (let i = 0; i < MAX_SLOTS; i++) renderSlot(i);
  renderTable();
  attachSlotListeners();
}

// ─────────────────────────────────────────────
// EVENT LISTENERS
// ─────────────────────────────────────────────
function attachSlotListeners() {
  document.querySelectorAll('.slot-select').forEach(sel => {
    sel.addEventListener('change', e => {
      const slotIdx = parseInt(e.target.dataset.slot);
      cfg().setSelectedId(slotIdx, e.target.value);
      updateHash();
      renderAll();
    });
  });
}

function attachEventListeners() {
  document.getElementById('currency-select').addEventListener('change', e => {
    currentCurrency = e.target.value;
    renderAll();
  });

  document.getElementById('slot-count-select')?.addEventListener('change', e => {
    const n = parseInt(e.target.value, 10);
    if (!n || n === slotChoice) return;
    slotChoice = n;
    numSlots = getNumSlots();
    updateHash();
    renderAll();
  });

  document.getElementById('mode-toggle')?.addEventListener('click', e => {
    const btn = e.target.closest('.mode-btn');
    if (!btn || btn.dataset.mode === currentMode) return;
    currentMode = btn.dataset.mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('hero-eyebrow').textContent = cfg().heroEyebrow;
    document.getElementById('hero-title').innerHTML = cfg().heroTitle;
    document.getElementById('hero-subtitle').textContent = cfg().heroSubtitle;
    document.getElementById('header-title').textContent = cfg().headerTitle;
    updateHash();
    renderAll();
  });

  document.getElementById('brand-switcher')?.addEventListener('change', e => {
    const slug = e.target.value;
    if (slug === '__compare') {
      if (!IS_COMPARE) location.href = `../compare/`;
      return;
    }
    if (!slug || slug === BRAND_CONFIG.slug) return;
    localStorage.setItem('brand', slug);
    location.href = `../${slug}/${brandSwitchHash()}`;
  });

  window.addEventListener('resize', () => {
    const n = getNumSlots();
    if (n !== numSlots) {
      numSlots = n;
      renderAll();
    }
  });
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
(function init() {
  // Set page title / persist brand preference (brand pages only — the
  // compare page keeps its static title and is not a brand).
  if (!IS_COMPARE) {
    document.title = BRAND_CONFIG.name + ' Camera & Lens Comparison';
    localStorage.setItem('brand', BRAND_CONFIG.slug);
  }

  // Generate body HTML
  injectBody();

  // Restore mode + selection from the hash (never rewrites it on load)
  const initial = parseHash(location.hash);
  if (initial.ids) {
    if (initial.mode === 'cameras') selectedCameraIds = initial.ids;
    else if (!IS_COMPARE) selectedLensIds = initial.ids;
  }
  if (IS_COMPARE && initial.count) {
    slotChoice = initial.count;
    const countSel = document.getElementById('slot-count-select');
    if (countSel) countSel.value = String(slotChoice);
  }
  if (initial.mode === 'lenses' && !IS_COMPARE) {
    currentMode = 'lenses';
    document.querySelectorAll('.mode-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === 'lenses');
    });
    document.getElementById('hero-eyebrow').textContent = cfg().heroEyebrow;
    document.getElementById('hero-title').innerHTML = cfg().heroTitle;
    document.getElementById('hero-subtitle').textContent = cfg().heroSubtitle;
    document.getElementById('header-title').textContent = cfg().headerTitle;
  }

  numSlots = getNumSlots();
  attachEventListeners();
  renderAll();
})();
