// ─────────────────────────────────────────────
// PANASONIC BRAND CONFIG
// ─────────────────────────────────────────────
const BRAND_CONFIG = {
  name:        'Panasonic',
  slug:        'panasonic',
  accentColor: '#0046ad',
  heroDark:    '#0a1530',
  logoText:    'LUMIX',
  logoAccent:  '',
  families:    ['Lumix S (L-Mount)', 'Lumix G (Micro Four Thirds)'],
  brandSections: ['panasonic'],
  cameras: {
    heroEyebrow:  'Lumix S & G',
    heroTitle:    '<span>Panasonic</span> Camera Comparison',
    heroSubtitle: 'Compare up to 3 Panasonic Lumix cameras side-by-side — full-frame L-Mount and Micro Four Thirds',
    headerTitle:  'Camera Compare',
    defaultSelected: ['s5-ii', 's1r-ii', 'gh7'],
  },
  lenses: {
    heroEyebrow:  'LUMIX S & G Lenses',
    heroTitle:    '<span>Panasonic</span> Lens Comparison',
    heroSubtitle: 'Compare Panasonic LUMIX S (L-Mount) and LUMIX G (MFT) lenses side-by-side',
    headerTitle:  'Lens Compare',
    defaultSelected: ['lumix-s-50mm-f1-8', 'lumix-s-24-70mm-f2-8-pro', 'lumix-g-12-35mm-f2-8-ii'],
  },
  footerLinks: [
    { label: 'LUMIX S Series',   url: 'https://www.panasonic.com/global/consumer/lumix/s.html' },
    { label: 'LUMIX G Series',   url: 'https://www.panasonic.com/global/consumer/lumix/g.html' },
    { label: 'DPReview Panasonic', url: 'https://www.dpreview.com/products/panasonic' },
  ],
};

const REGISTERED_BRANDS = [
  { slug: 'fujifilm',  name: 'Fujifilm' },
  { slug: 'canon',     name: 'Canon' },
  { slug: 'sony',      name: 'Sony' },
  { slug: 'nikon',     name: 'Nikon' },
  { slug: 'panasonic', name: 'Panasonic' },
];

// ─────────────────────────────────────────────
// SERIES COLORS (for camera placeholder cards) — Lumix/Panasonic blue
// ─────────────────────────────────────────────
const SERIES_COLORS = {
  'Lumix S (Full-frame)': { bg: '#0a1530', text: '#6fa8ff' },
  'Lumix GH (MFT)':       { bg: '#0a1228', text: '#7fb0ff' },
  'Lumix G (MFT)':        { bg: '#0c1426', text: '#8ab4ff' },
};

