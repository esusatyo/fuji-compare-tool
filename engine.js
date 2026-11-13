// ─────────────────────────────────────────────
// CAMERA COMPARE ENGINE
// Reads brand datasets from the window.BRAND_DATA registry, which each
// <brand>/data.js populates before this file executes. Brand pages
// register exactly one brand. compare/index.html registers all brands
// and declares window.COMPARE_CONFIG, which switches the engine into
// cross-brand mode: cameras only, brand-namespaced item ids
// ('fujifilm:x-t5'). Every page — brand or compare — offers a "Compare"
// slot-count dropdown (2..MAX_SLOTS, so up to 4); it's hidden, with its
// whole label cell, below the mobile breakpoint, where the viewport clamps
// to 2 anyway.
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// BRAND DATA RESOLUTION
// ─────────────────────────────────────────────
// Assigned back so brand files that load *after* the engine (the homepage
// fetches them on demand) register into this same object.
const REGISTRY = window.BRAND_DATA = window.BRAND_DATA || {};
const COMPARE_CONFIG = window.COMPARE_CONFIG || null;
const IS_COMPARE = !!COMPARE_CONFIG;
// The homepage embeds the cross-brand tool between its own header and
// footer: slots start empty, no brand data is loaded until it is needed, and
// the picker searches a small generated name index (COMPARE_CONFIG.index)
// in the meantime. See the HOMEPAGE EMBED section below.
const IS_EMBED = IS_COMPARE && !!COMPARE_CONFIG.embed;
const ACTIVE_BRAND = IS_COMPARE ? null : REGISTRY[Object.keys(REGISTRY)[0]];
const MIN_SLOTS = 2;
const MAX_SLOTS = 4;

// Cross-brand ids are '<brand>:<slug>'; brand-page ids are bare slugs
// owned by the page's brand. Every per-item lookup that depends on the
// owning brand (series colors, buy-link brand name, section matching)
// goes through these two helpers.
function brandOf(id) {
  return IS_COMPARE ? id.split(':')[0] : BRAND_CONFIG.slug;
}

// Anonymous interaction events — analytics.js defines window.trackEvent and
// documents the path grammar. Absent (tests, blocked counter) means no-op.
function track(path, title) {
  if (typeof window.trackEvent === 'function') window.trackEvent(path, title);
}

// Event paths always name the brand: a brand page's bare slug is qualified,
// a compare-page id already is.
function trackKey(id) {
  return IS_COMPARE ? id : `${BRAND_CONFIG.slug}:${id}`;
}

