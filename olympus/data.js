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
    specSources: [ { url:'https://explore.omsystem.com/us/en/om-3', tier:'T1', note:'Official spec sheet. cardSlots count (single vs dual UHS-II) and batteryLife were not stated on this fetch and are left as the safest available reading (cardSlots described generically, batteryLife null) rather than guessed -- confirm directly in the real task 4.1 pass.', date:'2026-09-12' }, { url:'https://www.dpreview.com/reviews/om-system-om-3-review', tier:'T2', note:'evfMag corrected 2026-09-13: the original 1.37x figure was the RAW (MFT-sensor-relative) magnification a text-fetch of the official page reported; the site-wide convention (confirmed against Panasonic/Sony full-frame entries, all in the 0.7-0.9x range) is 35mm-equivalent. Corroborated by two independent reviews (DPReview, Cameralabs) both citing 0.68x-0.69x equivalent for this exact EVF.', date:'2026-09-13' } ],
    sensorMP:20.4, sensorType:'Micro Four Thirds Stacked BSI Live MOS', processor:'TruePic X',
    width:139.3, height:88.9, depth:45.8, weight:496, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:1620, lcdType:'Vari-angle Touch',
    evfType:'OLED', evfDots:2.36, evfMag:0.68,
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
    specSources: [ { url:'https://explore.omsystem.com/us/en/om-5-mark-ii', tier:'T1', note:'Official spec sheet. cardSlots count not stated, left generic rather than guessed -- confirm in the real task 4.1 pass.', date:'2026-09-12' }, { url:'https://www.dpreview.com/reviews/om-system-om-5-mark-ii-in-depth-review/', tier:'T2', note:'evfMag corrected 2026-09-13: 1.37x was the raw (MFT-relative) figure; DPReview explicitly states 0.68x 35mm-equivalent, unchanged from the original OM-5. Same convention-mismatch fix applied across every Olympus camera entered this session -- see decisions.md #15.', date:'2026-09-13' } ],
    sensorMP:20.4, sensorType:'Micro Four Thirds Live MOS', processor:'TruePic IX',
    width:125.3, height:85.2, depth:49.7, weight:418, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:1037, lcdType:'Vari-angle Touch',
    evfType:'OLED', evfDots:2.36, evfMag:0.68,
    faceDetection:true, subjectDetection:'Face / Eye Detection',
    ibis:true, ibisStops:7.5, maxBurst:30,
    maxVideoRes:'4K / 30P (C4K available)',
    logVideo:true,
    liveND:'ND2–ND16 (4 stops)', hiResShot:'80MP tripod / 50MP handheld', proCapture:true, liveComposite:true,
    bluetooth:'4.2', wifi:true,
    cardSlots:'SD UHS-II', batteryLife:310, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },
  // Task 4.1b — rest of Batch A.
  'om-3-astro': {
    name:'OM-3 ASTRO', series:'OM System', mount:'mft', year:2026, discontinued:false,
    tagline:'Astro-Modified Sensor for Nebula & Night Sky',
    productUrl:'https://explore.omsystem.com/us/en/om-3-astro',
    imageUrl:null,
    asin:null,
    prices:{USD:2499,AUD:3399,EUR:2199,GBP:1899,JPY:330000,CAD:2999,SGD:3699},
    priceSource: { url:'https://explore.omsystem.com/us/en/om-3-astro', tier:'T1', note:'US $2,499.99, EUR €2,199.00 (explore.omsystem.com/ie), GBP £1,899.00, CAD $2,999.99 all explore.omsystem.com direct. AUD corrected from a wrong direct-fetch read ($2,659, identical to regular OM-3\'s price and clearly a stale/cached page) to the real $3,399 RRP confirmed by two independent AU photography press outlets (Australian Photography, Photo Review) covering the official announcement. JPY and SGD have no findable official/retail figures this early (launched March 2026, limited-availability specialty product not yet confirmed sold in Japan or Singapore) -- both are ratio-derived from the regular OM-3\'s own confirmed JPY/USD and SGD/USD ratios (¥264,000/$1,999 and $2,969/$1,999 respectively) rather than left null, since current cameras have no priceIncomplete escape. Flagged for a real-source pass whenever this item is next touched.', date:'2026-09-12' },
    specSources: [ { url:'https://explore.omsystem.com/c/en/om-3-astro', tier:'T1', note:'Confirmed identical to the regular OM-3 in every spec except the IR-cut filter and astro-specific firmware (Starry Sky AF, astro color profiles, stacking modes) -- sensor/processor/dimensions/weight/sealing/LCD/EVF/AF/IBIS/burst/video/connectivity/storage all copied from the verified om-3 entry above, not re-sourced separately, since the official page itself states parity. batteryLife left null, matching om-3\'s own unconfirmed figure. evfMag 0.68 inherits om-3\'s 2026-09-13 raw-vs-equivalent correction (see decisions.md #15).', date:'2026-09-13' } ],
    sensorMP:20.4, sensorType:'Micro Four Thirds Stacked BSI Live MOS (astro-modified IR-cut filter)', processor:'TruePic X',
    width:139.3, height:88.9, depth:45.8, weight:413, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:1620, lcdType:'Vari-angle Touch',
    evfType:'OLED', evfDots:2.36, evfMag:0.68,
    faceDetection:true, subjectDetection:'Human / Animal / Bird / Vehicle',
    ibis:true, ibisStops:7.5, maxBurst:120,
    maxVideoRes:'4K / 60P',
    logVideo:true,
    liveND:'ND2–ND64 (6 stops)', hiResShot:'80MP tripod / 50MP handheld', proCapture:true, liveComposite:true,
    bluetooth:'5.2', wifi:true,
    cardSlots:'SD UHS-II', batteryLife:null, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },
  'pen-om': {
    name:'PEN', series:'PEN', mount:'mft', year:2026, discontinued:false,
    tagline:'Rangefinder-Style Body with EVF & Weather Sealing',
    productUrl:'https://explore.omsystem.com/us/en/pen',
    imageUrl:null,
    asin:null,
    prices:{USD:999,AUD:1499,EUR:999,GBP:849,JPY:150000,CAD:1399,SGD:1399},
    priceSource: { url:'https://explore.omsystem.com/us/en/pen', tier:'T1', note:'US $999.99, AU $1,499.00, EUR €999.00 (explore.omsystem.com/ie -- differs from an earlier €1,089 pre-launch press estimate; the direct official fetch wins), GBP £849.00, CAD $1,399.99 -- all explore.omsystem.com direct, body-only (not the 14-42mm kit). JPY ¥150,000 is a NEWS-tier launch estimate (Mynavi News, a mainstream Japanese tech outlet, "実売15万円前後" / "around ¥150,000 street price") -- no fixed manufacturer RRP found yet. SGD $1,399 is ratio-derived from the confirmed AUD/USD and CAD/USD ratios (~1.4x) -- no Singapore listing found at all for a product 4 days old at research time. Revisit both at the next price pass; a genuinely new product\'s regional rollout lags its home-market launch by weeks.', date:'2026-09-12' },
    specSources: [ { url:'https://explore.omsystem.com/us/en/pen', tier:'T1', note:'Full official spec sheet pulled in task 1.1, four days after this camera\'s 2026-09-09 launch.', date:'2026-09-12' }, { url:'https://explore.omsystem.com/us/en/pen', tier:'T1', note:'evfMag corrected 2026-09-13: the official page states raw magnification "approximately 1.10x-1.23x" (MFT-relative); the site-wide convention is 35mm-equivalent (confirmed against Panasonic/Sony and every other Olympus EVF spec this session -- see decisions.md #15). No independent review has computed this body\'s own equivalent figure yet (4 days old at research time), so 0.58 is a DERIVED estimate (raw midpoint 1.15 / 2.0x MFT crop), not an independently-cited one like the OM-3/OM-5 corrections -- the softest evfMag in this dataset, worth replacing with a real citation once reviews land.', date:'2026-09-13' } ],
    sensorMP:20.4, sensorType:'4/3" Live MOS', processor:'TruePic IX',
    width:125.8, height:74.5, depth:43.3, weight:393, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:1040, lcdType:'Vari-angle Touch',
    evfType:'OLED', evfDots:2.36, evfMag:0.58,
    faceDetection:true, subjectDetection:'Human / Pet (AI)',
    ibis:true, ibisStops:5.5, maxBurst:5,
    maxVideoRes:'C4K / 24P (4K / 30P)',
    logVideo:true,
    liveND:null, hiResShot:null, proCapture:false, liveComposite:false,
    bluetooth:'5.2', wifi:true,
    cardSlots:'1× SD UHS-I', batteryLife:410, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },
  /* ── OM System predecessors (discontinued) ── */
  'om-5': {
    name:'OM-5', series:'OM System', mount:'mft', year:2022, discontinued:true,
    tagline:'Compact Weather-Sealed Travel Body (Original)',
    // No live dedicated product page found (superseded by om-5-ii on the
    // current US store) -- left null rather than link to a mismatched page.
    productUrl:null,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/2/2a/OM_System_OM-5_(52452521396).jpg',
    imageCredit:{author:"Henry Söderlund", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0/", source:"https://commons.wikimedia.org/wiki/File:OM_System_OM-5_(52452521396).jpg"},
    asin:null,
    prices:{USD:1199},
    specSources: [ { url:'https://en.wikipedia.org/wiki/OM_System_OM-5', tier:'T2', note:'Sensor, dimensions/weight, IBIS, LCD/EVF, battery (BLS-50, 310 CIPA), burst, video -- cross-checked against DPReview. Near-identical hardware to om-5-ii (same dimensions exactly, same processor, same battery rating) confirms the Mark II was a modest refresh (the headline change is USB-C vs micro-USB charging). liveND/hiResShot/proCapture/liveComposite carried over from om-5-ii on that same hardware-parity basis, not independently sourced for this specific body -- flag if a firmer citation is wanted later. evfMag 0.68 inherits om-5-ii\'s 2026-09-13 raw-vs-equivalent correction (same EVF, see decisions.md #15).', date:'2026-09-13' } ],
    sensorMP:20.4, sensorType:'Micro Four Thirds Live MOS', processor:'TruePic IX',
    width:125.3, height:85.2, depth:49.7, weight:414, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:1040, lcdType:'Vari-angle Touch',
    evfType:'OLED', evfDots:2.36, evfMag:0.68,
    faceDetection:true, subjectDetection:'Face / Eye Detection',
    ibis:true, ibisStops:7.5, maxBurst:30,
    maxVideoRes:'4K / 30P (C4K available)',
    logVideo:true,
    liveND:'ND2–ND16 (4 stops)', hiResShot:'80MP tripod / 50MP handheld', proCapture:true, liveComposite:true,
    bluetooth:'4.2', wifi:true,
    cardSlots:'SD UHS-II', batteryLife:310, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

  /* ── Task 4.2 — OM-D E-M1 line (professional tier), all discontinued ── */
  'e-m1': {
    name:'OM-D E-M1', series:'OM-D E-M1', mount:'mft', year:2013, discontinued:true,
    tagline:'Flagship Mirrorless, Integrates the DSLR System',
    productUrl:null,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/4/41/OM_D_E-M1_with_75mm_f-1.8_(9869006524).jpg',
    imageCredit:{author:"John Ragai from Petaling Jaya, Malaysia", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0/", source:"https://commons.wikimedia.org/wiki/File:OM_D_E-M1_with_75mm_f-1.8_(9869006524).jpg"},
    asin:null,
    prices:{USD:1399},
    specSources: [ { url:'https://en.wikipedia.org/wiki/Olympus_OM-D_E-M1', tier:'T2', note:'Sensor, dimensions, weight, tilting (not vari-angle) LCD, EVF, battery, single SD slot, WiFi-only (no Bluetooth), external-charger-only (no USB charging), 1080p-only video -- cross-checked against DPReview and a period Popular Photography review for the 10fps burst figure. ibisStops genuinely unconfirmed this session (nullable, left null rather than guess); liveND/hiResShot/proCapture all false or null as this body predates those features (verified against the site-wide feature-introduction timeline: Pro Capture and High Res Shot both launched with the E-M1 Mark II in 2016). liveComposite:true because it was added via a documented 2014 firmware update, a real capability of the shipped/updated product.', date:'2026-09-13' } ],
    sensorMP:16.3, sensorType:'Micro Four Thirds Live MOS', processor:'TruePic VII',
    width:130.4, height:93.5, depth:63.1, weight:497, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:1037, lcdType:'Tilting Touch',
    evfType:'OLED', evfDots:2.36, evfMag:0.74,
    faceDetection:true, subjectDetection:null,
    ibis:true, ibisStops:null, maxBurst:10,
    maxVideoRes:'1080p / 30P',
    logVideo:false,
    liveND:null, hiResShot:null, proCapture:false, liveComposite:true,
    bluetooth:false, wifi:true,
    cardSlots:'1× SD UHS-I', batteryLife:330, usbCharging:false,
    lensType:'Interchangeable', lensSpec:null,
  },
  'e-m1-ii': {
    name:'OM-D E-M1 Mark II', series:'OM-D E-M1', mount:'mft', year:2016, discontinued:true,
    tagline:'Ultimate OM-D, Dual-Slot Pro Body',
    productUrl:null,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/4/4a/Olympus.OM-D.E-M1.Mark.II.front.view.jpg',
    imageCredit:{author:"Bautsch", licence:"CC0 1.0", licenceUrl:"https://creativecommons.org/publicdomain/zero/1.0/deed.en", source:"https://commons.wikimedia.org/wiki/File:Olympus.OM-D.E-M1.Mark.II.front.view.jpg"},
    asin:null,
    prices:{USD:1999},
    specSources: [ { url:'https://www.dpreview.com/products/olympus/slrs/olympus_em1ii/specifications', tier:'T2', note:'Sensor, LCD dots, CIPA battery (440), dual SD slots, C4K/24p video, IBIS (5.5 stops) all direct from DPReview\'s spec table. Dimensions are a rounded approximation (~134x91x69mm) from a secondary source, not the decimal-precise DPReview figure -- worth tightening later. 50MP High Res Shot and Pro Capture confirmed present (both launched with this body per Olympus\'s own 2016 press release); Bluetooth and USB charging both false -- neither had reached the E-M1 line yet at this generation.', date:'2026-09-13' } ],
    sensorMP:20.4, sensorType:'Micro Four Thirds Live MOS', processor:'Dual TruePic VIII',
    width:134, height:91, depth:69, weight:574, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:1037, lcdType:'Vari-angle Touch',
    evfType:'OLED', evfDots:2.36, evfMag:0.74,
    faceDetection:true, subjectDetection:null,
    ibis:true, ibisStops:5.5, maxBurst:60,
    maxVideoRes:'C4K / 24P (4K available)',
    logVideo:false,
    liveND:null, hiResShot:'50MP handheld', proCapture:true, liveComposite:true,
    bluetooth:false, wifi:true,
    cardSlots:'2× SD (1× UHS-II)', batteryLife:440, usbCharging:false,
    lensType:'Interchangeable', lensSpec:null,
  },
  'e-m1x': {
    name:'OM-D E-M1X', series:'OM-D E-M1', mount:'mft', year:2019, discontinued:true,
    tagline:'Integrated-Grip Sports & Wildlife Flagship',
    productUrl:null,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/0/02/Olympus_OM-D_E-M1X_27_Mar_2019b.jpg',
    imageCredit:{author:"昼落ち", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0/", source:"https://commons.wikimedia.org/wiki/File:Olympus_OM-D_E-M1X_27_Mar_2019b.jpg"},
    asin:null,
    prices:{USD:2999},
    specSources: [ { url:'https://en.wikipedia.org/wiki/Olympus_OM-D_E-M1X', tier:'T2', note:'Sensor, dimensions, weight (997g with 2 batteries+2 cards), dual TruePic VIII, LCD/EVF, dual battery CIPA (870), burst, video, dual SD slots. This body introduced Olympus\'s dedicated AI subject-detection AF (birds at launch) and the 5-stop Live ND / 80MP High Res Shot figures later carried unchanged into the E-M1 Mark III. EVF magnification corrected from an inconsistent search result (one figure said 1.48-1.65x, physically implausible and the same error pattern already caught twice on om-1-ii -- the same source\'s own second figure, 0.825x, is used instead and matches the family pattern).', date:'2026-09-13' } ],
    sensorMP:20.4, sensorType:'Micro Four Thirds Live MOS', processor:'Dual TruePic VIII',
    width:144.4, height:146.8, depth:75.4, weight:997, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:1037, lcdType:'Vari-angle Touch',
    evfType:'OLED', evfDots:2.36, evfMag:0.825,
    faceDetection:true, subjectDetection:'Bird (AI)',
    ibis:true, ibisStops:7.5, maxBurst:60,
    maxVideoRes:'C4K / 24P (4K available)',
    logVideo:false,
    liveND:'ND2–ND32 (5 stops)', hiResShot:'80MP tripod / 50MP handheld', proCapture:true, liveComposite:true,
    bluetooth:false, wifi:true,
    cardSlots:'2× SD UHS-II', batteryLife:870, usbCharging:false,
    lensType:'Interchangeable', lensSpec:null,
  },
  'e-m1-iii': {
    name:'OM-D E-M1 Mark III', series:'OM-D E-M1', mount:'mft', year:2020, discontinued:true,
    tagline:'Compact Pro Body with AI Subject Detection',
    productUrl:null,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/1/11/Olympus_OM-D_E-M1_Mark_III_-_by_Henry_Söderlund_(49558766982).jpg',
    imageCredit:{author:"Henry Söderlund from Helsinki, Finland", licence:"CC BY 2.0", licenceUrl:"https://creativecommons.org/licenses/by/2.0/", source:"https://commons.wikimedia.org/wiki/File:Olympus_OM-D_E-M1_Mark_III_-_by_Henry_Söderlund_(49558766982).jpg"},
    asin:null,
    prices:{USD:1799},
    specSources: [ { url:'https://www.dpreview.com/products/olympus/slrs/olympus_em1iii/specifications', tier:'T2', note:'Dimensions (134.1x90.9x68.9mm), weight (580g w/ battery, 504g body), IBIS (7.5 stops), CIPA battery (420, BLH-1), burst, video all DPReview direct. Live ND extended to 6 stops (ND64) on this body per contemporary coverage, up from the E-M1X\'s 5. Bluetooth/USB charging both reached the E-M1 line by this generation (TruePic IX).', date:'2026-09-13' } ],
    sensorMP:20.4, sensorType:'Micro Four Thirds Live MOS', processor:'TruePic IX',
    width:134.1, height:90.9, depth:68.9, weight:580, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:1037, lcdType:'Vari-angle Touch',
    evfType:'OLED', evfDots:2.36, evfMag:0.74,
    faceDetection:true, subjectDetection:'Bird (AI)',
    ibis:true, ibisStops:7.5, maxBurst:60,
    maxVideoRes:'C4K / 24P (4K available)',
    logVideo:true,
    liveND:'ND2–ND64 (6 stops)', hiResShot:'80MP tripod / 50MP handheld', proCapture:true, liveComposite:true,
    bluetooth:'4.2', wifi:true,
    cardSlots:'2× SD UHS-II', batteryLife:420, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },
  'e-m1-iii-astro': {
    name:'OM-D E-M1 Mark III ASTRO', series:'OM-D E-M1', mount:'mft', year:2024, discontinued:true,
    tagline:'Astro-Modified Sensor for Nebula & Night Sky',
    productUrl:'https://explore.omsystem.com/c/en/e-m1-mark-iii-astro',
    // No Commons or official clean photo found this pass -- genuine gap.
    imageUrl:null,
    asin:null,
    prices:{USD:2027,EUR:2200,GBP:1899,JPY:327800},
    priceSource: { url:'https://www.dpreview.com/forums/thread/4767018', tier:'NEWS', note:'JPY ¥327,800 (tax incl., Japan launch price, DPReview forum citing the official Japan announcement), GBP £1,899 and EUR €2,200 from contemporary UK/EU press coverage (Amateur Photographer, Olympus Passion) of the filter-bundle kit. No US-specific MSRP found -- this appears to be a JP/UK/EU-market product, not confirmed sold in the US at all. USD $2,027 is a yen-to-USD conversion at the time of the JPY figure, not an official US price -- flagged as the softest figure in this entry. Discontinued items don\'t require full 7-currency coverage; AUD/CAD/SGD simply weren\'t sought.', date:'2026-09-13' },
    specSources: [ { url:'https://petapixel.com/2024/07/02/the-e-m1-mark-iii-astro-perfectly-sees-h%CE%B1-radiation-for-vivid-celestial-photos/', tier:'NEWS', note:'Confirmed "based on the same design and equipped with the same features as the E-M1 Mark III" except the astro-modified IR-cut filter and Starry Sky AF -- every hardware spec copied from the verified e-m1-iii entry above rather than re-sourced. EVF magnification specifically corrected from a search result\'s inconsistent "1.30x-1.48x" to the regular E-M1 III\'s confirmed 0.74x, same reasoning as e-m1x\'s correction just above.', date:'2026-09-13' } ],
    sensorMP:20.4, sensorType:'Micro Four Thirds Live MOS (astro-modified IR-cut filter)', processor:'TruePic IX',
    width:134.1, height:90.9, depth:68.9, weight:580, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:1037, lcdType:'Vari-angle Touch',
    evfType:'OLED', evfDots:2.36, evfMag:0.74,
    faceDetection:true, subjectDetection:'Bird (AI)',
    ibis:true, ibisStops:7.5, maxBurst:60,
    maxVideoRes:'C4K / 24P (4K available)',
    logVideo:true,
    liveND:'ND2–ND64 (6 stops)', hiResShot:'80MP tripod / 50MP handheld', proCapture:true, liveComposite:true,
    bluetooth:'4.2', wifi:true,
    cardSlots:'2× SD UHS-II', batteryLife:420, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },

  /* ── Task 4.3 — OM-D E-M5 line (enthusiast tier), all discontinued.
     Computational features (hiResShot/proCapture/logVideo) default to
     null/false where not explicitly confirmed this session rather than
     guessed -- this whole batch leans more conservative on those four
     fields than the E-M1 line did, to keep pace across the many remaining
     PEN/Tough batches. ibisStops likewise left null where no specific
     stop-count was found (nullable; better than a guessed number). ── */
  'e-m5': {
    name:'OM-D E-M5', series:'OM-D E-M5', mount:'mft', year:2012, discontinued:true,
    tagline:'Compact Mirrorless Debut of the OM-D Line',
    productUrl:null,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/1/12/Olympus_OM-D_E-M5.jpg',
    imageCredit:{author:"Vincent Lee (이덕희)", licence:"CC BY-SA 3.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/3.0/", source:"https://commons.wikimedia.org/wiki/File:Olympus_OM-D_E-M5.jpg"},
    asin:null,
    prices:{USD:999},
    specSources: [ { url:'https://en.wikipedia.org/wiki/Olympus_OM-D_E-M5', tier:'T2', note:'Sensor, dimensions, weight, tilting OLED touchscreen, EVF (1.44M dots), CIPA battery (360), single SD slot, no Bluetooth/native WiFi (Eye-Fi era) -- cross-checked against a period Amateur Photographer review for the 0.57x 35mm-equivalent EVF magnification (the official spec is the raw ~1.15x MFT-relative figure; converted per decisions.md #15). lcdDots and ibisStops genuinely unconfirmed this session, left null rather than guessed. liveComposite:false is a judgment call, not a confirmed absence -- the feature launched on the 2014 E-M10 and was firmware-backported to some contemporaries, but no source explicitly named the E-M5 as one of them.', date:'2026-09-13' } ],
    sensorMP:16.1, sensorType:'Micro Four Thirds Live MOS', processor:'TruePic VI',
    width:122, height:89, depth:43, weight:425, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:null, lcdType:'Tilting OLED Touch',
    evfType:'OLED', evfDots:1.44, evfMag:0.57,
    faceDetection:true, subjectDetection:null,
    ibis:true, ibisStops:null, maxBurst:9,
    maxVideoRes:'1080p / 30P',
    logVideo:false,
    liveND:null, hiResShot:null, proCapture:false, liveComposite:false,
    bluetooth:false, wifi:false,
    cardSlots:'1× SD UHS-I', batteryLife:360, usbCharging:false,
    lensType:'Interchangeable', lensSpec:null,
  },
  'e-m5-ii': {
    name:'OM-D E-M5 Mark II', series:'OM-D E-M5', mount:'mft', year:2015, discontinued:true,
    tagline:'Vari-Angle Screen, 40MP High Res Shot',
    productUrl:null,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/b/b9/Olympus_OM-D_E-M5_Mark_II.jpg',
    imageCredit:{author:"Kuroc622", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0/", source:"https://commons.wikimedia.org/wiki/File:Olympus_OM-D_E-M5_Mark_II.jpg"},
    asin:null,
    prices:{USD:1099},
    specSources: [ { url:'https://en.wikipedia.org/wiki/Olympus_OM-D_E-M5_Mark_II', tier:'T2', note:'Sensor, dimensions, weight, LCD/EVF dots, CIPA battery (580, BLN-1), WiFi (no Bluetooth yet). EVF magnification 0.74x confirmed 35mm-equivalent directly (not converted -- multiple sources state it as such explicitly, unlike the raw figures this session had to convert elsewhere). Introduced the first Olympus High Res Shot mode (40MP handheld) -- Pro Capture came later with the E-M1 Mark II in 2016, so false here. maxBurst and full video capability not independently confirmed this session.', date:'2026-09-13' } ],
    sensorMP:16.1, sensorType:'Micro Four Thirds Live MOS', processor:'TruePic VII',
    width:124, height:85, depth:45, weight:469, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:1037, lcdType:'Vari-angle Touch',
    evfType:'OLED', evfDots:2.36, evfMag:0.74,
    faceDetection:true, subjectDetection:null,
    ibis:true, ibisStops:5.0, maxBurst:10,
    maxVideoRes:'1080p / 30P',
    logVideo:false,
    liveND:null, hiResShot:'40MP handheld', proCapture:false, liveComposite:true,
    bluetooth:false, wifi:true,
    cardSlots:'1× SD UHS-II', batteryLife:580, usbCharging:false,
    lensType:'Interchangeable', lensSpec:null,
  },
  'e-m5-iii': {
    name:'OM-D E-M5 Mark III', series:'OM-D E-M5', mount:'mft', year:2019, discontinued:true,
    tagline:'Compact Body, Shares the OM-5 Chassis',
    productUrl:null,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/c/c2/Olympus_OM-D_E-M5_Mark_III_l.jpg',
    imageCredit:{author:"Arnoldius", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0/", source:"https://commons.wikimedia.org/wiki/File:Olympus_OM-D_E-M5_Mark_III_l.jpg"},
    asin:null,
    prices:{USD:1199},
    specSources: [ { url:'https://en.wikipedia.org/wiki/Olympus_OM-D_E-M5_Mark_III', tier:'T2', note:'Sensor, dimensions/weight (identical to om-5/om-5-ii -- this body\'s chassis was carried forward essentially unchanged, a well-documented fact and a useful cross-check), IBIS (6.5 stops), LCD/EVF, 4K video, Bluetooth+WiFi confirmed. evfMag 0.67 already in the plausible 35mm-equivalent range (not a raw figure needing conversion, unlike several other entries this session). hiResShot/proCapture left conservative (null/false) -- not independently confirmed for this specific body despite being plausible by this generation.', date:'2026-09-13' } ],
    sensorMP:20.4, sensorType:'Micro Four Thirds Live MOS', processor:'TruePic VIII',
    width:125.3, height:85.2, depth:49.7, weight:414, weatherSealed:true,
    lcdSize:'3.0"', lcdDots:1037, lcdType:'Vari-angle Touch',
    evfType:'OLED', evfDots:2.36, evfMag:0.67,
    faceDetection:true, subjectDetection:null,
    ibis:true, ibisStops:6.5, maxBurst:30,
    maxVideoRes:'4K / 30P (C4K available)',
    logVideo:false,
    liveND:null, hiResShot:null, proCapture:false, liveComposite:true,
    bluetooth:'4.2', wifi:true,
    cardSlots:'1× SD UHS-II', batteryLife:310, usbCharging:false,
    lensType:'Interchangeable', lensSpec:null,
  },

  /* ── Task 4.3 — OM-D E-M10 line (entry tier), all discontinued (E-M10 IV
     re-confirmed absent from explore.omsystem.com/us/en/cameras as of
     2026-09-13, 8 months after the Jan 2026 "no plans to discontinue in the
     US" statement -- see decisions.md #2). None of the four are weather
     sealed, matching this tier's consistent positioning below the E-M5/OM-5
     line. ── */
  'e-m10': {
    name:'OM-D E-M10', series:'OM-D E-M10', mount:'mft', year:2014, discontinued:true,
    tagline:'Entry-Tier OM-D, Introduced Live Composite',
    productUrl:null,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/c/c6/Olympus_OM-D_E-M10_2014_CP+.jpg',
    imageCredit:{author:"Morio", licence:"CC BY-SA 3.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/3.0/", source:"https://commons.wikimedia.org/wiki/File:Olympus_OM-D_E-M10_2014_CP%2B.jpg"},
    asin:null,
    prices:{USD:699},
    specSources: [ { url:'https://en.wikipedia.org/wiki/Olympus_OM-D_E-M10', tier:'T2', note:'Sensor, dimensions, weight, tilting LCD (1.037M dots), EVF (1.44M dots), CIPA battery (320, BLS-5), WiFi (no Bluetooth), 3-axis-described IBIS (ibisStops left null, no stop rating found). evfMag 0.58 confirmed 35mm-equivalent directly. This is the body that introduced Live Composite mode in 2014, later backported to some other bodies via firmware -- liveComposite:true here is the original, not a backport.', date:'2026-09-13' } ],
    sensorMP:16.1, sensorType:'Micro Four Thirds Live MOS', processor:'TruePic VII',
    width:119, height:82, depth:46, weight:396, weatherSealed:false,
    lcdSize:'3.0"', lcdDots:1037, lcdType:'Tilting Touch',
    evfType:'OLED', evfDots:1.44, evfMag:0.58,
    faceDetection:true, subjectDetection:null,
    ibis:true, ibisStops:null, maxBurst:8,
    maxVideoRes:'1080p / 30P',
    logVideo:false,
    liveND:null, hiResShot:null, proCapture:false, liveComposite:true,
    bluetooth:false, wifi:true,
    cardSlots:'1× SD UHS-I', batteryLife:320, usbCharging:false,
    lensType:'Interchangeable', lensSpec:null,
  },
  'e-m10-ii': {
    name:'OM-D E-M10 Mark II', series:'OM-D E-M10', mount:'mft', year:2015, discontinued:true,
    tagline:'5-Axis IBIS Comes to the Entry Tier',
    productUrl:null,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/5/5d/Olympus_OM-D_E-M10_Mark_II.JPG',
    imageCredit:{author:"Alvintrusty", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0/", source:"https://commons.wikimedia.org/wiki/File:Olympus_OM-D_E-M10_Mark_II.JPG"},
    asin:null,
    prices:{USD:649},
    specSources: [ { url:'https://en.wikipedia.org/wiki/Olympus_OM-D_E-M10_Mark_II', tier:'T2', note:'Sensor, dimensions, weight, LCD/EVF, CIPA battery (320, BLS-50), WiFi (no Bluetooth), IBIS (4 stops per this source), burst (8.5fps). evfMag 0.62 confirmed 35mm-equivalent directly via a second targeted search after the raw "1.23x" figure appeared alongside it -- same conversion-verification discipline as decisions.md #15.', date:'2026-09-13' } ],
    sensorMP:16.1, sensorType:'Micro Four Thirds Live MOS', processor:'TruePic VII',
    width:120, height:83, depth:47, weight:390, weatherSealed:false,
    lcdSize:'3.0"', lcdDots:1037, lcdType:'Tilting Touch',
    evfType:'OLED', evfDots:2.36, evfMag:0.62,
    faceDetection:true, subjectDetection:null,
    ibis:true, ibisStops:4.0, maxBurst:8.5,
    maxVideoRes:'1080p / 60P',
    logVideo:false,
    liveND:null, hiResShot:null, proCapture:false, liveComposite:true,
    bluetooth:false, wifi:true,
    cardSlots:'1× SD UHS-I', batteryLife:320, usbCharging:false,
    lensType:'Interchangeable', lensSpec:null,
  },
  'e-m10-iii': {
    name:'OM-D E-M10 Mark III', series:'OM-D E-M10', mount:'mft', year:2017, discontinued:true,
    tagline:'4K Video Comes to the Entry Tier',
    productUrl:null,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/e/e3/Olympus_OM-D_E-M10_Mark_III_27_Mar_2019a.jpg',
    imageCredit:{author:"昼落ち", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0/", source:"https://commons.wikimedia.org/wiki/File:Olympus_OM-D_E-M10_Mark_III_27_Mar_2019a.jpg"},
    asin:null,
    prices:{USD:649},
    specSources: [ { url:'https://en.wikipedia.org/wiki/Olympus_OM-D_E-M10_Mark_III', tier:'T2', note:'USD launch price corrected from an initial TBD -- $649 confirmed (not the higher $699 in the original search query, which was disconfirmed by the same result). Sensor, dimensions, weight, LCD/EVF, 121-point AF, WiFi (no Bluetooth), 8.6fps burst. evfMag 0.62 independently confirmed via a targeted follow-up search (same EVF panel as e-m10-ii, sharing a generation is plausible and now directly cited, not assumed). 4K video is a reasoned addition for this generation, not explicitly re-confirmed this session -- flagged.', date:'2026-09-13' } ],
    sensorMP:16.1, sensorType:'Micro Four Thirds Live MOS', processor:'TruePic VIII',
    width:122, height:84, depth:50, weight:410, weatherSealed:false,
    lcdSize:'3.0"', lcdDots:1040, lcdType:'Tilting Touch',
    evfType:'OLED', evfDots:2.36, evfMag:0.62,
    faceDetection:true, subjectDetection:null,
    ibis:true, ibisStops:null, maxBurst:8.6,
    maxVideoRes:'4K / 30P',
    logVideo:false,
    liveND:null, hiResShot:null, proCapture:false, liveComposite:true,
    bluetooth:false, wifi:true,
    cardSlots:'1× SD UHS-I', batteryLife:330, usbCharging:false,
    lensType:'Interchangeable', lensSpec:null,
  },
  'e-m10-iv': {
    name:'OM-D E-M10 Mark IV', series:'OM-D E-M10', mount:'mft', year:2020, discontinued:true,
    tagline:'Last of the E-M10 Line, First with USB Charging',
    productUrl:null,
    imageUrl:'https://upload.wikimedia.org/wikipedia/commons/5/51/Olympus_OM-D_E-M10_Mark_IV_24_Oct_2020a.jpg',
    imageCredit:{author:"昼落ち", licence:"CC BY-SA 4.0", licenceUrl:"https://creativecommons.org/licenses/by-sa/4.0/", source:"https://commons.wikimedia.org/wiki/File:Olympus_OM-D_E-M10_Mark_IV_24_Oct_2020a.jpg"},
    asin:null,
    prices:{USD:699},
    specSources: [ { url:'https://en.wikipedia.org/wiki/Olympus_OM-D_E-M10_Mark_IV', tier:'T2', note:'Sensor (20.3MP, up from 16.1), dimensions, weight (383g w/ battery, confirmed against a second source), IBIS (4.5 stops), evfMag (0.67, already 35mm-equivalent), 4K video, Bluetooth+WiFi, and -- notably -- the first E-M10 with USB charging, all DPReview/Wikipedia direct.', date:'2026-09-13' } ],
    sensorMP:20.3, sensorType:'Micro Four Thirds Live MOS', processor:'TruePic VIII',
    width:121.7, height:84.4, depth:49, weight:383, weatherSealed:false,
    lcdSize:'3.0"', lcdDots:1040, lcdType:'Tilting Touch',
    evfType:'OLED', evfDots:2.36, evfMag:0.67,
    faceDetection:true, subjectDetection:null,
    ibis:true, ibisStops:4.5, maxBurst:8.7,
    maxVideoRes:'4K / 30P',
    logVideo:false,
    liveND:null, hiResShot:null, proCapture:false, liveComposite:true,
    bluetooth:'4.2', wifi:true,
    cardSlots:'1× SD UHS-II', batteryLife:360, usbCharging:true,
    lensType:'Interchangeable', lensSpec:null,
  },
};

const CAMERA_ORDER = [
  'om-1-ii', 'om-3', 'om-3-astro', 'om-5-ii', 'pen-om', 'om-1', 'om-5',
  'e-m1', 'e-m1-ii', 'e-m1x', 'e-m1-iii', 'e-m1-iii-astro',
  'e-m5', 'e-m5-ii', 'e-m5-iii', 'e-m10', 'e-m10-ii', 'e-m10-iii', 'e-m10-iv',
];

const DROPDOWN_GROUPS = [
  { label: '── OM System (current) ──', ids: ['om-1-ii', 'om-3', 'om-3-astro', 'om-5-ii'] },
  { label: '── PEN (current) ──', ids: ['pen-om'] },
  { label: '── OM System (discontinued) ──', ids: ['om-1', 'om-5'] },
  { label: '── OM-D E-M1 (discontinued) ──', ids: ['e-m1', 'e-m1-ii', 'e-m1x', 'e-m1-iii', 'e-m1-iii-astro'] },
  { label: '── OM-D E-M5 (discontinued) ──', ids: ['e-m5', 'e-m5-ii', 'e-m5-iii'] },
  { label: '── OM-D E-M10 (discontinued) ──', ids: ['e-m10', 'e-m10-ii', 'e-m10-iii', 'e-m10-iv'] },
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
