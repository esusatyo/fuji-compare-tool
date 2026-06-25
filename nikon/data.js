// ─────────────────────────────────────────────
// NIKON BRAND CONFIG
// ─────────────────────────────────────────────
const BRAND_CONFIG = {
  name:        'Nikon',
  slug:        'nikon',
  accentColor: '#ffd200',
  heroDark:    '#1a1700',
  logoText:    'Nikon',
  logoAccent:  '',
  families:    ['Z System'],
  brandSections: ['nikon'],
  cameras: {
    heroEyebrow:  'Z System',
    heroTitle:    '<span>Nikon</span> Camera Comparison',
    heroSubtitle: 'Compare up to 3 Nikon Z cameras side-by-side across the full lineup',
    headerTitle:  'Camera Compare',
    defaultSelected: ['z8', 'z6-iii', 'z50-ii'],
  },
  lenses: {
    heroEyebrow:  'Z Mount Lenses',
    heroTitle:    '<span>Nikon</span> Lens Comparison',
    heroSubtitle: 'Compare NIKKOR Z mount lenses side-by-side',
    headerTitle:  'Lens Compare',
    defaultSelected: ['z-50mm-f1-8-s', 'z-24-70mm-f2-8-s', 'z-70-200mm-f2-8-vr-s'],
  },
  footerLinks: [
    { label: 'Nikon Z System', url: 'https://www.nikonusa.com/en/nikon-products/mirrorless-cameras.page' },
    { label: 'DPReview Nikon', url: 'https://www.dpreview.com/products/nikon' },
    { label: 'Nikon Rumors',   url: 'https://nikonrumors.com' },
  ],
};

const REGISTERED_BRANDS = [
  { slug: 'fujifilm', name: 'Fujifilm' },
  { slug: 'canon',    name: 'Canon' },
  { slug: 'sony',     name: 'Sony' },
  { slug: 'nikon',    name: 'Nikon' },
];

// ─────────────────────────────────────────────
// SERIES COLORS (for camera placeholder cards) — Nikon yellow on near-black
// ─────────────────────────────────────────────
const SERIES_COLORS = {
  'Z (Full-frame)': { bg: '#1a1700', text: '#ffd54a' },
  'Z (APS-C)':      { bg: '#171400', text: '#e6c64a' },
  'Z (Retro)':      { bg: '#1f1a08', text: '#f0d27a' },
};