function trackPage() {
  return IS_EMBED ? 'home' : IS_COMPARE ? 'compare' : BRAND_CONFIG.slug;
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
  const first = Object.values(REGISTRY)[0];
  if (!first) return []; // homepage, before any brand file has loaded
  const order = (first.REGISTERED_BRANDS || [])
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
      defaultSelected: (c.defaultSelected || []).slice(),
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

// Homepage only: every camera's name, year and status, keyed like a compare
// id, from the index generate-seo.js inlines. It stands in for the catalogue
// until the brand files arrive — enough to search, and to name a slot whose
// specs are still loading. Empty on every other page.
const NAME_INDEX = {};
const NAME_INDEX_GROUPS = [];
for (const b of (IS_EMBED && COMPARE_CONFIG.index) || []) {
  const ids = [];
  for (const [slug, name, year, discontinued] of b.cameras) {
    const id = `${b.slug}:${slug}`;
    NAME_INDEX[id] = { name, year, discontinued: !!discontinued, brand: b.name };
    ids.push(id);
  }
  NAME_INDEX_GROUPS.push({ label: b.name, ids });
}

// Mount id → display label, merged across every brand loaded on the page (one
// on a brand page, all six on compare/). Ids are site-wide rather than
// brand-scoped — `l` is L-Mount for both Panasonic and Sigma — and a Tier 1
// test pins that no two brands give the same id different labels. The merged
// map is what lets a spec row resolve a label from the item alone: spec `fn`s
// receive the item, not the id, so they cannot reach their own brand's config.
const MOUNTS_BY_ID = {};
function indexMounts() {
  for (const data of Object.values(REGISTRY)) {
    for (const m of (data.BRAND_CONFIG.mounts || [])) MOUNTS_BY_ID[m.id] = m;
  }
}
indexMounts(); // again in hydrateCatalogue(), once the homepage's brand files are in

// A fixed-lens body has no mount. It carries its lineup's id so it stays
// visible under that filter chip (an X100VI belongs in the X list), but
// printing "X-Mount" in a spec row would claim something untrue — so name the
// system instead, which is still the useful comparison against an X-T5.
function mountName(mountId) {
  const m = MOUNTS_BY_ID[mountId];
  return m ? m.label : mountId;
}

// Cameras only. A lens always has a real mount, so it uses mountName directly;
// a body may not, which is what this handles. `system` is the line's own name
// where the mount label is not it — Fujifilm's G-Mount bodies are the GFX line,
// and nobody calls them "G".
function cameraMountLabel(cam) {
  const m = MOUNTS_BY_ID[cam.mount];
  if (!m) return cam.mount;
  if (cam.lensType !== 'Fixed') return m.label;
  return `Fixed lens (${m.system || m.label.replace(/-Mount$/, '')} system)`;
}

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
  if (data) return data.BRAND_CONFIG.name;
  return (NAME_INDEX[id] && NAME_INDEX[id].brand) || BRAND_CONFIG.name;
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
  'SG-image':     { bg: '#1a1e24', text: '#a8b4c4' },
  'Thypoch':      { bg: '#22180e', text: '#d8b080' },
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
      { key: 'mount',        label: 'Lens Mount',       type: 'text',    fn: c => cameraMountLabel(c) },
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
      // maxBurst is non-nullable in the schema, so bodies that publish no
      // stills burst rate at all (the BS1H/BGH1 box cameras) carry 0. Render
      // that as "—" rather than "0 fps", which reads as a measured figure.
      { key: 'maxBurst',     label: 'Max Burst Speed',   type: 'number', higherBetter: true,  fn: c => c.maxBurst || null, fmt: v => v + ' fps' },
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
  // ── Sigma-specific ──
  {
    id: 'sigma', label: 'Foveon & L-Mount',
    brand: 'sigma',
    specs: [
      { key: 'foveonGen',       label: 'Foveon Sensor',     type: 'text',    fn: c => c.foveonGen || '—' },
      { key: 'shutterType',     label: 'Shutter',           type: 'text',    fn: c => c.shutterType || '—' },
      { key: 'internalStorage', label: 'Internal Storage',  type: 'text',    fn: c => c.internalStorage || '—' },
      { key: 'lLog',            label: 'L-Log',             type: 'boolean', fn: c => c.lLog },
    ]
  },
  // ── Olympus-specific ──
  {
    id: 'olympus', label: 'Computational Photography',
    brand: 'olympus',
    specs: [
      { key: 'liveND',        label: 'Live ND',          type: 'text',    fn: c => c.liveND || '—' },
      { key: 'hiResShot',     label: 'High Res Shot',    type: 'text',    fn: c => c.hiResShot || '—' },
      { key: 'proCapture',    label: 'Pro Capture',      type: 'boolean', fn: c => c.proCapture },
      { key: 'liveComposite', label: 'Live Composite',   type: 'boolean', fn: c => c.liveComposite },
    ]
  },
  // ── Leica-specific ──
  {
    id: 'leica', label: 'Leica System',
    brand: 'leica',
    specs: [
      { key: 'monochrom',          label: 'Monochrome Sensor',   type: 'boolean', fn: c => c.monochrom },
      { key: 'focusingSystem',     label: 'Focusing System',     type: 'text',    fn: c => c.focusingSystem || '—' },
      { key: 'contentCredentials', label: 'Content Credentials', type: 'boolean', fn: c => c.contentCredentials },
      { key: 'internalStorageGB',  label: 'Internal Storage',    type: 'number',  higherBetter: true, fn: c => c.internalStorageGB, fmt: v => v == null ? '—' : v + ' GB' },
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
      { key: 'mount',        label: 'Mount',           type: 'text',   fn: l => mountName(l.mount) },
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
      // No local price → the tagged USD figure (price-display spec), and no
      // winner unless every slot has a local price: "not published in A$"
      // isn't "dearer", and A$ vs US$ isn't a comparison.
      { key: 'price',           label: 'RRP (list price)',         type: 'number', lowerBetter: true,  needsAll: true, fn: l => l.prices ? (l.prices[currentCurrency] ?? null) : null, fmt: v => CURRENCY[currentCurrency].symbol + v.toLocaleString(), fallback: l => l.prices && l.prices.USD != null ? usdTaggedHTML(l.prices.USD) : null },
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
// Whether the catalogue is in memory. Always 'ready' except on the homepage,
// which loads the brand files on demand: idle → loading → ready | error.
let dataState = IS_EMBED ? 'idle' : 'ready';
let selectedCameraIds = withFillers(BRAND_CONFIG.cameras.defaultSelected, 'cameras');
let selectedLensIds   = withFillers(BRAND_CONFIG.lenses.defaultSelected, 'lenses');
let currentCurrency = 'AUD';
// slotChoice is the user's picked slot count (2..MAX_SLOTS). numSlots is
// what the viewport allows right now (effectiveSlots clamps to 2 below the
// mobile breakpoint).
// A brand page takes its slot count from the mode's `defaultSelected`: a brand
// with only two cameras declares two ids and gets a two-slot layout. Previously
// this was hardcoded to 3, which meant any brand with fewer than three defaults
// rendered an empty slot and threw — an invisible four-camera minimum.
function brandSlotChoice(mode) {
  const n = (BRAND_CONFIG[mode] && BRAND_CONFIG[mode].defaultSelected || []).length;
  return Math.min(Math.max(n, MIN_SLOTS), MAX_SLOTS);
}

// Brands declare three defaults per mode, but every page offers MAX_SLOTS.
// Each slot without an item takes the first one, in dropdown order, not
// already selected — so choosing 4 always reveals a real, distinct item. It
// prefers the first slot's mount, so an X-Mount comparison grows by another X
// body rather than a GFX. A catalogue too small to fill every slot leaves
// holes, which availableCount() keeps off screen.
function withFillers(ids, mode) {
  // The homepage starts empty and stays as the visitor left it: a slot holds
  // what they picked, or nothing (null).
  if (IS_EMBED) return Array.from({ length: MAX_SLOTS }, (_, i) => ids[i] || null);
  const out = Array.from({ length: MAX_SLOTS }, (_, i) => ids[i]);
  const first = MODE_CONFIG[mode].items[out.find(Boolean)];
  const sameMount = first ? itemsInMount(mode, first.mount) : [];
  const pool = [...new Set([...sameMount, ...itemsInMount(mode, null)])]
    .filter(id => !out.includes(id));
  for (let i = 0; i < MAX_SLOTS; i++) {
    if (out[i] === undefined && pool.length) out[i] = pool.shift();
  }
  return out;
}

let slotChoice = IS_COMPARE
  ? Math.min(Math.max(COMPARE_CONFIG.defaultSlots || 3, MIN_SLOTS), MAX_SLOTS)
  : brandSlotChoice('cameras');
let numSlots = 3;

// Pure so the clamp rule is unit-testable: below the mobile breakpoint
// exactly 2 slots show; the user's choice is preserved and restored
// when the viewport widens again. `available` is the ceiling the active mount
// filter imposes — Sigma's SA-Mount has two bodies against a three-slot
// layout, so without this the third slot would keep an L-Mount camera the
// filter claims to have excluded. It can go to 1; the viewport clamp cannot.
function effectiveSlots(choice, width, available = Infinity) {
  const byWidth = width >= 600 ? choice : MIN_SLOTS;
  return Math.max(1, Math.min(byWidth, available));
}

function getNumSlots() {
  return effectiveSlots(slotChoice, window.innerWidth, availableCount());
}

// ─────────────────────────────────────────────
// MOUNT FILTER
//
// Brands spanning more than one mount (Fujifilm X/G, Panasonic L/MFT, Sigma
// L/SA) can restrict both pickers to one of them. `activeMount` is null for
// "All". A mount earns a chip in a mode when it has at least one item there,
// and the row renders only when two or more qualify — a lone chip beside "All"
// offers no choice, which is why Sigma's lens tab (36 L-Mount, 0 SA-Mount)
// shows no row at all while its camera tab shows both.
// ─────────────────────────────────────────────
let activeMount = null;

function mountsForMode(mode) {
  const declared = BRAND_CONFIG.mounts || [];
  if (declared.length < 2) return [];
  const items = MODE_CONFIG[mode].items;
  const present = new Set(Object.values(items).map(it => it.mount));
  const qualifying = declared.filter(m => present.has(m.id));
  return qualifying.length >= 2 ? qualifying : [];
}

// The mode's item ids in dropdown order — the order the user sees — optionally
// restricted to one mount. `null` means every item.
function itemsInMount(mode, mountId) {
  const c = MODE_CONFIG[mode];
  const ids = [];
  for (const grp of c.dropdownGroups) {
    for (const id of grp.ids) {
      const it = c.items[id];
      if (!it) continue;
      if (mountId && it.mount !== mountId) continue;
      ids.push(id);
    }
  }
  return ids;
}

// How many items the active filter — or, unfiltered, the whole catalogue —
// leaves to fill slots with. Unfiltered it only binds for a catalogue smaller
// than MAX_SLOTS, which would otherwise render an empty slot and throw.
function availableCount() {
  if (IS_EMBED && dataState !== 'ready') return Object.keys(NAME_INDEX).length;
  return itemsInMount(currentMode, activeMount).length;
}

// ─────────────────────────────────────────────
// URL STATE (shareable comparison hashes)
//
// Grammar: #<mode> or #<mode>=<slug>,<slug>[,…]. The entries are exactly the
// items on screen, so their count is the slot count (clamped to
// MIN_SLOTS..MAX_SLOTS on load). Bare-mode and empty hashes keep their legacy
// meaning — mode only, default selection — and no selection is written until
// the user first interacts, so a plain visit keeps a clean URL. Once one is
// there it follows the screen: a viewport clamp, resize or mount filter that
// changes how many slots show rewrites it. Unknown slugs fall back per-slot
// to the brand's defaults rather than rejecting the whole hash.
// ─────────────────────────────────────────────
function parseHash(hash) {
  const m = /^#(cameras|lenses)(?:=(.*))?$/.exec(hash || '');
  if (!m) return { mode: 'cameras', ids: null };
  const mode = m[1];
  if (m[2] === undefined) return { mode, ids: null };
  const items = MODE_CONFIG[mode].items;
  const given = m[2].split(',');
  if (IS_EMBED) {
    // No defaults to fall back on: unknown ids are dropped, the rest close up.
    const known = [...new Set(given.filter(id => items[id] || NAME_INDEX[id]))].slice(0, MAX_SLOTS);
    if (!known.length) return { mode: 'cameras', ids: null };
    return { mode, ids: withFillers(known, mode), given: given.length,
      count: Math.min(Math.max(known.length, MIN_SLOTS), MAX_SLOTS) };
  }
  const defaults = BRAND_CONFIG[mode].defaultSelected;
  const ids = withFillers(Array.from({ length: MAX_SLOTS },
    (_, i) => (items[given[i]] ? given[i] : defaults[i])), mode);
  const count = Math.min(Math.max(given.length, MIN_SLOTS), MAX_SLOTS);
  return { mode, ids, count, given: given.length };
}

// Only the slots on screen: a link shared from a phone opens as the two items
// its sender saw, not with others they never did. The hidden choices stay in
// memory, so widening the window brings them (and their slugs) back.
function updateHash() {
  // Empty slots (homepage only) are not items, so they are not in the link;
  // with nothing picked there is no selection to name and the URL goes clean.
  const shown = cfg().selectedIds().slice(0, numSlots).filter(Boolean);
  history.replaceState(null, '', shown.length
    ? `#${currentMode}=${shown.join(',')}`
    : location.pathname + location.search);
}

// Keep an existing selection hash in step with the screen. A clean or
// mode-only URL is left alone until the user interacts.
function syncHash() {
  if (location.hash.includes('=')) updateHash();
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

// Reusable on every page (2..MAX_SLOTS): lets the user choose how many
// slots to show,
// rendered under the "Compare" label so it sits in the same row as
// the camera slot pickers. Hidden below the mobile breakpoint via CSS
// — narrow viewports are clamped to 2 regardless (see effectiveSlots),
// so the control has nothing useful to offer there.
function buildSlotCountSlot() {
  return `<div id="slot-count-slot">${buildSlotCountField()}</div>`;
}

// Wrapped above, because the field's contents depend on the active mount
// filter and so are re-rendered with everything else.
function buildSlotCountField() {
  if (MAX_SLOTS <= MIN_SLOTS) return '';
  // An active mount filter caps what the table can show. When the cap leaves no
  // real choice the control is dropped rather than offering counts that would
  // silently clamp — `slotChoice` is untouched, so it returns intact on "All".
  const cap = Math.min(MAX_SLOTS, availableCount());
  if (cap <= MIN_SLOTS) return '';
  let options = '';
  const shown = Math.min(slotChoice, cap);
  for (let n = MIN_SLOTS; n <= cap; n++) {
    options += `<option value="${n}"${n === shown ? ' selected' : ''}>${n}</option>`;
  }
  return `<div class="slot-count-field">
    <label for="slot-count-select">Compare</label>
    <select id="slot-count-select" class="slot-count-select" aria-label="Number of items to compare">${options}</select>
  </div>`;
}

// The wrapper is emitted only for brands that declare two or more mounts, so
// a single-mount brand's DOM is untouched. Its contents are re-rendered per
// mode, and can legitimately be empty (see mountsForMode).
function buildMountFilterSlot() {
  if ((BRAND_CONFIG.mounts || []).length < 2) return '';
  return `<div id="mount-filter-slot">${buildMountFilterHTML()}</div>`;
}

function buildMountFilterHTML() {
  const mounts = mountsForMode(currentMode);
  if (!mounts.length) return '';
  const chip = (id, label) => {
    const on = id === activeMount;
    return `<button type="button" class="mount-chip${on ? ' active' : ''}" ` +
      `data-mount="${id === null ? '' : id}" aria-pressed="${on}">${label}</button>`;
  };
  // The chips live in their own track so it can scroll sideways on a narrow
  // screen while the label stays pinned — scrolling the label out of view
  // would leave an unlabelled row of pills.
  return `<div class="mount-filter" id="mount-filter" role="group" aria-label="Filter by mount">` +
    `<span class="mount-filter-label">Mount</span>` +
    `<div class="mount-chips">` +
    chip(null, 'All') + mounts.map(m => chip(m.id, m.label)).join('') +
    `</div></div>`;
}

// Share the current comparison (the address bar already carries the
// selection hash). Native share sheet where it exists — on phones that is how
// a link reaches the Reddit or Discord app — else the clipboard, else a
// selected read-only field. Never alert()/prompt(): they block the page.
// The share-link event fires only on a completed hand-off, so a cancelled
// sheet or a failed copy counts nothing.
async function shareComparison() {
  const url = location.href;
  const done = how => track(`share-link:${trackPage()}:${currentMode}:${how}`, `Share link (${how})`);
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: document.title, url });
      done('native');
      return;
    } catch (e) {
      if (e && e.name === 'AbortError') return; // the visitor dismissed the sheet
      // Any other refusal (e.g. not allowed here): fall through to copying.
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    done('copy');
    const label = document.getElementById('share-btn-label');
    label.textContent = 'Link copied';
    clearTimeout(shareComparison.reset);
    shareComparison.reset = setTimeout(() => { label.textContent = 'Share this comparison'; }, 2000);
  } catch (e) {
    const field = document.getElementById('share-url');
    field.value = url;
    field.hidden = false;
    field.focus();
    field.select();
  }
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

const CURRENCY_SELECT_HTML = `<select id="currency-select" class="header-select" aria-label="Currency">
      <option value="USD">USD ($)</option>
      <option value="AUD" selected>AUD (A$)</option>
      <option value="EUR">EUR (€)</option>
      <option value="GBP">GBP (£)</option>
      <option value="JPY">JPY (¥)</option>
      <option value="CAD">CAD (C$)</option>
      <option value="SGD">SGD (S$)</option>
    </select>`;

const SHARE_HTML = `<div class="share">
    <button type="button" class="share-btn" id="share-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v13M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg><span id="share-btn-label">Share this comparison</span></button>
    <input class="share-url" id="share-url" type="text" readonly hidden aria-label="Link to this comparison">
  </div>`;

function compareGridHTML() {
  return `<div class="compare-grid" id="compare-grid-header">
    <div class="compare-label-cell${MAX_SLOTS > MIN_SLOTS && !IS_EMBED ? ' compare-label-cell--compare' : ''}">
      <span class="compare-label-text">Compare</span>
      ${IS_EMBED ? '' : buildSlotCountSlot()}
    </div>
    ${Array.from({ length: MAX_SLOTS }, (_, i) =>
      `<div class="compare-slot${i === 2 && !IS_COMPARE ? ' slot-3-hide' : ''}" id="slot-${i}"></div>`).join('\n    ')}
  </div>`;
}

// ─────────────────────────────────────────────
// HOMEPAGE EMBED
//
// The homepage keeps its own header, hero and footer (generate-seo.js owns
// them) and gives the engine one container. Into it go a bar — the slot
// count as visible buttons, and currency + share once there is something to
// price or share — then the same slot row and spec table every tool page
// has. The table is a <div> here: the homepage already has its <main>.
// ─────────────────────────────────────────────
function injectEmbed(mount) {
  mount.innerHTML = `
<div class="embed-bar">
  <div class="embed-count">
    <span class="embed-count-label">Compare</span>
    <div class="count-chips" id="slot-count-chips" role="group" aria-label="Number of cameras to compare"></div>
    <span class="embed-count-label">cameras</span>
  </div>
  <div class="embed-tools" id="embed-tools" hidden>
    ${CURRENCY_SELECT_HTML}
    ${SHARE_HTML}
  </div>
</div>
<div id="compare-header" class="is-idle">
  ${compareGridHTML()}
</div>
<div id="compare-table"></div>
<div class="embed-reset" id="embed-reset" hidden>
  <button type="button" class="reset-btn" id="reset-btn">Reset</button>
</div>`;
}

function buildCountChips() {
  let html = '';
  for (let n = MIN_SLOTS; n <= MAX_SLOTS; n++) {
    const on = n === slotChoice;
    html += `<button type="button" class="count-chip${on ? ' active' : ''}" data-count="${n}" aria-pressed="${on}">${n}</button>`;
  }
  return html;
}

// Fetch every brand file (the homepage's COMPARE_CONFIG.dataScripts), then
// fold them into the catalogue the rest of the engine already reads. Called
// when the picker first opens — so the specs are usually here by the time a
// camera is chosen — and again, as a no-op, on every pick.
function ensureData() {
  if (dataState === 'ready' || dataState === 'loading') return;
  dataState = 'loading';
  const srcs = COMPARE_CONFIG.dataScripts || [];
  let pending = srcs.length;
  let failed = false;
  const settle = ok => {
    if (!ok) failed = true;
    if (--pending > 0) return;
    if (failed) { dataState = 'error'; renderAll(); return; }
    hydrateCatalogue();
  };
  if (!pending) { pending = 1; settle(false); return; }
  for (const src of srcs) {
    const tag = document.createElement('script');
    tag.src = src;
    tag.async = true;
    tag.onload = () => settle(true);
    tag.onerror = () => { tag.remove(); settle(false); };
    document.head.appendChild(tag);
  }
}

// CAMERAS and DROPDOWN_GROUPS are filled in place: MODE_CONFIG and every
// render path hold references to these same objects.
function hydrateCatalogue() {
  Object.assign(CAMERAS, mergedCameras());
  indexMounts();
  DROPDOWN_GROUPS.length = 0;
  DROPDOWN_GROUPS.push(...compareDropdownGroups());
  // The index and the brand files come from one build, so a picked id the
  // catalogue lacks means a stale cached page — leave that slot empty.
  selectedCameraIds = selectedCameraIds.map(id => (id && CAMERAS[id] ? id : null));
  dataState = 'ready';
  pickerCache = null;
  numSlots = getNumSlots();
  syncHash();
  renderAll();
  if (pickerSlot !== null) { renderPickerList(); positionPicker(); }
}

function injectBody() {
  // Render into #app when present so generator-owned static content outside
  // the container (crawlable SEO blocks) survives; fall back to the body for
  // pages/tests that don't provide the container.
  const mount = document.getElementById('app') || document.body;
  if (IS_EMBED) { injectEmbed(mount); return; }
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
    ${CURRENCY_SELECT_HTML}
  </div>
</header>

<div class="page-hero">
  <div class="hero-eyebrow" id="hero-eyebrow">${BRAND_CONFIG.cameras.heroEyebrow}</div>
  <h1 class="hero-title" id="hero-title">${BRAND_CONFIG.cameras.heroTitle}</h1>
  <p class="hero-subtitle" id="hero-subtitle">${BRAND_CONFIG.cameras.heroSubtitle}</p>
  ${SHARE_HTML}
</div>

<div id="compare-header">
  ${buildMountFilterSlot()}
  ${compareGridHTML()}
</div>

<main id="compare-table"></main>

<footer>
  <p>${BRAND_CONFIG.name} Camera ${IS_COMPARE ? '' : '&amp; Lens '}Comparison &mdash; For informational purposes only.</p>
  <p>Prices shown are approximate manufacturer list prices (RRP) and may differ from live retail prices. Use the Buy link for current pricing.</p>
  <p>Specs sourced from ${buildFooterLinks()}.</p>
  ${buildVerifiedLine()}
  <div id="affiliate-disclosure"></div>
  <p>
    <a href="../about">About</a>
    &middot;
    <a href="../privacy">Privacy</a>
    &middot;
    Created by <a href="https://esusatyo.net" target="_blank" rel="noopener">Enrico Susatyo</a>
    &middot;
    Assisted by <a href="https://claude.ai" target="_blank" rel="noopener">Claude</a>
  </p>
  <div class="theme-toggle" role="group" aria-label="Color theme">
    <button class="theme-btn" data-theme-pref="light">Light</button>
    <button class="theme-btn" data-theme-pref="dark">Dark</button>
    <button class="theme-btn active" data-theme-pref="system">System</button>
  </div>
</footer>`;
  // The generator-owned static sections (crawlable specs, popular comparisons)
  // follow #app in the HTML, so the footer would render above them. Move it
  // below them so the page ends with it; the static HTML order is untouched.
  const statics = document.querySelectorAll('body > .seo-links');
  const footer = mount.querySelector('footer');
  if (statics.length && footer) statics[statics.length - 1].after(footer);
}

// ─────────────────────────────────────────────
// IMAGE SRC RESOLUTION
//
// Hosts here are known to hang (not error) on a meaningful share of
// requests, which <img onerror> below can't catch — a hang never fires
// it. /img-cache/<host>/<path> is a same-origin edge-cache proxy (see
// _worker.js) that fetches+caches the real image and fails fast (502/504)
// on a hang instead, so onerror gets a chance to show the placeholder.
// Must match _worker.js's ALLOWED_ORIGIN_HOSTS — kept in sync by hand,
// since a Worker and a browser-loaded script can't share a module.
//
// Only takes effect once this file is served by that Worker (the real
// deployed site, or `wrangler dev`); under file:// or scripts/preview.py
// the route doesn't exist, so these items fall back to the placeholder
// there too — a known, accepted local-preview tradeoff (see CLAUDE.md).
// ─────────────────────────────────────────────
const PROXIED_IMAGE_HOSTS = new Set(['fujifilm-x.b-cdn.net']);

function resolveImageSrc(url) {
  try {
    const u = new URL(url);
    if (PROXIED_IMAGE_HOSTS.has(u.host)) return `/img-cache/${u.host}${u.pathname}${u.search}`;
  } catch { /* malformed URL: fall through to the original */ }
  return url;
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
    return `<img src="${resolveImageSrc(item.imageUrl)}" alt="${item.name}" class="cam-photo" onerror="this.outerHTML='${fallback}'">`;
  }
  return svgHtml;
}

// ─────────────────────────────────────────────
// ITEM PICKER
//
// Each slot shows its item as a button; pressing it opens one shared popover
// holding a search field and a list. With nothing typed the list is the whole
// catalogue under its dropdown-group headings, so browsing works as the old
// <select> did; typing replaces it with ranked matches. The list is built
// only while open — four slots no longer each carry every option.
// ─────────────────────────────────────────────
function escHTML(text) {
  return String(text).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// "Sigma" + "Sigma 56mm f/1.4" must not read "Sigma Sigma 56mm".
function withBrand(brand, name) {
  return !brand || name.toLowerCase().startsWith(brand.toLowerCase()) ? name : `${brand} ${name}`;
}

function modeNoun(plural) {
  const lens = currentMode === 'lenses';
  return plural ? (lens ? 'lenses' : 'cameras') : (lens ? 'lens' : 'camera');
}

// What a slot's button says. On the homepage the name can come from the index
// while the specs are still on their way.
function pickerLabel(id) {
  const it = cfg().items[id] || NAME_INDEX[id];
  if (!it) return '';
  return `${IS_COMPARE ? withBrand(brandNameOf(id), it.name) : it.name} (${it.year})`;
}

const SEARCH_ICON = `<svg class="picker-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></svg>`;
const CHEVRON_ICON = `<svg class="picker-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`;

function buildPickerHTML(currentId, slotIndex) {
  const attrs = `data-slot="${slotIndex}" data-value="${currentId || ''}" aria-haspopup="listbox" aria-expanded="${pickerSlot === slotIndex}"`;
  if (!currentId) {
    return `<button type="button" class="slot-picker slot-picker--empty" ${attrs}>${SEARCH_ICON}<span class="slot-picker-label">Search ${modeNoun(true)}…</span></button>`;
  }
  return `<button type="button" class="slot-picker" ${attrs}><span class="slot-picker-label">${escHTML(pickerLabel(currentId))}</span>${CHEVRON_ICON}</button>`;
}

// Everything the open picker can offer, in dropdown order. `brand` is what a
// typed brand name matches against: the item's own brand on the compare page
// and the homepage, the page's brand for cameras, the maker for lenses.
function pickerEntries() {
  const fromIndex = IS_EMBED && dataState !== 'ready';
  const groups = fromIndex ? NAME_INDEX_GROUPS : cfg().dropdownGroups;
  const items = fromIndex ? NAME_INDEX : cfg().items;
  const out = [];
  for (const grp of groups) {
    const group = grp.label.replace(/^[─\s]+|[─\s]+$/g, '');
    for (const id of grp.ids) {
      const it = items[id];
      if (!it || (activeMount && it.mount !== activeMount)) continue;
      const brand = IS_COMPARE ? brandNameOf(id)
        : currentMode === 'lenses' ? (it.manufacturer || BRAND_CONFIG.name) : BRAND_CONFIG.name;
      out.push({
        id, group, brand, name: it.name, year: it.year, discontinued: !!it.discontinued,
        label: IS_COMPARE ? withBrand(brand, it.name) : it.name,
      });
    }
  }
  return out;
}

// ─────────────────────────────────────────────
// SEARCH
//
// Matching ignores case, accents and punctuation ("xt5" finds X-T5), treats
// roman and arabic generation numbers alike ("a7 4", "a7iv" and "A7 IV" are
// one camera), drops "Mark" and a focal length's "mm", and lets a typed brand — even a prefix, "fuji" —
// narrow to that brand without having to appear in the model name.
// Pure functions: tests call them directly.
// ─────────────────────────────────────────────
const ROMAN = { ii: '2', iii: '3', iv: '4', v: '5', vi: '6', vii: '7', viii: '8' };

function searchTokens(text) {
  return String(text).toLowerCase()
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/α/g, 'a')
    .split(/[^a-z0-9.]+/)
    // Lens shorthand: "56mm" is 56 and "F1.4" is f + 1.4, so "56 1.4",
    // "56mm f1.4" and "56mm f/1.4" are the same three words.
    .flatMap(t => t.replace(/^\.+|\.+$/g, '').replace(/^(\d[\d.]*)mm$/, '$1').split(/^(f)(?=\d)/))
    .filter(t => t && t !== 'mark' && t !== 'mk');
}

// Two readings of the same tokens — as typed, and with generation numerals
// made arabic ("iv" → "4", "z6iii" → "z63") — each also squashed into one
// string for punctuation-blind comparison. Both sides of a match go through
// here, so the readings always line up.
function searchForms(tokens) {
  const arabic = tokens.map(t =>
    ROMAN[t] || t.replace(/^(.*\d)(viii|vii|vi|iv|v|iii|ii)$/, (_, head, r) => head + ROMAN[r]));
  const squash = ts => ts.join('').replace(/\./g, '');
  return [{ t: tokens, c: squash(tokens) }, { t: arabic, c: squash(arabic) }];
}

// Lower is better; Infinity is no match.
//   0 the whole name   1 the name starts with it (1.5 if mid-word)   2 every word is a word of the name
//   3 every word starts one (or only a brand was typed)   4 it appears inside the name
//   5 every word appears somewhere
function searchScore(entry, queryTokens) {
  const key = entry.searchKey || (entry.searchKey = {
    brand: searchTokens(entry.brand || ''),
    name: searchForms(searchTokens(entry.name)),
  });
  // A brand word is set aside rather than matched against the model name. Not
  // a single letter, though: the "C" of "Canon EOS R5 C" is part of the name.
  const rest = queryTokens.filter(t => !(t.length > 1 && key.brand.some(b => b.startsWith(t))));
  if (!rest.length) return 3;
  const query = searchForms(rest);
  let best = Infinity;
  for (let f = 0; f < 2; f++) {
    const { t: qt, c: qc } = query[f];
    const { t: nt, c: nc } = key.name[f];
    let score = Infinity;
    if (nc === qc) score = 0;
    // "23 f2" starts both "23mm f/2" and "23mm f/2.8"; only one has those words.
    else if (nc.startsWith(qc)) score = qt.every(t => nt.includes(t)) ? 1 : 1.5;
    else if (qt.every(t => nt.includes(t))) score = 2;
    else if (qt.every(t => nt.some(n => n.startsWith(t)))) score = 3;
    // Two characters turn up inside far too many names to mean anything.
    else if (qc.length > 2 && nc.includes(qc)) score = 4;
    else if (qt.every(t => nt.some(n => n.startsWith(t))
      || (t.replace(/\./g, '').length > 2 && nc.includes(t.replace(/\./g, ''))))) score = 5;
    if (score < best) best = score;
  }
  return best;
}

// Ranked matches. Ties go to what a shopper most likely means: current models
// before discontinued, newer before older, the shorter name, then list order.
function searchItems(entries, query) {
  const tokens = searchTokens(query);
  if (!tokens.length) return entries.slice();
  return entries
    .map((entry, order) => ({ entry, order, score: searchScore(entry, tokens) }))
    .filter(m => m.score !== Infinity)
    .sort((a, b) => a.score - b.score
      || a.entry.discontinued - b.entry.discontinued
      || (b.entry.year || 0) - (a.entry.year || 0)
      || a.entry.name.length - b.entry.name.length
      || a.order - b.order)
    .map(m => m.entry);
}

// ─────────────────────────────────────────────
// PICKER POPOVER
// One element for the whole page, created on first use and appended to
// <body>, so re-rendering the slots never destroys it mid-typing.
// ─────────────────────────────────────────────
const PICKER_MAX_RESULTS = 60;
let pickerSlot = null;    // the slot the popover is open for, or null
let pickerCache = null;   // pickerEntries(), kept while open so search keys are built once
let pickerShown = [];     // the entries listed right now, in order
let pickerActive = -1;    // index into pickerShown of the highlighted option
let pickerSearching = false;

function slotButton(slotIndex) {
  return document.querySelector(`.slot-picker[data-slot="${slotIndex}"]`);
}

function pickerEl() {
  let pop = document.getElementById('picker-pop');
  if (pop) return pop;
  pop = document.createElement('div');
  pop.id = 'picker-pop';
  pop.className = 'picker-pop';
  pop.hidden = true;
  pop.innerHTML = `<div class="picker-head">
    <input class="picker-input" id="picker-input" type="search" role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls="picker-list" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done">
    <button type="button" class="picker-cancel" id="picker-cancel">Cancel</button>
  </div>
  <ul class="picker-list" id="picker-list" role="listbox"></ul>`;
  document.body.appendChild(pop);

  const input = pop.querySelector('.picker-input');
  const list = pop.querySelector('.picker-list');
  input.addEventListener('input', renderPickerList);
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      movePickerActive(e.key === 'ArrowDown' ? 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (pickerActive >= 0) choosePickerOption(pickerActive);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closePicker(true);
    } else if (e.key === 'Tab') {
      closePicker(false);
    }
  });
  // Keep focus in the field while the list is clicked or scrolled by mouse.
  list.addEventListener('mousedown', e => e.preventDefault());
  list.addEventListener('click', e => {
    const opt = e.target.closest('.picker-option');
    if (opt) choosePickerOption(Number(opt.dataset.index));
  });
  pop.querySelector('.picker-cancel').addEventListener('click', () => closePicker(true));
  return pop;
}