// ─────────────────────────────────────────────
// CAMERA DATABASE — Panasonic Lumix mirrorless (L-Mount + Micro Four Thirds).
// Panasonic-specific fields: vLog (V-Log / V-Log L gamma), dualNativeIso
// (Dual Native ISO sensor tech), openGate (Open Gate full-sensor max capture),
// proResInternal (internal Apple ProRes / ProRes RAW recording).
// Pricing: USD is the list/RRP; non-USD figures are APPROXIMATE RRPs derived
// from USD via regional ratios (refined as real RRP surfaces). Specs verified
// against Panasonic official pages + DPReview/Wikipedia (see
// openspec/changes/add-panasonic-brand/research/).
// ─────────────────────────────────────────────
const CAMERAS = {

  /* ── Lumix S (Full-frame L-Mount) ── */
  's1r-ii': {
    name:'Lumix S1R II', series:'Lumix S (Full-frame)', year:2025, discontinued:false,
    tagline:'44MP High-Res 8K Hybrid',
    productUrl:'https://shop.panasonic.com/products/lumix-s1rii-full-frame-mirrorless-digital-camera-dc-s1rm2',
    imageUrl:null,
    asin:null,
    prices:{USD:3299,AUD:5299,EUR:3829,GBP:3149,JPY:545000,CAD:4549,SGD:4699},
    sensorMP:44.3, sensorType:'Full-frame BSI CMOS', processor:'Venus Engine',
    width:134.3, height:102.3, depth:91.8, weight:795, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:1840, lcdType:'Tilt & Free-angle Touch',
    evfType:'EVF', evfDots:5.76, evfMag:0.78,
    faceDetection:true, subjectDetection:'Human / Animal / Car / Motorcycle / Train / Airplane',
    ibis:true, ibisStops:8.0, maxBurst:40,
    maxVideoRes:'8.1K / 30P',
    logVideo:true,
    vLog:'V-Log', dualNativeIso:true, openGate:'6.4K', proResInternal:true,
    bluetooth:'5.0', wifi:true,
    cardSlots:'1× CFexpress Type B + 1× SD UHS-II', batteryLife:350, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

  's5-ii': {
    name:'Lumix S5 II', series:'Lumix S (Full-frame)', year:2023, discontinued:false,
    tagline:'Phase-Detect Hybrid Full-Frame',
    productUrl:'https://shop.panasonic.com/products/full-frame-mirrorless-camera-s5m2',
    imageUrl:null,
    asin:null,
    prices:{USD:1999,AUD:3199,EUR:2299,GBP:1899,JPY:330000,CAD:2749,SGD:2849},
    sensorMP:24.2, sensorType:'Full-frame CMOS', processor:'Venus Engine',
    width:134.3, height:102.3, depth:90.1, weight:740, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:1840, lcdType:'Free-angle Touch',
    evfType:'EVF', evfDots:3.68, evfMag:0.78,
    faceDetection:true, subjectDetection:'Human / Animal (face / eye / body)',
    ibis:true, ibisStops:6.5, maxBurst:30,
    maxVideoRes:'6K / 30P (3:2 Open Gate)',
    logVideo:true,
    vLog:'V-Log / V-Log L', dualNativeIso:true, openGate:'6K', proResInternal:false,
    bluetooth:'5.0', wifi:true,
    cardSlots:'2× SD UHS-II', batteryLife:370, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

  /* ── Lumix GH (Micro Four Thirds) ── */
  'gh7': {
    name:'Lumix GH7', series:'Lumix GH (MFT)', year:2024, discontinued:false,
    tagline:'ProRes RAW Video Flagship',
    productUrl:'https://shop.panasonic.com/products/gh7-mirrorless-camera',
    imageUrl:null,
    asin:null,
    prices:{USD:2199,AUD:3499,EUR:2549,GBP:2099,JPY:363000,CAD:3049,SGD:3149},
    sensorMP:25.2, sensorType:'Micro Four Thirds BSI CMOS', processor:'Venus Engine',
    width:138.4, height:100.3, depth:99.6, weight:805, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:1840, lcdType:'Free-angle Touch',
    evfType:'EVF', evfDots:3.68, evfMag:0.76,
    faceDetection:true, subjectDetection:'Human / Animal / Car / Motorcycle',
    ibis:true, ibisStops:7.5, maxBurst:75,
    maxVideoRes:'5.7K / 30P (Open Gate)',
    logVideo:true,
    vLog:'V-Log / V-Gamut', dualNativeIso:true, openGate:'5.8K', proResInternal:true,
    bluetooth:'5.0', wifi:true,
    cardSlots:'1× CFexpress Type B + 1× SD UHS-II', batteryLife:360, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

  /* ── Lumix G (Micro Four Thirds) ── */
  'g9-ii': {
    name:'Lumix G9 II', series:'Lumix G (MFT)', year:2023, discontinued:false,
    tagline:'Phase-Detect MFT Photo Flagship',
    productUrl:'https://shop.panasonic.com/products/lumix-g9ii-micro-four-thirds-camera-dc-g9m2',
    imageUrl:null,
    asin:null,
    prices:{USD:1899,AUD:2999,EUR:2199,GBP:1799,JPY:313000,CAD:2599,SGD:2699},
    sensorMP:25.2, sensorType:'Micro Four Thirds BSI CMOS', processor:'Venus Engine',
    width:134.3, height:102.3, depth:90.1, weight:658, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:1840, lcdType:'Free-angle Touch',
    evfType:'EVF', evfDots:3.68, evfMag:0.80,
    faceDetection:true, subjectDetection:'Human / Animal / Car / Motorcycle',
    ibis:true, ibisStops:8.0, maxBurst:60,
    maxVideoRes:'5.8K / 30P (Open Gate)',
    logVideo:true,
    vLog:'V-Log / V-Gamut', dualNativeIso:true, openGate:'5.8K', proResInternal:false,
    bluetooth:'5.0', wifi:true,
    cardSlots:'2× SD UHS-II', batteryLife:390, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

};

const CAMERA_ORDER = [
  's1r-ii', 's5-ii',
  'gh7',
  'g9-ii',
];

const DROPDOWN_GROUPS = [
  { label: '── Lumix S — Full-Frame (L-Mount) ──', ids: ['s1r-ii', 's5-ii'] },
  { label: '── Lumix GH — Micro Four Thirds ──',   ids: ['gh7'] },
  { label: '── Lumix G — Micro Four Thirds ──',    ids: ['g9-ii'] },
];

// ─────────────────────────────────────────────
// LENS DATABASE — Panasonic LUMIX (first-party only; Leica DG are
// Leica-designed / Panasonic-made → manufacturer 'Panasonic').
// line: 'LUMIX S' (L-Mount, full-frame) | 'LUMIX G' (MFT, 2.0× crop equiv).
// `priceIncomplete: true` ships an item with USD (+ any confirmed regional)
// while regional RRP backfill is pending (see check-prices-and-buy-links).
// ─────────────────────────────────────────────
const LENSES = {

  /* ── LUMIX S Primes (L-Mount, full-frame) ── */
  'lumix-s-50mm-f1-8': {
    name:'LUMIX S 50mm F1.8', manufacturer:'Panasonic', line:'LUMIX S', type:'Prime', asin:null,
    focalLength:50, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'50mm',
    maxAperture:1.8, minAperture:22, weight:300, length:82.0, diameter:73.6,
    filterThread:67, minFocusDist:45, maxMagnification:0.14,
    elements:9, groups:8, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2021, discontinued:false,
    imageUrl:null,
    prices:{USD:447,AUD:699,EUR:null,GBP:null,JPY:null,CAD:599,SGD:null},
    priceIncomplete:true,
    productUrl:'https://shop.panasonic.com/products/lumix-s-50mm-f1-8-l-mount-interchangeable-lens-s-s50',
  },

  /* ── LUMIX S Zooms (L-Mount, full-frame) ── */
  'lumix-s-24-70mm-f2-8-pro': {
    name:'LUMIX S PRO 24-70mm F2.8', manufacturer:'Panasonic', line:'LUMIX S', type:'Zoom', asin:null,
    focalLength:null, focalLengthMin:24, focalLengthMax:70, focalLengthEquiv:'24-70mm',
    maxAperture:2.8, minAperture:22, weight:935, length:140.0, diameter:90.9,
    filterThread:82, minFocusDist:37, maxMagnification:0.25,
    elements:18, groups:16, blades:11, afType:'Linear Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2020, discontinued:false,
    imageUrl:null,
    prices:{USD:2197,AUD:3399,EUR:null,GBP:null,JPY:null,CAD:2899,SGD:null},
    priceIncomplete:true,
    productUrl:'https://shop.panasonic.com/products/lumix-s-pro-24-70mm-f2-8-l-mount-lens-s-e2470',
  },

  /* ── LUMIX G Zooms (Micro Four Thirds) ── */
  'lumix-g-12-35mm-f2-8-ii': {
    name:'LUMIX G X Vario 12-35mm F2.8 II O.I.S.', manufacturer:'Panasonic', line:'LUMIX G', type:'Zoom', asin:null,
    focalLength:null, focalLengthMin:12, focalLengthMax:35, focalLengthEquiv:'24-70mm',
    maxAperture:2.8, minAperture:22, weight:305, length:73.8, diameter:67.6,
    filterThread:58, minFocusDist:25, maxMagnification:0.17,
    elements:14, groups:9, blades:7, afType:'Stepping Motor',
    weatherSealed:true, ois:true, oisStops:null, year:2017, discontinued:false,
    imageUrl:null,
    prices:{USD:799,AUD:1299,EUR:null,GBP:null,JPY:null,CAD:1099,SGD:null},
    priceIncomplete:true,
    productUrl:'https://shop.panasonic.com/products/lumix-g-x-vario-12-35mm-f2-8-ii-lens-h-hsa12035',
  },

};

const LENS_DROPDOWN_GROUPS = [
  { label: '── LUMIX S Primes (L-Mount) ──', ids: ['lumix-s-50mm-f1-8'] },
  { label: '── LUMIX S Zooms (L-Mount) ──',  ids: ['lumix-s-24-70mm-f2-8-pro'] },
  { label: '── LUMIX G Zooms (MFT) ──',      ids: ['lumix-g-12-35mm-f2-8-ii'] },
];