// ─────────────────────────────────────────────
// CAMERA DATABASE — Nikon Z mirrorless.
// Nikon-specific fields: expeed (processor gen), nRaw (internal N-RAW max res),
// pixelShift (High-Res Pixel Shift max output), preCapture (Pre-Release Capture).
// Pricing: USD is the exact launch/list RRP. Non-USD figures are APPROXIMATE RRPs
// derived from USD via regional ratios (refined as real RRP surfaces). Specs
// verified against Nikon official pages + DPReview/Wikipedia (see
// openspec/changes/add-nikon-brand/research/).
// ─────────────────────────────────────────────
const CAMERAS = {

  /* ── Z Full-frame ── */
  'z9': {
    name:'Z9', series:'Z (Full-frame)', year:2021, discontinued:false,
    tagline:'Stacked-Sensor Pro Flagship',
    productUrl:'https://www.nikonusa.com/en/nikon-products/product/mirrorless-cameras/z-9.html',
    imageUrl:null,
    asin:null,
    prices:{USD:5499,AUD:8799,EUR:6399,GBP:5299,JPY:900000,CAD:7599,SGD:7799},
    sensorMP:45.7, sensorType:'Full-frame Stacked BSI CMOS', processor:'EXPEED 7',
    width:149.0, height:149.5, depth:90.5, weight:1340, weatherSealed:true,
    lcdSize:'3.2"', lcdDots:2089, lcdType:'4-axis Tilting',
    evfType:'EVF', evfDots:3.69, evfMag:0.80,
    faceDetection:true, subjectDetection:'9 types (People / Animals / Birds / Vehicles / Aircraft)',
    ibis:true, ibisStops:6.0, maxBurst:20,
    maxVideoRes:'8.3K / 60P RAW',
    logVideo:true,
    expeed:'EXPEED 7', nRaw:'8.3K', pixelShift:'180MP', preCapture:true,
    bluetooth:'5.0', wifi:true,
    cardSlots:'2× CFexpress Type B', batteryLife:700, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

  'z8': {
    name:'Z8', series:'Z (Full-frame)', year:2023, discontinued:false,
    tagline:'Z9 Power in a Smaller Body',
    productUrl:'https://www.nikonusa.com/en/nikon-products/product/mirrorless-cameras/z-8.html',
    imageUrl:null,
    asin:null,
    prices:{USD:3999,AUD:6399,EUR:4649,GBP:3799,JPY:660000,CAD:5499,SGD:5699},
    sensorMP:45.7, sensorType:'Full-frame Stacked BSI CMOS', processor:'EXPEED 7',
    width:144.0, height:118.5, depth:83.0, weight:910, weatherSealed:true,
    lcdSize:'3.2"', lcdDots:2089, lcdType:'4-axis Tilting',
    evfType:'EVF', evfDots:3.69, evfMag:0.80,
    faceDetection:true, subjectDetection:'9 types (People / Animals / Birds / Vehicles / Aircraft)',
    ibis:true, ibisStops:6.0, maxBurst:20,
    maxVideoRes:'8.3K / 60P RAW',
    logVideo:true,
    expeed:'EXPEED 7', nRaw:'8.3K', pixelShift:'180MP', preCapture:true,
    bluetooth:'5.0', wifi:true,
    cardSlots:'1× CFexpress Type B + 1× SD UHS-II', batteryLife:340, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

  'z6-iii': {
    name:'Z6 III', series:'Z (Full-frame)', year:2024, discontinued:false,
    tagline:'World-First Partially-Stacked Sensor',
    productUrl:'https://www.nikonusa.com/en/nikon-products/product/mirrorless-cameras/z-6iii.html',
    imageUrl:null,
    asin:null,
    prices:{USD:2499,AUD:3999,EUR:2899,GBP:2399,JPY:412000,CAD:3399,SGD:3549},
    sensorMP:24.5, sensorType:'Full-frame Partially-Stacked BSI CMOS', processor:'EXPEED 7',
    width:138.5, height:101.5, depth:74.0, weight:760, weatherSealed:true,
    lcdSize:'3.2"', lcdDots:2100, lcdType:'Vari-angle',
    evfType:'EVF', evfDots:5.76, evfMag:0.80,
    faceDetection:true, subjectDetection:'9 types (People / Animals / Birds / Vehicles / Aircraft)',
    ibis:true, ibisStops:8.0, maxBurst:20,
    maxVideoRes:'6K / 60P RAW',
    logVideo:true,
    expeed:'EXPEED 7', nRaw:'6K', pixelShift:'96MP', preCapture:true,
    bluetooth:'5.0', wifi:true,
    cardSlots:'1× CFexpress Type B + 1× SD UHS-II', batteryLife:360, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

  'z5-ii': {
    name:'Z5 II', series:'Z (Full-frame)', year:2025, discontinued:false,
    tagline:'EXPEED 7 Full-Frame Entry Point',
    productUrl:'https://www.nikonusa.com/en/nikon-products/product/mirrorless-cameras/z5-ii.html',
    imageUrl:null,
    asin:null,
    prices:{USD:1697,AUD:2699,EUR:1999,GBP:1599,JPY:280000,CAD:2299,SGD:2399},
    sensorMP:24.5, sensorType:'Full-frame BSI CMOS', processor:'EXPEED 7',
    width:134.0, height:100.5, depth:72.0, weight:700, weatherSealed:true,
    lcdSize:'3.2"', lcdDots:2100, lcdType:'Vari-angle',
    evfType:'EVF', evfDots:3.69, evfMag:0.80,
    faceDetection:true, subjectDetection:'9 types (People / Animals / Birds / Vehicles / Aircraft)',
    ibis:true, ibisStops:7.5, maxBurst:14,
    maxVideoRes:'4K / 60P',
    logVideo:true,
    expeed:'EXPEED 7', nRaw:null, pixelShift:'96MP', preCapture:true,
    bluetooth:'5.0', wifi:true,
    cardSlots:'2× SD UHS-II', batteryLife:330, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

  /* ── Z Full-frame (discontinued) ── USD-only pricing; asin null → search link */
  'z7-ii': {
    name:'Z7 II', series:'Z (Full-frame)', year:2020, discontinued:true,
    tagline:'High-Res Dual-Processor',
    productUrl:'https://www.nikonusa.com/en/nikon-products/product/mirrorless-cameras/z-7ii.html',
    imageUrl:null, asin:null,
    prices:{USD:2999,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    sensorMP:45.7, sensorType:'Full-frame BSI CMOS', processor:'Dual EXPEED 6',
    width:134.0, height:100.5, depth:69.5, weight:705, weatherSealed:true,
    lcdSize:'3.2"', lcdDots:2100, lcdType:'Tilting',
    evfType:'EVF', evfDots:3.69, evfMag:0.80,
    faceDetection:true, subjectDetection:'Eye / Animal',
    ibis:true, ibisStops:5.0, maxBurst:10,
    maxVideoRes:'4K / 60P',
    logVideo:true,
    expeed:'EXPEED 6', nRaw:null, pixelShift:null, preCapture:false,
    bluetooth:'5.0', wifi:true,
    cardSlots:'1× CFexpress Type B + 1× SD UHS-II', batteryLife:420, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

  'z7': {
    name:'Z7', series:'Z (Full-frame)', year:2018, discontinued:true,
    tagline:'First High-Res Z Body',
    productUrl:'https://www.nikonusa.com/en/nikon-products/product/mirrorless-cameras/z-7.html',
    imageUrl:null, asin:null,
    prices:{USD:3399,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    sensorMP:45.7, sensorType:'Full-frame BSI CMOS', processor:'EXPEED 6',
    width:134.0, height:100.5, depth:67.5, weight:675, weatherSealed:true,
    lcdSize:'3.2"', lcdDots:2100, lcdType:'Tilting',
    evfType:'EVF', evfDots:3.69, evfMag:0.80,
    faceDetection:true, subjectDetection:'Eye / Animal',
    ibis:true, ibisStops:5.0, maxBurst:9,
    maxVideoRes:'4K / 30P',
    logVideo:true,
    expeed:'EXPEED 6', nRaw:null, pixelShift:null, preCapture:false,
    bluetooth:'4.2', wifi:true,
    cardSlots:'1× CFexpress / XQD', batteryLife:330, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

  'z6-ii': {
    name:'Z6 II', series:'Z (Full-frame)', year:2020, discontinued:true,
    tagline:'Dual-Processor All-Rounder',
    productUrl:'https://www.nikonusa.com/en/nikon-products/product/mirrorless-cameras/z-6ii.html',
    imageUrl:null, asin:null,
    prices:{USD:1999,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    sensorMP:24.5, sensorType:'Full-frame BSI CMOS', processor:'Dual EXPEED 6',
    width:134.0, height:100.5, depth:69.5, weight:705, weatherSealed:true,
    lcdSize:'3.2"', lcdDots:2100, lcdType:'Tilting',
    evfType:'EVF', evfDots:3.69, evfMag:0.80,
    faceDetection:true, subjectDetection:'Eye / Animal',
    ibis:true, ibisStops:5.0, maxBurst:14,
    maxVideoRes:'4K / 60P',
    logVideo:true,
    expeed:'EXPEED 6', nRaw:null, pixelShift:null, preCapture:false,
    bluetooth:'5.0', wifi:true,
    cardSlots:'1× CFexpress Type B + 1× SD UHS-II', batteryLife:410, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

  'z6': {
    name:'Z6', series:'Z (Full-frame)', year:2018, discontinued:true,
    tagline:'The Original 24MP Z',
    productUrl:'https://www.nikonusa.com/en/nikon-products/product/mirrorless-cameras/z-6.html',
    imageUrl:null, asin:null,
    prices:{USD:1999,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    sensorMP:24.5, sensorType:'Full-frame BSI CMOS', processor:'EXPEED 6',
    width:134.0, height:100.5, depth:67.5, weight:675, weatherSealed:true,
    lcdSize:'3.2"', lcdDots:2100, lcdType:'Tilting',
    evfType:'EVF', evfDots:3.69, evfMag:0.80,
    faceDetection:true, subjectDetection:'Eye / Animal',
    ibis:true, ibisStops:5.0, maxBurst:12,
    maxVideoRes:'4K / 30P',
    logVideo:true,
    expeed:'EXPEED 6', nRaw:null, pixelShift:null, preCapture:false,
    bluetooth:'4.2', wifi:true,
    cardSlots:'1× CFexpress / XQD', batteryLife:310, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

  'z5': {
    name:'Z5', series:'Z (Full-frame)', year:2020, discontinued:true,
    tagline:'Full-Frame Entry (Original)',
    productUrl:'https://www.nikonusa.com/en/nikon-products/product/mirrorless-cameras/z-5.html',
    imageUrl:null, asin:null,
    prices:{USD:1399,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    sensorMP:24.3, sensorType:'Full-frame CMOS', processor:'EXPEED 6',
    width:134.0, height:100.5, depth:69.5, weight:675, weatherSealed:true,
    lcdSize:'3.2"', lcdDots:1040, lcdType:'Tilting',
    evfType:'EVF', evfDots:3.69, evfMag:0.80,
    faceDetection:true, subjectDetection:'Eye / Animal',
    ibis:true, ibisStops:5.0, maxBurst:4.5,
    maxVideoRes:'4K / 30P (1.7× crop)',
    logVideo:false,
    expeed:'EXPEED 6', nRaw:null, pixelShift:null, preCapture:false,
    bluetooth:'5.0', wifi:true,
    cardSlots:'2× SD UHS-II', batteryLife:470, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

  /* ── Z APS-C (DX) ── */
  'z50-ii': {
    name:'Z50 II', series:'Z (APS-C)', year:2024, discontinued:false,
    tagline:'EXPEED 7 Comes to DX',
    productUrl:'https://www.nikonusa.com/en/nikon-products/product/mirrorless-cameras/z50-ii.html',
    imageUrl:null,
    asin:null,
    prices:{USD:907,AUD:1449,EUR:1049,GBP:849,JPY:150000,CAD:1249,SGD:1299},
    sensorMP:20.9, sensorType:'APS-C (DX) CMOS', processor:'EXPEED 7',
    width:127.0, height:96.8, depth:66.5, weight:550, weatherSealed:false,
    lcdSize:'3.2"', lcdDots:1040, lcdType:'Vari-angle',
    evfType:'EVF', evfDots:2.36, evfMag:1.02,
    faceDetection:true, subjectDetection:'9 types (People / Animals / Birds / Vehicles / Aircraft)',
    ibis:false, ibisStops:null, maxBurst:11,
    maxVideoRes:'4K / 60P',
    logVideo:true,
    expeed:'EXPEED 7', nRaw:null, pixelShift:null, preCapture:true,
    bluetooth:'5.0', wifi:true,
    cardSlots:'1× SD UHS-II', batteryLife:230, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

  'z50': {
    name:'Z50', series:'Z (APS-C)', year:2019, discontinued:true,
    tagline:'First DX Z Body',
    productUrl:'https://www.nikonusa.com/en/nikon-products/product/mirrorless-cameras/z-50.html',
    imageUrl:null, asin:null,
    prices:{USD:860,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    sensorMP:20.9, sensorType:'APS-C (DX) CMOS', processor:'EXPEED 6',
    width:126.5, height:93.5, depth:60.0, weight:450, weatherSealed:false,
    lcdSize:'3.2"', lcdDots:1040, lcdType:'Tilting',
    evfType:'EVF', evfDots:2.36, evfMag:1.02,
    faceDetection:true, subjectDetection:'Eye / Animal',
    ibis:false, ibisStops:null, maxBurst:11,
    maxVideoRes:'4K / 30P',
    logVideo:false,
    expeed:'EXPEED 6', nRaw:null, pixelShift:null, preCapture:false,
    bluetooth:'4.2', wifi:true,
    cardSlots:'1× SD UHS-I', batteryLife:320, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

  'z30': {
    name:'Z30', series:'Z (APS-C)', year:2022, discontinued:false,
    tagline:'Vlogging DX, No Viewfinder',
    productUrl:'https://www.nikonusa.com/en/nikon-products/product/mirrorless-cameras/z30.html',
    imageUrl:null, asin:null,
    prices:{USD:710,AUD:1099,EUR:799,GBP:649,JPY:117000,CAD:949,SGD:999},
    sensorMP:20.9, sensorType:'APS-C (DX) CMOS', processor:'EXPEED 6',
    width:128.0, height:73.5, depth:60.0, weight:405, weatherSealed:false,
    lcdSize:'3.0"', lcdDots:1040, lcdType:'Vari-angle',
    evfType:null, evfDots:null, evfMag:null,
    faceDetection:true, subjectDetection:'Eye / Animal',
    ibis:false, ibisStops:null, maxBurst:11,
    maxVideoRes:'4K / 30P',
    logVideo:false,
    expeed:'EXPEED 6', nRaw:null, pixelShift:null, preCapture:false,
    bluetooth:'4.2', wifi:true,
    cardSlots:'1× SD UHS-I', batteryLife:330, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

  /* ── Z Retro ── */
  'zf': {
    name:'Zf', series:'Z (Retro)', year:2023, discontinued:false,
    tagline:'Retro Full-Frame, Modern Guts',
    productUrl:'https://www.nikonusa.com/en/nikon-products/product/mirrorless-cameras/z-f.html',
    imageUrl:null, asin:null,
    prices:{USD:1999,AUD:3199,EUR:2299,GBP:1899,JPY:330000,CAD:2749,SGD:2849},
    sensorMP:24.5, sensorType:'Full-frame BSI CMOS', processor:'EXPEED 7',
    width:144.0, height:103.0, depth:49.0, weight:710, weatherSealed:true,
    lcdSize:'3.2"', lcdDots:2100, lcdType:'Vari-angle',
    evfType:'EVF', evfDots:3.69, evfMag:0.80,
    faceDetection:true, subjectDetection:'9 types (People / Animals / Birds / Vehicles / Aircraft)',
    ibis:true, ibisStops:8.0, maxBurst:14,
    maxVideoRes:'4K / 60P (DX crop)',
    logVideo:true,
    expeed:'EXPEED 7', nRaw:null, pixelShift:'96MP', preCapture:true,
    bluetooth:'5.0', wifi:true,
    cardSlots:'1× SD UHS-II + 1× microSD UHS-I', batteryLife:360, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

  'zfc': {
    name:'Zfc', series:'Z (Retro)', year:2021, discontinued:false,
    tagline:'Retro DX Crowd-Pleaser',
    productUrl:'https://www.nikonusa.com/en/nikon-products/product/mirrorless-cameras/z-fc.html',
    imageUrl:null, asin:null,
    prices:{USD:960,AUD:1499,EUR:1099,GBP:899,JPY:158000,CAD:1299,SGD:1349},
    sensorMP:20.9, sensorType:'APS-C (DX) CMOS', processor:'EXPEED 6',
    width:134.5, height:93.5, depth:43.5, weight:445, weatherSealed:false,
    lcdSize:'3.0"', lcdDots:1040, lcdType:'Vari-angle',
    evfType:'EVF', evfDots:2.36, evfMag:1.02,
    faceDetection:true, subjectDetection:'Eye / Animal',
    ibis:false, ibisStops:null, maxBurst:11,
    maxVideoRes:'4K / 30P',
    logVideo:false,
    expeed:'EXPEED 6', nRaw:null, pixelShift:null, preCapture:false,
    bluetooth:'4.2', wifi:true,
    cardSlots:'1× SD UHS-I', batteryLife:300, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

};

const CAMERA_ORDER = [
  'z9', 'z8', 'z6-iii', 'z5-ii',
  'z7-ii', 'z7', 'z6-ii', 'z6', 'z5',
  'zf', 'zfc',
  'z50-ii', 'z50', 'z30',
];

const DROPDOWN_GROUPS = [
  { label: '── Z Full-Frame ──', ids: ['z9', 'z8', 'z6-iii', 'z5-ii', 'z7-ii', 'z7', 'z6-ii', 'z6', 'z5'] },
  { label: '── Z Retro ──',      ids: ['zf', 'zfc'] },
  { label: '── Z APS-C (DX) ──', ids: ['z50-ii', 'z50', 'z30'] },
];

// ─────────────────────────────────────────────
// LENS DATABASE — NIKKOR Z mount (Nikon first-party only).
// Specs verified against Nikon official pages + Wikipedia/DPReview.
// `priceIncomplete: true` ships an item with USD (+ any confirmed regional)
// while regional RRP backfill is pending (see check-prices-and-buy-links).
// ─────────────────────────────────────────────
const LENSES = {

  /* ── S-Line Primes ── */
  'z-50mm-f1-8-s': {
    name:'NIKKOR Z 50mm f/1.8 S', manufacturer:'Nikon', line:'S-Line', type:'Prime', asin:null,
    focalLength:50, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'50mm',
    maxAperture:1.8, minAperture:16, weight:415, length:86.5, diameter:76.0,
    filterThread:62, minFocusDist:40, maxMagnification:0.15,
    elements:12, groups:9, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2018, discontinued:false,
    imageUrl:null,
    prices:{USD:597,AUD:899,EUR:null,GBP:null,JPY:null,CAD:799,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/en/nikon-products/product/camera-lenses/nikkor-z-50mm-f%2f1.8-s.html',
  },

  /* ── S-Line Zooms ── */
  'z-24-70mm-f2-8-s': {
    name:'NIKKOR Z 24-70mm f/2.8 S', manufacturer:'Nikon', line:'S-Line', type:'Zoom', asin:null,
    focalLength:null, focalLengthMin:24, focalLengthMax:70, focalLengthEquiv:'24-70mm',
    maxAperture:2.8, minAperture:22, weight:805, length:126.0, diameter:89.0,
    filterThread:82, minFocusDist:38, maxMagnification:0.22,
    elements:17, groups:15, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2019, discontinued:false,
    imageUrl:null,
    prices:{USD:2297,AUD:3499,EUR:null,GBP:null,JPY:null,CAD:3099,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/en/nikon-products/product/camera-lenses/nikkor-z-24-70mm-f%2f2.8-s.html',
  },

  'z-70-200mm-f2-8-vr-s': {
    name:'NIKKOR Z 70-200mm f/2.8 VR S', manufacturer:'Nikon', line:'S-Line', type:'Zoom', asin:null,
    focalLength:null, focalLengthMin:70, focalLengthMax:200, focalLengthEquiv:'70-200mm',
    maxAperture:2.8, minAperture:22, weight:1440, length:220.0, diameter:89.0,
    filterThread:77, minFocusDist:50, maxMagnification:0.20,
    elements:21, groups:18, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:true, oisStops:5.5, year:2020, discontinued:false,
    imageUrl:null,
    prices:{USD:2597,AUD:3999,EUR:null,GBP:null,JPY:null,CAD:3499,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/en/nikon-products/product/camera-lenses/nikkor-z-70-200mm-f%2f2.8-vr-s.html',
  },

};

const LENS_DROPDOWN_GROUPS = [
  { label: '── S-Line Primes ──', ids: ['z-50mm-f1-8-s'] },
  { label: '── S-Line Zooms ──',  ids: ['z-24-70mm-f2-8-s', 'z-70-200mm-f2-8-vr-s'] },
];