function openPicker(slotIndex) {
  const pop = pickerEl();
  if (pickerSlot !== null) closePicker(false);
  pickerSlot = slotIndex;
  pickerCache = null;
  const input = pop.querySelector('.picker-input');
  input.value = '';
  input.placeholder = `Search ${modeNoun(true)}…`;
  input.setAttribute('aria-label', `Search ${modeNoun(true)}`);
  pop.querySelector('.picker-list').setAttribute('aria-label', modeNoun(true));
  pop.hidden = false;
  renderPickerList();
  positionPicker();
  const btn = slotButton(slotIndex);
  if (btn) btn.setAttribute('aria-expanded', 'true');
  input.focus();
  // Start fetching specs now: by the time a camera is chosen they are here.
  if (IS_EMBED) ensureData();
}

function closePicker(refocus) {
  if (pickerSlot === null) return;
  const btn = slotButton(pickerSlot);
  pickerSlot = null;
  pickerCache = null;
  pickerEl().hidden = true;
  if (btn) {
    btn.setAttribute('aria-expanded', 'false');
    if (refocus) btn.focus();
  }
}

function renderPickerList() {
  const pop = pickerEl();
  const list = pop.querySelector('.picker-list');
  const query = pop.querySelector('.picker-input').value;
  const entries = pickerCache || (pickerCache = pickerEntries());
  pickerSearching = searchTokens(query).length > 0;
  pickerShown = pickerSearching
    ? searchItems(entries, query).slice(0, PICKER_MAX_RESULTS)
    : entries;

  // As with the old <select>: an item showing in another slot can't be picked
  // twice, and only *visible* slots count.
  const ids = cfg().selectedIds();
  const current = ids[pickerSlot];
  const taken = new Set(ids.filter((id, i) => id && i !== pickerSlot && i < numSlots));

  let html = '';
  let group = null;
  pickerShown.forEach((e, i) => {
    if (!pickerSearching && e.group !== group) {
      group = e.group;
      html += `<li class="picker-group" role="presentation">${escHTML(group)}</li>`;
    }
    const off = taken.has(e.id);
    html += `<li class="picker-option" role="option" id="picker-opt-${i}" data-index="${i}" data-value="${escHTML(e.id)}"`
      + ` aria-selected="${e.id === current}"${off ? ' aria-disabled="true"' : ''}>`
      + `<span class="picker-option-name">${escHTML(e.label)}</span>`
      + `<span class="picker-option-meta">${off ? 'Added' : escHTML(e.year)}</span></li>`;
  });
  if (!pickerShown.length) {
    html = `<li class="picker-none" role="presentation">No ${modeNoun(true)} match “${escHTML(query.trim())}”.</li>`;
  }
  list.innerHTML = html;
  list.scrollTop = 0;

  // Typing: Enter takes the best match. Browsing: start at the current item.
  const enabled = i => i >= 0 && i < pickerShown.length && !taken.has(pickerShown[i].id);
  let start = pickerSearching
    ? pickerShown.findIndex((_, i) => enabled(i))
    : pickerShown.findIndex(e => e.id === current);
  setPickerActive(start, !pickerSearching);
}

