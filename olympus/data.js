// Registered into the shared brand-data registry so multiple brand files
// can load on one page (see compare/). The data below is unchanged.
window.BRAND_DATA = window.BRAND_DATA || {};
window.BRAND_DATA['olympus'] = (() => {
// ─────────────────────────────────────────────
// OLYMPUS BRAND CONFIG
//
// One brand covering both eras of the same Micro Four Thirds system: Olympus
// (2009–2020) and OM System (2021–present, after the 2021 sale to Japan
// Industrial Partners). The mount, lens line and body lineage are continuous
// across the ownership change — see openspec/changes/add-olympus-brand/design.md §1.
// ─────────────────────────────────────────────
const BRAND_CONFIG = {
  name:        'Olympus',
  slug:        'olympus',
  families:    ['Micro Four Thirds (PEN / OM-D / OM System)', 'Tough (Fixed-Lens Compact)'],
  brandSections: ['olympus'],
  // `mount` is the landing-tile headline label; `mounts` is the machine-readable
  // list every item's `mount` id must come from, and the order the filter chips render in.
  // Single-mount brand — see design.md §2 for why Tough (a genuinely different
  // sensor format) still declares this same 'mft' id rather than a second one.
  mount:       'Micro Four Thirds',
  mounts:      [{ id:'mft', label:'Micro Four Thirds' }],
  heroCamera:  'om-1-ii',
  cameras: {
    heroEyebrow:  'PEN, OM-D & OM System',
    heroTitle:    '<span>Olympus</span> Camera Comparison',
    heroSubtitle: 'Compare Olympus and OM System Micro Four Thirds cameras side-by-side — PEN, OM-D and the current OM System lineup',
    headerTitle:  'Olympus',
    defaultSelected: ['om-1-ii', 'om-3', 'om-5-ii'],
  },
  lenses: {
    heroEyebrow:  'M.ZUIKO Lenses',
    heroTitle:    '<span>Olympus</span> Lens Comparison',
    heroSubtitle: 'Compare Olympus M.Zuiko and third-party Micro Four Thirds lenses side-by-side',
    headerTitle:  'Lens Compare',
    defaultSelected: ['omsystem-25mm-f12-pro', 'omsystem-12-40mm-f28-pro', 'omsystem-45mm-f12-pro'],
  },
  footerLinks: [
    { label: 'OM System Cameras', url: 'https://explore.omsystem.com/us/en/cameras' },
    { label: 'M.Zuiko Lenses',    url: 'https://explore.omsystem.com/us/en/m-zuiko-digital-lenses' },
    { label: 'DPReview Olympus',  url: 'https://www.dpreview.com/products/olympus' },
  ],
};

const REGISTERED_BRANDS = [
  { slug: 'fujifilm',  name: 'Fujifilm' },
  { slug: 'canon',     name: 'Canon' },
  { slug: 'sony',      name: 'Sony' },
  { slug: 'nikon',     name: 'Nikon' },
  { slug: 'panasonic', name: 'Panasonic' },
  { slug: 'sigma',     name: 'Sigma' },
  { slug: 'olympus',   name: 'Olympus' },
];

// ─────────────────────────────────────────────
// SERIES COLORS (for camera placeholder cards)
// Nine series — see research/decisions.md §9 for the full rationale. Each
// camera's `series` names its product family as printed on the body (e.g.
// the 2026 PEN gets 'PEN', not 'OM System'), not its corporate era.
// ─────────────────────────────────────────────
const SERIES_COLORS = {
  'PEN':          { bg: '#2a2015', text: '#d4a55a' },
  'PEN-F':        { bg: '#1f1a12', text: '#c9a876' },
  'PEN Lite':     { bg: '#241f28', text: '#a88fc0' },
  'PEN Mini':     { bg: '#1c1a20', text: '#8878a0' },
  'OM-D E-M1':    { bg: '#1a1f26', text: '#6fa8d8' },
  'OM-D E-M5':    { bg: '#151f1c', text: '#5cb88a' },
  'OM-D E-M10':   { bg: '#1a2016', text: '#8ac05c' },
  'OM System':    { bg: '#0a1f26', text: '#5fd0c8' },
  'Tough':        { bg: '#1f1810', text: '#e0954a' },
};

// ─────────────────────────────────────────────
// CAMERA DATABASE — Olympus / OM System Micro Four Thirds mirrorless +
// Tough fixed-lens compacts. Filled in task-4 batches; see
// openspec/changes/add-olympus-brand/research/cameras.md for the full
// enumeration and openspec/changes/add-olympus-brand/research/decisions.md
// for entry conventions. Olympus-specific fields: liveND (Live ND simulated
// neutral density), hiResShot (High Res Shot output resolution, tripod/
// handheld), proCapture (pre-shutter buffered capture), liveComposite
// (in-camera stacked long exposure).
// ─────────────────────────────────────────────
const CAMERAS = {

  /* ── OM System (current) ── */
  'om-1-ii': {
    name:'OM-1 Mark II', series:'OM System', mount:'mft', year:2024, discontinued:false,
    tagline:'Stacked BSI Flagship with Live ND & Pro Capture',
    productUrl:'https://explore.omsystem.com/us/en/om-1-mark-ii',
    // imageUrl intentionally null — see KNOWN_IMAGE_GAPS['olympus'] in
    // tests/data/completeness.test.js. The only image asset on the official
    // product page is a dimension diagram, downloaded and visually
    // inspected, not a usable product photo. Highest-priority gap for task 8.
    imageUrl:null,
    asin:null,
    prices:{USD:2399,AUD:3499,EUR:2399,GBP:1699,JPY:305800,CAD:2799,SGD:2999},
    priceSource: { url:'https://explore.omsystem.com/us/en/om-1-mark-ii', tier:'T1', note:'Direct fetch of each official regional store: US $2,399.99 (list, before the current $1,999.99 promo), AU $3,499.00 (explore.omsystem.com/au), EUR €2,399.00 (explore.omsystem.com/ie — no working /de path found), GBP £1,699.00 (explore.omsystem.com/gb — reflects a genuine price cut per contemporary press coverage, not a temporary promo), JPY ¥305,800 tax-included (jp.omsystem.com official store, not a price-aggregator minimum), CAD $2,799.99 (explore.omsystem.com/ca). SGD $2,999 is the one non-T1 figure — no OM System-branded SG storefront found; sourced from an authorized Singapore dealer.', date:'2026-09-12' },
    specSources: [ { url:'https://explore.omsystem.com/us/en/om-1-mark-ii', tier:'T1', note:'Official spec sheet: sensor, processor, weather sealing, LCD/EVF dots, AF, IBIS, burst/buffer, video, connectivity, storage, battery, and the Live ND / High Res Shot / Pro Capture / Live Composite figures used below. Width and EVF magnification corrected from this fetch\'s mis-parsed text (138.8mm, 1.48-1.65x) after the official dimension-diagram image (viewed directly) showed 134.8mm, and independent corroboration confirmed 0.83x magnification (0.74x selectable) -- the same finder as the original OM-1, which this body shares.', date:'2026-09-12' } ],
    sensorMP:20.4, sensorType:'Micro Four Thirds Stacked BSI Live MOS', processor:'TruePic X',
    width:134.8, height:91.6, depth:72.7, weight:599, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:1620, lcdType:'Vari-angle Touch',
    evfType:'OLED', evfDots:5.76, evfMag:0.83,
    faceDetection:true, subjectDetection:'Human / Animal / Bird / Vehicle / Aircraft / Train',
    ibis:true, ibisStops:8.5, maxBurst:120,
    maxVideoRes:'4K / 60P (C4K available)',
    logVideo:true,
    liveND:'ND2–ND128 (7 stops)', hiResShot:'80MP tripod / 50MP handheld', proCapture:true, liveComposite:true,
    bluetooth:'4.2', wifi:true,
    cardSlots:'2× SD UHS-II', batteryLife:520, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },
  // Added alongside om-1-ii (not yet its batch-4.2 turn) so that
  // scripts/generate-seo.js's curatedPairs() has ≥2 cameras to pair — with
  // only om-1-ii present, the pre-commit hook's full test run failed
  // "[olympus] curated pairs are sane" (pairs.length > 0). om-1 is om-1-ii's
  // direct predecessor and generates exactly one successor pair via the
  // existing Rule 1 (romanLine groups 'om-1-ii' and 'om-1' under the same
  // stem), so this is the natural minimal second camera rather than an
  // arbitrary one. See tasks.md task 3.9 / research/decisions.md for the
  // full account of why tasks 2-4 ended up interleaved here.
  'om-1': {
    name:'OM-1', series:'OM System', mount:'mft', year:2022, discontinued:true,
    tagline:'Original Stacked BSI MFT Flagship',
    // No live dedicated product page found (explore.omsystem.com/us/en/om-1
    // now serves Mark II content) -- left null rather than link to a
    // mismatched page. Revisit properly in task 4.1.
    productUrl:null,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/f/f1/OM_System_OM-1_(51936064654).jpg',
    imageCredit:{author:"Henry Söderlund", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0/", source:"https://commons.wikimedia.org/wiki/File:OM_System_OM-1_(51936064654).jpg"},
    asin:null,
    prices:{USD:2199},
    specSources: [ { url:'https://en.wikipedia.org/wiki/OM_System_OM-1', tier:'T2', note:'Sensor (Sony Exmor RS IMX472 stacked BSI), processor, dimensions/weight (identical body to om-1-ii, corroborated), weather sealing, LCD/EVF dots, AF points, burst rate, video, connectivity, storage, battery life -- cross-checked against a second review aggregation for battery life (520 CIPA) and burst (120fps electronic). liveND/ibisStops are the launch-era figures before Mark II\'s later firmware/hardware improvements to the same specs -- lower confidence than the rest of this entry, worth a firmer single-source citation at the real task 4.1 pass.', date:'2026-09-12' } ],
    sensorMP:20.4, sensorType:'Micro Four Thirds Stacked BSI Live MOS', processor:'TruePic X',
    width:134.8, height:91.6, depth:72.7, weight:599, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:1620, lcdType:'Vari-angle Touch',
    evfType:'OLED', evfDots:5.76, evfMag:0.83,
    faceDetection:true, subjectDetection:'Human / Animal / Bird / Vehicle',
    ibis:true, ibisStops:7.0, maxBurst:120,
    maxVideoRes:'4K UHD / 60P',
    logVideo:true,
    liveND:'ND2–ND32 (5 stops)', hiResShot:'80MP tripod / 50MP handheld', proCapture:true, liveComposite:true,
    bluetooth:'4.2', wifi:true,
    cardSlots:'2× SD UHS-II', batteryLife:520, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },
  // Added alongside om-1-ii/om-1 for the same reason (see decisions.md §12
  // and its follow-up note) -- jsdom render tests need >=4 distinct cameras
  // to exercise slot-picker dedup, so this is the rest of Batch A brought
  // forward rather than a partial batch left in a permanently-broken state.
  'om-3': {
    name:'OM-3', series:'OM System', mount:'mft', year:2025, discontinued:false,
    tagline:'Retro-Styled Stacked BSI Body',
    productUrl:'https://explore.omsystem.com/us/en/om-3',
    imageUrl:null,
    asin:null,
    prices:{USD:1999,AUD:2659,EUR:1999,GBP:1494,JPY:264000,CAD:2499,SGD:2969},
    priceSource: { url:'https://explore.omsystem.com/us/en/om-3', tier:'T1', note:'Direct fetch of each official regional store: US $1,999.99 (list, before the current $1,699.99 promo), AU $2,659.00, EUR €1,999.00 (explore.omsystem.com/ie), GBP £1,494.00, CAD $2,499.99 -- all explore.omsystem.com direct. JPY ¥264,000 (tax included) is a Japanese-retailer launch-price citation (DPReview forum, Yodobashi), not omsystem.com direct -- Japan\'s own product page carries no confirmed price line for this body. SGD $2,969 (incl. GST) from Alan Photo, an OM System authorized Singapore dealer -- no OM System-branded SG storefront exists, same situation as om-1-ii.', date:'2026-09-12' },
    specSources: [ { url:'https://explore.omsystem.com/us/en/om-3', tier:'T1', note:'Official spec sheet. cardSlots count (single vs dual UHS-II) and batteryLife were not stated on this fetch and are left as the safest available reading (cardSlots described generically, batteryLife null) rather than guessed -- confirm directly in the real task 4.1 pass.', date:'2026-09-12' } ],
    sensorMP:20.4, sensorType:'Micro Four Thirds Stacked BSI Live MOS', processor:'TruePic X',
    width:139.3, height:88.9, depth:45.8, weight:496, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:1620, lcdType:'Vari-angle Touch',
    evfType:'OLED', evfDots:2.36, evfMag:1.37,
    faceDetection:true, subjectDetection:'Human / Animal / Bird / Vehicle',
    ibis:true, ibisStops:7.5, maxBurst:120,
    maxVideoRes:'4K / 60P',
    logVideo:true,
    liveND:'ND2–ND64 (6 stops)', hiResShot:'80MP tripod / 50MP handheld', proCapture:true, liveComposite:true,
    bluetooth:'5.2', wifi:true,
    cardSlots:'SD UHS-II', batteryLife:null, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },
  'om-5-ii': {
    name:'OM-5 Mark II', series:'OM System', mount:'mft', year:2025, discontinued:false,
    tagline:'Compact Weather-Sealed Travel Body',
    productUrl:'https://explore.omsystem.com/us/en/om-5-mark-ii',
    imageUrl:null,
    asin:null,
    prices:{USD:1199,AUD:1699,EUR:1299,GBP:880,JPY:144800,CAD:1699,SGD:1699},
    priceSource: { url:'https://explore.omsystem.com/us/en/om-5-mark-ii', tier:'T1', note:'Direct fetch of each official regional store: US $1,199.99 (list, before the current $1,049.99 promo), AU $1,699.00, EUR €1,299.00 (explore.omsystem.com/ie), GBP £880.00, CAD $1,699.99 -- all explore.omsystem.com direct. JPY has no manufacturer RRP at all (jp.omsystem.com\'s own price field reads "オープン" / open price, deliberately unset); ¥144,800 is a representative current Japanese retail price (kakaku.com aggregation across colorways, not the site\'s lowest ¥119,798 outlier). SGD $1,699 is the higher end of a $1,399-1,699 spread across several Singapore dealers -- used as the more list-like figure, consistent with using list over promotional prices throughout this entry.', date:'2026-09-12' },
    specSources: [ { url:'https://explore.omsystem.com/us/en/om-5-mark-ii', tier:'T1', note:'Official spec sheet. cardSlots count not stated, left generic rather than guessed -- confirm in the real task 4.1 pass.', date:'2026-09-12' } ],
    sensorMP:20.4, sensorType:'Micro Four Thirds Live MOS', processor:'TruePic IX',
    width:125.3, height:85.2, depth:49.7, weight:418, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:1037, lcdType:'Vari-angle Touch',
    evfType:'OLED', evfDots:2.36, evfMag:1.37,
    faceDetection:true, subjectDetection:'Face / Eye Detection',
    ibis:true, ibisStops:7.5, maxBurst:30,
    maxVideoRes:'4K / 30P (C4K available)',
    logVideo:true,
    liveND:'ND2–ND16 (4 stops)', hiResShot:'80MP tripod / 50MP handheld', proCapture:true, liveComposite:true,
    bluetooth:'4.2', wifi:true,
    cardSlots:'SD UHS-II', batteryLife:310, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },
};

const CAMERA_ORDER = [
  'om-1-ii', 'om-3', 'om-5-ii', 'om-1',
];

const DROPDOWN_GROUPS = [
  { label: '── OM System (current) ──', ids: ['om-1-ii', 'om-3', 'om-5-ii'] },
  { label: '── OM System (discontinued) ──', ids: ['om-1'] },
];

// ─────────────────────────────────────────────
// LENS DATABASE — first-party M.Zuiko + third-party Micro Four Thirds
// (Panasonic Lumix G/Leica DG, Sigma, Laowa, Voigtländer). Filled in
// task-5/7 batches. 11 M.Zuiko entries and 34 third-party entries port
// verbatim from panasonic/data.js — see shared-mount.test.js, which pins
// every shared id's optic fields and USD price across both files.
// ─────────────────────────────────────────────
const LENSES = {

  /* ── M.Zuiko PRO (ported verbatim from panasonic/data.js — re-verified
     unchanged in task 1.5; shared-mount.test.js pins this entry to agree
     with panasonic/data.js's copy on every optic field + prices.USD) ── */
  'omsystem-25mm-f12-pro': {
    name:'OM System M.Zuiko 25mm f/1.2 PRO', manufacturer:'OM System', line:'PRO', type:'Prime',
    mount:'mft', focalLength:25, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'50mm',
    maxAperture:1.2, minAperture:16, weight:410, length:87, diameter:70,
    filterThread:62, minFocusDist:30, maxMagnification:0.11,
    elements:19, groups:14, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2016, discontinued:false,
    imageUrl:'https://nala.explore.omsystem.com/media/catalog/product/2/5/25mm_f1.2_pro-om_-_tech.webp',
    imageSource: { url:'https://explore.omsystem.com/us/en/m-zuiko-ed-25mm-f1-2-pro', tier:'T1', note:'official OM System explore.omsystem.com product page; dimension diagram shows 87mm length / 70mm width / Ø62mm front diameter, matching the stored length:87 diameter:70 exactly', date:'2026-08-17' },
    asin:'B01LW4IFUI',
    prices:{USD:1599,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true,
    productUrl:'https://explore.omsystem.com/us/en/m-zuiko-ed-25mm-f1-2-pro',
  },
  // Same reason as the extra cameras above -- >=4 distinct lenses needed for
  // the render-logic tests. All 3 already re-verified unchanged in task 1.5.
  'omsystem-12-40mm-f28-pro': {
    name:'OM System M.Zuiko 12-40mm f/2.8 PRO II', manufacturer:'OM System', line:'PRO', type:'Zoom',
    mount:'mft', focalLength:null, focalLengthMin:12, focalLengthMax:40, focalLengthEquiv:'24-80mm',
    maxAperture:2.8, minAperture:22, weight:382, length:84, diameter:70,
    filterThread:62, minFocusDist:20, maxMagnification:0.3,
    elements:14, groups:9, blades:7, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2022, discontinued:false,
    imageUrl:'https://nala.explore.omsystem.com/media/catalog/product/1/2/12-40mm_f2.8_pro_ii-om_-_tech.webp',
    imageSource: { url:'https://explore.omsystem.com/us/en/m-zuiko-ed-12-40mm-f2-8-pro-ii', tier:'T1', note:'official OM System explore.omsystem.com product page; dimension diagram shows 84mm length / 69.9mm width / Ø62mm front diameter, matching the stored length:84 diameter:70', date:'2026-08-17' },
    asin:'B09RQPZC7V',
    prices:{USD:1199,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true,
    productUrl:'https://explore.omsystem.com/us/en/m-zuiko-ed-12-40mm-f2-8-pro-ii',
  },
  'omsystem-45mm-f12-pro': {
    name:'OM System M.Zuiko 45mm f/1.2 PRO', manufacturer:'OM System', line:'PRO', type:'Prime',
    mount:'mft', focalLength:45, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'90mm',
    maxAperture:1.2, minAperture:16, weight:410, length:84.9, diameter:70,
    filterThread:62, minFocusDist:50, maxMagnification:0.1,
    elements:14, groups:10, blades:9, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2017, discontinued:false,
    imageUrl:'https://nala.explore.omsystem.com/media/catalog/product/4/5/45mm_f1.2_pro-om_-_tech_1.webp',
    imageSource: { url:'https://explore.omsystem.com/us/en/m-zuiko-ed-45mm-f1-2-pro', tier:'T1', note:'official OM System explore.omsystem.com product page; dimension diagram shows 84.9mm length / 70mm width / Ø62mm front diameter, matching the stored length:84.9 diameter:70 exactly', date:'2026-08-17' },
    asin:'B0CHXWGF8C',
    prices:{USD:1599,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true,
    productUrl:'https://explore.omsystem.com/us/en/m-zuiko-ed-45mm-f1-2-pro',
  },
  'omsystem-17mm-f18': {
    name:'OM System M.Zuiko 17mm f/1.8 II', manufacturer:'OM System', line:'Premium', type:'Prime',
    mount:'mft', focalLength:17, focalLengthMin:null, focalLengthMax:null, focalLengthEquiv:'34mm',
    maxAperture:1.8, minAperture:22, weight:112, length:38, diameter:58,
    filterThread:46, minFocusDist:25, maxMagnification:0.08,
    elements:9, groups:6, blades:7, afType:'Stepping Motor',
    weatherSealed:true, ois:false, oisStops:null, year:2024, discontinued:false,
    imageUrl:'https://nala.explore.omsystem.com/media/catalog/product/1/7/17mm_f1.8_ii-om_-_tech.webp',
    imageSource: { url:'https://explore.omsystem.com/us/en/m-zuiko-17mm-f1-8-ii', tier:'T1', note:'official OM System explore.omsystem.com product page, same asset-naming convention as this brand\'s other OM System PRO/Premium entries', date:'2026-09-06' },
    asin:'B0DVHT413D',
    prices:{USD:649,AUD:null,EUR:null,GBP:null,JPY:null,CAD:null,SGD:null},
    priceIncomplete:true,
    productUrl:'https://explore.omsystem.com/us/en/m-zuiko-17mm-f1-8-ii',
  },
};

const LENS_DROPDOWN_GROUPS = [
  { label: '── M.Zuiko PRO ──', ids: ['omsystem-25mm-f12-pro', 'omsystem-12-40mm-f28-pro', 'omsystem-45mm-f12-pro'] },
  { label: '── M.Zuiko Premium ──', ids: ['omsystem-17mm-f18'] },
];

return { BRAND_CONFIG, SERIES_COLORS, CAMERAS, CAMERA_ORDER,
         DROPDOWN_GROUPS, LENSES, LENS_DROPDOWN_GROUPS, REGISTERED_BRANDS };
})();
