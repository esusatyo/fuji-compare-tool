// Registered into the shared brand-data registry so multiple brand files
// can load on one page (see compare/). The data below is unchanged.
window.BRAND_DATA = window.BRAND_DATA || {};
window.BRAND_DATA['nikon'] = (() => {
// ─────────────────────────────────────────────
// NIKON BRAND CONFIG
// ─────────────────────────────────────────────
const BRAND_CONFIG = {
  name:        'Nikon',
  slug:        'nikon',
  families:    ['Z System'],
  brandSections: ['nikon'],
  mount:       'Z-Mount',
  // Landing-tile showcase camera: not the true flagship (that's the Z9) —
  // the only freely-licensed Z9 photo found shows it in a shop with a large
  // telephoto attached, which reads poorly as a tile thumbnail. The Z6 III
  // has a clean product photo and is Nikon's most popular current body.
  heroCamera:  'z6-iii',
  cameras: {
    heroEyebrow:  'Z System',
    heroTitle:    '<span>Nikon</span> Camera Comparison',
    heroSubtitle: 'Compare up to 3 Nikon Z cameras side-by-side across the full lineup',
    headerTitle:  'Nikon',
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
    { label: 'Nikon Z System', url: 'https://www.nikonusa.com/c/cameras/mirrorless-cameras/overview' },
    { label: 'DPReview Nikon', url: 'https://www.dpreview.com/products/nikon' },
    { label: 'Nikon Rumors',   url: 'https://nikonrumors.com' },
  ],
};

const REGISTERED_BRANDS = [
  { slug: 'fujifilm', name: 'Fujifilm' },
  { slug: 'canon',    name: 'Canon' },
  { slug: 'sony',     name: 'Sony' },
  { slug: 'nikon',    name: 'Nikon' },
  { slug: 'panasonic', name: 'Panasonic' },
];

// ─────────────────────────────────────────────
// SERIES COLORS (for camera placeholder cards) — Nikon yellow on near-black
// ─────────────────────────────────────────────
const SERIES_COLORS = {
  'Z (Full-frame)': { bg: '#1a1700', text: '#ffd54a' },
  'Z (APS-C)':      { bg: '#171400', text: '#e6c64a' },
  'Z (Retro)':      { bg: '#1f1a08', text: '#f0d27a' },
  'Z Cinema (Full-frame)': { bg: '#160f00', text: '#ffcf4a' },
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
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Nikon_Z9.jpg/500px-Nikon_Z9.jpg',
    imageCredit:{author:"Peachyeung316", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Z9.jpg"},
    asin:'B09KHC4XCT',
    prices:{USD:5000,AUD:7799,EUR:5799,GBP:4499,JPY:780000,CAD:6499,SGD:7299},
    priceSource: { url:'https://www.nikonusa.com/en/nikon-products/product/mirrorless-cameras/z-9.html', tier:'T1', note:'"Starting at $4,999.95" body-only on nikonusa.com (Aug 2026), confirmed unchanged and consistent with the stored $5,000', date:'2026-08-23' },
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
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Nikon_Z_8_27_may_2023b.jpg/500px-Nikon_Z_8_27_may_2023b.jpg',
    imageCredit:{author:"昼落ち", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Z_8_27_may_2023b.jpg"},
    asin:'B0C4Q71JBY',
    prices:{USD:3400,AUD:5299,EUR:3899,GBP:3099,JPY:530000,CAD:4399,SGD:4899},
    priceSource: { url:'https://www.nikonusa.com/en/nikon-products/product/mirrorless-cameras/z-8.html', tier:'T1', note:'"Starting at $3,399.95" body-only on nikonusa.com (Aug 2026), confirmed unchanged and consistent with the stored $3,400', date:'2026-08-23' },
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
    productUrl:'https://www.nikonusa.com/p/z6iii/1890/overview',
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Nikon_Z6III_%28by_Henry_S%C3%B6derlund%29.jpg/500px-Nikon_Z6III_%28by_Henry_S%C3%B6derlund%29.jpg',
    imageCredit:{author:"Henry Söderlund", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Z6III_(by_Henry_S%C3%B6derlund).jpg"},
    asin:'B0D77SL8CY',
    prices:{USD:2200,AUD:3399,EUR:2499,GBP:1999,JPY:343000,CAD:2899,SGD:3199},
    priceSource: { url:'https://www.nikonusa.com/p/z6iii/1890/overview', tier:'T1', note:'"Starting at $2,199.95" body-only on nikonusa.com (Aug 2026), confirming the already-current $2,200 USD; regional currencies here are ratio-derived from an earlier refresh and were not independently re-confirmed this pass', date:'2026-08-23' },
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
    productUrl:'https://www.nikonusa.com/p/z5ii/1680/overview',
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Nikon_Z5II_03.jpg/500px-Nikon_Z5II_03.jpg',
    imageCredit:{author:"TTTNIS", licence:"CC0", licenceUrl:"http://creativecommons.org/publicdomain/zero/1.0/deed.en", source:"https://commons.wikimedia.org/wiki/File:Nikon_Z5II_03.jpg"},
    asin:'B0F3HJD64Y',
    prices:{USD:1600,AUD:2499,EUR:1799,GBP:1399,JPY:250000,CAD:2099,SGD:2299},
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

  /* ── Z Cinema ── */
  'zr': {
    name:'ZR', series:'Z Cinema (Full-frame)', year:2025, discontinued:false,
    tagline:'RED-Powered Full-Frame Cinema',
    productUrl:'https://imaging.nikon.com/imaging/lineup/z_cinema/z_r/',
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Nikon_ZR_27_nov_2025a.jpg/500px-Nikon_ZR_27_nov_2025a.jpg',
    imageCredit:{author:"昼落ち", licence:"CC0", licenceUrl:"http://creativecommons.org/publicdomain/zero/1.0/deed.en", source:"https://commons.wikimedia.org/wiki/File:Nikon_ZR_27_nov_2025a.jpg"},
    asin:'B0FPXLG8X7',
    prices:{USD:2199,AUD:3499,EUR:2549,GBP:2099,JPY:363000,CAD:2999,SGD:3149},
    specSources: [{ url:'https://onlinemanual.nikonimglib.com/zr/en/15-12.html', tier:'T1', note:'"batteryLife" filled from null — Nikon\'s own manual gives 370 shots (Energy Saving ON, CIPA standard) or 350 shots (Energy Saving OFF) with the EN-EL15c; 370 (the higher, Energy Saving ON figure) used here', date:'2026-08-23' }],
    priceSource: { url:'https://www.nikonusa.com/p/zr/2043/overview', tier:'T1', note:'"Starting at $2,199.95" body-only on nikonusa.com (Aug 2026), confirming the stored $2,199', date:'2026-08-23' },
    sensorMP:24.5, sensorType:'Full-frame Partially-Stacked BSI CMOS', processor:'EXPEED 7',
    width:134.0, height:80.5, depth:49.0, weight:630, weatherSealed:true,
    lcdSize:'4.0"', lcdDots:3070, lcdType:'Fully-Articulating Touch',
    evfType:null, evfDots:null, evfMag:null,
    faceDetection:true, subjectDetection:'9 types (People / Animals / Birds / Vehicles / Aircraft)',
    ibis:true, ibisStops:7.5, maxBurst:15,
    maxVideoRes:'6K / 60P R3D RAW',
    logVideo:true,
    expeed:'EXPEED 7', nRaw:'6K', pixelShift:null, preCapture:false,
    bluetooth:'5.0', wifi:true,
    cardSlots:'1× CFexpress Type B + 1× microSD', batteryLife:370, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

  /* ── Z Full-frame (older full-frame bodies) ──
     Z7 II, Z6 II and Z5 were previously marked discontinued:true, but
     nikonusa.com still sells all three new with active "Was/Now" pricing as
     of 2026-08-22 (Nikon keeps older FX bodies in the lineup at a reduced
     price well past a nominal successor's launch, same pattern documented
     for Sony's A1/A9 II/A7R IV/A7 III). Flipped to discontinued:false and
     backfilled full currency pricing (ratio-derived from the confirmed USD).
     Z7, Z6 and Z50 (below/further down) were re-checked the same day and are
     genuinely archived — "This product has been archived", no price shown —
     so they keep discontinued:true and USD-only pricing; asin null → search
     link for those. */
  'z7-ii': {
    name:'Z7 II', series:'Z (Full-frame)', year:2020, discontinued:false,
    tagline:'High-Res Dual-Processor',
    productUrl:'https://www.nikonusa.com/en/nikon-products/product/mirrorless-cameras/z-7ii.html',
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Nikon_Z_7II_with_Nikkor_Z_24-70mm_F4_S_-_by_Henry_S%C3%B6derlund_%2850723434183%29.jpg/500px-Nikon_Z_7II_with_Nikkor_Z_24-70mm_F4_S_-_by_Henry_S%C3%B6derlund_%2850723434183%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Z_7II_with_Nikkor_Z_24-70mm_F4_S_-_by_Henry_S%C3%B6derlund_(50723434183).jpg"}, asin:null,
    prices:{USD:1900,AUD:2999,EUR:2199,GBP:1699,JPY:296000,CAD:2499,SGD:2799},
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
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Nikon_Z7.jpg/500px-Nikon_Z7.jpg',
    imageCredit:{author:"Phiarc", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Z7.jpg"}, asin:null,
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
    name:'Z6 II', series:'Z (Full-frame)', year:2020, discontinued:false,
    tagline:'Dual-Processor All-Rounder',
    productUrl:'https://www.nikonusa.com/en/nikon-products/product/mirrorless-cameras/z-6ii.html',
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Nikon_Z_6II_2.jpg/500px-Nikon_Z_6II_2.jpg',
    imageCredit:{author:"Thilo Parg", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Z_6II_2.jpg"}, asin:null,
    prices:{USD:1400,AUD:2199,EUR:1599,GBP:1299,JPY:218000,CAD:1799,SGD:1999},
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
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Nikon_Z_6_28_nov_2018a.jpg/500px-Nikon_Z_6_28_nov_2018a.jpg',
    imageCredit:{author:"昼落ち", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Z_6_28_nov_2018a.jpg"}, asin:null,
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
    name:'Z5', series:'Z (Full-frame)', year:2020, discontinued:false,
    tagline:'Full-Frame Entry (Original)',
    productUrl:'https://www.nikonusa.com/en/nikon-products/product/mirrorless-cameras/z-5.html',
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Nikon_Z_5_21_Oct_2020a.jpg/500px-Nikon_Z_5_21_Oct_2020a.jpg',
    imageCredit:{author:"昼落ち", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Z_5_21_Oct_2020a.jpg"}, asin:null,
    prices:{USD:1150,AUD:1799,EUR:1299,GBP:999,JPY:179000,CAD:1499,SGD:1699},
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
    productUrl:'https://www.nikonusa.com/p/z50ii/1784/overview',
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Nikon_Z50II_28_nov_2024a.jpg/500px-Nikon_Z50II_28_nov_2024a.jpg',
    imageCredit:{author:"昼落ち", licence:"CC0", licenceUrl:"http://creativecommons.org/publicdomain/zero/1.0/deed.en", source:"https://commons.wikimedia.org/wiki/File:Nikon_Z50II_28_nov_2024a.jpg"},
    asin:'B0DMJBLQGP',
    prices:{USD:1010,AUD:1449,EUR:1049,GBP:849,JPY:150000,CAD:1249,SGD:1299},
    priceSource: { url:'https://www.nikonusa.com/p/z50ii/1784/overview', tier:'T1', note:'"Starting at $1,009.95" body-only on nikonusa.com (Aug 2026); corrects the stale $1,007 figure previously stored here', date:'2026-08-23' },
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
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Nikon_Z_50_0.jpg/500px-Nikon_Z_50_0.jpg',
    imageCredit:{author:"Thilo Parg", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Z_50_0.jpg"}, asin:null,
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
    productUrl:'https://www.nikonusa.com/p/z-30/1737/overview',
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Nikon_Z30.jpg/500px-Nikon_Z30.jpg',
    imageCredit:{author:"Phiarc", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Z30.jpg"}, asin:'B0B527JD1C',
    prices:{USD:610,AUD:999,EUR:699,GBP:499,JPY:95000,CAD:799,SGD:899},
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
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Nikon_Z_f_8_nov_2023a.jpg/500px-Nikon_Z_f_8_nov_2023a.jpg',
    imageCredit:{author:"昼落ち", licence:"CC0", licenceUrl:"http://creativecommons.org/publicdomain/zero/1.0/deed.en", source:"https://commons.wikimedia.org/wiki/File:Nikon_Z_f_8_nov_2023a.jpg"}, asin:'B0CJDHSFTN',
    prices:{USD:2050,AUD:3199,EUR:2399,GBP:1799,JPY:320000,CAD:2699,SGD:2999},
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
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Nikon_Z_fc_3_aug_2021a.jpg/500px-Nikon_Z_fc_3_aug_2021a.jpg',
    imageCredit:{author:"昼落ち", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Z_fc_3_aug_2021a.jpg"}, asin:'B09883MWLL',
    prices:{USD:960,AUD:1499,EUR:1099,GBP:899,JPY:150000,CAD:1199,SGD:1399},
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
  'zr',
  'zf', 'zfc',
  'z50-ii', 'z50', 'z30',
];

const DROPDOWN_GROUPS = [
  { label: '── Z Full-Frame ──', ids: ['z9', 'z8', 'z6-iii', 'z5-ii', 'z7-ii', 'z7', 'z6-ii', 'z6', 'z5'] },
  { label: '── Z Cinema ──',     ids: ['zr'] },
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
    name:'NIKKOR Z 50mm f/1.8 S', manufacturer:'Nikon', line:'S-Line', type:'Prime', asin:'B07GQ6FR5F',
    focalLength:50, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'50mm',
    maxAperture:1.8, minAperture:16, weight:415, length:86.5, diameter:76.0,
    filterThread:62, minFocusDist:40, maxMagnification:0.15,
    elements:12, groups:9, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2018, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Nikon_NIKKOR_Z_50mm_f_1.8_S_%2849288626406%29.jpg/500px-Nikon_NIKKOR_Z_50mm_f_1.8_S_%2849288626406%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_NIKKOR_Z_50mm_f_1.8_S_(49288626406).jpg"},
    prices:{USD:470,AUD:699,EUR:null,GBP:null,JPY:null,CAD:599,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-50mm-f18-s/20083/overview',
  },

  'z-20mm-f1-8-s': {
    name:'NIKKOR Z 20mm f/1.8 S', manufacturer:'Nikon', line:'S-Line', type:'Prime', asin:'B084QPDT1H',
    focalLength:20, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'20mm',
    maxAperture:1.8, minAperture:16, weight:505, length:108.5, diameter:84.5,
    filterThread:77, minFocusDist:20, maxMagnification:0.19,
    elements:14, groups:11, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2020, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Nikon_NIKKOR_Z_20mm_f_1.8_S_%2852044601591%29.jpg/500px-Nikon_NIKKOR_Z_20mm_f_1.8_S_%2852044601591%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_NIKKOR_Z_20mm_f_1.8_S_(52044601591).jpg"},
    prices:{USD:1047,AUD:1599,EUR:null,GBP:null,JPY:null,CAD:1399,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-20mm-f18-s/20093/overview',
  },

  'z-24mm-f1-8-s': {
    name:'NIKKOR Z 24mm f/1.8 S', manufacturer:'Nikon', line:'S-Line', type:'Prime', asin:'B07W86M8FG',
    focalLength:24, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'24mm',
    maxAperture:1.8, minAperture:16, weight:450, length:96.5, diameter:78.0,
    filterThread:72, minFocusDist:25, maxMagnification:0.15,
    elements:12, groups:10, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2019, discontinued:false,
    imageUrl:'https://images.cdn.us-central1.gcp.commercetools.com/f7c8f2bb-aff1-4581-a826-1ad2527be222/FrontLeft-20080-NIKK-SEYMRUVz-large.png',
    imageSource: { url:'https://www.nikonusa.com/p/nikkor-z-24mm-f18-s/20080/overview', tier:'T1', note:'official Nikon USA product page, front-left view — barrel reads "NIKKOR S", NIKON badge on body', date:'2026-08-17' },
    prices:{USD:997,AUD:1499,EUR:null,GBP:null,JPY:null,CAD:1349,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-24mm-f18-s/20080/overview',
  },

  'z-35mm-f1-8-s': {
    name:'NIKKOR Z 35mm f/1.8 S', manufacturer:'Nikon', line:'S-Line', type:'Prime', asin:'B07GPVJ6HG',
    focalLength:35, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'35mm',
    maxAperture:1.8, minAperture:16, weight:370, length:86.0, diameter:73.0,
    filterThread:62, minFocusDist:25, maxMagnification:0.19,
    elements:11, groups:9, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2018, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Nikon_NIKKOR_Z_35mm_f_1.8_S_%2849947326273%29.jpg/500px-Nikon_NIKKOR_Z_35mm_f_1.8_S_%2849947326273%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_NIKKOR_Z_35mm_f_1.8_S_(49947326273).jpg"},
    prices:{USD:750,AUD:1199,EUR:null,GBP:null,JPY:null,CAD:999,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-35mm-f18-s/20081/overview',
  },

  'z-85mm-f1-8-s': {
    name:'NIKKOR Z 85mm f/1.8 S', manufacturer:'Nikon', line:'S-Line', type:'Prime', asin:'B07VQWGNHR',
    focalLength:85, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'85mm',
    maxAperture:1.8, minAperture:16, weight:470, length:99.0, diameter:75.0,
    filterThread:67, minFocusDist:80, maxMagnification:0.12,
    elements:12, groups:8, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2019, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Nikon_NIKKOR_Z_85mm_f_1.8_S_%2848706710723%29.jpg/500px-Nikon_NIKKOR_Z_85mm_f_1.8_S_%2848706710723%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_NIKKOR_Z_85mm_f_1.8_S_(48706710723).jpg"},
    prices:{USD:750,AUD:1199,EUR:null,GBP:null,JPY:null,CAD:999,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-85mm-f18-s/20090/overview',
  },

  'z-35mm-f1-2-s': {
    name:'NIKKOR Z 35mm f/1.2 S', manufacturer:'Nikon', line:'S-Line', type:'Prime', asin:'B0DVZRWJSG',
    focalLength:35, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'35mm',
    maxAperture:1.2, minAperture:16, weight:1060, length:150.0, diameter:90.0,
    filterThread:82, minFocusDist:30, maxMagnification:0.17,
    elements:17, groups:15, blades:11, afType:'Multi-Focus Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2025, discontinued:false,
    imageUrl:'https://images.cdn.us-central1.gcp.commercetools.com/f7c8f2bb-aff1-4581-a826-1ad2527be222/Z35_1-2-_0000_Z35_1--4oP8TO0u-large.png',
    imageSource: { url:'https://www.nikonusa.com/p/nikkor-z-35mm-f12-s/20124/overview', tier:'T1', note:'official Nikon USA product page', date:'2026-08-17' },
    prices:{USD:2600,AUD:4099,EUR:null,GBP:null,JPY:null,CAD:3399,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-35mm-f12-s/20124/overview',
  },

  'z-50mm-f1-2-s': {
    name:'NIKKOR Z 50mm f/1.2 S', manufacturer:'Nikon', line:'S-Line', type:'Prime', asin:'B08J7FDF6G',
    focalLength:50, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'50mm',
    maxAperture:1.2, minAperture:16, weight:1090, length:150.0, diameter:89.5,
    filterThread:82, minFocusDist:45, maxMagnification:0.15,
    elements:17, groups:15, blades:9, afType:'Multi-Focus Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2020, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Nikon_NIKKOR_Z_50mm_f_1.2_S_%2851602295538%29.jpg/500px-Nikon_NIKKOR_Z_50mm_f_1.2_S_%2851602295538%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_NIKKOR_Z_50mm_f_1.2_S_(51602295538).jpg"},
    prices:{USD:2050,AUD:3199,EUR:null,GBP:null,JPY:null,CAD:2699,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-50mm-f12-s/20095/overview',
  },

  'z-85mm-f1-2-s': {
    name:'NIKKOR Z 85mm f/1.2 S', manufacturer:'Nikon', line:'S-Line', type:'Prime', asin:'B0BTZZTTRH',
    focalLength:85, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'85mm',
    maxAperture:1.2, minAperture:16, weight:1160, length:141.5, diameter:102.5,
    filterThread:82, minFocusDist:85, maxMagnification:0.11,
    elements:15, groups:10, blades:11, afType:'Multi-Focus Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2023, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Nikon_Nikkor_Z_85mm_f_1.2_S_by_Henry_S%C3%B6derlund.jpg/500px-Nikon_Nikkor_Z_85mm_f_1.2_S_by_Henry_S%C3%B6derlund.jpg',
    imageCredit:{author:"Henry Söderlund", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Nikkor_Z_85mm_f_1.2_S_by_Henry_S%C3%B6derlund.jpg"},
    prices:{USD:2797,AUD:4299,EUR:null,GBP:null,JPY:null,CAD:3799,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-85mm-f12-s/20114/overview',
  },

  'z-135mm-f1-8-s-plena': {
    name:'NIKKOR Z 135mm f/1.8 S Plena', manufacturer:'Nikon', line:'S-Line', type:'Prime', asin:'B0CJWJ2PMY',
    focalLength:135, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'135mm',
    maxAperture:1.8, minAperture:16, weight:995, length:139.5, diameter:98.0,
    filterThread:82, minFocusDist:82, maxMagnification:0.19,
    elements:16, groups:14, blades:11, afType:'Multi-Focus Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2023, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Nikon_Nikkor_Z_135mm_F1.8_S_Plena_by_Henry_S%C3%B6derlund.jpg/500px-Nikon_Nikkor_Z_135mm_F1.8_S_Plena_by_Henry_S%C3%B6derlund.jpg',
    imageCredit:{author:"Henry Söderlund", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Nikkor_Z_135mm_F1.8_S_Plena_by_Henry_S%C3%B6derlund.jpg"},
    prices:{USD:2200,AUD:3399,EUR:null,GBP:null,JPY:null,CAD:2899,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-135mm-f18-s-plena/20123/overview',
  },

  'z-mc-105mm-f2-8-vr-s': {
    name:'NIKKOR Z MC 105mm f/2.8 VR S', manufacturer:'Nikon', line:'S-Line', type:'Prime', asin:'B096DHS1BF',
    focalLength:105, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'105mm',
    maxAperture:2.8, minAperture:32, weight:630, length:140.0, diameter:85.0,
    filterThread:62, minFocusDist:29, maxMagnification:1.0,
    elements:16, groups:11, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:true, oisStops:null, year:2021, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Nikon_NIKKOR_Z_MC_105mm_f_2.8_VR_S_%2852012537302%29.jpg/500px-Nikon_NIKKOR_Z_MC_105mm_f_2.8_VR_S_%2852012537302%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_NIKKOR_Z_MC_105mm_f_2.8_VR_S_(52012537302).jpg"},
    prices:{USD:900,AUD:1399,EUR:null,GBP:null,JPY:null,CAD:1199,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-mc-105mm-f28-vr-s/20100/overview',
  },

  'z-58mm-f0-95-s-noct': {
    name:'NIKKOR Z 58mm f/0.95 S Noct', manufacturer:'Nikon', line:'S-Line', type:'Prime', asin:'B07YXBWK3W',
    focalLength:58, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'58mm',
    maxAperture:0.95, minAperture:16, weight:2000, length:153.0, diameter:102.0,
    filterThread:82, minFocusDist:50, maxMagnification:0.19,
    elements:17, groups:10, blades:11, afType:'Manual Focus',
    weatherSealed:true, ois:false, oisStops:null, year:2019, discontinued:false,
    imageUrl:'https://images.cdn.us-central1.gcp.commercetools.com/f7c8f2bb-aff1-4581-a826-1ad2527be222/FrontLeft-20086-NIKK-jnqFWMWj-large.png',
    imageSource: { url:'https://www.nikonusa.com/p/nikkor-z-58mm-f095-s-noct/20086/overview', tier:'T1', note:'official Nikon USA product page, barrel reads "Z 58mm 1:0.95 S Noct" and gold "Noct" script', date:'2026-08-17' },
    prices:{USD:8650,AUD:13499,EUR:null,GBP:null,JPY:null,CAD:11199,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-58mm-f095-s-noct/20086/overview',
  },

  /* ── S-Line Zooms ── */
  'z-24-70mm-f2-8-s': {
    name:'NIKKOR Z 24-70mm f/2.8 S', manufacturer:'Nikon', line:'S-Line', type:'Zoom', asin:'B07NLQ46M2',
    focalLength:null, focalLengthMin:24, focalLengthMax:70, focalLengthEquiv:'24-70mm',
    maxAperture:2.8, minAperture:22, weight:805, length:126.0, diameter:89.0,
    filterThread:82, minFocusDist:38, maxMagnification:0.22,
    elements:17, groups:15, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2019, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Nikon_Z7ii_%2B_nikkor_z_24-70mm_f2.8_s.jpg/500px-Nikon_Z7ii_%2B_nikkor_z_24-70mm_f2.8_s.jpg',
    imageCredit:{author:"Wilfredor", licence:"CC0", licenceUrl:"http://creativecommons.org/publicdomain/zero/1.0/deed.en", source:"https://commons.wikimedia.org/wiki/File:Nikon_Z7ii_+_nikkor_z_24-70mm_f2.8_s.jpg"},
    prices:{USD:2000,AUD:3099,EUR:null,GBP:null,JPY:null,CAD:2599,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-24-70mm-f28-s/20089/overview',
  },

  'z-24-70mm-f2-8-s-ii': {
    name:'NIKKOR Z 24-70mm f/2.8 S II', manufacturer:'Nikon', line:'S-Line', type:'Zoom', asin:'B0FNCDZW6V',
    focalLength:null, focalLengthMin:24, focalLengthMax:70, focalLengthEquiv:'24-70mm',
    maxAperture:2.8, minAperture:22, weight:675, length:142.0, diameter:84.0,
    filterThread:77, minFocusDist:240, maxMagnification:0.32,
    elements:14, groups:10, blades:11, afType:'Silky Swift VCM',
    weatherSealed:true, ois:false, oisStops:null, year:2025, discontinued:false,
    imageUrl:'https://images.cdn.us-central1.gcp.commercetools.com/f7c8f2bb-aff1-4581-a826-1ad2527be222/20129-Z24-70-2-8-S-I-5Lck4epg-large.png',
    imageSource: { url:'https://www.nikonusa.com/p/nikkor-z-24-70mm-f28-s-ii/20129/overview', tier:'T1', note:'official Nikon USA product page, barrel reads "NIKKOR S", focus-limiter switch visible confirming the S II revision', date:'2026-08-17' },
    prices:{USD:2800,AUD:4399,EUR:null,GBP:null,JPY:null,CAD:3599,SGD:null},
    priceIncomplete:true,
    priceSource: { url:'https://www.nikonusa.com/p/nikkor-z-24-70mm-f28-s-ii/20129/overview', tier:'T1', note:'"$2,799.95" on nikonusa.com (Aug 2026), confirmed unchanged and consistent with the stored $2,800', date:'2026-08-23' },
    productUrl:'https://www.nikonusa.com/p/nikkor-z-24-70mm-f28-s-ii/20129/overview',
  },

  'z-70-200mm-f2-8-vr-s': {
    name:'NIKKOR Z 70-200mm f/2.8 VR S', manufacturer:'Nikon', line:'S-Line', type:'Zoom', asin:'B083K3C5P2',
    focalLength:null, focalLengthMin:70, focalLengthMax:200, focalLengthEquiv:'70-200mm',
    maxAperture:2.8, minAperture:22, weight:1440, length:220.0, diameter:89.0,
    filterThread:77, minFocusDist:50, maxMagnification:0.20,
    elements:21, groups:18, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:true, oisStops:5.5, year:2020, discontinued:true,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Nikon_NIKKOR_Z_70-200mm_f_2.8_VR_S_%2850342502711%29.jpg/500px-Nikon_NIKKOR_Z_70-200mm_f_2.8_VR_S_%2850342502711%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_NIKKOR_Z_70-200mm_f_2.8_VR_S_(50342502711).jpg"},
    prices:{USD:2597,AUD:3999,EUR:null,GBP:null,JPY:null,CAD:3499,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-70-200mm-f28-vr-s/20091/overview',
  },

  'z-70-200mm-f2-8-vr-s-ii': {
    name:'NIKKOR Z 70-200mm f/2.8 VR S II', manufacturer:'Nikon', line:'S-Line', type:'Zoom', asin:'B0GPT1BFK1',
    focalLength:null, focalLengthMin:70, focalLengthMax:200, focalLengthEquiv:'70-200mm',
    maxAperture:2.8, minAperture:22, weight:998, length:208.0, diameter:90.0,
    filterThread:77, minFocusDist:380, maxMagnification:0.30,
    elements:18, groups:16, blades:11, afType:'Silky Swift VCM',
    weatherSealed:true, ois:true, oisStops:5.5, year:2026, discontinued:false,
    imageUrl:'https://images.cdn.us-central1.gcp.commercetools.com/f7c8f2bb-aff1-4581-a826-1ad2527be222/20130-Z70-200_28_VR_-WHsFWpMM-large.png',
    imageSource: { url:'https://www.nikonusa.com/p/nikkor-z-70-200mm-f28-vr-s-ii/20130/overview', tier:'T1', note:'official Nikon USA product page, barrel explicitly reads "NIKKOR Z 70-200mm 1:2.8 VR S II"', date:'2026-08-17' },
    prices:{USD:3200,AUD:4999,EUR:null,GBP:null,JPY:null,CAD:4199,SGD:null},
    priceIncomplete:true,
    priceSource: { url:'https://www.nikonusa.com/p/nikkor-z-70-200mm-f28-vr-s-ii/20130/overview', tier:'T1', note:'"$3,199.95" on nikonusa.com (Aug 2026), confirmed unchanged and consistent with the stored $3,200', date:'2026-08-23' },
    productUrl:'https://www.nikonusa.com/p/nikkor-z-70-200mm-f28-vr-s-ii/20130/overview',
  },

  /* ── Standard Primes (non-S, FX) ── */
  'z-26mm-f2-8': {
    name:'NIKKOR Z 26mm f/2.8', manufacturer:'Nikon', line:'NIKKOR Z', type:'Prime', asin:'B0BV11Z35L',
    focalLength:26, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'26mm',
    maxAperture:2.8, minAperture:16, weight:125, length:23.5, diameter:70.0,
    filterThread:52, minFocusDist:20, maxMagnification:0.19,
    elements:8, groups:6, blades:7, afType:'Stepping Motor',
    weatherSealed:false, ois:false, oisStops:null, year:2023, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Nikon_NIKKOR_Z_26mm_f_2.8_%2852736656378%29.jpg/500px-Nikon_NIKKOR_Z_26mm_f_2.8_%2852736656378%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_NIKKOR_Z_26mm_f_2.8_(52736656378).jpg"},
    prices:{USD:450,AUD:699,EUR:null,GBP:null,JPY:null,CAD:599,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-26mm-f28/20116/overview',
  },

  'z-28mm-f2-8': {
    name:'NIKKOR Z 28mm f/2.8', manufacturer:'Nikon', line:'NIKKOR Z', type:'Prime', asin:'B09M62RJK2',
    focalLength:28, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'28mm',
    maxAperture:2.8, minAperture:16, weight:155, length:43.0, diameter:70.0,
    filterThread:52, minFocusDist:19, maxMagnification:0.20,
    elements:9, groups:8, blades:9, afType:'Stepping Motor',
    weatherSealed:false, ois:false, oisStops:null, year:2021, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Nikon_NIKKOR_Z_28mm_f_2.8_%2851770949640%29.jpg/500px-Nikon_NIKKOR_Z_28mm_f_2.8_%2851770949640%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_NIKKOR_Z_28mm_f_2.8_(51770949640).jpg"},
    prices:{USD:230,AUD:399,EUR:null,GBP:null,JPY:null,CAD:299,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-28mm-f28/20101/overview',
  },

  'z-28mm-f2-8-se': {
    name:'NIKKOR Z 28mm f/2.8 (SE)', manufacturer:'Nikon', line:'NIKKOR Z', type:'Prime', asin:'B0982T5T68',
    focalLength:28, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'28mm',
    maxAperture:2.8, minAperture:16, weight:160, length:43.0, diameter:71.5,
    filterThread:52, minFocusDist:19, maxMagnification:0.20,
    elements:9, groups:8, blades:9, afType:'Stepping Motor',
    weatherSealed:false, ois:false, oisStops:null, year:2021, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Nikon_Z_fc_with_Nikkor_Z_28mm_F2.8_SE_-_by_Henry_S%C3%B6derlund_%2851675302954%29.jpg/500px-Nikon_Z_fc_with_Nikkor_Z_28mm_F2.8_SE_-_by_Henry_S%C3%B6derlund_%2851675302954%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Z_fc_with_Nikkor_Z_28mm_F2.8_SE_-_by_Henry_S%C3%B6derlund_(51675302954).jpg"},
    prices:{USD:310,AUD:499,EUR:null,GBP:null,JPY:null,CAD:399,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-28mm-f28-se/20110/overview',
  },

  'z-35mm-f1-4': {
    name:'NIKKOR Z 35mm f/1.4', manufacturer:'Nikon', line:'NIKKOR Z', type:'Prime', asin:'B0D83PR5SQ',
    focalLength:35, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'35mm',
    maxAperture:1.4, minAperture:16, weight:415, length:86.5, diameter:74.5,
    filterThread:62, minFocusDist:27, maxMagnification:0.18,
    elements:11, groups:9, blades:9, afType:'Stepping Motor',
    weatherSealed:false, ois:false, oisStops:null, year:2024, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Nikon_NIKKOR_Z_35mm_f_1.4_%2853868344792%29.jpg/500px-Nikon_NIKKOR_Z_35mm_f_1.4_%2853868344792%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_NIKKOR_Z_35mm_f_1.4_(53868344792).jpg"},
    prices:{USD:580,AUD:899,EUR:null,GBP:null,JPY:null,CAD:799,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-35mm-f14/20126/overview',
  },

  'z-40mm-f2': {
    name:'NIKKOR Z 40mm f/2', manufacturer:'Nikon', line:'NIKKOR Z', type:'Prime', asin:'B09G57BXZ4',
    focalLength:40, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'40mm',
    maxAperture:2.0, minAperture:16, weight:170, length:45.5, diameter:70.0,
    filterThread:52, minFocusDist:29, maxMagnification:0.17,
    elements:6, groups:4, blades:9, afType:'Stepping Motor',
    weatherSealed:false, ois:false, oisStops:null, year:2021, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Nikon_Nikkor_Z_40mm_F2_%2851607832457%29.jpg/500px-Nikon_Nikkor_Z_40mm_F2_%2851607832457%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Nikkor_Z_40mm_F2_(51607832457).jpg"},
    prices:{USD:230,AUD:399,EUR:null,GBP:null,JPY:null,CAD:299,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-40mm-f2/20102/overview',
  },

  'z-40mm-f2-se': {
    name:'NIKKOR Z 40mm f/2 (SE)', manufacturer:'Nikon', line:'NIKKOR Z', type:'Prime', asin:'B0BLTDSVM2',
    focalLength:40, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'40mm',
    maxAperture:2.0, minAperture:16, weight:170, length:45.5, diameter:71.5,
    filterThread:52, minFocusDist:29, maxMagnification:0.17,
    elements:6, groups:4, blades:9, afType:'Stepping Motor',
    weatherSealed:false, ois:false, oisStops:null, year:2022, discontinued:false,
    imageUrl:'https://images.cdn.us-central1.gcp.commercetools.com/f7c8f2bb-aff1-4581-a826-1ad2527be222/FrontLeft-20121-Z40_-mW5PVcHf-large.png',
    imageSource: { url:'https://www.nikonusa.com/p/nikkor-z-40mm-f2-se/20121/overview', tier:'T1', note:'official Nikon USA product page, retro SE styling with silver ring matches the SE variant, barrel reads "40mm 1:2"', date:'2026-08-17' },
    prices:{USD:260,AUD:399,EUR:null,GBP:null,JPY:null,CAD:299,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-40mm-f2-se/20121/overview',
  },

  'z-50mm-f1-4': {
    name:'NIKKOR Z 50mm f/1.4', manufacturer:'Nikon', line:'NIKKOR Z', type:'Prime', asin:'B0DGHTDNY7',
    focalLength:50, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'50mm',
    maxAperture:1.4, minAperture:16, weight:420, length:86.5, diameter:74.5,
    filterThread:62, minFocusDist:37, maxMagnification:0.18,
    elements:10, groups:7, blades:9, afType:'Stepping Motor',
    weatherSealed:false, ois:false, oisStops:null, year:2024, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Nikon_Nikkor_Z_50mm_f_1.4_%2854039593268%29.jpg/500px-Nikon_Nikkor_Z_50mm_f_1.4_%2854039593268%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Nikkor_Z_50mm_f_1.4_(54039593268).jpg"},
    prices:{USD:550,AUD:899,EUR:null,GBP:null,JPY:null,CAD:699,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-50mm-f14/20128/overview',
  },

  'z-50mm-f2-8-mc': {
    name:'NIKKOR Z MC 50mm f/2.8', manufacturer:'Nikon', line:'NIKKOR Z', type:'Prime', asin:'B096DVRX22',
    focalLength:50, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'50mm',
    maxAperture:2.8, minAperture:22, weight:260, length:66.0, diameter:74.5,
    filterThread:46, minFocusDist:16, maxMagnification:1.0,
    elements:10, groups:7, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2021, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Nikon_NIKKOR_Z_MC_50mm_f_2.8_%2851378200761%29.jpg/500px-Nikon_NIKKOR_Z_MC_50mm_f_2.8_%2851378200761%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_NIKKOR_Z_MC_50mm_f_2.8_(51378200761).jpg"},
    prices:{USD:670,AUD:999,EUR:null,GBP:null,JPY:null,CAD:899,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-mc-50mm-f28/20103/overview',
  },

  /* ── DX Primes ── */
  'z-dx-24mm-f1-7': {
    name:'NIKKOR Z DX 24mm f/1.7', manufacturer:'Nikon', line:'DX', type:'Prime', asin:'B0C6P4CTTT',
    focalLength:24, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'36mm',
    maxAperture:1.7, minAperture:16, weight:135, length:40.0, diameter:70.0,
    filterThread:46, minFocusDist:18, maxMagnification:0.20,
    elements:9, groups:8, blades:9, afType:'Stepping Motor',
    weatherSealed:false, ois:false, oisStops:null, year:2023, discontinued:false,
    imageUrl:'https://images.cdn.us-central1.gcp.commercetools.com/f7c8f2bb-aff1-4581-a826-1ad2527be222/FrontLeft-Z24DX_1_7_-KomKgyzE-large.png',
    imageSource: { url:'https://www.nikonusa.com/p/nikkor-z-dx-24mm-f17/20119/overview', tier:'T1', note:'official Nikon USA product page, barrel explicitly reads "NIKKOR DX 24/1.7"', date:'2026-08-17' },
    prices:{USD:270,AUD:399,EUR:null,GBP:null,JPY:null,CAD:379,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-dx-24mm-f17/20119/overview',
  },

  'z-dx-mc-35mm-f17': {
    name:'NIKKOR Z DX MC 35mm f/1.7', manufacturer:'Nikon', line:'DX', type:'Prime', asin:'B0FWD1MZ8P',
    focalLength:35, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'53mm',
    maxAperture:1.7, minAperture:22, weight:220, length:72.0, diameter:70.0,
    filterThread:52, minFocusDist:160, maxMagnification:0.67,
    elements:8, groups:7, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2026, discontinued:false,
    imageUrl:'https://images.cdn.us-central1.gcp.commercetools.com/f7c8f2bb-aff1-4581-a826-1ad2527be222/20131-35-1-7-angle-1-XUQsD1C9-large.png',
    imageSource: { url:'https://www.nikonusa.com/p/nikkor-z-dx-mc-35mm-f17/20131/overview', tier:'T1', note:'official Nikon USA product page, barrel explicitly reads "NIKKOR Z DX MC 35mm 1:1.7"', date:'2026-08-17' },
    prices:{USD:450,AUD:699,EUR:null,GBP:null,JPY:null,CAD:599,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-dx-mc-35mm-f17/20131/overview',
  },

  /* ── S-Line Zooms (cont.) ── */
  'z-14-24mm-f2-8-s': {
    name:'NIKKOR Z 14-24mm f/2.8 S', manufacturer:'Nikon', line:'S-Line', type:'Zoom', asin:'B08J7FHHWX',
    focalLength:null, focalLengthMin:14, focalLengthMax:24, focalLengthEquiv:'14-24mm',
    maxAperture:2.8, minAperture:22, weight:650, length:124.5, diameter:88.5,
    filterThread:112, minFocusDist:28, maxMagnification:0.13,
    elements:16, groups:11, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2020, discontinued:false,
    imageUrl:'https://images.cdn.us-central1.gcp.commercetools.com/f7c8f2bb-aff1-4581-a826-1ad2527be222/Front-20097-NIKKOR-Z-kaEMxK9h-large.png',
    imageSource: { url:'https://www.nikonusa.com/p/nikkor-z-14-24mm-f28-s/20097/overview', tier:'T1', note:'official Nikon USA product page, barrel explicitly reads "NIKKOR Z 14-24mm 1:2.8 S"', date:'2026-08-17' },
    prices:{USD:2000,AUD:3099,EUR:null,GBP:null,JPY:null,CAD:2599,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-14-24mm-f28-s/20097/overview',
  },

  'z-14-30mm-f4-s': {
    name:'NIKKOR Z 14-30mm f/4 S', manufacturer:'Nikon', line:'S-Line', type:'Zoom', asin:'B07MS6299X',
    focalLength:null, focalLengthMin:14, focalLengthMax:30, focalLengthEquiv:'14-30mm',
    maxAperture:4.0, minAperture:22, weight:485, length:85.0, diameter:89.0,
    filterThread:82, minFocusDist:28, maxMagnification:0.16,
    elements:14, groups:12, blades:7, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2019, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Nikon_Nikkor_Z_14-30mm_f-4_S_%28DSCF8458%29.jpg/500px-Nikon_Nikkor_Z_14-30mm_f-4_S_%28DSCF8458%29.jpg',
    imageCredit:{author:"Trougnouf (Benoit Brummer)", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Nikkor_Z_14-30mm_f-4_S_(DSCF8458).jpg"},
    prices:{USD:1100,AUD:1699,EUR:null,GBP:null,JPY:null,CAD:1399,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-14-30mm-f4-s/20070/overview',
  },

  'z-24-70mm-f4-s': {
    name:'NIKKOR Z 24-70mm f/4 S', manufacturer:'Nikon', line:'S-Line', type:'Zoom', asin:'B07GPX4HK5',
    focalLength:null, focalLengthMin:24, focalLengthMax:70, focalLengthEquiv:'24-70mm',
    maxAperture:4.0, minAperture:22, weight:500, length:88.5, diameter:77.5,
    filterThread:72, minFocusDist:30, maxMagnification:0.30,
    elements:14, groups:11, blades:7, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2018, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Nikon_Z_6_with_Nikkor_Z_24-70mm_f-4_S_%28DSCF8451%29.jpg/500px-Nikon_Z_6_with_Nikkor_Z_24-70mm_f-4_S_%28DSCF8451%29.jpg',
    imageCredit:{author:"Trougnouf (Benoit Brummer)", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Z_6_with_Nikkor_Z_24-70mm_f-4_S_(DSCF8451).jpg"},
    prices:{USD:1050,AUD:1599,EUR:null,GBP:null,JPY:null,CAD:1399,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-24-70mm-f4-s/20072/overview',
  },

  'z-24-120mm-f4-s': {
    name:'NIKKOR Z 24-120mm f/4 S', manufacturer:'Nikon', line:'S-Line', type:'Zoom', asin:'B09KHB76TP',
    focalLength:null, focalLengthMin:24, focalLengthMax:120, focalLengthEquiv:'24-120mm',
    maxAperture:4.0, minAperture:22, weight:630, length:118.0, diameter:84.0,
    filterThread:77, minFocusDist:35, maxMagnification:0.39,
    elements:16, groups:13, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2021, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Nikon_NIKKOR_Z_24-120mm_f_4_S_%2851793292337%29.jpg/500px-Nikon_NIKKOR_Z_24-120mm_f_4_S_%2851793292337%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_NIKKOR_Z_24-120mm_f_4_S_(51793292337).jpg"},
    prices:{USD:1000,AUD:1599,EUR:null,GBP:null,JPY:null,CAD:1299,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-24-120mm-f4-s/20105/overview',
  },

  'z-100-400mm-f4-5-5-6-vr-s': {
    name:'NIKKOR Z 100-400mm f/4.5-5.6 VR S', manufacturer:'Nikon', line:'S-Line', type:'Zoom', asin:'B09KH9X5DL',
    focalLength:null, focalLengthMin:100, focalLengthMax:400, focalLengthEquiv:'100-400mm',
    maxAperture:4.5, minAperture:32, weight:1435, length:222.0, diameter:98.0,
    filterThread:77, minFocusDist:75, maxMagnification:0.38,
    elements:25, groups:20, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:true, oisStops:5.5, year:2021, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Nikon_Nikkor_Z_100-400mm_F4.5-5.6_VR_S_-_by_Henry_S%C3%B6derlund_%2852457041193%29.jpg/500px-Nikon_Nikkor_Z_100-400mm_F4.5-5.6_VR_S_-_by_Henry_S%C3%B6derlund_%2852457041193%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Nikkor_Z_100-400mm_F4.5-5.6_VR_S_-_by_Henry_S%C3%B6derlund_(52457041193).jpg"},
    prices:{USD:2697,AUD:4199,EUR:null,GBP:null,JPY:null,CAD:3699,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-100-400mm-f45-56-vr-s/20106/overview',
  },

  /* ── Standard / Travel Zooms (non-S, FX) ── */
  'z-17-28mm-f2-8': {
    name:'NIKKOR Z 17-28mm f/2.8', manufacturer:'Nikon', line:'NIKKOR Z', type:'Zoom', asin:'B0BFTX4DS7',
    focalLength:null, focalLengthMin:17, focalLengthMax:28, focalLengthEquiv:'17-28mm',
    maxAperture:2.8, minAperture:22, weight:450, length:101.0, diameter:75.0,
    filterThread:67, minFocusDist:19, maxMagnification:0.19,
    elements:13, groups:11, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2022, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Nikon_NIKKOR_Z_17-28mm_f_2.8_%2852474327801%29.jpg/500px-Nikon_NIKKOR_Z_17-28mm_f_2.8_%2852474327801%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_NIKKOR_Z_17-28mm_f_2.8_(52474327801).jpg"},
    prices:{USD:1100,AUD:1699,EUR:null,GBP:null,JPY:null,CAD:1399,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-17-28mm-f28/20115/overview',
  },

  'z-24-50mm-f4-6-3': {
    name:'NIKKOR Z 24-50mm f/4-6.3', manufacturer:'Nikon', line:'NIKKOR Z', type:'Zoom', asin:'B08D8QK5LP',
    focalLength:null, focalLengthMin:24, focalLengthMax:50, focalLengthEquiv:'24-50mm',
    maxAperture:4.0, minAperture:22, weight:195, length:51.0, diameter:73.5,
    filterThread:52, minFocusDist:35, maxMagnification:0.17,
    elements:11, groups:10, blades:7, afType:'Stepping Motor',
    weatherSealed:false, ois:false, oisStops:null, year:2020, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Nikon_Z_5_with_Nikkor_Z_24-50mm_F4-6.3_-_by_Henry_S%C3%B6derlund_%2850328069222%29.jpg/500px-Nikon_Z_5_with_Nikkor_Z_24-50mm_F4-6.3_-_by_Henry_S%C3%B6derlund_%2850328069222%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Z_5_with_Nikkor_Z_24-50mm_F4-6.3_-_by_Henry_S%C3%B6derlund_(50328069222).jpg"},
    prices:{USD:450,AUD:699,EUR:null,GBP:null,JPY:null,CAD:599,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-24-50mm-f4-63/20096/overview',
  },

  'z-24-105mm-f4-71': {
    name:'NIKKOR Z 24-105mm f/4-7.1', manufacturer:'Nikon', line:'NIKKOR Z', type:'Zoom', asin:'B0GFC89WDP',
    focalLength:null, focalLengthMin:24, focalLengthMax:105, focalLengthEquiv:'24-105mm',
    maxAperture:4.0, minAperture:22, weight:350, length:106.5, diameter:73.5,
    filterThread:67, minFocusDist:200, maxMagnification:0.5,
    elements:12, groups:10, blades:7, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2026, discontinued:false,
    imageUrl:'https://images.cdn.us-central1.gcp.commercetools.com/f7c8f2bb-aff1-4581-a826-1ad2527be222/20132-NIKKOR-Z-24-10-8irjOZ9i-large.png',
    imageSource: { url:'https://www.nikonusa.com/p/nikkor-z-24-105mm-f4-71/20132/overview', tier:'T1', note:'official Nikon USA product page, barrel explicitly reads "NIKKOR 24-105/4-7.1"', date:'2026-08-17' },
    prices:{USD:550,AUD:899,EUR:null,GBP:null,JPY:null,CAD:699,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-24-105mm-f4-71/20132/overview',
  },

  /* ── FX Video Power Zoom ── */
  'z-28-135mm-f4-pz': {
    name:'NIKKOR Z 28-135mm f/4 PZ', manufacturer:'Nikon', line:'NIKKOR Z', type:'Zoom', asin:'B0F561J59R',
    focalLength:null, focalLengthMin:28, focalLengthMax:135, focalLengthEquiv:'28-135mm',
    maxAperture:4.0, minAperture:22, weight:1120, length:177.5, diameter:105.0,
    filterThread:95, minFocusDist:340, maxMagnification:0.25,
    elements:18, groups:13, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2025, discontinued:false,
    imageUrl:'https://images.cdn.us-central1.gcp.commercetools.com/f7c8f2bb-aff1-4581-a826-1ad2527be222/Z28-135_4_angle1-iQRos40Y-large.png',
    imageSource: { url:'https://www.nikonusa.com/p/nikkor-z-28-135mm-f4-pz/20127/overview', tier:'T1', note:'official Nikon USA product page, barrel explicitly reads "NIKKOR 28-135/4 PZ"', date:'2026-08-17' },
    prices:{USD:2500,AUD:3899,EUR:null,GBP:null,JPY:null,CAD:3299,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-28-135mm-f4-pz/20127/overview',
  },

  'z-24-200mm-f4-6-3-vr': {
    name:'NIKKOR Z 24-200mm f/4-6.3 VR', manufacturer:'Nikon', line:'NIKKOR Z', type:'Zoom', asin:'B084QP747Q',
    focalLength:null, focalLengthMin:24, focalLengthMax:200, focalLengthEquiv:'24-200mm',
    maxAperture:4.0, minAperture:22, weight:570, length:114.0, diameter:76.5,
    filterThread:67, minFocusDist:50, maxMagnification:0.28,
    elements:19, groups:15, blades:7, afType:'Stepping Motor',
    weatherSealed:true, ois:true, oisStops:5.0, year:2020, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Nikon_Z_7II_with_Nikkor_Z_24-200mm_f_4-6.3_VR_01_-_by_ato.jpg/500px-Nikon_Z_7II_with_Nikkor_Z_24-200mm_f_4-6.3_VR_01_-_by_ato.jpg',
    imageCredit:{author:"Ato 01", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Z_7II_with_Nikkor_Z_24-200mm_f_4-6.3_VR_01_-_by_ato.jpg"},
    prices:{USD:850,AUD:1299,EUR:null,GBP:null,JPY:null,CAD:1099,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-24-200mm-f4-63-vr/20092/overview',
  },

  'z-28-75mm-f2-8': {
    name:'NIKKOR Z 28-75mm f/2.8', manufacturer:'Nikon', line:'NIKKOR Z', type:'Zoom', asin:'B09NLBL2F1',
    focalLength:null, focalLengthMin:28, focalLengthMax:75, focalLengthEquiv:'28-75mm',
    maxAperture:2.8, minAperture:22, weight:565, length:120.5, diameter:75.0,
    filterThread:67, minFocusDist:19, maxMagnification:0.34,
    elements:15, groups:12, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2021, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Nikon_NIKKOR_Z_28-75mm_f_2.8_%2851832796897%29.jpg/500px-Nikon_NIKKOR_Z_28-75mm_f_2.8_%2851832796897%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_NIKKOR_Z_28-75mm_f_2.8_(51832796897).jpg"},
    prices:{USD:1000,AUD:1599,EUR:null,GBP:null,JPY:null,CAD:1299,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-28-75mm-f28/20107/overview',
  },

  'z-28-400mm-f4-8-vr': {
    name:'NIKKOR Z 28-400mm f/4-8 VR', manufacturer:'Nikon', line:'NIKKOR Z', type:'Zoom', asin:'B0CZ4JX9JW',
    focalLength:null, focalLengthMin:28, focalLengthMax:400, focalLengthEquiv:'28-400mm',
    maxAperture:4.0, minAperture:32, weight:725, length:142.0, diameter:85.0,
    filterThread:77, minFocusDist:20, maxMagnification:0.35,
    elements:21, groups:15, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:true, oisStops:5.0, year:2024, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Nikon_NIKKOR_Z_28-400mm_f_4-8_VR_by_Henry_S%C3%B6derlund.jpg/500px-Nikon_NIKKOR_Z_28-400mm_f_4-8_VR_by_Henry_S%C3%B6derlund.jpg',
    imageCredit:{author:"Henry Söderlund", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_NIKKOR_Z_28-400mm_f_4-8_VR_by_Henry_S%C3%B6derlund.jpg"},
    prices:{USD:1150,AUD:1799,EUR:null,GBP:null,JPY:null,CAD:1499,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-28-400mm-f4-8-vr/20125/overview',
  },

  /* ── Telephoto / Super-Telephoto ── */
  'z-70-180mm-f2-8': {
    name:'NIKKOR Z 70-180mm f/2.8', manufacturer:'Nikon', line:'NIKKOR Z', type:'Zoom', asin:'B0C8QL89L5',
    focalLength:null, focalLengthMin:70, focalLengthMax:180, focalLengthEquiv:'70-180mm',
    maxAperture:2.8, minAperture:22, weight:795, length:151.0, diameter:83.5,
    filterThread:67, minFocusDist:27, maxMagnification:0.48,
    elements:19, groups:14, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2023, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Nikon_NIKKOR_Z_70-180mm_F2.8_%2853061678724%29.jpg/500px-Nikon_NIKKOR_Z_70-180mm_F2.8_%2853061678724%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_NIKKOR_Z_70-180mm_F2.8_(53061678724).jpg"},
    prices:{USD:1200,AUD:1899,EUR:null,GBP:null,JPY:null,CAD:1599,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-70-180mm-f28/20120/overview',
  },

  'z-180-600mm-f5-6-6-3-vr': {
    name:'NIKKOR Z 180-600mm f/5.6-6.3 VR', manufacturer:'Nikon', line:'NIKKOR Z', type:'Zoom', asin:'B0C8QFSPFQ',
    focalLength:null, focalLengthMin:180, focalLengthMax:600, focalLengthEquiv:'180-600mm',
    maxAperture:5.6, minAperture:32, weight:2140, length:315.5, diameter:110.0,
    filterThread:95, minFocusDist:130, maxMagnification:0.25,
    elements:25, groups:17, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:true, oisStops:5.5, year:2023, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Nikon_Nikkor_Z_180-600mm_f5.6-6.3_VR_02.jpg/500px-Nikon_Nikkor_Z_180-600mm_f5.6-6.3_VR_02.jpg',
    imageCredit:{author:"TTTNIS", licence:"CC0", licenceUrl:"http://creativecommons.org/publicdomain/zero/1.0/deed.en", source:"https://commons.wikimedia.org/wiki/File:Nikon_Nikkor_Z_180-600mm_f5.6-6.3_VR_02.jpg"},
    prices:{USD:2100,AUD:3299,EUR:null,GBP:null,JPY:null,CAD:2699,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-180-600mm-f56-63-vr/20117/overview',
  },

  'z-400mm-f4-5-vr-s': {
    name:'NIKKOR Z 400mm f/4.5 VR S', manufacturer:'Nikon', line:'S-Line', type:'Prime', asin:'B0B52C7Z7D',
    focalLength:400, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'400mm',
    maxAperture:4.5, minAperture:32, weight:1245, length:234.5, diameter:104.0,
    filterThread:95, minFocusDist:250, maxMagnification:0.16,
    elements:19, groups:13, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:true, oisStops:5.0, year:2022, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Nikon_Nikkor_Z_400mm_F4.5_VR_S_-_by_Henry_S%C3%B6derlund_%2852456525351%29.jpg/500px-Nikon_Nikkor_Z_400mm_F4.5_VR_S_-_by_Henry_S%C3%B6derlund_%2852456525351%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Nikkor_Z_400mm_F4.5_VR_S_-_by_Henry_S%C3%B6derlund_(52456525351).jpg"},
    prices:{USD:3500,AUD:5499,EUR:null,GBP:null,JPY:null,CAD:4599,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-400mm-f45-vr-s/20112/overview',
  },

  'z-400mm-f2-8-tc-vr-s': {
    name:'NIKKOR Z 400mm f/2.8 TC VR S', manufacturer:'Nikon', line:'S-Line', type:'Prime', asin:'B09QP4SSYW',
    focalLength:400, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'400mm (560mm w/ TC)',
    maxAperture:2.8, minAperture:22, weight:2950, length:380.0, diameter:156.0,
    filterThread:46, minFocusDist:250, maxMagnification:0.16,
    elements:25, groups:19, blades:9, afType:'Silky Swift VCM',
    weatherSealed:true, ois:true, oisStops:5.5, year:2022, discontinued:false,
    imageUrl:'https://images.cdn.us-central1.gcp.commercetools.com/f7c8f2bb-aff1-4581-a826-1ad2527be222/FrontLeft-400_2-8_TC-VVDrxDCL-large.png',
    imageSource: { url:'https://www.nikonusa.com/p/nikkor-z-400mm-f28-tc-vr-s/20111/overview', tier:'T1', note:'official Nikon USA product page, barrel reads "NIKKOR 400/2.8 TC VR S" with gold S-Line ring', date:'2026-08-17' },
    prices:{USD:12700,AUD:19799,EUR:null,GBP:null,JPY:null,CAD:16499,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-400mm-f28-tc-vr-s/20111/overview',
  },

  'z-600mm-f6-3-vr-s-pf': {
    name:'NIKKOR Z 600mm f/6.3 VR S (PF)', manufacturer:'Nikon', line:'S-Line', type:'Prime', asin:'B0CKTYF2ZZ',
    focalLength:600, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'600mm',
    maxAperture:6.3, minAperture:32, weight:1470, length:278.0, diameter:106.5,
    filterThread:95, minFocusDist:400, maxMagnification:0.16,
    elements:21, groups:14, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:true, oisStops:5.5, year:2023, discontinued:false,
    imageUrl:'https://images.cdn.us-central1.gcp.commercetools.com/f7c8f2bb-aff1-4581-a826-1ad2527be222/FrontLeft-z-600_6-3_-T0POGjDD-large.png',
    imageSource: { url:'https://www.nikonusa.com/p/nikkor-z-600mm-f63-vr-s/20122/overview', tier:'T1', note:'official Nikon USA product page, barrel explicitly reads "NIKKOR Z 600mm 1:6.3 VR S Phase Fresnel Lens"', date:'2026-08-17' },
    prices:{USD:4700,AUD:7299,EUR:null,GBP:null,JPY:null,CAD:6099,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-600mm-f63-vr-s/20122/overview',
  },

  'z-600mm-f4-tc-vr-s': {
    name:'NIKKOR Z 600mm f/4 TC VR S', manufacturer:'Nikon', line:'S-Line', type:'Prime', asin:'B0BL5FKJF7',
    focalLength:600, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'600mm (840mm w/ TC)',
    maxAperture:4.0, minAperture:22, weight:3260, length:437.0, diameter:165.0,
    filterThread:46, minFocusDist:440, maxMagnification:0.14,
    elements:26, groups:20, blades:9, afType:'Silky Swift VCM',
    weatherSealed:true, ois:true, oisStops:5.5, year:2022, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Nikon_Nikkor_Z_600mm_F4_TC_VR_S_20260516113641.jpg/500px-Nikon_Nikkor_Z_600mm_F4_TC_VR_S_20260516113641.jpg',
    imageCredit:{author:"TurnOnTheNight", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Nikkor_Z_600mm_F4_TC_VR_S_20260516113641.jpg"},
    prices:{USD:14700,AUD:22899,EUR:null,GBP:null,JPY:null,CAD:19099,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-600mm-f4-tc-vr-s/20113/overview',
  },

  'z-800mm-f6-3-vr-s-pf': {
    name:'NIKKOR Z 800mm f/6.3 VR S (PF)', manufacturer:'Nikon', line:'S-Line', type:'Prime', asin:'B09X8TBSFZ',
    focalLength:800, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'800mm',
    maxAperture:6.3, minAperture:32, weight:2385, length:385.0, diameter:140.0,
    filterThread:46, minFocusDist:500, maxMagnification:0.16,
    elements:22, groups:14, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:true, oisStops:5.0, year:2022, discontinued:false,
    imageUrl:'https://images.cdn.us-central1.gcp.commercetools.com/f7c8f2bb-aff1-4581-a826-1ad2527be222/Front-20108_0000_Z80-BHlnKaSL-large.png',
    imageSource: { url:'https://www.nikonusa.com/p/nikkor-z-800mm-f63-vr-s/20108/overview', tier:'T1', note:'official Nikon USA product page, gold S-Line ring and tripod foot match the 800mm PF', date:'2026-08-17' },
    prices:{USD:6000,AUD:9399,EUR:null,GBP:null,JPY:null,CAD:7799,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-800mm-f63-vr-s/20108/overview',
  },

  /* ── DX Zooms ── */
  'z-dx-12-28mm-pz-vr': {
    name:'NIKKOR Z DX 12-28mm f/3.5-5.6 PZ VR', manufacturer:'Nikon', line:'DX', type:'Zoom', asin:'B0C2RHKLDK',
    focalLength:null, focalLengthMin:12, focalLengthMax:28, focalLengthEquiv:'18-42mm',
    maxAperture:3.5, minAperture:22, weight:205, length:63.5, diameter:72.0,
    filterThread:67, minFocusDist:19, maxMagnification:0.21,
    elements:12, groups:11, blades:7, afType:'Stepping Motor',
    weatherSealed:false, ois:true, oisStops:null, year:2023, discontinued:false,
    imageUrl:'https://images.cdn.us-central1.gcp.commercetools.com/f7c8f2bb-aff1-4581-a826-1ad2527be222/FrontLeft-Z12-28DX_3-ZrP_ChZS-large.png',
    imageSource: { url:'https://www.nikonusa.com/p/nikkor-z-dx-12-28mm-f35-56-pz-vr/20118/overview', tier:'T1', note:'official Nikon USA product page, barrel explicitly reads "DX 12-28/3.5-5.6 PZ"', date:'2026-08-17' },
    prices:{USD:340,AUD:499,EUR:null,GBP:null,JPY:null,CAD:399,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-dx-12-28mm-f35-56-pz-vr/20118/overview',
  },

  'z-dx-16-50mm-vr': {
    name:'NIKKOR Z DX 16-50mm f/3.5-6.3 VR', manufacturer:'Nikon', line:'DX', type:'Zoom', asin:'B07YX95XJL',
    focalLength:null, focalLengthMin:16, focalLengthMax:50, focalLengthEquiv:'24-75mm',
    maxAperture:3.5, minAperture:22, weight:135, length:32.0, diameter:70.0,
    filterThread:46, minFocusDist:20, maxMagnification:0.20,
    elements:9, groups:7, blades:7, afType:'Stepping Motor',
    weatherSealed:false, ois:true, oisStops:4.5, year:2019, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Nikon_Z_50_Nikkor_Z_DX_16-50_VR.jpg/500px-Nikon_Z_50_Nikkor_Z_DX_16-50_VR.jpg',
    imageCredit:{author:"Thilo Parg", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0", source:"https://commons.wikimedia.org/wiki/File:Nikon_Z_50_Nikkor_Z_DX_16-50_VR.jpg"},
    prices:{USD:330,AUD:499,EUR:null,GBP:null,JPY:null,CAD:399,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-dx-16-50mm-f35-63-vr/20084/overview',
  },

  /* New release, added 2026-08-22: announced Oct 2025, found via a full
     nikonusa.com lens-lineup sweep (missed by prior refreshes since it wasn't
     new enough to surface in "announced 2026" searches). First DX lens with a
     metal, weather-sealed mount and constant f/2.8 aperture. */
  'z-dx-16-50mm-f28-vr': {
    name:'NIKKOR Z DX 16-50mm f/2.8 VR', manufacturer:'Nikon', line:'DX', type:'Zoom', asin:'B0FWD8HPVV',
    focalLength:null, focalLengthMin:16, focalLengthMax:50, focalLengthEquiv:'24-75mm',
    maxAperture:2.8, minAperture:22, weight:330, length:88.0, diameter:74.5,
    filterThread:67, minFocusDist:150, maxMagnification:0.24,
    elements:12, groups:11, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:true, oisStops:5.0, year:2025, discontinued:false,
    imageUrl:'https://images.contentstack.io/v3/assets/blt0e5ec1de4817c440/blt8b35b096fe184040/68dc1e5c877911c2e788b1b6/20133-hero.jpg',
    imageSource: { url:'https://www.nikonusa.com/p/nikkor-z-dx-16-50mm-f28-vr/20133/overview', tier:'T1', note:'official Nikon USA product page', date:'2026-08-22' },
    prices:{USD:900,AUD:1399,EUR:null,GBP:null,JPY:null,CAD:1199,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-dx-16-50mm-f28-vr/20133/overview',
  },

  'z-dx-18-140mm-vr': {
    name:'NIKKOR Z DX 18-140mm f/3.5-6.3 VR', manufacturer:'Nikon', line:'DX', type:'Zoom', asin:'B09JBJKRBZ',
    focalLength:null, focalLengthMin:18, focalLengthMax:140, focalLengthEquiv:'27-210mm',
    maxAperture:3.5, minAperture:22, weight:315, length:90.0, diameter:73.0,
    filterThread:62, minFocusDist:20, maxMagnification:0.33,
    elements:17, groups:13, blades:7, afType:'Stepping Motor',
    weatherSealed:false, ois:true, oisStops:5.0, year:2021, discontinued:false,
    imageUrl:'https://images.cdn.us-central1.gcp.commercetools.com/f7c8f2bb-aff1-4581-a826-1ad2527be222/FrontLeft-18-140-ang-ETfXyeyH-large.png',
    imageSource: { url:'https://www.nikonusa.com/p/nikkor-z-dx-18-140mm-f35-63-vr/20104/overview', tier:'T1', note:'official Nikon USA product page, barrel explicitly reads "DX 18-140/3.5-6.3"', date:'2026-08-17' },
    prices:{USD:680,AUD:1099,EUR:null,GBP:null,JPY:null,CAD:899,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-dx-18-140mm-f35-63-vr/20104/overview',
  },

  'z-dx-50-250mm-vr': {
    name:'NIKKOR Z DX 50-250mm f/4.5-6.3 VR', manufacturer:'Nikon', line:'DX', type:'Zoom', asin:'B07YX9KYQZ',
    focalLength:null, focalLengthMin:50, focalLengthMax:250, focalLengthEquiv:'75-375mm',
    maxAperture:4.5, minAperture:22, weight:405, length:110.0, diameter:74.0,
    filterThread:62, minFocusDist:50, maxMagnification:0.23,
    elements:16, groups:12, blades:7, afType:'Stepping Motor',
    weatherSealed:false, ois:true, oisStops:5.0, year:2019, discontinued:false,
    imageUrl:'https://images.cdn.us-central1.gcp.commercetools.com/f7c8f2bb-aff1-4581-a826-1ad2527be222/FrontLeft-20085-NIKK-d7o497AX-large.png',
    imageSource: { url:'https://www.nikonusa.com/p/nikkor-z-dx-50-250mm-f45-63-vr/20085/overview', tier:'T1', note:'official Nikon USA product page, barrel explicitly reads "DX 50-250/4.5-6.3"', date:'2026-08-17' },
    prices:{USD:410,AUD:599,EUR:null,GBP:null,JPY:null,CAD:499,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.nikonusa.com/p/nikkor-z-dx-50-250mm-f45-63-vr/20085/overview',
  },

  /* ── Sigma (Z DX, APS-C DC DN) ── */
  /* Nikon Z APS-C crop = 1.5×. Sigma's official Z lineup is only these 3 DC DN
     primes (Nikon licenses no full-frame Sigma). Z-mount weights from Sigma.
     Re-verified 2026-08-29 (round-2 Sigma+Tamron re-check): sigma-global.com's
     mount-selector still lists Nikon Z on only these 3 (16/30/56mm); checked
     18-50mm f/2.8, 10-18mm f/2.8, and 23mm f/1.4 DC DN individually — none
     list Nikon Z among their available mounts. No DG DN (full-frame) Sigma on
     Z exists — corroborated by a PetaPixel piece dated 2025-11-02 stating
     Nikon still blocks Sigma's full-frame AF lenses from Z-mount. USD prices
     re-checked against sigmaphoto.com: the stored figures are the "Regular
     Price" (RRP); sigmaphoto.com's current "As low as" figures ($414/$344/
     $434) are an active Instant Savings promo, not the RRP — left unchanged
     per the "USD = RRP, not a sale price" convention. */
  'sigma-16mm-f14': {
    name:'Sigma 16mm f/1.4 DC DN', manufacturer:'Sigma', line:'Contemporary', type:'Prime',
    focalLength:16, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'24mm',
    maxAperture:1.4, minAperture:16, weight:420, length:94.3, diameter:72.2,
    filterThread:67, minFocusDist:25, maxMagnification:0.1,
    elements:16, groups:13, blades:9, afType:'Stepping Motor',
    weatherSealed:false, ois:false, oisStops:null, year:2023, discontinued:false,
    imageUrl:'https://www.sigma-global.com/lenses/c017_16_14_product_img01.png',
    asin:'B0C1KLRJDW',
    prices:{USD:539,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.sigma-global.com/en/lenses/c017_16_14/',
  },

  'sigma-30mm-f14': {
    name:'Sigma 30mm f/1.4 DC DN', manufacturer:'Sigma', line:'Contemporary', type:'Prime',
    focalLength:30, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'45mm',
    maxAperture:1.4, minAperture:16, weight:285, length:75.3, diameter:70,
    filterThread:52, minFocusDist:30, maxMagnification:0.14,
    elements:9, groups:7, blades:9, afType:'Stepping Motor',
    weatherSealed:false, ois:false, oisStops:null, year:2023, discontinued:false,
    imageUrl:'https://www.sigma-global.com/lenses/c016_30_14_product_img01.png',
    asin:'B0C1KNW8ND',
    prices:{USD:419,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.sigma-global.com/en/lenses/c016_30_14/',
  },

  'sigma-56mm-f14': {
    name:'Sigma 56mm f/1.4 DC DN', manufacturer:'Sigma', line:'Contemporary', type:'Prime',
    focalLength:56, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'84mm',
    maxAperture:1.4, minAperture:16, weight:295, length:61.5, diameter:70,
    filterThread:55, minFocusDist:50, maxMagnification:0.14,
    elements:10, groups:6, blades:9, afType:'Stepping Motor',
    weatherSealed:false, ois:false, oisStops:null, year:2023, discontinued:false,
    imageUrl:'https://www.sigma-global.com/lenses/c018_56_14_product_img01.png',
    asin:'B0C1L1XN3J',
    prices:{USD:559,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.sigma-global.com/en/lenses/c018_56_14/',
  },

  /* ── Viltrox (Z mount AF) — largest third-party line on Z ── */
  /* Optical specs shared with the E-mount versions (verified); Z APS-C = 1.5×. */
  'viltrox-13mm-f14': {
    name:'Viltrox AF 13mm f/1.4', manufacturer:'Viltrox', line:'AF', type:'Prime',
    focalLength:13, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'20mm',
    maxAperture:1.4, minAperture:16, weight:420, length:90, diameter:74,
    filterThread:67, minFocusDist:22, maxMagnification:0.1,
    elements:14, groups:11, blades:9, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2022, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF_13mm_F1.4_Z_e9851952-426c-4703-9f6b-6f852d5db7ce-869298.png',
    imageSource: { url:'https://viltrox.com/products/af-13mmf14-z-mount-aps-c-prime-lens-for-nikon-z', tier:'T1', note:'official Viltrox store page, barrel explicitly reads "AF 13/1.4 Z"', date:'2026-08-17' },
    asin:null,
    prices:{USD:486,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:null,
  },

  'viltrox-16mm-f18': {
    name:'Viltrox AF 16mm f/1.8', manufacturer:'Viltrox', line:'Pro', type:'Prime',
    focalLength:16, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'16mm',
    maxAperture:1.8, minAperture:22, weight:550, length:101, diameter:85.2,
    filterThread:77, minFocusDist:27, maxMagnification:0.1,
    elements:15, groups:12, blades:9, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2023, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF16mm_F1.8_Z-924956.png',
    imageSource: { url:'https://viltrox.com/products/viltrox-af-16mm-f1-8-z', tier:'T1', note:'official Viltrox store page, barrel explicitly reads "AF 16/1.8 Z"', date:'2026-08-17' },
    asin:null,
    prices:{USD:580,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:null,
  },

  'viltrox-27mm-f12': {
    name:'Viltrox AF 27mm f/1.2 Pro', manufacturer:'Viltrox', line:'Pro', type:'Prime',
    focalLength:27, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'41mm',
    maxAperture:1.2, minAperture:16, weight:560, length:92, diameter:82,
    filterThread:67, minFocusDist:28, maxMagnification:0.15,
    elements:15, groups:11, blades:11, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2024, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/VILTROX_AF_27mm_F1.2_Pro_20250517112908.jpg/500px-VILTROX_AF_27mm_F1.2_Pro_20250517112908.jpg',
    imageCredit:{author:"TurnOnTheNight", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0", source:"https://commons.wikimedia.org/wiki/File:VILTROX_AF_27mm_F1.2_Pro_20250517112908.jpg"}, asin:null,
    prices:{USD:578,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:null,
  },

  'viltrox-33mm-f14': {
    name:'Viltrox AF 33mm f/1.4', manufacturer:'Viltrox', line:'AF', type:'Prime',
    focalLength:33, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'50mm',
    maxAperture:1.4, minAperture:16, weight:270, length:72, diameter:65,
    filterThread:52, minFocusDist:40, maxMagnification:0.1,
    elements:10, groups:9, blades:9, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2021, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF33mm_F1.4_Z-683315.png',
    imageSource: { url:'https://viltrox.com/products/viltrox-af-33mm-f1-4-aps-c-lens-for-nikon-z-mount', tier:'T1', note:'official Viltrox store page, barrel explicitly reads "AF 33/1.4 Z" and "Z-mount"', date:'2026-08-17' },
    asin:null,
    prices:{USD:239,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:null,
  },

  'viltrox-56mm-f14': {
    name:'Viltrox AF 56mm f/1.4', manufacturer:'Viltrox', line:'AF', type:'Prime',
    focalLength:56, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'84mm',
    maxAperture:1.4, minAperture:16, weight:320, length:72, diameter:65,
    filterThread:52, minFocusDist:60, maxMagnification:0.1,
    elements:10, groups:9, blades:9, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2021, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF56mm_F1.4_Z-848378.png',
    imageSource: { url:'https://viltrox.com/products/viltrox-af-56mm-f1-4-aps-c-lens-for-nikon-z-mount', tier:'T1', note:'official Viltrox store page, barrel explicitly reads "AF 56/1.4 Z" and "Z-mount"', date:'2026-08-17' },
    asin:null,
    prices:{USD:239,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:null,
  },

  /* No "II" revision of this lens exists for Nikon Z — confirmed 2026-08-22 via
     viltrox.com's own product search: "AF 85mm F1.8 II" is sold only for Sony
     E-mount and Fujifilm X-mount (both $399, with a $329 sale price active at
     check time). The plain (non-II) "AF 85mm f/1.8 Z" is the real Nikon Z
     product this entry describes (year:2020, STM AF, elements/groups match
     B&H's listing) but has been dropped from viltrox.com's own current
     storefront (its official product URL now 404s/redirects home); B&H still
     stocks it new at $329 as of this check. */
  'viltrox-85mm-f18-ii': {
    name:'Viltrox AF 85mm f/1.8', manufacturer:'Viltrox', line:'AF', type:'Prime',
    focalLength:85, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'85mm',
    maxAperture:1.8, minAperture:16, weight:371, length:92, diameter:80,
    filterThread:72, minFocusDist:80, maxMagnification:0.12,
    elements:10, groups:7, blades:9, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2020, discontinued:false,
    imageUrl:null, asin:null,
    prices:{USD:329,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.bhphotovideo.com/c/product/1612520-REG/viltrox_af_85_1_8_z_85mm_f_1_8_lens_for.html',
  },

  /* ── Viltrox APS-C additions (round 2, 2026-08-30) — diffed against viltrox.com's
     own Z-mount collection (32 products listed, incl. the E-mount-only "New Products"
     nav items excluded here). Each entry's mount-specific weight/size/price verified
     on its own Z-mount product page (viltrox.com/products/<slug>). ── */
  'viltrox-90mm-f22-evo': {
    name:'Viltrox AF 90mm F2.2 EVO', manufacturer:'Viltrox', line:'EVO', type:'Prime',
    focalLength:90, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'135mm',
    maxAperture:2.2, minAperture:16, weight:345, length:78, diameter:69,
    filterThread:58, minFocusDist:74, maxMagnification:0.14,
    elements:10, groups:8, blades:null, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2026, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF90mmF2.2EVOZ-frontview.png',
    imageSource: { url:'https://viltrox.com/products/af-90mm-f2-2-z', tier:'T1', note:'official Viltrox store page, spec dialog reads "AF 90/2.2 EVO Z"; blade count genuinely unpublished on this SKU\'s spec table', date:'2026-08-30' },
    asin:null,
    prices:{USD:369,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/af-90mm-f2-2-z',
  },

  'viltrox-75mm-f18-evo': {
    name:'Viltrox AF 75mm F1.8 EVO', manufacturer:'Viltrox', line:'EVO', type:'Prime',
    focalLength:75, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'113mm',
    maxAperture:1.8, minAperture:16, weight:355, length:78, diameter:69,
    filterThread:58, minFocusDist:74, maxMagnification:0.12,
    elements:11, groups:9, blades:null, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2026, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF75mmF1.8EVOZ-frontview.png',
    imageSource: { url:'https://viltrox.com/products/af-75mm-f1-8-z', tier:'T1', note:'official Viltrox store page, spec dialog reads "AF 75/1.8 EVO Z"; shares its Φ69x78mm barrel with the 90mm EVO sibling per the page\'s own comparison table', date:'2026-08-30' },
    asin:null,
    prices:{USD:329,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/af-75mm-f1-8-z',
  },

  'viltrox-56mm-f12-pro': {
    name:'Viltrox AF 56mm F1.2 Pro', manufacturer:'Viltrox', line:'Pro', type:'Prime',
    focalLength:56, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'84mm',
    maxAperture:1.2, minAperture:16, weight:595, length:94.1, diameter:78.4,
    filterThread:67, minFocusDist:50, maxMagnification:0.13,
    elements:13, groups:8, blades:null, afType:'VCM',
    weatherSealed:true, ois:false, oisStops:null, year:2026, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF_56mm_F1.2_Pro_Z-Front_view2.png',
    imageSource: { url:'https://viltrox.com/products/af-56mm-f1-2-z', tier:'T1', note:'official Viltrox store page, spec dialog reads "AF 56/1.2 Pro Z"; full-metal weather-sealed body explicitly claimed', date:'2026-08-30' },
    asin:null,
    prices:{USD:580,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/af-56mm-f1-2-z',
  },

  'viltrox-9mm-f28-air': {
    name:'Viltrox AF 9mm F2.8 Air', manufacturer:'Viltrox', line:'Air', type:'Prime',
    focalLength:9, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'14mm',
    maxAperture:2.8, minAperture:16, weight:190, length:58.4, diameter:65,
    filterThread:58, minFocusDist:13, maxMagnification:0.15,
    elements:13, groups:11, blades:null, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2025, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF_9mm_F2.8_Air_Z-front_view.png',
    imageSource: { url:'https://viltrox.com/products/af-9mm-f2-8-z', tier:'T1', note:'official Viltrox store page, spec dialog reads "AF 9/2.8 Air Z"; f=9mm(13.5mm) equiv per maker, rounded to 14mm per project convention', date:'2026-08-30' },
    asin:null,
    prices:{USD:199,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/af-9mm-f2-8-z',
  },

  'viltrox-15mm-f17-air': {
    name:'Viltrox AF 15mm F1.7 Air', manufacturer:'Viltrox', line:'Air', type:'Prime',
    focalLength:15, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'23mm',
    maxAperture:1.7, minAperture:16, weight:195, length:58.5, diameter:65,
    filterThread:58, minFocusDist:23, maxMagnification:0.1,
    elements:12, groups:10, blades:null, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2025, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF_15mm_F1.7_Air_Z-front_view.png',
    imageSource: { url:'https://viltrox.com/products/af-15mm-f1-7-z', tier:'T1', note:'official Viltrox store page, spec dialog reads "AF 15/1.7 Air Z"', date:'2026-08-30' },
    asin:null,
    prices:{USD:239,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/af-15mm-f1-7-z',
  },

  'viltrox-25mm-f17-air': {
    name:'Viltrox AF 25mm F1.7 Air', manufacturer:'Viltrox', line:'Air', type:'Prime',
    focalLength:25, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'38mm',
    maxAperture:1.7, minAperture:16, weight:180, length:56.4, diameter:64,
    filterThread:52, minFocusDist:30, maxMagnification:0.11,
    elements:12, groups:10, blades:9, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2025, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF25mmF1.7Z8_f02ff988-cb8a-43aa-b012-af493494b169.png',
    imageSource: { url:'https://viltrox.com/products/af-25mm-f1-7-z', tier:'T1', note:'official Viltrox store page, spec dialog reads "AF 25/1.7 Air Z"', date:'2026-08-30' },
    asin:null,
    prices:{USD:176,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/af-25mm-f1-7-z',
  },

  'viltrox-35mm-f17-air': {
    name:'Viltrox AF 35mm F1.7 Air', manufacturer:'Viltrox', line:'Air', type:'Prime',
    focalLength:35, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'53mm',
    maxAperture:1.7, minAperture:16, weight:180, length:56.4, diameter:64,
    filterThread:52, minFocusDist:33, maxMagnification:0.13,
    elements:11, groups:9, blades:9, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2024, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/35mmF1.7Zfrontview-699833.png',
    imageSource: { url:'https://viltrox.com/products/viltrox-af-35mm-f1-7-aps-c-lens-for-nikon-z-mount', tier:'T1', note:'official Viltrox store page, spec dialog reads "AF 35/1.7 Air Z"', date:'2026-08-30' },
    asin:null,
    prices:{USD:179,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/viltrox-af-35mm-f1-7-aps-c-lens-for-nikon-z-mount',
  },

  'viltrox-23mm-f14': {
    name:'Viltrox AF 23mm F1.4', manufacturer:'Viltrox', line:'AF', type:'Prime',
    focalLength:23, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'35mm',
    maxAperture:1.4, minAperture:16, weight:300, length:73, diameter:69,
    filterThread:52, minFocusDist:30, maxMagnification:0.1,
    elements:11, groups:10, blades:9, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2024, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF23mm_F1.4_Z-111561.png',
    imageSource: { url:'https://viltrox.com/products/viltrox-af-23mm-f1-4-aps-c-lens-for-nikon-z-mount', tier:'T1', note:'official Viltrox store page, Z-mount-specific spec table (comparison table separates E/Z/X mounts)', date:'2026-08-30' },
    asin:null,
    prices:{USD:239,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/viltrox-af-23mm-f1-4-aps-c-lens-for-nikon-z-mount',
  },

  'viltrox-75mm-f12-pro': {
    name:'Viltrox AF 75mm F1.2 Pro', manufacturer:'Viltrox', line:'Pro', type:'Prime',
    focalLength:75, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'113mm',
    maxAperture:1.2, minAperture:16, weight:710, length:102, diameter:87,
    filterThread:77, minFocusDist:88, maxMagnification:0.1,
    elements:16, groups:11, blades:11, afType:'STM',
    weatherSealed:true, ois:false, oisStops:null, year:2024, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF75mm_F1.2_Z-330480.png',
    imageSource: { url:'https://viltrox.com/products/viltrox-af-75mm-f1-2-aps-c-lens-for-nikon-z-mount', tier:'T1', note:'official Viltrox store page; per-mount comparison table gives Z-mount weight 710g (E-mount ~35g lighter) — "Three Layers of Protection" waterproof/dustproof claim explicit', date:'2026-08-30' },
    asin:null,
    prices:{USD:580,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/viltrox-af-75mm-f1-2-aps-c-lens-for-nikon-z-mount',
  },

  'viltrox-56mm-f17-air': {
    name:'Viltrox AF 56mm F1.7 Air', manufacturer:'Viltrox', line:'Air', type:'Prime',
    focalLength:56, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'84mm',
    maxAperture:1.7, minAperture:16, weight:187, length:55.9, diameter:68,
    filterThread:52, minFocusDist:55, maxMagnification:0.11,
    elements:11, groups:9, blades:9, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2024, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF56mm_F1.7_Z-917847.png',
    imageSource: { url:'https://viltrox.com/products/viltrox-af-56mm-f1-7-aps-c-lens-for-nikno-z-mount', tier:'T1', note:'official Viltrox store page (note: maker\'s own URL slug has a typo, "nikno"); Z-mount-specific weight/size in the page\'s comparison table (68x55.9mm/187g)', date:'2026-08-30' },
    asin:null,
    prices:{USD:180,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/viltrox-af-56mm-f1-7-aps-c-lens-for-nikno-z-mount',
  },

  /* ── Tamron (Z mount Di III) ── */
  /* APS-C = 1.5× crop. `year` is the Nikon-Z-mount launch date, not the lens's
     original (usually Sony) release — verified per-mount 2026-08-08 after
     several were found copied from the wrong mount's launch.
     Re-verified 2026-08-29 (round-2 Sigma+Tamron re-check) against
     tamron.com's own per-mount spec tables (spec.html pages print Nikon Z and
     Sony E side by side): weight/length on 17-70, 35-150, 50-400 and 70-300
     turned out to still be the Sony E figures despite the block comment above
     claiming a "verified" mount delta — corrected to the genuine Nikon-Z
     figures below. 18-300 and 150-500 were already Nikon-Z-specific and are
     unchanged. See research/lenses.md for the per-lens before/after.

     Round-2 new-lens search (2026-08-30): tamron.com's own Nikon Z lineup
     page (tamron.com/global/consumer/lenses/nikon_z/) surfaced 6 Tamron Di
     III lenses not yet entered — the "G2 trinity" (16-30mm f/2.8 G2, 28-75mm
     f/2.8 G2, 70-180mm f/2.8 G2), 12-20mm f/2.8, 35-100mm f/2.8, and the 90mm
     f/2.8 macro — each confirmed via its own Nikon-Z-specific spec.html
     table plus a per-mount B&H SKU/Amazon listing. This corrects the header
     this comment used to carry ("excludes 17-28/28-75/70-180, sold as
     Nikkor Z"): that exclusion is only true of the *G1* originals — Tamron's
     A036 (28-75mm G1) and A056 (70-180mm G1) spec pages state "SONY E Mount
     (End of sale)" with no Nikon Z ever offered, and there's no confirmed
     Nikkor-rebadge relationship (round-1's note appears to have conflated
     "no Z SKU" with "rebadged"). The G2 successors ship for Z directly under
     the Tamron name and are entered below. Also checked and confirmed
     Sony-E-only (not entered): 20-40mm f/2.8, 50-300mm f/4.5-6.3. See
     research/lenses.md for full citations. */
  'tamron-17-70mm-f28': {
    name:'Tamron 17-70mm f/2.8 Di III-A VC RXD', manufacturer:'Tamron', line:'Di III-A', type:'Zoom',
    focalLength:null, focalLengthMin:17, focalLengthMax:70, focalLengthEquiv:'26-105mm',
    maxAperture:2.8, minAperture:22, weight:540, length:121.3, diameter:74.6,
    filterThread:67, minFocusDist:19, maxMagnification:0.21,
    elements:16, groups:12, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:true, oisStops:null, year:2026, discontinued:false,
    imageUrl:null, asin:'B0H6YGLQTF',
    specSources: [
      { url:'https://www.tamron.com/global/consumer/lenses/b070/spec.html', tier:'T1', note:'Nikon-Z-specific spec table: weight 540g / length 121.3mm — corrected from a stored 525g/119.3mm that matched the Sony E-mount column on the same page, not the Nikon Z column.', date:'2026-08-29' },
    ],
    prices:{USD:749,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true,
    productUrl:'https://tamron-americas.com/product/17-70mm-f-2-8-di-iii-a-vc-rxd/',
  },

  'tamron-18-300mm-f35-63': {
    name:'Tamron 18-300mm f/3.5-6.3 Di III-A VC VXD', manufacturer:'Tamron', line:'Di III-A', type:'Zoom',
    focalLength:null, focalLengthMin:18, focalLengthMax:300, focalLengthEquiv:'27-450mm',
    maxAperture:3.5, minAperture:22, weight:635, length:127.6, diameter:75.5,
    filterThread:67, minFocusDist:15, maxMagnification:0.5,
    elements:19, groups:15, blades:7, afType:'Linear Motor',
    weatherSealed:true, ois:true, oisStops:null, year:2025, discontinued:false,
    imageUrl:null, asin:null,
    prices:{USD:629,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true,
    productUrl:'https://tamron-americas.com/product/18-300mm-f-3-5-6-3-di-iii-a-vc-vxd/',
  },

  'tamron-35-150mm-f2-28': {
    name:'Tamron 35-150mm f/2-2.8 Di III VXD', manufacturer:'Tamron', line:'Di III', type:'Zoom',
    focalLength:null, focalLengthMin:35, focalLengthMax:150, focalLengthEquiv:'35-150mm',
    maxAperture:2.0, minAperture:22, weight:1190, length:160.1, diameter:89.2,
    filterThread:82, minFocusDist:33, maxMagnification:0.18,
    elements:21, groups:15, blades:9, afType:'Linear Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2023, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Tamron_35-150mm_F2-2.8_Di_III_VXD_%28model_A058Z%29_Nikon_Z_by_Henry_S%C3%B6derlund.jpg/500px-Tamron_35-150mm_F2-2.8_Di_III_VXD_%28model_A058Z%29_Nikon_Z_by_Henry_S%C3%B6derlund.jpg',
    imageCredit:{author:"Henry Söderlund", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Tamron_35-150mm_F2-2.8_Di_III_VXD_(model_A058Z)_Nikon_Z_by_Henry_S%C3%B6derlund.jpg"}, asin:null,
    specSources: [
      { url:'https://www.tamron.com/global/consumer/lenses/a058/spec.html', tier:'T1', note:'Nikon-Z-specific spec table: weight 1,190g / length 160.1mm — corrected from a stored 1,165g/158mm that matched the Sony E-mount column, not Nikon Z.', date:'2026-08-29' },
    ],
    priceSource: { url:'https://www.dpreview.com/news/8584835899/tamron-s-35-150mm-f2-2-8-for-nikon-z-mount-goes-on-sale-on-sept-21-for-1-999', tier:'NEWS', note:'Nikon Z launch MSRP $1,999, corroborated by tamron.com\'s own dated news post (launch confirmed 2023-09-21, no price on that page) and PetaPixel\'s contemporaneous coverage; corrects a stored $1,799 that matched no found source for this mount ($1,449.95 seen elsewhere is an Amazon sale price, not the RRP).', date:'2026-08-29' },
    prices:{USD:1999,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true,
    productUrl:'https://tamron-americas.com/product/35-150mm-f-2-2-8-di-iii-vxd/',
  },

  'tamron-50-400mm-f45-63': {
    name:'Tamron 50-400mm f/4.5-6.3 Di III VC VXD', manufacturer:'Tamron', line:'Di III', type:'Zoom',
    focalLength:null, focalLengthMin:50, focalLengthMax:400, focalLengthEquiv:'50-400mm',
    maxAperture:4.5, minAperture:22, weight:1180, length:185.8, diameter:88.5,
    filterThread:67, minFocusDist:25, maxMagnification:0.5,
    elements:24, groups:18, blades:9, afType:'Linear Motor',
    weatherSealed:true, ois:true, oisStops:null, year:2024, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Tamron_50-400mm_F4.5-6.3_Di_III_VC_VXD%2C_Nikon_Z_%2853995931346%29.jpg/500px-Tamron_50-400mm_F4.5-6.3_Di_III_VC_VXD%2C_Nikon_Z_%2853995931346%29.jpg',
    imageCredit:{author:"Henry Söderlund", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Tamron_50-400mm_F4.5-6.3_Di_III_VC_VXD,_Nikon_Z_(53995931346).jpg"}, asin:null,
    specSources: [
      { url:'https://www.tamron.com/global/consumer/lenses/a067/spec.html', tier:'T1', note:'Nikon-Z-specific spec table: weight 1,180g / length 185.8mm — corrected from a stored 1,155g/183.4mm that matched the Sony E-mount column, not Nikon Z.', date:'2026-08-29' },
    ],
    prices:{USD:1299,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true,
    productUrl:'https://tamron-americas.com/product/50-400mm-f-4-5-6-3-di-iii-vc-vxd/',
  },

  'tamron-70-300mm-f45-63': {
    name:'Tamron 70-300mm f/4.5-6.3 Di III RXD', manufacturer:'Tamron', line:'Di III', type:'Zoom',
    focalLength:null, focalLengthMin:70, focalLengthMax:300, focalLengthEquiv:'70-300mm',
    maxAperture:4.5, minAperture:22, weight:580, length:150.3, diameter:77,
    filterThread:67, minFocusDist:80, maxMagnification:0.2,
    elements:15, groups:10, blades:7, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2022, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tamron_70-300mm_F_4.5-6.3_Di_III_RXD_%28Model_A047Z%29_Nikon_Z_%2852393501355%29.jpg/500px-Tamron_70-300mm_F_4.5-6.3_Di_III_RXD_%28Model_A047Z%29_Nikon_Z_%2852393501355%29.jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Tamron_70-300mm_F_4.5-6.3_Di_III_RXD_(Model_A047Z)_Nikon_Z_(52393501355).jpg"}, asin:null,
    // Price re-verified 2026-08-22: tamron-americas.com's own Nikon Z variant
    // selector shows $499 (matches B&H's current $499 exactly), down from the
    // $549 launch-era figure last confirmed in 2022.
    specSources: [
      { url:'https://www.tamron.com/global/consumer/lenses/a047/spec.html', tier:'T1', note:'Nikon-Z-specific spec table: weight 580g / length 150.3mm — corrected from a stored 545g/148mm that matched the Sony E-mount column, not Nikon Z. Also corrected maxMagnification: the page states 1:9.4 (WIDE) / 1:5.1 (TELE) — the TELE figure (0.20) is the true maximum across the range, not the stored 0.11 which had taken the WIDE figure.', date:'2026-08-29' },
    ],
    prices:{USD:499,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true,
    productUrl:'https://tamron-americas.com/product/70-300mm-f-4-5-6-3-di-iii-rxd/',
  },

  'tamron-150-500mm-f5-67': {
    name:'Tamron 150-500mm f/5-6.7 Di III VC VXD', manufacturer:'Tamron', line:'Di III', type:'Zoom',
    focalLength:null, focalLengthMin:150, focalLengthMax:500, focalLengthEquiv:'150-500mm',
    maxAperture:5.0, minAperture:22, weight:1720, length:212.3, diameter:93,
    filterThread:82, minFocusDist:60, maxMagnification:0.32,
    elements:25, groups:16, blades:7, afType:'Linear Motor',
    weatherSealed:true, ois:true, oisStops:null, year:2023, discontinued:false,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Tamron_150-500mm_F5-6.7_Di_III_VC_VXD_%28Model_A057Z%29_%2853272622666%29.jpg/500px-Tamron_150-500mm_F5-6.7_Di_III_VC_VXD_%28Model_A057Z%29_%2853272622666%29.jpg',
    imageCredit:{author:"Henry Söderlund", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0", source:"https://commons.wikimedia.org/wiki/File:Tamron_150-500mm_F5-6.7_Di_III_VC_VXD_(Model_A057Z)_(53272622666).jpg"}, asin:null,
    // Price re-verified 2026-08-22: tamron-americas.com shows this SKU out of
    // stock (no live price on the official store), but B&H and Adorama both
    // independently list $1,199 for the Nikon Z variant — down from the $1,399
    // launch-era figure last confirmed in 2023. Two-retailer agreement used in
    // place of the unreachable official price per sourcing convention.
    prices:{USD:1199,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true,
    productUrl:'https://tamron-americas.com/product/150-500mm-f-5-6-7-di-iii-vc-vxd/',
  },

  /* New Tamron Z-mount entries below found 2026-08-30 (round-2 new-lens
     search) — see header comment above and research/lenses.md. */
  'tamron-12-20mm-f28': {
    name:'Tamron 12-20mm f/2.8 Di III VXD', manufacturer:'Tamron', line:'Di III', type:'Zoom',
    focalLength:null, focalLengthMin:12, focalLengthMax:20, focalLengthEquiv:'12-20mm',
    maxAperture:2.8, minAperture:16, weight:585, length:121.3, diameter:90,
    filterThread:null, minFocusDist:18, maxMagnification:0.17,
    elements:17, groups:12, blades:12, afType:'Linear Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2026, discontinued:false,
    imageUrl:'https://tamron-americas.com/wp-content/uploads/2026/06/a084z-style.webp',
    asin:null,
    specSources: [
      { url:'https://www.tamron.com/global/consumer/lenses/a084/spec.html', tier:'T1', note:'Nikon-Z-specific spec table: weight 585g / length 121.3mm; filter size is an integrated rear filter holder, no front thread.', date:'2026-08-30' },
    ],
    priceSource: { url:'https://tamron-americas.com/tamron-announces-new-12-20mm-f2-8-for-sony-e-and-nikon-z-mount/', tier:'T1', note:'Nikon Z launch MSRP $1,799 USD / $2,399 CAD (Sony E is $1,699), shipping 2026-08-27 — brand new (3 days old at entry); no Amazon ASIN found yet for the Nikon Z variant.', date:'2026-08-30' },
    prices:{USD:1799,AUD:2799,EUR:2099,GBP:1599,JPY:281000,CAD:2399,SGD:2599},
    productUrl:'https://tamron-americas.com/product/12-20mm-f-2-8/',
  },

  'tamron-16-30mm-f28-g2': {
    name:'Tamron 16-30mm f/2.8 Di III VXD G2', manufacturer:'Tamron', line:'Di III', type:'Zoom',
    focalLength:null, focalLengthMin:16, focalLengthMax:30, focalLengthEquiv:'16-30mm',
    maxAperture:2.8, minAperture:16, weight:450, length:103.9, diameter:74.8,
    filterThread:67, minFocusDist:19, maxMagnification:0.19,
    elements:16, groups:12, blades:9, afType:'Linear Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2025, discontinued:false,
    imageUrl:'https://tamron-americas.com/wp-content/uploads/2026/08/a0641200-x-1200-eisa-wht-1024x1024.webp',
    asin:'B0FJT7ZSJP',
    specSources: [
      { url:'https://www.tamron.com/global/consumer/lenses/a064/spec.html', tier:'T1', note:'Nikon-Z-specific spec table: weight 450g / length 103.9mm (Sony E is 440g/101.8mm).', date:'2026-08-30' },
    ],
    priceSource: { url:'https://tamron-americas.com/announced-ultra-wide-angle-16-30-mm-g2-trinity-sony-nikon/', tier:'T1', note:'"Both mounts will retail for $929 USD" — launched for Z 2025-08-22. No CAD figure published on the official announcement; not found on any independent source either.', date:'2026-08-30' },
    prices:{USD:929,AUD:1399,EUR:1099,GBP:799,JPY:143000,CAD:1199,SGD:1299},
    productUrl:'https://tamron-americas.com/product/16-30mm-f-2-8-di-iii-vxd-g2/',
  },

  'tamron-28-75mm-f28-g2': {
    name:'Tamron 28-75mm f/2.8 Di III VXD G2', manufacturer:'Tamron', line:'Di III', type:'Zoom',
    focalLength:null, focalLengthMin:28, focalLengthMax:75, focalLengthEquiv:'28-75mm',
    maxAperture:2.8, minAperture:22, weight:550, length:119.8, diameter:75.8,
    filterThread:67, minFocusDist:18, maxMagnification:0.37,
    elements:17, groups:15, blades:9, afType:'Linear Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2024, discontinued:false,
    imageUrl:'https://tamron-americas.com/wp-content/uploads/2026/04/a063-1200-x-1200-wht-1024x1024.webp',
    asin:'B0D1W1SRGT',
    specSources: [
      { url:'https://www.tamron.com/global/consumer/lenses/a063/spec.html', tier:'T1', note:'Nikon-Z-specific spec table: weight 550g / length 119.8mm (Sony E is 540g/117.6mm).', date:'2026-08-30' },
    ],
    priceSource: { url:'https://www.tamron.com/global/consumer/news/detail/a063z_20240314.html', tier:'T1', note:'Nikon Z launch MSRP $999 USD / $1,399 CAD, on sale from 2024-04-18 ($100 more than the Sony E price).', date:'2026-08-30' },
    prices:{USD:999,AUD:1599,EUR:1099,GBP:899,JPY:151000,CAD:1399,SGD:1399},
    productUrl:'https://tamron-americas.com/product/28-75mm-f-2-8-di-iii-vxd-g2/',
  },

  'tamron-35-100mm-f28': {
    name:'Tamron 35-100mm f/2.8 Di III VXD', manufacturer:'Tamron', line:'Di III', type:'Zoom',
    focalLength:null, focalLengthMin:35, focalLengthMax:100, focalLengthEquiv:'35-100mm',
    maxAperture:2.8, minAperture:22, weight:575, length:121.5, diameter:80.6,
    filterThread:67, minFocusDist:22, maxMagnification:0.3,
    elements:15, groups:13, blades:9, afType:'Linear Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2026, discontinued:false,
    imageUrl:'https://tamron-americas.com/wp-content/uploads/2026/08/a078-1200-x-1200-eisa-wht.webp',
    asin:'B0GS3K7GBB',
    specSources: [
      { url:'https://www.tamron.com/global/consumer/lenses/a078/spec.html', tier:'T1', note:'Nikon-Z-specific spec table: weight 575g / length 121.5mm (Sony E is 565g/119.2mm).', date:'2026-08-30' },
    ],
    priceSource: { url:'https://tamron-americas.com/launch-announcement-35-100-lens/', tier:'T1', note:'"$929 for Nikon Z" (Sony E is $899), launched 2026-03-26; CAD $1,299 corroborated independently via dailycameranews.com and provideocoalition.com.', date:'2026-08-30' },
    prices:{USD:929,AUD:1399,EUR:1099,GBP:799,JPY:145000,CAD:1299,SGD:1299},
    productUrl:'https://tamron-americas.com/product/35-100mm-f-2-8-di-iii-vxd/',
  },

  'tamron-70-180mm-f28-g2': {
    name:'Tamron 70-180mm f/2.8 Di III VC VXD G2', manufacturer:'Tamron', line:'Di III', type:'Zoom',
    focalLength:null, focalLengthMin:70, focalLengthMax:180, focalLengthEquiv:'70-180mm',
    maxAperture:2.8, minAperture:22, weight:865, length:158.7, diameter:83,
    filterThread:67, minFocusDist:30, maxMagnification:0.38,
    elements:20, groups:15, blades:9, afType:'Linear Motor',
    weatherSealed:true, ois:true, oisStops:null, year:2025, discontinued:false,
    imageUrl:'https://tamron-americas.com/wp-content/uploads/2026/04/a065-1200-x-1200-wht.webp',
    asin:'B0FVKQ6FFV',
    specSources: [
      { url:'https://www.tamron.com/global/consumer/lenses/a065/spec.html', tier:'T1', note:'Nikon-Z-specific spec table: weight 865g / length 158.7mm (Sony E is 855g/156.5mm).', date:'2026-08-30' },
    ],
    priceSource: { url:'https://tamron-americas.com/70-180-g2-for-nikon-z-mount/', tier:'T1', note:'"The lens will retail for $1,149 USD / $1,549 CAD", shipping from 2025-10-23.', date:'2026-08-30' },
    prices:{USD:1149,AUD:1799,EUR:1299,GBP:999,JPY:177000,CAD:1549,SGD:1699},
    productUrl:'https://tamron-americas.com/product/tamron-70-180mm-f-2-8-di-iii-vc-vxd-g2/',
  },

  'tamron-90mm-f28-macro': {
    name:'Tamron 90mm f/2.8 Di III Macro VXD', manufacturer:'Tamron', line:'Di III', type:'Prime',
    focalLength:90, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'90mm',
    maxAperture:2.8, minAperture:16, weight:640, length:128.5, diameter:79.2,
    filterThread:67, minFocusDist:23, maxMagnification:1.0,
    elements:15, groups:12, blades:12, afType:'Linear Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2024, discontinued:false,
    imageUrl:'https://tamron-americas.com/wp-content/uploads/2026/04/f072-1200-x-1200-wht-1024x1024.webp',
    asin:'B0DLHPZDGB',
    specSources: [
      { url:'https://www.tamron.com/global/consumer/lenses/f072/spec.html', tier:'T1', note:'Nikon-Z-specific spec table: weight 640g / length 128.5mm (Sony E is 630g/126.5mm); 1:1 macro, 12-blade circular aperture (Tamron\'s first).', date:'2026-08-30' },
    ],
    priceSource: { url:'https://tamron-americas.com/tamron-announces-new-90mm-macro/', tier:'T1', note:'"$699 USD / $949 CAD", available from 2024-10-24; price applies to both Sony E and Nikon Z.', date:'2026-08-30' },
    prices:{USD:699,AUD:1099,EUR:799,GBP:599,JPY:106000,CAD:949,SGD:999},
    productUrl:'https://tamron-americas.com/product/90mm-f-2-8-di-iii-vxd-m11/',
  },

  /* ── Laowa (Z mount manual-focus specialty) ── */
  'laowa-90mm-f28-macro': {
    name:'Laowa 90mm f/2.8 2x Ultra Macro APO', manufacturer:'Laowa', line:'Ultra Macro APO', type:'Prime',
    focalLength:90, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'90mm',
    maxAperture:2.8, minAperture:22, weight:619, length:120, diameter:74,
    filterThread:67, minFocusDist:20.5, maxMagnification:2.0,
    elements:13, groups:10, blades:13, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2022, discontinued:false,
    imageUrl:'https://www.venuslens.net/wp-content/uploads/2022/06/Laowa_90mmF282XMacroAPO_1-700x482.jpg',
    imageSource: { url:'https://www.venuslens.net/product/laowa-90mm-f-2-8-2x-macro-apo/', tier:'T1', note:'official Venus Optics/Laowa store; barrel reads "LAOWA FFII 90mm F2.8 CA-Dreamer Macro 2X"; page confirms Nikon Z as a selectable/purchasable mount', date:'2026-08-17' },
    asin:null,
    prices:{USD:499,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.venuslens.net/product/laowa-90mm-f-2-8-2x-macro-apo/',
  },

  'laowa-15mm-f2': {
    name:'Laowa 15mm f/2 Zero-D', manufacturer:'Laowa', line:'Zero-D', type:'Prime',
    focalLength:15, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'15mm',
    maxAperture:2.0, minAperture:22, weight:500, length:82, diameter:66,
    filterThread:72, minFocusDist:15, maxMagnification:0.1,
    elements:12, groups:9, blades:5, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2021, discontinued:false,
    imageUrl:'https://www.venuslens.net/wp-content/uploads/2017/03/LAOWA-15mm-f2-04-thumb-700x482.jpg',
    imageSource: { url:'https://www.venuslens.net/product/laowa-15mm-f2/', tier:'T1', note:'official Venus Optics/Laowa store; barrel reads "LAOWA 15mm F2.0 D-Dreamer"; page text confirms Leica L / Sony FE / Nikon Z / Canon RF mounts are all available', date:'2026-08-17' },
    asin:null,
    prices:{USD:649,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.venuslens.net/product/laowa-15mm-f2/',
  },

  'laowa-10mm-f4-cookie': {
    name:'Laowa 10mm f/4 Cookie', manufacturer:'Laowa', line:'Cookie', type:'Prime',
    focalLength:10, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'15mm',
    maxAperture:4.0, minAperture:22, weight:130, length:25, diameter:54,
    filterThread:37, minFocusDist:10, maxMagnification:0.1,
    elements:12, groups:8, blades:5, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2022, discontinued:false,
    imageUrl:'https://www.venuslens.net/wp-content/uploads/2022/07/10mm-main.jpg',
    imageSource: { url:'https://www.venuslens.net/product/laowa-10mm-f-4-cookie/', tier:'T1', note:'official Venus Optics/Laowa store (matches this entry\'s existing productUrl); pancake profile visually confirmed; page confirms Nikon Z as a selectable mount', date:'2026-08-17' },
    asin:null,
    prices:{USD:299,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true,
    productUrl:'https://www.venuslens.net/product/laowa-10mm-f-4-cookie/',
  },

  /* ── Laowa (Z mount) round 2 — 21 new lenses found on venuslens.net's own
     Z-mount-selectable listings, closing the gap against the 3 originally
     entered. Every mount confirmed via the product's own "Mount" dropdown
     plus its description text; specs from each product's own Specifications
     tab (or, where that tab was empty, corroborated via an independent
     hands-on review/retailer spec sheet — noted per-lens below). Images
     deferred to KNOWN_IMAGE_GAPS.nikon this batch (2026-08-30) — see
     research/lenses.md for the full per-lens source ledger. */
  'laowa-10mm-f28-af': {
    name:'Laowa 10mm f/2.8 Zero-D FF', manufacturer:'Laowa', line:'Zero-D', type:'Prime',
    focalLength:10, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'10mm',
    maxAperture:2.8, minAperture:22, weight:420, length:70.8, diameter:82,
    filterThread:77, minFocusDist:12, maxMagnification:0.24,
    elements:15, groups:9, blades:5, afType:'Stepping Motor',
    weatherSealed:false, ois:false, oisStops:null, year:2024, discontinued:false,
    specSources: [
      { url:'https://www.laowalenses.ca/product/laowa-10mm-f-2-8-zero-d-ff/', tier:'T1', note:'official Laowa Canada regional store; Nikon Z listed as an Auto Focus mount (5-blade) alongside Sony E; full spec table (15 elements/9 groups, 77mm filter, 420g, Ø82×70.8mm) — weight/dimensions are the shared AF-mount figures, no Nikon-Z-specific delta published separately from Sony E.', date:'2026-08-30' },
      { url:'https://petapixel.com/2024/11/01/laowa-10mm-f-2-8-zero-d-review-a-fun-lens-that-has-some-tradeoffs/', tier:'T2', note:'independent hands-on review confirms Stepping Motor (STM) autofocus, available on Sony FE and Nikon Z only (Canon RF/L are MF-only variants).', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:799,AUD:1199,EUR:899,GBP:699,JPY:121000,CAD:999,SGD:1199},
    productUrl:'https://www.venuslens.net/product/laowa-10mm-f-2-8-ff-zero-d/',
  },

  'laowa-12mm-f28-lite-zero-d': {
    name:'Laowa 12mm f/2.8 Lite Zero-D FF', manufacturer:'Laowa', line:'Lite Zero-D', type:'Prime',
    focalLength:12, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'12mm',
    maxAperture:2.8, minAperture:22, weight:390, length:84.6, diameter:74.8,
    filterThread:72, minFocusDist:14, maxMagnification:0.2,
    elements:16, groups:9, blades:5, afType:'Stepping Motor',
    weatherSealed:false, ois:false, oisStops:null, year:2025, discontinued:false,
    specSources: [
      { url:'https://www.venuslens.net/product/laowa-12mm-f-2-8-lite-zero-d-ff/', tier:'T1', note:'official Venus Optics/Laowa store; Mount dropdown lists Sony E / Nikon Z (both AF, 5-blade) / Canon RF / L mount (MF); "the second autofocus lens in Laowa\'s lineup" for Sony E and Nikon Z.', date:'2026-08-30' },
      { url:'https://www.cined.com/laowa-12mm-f-2-8-lite-zero-d-ff-lens-released/', tier:'T2', note:'independent per-mount spec breakdown: Nikon Z (AF, 5 blades) = 390g / 84.6mm length / Ø74.8mm — distinct from the Sony E figure (377g) that venuslens.net\'s own prose quotes as "AF Sony E mount" only.', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:699,AUD:1099,EUR:799,GBP:599,JPY:108000,CAD:899,SGD:999},
    productUrl:'https://www.venuslens.net/product/laowa-12mm-f-2-8-lite-zero-d-ff/',
  },

  'laowa-8-15mm-f28-fisheye': {
    name:'Laowa 8-15mm f/2.8 FF Zoom Fisheye', manufacturer:'Laowa', line:'Zoom Fisheye', type:'Zoom',
    focalLength:null, focalLengthMin:8, focalLengthMax:15, focalLengthEquiv:'8-15mm',
    maxAperture:2.8, minAperture:22, weight:650, length:94.5, diameter:76.4,
    filterThread:null, minFocusDist:16, maxMagnification:0.23,
    elements:13, groups:9, blades:9, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2025, discontinued:false,
    specSources: [
      { url:'https://www.laowalenses.ca/product/laowa-8-15mm-f2-8-ff-zoom-fisheye/', tier:'T1', note:'official Laowa Canada regional store; Nikon Z confirmed as an available mount; length given per-mount as RF 94.5mm/GFX 101.2mm/XCD 96.36mm (all share the same Ø76.4mm diameter) — Nikon Z\'s own length not separately listed, RF\'s figure used as the closest full-frame-mirrorless proxy.', date:'2026-08-30' },
      { url:'https://www.nikonrumors.com/2025/06/06/venus-optics-announced-a-new-laowa-8-15mm-f-2-8-ff-zoom-fisheye-lens-for-nikon-z-mount.aspx/', tier:'T2', note:'independent dated announcement confirms Nikon Z-mount launch 2025-06-06, matching this entry\'s year.', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:699,AUD:1099,EUR:799,GBP:599,JPY:108000,CAD:899,SGD:999},
    productUrl:'https://www.venuslens.net/product/laowa-8-15mm-f-2-8-ff-zoom-fisheye-2/',
  },

  'laowa-argus-28mm-f12': {
    name:'Laowa Argus 28mm f/1.2 FF', manufacturer:'Laowa', line:'Argus', type:'Prime',
    focalLength:28, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'28mm',
    maxAperture:1.2, minAperture:16, weight:562, length:106.31, diameter:68.5,
    filterThread:62, minFocusDist:50, maxMagnification:0.073,
    elements:13, groups:7, blades:13, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2023, discontinued:false,
    specSources: [
      { url:'https://www.venuslens.net/product/laowa-argus-28mm-f-1-2-ff/', tier:'T1', note:'official Venus Optics/Laowa store; Mount dropdown lists Sony E / Canon RF / Nikon Z / L mount; full Specifications tab: 13 elements/7 groups, 13 blades, Ø68.5×106.31mm, 562g, 62mm filter, 50cm min focus, 0.073x max mag.', date:'2026-08-30' },
      { url:'https://www.nikonrumors.com/2023/03/22/venus-optics-to-release-a-new-laowa-argus-28mm-f-1-2-full-frame-manual-focus-lens-for-nikon-z-mount-next-week.aspx/', tier:'T2', note:'independent dated announcement confirms Nikon Z-mount release week of 2023-03-28, matching this entry\'s year.', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:599,AUD:899,EUR:699,GBP:499,JPY:88000,CAD:799,SGD:899},
    productUrl:'https://www.venuslens.net/product/laowa-argus-28mm-f-1-2-ff/',
  },

  'laowa-15mm-f45-macro': {
    name:'Laowa 15mm f/4.5 0.5X Wide Angle Macro', manufacturer:'Laowa', line:'Wide Angle Macro', type:'Prime',
    focalLength:15, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'15mm',
    maxAperture:4.5, minAperture:32, weight:308, length:47.7, diameter:70,
    filterThread:62, minFocusDist:12.9, maxMagnification:0.5,
    elements:16, groups:11, blades:5, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2025, discontinued:false,
    specSources: [
      { url:'https://www.laowalenses.ca/product/laowa-15mm-f-4-5-0-5x-wide-angle-macro/', tier:'T1', note:'official Laowa Canada regional store; full spec table (16 elements/11 groups, f/4.5-32, 5 blades, Ø70×47.7mm, 308g, 62mm filter, 12.9cm min focus, 0.5x max mag); Nikon Z listed under Auto-Aperture mounts alongside Sony E/Canon EF (electronic aperture only — the lens itself remains manual-focus).', date:'2026-08-30' },
      { url:'https://petapixel.com/2025/05/15/new-laowa-15mm-f-4-5-0-5x-macro-lens-gives-your-close-ups-a-much-wider-background/', tier:'T2', note:'independent dated announcement (2025-05-15) corroborates the full spec sheet and Nikon Z availability.', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:399,AUD:599,EUR:499,GBP:399,JPY:61000,CAD:499,SGD:599},
    productUrl:'https://www.venuslens.net/product/laowa-15mm-f-4-5-0-5x-wide-angle-macro/',
  },

  'laowa-15mm-f5-cookie': {
    name:'Laowa 15mm f/5 Cookie FF', manufacturer:'Laowa', line:'Cookie', type:'Prime',
    focalLength:15, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'15mm',
    maxAperture:5.0, minAperture:22, weight:138, length:35.2, diameter:53,
    filterThread:39, minFocusDist:12, maxMagnification:0.2,
    elements:13, groups:9, blades:5, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2024, discontinued:false,
    specSources: [
      { url:'https://www.venuslens.net/product/laowa-15mm-f-5-cookie-ff/', tier:'T1', note:'official Venus Optics/Laowa store; "Auto-aperture function has been included in Sony E and Nikon Z mount" (electronic aperture only, focus stays manual); weight/dimensions from this page\'s Features prose (Sony E figures — Nikon Z not separately dimensioned).', date:'2026-08-30' },
      { url:'https://www.laowalenses.ca/product/laowa-15mm-f5-cookie-ff/', tier:'T1', note:'official Laowa Canada store; full spec table confirms f/5-22 range, 13 elements/9 groups, 5 blades, 39mm filter, 12cm min focus, 0.2x max mag; "Nikon Z: Auto-aperture function included".', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:399,AUD:599,EUR:499,GBP:399,JPY:60000,CAD:499,SGD:599},
    productUrl:'https://www.venuslens.net/product/laowa-15mm-f-5-cookie-ff/',
  },

  'laowa-8-16mm-f35-5': {
    name:'Laowa 8-16mm f/3.5-5 Zoom CF', manufacturer:'Laowa', line:'Zoom CF', type:'Zoom',
    focalLength:null, focalLengthMin:8, focalLengthMax:16, focalLengthEquiv:'12-24mm',
    maxAperture:3.5, minAperture:16, weight:463, length:88.53, diameter:88.4,
    filterThread:86, minFocusDist:20, maxMagnification:0.125,
    elements:16, groups:12, blades:5, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2023, discontinued:false,
    specSources: [
      { url:'https://www.venuslens.net/product/laowa-8-16mm-f3-5-5-zoom-cf/', tier:'T1', note:'official Venus Optics/Laowa store; APS-C ("CF" = Cropped Frame) lens — focalLengthEquiv applies the project\'s 1.5× Nikon-Z-DX convention (8-16mm → 12-24mm), consistent with the existing Sigma DC DN Z entries. Full Specifications tab: 16 elements/12 groups, 5 blades, Ø88.4×88.53mm, 463g, 86mm filter, 20cm min focus, 0.125x max mag; Mount dropdown lists Sony E/Fujifilm X/Nikon Z/Canon RF/Canon EF-M.', date:'2026-08-30' },
      { url:'https://petapixel.com/2023/10/10/laowa-8-16mm-f-3-5-5-zoom-cf-is-a-compact-ultra-wide-angle-zoom-for-aps-c-cameras/', tier:'T2', note:'independent dated announcement (2023-10-10), $549 launch price matches this entry\'s USD.', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:549,AUD:899,EUR:599,GBP:499,JPY:81000,CAD:699,SGD:799},
    productUrl:'https://www.venuslens.net/product/laowa-8-16mm-f3-5-5-zoom-cf/',
  },

  'laowa-58mm-f28-2x-macro': {
    name:'Laowa 58mm f/2.8 2X Ultra-Macro APO', manufacturer:'Laowa', line:'Ultra Macro APO', type:'Prime',
    focalLength:58, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'58mm',
    maxAperture:2.8, minAperture:22, weight:595, length:117, diameter:74,
    filterThread:67, minFocusDist:18.5, maxMagnification:2.0,
    elements:14, groups:11, blades:13, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2022, discontinued:false,
    specSources: [
      { url:'https://www.venuslens.net/product/5828-2x-ultra-macro-apo/', tier:'T1', note:'official Venus Optics/Laowa store; Mount dropdown lists Canon RF/Nikon Z/Sony FE/L mount; full Specifications tab: 14 elements/11 groups, 13 blades, Ø74×117mm, 595g, 67mm filter, 18.5cm min focus, 2x max mag.', date:'2026-08-30' },
      { url:'https://www.digitalcameraworld.com/reviews/laowa-58mm-f28-2x-ultra-macro-apo-review', tier:'T2', note:'independent review confirms Sony E/Canon RF/Nikon Z/L-mount availability and 2022 launch.', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:499,AUD:799,EUR:599,GBP:399,JPY:70000,CAD:599,SGD:699},
    productUrl:'https://www.venuslens.net/product/5828-2x-ultra-macro-apo/',
  },

  'laowa-65mm-f28-2x-macro': {
    name:'Laowa 65mm f/2.8 2x Ultra Macro APO', manufacturer:'Laowa', line:'Ultra Macro APO', type:'Prime',
    focalLength:65, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'98mm',
    maxAperture:2.8, minAperture:22, weight:335, length:100, diameter:57,
    filterThread:52, minFocusDist:17, maxMagnification:2.0,
    elements:14, groups:10, blades:9, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2020, discontinued:false,
    specSources: [
      { url:'https://www.venuslens.net/product/laowa-65mm-f-2-8-2x-ultra-macro-apo/', tier:'T1', note:'official Venus Optics/Laowa store; APS-C lens — focalLengthEquiv applies the 1.5× Nikon-Z-DX convention (65mm → 98mm). The page\'s own "Mounts" spec-table row is stale (lists only Fuji X/Sony E/Canon EF-M) but the live Mount *dropdown* on the same page and its description prose ("The lens features Fujifilm X, Sony E, Nikon Z and Canon M，RF mount") both confirm Nikon Z is purchasable — dropdown/prose trusted over the stale table row per the skill\'s "confirm mount against the maker" rule. Specifications tab: 14 elements/10 groups, 9 blades, Ø57×100mm, 335g, 52mm filter, 17cm min focus, 2x max mag.', date:'2026-08-30' },
      { url:'https://jonasraskphotography.com/2020/01/24/the-laowa-65mm-f-2-8-2x-ultra-macro-apo-review/', tier:'T2', note:'independent hands-on review dated 2020-01-24, corroborating the launch timeframe and full spec sheet.', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:399,AUD:599,EUR:499,GBP:399,JPY:48000,CAD:499,SGD:599},
    productUrl:'https://www.venuslens.net/product/laowa-65mm-f-2-8-2x-ultra-macro-apo/',
  },

  'laowa-10-18mm-f45-56': {
    name:'Laowa 10-18mm f/4.5-5.6 Zoom', manufacturer:'Laowa', line:'Zoom', type:'Zoom',
    focalLength:null, focalLengthMin:10, focalLengthMax:18, focalLengthEquiv:'10-18mm',
    maxAperture:4.5, minAperture:22, weight:496, length:90.9, diameter:70,
    filterThread:null, minFocusDist:15, maxMagnification:0.25,
    elements:14, groups:10, blades:5, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2019, discontinued:false,
    specSources: [
      { url:'https://www.venuslens.net/product/laowa-10-18mm-f-4-5-5-6-fe-zoom/', tier:'T1', note:'official Venus Optics/Laowa store; Mount dropdown lists Sony FE/Nikon Z/L mount. Filter is a 37mm *rear* gel thread only ("designed a 37mm filter thread into the back of the lens") — filterThread left null per the schema\'s front-thread-only convention. Specifications tab: 14 elements/10 groups, 5 blades, 90.9mm×Ø70mm, 496g, 15cm min focus, 1:4 (0.25x) max mag.', date:'2026-08-30' },
      { url:'https://www.nikonrumors.com/2019/07/11/officially-announced-laowa-10-18mm-f-4-5-5-6-and-laowa-15mm-f-2-lenses-for-nikon-z-canon-rf-cameras.aspx/', tier:'T2', note:'independent dated announcement (2019-07-11) of the Nikon Z variant, matching this entry\'s year; phillipreeve.net\'s hands-on review independently confirms f/22 minimum aperture.', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:599,AUD:899,EUR:699,GBP:499,JPY:68000,CAD:799,SGD:899},
    productUrl:'https://www.venuslens.net/product/laowa-10-18mm-f-4-5-5-6-fe-zoom/',
  },

  'laowa-25mm-f28-25-5x-macro': {
    name:'Laowa 25mm f/2.8 2.5-5X Ultra Macro', manufacturer:'Laowa', line:'Ultra Macro', type:'Prime',
    focalLength:25, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'25mm',
    maxAperture:2.8, minAperture:16, weight:400, length:65, diameter:82,
    filterThread:null, minFocusDist:17.3, maxMagnification:5.0,
    elements:8, groups:6, blades:8, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2020, discontinued:false,
    specSources: [
      { url:'https://www.venuslens.net/product/laowa-25mm-f-2-8-2-5-5x-ultra-macro-2/', tier:'T1', note:'official Venus Optics/Laowa store; "New mounts are available for Canon R and Nikon Z users now!"; Mount dropdown includes Nikon Z. Specifications tab: 8 elements/6 groups, 8 blades, 82×65mm, 400g, Filter Thread N/A (extreme-macro barrel takes no front filter), 17.3cm min focus (at 5x), 5x max magnification (this is a 2.5-5x specialty macro lens — the stored maxMagnification is the top of its native range, not a 1:1-normalized figure).', date:'2026-08-30' },
      { url:'https://www.newsshooter.com/2021/01/25/laowa-25mm-f-2-8-2-5-5x-ultra-macro-lens-review/', tier:'T2', note:'independent review (2021-01-25) lists Nikon Z among available mounts, corroborating the Nikon-Z rollout was complete by early 2021; Nikon Rumors\' 100mm f/2.8 2x coverage (same April 2020 mount-expansion wave) anchors the year estimate.', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:399,AUD:599,EUR:499,GBP:399,JPY:48000,CAD:499,SGD:599},
    productUrl:'https://www.venuslens.net/product/laowa-25mm-f-2-8-2-5-5x-ultra-macro-2/',
  },

  'laowa-100mm-f28-2x-macro': {
    name:'Laowa 100mm f/2.8 2x Ultra Macro APO', manufacturer:'Laowa', line:'Ultra Macro APO', type:'Prime',
    focalLength:100, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'100mm',
    maxAperture:2.8, minAperture:22, weight:650, length:155, diameter:72,
    filterThread:67, minFocusDist:24.7, maxMagnification:2.0,
    elements:12, groups:10, blades:13, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2020, discontinued:false,
    specSources: [
      { url:'https://www.venuslens.net/product/laowa-100mm-f-2-8-2x-macro-apo/', tier:'T1', note:'official Venus Optics/Laowa store; Mount dropdown lists Nikon Z among Canon EF/RF, Nikon F/Z, Sony FE, L mount, Pentax K. Specifications tab gives per-mount deltas: blades "9 (Canon), 7 (Nikon F), 13 (Sony, Canon R, Nikon Z)" and dimensions/weight "Φ72×155mm / 650g (Canon R, Nikon Z & Sony FE)" vs "Φ72×125mm / 638g (Canon EF & Nikon F)" — the mirrorless-Z figures (13 blades, 650g, 155mm) used here, not the Nikon-F-adapter figures.', date:'2026-08-30' },
      { url:'https://www.digitalcameraworld.com/news/laowa-100mm-f28-2x-macro-apo-now-comes-in-nikon-z-and-canon-rf-mounts', tier:'T2', note:'independent dated announcement (2020-04-20) of the Nikon Z mount and confirms f/22 minimum aperture (not separately stated on the maker\'s own spec table).', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:499,AUD:799,EUR:599,GBP:399,JPY:60000,CAD:599,SGD:699},
    productUrl:'https://www.venuslens.net/product/laowa-100mm-f-2-8-2x-macro-apo/',
  },

  'laowa-argus-33mm-f095': {
    name:'Laowa Argus 33mm f/0.95 CF APO', manufacturer:'Laowa', line:'Argus', type:'Prime',
    focalLength:33, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'50mm',
    maxAperture:0.95, minAperture:16, weight:590, length:83, diameter:71.5,
    filterThread:62, minFocusDist:35, maxMagnification:0.125,
    elements:14, groups:9, blades:9, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2021, discontinued:false,
    specSources: [
      { url:'https://www.venuslens.net/product/laowa-argus-33mm-f-0-95-cf-apo/', tier:'T1', note:'official Venus Optics/Laowa store; APS-C lens — focalLengthEquiv applies the 1.5× Nikon-Z-DX convention (33mm → 50mm). Mount dropdown lists Fuji X/Sony E/Canon RF/Nikon Z/EOS-M. Specifications tab: 14 elements/9 groups, 9 blades, 71.5×83mm, 590g, 62mm filter, 35cm min focus — no minimum-aperture or max-magnification row on this tab.', date:'2026-08-30' },
      { url:'https://jonasraskphotography.com/2021/05/03/another-one-the-laowa-argus-33mm-f-0-95-apo-review/', tier:'T2', note:'independent hands-on review (2021-05-03) publishes the full tech-spec block including aperture range f/0.95-f/16 and max magnification 0.125x, and confirms "Nikon Z and Canon RF versions from Mid May [2021]" — used for both fields plus the year. Two other independent reviews (photorumors.com, digitalcameraworld.com) also state f/16 minimum; one outlier (sonyalpha.blog) claims f/11, flagged but not used since 3 of 4 independent hands-on sources agree on f/16.', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:449,AUD:699,EUR:499,GBP:399,JPY:57000,CAD:599,SGD:699},
    productUrl:'https://www.venuslens.net/product/laowa-argus-33mm-f-0-95-cf-apo/',
  },

  'laowa-17mm-f4-tilt-shift': {
    name:'Laowa 17mm f/4 Zero-D Tilt-Shift / Shift', manufacturer:'Laowa', line:'Tilt-Shift', type:'Prime',
    focalLength:17, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'17mm',
    maxAperture:4.0, minAperture:22, weight:810, length:93, diameter:111,
    filterThread:86, minFocusDist:25, maxMagnification:0.131,
    elements:18, groups:12, blades:14, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2026, discontinued:false,
    specSources: [
      { url:'https://www.laowalenses.ca/product/laowa-17mm-f-4-zero-d-tilt-shift-shift/', tier:'T1', note:'official Laowa Canada regional store; mounts listed as E/Z/RF/L/GFX/XCD, Nikon Z explicitly confirmed. Full spec table: 18 elements/12 groups, 14 blades, 86mm filter, 25cm min focus, 0.131x max mag, weight "810g and 770g" for the two module variants (Tilt-Shift vs Shift-only) — the heavier 810g Tilt-Shift figure used here since that\'s the variant this entry describes.', date:'2026-08-30' },
      { url:'https://www.nikonrumors.com/2026/03/10/venus-optics-announced-a-new-laowa-17mm-f-4-zero-d-tilt-shift-lens-for-nikon-z-mount.aspx/', tier:'T2', note:'independent dated announcement (2026-03-10) confirms Nikon Z-mount availability and $1,249 US launch price for the Tilt-Shift version, matching this entry\'s year and USD.', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:1249,AUD:1899,EUR:1399,GBP:1099,JPY:195000,CAD:1599,SGD:1799},
    productUrl:'https://www.venuslens.net/product/laowa-17mm-f-4-zero-d-tilt-shift-shift/',
  },

  'laowa-35mm-f28-tilt-shift-macro': {
    name:'Laowa 35mm f/2.8 Zero-D Tilt-Shift 0.5x Macro', manufacturer:'Laowa', line:'Tilt-Shift Macro', type:'Prime',
    focalLength:35, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'35mm',
    maxAperture:2.8, minAperture:22, weight:1350, length:148.9, diameter:104.9,
    filterThread:77, minFocusDist:22.8, maxMagnification:0.5,
    elements:14, groups:12, blades:15, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2025, discontinued:false,
    specSources: [
      { url:'https://www.laowalenses.ca/product/laowa-35mm-f-2-8-zero-d-tilt-shift-0-5x-macro/', tier:'T1', note:'official Laowa Canada regional store; mounts E/Z(Nikon)/RF/L/GFX/XCD confirmed. Full spec table: 14 elements/12 groups, 15 blades, 77mm filter, 22.8cm min focus, 0.5x max mag, "±10° tilt / ±12mm shift (FF)". Dimensions were scraped as "Ø148.9mm × Ø104.9mm" (both marked diameter); read as length×diameter per the family pattern (its 55mm/100mm siblings are both far longer than wide) — 148.9mm length, 104.9mm diameter.', date:'2026-08-30' },
      { url:'https://www.nikonrumors.com/2025/11/25/venus-optics-laowa-35mm-f-2-8-zero-d-tilt-shift-0-5x-macro-lens-for-nikon-z-mount-is-now-officially-announced.aspx/', tier:'T2', note:'independent dated announcement (2025-11-25) confirming Nikon Z mount and $1,249 US price, matching this entry.', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:1249,AUD:1899,EUR:1399,GBP:1099,JPY:192000,CAD:1599,SGD:1799},
    productUrl:'https://www.venuslens.net/product/laowa-35mm-f-2-8-zero-d-tilt-shift-0-5x-macro/',
  },

  'laowa-55mm-f28-tilt-shift-macro': {
    name:'Laowa 55mm f/2.8 Tilt-shift 1X Macro', manufacturer:'Laowa', line:'Tilt-Shift Macro', type:'Prime',
    focalLength:55, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'55mm',
    maxAperture:2.8, minAperture:22, weight:1345, length:168.5, diameter:85,
    filterThread:77, minFocusDist:27, maxMagnification:1.0,
    elements:14, groups:11, blades:15, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2025, discontinued:false,
    specSources: [
      { url:'https://www.venuslens.net/product/laowa-55mm-f-2-8-tilt-shift-1x-macro/', tier:'T1', note:'official Venus Optics/Laowa store; Mount dropdown lists Sony E/Nikon Z/Canon RF/L Mount/GFX. Specifications tab: Aperture Range F2.8-22, 14 elements/11 groups, 15 blades, 270mm (27cm) min focus, 77mm filter, "Dimension Approx. 168.5mm × Ø85mm" (length × diameter), 1345g, 1:1 (1.0x) magnification, ±10° tilt/±12mm shift.', date:'2026-08-30' },
      { url:'https://fstoppers.com/reviews/what-can-you-do-tilt-shift-macro-lens-trying-out-laowas-55mm-f28-1x-680199', tier:'T2', note:'independent review (2025-01-19) confirms "comes in Sony E, Nikon Z, Canon R, and [L mount]", corroborating mount availability and 2025 launch year.', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:1249,AUD:1899,EUR:1399,GBP:1099,JPY:192000,CAD:1599,SGD:1799},
    productUrl:'https://www.venuslens.net/product/laowa-55mm-f-2-8-tilt-shift-1x-macro/',
  },

  'laowa-100mm-f28-tilt-shift-macro': {
    name:'Laowa 100mm f/2.8 Tilt-shift 1X Macro', manufacturer:'Laowa', line:'Tilt-Shift Macro', type:'Prime',
    focalLength:100, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'100mm',
    maxAperture:2.8, minAperture:22, weight:1215, length:162, diameter:85,
    filterThread:77, minFocusDist:32, maxMagnification:1.0,
    elements:13, groups:10, blades:15, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2025, discontinued:false,
    specSources: [
      { url:'https://www.venuslens.net/product/laowa-100mm-f-2-8-tilt-shift-1x-macro/', tier:'T1', note:'official Venus Optics/Laowa store; Mount dropdown lists Sony E/Nikon Z/Canon RF/L Mount/GFX/Hasselblad XCD. Specifications tab: Aperture Range F2.8-22, 13 elements/10 groups, 15 blades, 320mm (32cm) min focus, 77mm filter, "Dimension Approx. 162mm × Ø85mm" (length × diameter), 1215g, 1:1 (1.0x) magnification.', date:'2026-08-30' },
      { url:'https://www.bhphotovideo.com/c/product/1869912-REG/venus_optics_ve10028tsz_laowa_100mm_f_2_8_tilt_shift.html', tier:'T3', note:'B&H\'s dedicated Nikon-Z-mount SKU listing ("the first Laowa tilt-shift macro lens for full-frame Nikon Z-mount camera systems") corroborates mount availability and $1,249 US price.', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:1249,AUD:1899,EUR:1399,GBP:1099,JPY:192000,CAD:1599,SGD:1799},
    productUrl:'https://www.venuslens.net/product/laowa-100mm-f-2-8-tilt-shift-1x-macro/',
  },

  'laowa-15mm-f45-shift': {
    name:'Laowa 15mm f/4.5 Zero-D Shift', manufacturer:'Laowa', line:'Zero-D Shift', type:'Prime',
    focalLength:15, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'15mm',
    maxAperture:4.5, minAperture:22, weight:597, length:103, diameter:79,
    filterThread:null, minFocusDist:20, maxMagnification:0.2,
    elements:17, groups:11, blades:14, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2020, discontinued:false,
    specSources: [
      { url:'https://www.laowalenses.ca/product/laowa-15mm-f-4-5-zero-d-shift/', tier:'T1', note:'official Laowa Canada regional store; mounts Canon EF&RF/Nikon F&Z/Sony E/Pentax K/L mount/Fujifilm G/Hasselblad XCD, Nikon Z confirmed. 17 elements/11 groups, 79×103mm, 597g; no front filter thread published (this Shift design has none) so filterThread left null; two aperture-blade variants exist (5-blade original, 14-blade "R" update from 2022) — 14 used here as the version blade tables now typically ship.', date:'2026-08-30' },
      { url:'https://www.fujirumors.com/laowa-15mm-f-4-5r-zero-d-shift-new-version-announced/', tier:'T2', note:'independent coverage of the 2022 "R" 14-blade update states max magnification 0.2x (1:5) and min focus 20cm, matching this entry; original announcement (canonrumors.com, 2020-10-30) anchors the 2020 first-ship year for this mount family.', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:1199,AUD:1899,EUR:1399,GBP:1099,JPY:144000,CAD:1599,SGD:1699},
    productUrl:'https://www.venuslens.net/product/laowa-15mm-f4-5-zero-d-shift/',
  },

  'laowa-20mm-f4-shift': {
    name:'Laowa 20mm f/4 Zero-D Shift', manufacturer:'Laowa', line:'Zero-D Shift', type:'Prime',
    focalLength:20, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'20mm',
    maxAperture:4.0, minAperture:22, weight:747, length:91, diameter:95,
    filterThread:82, minFocusDist:25, maxMagnification:0.17,
    elements:16, groups:11, blades:14, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2022, discontinued:false,
    specSources: [
      { url:'https://www.laowalenses.ca/product/laowa-20mm-f-4-zero-d-shift/', tier:'T1', note:'official Laowa Canada regional store; mounts Canon EF&RF/Nikon F&Z/Sony E/Pentax K/L mount/Fujifilm G confirmed. Full spec table: 16 elements/11 groups (2 aspherical, 3 ED), 14 blades, 82mm filter, 25cm min focus, 0.17x max mag, Ø95×91mm, 747g, ±11mm shift (FF)/±8mm (medium format).', date:'2026-08-30' },
      { url:'https://petapixel.com/2022/03/28/venus-optics-unveils-the-laowa-20mm-f4-zero-d-shift-lens/', tier:'T2', note:'independent dated announcement (2022-03-28) confirms the launch year and ±11mm shift spec.', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:1099,AUD:1699,EUR:1299,GBP:999,JPY:154000,CAD:1399,SGD:1599},
    productUrl:'https://www.venuslens.net/product/laowa-20mm-f-4-zero-d-shift/',
  },

  'laowa-12-24mm-f56-shift': {
    name:'Laowa 12-24mm f/5.6 Zoom Shift CF', manufacturer:'Laowa', line:'Zoom Shift', type:'Zoom',
    focalLength:null, focalLengthMin:12, focalLengthMax:24, focalLengthEquiv:'18-36mm',
    maxAperture:5.6, minAperture:22, weight:575, length:98.91, diameter:80,
    filterThread:77, minFocusDist:15, maxMagnification:0.4,
    elements:15, groups:11, blades:9, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2024, discontinued:false,
    specSources: [
      { url:'https://www.venuslens.net/product/laowa-12-24mm-f-5-6-zoom-shift-cf/', tier:'T1', note:'official Venus Optics/Laowa store; APS-C ("CF") lens — focalLengthEquiv applies the 1.5× Nikon-Z-DX convention (12-24mm → 18-36mm). Mount dropdown lists EOS-M/Sony E/Nikon Z/Canon RF/Fuji X/L mount. Specifications tab: 15 elements/11 groups, 9 blades, 15cm min focus, 0.4x max mag, 77mm filter, 98.91×80mm, 575g, ±7mm shift.', date:'2026-08-30' },
      { url:'https://www.nikonrumors.com/2024/11/05/new-venus-optics-laowa-12-24mm-f-5-6-aps-c-for-z-mount.aspx/', tier:'T2', note:'independent dated announcement (2024-11-05) of the Nikon Z-mount variant specifically; theasc.com corroborates the $699 list price "for all mounts".', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:699,AUD:1099,EUR:799,GBP:599,JPY:106000,CAD:899,SGD:999},
    productUrl:'https://www.venuslens.net/product/laowa-12-24mm-f-5-6-zoom-shift-cf/',
  },

  'laowa-85mm-f56-2x-macro': {
    name:'Laowa 85mm f/5.6 2x Ultra Macro APO', manufacturer:'Laowa', line:'Ultra Macro APO', type:'Prime',
    focalLength:85, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'85mm',
    maxAperture:5.6, minAperture:22, weight:314, length:81, diameter:53,
    filterThread:46, minFocusDist:16.3, maxMagnification:2.0,
    elements:13, groups:9, blades:7, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2021, discontinued:false,
    specSources: [
      { url:'https://www.laowalenses.ca/product/laowa-85mm-f-5-6-2x-ultra-macro-apo/', tier:'T1', note:'official Laowa Canada regional store; per-mount weight explicitly broken out — "Nikon Z: 314g / Sony FE: 291g / Leica M: 289g" — the Nikon Z figure used here (not the Sony/Leica figures). Mounts Canon RF/Nikon Z/Sony E/Leica M confirmed. 13 elements/9 groups, Ø53×81mm (Sony E dims quoted; Nikon Z close given the shared design), 46mm filter, 16.3cm min focus, 2:1 max mag.', date:'2026-08-30' },
      { url:'https://www.nickybay.com/laowa-85mm-f-5-6-2x-ultra-macro-apo-field-review/', tier:'T2', note:'independent field review (2021-11-29) states "launch price for the Laowa 85mm f/5.6 2x is at 449USD for Nikon Z", confirming Nikon Z availability at 2021 launch, and multiple retailer spec pages (Cathay Photo, Kameraliike.fi, Fdirect.eu — Nikon-Z-listed) independently confirm f/22 minimum aperture (not on the maker\'s own page).', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:499,AUD:799,EUR:599,GBP:399,JPY:64000,CAD:599,SGD:699},
    productUrl:'https://www.venuslens.net/product/laowa-85mm-f-5-6-2x-ultra-macro-apo/',
  },

  /* ── Samyang (Z mount, manual focus) ── Nikon has not licensed AF Z-mount
     lenses to Samyang (confirmed still pending as of March 2026 — Nikon
     Rumors, Digital Camera World), which is why the round-1 AF 135mm f/1.8
     entry was fabricated and removed in PR #25 (it's Sony-E-only). But
     Samyang's classic manual-focus, no-electronic-contact lenses don't need
     that licensing — samyangus.com's own Nikon Z collection (verified fresh
     this round, independent of the removed entry) lists exactly 2: */
  'samyang-14mm-f28': {
    name:'Samyang 14mm F2.8 Z', manufacturer:'Samyang', line:'MF', type:'Prime',
    focalLength:14, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'14mm',
    maxAperture:2.8, minAperture:22, weight:810, length:124.1, diameter:87,
    filterThread:null, minFocusDist:28, maxMagnification:0.08,
    elements:14, groups:10, blades:6, afType:'Manual',
    weatherSealed:true, ois:false, oisStops:null, year:2019, discontinued:false,
    specSources: [
      { url:'https://samyangus.com/products/14mm-f2-8-full-frame-ultra-wide-angle-nikon-z', tier:'T1', note:'official Samyang US store (SKU SYZ14-N); "the first 14mm prime lens with precision manual focus control to be available in Nikon Z mount... As Samyang\'s first lens for Nikon Z mount". Full Specifications accordion: F2.8-22, 14 elements/10 groups (1 ASP, 2 ED, 3 HR, 1 H-ASP), rear gelatin filter holder (no front thread — filterThread left null), 6 blades, 115.7° AoV, Ø87×124.1mm, 810g, weather-sealed. Customer reviews date back to 2019-12-30, corroborating this as a long-standing product, not new.', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:707,AUD:1099,EUR:799,GBP:599,JPY:80000,CAD:899,SGD:999},
    productUrl:'https://samyangus.com/products/14mm-f2-8-full-frame-ultra-wide-angle-nikon-z',
  },

  'samyang-85mm-f14': {
    name:'Samyang 85mm F1.4 Z', manufacturer:'Samyang', line:'MF', type:'Prime',
    focalLength:85, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'85mm',
    maxAperture:1.4, minAperture:22, weight:740, length:102.7, diameter:78,
    filterThread:72, minFocusDist:100, maxMagnification:0.09,
    elements:9, groups:7, blades:8, afType:'Manual',
    weatherSealed:true, ois:false, oisStops:null, year:2020, discontinued:false,
    specSources: [
      { url:'https://samyangus.com/products/85mm-f1-4-full-frame-telephoto-nikon-z', tier:'T1', note:'official Samyang US store (SKU SYZ85-N); "the first 85mm prime lens with precision manual focus control to be available in Nikon Z mount". Full Specifications accordion: F1.4-22, 9 elements/7 groups (1 H-ASP), 72mm non-rotating front filter, 8 curved blades, 28.3° AoV, Ø78×102.7mm, 740g, weather-sealed. Customer reviews date back to 2020-09-13.', date:'2026-08-30' },
    ],
    asin:null,
    prices:{USD:565,AUD:899,EUR:599,GBP:499,JPY:68000,CAD:699,SGD:799},
    productUrl:'https://samyangus.com/products/85mm-f1-4-full-frame-telephoto-nikon-z',
  },

  /* ── Viltrox full-frame Z primes ── */
  'viltrox-24mm-f18': {
    name:'Viltrox AF 24mm f/1.8', manufacturer:'Viltrox', line:'AF', type:'Prime',
    focalLength:24, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'24mm',
    maxAperture:1.8, minAperture:16, weight:370, length:92, diameter:65,
    filterThread:55, minFocusDist:30, maxMagnification:0.1,
    elements:11, groups:9, blades:9, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2022, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF24mm_F1.8_Z-661615.png',
    imageSource: { url:'https://viltrox.com/products/viltrox-af-24mm-f18-z-mount-full-frame-prime-lens', tier:'T1', note:'official Viltrox store page, barrel explicitly reads "AF 24/1.8 Z" and "Z-mount"', date:'2026-08-17' }, asin:'B09CPDBWJY',
    prices:{USD:380,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/viltrox-af-24mm-f18-z-mount-full-frame-prime-lens',
  },

  'viltrox-35mm-f18-evo': {
    name:'Viltrox AF 35mm f/1.8 EVO', manufacturer:'Viltrox', line:'EVO', type:'Prime',
    focalLength:35, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'35mm',
    maxAperture:1.8, minAperture:16, weight:375, length:78, diameter:69,
    filterThread:58, minFocusDist:34, maxMagnification:0.1,
    elements:13, groups:10, blades:9, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2023, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF_35mm_F1.8_II_EVO_Z-_front_view.png',
    imageSource: { url:'https://viltrox.com/products/af-35mm-f1-8-z', tier:'T1', note:'official Viltrox store page (matches this entry\'s existing productUrl) — current page/photo now reads "AF 35/1.8 II Z", i.e. Viltrox appears to have refreshed this SKU to a Mark II revision on the same URL; flagging in case the stored specs (year 2023, weight 375g) need a follow-up check against the II', date:'2026-08-17' },
    asin:null,
    prices:{USD:395,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/af-35mm-f1-8-z',
  },

  'viltrox-40mm-f25-air': {
    name:'Viltrox AF 40mm f/2.5 Air', manufacturer:'Viltrox', line:'Air', type:'Prime',
    focalLength:40, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'40mm',
    maxAperture:2.5, minAperture:16, weight:180, length:55.9, diameter:68,
    filterThread:52, minFocusDist:34, maxMagnification:0.1,
    elements:10, groups:6, blades:7, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2024, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF40mm_F2.5_Z-273185.png',
    imageSource: { url:'https://viltrox.com/products/viltrox-af-40mm-f2-5-z', tier:'T1', note:'official Viltrox store page, barrel explicitly reads "AF 40/2.5 Z"', date:'2026-08-17' },
    asin:null,
    prices:{USD:158,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/viltrox-af-40mm-f2-5-z',
  },

  'viltrox-85mm-f20-evo': {
    name:'Viltrox AF 85mm f/2.0 EVO', manufacturer:'Viltrox', line:'EVO', type:'Prime',
    focalLength:85, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'85mm',
    maxAperture:2.0, minAperture:16, weight:360, length:78, diameter:69,
    filterThread:58, minFocusDist:740, maxMagnification:0.13,
    elements:10, groups:8, blades:9, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2025, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF_85mm_F2.0_EVO_Z_-_front_view.png',
    imageSource: { url:'https://viltrox.com/products/af-85mm-f2-0-z', tier:'T1', note:'official Viltrox store page, barrel explicitly reads "AF 85/2.0 Z" with EVO badge', date:'2026-08-17' },
    asin:null,
    prices:{USD:275,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/af-85mm-f2-0-z',
  },

  'viltrox-85mm-f14-pro': {
    name:'Viltrox AF 85mm f/1.4 Pro', manufacturer:'Viltrox', line:'Pro', type:'Prime',
    focalLength:85, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'85mm',
    maxAperture:1.4, minAperture:16, weight:835, length:110.6, diameter:84.5,
    filterThread:77, minFocusDist:790, maxMagnification:0.13,
    elements:15, groups:11, blades:11, afType:'VCM',
    weatherSealed:true, ois:false, oisStops:null, year:2025, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF_85mm_F1.4_Pro_Z_-_front_view.png',
    imageSource: { url:'https://viltrox.com/products/af-85mm-f1-4-z', tier:'T1', note:'official Viltrox store page, barrel explicitly reads "AF 85/1.4 Z" with Pro badge', date:'2026-08-17' },
    asin:null,
    prices:{USD:598,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/af-85mm-f1-4-z',
  },

  /* ── Viltrox full-frame Z primes, round 2 additions (2026-08-30) ── */
  'viltrox-26mm-f28-evo': {
    name:'Viltrox AF 26mm F2.8 EVO', manufacturer:'Viltrox', line:'EVO', type:'Prime',
    focalLength:26, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'26mm',
    maxAperture:2.8, minAperture:16, weight:170, length:25.8, diameter:69.4,
    filterThread:43, minFocusDist:20, maxMagnification:0.2,
    elements:8, groups:6, blades:9, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2026, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF_26mm_F2.8_EVO_Z-front_view.png',
    imageSource: { url:'https://viltrox.com/products/af-26mm-f2-8-z', tier:'T1', note:'official Viltrox store page; pancake full-frame EVO, launched 2026-07-15 (corroborated by DPReview/PetaPixel coverage); Z-mount weight is 170g bare (vs the E-mount sibling\'s 130g — confirmed via the E-mount product page\'s own spec dialog, a genuine per-mount difference, not a scrape error) and Z-mount size is Φ69.4x25.8mm (vs E-mount\'s Φ66x23.8mm)', date:'2026-08-30' },
    asin:null,
    prices:{USD:299,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/af-26mm-f2-8-z',
  },

  'viltrox-55mm-f18-evo': {
    name:'Viltrox AF 55mm F1.8 EVO', manufacturer:'Viltrox', line:'EVO', type:'Prime',
    focalLength:55, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'55mm',
    maxAperture:1.8, minAperture:16, weight:390, length:78, diameter:69,
    filterThread:58, minFocusDist:43, maxMagnification:0.16,
    elements:13, groups:9, blades:null, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2026, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF_55mm_F1.8_II_EVO_Z_-_front_view.png',
    imageSource: { url:'https://viltrox.com/products/af-55mm-f1-8-z', tier:'T1', note:'official Viltrox store page, "APO" full-frame EVO portrait prime; 13/9 elements (2ED, 2HR, 1UA) per the product bullet list', date:'2026-08-30' },
    asin:null,
    prices:{USD:370,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/af-55mm-f1-8-z',
  },

  'viltrox-50mm-f14-pro': {
    name:'Viltrox AF 50mm F1.4 Pro', manufacturer:'Viltrox', line:'Pro', type:'Prime',
    focalLength:50, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'50mm',
    maxAperture:1.4, minAperture:16, weight:830, length:113, diameter:84.5,
    filterThread:77, minFocusDist:45, maxMagnification:0.145,
    elements:15, groups:11, blades:9, afType:'VCM',
    weatherSealed:true, ois:false, oisStops:null, year:2026, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF_50mm_F1.4_Pro_Z-front_view.png',
    imageSource: { url:'https://viltrox.com/products/af-50mm-f1-4-z', tier:'T1', note:'official Viltrox store page, spec dialog reads "AF 50/1.4 Pro Z"; "Weather-Sealed" explicitly claimed', date:'2026-08-30' },
    asin:null,
    prices:{USD:549,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/af-50mm-f1-4-z',
  },

  'viltrox-35mm-f12-lab': {
    name:'Viltrox AF 35mm F1.2 LAB', manufacturer:'Viltrox', line:'LAB', type:'Prime',
    focalLength:35, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'35mm',
    maxAperture:1.2, minAperture:16, weight:970, length:123.5, diameter:89.2,
    filterThread:77, minFocusDist:34, maxMagnification:0.17,
    elements:15, groups:10, blades:null, afType:'VCM',
    weatherSealed:true, ois:false, oisStops:null, year:2025, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF_35mm_F1.2_LAB_Z_-Front_view.png',
    imageSource: { url:'https://viltrox.com/products/af-35mm-f1-2-z', tier:'T1', note:'official Viltrox store page, flagship LAB-series full-frame prime; "All-Metal Weather-Sealed" explicitly claimed', date:'2026-08-30' },
    asin:null,
    prices:{USD:999,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/af-35mm-f1-2-z',
  },

  'viltrox-135mm-f18-lab': {
    name:'Viltrox AF 135mm F1.8 LAB', manufacturer:'Viltrox', line:'LAB', type:'Prime',
    focalLength:135, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'135mm',
    maxAperture:1.8, minAperture:16, weight:1265, length:147.6, diameter:93,
    filterThread:82, minFocusDist:72, maxMagnification:0.25,
    elements:14, groups:9, blades:11, afType:'VCM',
    weatherSealed:true, ois:false, oisStops:null, year:2025, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF135mmF1.8LABZ-frontview_2.png',
    imageSource: { url:'https://viltrox.com/products/af-135mm-f1-8-lab-z', tier:'T1', note:'official Viltrox store page, flagship LAB-series telephoto; "dustproof and splash-resistant" explicitly claimed', date:'2026-08-30' },
    asin:null,
    prices:{USD:899,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/af-135mm-f1-8-lab-z',
  },

  'viltrox-14mm-f4-air': {
    name:'Viltrox AF 14mm F4.0 Air', manufacturer:'Viltrox', line:'Air', type:'Prime',
    focalLength:14, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'14mm',
    maxAperture:4.0, minAperture:16, weight:185, length:58.4, diameter:68,
    filterThread:58, minFocusDist:13, maxMagnification:0.23,
    elements:12, groups:9, blades:null, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2025, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF_14mm_F4.0_Air_Z-front_view.png',
    imageSource: { url:'https://viltrox.com/products/af-14mm-f4-0-z', tier:'T1', note:'official Viltrox store page, spec dialog reads "AF 14/4.0 Air Z"', date:'2026-08-30' },
    asin:null,
    prices:{USD:199,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/af-14mm-f4-0-z',
  },

  'viltrox-28mm-f45': {
    name:'Viltrox AF 28mm F4.5', manufacturer:'Viltrox', line:'AF', type:'Prime',
    focalLength:28, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'28mm',
    maxAperture:4.5, minAperture:4.5, weight:80, length:16.8, diameter:65.3,
    filterThread:null, minFocusDist:35, maxMagnification:0.1,
    elements:6, groups:6, blades:null, afType:'VCM',
    weatherSealed:false, ois:false, oisStops:null, year:2025, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF28mmF4.5Z-frontview.png',
    imageSource: { url:'https://viltrox.com/products/af-28mm-f4-5-z', tier:'T1', note:'official Viltrox store page; ultra-slim full-lens-focusing pancake with a FIXED F4.5 aperture (no iris/blades, hence maxAperture=minAperture and blades:null) — the page\'s own spec table literally reads "F4.5 fixed aperture" with no separate min-aperture row; filter thread also unpublished, likely none on this flush-front design', date:'2026-08-30' },
    asin:null,
    prices:{USD:99,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/af-28mm-f4-5-z',
  },

  'viltrox-50mm-f2-air': {
    name:'Viltrox AF 50mm F2.0 Air', manufacturer:'Viltrox', line:'Air', type:'Prime',
    focalLength:50, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'50mm',
    maxAperture:2.0, minAperture:16, weight:220, length:58.6, diameter:68,
    filterThread:58, minFocusDist:51, maxMagnification:0.11,
    elements:13, groups:9, blades:9, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2025, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF50mmF2.0AirZ-14.png',
    imageSource: { url:'https://viltrox.com/products/af-50mm-f2-z', tier:'T1', note:'official Viltrox store page, spec dialog reads "AF 50/2.0 Air Z"', date:'2026-08-30' },
    asin:null,
    prices:{USD:199,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/af-50mm-f2-z',
  },

  'viltrox-20mm-f28-air': {
    name:'Viltrox AF 20mm F2.8', manufacturer:'Viltrox', line:'Air', type:'Prime',
    focalLength:20, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'20mm',
    maxAperture:2.8, minAperture:16, weight:173, length:60.8, diameter:68,
    filterThread:52, minFocusDist:19, maxMagnification:0.17,
    elements:10, groups:8, blades:7, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2024, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF20mm_F2.8_Z-457461.png',
    imageSource: { url:'https://viltrox.com/products/viltrox-af-20mm-f2-8-full-frame-lens-for-nikon-z-mount', tier:'T1', note:'official Viltrox store page; per-mount table explicitly separates "E-mount: 65x59.5mm/157g" from "Z-mount: 68x60.8mm/173g" — Z-mount figures used', date:'2026-08-30' },
    asin:null,
    prices:{USD:176,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/viltrox-af-20mm-f2-8-full-frame-lens-for-nikon-z-mount',
  },

  'viltrox-28mm-f18': {
    name:'Viltrox AF 28mm F1.8', manufacturer:'Viltrox', line:'AF', type:'Prime',
    focalLength:28, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'28mm',
    maxAperture:1.8, minAperture:16, weight:367, length:88.2, diameter:70,
    filterThread:55, minFocusDist:37, maxMagnification:0.1,
    elements:11, groups:9, blades:9, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2023, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/AF28mm_F1.8_Z-729136.png',
    imageSource: { url:'https://viltrox.com/products/viltrox-af-28mm-f1-8', tier:'T1', note:'official Viltrox store page, confirmed Nikon Z-mount variant via the product\'s mount selector', date:'2026-08-30' },
    asin:null,
    prices:{USD:379,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/viltrox-af-28mm-f1-8',
  },

  'viltrox-20mm-f18-mf': {
    name:'Viltrox MF 20mm F1.8', manufacturer:'Viltrox', line:'MF', type:'Prime',
    focalLength:20, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'20mm',
    maxAperture:1.8, minAperture:16, weight:782, length:104, diameter:76.8,
    filterThread:82, minFocusDist:25, maxMagnification:null,
    elements:12, groups:9, blades:14, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2020, discontinued:false,
    imageUrl:'https://viltrox.com/cdn/shop/files/MF20mmF1.8Z-Mount-481663.jpg',
    imageSource: { url:'https://viltrox.com/products/viltrox-20mm-f1-8-full-frame-wide-angle-fixed-prime-lens-for-nikon-z-mount-mirrorless', tier:'T1', note:'official Viltrox store page; manual-focus wide-angle, Z-mount length/weight (104mm/782g) explicitly separated from the E-mount figures (102mm/775g) on the same page; year is the SKU\'s own store "created" timestamp (2019-12-16), rounded to 2020 — Viltrox\'s earliest Z-mount lens, predating the AF licensing era, since MF needs no license', date:'2026-08-30' },
    asin:null,
    prices:{USD:399,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://viltrox.com/products/viltrox-20mm-f1-8-full-frame-wide-angle-fixed-prime-lens-for-nikon-z-mount-mirrorless',
  },

  /* ── Voigtländer (native Z manual-focus) ── */
  'voigtlander-apo-lanthar-50mm-f2': {
    name:'Voigtländer APO-Lanthar 50mm f/2 Aspherical II Z', manufacturer:'Voigtländer', line:'APO-Lanthar', type:'Prime',
    focalLength:50, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'50mm',
    maxAperture:2.0, minAperture:16, weight:370, length:64.3, diameter:63,
    filterThread:58, minFocusDist:45, maxMagnification:0.15,
    elements:10, groups:8, blades:12, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2024, discontinued:false,
    imageUrl:'https://www.voigtlaender.de/wp-content/uploads/2025/01/50mm-F2.0-APO-II-Z_klein.jpg',
    imageSource: { url:'https://www.voigtlaender.de/z-anschluss/50-mm-120-apo-lanthar/', tier:'T1', note:'official Voigtländer Z-mount product page; header explicitly reads "50 mm / 1:2,0 APO-Lanthar II Z", matching this entry\'s stored name ("Aspherical II Z")', date:'2026-08-17' }, asin:'B0DPNK41Q7',
    prices:{USD:1049,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://www.voigtlaender.de/z-mount/50-mm-12-0-apo-lanthar/?lang=en',
  },

  'voigtlander-nokton-40mm-f12': {
    name:'Voigtländer Nokton 40mm f/1.2 Z', manufacturer:'Voigtländer', line:'Nokton', type:'Prime',
    focalLength:40, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'40mm',
    maxAperture:1.2, minAperture:22, weight:315, length:53.9, diameter:67.6,
    filterThread:58, minFocusDist:35, maxMagnification:0.1,
    elements:8, groups:6, blades:10, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2022, discontinued:false,
    imageUrl:'https://www.voigtlaender.de/wp-content/uploads/2022/12/Voigtlaender-NOKTON-40mmF12-Z-online-small.png',
    imageSource: { url:'https://www.voigtlaender.de/z-anschluss/40-mm-112-nokton/', tier:'T1', note:'official Voigtländer Z-mount product page; filename itself is "NOKTON-40mmF12-Z"', date:'2026-08-17' }, asin:'B0BMWKQ1WP',
    prices:{USD:899,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://www.voigtlaender.de/z-mount/40-mm-11-2-nokton/?lang=en',
  },

  /* ── Voigtländer round-2 additions (2026-08-30) — enumerated from
     voigtlaender.de/z-mount/'s own lens grid (16 native-Z designs listed; one,
     "Nokton 75mm f/1.5 aspherical", is EXCLUDED — its tile links only to the
     E-mount product page, so it doesn't actually ship in Z yet despite being
     shown on the Z-mount overview). "APO-Lanthar 35mm f/2 II" below is the
     round-1 "remaining tail" lead, verified real. A twelfth design, "Nokton
     classic 35mm f/1.4" (a brand-new Aug 2026 release, item no. 126307), is
     deferred — its own spec table leaves "Smallest Aperture" blank, and
     minAperture is non-nullable even for new releases; see PROGRESS.md.
     USD prices below are ESTIMATES: voigtlaender.de states EUR-only RRPs and
     this session's B&H/Amazon access was permission-blocked, Adorama search
     returned no matching SKU, and the WebSearch budget was exhausted before
     retail confirmation could be attempted. Each USD figure is EUR × 1.169,
     the ratio backed out from this file's own verified
     voigtlander-nokton-40mm-f12 entry (EUR 769 → USD 899, both tier-1/T1-
     sourced). Flagged in PROGRESS.md for a follow-up retail-price pass. ── */
  'voigtlander-super-wide-heliar-15mm-f45': {
    name:'Voigtländer Super Wide Heliar 15mm f/4.5 Aspherical Z', manufacturer:'Voigtländer', line:'Heliar', type:'Prime',
    focalLength:15, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'15mm',
    maxAperture:4.5, minAperture:22, weight:290, length:67.0, diameter:67.6,
    filterThread:58, minFocusDist:12.6, maxMagnification:null,
    elements:11, groups:9, blades:null, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2023, discontinued:false,
    imageUrl:'https://www.voigtlaender.de/wp-content/uploads/2023/04/Super-wide-heliar-15mmf4_5_Z-web.png',
    imageSource: { url:'https://www.voigtlaender.de/z-mount/15mm-14-5-super-wide-heliar/?lang=en', tier:'T1', note:'official Voigtländer Z-mount product page; full spec table dated "as of January 2023"; aperture-blade count genuinely unpublished on this page', date:'2026-08-30' },
    priceSource: { url:'https://www.voigtlaender.de/z-mount/15mm-14-5-super-wide-heliar/?lang=en', tier:'T1', note:'EUR 849 stated on the maker\'s own page; USD is an estimate (849×1.169≈993) — not independently retail-confirmed, see block comment above', date:'2026-08-30' },
    asin:null,
    prices:{USD:993,AUD:null,EUR:849,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://www.voigtlaender.de/z-mount/15mm-14-5-super-wide-heliar/?lang=en',
  },

  'voigtlander-nokton-d23mm-f12': {
    name:'Voigtländer Nokton D23mm f/1.2 Z', manufacturer:'Voigtländer', line:'Nokton', type:'Prime',
    focalLength:23, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'35mm',
    maxAperture:1.2, minAperture:16, weight:240, length:45.2, diameter:65.8,
    filterThread:46, minFocusDist:18, maxMagnification:null,
    elements:10, groups:6, blades:12, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2022, discontinued:false,
    imageUrl:'https://www.voigtlaender.de/wp-content/uploads/2022/04/NOKTON-D23mmF1.2-Z.jpg',
    imageSource: { url:'https://www.voigtlaender.de/z-mount/d23-mm-11-2-nokton/?lang=en', tier:'T1', note:'official Voigtländer Z-mount (APS-C/DX) product page; full spec table dated "as of April 2022"; blade count taken from the page\'s own bullet ("12 aperture blades for exceptional bokeh"), not the (blank) table row', date:'2026-08-30' },
    priceSource: { url:'https://www.voigtlaender.de/z-mount/d23-mm-11-2-nokton/?lang=en', tier:'T1', note:'EUR 699 stated on the maker\'s own page; USD is an estimate (699×1.169≈817) — not independently retail-confirmed, see block comment above', date:'2026-08-30' },
    asin:null,
    prices:{USD:817,AUD:null,EUR:699,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://www.voigtlaender.de/z-mount/d23-mm-11-2-nokton/?lang=en',
  },

  'voigtlander-nokton-28mm-f15': {
    name:'Voigtländer Nokton 28mm f/1.5 Aspherical Z', manufacturer:'Voigtländer', line:'Nokton', type:'Prime',
    focalLength:28, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'28mm',
    maxAperture:1.5, minAperture:16, weight:360, length:57.0, diameter:67.6,
    filterThread:52, minFocusDist:28, maxMagnification:null,
    elements:10, groups:8, blades:12, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2025, discontinued:false,
    imageUrl:'https://www.voigtlaender.de/wp-content/uploads/2025/01/28mm-f1_5-Nokton-Z-klein.jpg',
    imageSource: { url:'https://www.voigtlaender.de/z-mount/28-mm-115-nokton-aspherical-z/?lang=en', tier:'T1', note:'official Voigtländer Z-mount product page; full spec table dated "as of January 2025"; blade count from the page\'s own bullet ("12 aperture blades for beautiful bokeh")', date:'2026-08-30' },
    priceSource: { url:'https://www.voigtlaender.de/z-mount/28-mm-115-nokton-aspherical-z/?lang=en', tier:'T1', note:'EUR 1,049 stated on the maker\'s own page; USD is an estimate (1049×1.169≈1226) — not independently retail-confirmed, see block comment above', date:'2026-08-30' },
    asin:null,
    prices:{USD:1226,AUD:null,EUR:1049,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://www.voigtlaender.de/z-mount/28-mm-115-nokton-aspherical-z/?lang=en',
  },

  'voigtlander-apo-lanthar-28mm-f2': {
    name:'Voigtländer APO-Lanthar 28mm f/2 Aspherical Z', manufacturer:'Voigtländer', line:'APO-Lanthar', type:'Prime',
    focalLength:28, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'28mm',
    maxAperture:2.0, minAperture:16, weight:350, length:60.0, diameter:68.8,
    filterThread:58, minFocusDist:28, maxMagnification:0.145,
    elements:12, groups:8, blades:null, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2025, discontinued:false,
    imageUrl:'https://www.voigtlaender.de/wp-content/uploads/2026/01/28mm-f2-Apo-Lanthar-Z-1.png',
    imageSource: { url:'https://www.voigtlaender.de/z-mount/28-mm-1-2-apo-lanthar/?lang=en', tier:'T1', note:'official Voigtländer Z-mount product page; full spec table dated "as of November 2025"; max magnification from the stated 1:6.9', date:'2026-08-30' },
    priceSource: { url:'https://www.voigtlaender.de/z-mount/28-mm-1-2-apo-lanthar/?lang=en', tier:'T1', note:'EUR 1,149 stated on the maker\'s own page; USD is an estimate (1149×1.169≈1343) — not independently retail-confirmed, see block comment above', date:'2026-08-30' },
    asin:null,
    prices:{USD:1343,AUD:null,EUR:1149,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://www.voigtlaender.de/z-mount/28-mm-1-2-apo-lanthar/?lang=en',
  },

  'voigtlander-nokton-d35mm-f12': {
    name:'Voigtländer Nokton D35mm f/1.2 Z', manufacturer:'Voigtländer', line:'Nokton', type:'Prime',
    focalLength:35, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'53mm',
    maxAperture:1.2, minAperture:16, weight:230, length:41.0, diameter:65.8,
    filterThread:46, minFocusDist:30, maxMagnification:0.149,
    elements:8, groups:6, blades:null, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2022, discontinued:false,
    imageUrl:'https://www.voigtlaender.de/wp-content/uploads/2022/04/NOKTON_D35mmF12Z_klein.png',
    imageSource: { url:'https://www.voigtlaender.de/d35-mm-11-2-nokton/?lang=en', tier:'T1', note:'official Voigtländer Z-mount (APS-C/DX) product page (no "as of" date disclaimer on this specific page — year taken from the product photo\'s own upload date, 2022-04, matching the sibling D23mm Nokton\'s confirmed April-2022 launch); max magnification from the stated 1:6.7', date:'2026-08-30' },
    priceSource: { url:'https://www.voigtlaender.de/d35-mm-11-2-nokton/?lang=en', tier:'T1', note:'EUR 649 stated on the maker\'s own page; USD is an estimate (649×1.169≈759) — not independently retail-confirmed, see block comment above', date:'2026-08-30' },
    asin:null,
    prices:{USD:759,AUD:null,EUR:649,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://www.voigtlaender.de/d35-mm-11-2-nokton/?lang=en',
  },

  'voigtlander-macro-apo-ultron-d35mm-f2': {
    name:'Voigtländer Macro APO-Ultron D35mm f/2 Z', manufacturer:'Voigtländer', line:'APO-Ultron', type:'Prime',
    focalLength:35, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'53mm',
    maxAperture:2.0, minAperture:22, weight:290, length:56.7, diameter:67.7,
    filterThread:52, minFocusDist:16.3, maxMagnification:0.5,
    elements:9, groups:6, blades:10, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2022, discontinued:false,
    imageUrl:'https://www.voigtlaender.de/wp-content/uploads/2022/12/MACRO-APO-ULTRON-D35mm-F2-Z.png',
    imageSource: { url:'https://www.voigtlaender.de/z-mount/d35mm-12-0-macro-apo-ultron/?lang=en', tier:'T1', note:'official Voigtländer Z-mount (APS-C/DX) product page (no "as of" date disclaimer — year taken from the product photo\'s own upload date, 2022-12); blade count from the page\'s own bullet ("10-blade diaphragm for beautiful bokeh")', date:'2026-08-30' },
    priceSource: { url:'https://www.voigtlaender.de/z-mount/d35mm-12-0-macro-apo-ultron/?lang=en', tier:'T1', note:'EUR 729 stated on the maker\'s own page; USD is an estimate (729×1.169≈852) — not independently retail-confirmed, see block comment above', date:'2026-08-30' },
    asin:null,
    prices:{USD:852,AUD:null,EUR:729,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://www.voigtlaender.de/z-mount/d35mm-12-0-macro-apo-ultron/?lang=en',
  },

  'voigtlander-apo-lanthar-35mm-f2': {
    name:'Voigtländer APO-Lanthar 35mm f/2 Aspherical II Z', manufacturer:'Voigtländer', line:'APO-Lanthar', type:'Prime',
    focalLength:35, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'35mm',
    maxAperture:2.0, minAperture:16, weight:360, length:70.4, diameter:67.6,
    filterThread:58, minFocusDist:35, maxMagnification:null,
    elements:11, groups:9, blades:12, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2025, discontinued:false,
    imageUrl:'https://www.voigtlaender.de/wp-content/uploads/2025/01/35mm-F2.0-APO-II-Z_klein.jpg',
    imageSource: { url:'https://www.voigtlaender.de/z-mount/35mm-12-apo-lanthar-aspherical/?lang=en', tier:'T1', note:'official Voigtländer Z-mount product page — this is the specific "APO-Lanthar 35mm f/2 II" lead flagged from a prior pass; verified genuinely shipping (own dedicated Z-mount page + product photo, distinct from the existing 50mm APO-Lanthar II sibling); no "as of" date disclaimer on this page — year taken from the product photo\'s own upload date, 2025-01; blade count from the page\'s own bullet ("12 aperture blades with circular aperture at F2.0/F2.8/F5.6/F16")', date:'2026-08-30' },
    priceSource: { url:'https://www.voigtlaender.de/z-mount/35mm-12-apo-lanthar-aspherical/?lang=en', tier:'T1', note:'EUR 1,099 stated on the maker\'s own page; USD is an estimate (1099×1.169≈1285) — not independently retail-confirmed, see block comment above', date:'2026-08-30' },
    asin:null,
    prices:{USD:1285,AUD:null,EUR:1099,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://www.voigtlaender.de/z-mount/35mm-12-apo-lanthar-aspherical/?lang=en',
  },

  'voigtlander-septon-40mm-f2': {
    name:'Voigtländer Septon 40mm f/2 Aspherical Z', manufacturer:'Voigtländer', line:'Septon', type:'Prime',
    focalLength:40, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'40mm',
    maxAperture:2.0, minAperture:16, weight:205, length:32, diameter:68.3,
    filterThread:52, minFocusDist:30, maxMagnification:null,
    elements:7, groups:6, blades:null, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2026, discontinued:false,
    imageUrl:'https://www.voigtlaender.de/wp-content/uploads/2026/08/40mm-Septon-Z_.png',
    imageSource: { url:'https://www.voigtlaender.de/z-mount/40-mm-12-septon-aspherical-z/?lang=en', tier:'T1', note:'official Voigtländer Z-mount product page; full spec table dated "as of August 2026" — a same-month release (Viltrox-style pancake-standard Septon revival for E/Z mounts); aperture-blade count genuinely unpublished on this page, within the skill\'s ≤1-month new-release allowance', date:'2026-08-30' },
    priceSource: { url:'https://www.voigtlaender.de/z-mount/40-mm-12-septon-aspherical-z/?lang=en', tier:'T1', note:'EUR 649 stated on the maker\'s own page; USD is an estimate (649×1.169≈759) — not independently retail-confirmed, see block comment above', date:'2026-08-30' },
    asin:null,
    prices:{USD:759,AUD:null,EUR:649,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://www.voigtlaender.de/z-mount/40-mm-12-septon-aspherical-z/?lang=en',
  },

  'voigtlander-nokton-50mm-f10': {
    name:'Voigtländer Nokton 50mm f/1.0 Aspherical Z', manufacturer:'Voigtländer', line:'Nokton', type:'Prime',
    focalLength:50, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'50mm',
    maxAperture:1.0, minAperture:16, weight:598, length:66.6, diameter:67.6,
    filterThread:62, minFocusDist:45, maxMagnification:null,
    elements:9, groups:7, blades:12, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2023, discontinued:false,
    imageUrl:'https://www.voigtlaender.de/wp-content/uploads/2023/04/50mm-F1-Z-small.png',
    imageSource: { url:'https://www.voigtlaender.de/z-mount/50-mm-11-0-nokton/?lang=en', tier:'T1', note:'official Voigtländer Z-mount product page; full spec table dated "as of January 2023"; blade count from the page\'s own bullet ("12 aperture blades for a pleasing and picturesque bokeh")', date:'2026-08-30' },
    priceSource: { url:'https://www.voigtlaender.de/z-mount/50-mm-11-0-nokton/?lang=en', tier:'T1', note:'EUR 1,799 stated on the maker\'s own page; USD is an estimate (1799×1.169≈2103) — not independently retail-confirmed, see block comment above', date:'2026-08-30' },
    asin:null,
    prices:{USD:2103,AUD:null,EUR:1799,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://www.voigtlaender.de/z-mount/50-mm-11-0-nokton/?lang=en',
  },

  'voigtlander-macro-apo-lanthar-65mm-f2': {
    name:'Voigtländer Macro APO-Lanthar 65mm f/2 Aspherical Z', manufacturer:'Voigtländer', line:'APO-Lanthar', type:'Prime',
    focalLength:65, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'65mm',
    maxAperture:2.0, minAperture:22, weight:618, length:88.8, diameter:78,
    filterThread:67, minFocusDist:31, maxMagnification:0.5,
    elements:10, groups:8, blades:10, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2022, discontinued:false,
    imageUrl:'https://www.voigtlaender.de/wp-content/uploads/2022/12/MACRO-APO-LANTHAR-65Z.png',
    imageSource: { url:'https://www.voigtlaender.de/z-mount/65mm-120-macro-apo-lanthar-aspherical/?lang=en', tier:'T1', note:'official Voigtländer Z-mount product page (no "as of" date disclaimer — year taken from the product photo\'s own upload date, 2022-12); max magnification and blade count from the page\'s own bullets (1:2, "10-blade aperture diaphragm")', date:'2026-08-30' },
    priceSource: { url:'https://www.voigtlaender.de/z-mount/65mm-120-macro-apo-lanthar-aspherical/?lang=en', tier:'T1', note:'EUR 1,149 stated on the maker\'s own page; USD is an estimate (1149×1.169≈1343) — not independently retail-confirmed, see block comment above', date:'2026-08-30' },
    asin:null,
    prices:{USD:1343,AUD:null,EUR:1149,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://www.voigtlaender.de/z-mount/65mm-120-macro-apo-lanthar-aspherical/?lang=en',
  },

  'voigtlander-portrait-heliar-75mm-f18': {
    name:'Voigtländer Portrait Heliar 75mm f/1.8 Z', manufacturer:'Voigtländer', line:'Heliar', type:'Prime',
    focalLength:75, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'75mm',
    maxAperture:1.8, minAperture:11, weight:580, length:88.0, diameter:70.0,
    filterThread:62, minFocusDist:70, maxMagnification:null,
    elements:6, groups:3, blades:null, afType:'Manual',
    weatherSealed:false, ois:false, oisStops:null, year:2025, discontinued:false,
    imageUrl:'https://www.voigtlaender.de/wp-content/uploads/2026/01/75mm-Portrait-Heliar-Z-Mount-stehend.png',
    imageSource: { url:'https://www.voigtlaender.de/z-mount/75-mm-11-8-portrait-heliar-z/?lang=en', tier:'T1', note:'official Voigtländer Z-mount product page; full spec table dated "as of May 2025"; distinctive "Bokeh Controller" ring trades spherical-aberration correction for creative bokeh — a smaller-than-usual F11 minimum aperture is correct per the maker\'s own table, not a typo; camera-body 5-axis IBIS is listed as supported (not lens-based OIS, hence ois:false)', date:'2026-08-30' },
    priceSource: { url:'https://www.voigtlaender.de/z-mount/75-mm-11-8-portrait-heliar-z/?lang=en', tier:'T1', note:'EUR 1,199 stated on the maker\'s own page; USD is an estimate (1199×1.169≈1402) — not independently retail-confirmed, see block comment above', date:'2026-08-30' },
    asin:null,
    prices:{USD:1402,AUD:null,EUR:1199,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://www.voigtlaender.de/z-mount/75-mm-11-8-portrait-heliar-z/?lang=en',
  },

  /* ── Other (Yongnuo AF + budget makers) ── */
  'yongnuo-35mm-f2': {
    name:'Yongnuo YN35mm f/2Z DF DSM', manufacturer:'Yongnuo', line:'DF DSM', type:'Prime',
    focalLength:35, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'35mm',
    maxAperture:2.0, minAperture:16, weight:290, length:73, diameter:68,
    filterThread:52, minFocusDist:35, maxMagnification:0.13,
    elements:9, groups:8, blades:7, afType:'Stepping Motor (DSM)',
    weatherSealed:false, ois:false, oisStops:null, year:2023, discontinued:false,
    imageUrl:'https://yongnuo.eu/wp-content/uploads/2024/03/YN35mm_F2Z_DF_DSM_lens_1.jpg',
    imageSource: { url:'https://yongnuo.eu/lenses/nikon-z-f/yn35mm-f2z-df-dsm/', tier:'T1', note:'official Yongnuo EU store, Nikon Z-F category; page heading "YN35mm F2Z DF DSM"', date:'2026-08-17' },
    asin:null,
    prices:{USD:250,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://yongnuo.eu/lenses/nikon-z-f/yn35mm-f2z-df-dsm/',
  },

  'yongnuo-50mm-f18': {
    name:'Yongnuo YN50mm f/1.8Z DF DSM', manufacturer:'Yongnuo', line:'DF DSM', type:'Prime',
    focalLength:50, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'50mm',
    maxAperture:1.8, minAperture:16, weight:417, length:87, diameter:68,
    filterThread:58, minFocusDist:45, maxMagnification:0.14,
    elements:11, groups:8, blades:9, afType:'Stepping Motor (DSM)',
    weatherSealed:false, ois:false, oisStops:null, year:2022, discontinued:false,
    imageUrl:'https://yongnuo.eu/wp-content/uploads/2024/03/YN50mm_F1.8Z_DF_DSM_lens_1.jpg',
    imageSource: { url:'https://yongnuo.eu/lenses/nikon-z-f/yn50mm-f1-8z-df-dsm/', tier:'T1', note:'official Yongnuo EU store, Nikon Z-F category; page heading "YN50mm F1.8Z DF DSM"', date:'2026-08-17' },
    asin:null,
    // Price corrected 2026-08-22: $130 was implausible for this full-frame
    // variant and its specs (11 elements/8 groups/9 blades/58mm filter/0.45m
    // MFD) match the DF DSM exactly, not the cheaper APS-C "DA DSM" ($100-120)
    // this figure likely got copied from. B&H sells this exact SKU new at
    // $359 (matches AliExpress $359); name/specs/URL were already correct.
    prices:{USD:359,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://th.hkyongnuo.com/products/yn50mm-f18z-df-dsm',
  },

  'ttartisan-27mm-f28': {
    name:'TTArtisan AF 27mm f/2.8', manufacturer:'TTArtisan', line:'AF', type:'Prime',
    focalLength:27, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'41mm',
    maxAperture:2.8, minAperture:16, weight:93, length:41, diameter:64,
    filterThread:39, minFocusDist:35, maxMagnification:0.1,
    elements:6, groups:5, blades:7, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2023, discontinued:false,
    imageUrl:'https://ttartisan.store/cdn/shop/files/EN-Z.jpg',
    imageSource: { url:'https://ttartisan.store/products/af27', tier:'T1', note:'official TTArtisan store; page has a Fuji X / Sony E / Nikon Z mount selector — selecting "Nikon Z" swaps the hero image to this "EN-Z.jpg" file (vs "EN-_-X.jpg" for the default Fuji X selection), confirming mount-specific sourcing', date:'2026-08-17' },
    asin:null,
    prices:{USD:149,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://ttartisan.store/products/af27',
  },

  '7artisans-27mm-f28': {
    name:'7Artisans AF 27mm f/2.8', manufacturer:'7Artisans', line:'AF', type:'Prime',
    focalLength:27, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'41mm',
    maxAperture:2.8, minAperture:16, weight:172, length:48, diameter:64,
    filterThread:52, minFocusDist:30, maxMagnification:0.1,
    elements:6, groups:5, blades:6, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2024, discontinued:false,
    imageUrl:'https://7artisans.store/cdn/shop/files/1_eabbda7c-b94b-4ca0-a7ab-0cc6489a4fbd.jpg',
    imageSource: { url:'https://7artisans.store/products/af-27mm-f2-8-aps-c-lens-for-z', tier:'T1', note:'official 7Artisans store, single-mount Z-only product page; barrel explicitly reads "AF 27mm F2.8" and "Z-Mount"', date:'2026-08-17' },
    asin:null,
    prices:{USD:129,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://7artisans.store/products/af-27mm-f2-8-aps-c-lens-for-z',
  },

  'meike-85mm-f18': {
    name:'Meike 85mm f/1.8 Full Frame AF', manufacturer:'Meike', line:'AF', type:'Prime',
    focalLength:85, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'85mm',
    maxAperture:1.8, minAperture:22, weight:386, length:92, diameter:80,
    filterThread:67, minFocusDist:85, maxMagnification:0.12,
    elements:null, groups:null, blades:9, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2021, discontinued:true,
    imageUrl:'https://meikeglobal.com/cdn/shop/products/8518__0001_Z_9e99b552-ea43-4446-9f86-e328de275ab5.jpg',
    imageSource: { url:'https://meikeglobal.com/products/85mm-f1-8z', tier:'T1', note:'official Meike Global store, Nikon Z-only product page; product photo shows the lens mounted on a Nikon Z7 body with barrel text "85mm 1:1.8"', date:'2026-08-17' },
    asin:null,
    prices:{USD:219,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://meikeglobal.com/products/85mm-f1-8z',
  },

  'meike-85mm-f18-se-ii': {
    name:'Meike AF 85mm f/1.8 SE Mark II', manufacturer:'Meike', line:'SE', type:'Prime',
    focalLength:85, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'85mm',
    maxAperture:1.8, minAperture:16, weight:369, length:100.2, diameter:76,
    filterThread:62, minFocusDist:650, maxMagnification:0.17,
    elements:11, groups:7, blades:11, afType:'STM',
    weatherSealed:false, ois:false, oisStops:null, year:2026, discontinued:false,
    imageUrl:'https://meikeglobal.com/cdn/shop/files/85mm-F1.8-SE--1.jpg',
    imageSource: { url:'https://meikeglobal.com/products/8518%E2%85%B1-se-z-mount', tier:'T1', note:'official Meike Global store, Nikon Z Mount-only product page (title "...SE Mark II...for Z Mount Cameras"); sourced from this exact product\'s own gallery — the barrel itself only reads "85/1.8" with no visible SE/II marking, visually close to the standard 85mm f/1.8 studio shot, flagging in case Meike reused photography across the two listings', date:'2026-08-17' },
    asin:null,
    prices:{USD:229,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true, productUrl:'https://meikeglobal.com/products/8518%E2%85%B1-se-z-mount',
  },

};

const LENS_DROPDOWN_GROUPS = [
  { label: '── S-Line Primes ──', ids: ['z-20mm-f1-8-s', 'z-24mm-f1-8-s', 'z-35mm-f1-8-s', 'z-50mm-f1-8-s', 'z-85mm-f1-8-s', 'z-35mm-f1-2-s', 'z-50mm-f1-2-s', 'z-85mm-f1-2-s', 'z-135mm-f1-8-s-plena', 'z-mc-105mm-f2-8-vr-s', 'z-58mm-f0-95-s-noct'] },
  { label: '── Standard Primes ──', ids: ['z-26mm-f2-8', 'z-28mm-f2-8', 'z-28mm-f2-8-se', 'z-35mm-f1-4', 'z-40mm-f2', 'z-40mm-f2-se', 'z-50mm-f1-4', 'z-50mm-f2-8-mc'] },
  { label: '── S-Line Zooms ──',  ids: ['z-14-24mm-f2-8-s', 'z-24-70mm-f2-8-s', 'z-24-70mm-f2-8-s-ii', 'z-24-70mm-f4-s', 'z-14-30mm-f4-s', 'z-24-120mm-f4-s', 'z-70-200mm-f2-8-vr-s', 'z-70-200mm-f2-8-vr-s-ii', 'z-100-400mm-f4-5-5-6-vr-s'] },
  { label: '── Standard / Travel Zooms ──', ids: ['z-17-28mm-f2-8', 'z-24-50mm-f4-6-3', 'z-24-105mm-f4-71', 'z-28-75mm-f2-8', 'z-24-200mm-f4-6-3-vr', 'z-28-400mm-f4-8-vr', 'z-28-135mm-f4-pz'] },
  { label: '── Telephoto / Super-Telephoto ──', ids: ['z-70-180mm-f2-8', 'z-180-600mm-f5-6-6-3-vr', 'z-400mm-f4-5-vr-s', 'z-400mm-f2-8-tc-vr-s', 'z-600mm-f6-3-vr-s-pf', 'z-600mm-f4-tc-vr-s', 'z-800mm-f6-3-vr-s-pf'] },
  { label: '── DX Lenses ──',     ids: ['z-dx-24mm-f1-7', 'z-dx-mc-35mm-f17', 'z-dx-12-28mm-pz-vr', 'z-dx-16-50mm-vr', 'z-dx-16-50mm-f28-vr', 'z-dx-18-140mm-vr', 'z-dx-50-250mm-vr'] },
  { label: '── Sigma ──', ids: ['sigma-16mm-f14', 'sigma-30mm-f14', 'sigma-56mm-f14'] },
  { label: '── Viltrox ──', ids: ['viltrox-13mm-f14', 'viltrox-16mm-f18', 'viltrox-27mm-f12', 'viltrox-33mm-f14', 'viltrox-56mm-f14', 'viltrox-85mm-f18-ii', 'viltrox-85mm-f20-evo', 'viltrox-85mm-f14-pro', 'viltrox-24mm-f18', 'viltrox-35mm-f18-evo', 'viltrox-40mm-f25-air', 'viltrox-90mm-f22-evo', 'viltrox-75mm-f18-evo', 'viltrox-56mm-f12-pro', 'viltrox-9mm-f28-air', 'viltrox-15mm-f17-air', 'viltrox-25mm-f17-air', 'viltrox-35mm-f17-air', 'viltrox-23mm-f14', 'viltrox-75mm-f12-pro', 'viltrox-56mm-f17-air', 'viltrox-26mm-f28-evo', 'viltrox-55mm-f18-evo', 'viltrox-50mm-f14-pro', 'viltrox-35mm-f12-lab', 'viltrox-135mm-f18-lab', 'viltrox-14mm-f4-air', 'viltrox-28mm-f45', 'viltrox-50mm-f2-air', 'viltrox-20mm-f28-air', 'viltrox-28mm-f18', 'viltrox-20mm-f18-mf'] },
  { label: '── Tamron ──', ids: ['tamron-12-20mm-f28', 'tamron-16-30mm-f28-g2', 'tamron-17-70mm-f28', 'tamron-18-300mm-f35-63', 'tamron-28-75mm-f28-g2', 'tamron-35-100mm-f28', 'tamron-35-150mm-f2-28', 'tamron-50-400mm-f45-63', 'tamron-70-180mm-f28-g2', 'tamron-70-300mm-f45-63', 'tamron-90mm-f28-macro', 'tamron-150-500mm-f5-67'] },
  { label: '── Voigtländer ──', ids: ['voigtlander-apo-lanthar-50mm-f2', 'voigtlander-nokton-40mm-f12', 'voigtlander-super-wide-heliar-15mm-f45', 'voigtlander-nokton-d23mm-f12', 'voigtlander-nokton-28mm-f15', 'voigtlander-apo-lanthar-28mm-f2', 'voigtlander-nokton-d35mm-f12', 'voigtlander-macro-apo-ultron-d35mm-f2', 'voigtlander-apo-lanthar-35mm-f2', 'voigtlander-septon-40mm-f2', 'voigtlander-nokton-50mm-f10', 'voigtlander-macro-apo-lanthar-65mm-f2', 'voigtlander-portrait-heliar-75mm-f18'] },
  { label: '── Laowa ──', ids: ['laowa-10mm-f4-cookie', 'laowa-10mm-f28-af', 'laowa-12mm-f28-lite-zero-d', 'laowa-15mm-f2', 'laowa-15mm-f45-macro', 'laowa-15mm-f5-cookie', 'laowa-15mm-f45-shift', 'laowa-17mm-f4-tilt-shift', 'laowa-20mm-f4-shift', 'laowa-25mm-f28-25-5x-macro', 'laowa-35mm-f28-tilt-shift-macro', 'laowa-55mm-f28-tilt-shift-macro', 'laowa-58mm-f28-2x-macro', 'laowa-65mm-f28-2x-macro', 'laowa-85mm-f56-2x-macro', 'laowa-90mm-f28-macro', 'laowa-100mm-f28-2x-macro', 'laowa-100mm-f28-tilt-shift-macro', 'laowa-argus-28mm-f12', 'laowa-argus-33mm-f095', 'laowa-8-15mm-f28-fisheye', 'laowa-8-16mm-f35-5', 'laowa-10-18mm-f45-56', 'laowa-12-24mm-f56-shift'] },
  { label: '── Samyang ──', ids: ['samyang-14mm-f28', 'samyang-85mm-f14'] },
  { label: '── Other ──', ids: ['yongnuo-35mm-f2', 'yongnuo-50mm-f18', 'ttartisan-27mm-f28', '7artisans-27mm-f28', 'meike-85mm-f18', 'meike-85mm-f18-se-ii'] },
];

return { BRAND_CONFIG, SERIES_COLORS, CAMERAS, CAMERA_ORDER,
         DROPDOWN_GROUPS, LENSES, LENS_DROPDOWN_GROUPS, REGISTERED_BRANDS };
})();