function setPickerActive(index, scroll) {
  const pop = pickerEl();
  const input = pop.querySelector('.picker-input');
  const prev = pop.querySelector('.picker-option.active');
  if (prev) prev.classList.remove('active');
  pickerActive = index;
  const el = index >= 0 ? document.getElementById(`picker-opt-${index}`) : null;
  if (!el) { input.removeAttribute('aria-activedescendant'); pickerActive = -1; return; }
  el.classList.add('active');
  input.setAttribute('aria-activedescendant', el.id);
  if (scroll && typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'nearest' });
}

function movePickerActive(step) {
  const opts = [...pickerEl().querySelectorAll('.picker-option')];
  if (!opts.length) return;
  // From "nothing highlighted", Down lands on the first option and Up on the last.
  let i = pickerActive >= 0 ? pickerActive : (step > 0 ? -1 : 0);
  for (let n = 0; n < opts.length; n++) {
    i = (i + step + opts.length) % opts.length;
    if (opts[i].getAttribute('aria-disabled') !== 'true') { setPickerActive(i, true); return; }
  }
}

function choosePickerOption(index) {
  const entry = pickerShown[index];
  const el = document.getElementById(`picker-opt-${index}`);
  if (!entry || !el || el.getAttribute('aria-disabled') === 'true') return;
  const slotIndex = pickerSlot;
  const how = pickerSearching ? 'search' : 'browse';
  const unchanged = cfg().selectedIds()[slotIndex] === entry.id;
  closePicker(unchanged);
  if (unchanged) return;
  selectItem(slotIndex, entry.id, how);
  const btn = slotButton(slotIndex);
  if (btn) btn.focus();
}

// Desktop: a panel under the slot's button, kept inside the viewport. Phones:
// a full-screen sheet (CSS), sized to the *visual* viewport so the list ends
// at the on-screen keyboard instead of running underneath it.
function positionPicker() {
  if (pickerSlot === null) return;
  const pop = pickerEl();
  const btn = slotButton(pickerSlot);
  pop.style.cssText = '';
  if (window.innerWidth < 600) {
    const vv = window.visualViewport;
    if (vv) { pop.style.top = `${vv.offsetTop}px`; pop.style.height = `${vv.height}px`; }
    return;
  }
  if (!btn) return;
  const r = btn.getBoundingClientRect();
  const width = Math.min(360, window.innerWidth - 16);
  const left = Math.max(8, Math.min(r.left + r.width / 2 - width / 2, window.innerWidth - width - 8));
  const top = Math.max(8, r.bottom + 6);
  pop.style.width = `${width}px`;
  pop.style.left = `${left}px`;
  pop.style.top = `${top}px`;
  pop.style.maxHeight = `${Math.max(220, window.innerHeight - top - 12)}px`;
}

// Put `id` in a slot — the one path every pick takes.
let quickCompareSeen = 0;
function selectItem(slotIndex, id, how) {
  // The picker only blocks items held by *visible* slots, so the pick may be
  // sitting in a hidden one. Hand that slot the item this one gives up, or
  // revealing it later would show the same item twice.
  const ids = cfg().selectedIds();
  const holder = ids.indexOf(id);
  if (holder >= numSlots) cfg().setSelectedId(holder, ids[slotIndex]);
  cfg().setSelectedId(slotIndex, id);
  const named = cfg().items[id] || NAME_INDEX[id];
  track(`${currentMode === 'lenses' ? 'lens' : 'camera'}-swap:${trackKey(id)}`,
    `${brandNameOf(id)} ${named.name}`);
  // Typed or scrolled to: says whether the search field earns its place.
  track(`picker-pick:${trackPage()}:${how}`, `Picked by ${how}`);
  if (IS_EMBED) {
    // Once each per visit: the first camera, then the first real comparison.
    const filled = cfg().selectedIds().slice(0, numSlots).filter(Boolean).length;
    if (filled >= 1 && quickCompareSeen < 1) { quickCompareSeen = 1; track('quick-compare:first', 'Quick compare: first camera'); }
    if (filled >= 2 && quickCompareSeen < 2) { quickCompareSeen = 2; track('quick-compare:pair', 'Quick compare: two cameras'); }
    ensureData();
  }
  updateHash();
  renderAll();
}

// ─────────────────────────────────────────────
// RENDER PRICE (shared by slot and table)
// Rules:
//   1. Local-currency price available → show with local symbol + RRP label
//   2. Discontinued → show "Discontinued / Launch: USD $X" (no RRP label)
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
    return `<div class="slot-price discontinued">Discontinued<br><small>Launch: ${prices.USD != null ? `USD $${prices.USD.toLocaleString()}` : 'N/A'}</small></div>`;
  }
  if (prices.USD != null) {
    return `<div class="slot-price"><span class="price-rrp-label">RRP</span> ${usdTaggedHTML(prices.USD)}</div>`;
  }
  return `<div class="slot-price discontinued">Price unavailable</div>`;
}

// A USD figure shown while another currency is selected: always tagged, so a
// bare "$" can't read as A$, C$ or S$.
function usdTaggedHTML(usd) {
  return `<span title="No ${currentCurrency} price published; US list price shown"><small>USD</small> $${usd.toLocaleString()}</span>`;
}

// ─────────────────────────────────────────────
// RENDER SLOT HEADER
// ─────────────────────────────────────────────
function renderSlot(slotIndex) {
  const el = document.getElementById(`slot-${slotIndex}`);
  if (!el) return;
  const id = cfg().selectedIds()[slotIndex];
  const item = cfg().items[id];
  if (!item) {
    if (!IS_EMBED) return;
    // Homepage: nothing picked yet, or picked while its specs are in flight.
    if (!id) {
      el.innerHTML = `
    <button type="button" class="cam-image-wrap cam-image-wrap--empty" tabindex="-1" aria-hidden="true">+</button>
    ${buildPickerHTML(null, slotIndex)}`;
      return;
    }
    el.innerHTML = `
    <div class="cam-image-wrap cam-image-wrap--empty" aria-hidden="true"></div>
    ${buildPickerHTML(id, slotIndex)}
    <div class="slot-price discontinued" role="status">${dataState === 'error'
      ? 'Couldn’t load the specs. <button type="button" class="slot-retry">Try again</button>'
      : 'Loading specs…'}</div>`;
    return;
  }

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
    ${buildPickerHTML(id, slotIndex)}
    ${priceHTML}
    ${linkHTML}
  `;
}

// ─────────────────────────────────────────────
// COMPUTE WINNERS PER SPEC ROW
// ─────────────────────────────────────────────
function computeWinners(spec) {
  // An empty slot (homepage) has no item: it never wins, and it is not a
  // competitor either — `needsAll` means every *camera*, not every column.
  const items = cfg().selectedIds().slice(0, numSlots).map(id => cfg().items[id]);
  const none = items.map(() => false);
  const filled = items.filter(Boolean);
  // One column wins every row it has a value for, which is noise rather than
  // information. A single item happens under a mount filter that offers one,
  // and on the homepage after the first pick.
  if (filled.length < 2) return none;
  if (!spec.higherBetter && !spec.lowerBetter) return none;
  const nums = items.map(it => {
    const v = it ? spec.fn(it) : null;
    return typeof v === 'number' ? v : null;
  });
  if (nums.every(v => v === null)) return none;
  if (spec.needsAll && items.some((it, i) => it && nums[i] === null)) return none;
  const valid = nums.filter(v => v !== null);
  const best = spec.higherBetter ? Math.max(...valid) : Math.min(...valid);
  return nums.map(v => v !== null && v === best);
}

// ─────────────────────────────────────────────
// FORMAT SPEC VALUE
// ─────────────────────────────────────────────
function formatVal(spec, item) {
  // A slot can legitimately hold nothing (a brand with fewer items than slots),
  // and every spec fn dereferences its argument — so bail before calling it.
  if (!item) return '<span class="cross">—</span>';
  const raw = spec.fn(item);
  if (spec.type === 'boolean') {
    return raw
      ? `<span class="check">✓</span>`
      : `<span class="cross">—</span>`;
  }
  if (raw === null || raw === undefined) return (spec.fallback && spec.fallback(item)) || '<span class="cross">—</span>';
  if (spec.fmt && typeof raw === 'number') return spec.fmt(raw);
  return raw;
}

// ─────────────────────────────────────────────
// COLLECT REFERENCES
// Four fixed rows per item, sourced from the citation fields a refresh/
// price-check pass may have recorded: specSources[]/priceSource/imageSource
// (or imageCredit.source for a Commons photo), plus productUrl — which is
// populated on every item — as both its own row and the fallback that
// guarantees at least one reference always renders.
// ─────────────────────────────────────────────
const REFERENCE_ROWS = [
  { key: 'spec', label: 'Spec source' },
  { key: 'price', label: 'Price source' },
  { key: 'image', label: 'Image source' },
  { key: 'product', label: 'Product page' },
];

// A citation's reader-facing label: its `title` when a research pass
// recorded one, else the bare URL (scheme + leading www. stripped) so an
// untitled citation is still useful today. `note` is internal research
// commentary and is never used here.
function citationText(c) {
  return c.title || c.url.replace(/^https?:\/\/(www\.)?/, '');
}

function refHostname(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

function collectReferences(item) {
  const rows = { spec: [], price: [], image: [], product: [] };
  if (!item) return rows;

  // Matches the /cameras/ index-URL skip already used for the slot's View
  // Product link (renderSlot) so References never links a generic listing.
  const productUrl = (item.productUrl && !item.productUrl.endsWith('/cameras/'))
    ? item.productUrl : null;

  for (const c of (item.specSources || [])) {
    if (productUrl && c.url === productUrl) continue; // shown once, in Product page
    rows.spec.push({ text: citationText(c), url: c.url });
  }

  // One citation, or a list when several stores were read for the price.
  for (const c of [].concat(item.priceSource || [])) {
    rows.price.push({ text: citationText(c), url: c.url });
  }

  const imageSource = item.imageSource
    || (item.imageCredit && item.imageCredit.source ? { url: item.imageCredit.source } : null);
  if (imageSource) {
    rows.image.push({ text: citationText(imageSource), url: imageSource.url });
  }

  if (productUrl) {
    rows.product.push({ text: citationText({ url: productUrl }), url: productUrl });
  }

  return rows;
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
  return cfg().selectedIds().slice(0, numSlots).some(id => id && brandOf(id) === section.brand);
}

function renderRefLinks(refs, kind) {
  if (!refs.length) return `<span class="cross">—</span>`;
  return refs.map(r =>
    `<a class="ref-link" href="${r.url}" target="_blank" rel="noopener nofollow" title="${r.url}" data-ref-kind="${kind}">${r.text}</a>`
  ).join('');
}

// Always expanded (no toggle, no data-section): unlike other sections,
// this one isn't collapsible — see the renderTable() listener loop below,
// which deliberately excludes .refs-section headers.
function renderReferencesSection() {
  const refsPerSlot = [];
  for (let i = 0; i < numSlots; i++) {
    refsPerSlot.push(collectReferences(cfg().items[cfg().selectedIds()[i]]));
  }

  let html = `<div class="spec-section refs-section">
    <div class="section-header refs-header">
      <span class="section-title">References</span>
    </div>
    <div class="section-body">`;

  for (const row of REFERENCE_ROWS) {
    html += `<div class="spec-row">
      <div class="spec-label">${row.label}</div>`;
    for (let i = 0; i < numSlots; i++) {
      const slotHide = (i === 2 && numSlots < 3) ? ' slot-3-hide' : '';
      html += cfg().selectedIds()[i]
        ? `<div class="spec-value ref-cell${slotHide}">${renderRefLinks(refsPerSlot[i][row.key], row.key)}</div>`
        : `<div class="spec-value spec-value--empty${slotHide}"></div>`;
    }
    html += `</div>`;
  }

  html += `</div></div>`;
  return html;
}

function renderTable() {
  const table = document.getElementById('compare-table');
  let html = '';

  // Homepage: no table until something is picked and its specs have arrived.
  // The slot headers above say what is loading, or what went wrong.
  if (IS_EMBED) {
    const picked = cfg().selectedIds().slice(0, numSlots).filter(Boolean);
    const tools = document.getElementById('embed-tools');
    if (tools) tools.hidden = !picked.length;
    const reset = document.getElementById('embed-reset');
    if (reset) reset.hidden = !picked.length;
    const showing = picked.length > 0 && dataState === 'ready';
    // The slot row sticks to the top only while there is a table to scroll.
    document.getElementById('compare-header').classList.toggle('is-idle', !showing);
    if (!showing) { table.innerHTML = ''; return; }
  }

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
        const id = cfg().selectedIds()[i];
        const item = cfg().items[id];
        const winClass = winners[i] ? ' winner' : '';
        const slotHide = (i === 2 && numSlots < 3) ? ' slot-3-hide' : '';
        // An empty homepage slot keeps its column, blank — a dash would claim
        // a camera that lacks the feature.
        html += id
          ? `<div class="spec-value${winClass}${slotHide}">${formatVal(spec, item)}</div>`
          : `<div class="spec-value spec-value--empty${slotHide}"></div>`;
      }
      html += `</div>`;
    }

    html += `</div></div>`;
  }

  html += renderReferencesSection();

  table.innerHTML = html;

  // .refs-section is deliberately excluded — it has no toggle and stays
  // expanded (see renderReferencesSection()).
  document.querySelectorAll('.spec-section:not(.refs-section) > .section-header').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const id = hdr.dataset.section;
      const body = document.getElementById(`body-${id}`);
      const toggle = hdr.querySelector('.section-toggle');
      body.classList.toggle('collapsed');
      toggle.classList.toggle('open');
      // Which spec groups people open says what they actually compare on.
      track(`spec-section:${id}:${body.classList.contains('collapsed') ? 'close' : 'open'}`,
        `Spec section: ${id}`);
    });
  });
}

// ─────────────────────────────────────────────
// FULL RE-RENDER
// ─────────────────────────────────────────────
function renderAll() {
  document.documentElement.style.setProperty('--num-slots', numSlots);

  const filterSlot = document.getElementById('mount-filter-slot');
  if (filterSlot) filterSlot.innerHTML = buildMountFilterHTML();

  const countSlot = document.getElementById('slot-count-slot');
  if (countSlot) countSlot.innerHTML = buildSlotCountField();
  const countChips = document.getElementById('slot-count-chips');
  if (countChips) countChips.innerHTML = buildCountChips();

  for (let i = 0; i < MAX_SLOTS; i++) {
    const el = document.getElementById(`slot-${i}`);
    if (el) el.style.display = i < numSlots ? '' : 'none';
  }

  for (let i = 0; i < MAX_SLOTS; i++) renderSlot(i);
  renderTable();
  // A change that hides the slot the picker is open for takes the picker with it.
  if (pickerSlot !== null && pickerSlot >= numSlots) closePicker(false);
}

// Activating a mount replaces every slot holding an item from another mount
// with the first free item of the chosen one, in dropdown order, and leaves
// in-mount slots alone — so the table never contradicts the active chip.
// "All" swaps nothing, which is what keeps a deliberate cross-mount comparison
// (an S5 II against a GH7) reachable.
function swapOutOfMountSlots() {
  if (!activeMount) return false;
  const ids = cfg().selectedIds();
  const inMount = id => cfg().items[id] && cfg().items[id].mount === activeMount;
  const pool = itemsInMount(currentMode, activeMount).filter(id => !ids.includes(id));
  let changed = false;
  for (let i = 0; i < ids.length; i++) {
    if (inMount(ids[i])) continue;
    if (pool.length) {
      cfg().setSelectedId(i, pool.shift());
      changed = true;
      continue;
    }
    // No free item left: pull one forward from a later slot. The clamp keeps
    // the leftmost slots on screen, and a hidden slot holding the mount's only
    // item would otherwise leave a visible one showing an out-of-mount item.
    let j = ids.length - 1;
    while (j > i && !inMount(ids[j])) j--;
    if (j === i) break; // fewer items than slots; the clamp hides the rest
    const pulled = ids[j];
    cfg().setSelectedId(j, ids[i]);
    cfg().setSelectedId(i, pulled);
    changed = true;
  }
  return changed;
}

function applyMountFilter(mountId) {
  activeMount = mountId;
  const swapped = swapOutOfMountSlots();
  numSlots = getNumSlots();
  // The filter can change how many slots show, and the hash lists exactly those.
  if (swapped) updateHash(); else syncHash();
  renderAll();
}

// ─────────────────────────────────────────────
// EVENT LISTENERS
// ─────────────────────────────────────────────
function attachEventListeners() {
  // Delegated: the chip row is re-rendered on every mode switch and filter change.
  document.getElementById('mount-filter-slot')?.addEventListener('click', e => {
    const btn = e.target.closest('.mount-chip');
    if (!btn) return;
    const id = btn.dataset.mount || null;
    if (id === activeMount) return;
    track(`mount-filter:${BRAND_CONFIG.slug}:${id || 'all'}`, `Mount filter: ${btn.textContent}`);
    applyMountFilter(id);
  });

  // Delegated: slot headers are re-rendered on every change. A middle-click
  // opens the link too, so it counts; a right-click (also an auxclick) doesn't.
  // `a.slot-link` excludes the plain <span class="slot-link na"> placeholder.
  const onSlotLink = e => {
    if (e.type === 'auxclick' && e.button !== 1) return;
    const link = e.target.closest('.slot-buy, a.slot-link');
    if (!link) return;
    const slot = link.closest('.compare-slot');
    const id = slot && cfg().selectedIds()[Number(slot.id.replace('slot-', ''))];
    if (!id) return;
    const buy = link.classList.contains('slot-buy');
    track(`${buy ? 'buy-click' : 'view-product'}:tool:${trackKey(id)}`,
      `${buy ? 'Buy' : 'View'}: ${brandNameOf(id)} ${cfg().items[id].name}`);
  };
  document.getElementById('compare-header')?.addEventListener('click', onSlotLink);
  document.getElementById('compare-header')?.addEventListener('auxclick', onSlotLink);

  // Delegated, for the same reason. A slot's button (or, on the homepage, the
  // empty photo box above it) opens the picker; pressing it again closes it.
  document.getElementById('compare-header')?.addEventListener('click', e => {
    if (e.target.closest('.slot-retry')) {
      dataState = 'idle';
      ensureData();
      renderAll();
      return;
    }
    const opener = e.target.closest('.slot-picker, .cam-image-wrap--empty');
    const slot = opener && opener.closest('.compare-slot');
    if (!slot) return;
    const index = Number(slot.id.replace('slot-', ''));
    if (pickerSlot === index) closePicker(true); else openPicker(index);
  });
  document.getElementById('compare-header')?.addEventListener('keydown', e => {
    const btn = e.target.closest && e.target.closest('.slot-picker');
    if (!btn || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
    e.preventDefault();
    openPicker(Number(btn.dataset.slot));
  });
  // A press anywhere outside the open picker dismisses it.
  document.addEventListener('pointerdown', e => {
    if (pickerSlot === null) return;
    const t = e.target;
    if (t.closest && (t.closest('#picker-pop') || t.closest('.slot-picker, .cam-image-wrap--empty'))) return;
    closePicker(false);
  });
  window.addEventListener('scroll', positionPicker, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', positionPicker);
    window.visualViewport.addEventListener('scroll', positionPicker);
  }

  // Delegated on the table container, which persists across renderTable()
  // rebuilding its innerHTML (unlike .section-header, which is re-attached
  // per render since the whole element is recreated).
  document.getElementById('compare-table')?.addEventListener('click', e => {
    const link = e.target.closest('a.ref-link');
    if (!link) return;
    track(`reference-click:${link.dataset.refKind}:${refHostname(link.href)}`,
      `Reference: ${link.textContent}`);
  });

  document.getElementById('share-btn').addEventListener('click', shareComparison);

  document.getElementById('currency-select').addEventListener('change', e => {
    currentCurrency = e.target.value;
    track(`currency:${currentCurrency}`, `Currency: ${currentCurrency}`);
    renderAll();
  });

  // Delegated: the select is re-rendered whenever the mount filter changes what
  // counts it can honestly offer, so a listener bound to the element itself
  // would be orphaned after the first re-render.
  const setSlotChoice = n => {
    if (!n || n === slotChoice) return;
    slotChoice = n;
    numSlots = getNumSlots();
    updateHash();
    renderAll();
  };
  document.getElementById('slot-count-slot')?.addEventListener('change', e => {
    if (e.target.id === 'slot-count-select') setSlotChoice(parseInt(e.target.value, 10));
  });
  // Homepage: back to the empty state — every slot cleared, the chosen slot
  // count kept, the URL clean. Focus goes to the first search slot, which is
  // also what scrolls the (now much shorter) page back up to the tool.
  document.getElementById('reset-btn')?.addEventListener('click', () => {
    closePicker(false);
    selectedCameraIds = selectedCameraIds.map(() => null);
    track('quick-compare:reset', 'Quick compare: reset');
    updateHash();
    renderAll();
    const first = slotButton(0);
    if (first) first.focus();
  });
  // Homepage: the same choice as visible buttons.
  document.getElementById('slot-count-chips')?.addEventListener('click', e => {
    const chip = e.target.closest('.count-chip');
    if (chip) setSlotChoice(parseInt(chip.dataset.count, 10));
  });

  document.getElementById('mode-toggle')?.addEventListener('click', e => {
    const btn = e.target.closest('.mode-btn');
    if (!btn || btn.dataset.mode === currentMode) return;
    currentMode = btn.dataset.mode;
    track(`mode-switch:${trackPage()}:${currentMode}`, `Mode: ${btn.textContent}`);
    if (!IS_COMPARE) slotChoice = brandSlotChoice(currentMode);
    // A mount with no chip in the destination mode cannot stay active — Sigma's
    // SA-Mount has bodies but no lenses, so switching to Lenses drops to "All".
    if (activeMount && !mountsForMode(currentMode).some(m => m.id === activeMount)) {
      activeMount = null;
    }
    // Each mode carries its own selection, and the destination mode's defaults
    // are not necessarily in the active mount — without this the pickers fall
    // back to their first option (showing one lens twice) while the spec table
    // below still reads the untouched, out-of-mount ids.
    swapOutOfMountSlots();
    numSlots = getNumSlots();
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
    // count.js sends with sendBeacon, so the event survives the navigation.
    if (slug === '__compare') {
      if (!IS_COMPARE) {
        track(`brand-switch:${trackPage()}:compare`, 'Brand switch: All brands');
        location.href = `../compare/`;
      }
      return;
    }
    if (!slug || slug === BRAND_CONFIG.slug) return;
    track(`brand-switch:${trackPage()}:${slug}`, `Brand switch: ${slug}`);
    localStorage.setItem('brand', slug);
    location.href = `../${slug}/${brandSwitchHash()}`;
  });

  window.addEventListener('resize', () => {
    const n = getNumSlots();
    if (n !== numSlots) {
      numSlots = n;
      syncHash();
      renderAll();
    }
    positionPicker();
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

  // Restore mode + selection from the hash
  const initial = parseHash(location.hash);
  const restoresLenses = initial.mode === 'lenses' && !IS_COMPARE;
  if (restoresLenses) {
    currentMode = 'lenses';
    slotChoice = brandSlotChoice('lenses');
    document.querySelectorAll('.mode-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === 'lenses');
    });
    document.getElementById('hero-eyebrow').textContent = cfg().heroEyebrow;
    document.getElementById('hero-title').innerHTML = cfg().heroTitle;
    document.getElementById('hero-subtitle').textContent = cfg().heroSubtitle;
    document.getElementById('header-title').textContent = cfg().headerTitle;
  }
  // A selection hash names what was on screen, so its entry count is the slot
  // count — it overrides the mode's default.
  const restored = initial.ids && (initial.mode === 'cameras' || restoresLenses);
  if (restored) {
    if (initial.mode === 'cameras') selectedCameraIds = initial.ids;
    else selectedLensIds = initial.ids;
    slotChoice = initial.count;
  }

  numSlots = getNumSlots();
  // Rewritten only when the screen can't show what the link names — a phone
  // opening a three-item link shows two, and the URL says so. A link that
  // fits is left exactly as it arrived.
  if (restored && initial.given !== numSlots) updateHash();
  attachEventListeners();
  renderAll();
  // Homepage opened from a shared link: its cameras are named, not yet loaded.
  if (IS_EMBED && restored) ensureData();
})();
