// ─────────────────────────────────────────────
// FIELD SCHEMAS for camera & lens data objects.
//
// Each validator returns an array of human-readable problem strings
// (empty array = valid). Tests assert the array is empty.
// ─────────────────────────────────────────────

const HTTPS_URL = /^https:\/\/[^\s]+$/;
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

/** Validate one field of `obj` against a spec. Returns string[] of problems. */
function checkField(obj, key, spec) {
  const { type, required = true, nullable = false, min, max, oneOf } = spec;
  const has = Object.prototype.hasOwnProperty.call(obj, key);
  if (!has) return required ? [`missing "${key}"`] : [];

  const v = obj[key];
  if (v === null || v === undefined) {
    return nullable ? [] : [`"${key}" is ${v} (not nullable)`];
  }

  const errs = [];
  switch (type) {
    case 'number':
      if (typeof v !== 'number' || Number.isNaN(v)) {
        errs.push(`"${key}" should be a number, got ${JSON.stringify(v)}`);
      } else {
        if (min != null && v < min) errs.push(`"${key}" = ${v} below min ${min}`);
        if (max != null && v > max) errs.push(`"${key}" = ${v} above max ${max}`);
      }
      break;
    case 'string':
      if (typeof v !== 'string') errs.push(`"${key}" should be a string, got ${JSON.stringify(v)}`);
      else if (required && v.trim() === '') errs.push(`"${key}" is empty`);
      break;
    case 'boolean':
      if (typeof v !== 'boolean') errs.push(`"${key}" should be a boolean, got ${JSON.stringify(v)}`);
      break;
    case 'url':
      if (typeof v !== 'string' || !HTTPS_URL.test(v)) errs.push(`"${key}" is not a valid https URL: ${JSON.stringify(v)}`);
      break;
    case 'object':
      if (typeof v !== 'object' || Array.isArray(v)) errs.push(`"${key}" should be an object`);
      break;
    default:
      errs.push(`"${key}" has unknown schema type "${type}"`);
  }
  if (oneOf && !oneOf.includes(v)) errs.push(`"${key}" = ${JSON.stringify(v)} not one of ${JSON.stringify(oneOf)}`);
  return errs;
}

const CURRENCIES = ['USD', 'AUD', 'EUR', 'GBP', 'JPY', 'CAD', 'SGD'];

/**
 * Validate a `prices` object.
 * A `null` currency value is allowed — it means "unavailable" (e.g. a
 * discontinued body, or a lens with no regional pricing). `requireAll`
 * (current cameras) additionally requires every currency to be non-null.
 */
function checkPrices(obj, { requireAll = false } = {}) {
  const errs = [];
  const p = obj.prices;
  if (typeof p !== 'object' || p === null) return ['"prices" missing or not an object'];
  if (typeof p.USD !== 'number' || p.USD <= 0) errs.push('"prices.USD" must be a positive number');
  for (const cur of CURRENCIES) {
    const present = Object.prototype.hasOwnProperty.call(p, cur);
    if (!present) {
      if (requireAll) errs.push(`"prices.${cur}" missing (required for current items)`);
      continue;
    }
    const val = p[cur];
    if (val === null) {
      if (requireAll) errs.push(`"prices.${cur}" is null (required for current items)`);
      continue; // null = unavailable, allowed for discontinued / region-gapped items
    }
    if (typeof val !== 'number' || val <= 0) errs.push(`"prices.${cur}" must be a positive number or null`);
  }
  for (const cur of Object.keys(p)) {
    if (!CURRENCIES.includes(cur)) errs.push(`"prices.${cur}" is not a recognised currency`);
  }
  return errs;
}

const ASIN_RE = /^[A-Z0-9]{10}$/;

/**
 * Validate an optional `asin` (Amazon Standard Identification Number).
 * Absent/null = "no product link yet" (engine falls back to a search URL).
 * When present it must be a 10-char uppercase alphanumeric ASIN.
 */
function checkAsin(obj) {
  if (!Object.prototype.hasOwnProperty.call(obj, 'asin') || obj.asin == null) return [];
  if (typeof obj.asin !== 'string' || !ASIN_RE.test(obj.asin)) {
    return [`"asin" must be a 10-char ASIN (A-Z0-9), got ${JSON.stringify(obj.asin)}`];
  }
  return [];
}

/**
 * Validate `imageCredit` — the attribution that makes a Wikimedia Commons image
 * lawful to display.
 *
 * Almost every Commons photo in this dataset is CC BY or CC BY-SA, which permit
 * commercial use *only* with credit. Storing the URL without the credit leaves
 * the site out of compliance, and the metadata is painful to recover later once
 * nobody remembers which file a thumbnail came from — so any
 * upload.wikimedia.org image MUST carry a complete credit. Images hotlinked from
 * manufacturer/retailer hosts are a different arrangement (publicity shots
 * depicting the product they advertise) and are out of scope here.
 *
 * Populated by scripts/fetch-image-credits.js; rendered on about.html by
 * scripts/generate-seo.js.
 */
function checkImageCredit(obj) {
  const url = obj.imageUrl;
  const c = obj.imageCredit;
  const fromCommons = typeof url === 'string' && url.startsWith('https://upload.wikimedia.org/');

  if (!fromCommons) {
    if (c != null) return ['"imageCredit" set but "imageUrl" is not a Wikimedia Commons image'];
    return [];
  }
  if (c == null) return ['Wikimedia Commons "imageUrl" requires an "imageCredit" (run scripts/fetch-image-credits.js)'];
  if (typeof c !== 'object' || Array.isArray(c)) return ['"imageCredit" should be an object'];

  const errs = [];
  const FIELDS = ['author', 'licence', 'licenceUrl', 'source'];
  for (const k of FIELDS) {
    const v = c[k];
    // `author` may legitimately be null on CC0 / public-domain files.
    if (v === null && k === 'author') continue;
    if (typeof v !== 'string' || v.trim() === '') errs.push(`"imageCredit.${k}" missing or empty`);
  }
  if (typeof c.source === 'string' && !c.source.startsWith('https://commons.wikimedia.org/wiki/')) {
    errs.push('"imageCredit.source" should link to the Commons file page');
  }
  if (typeof c.licence === 'string' && /\b(NC|ND|NonCommercial|NoDerivatives|fair use|non-free)\b/i.test(c.licence)) {
    errs.push(`"imageCredit.licence" = ${JSON.stringify(c.licence)} is not a free licence`);
  }
  for (const k of Object.keys(c)) {
    if (!FIELDS.includes(k)) errs.push(`"imageCredit.${k}" is not a recognised field`);
  }
  return errs;
}

const SOURCE_TIERS = ['T1', 'T2', 'T3', 'T4', 'NEWS'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validate a single `{url, tier, note, date}` citation object shared by both
 * `specSources` entries and `priceSource`. `tier` follows the refresh-camera-data
 * skill's own reliability classes: T1 maker's own site (incl. official regional
 * sites), T2 independent review/measurement, T3 retailer (price/availability
 * only), T4 aggregator (tables only), NEWS dated announcement (year only).
 */
function checkCitation(c, label) {
  if (typeof c !== 'object' || c === null || Array.isArray(c)) return [`"${label}" should be an object`];
  const errs = [];
  if (typeof c.url !== 'string' || !/^https:\/\//.test(c.url)) errs.push(`"${label}.url" must be an https URL`);
  if (!SOURCE_TIERS.includes(c.tier)) errs.push(`"${label}.tier" must be one of ${SOURCE_TIERS.join('/')}, got ${JSON.stringify(c.tier)}`);
  if (c.note != null && (typeof c.note !== 'string' || c.note.trim() === '')) errs.push(`"${label}.note" must be a non-empty string when present`);
  if (c.date != null && (typeof c.date !== 'string' || !DATE_RE.test(c.date))) errs.push(`"${label}.date" must be YYYY-MM-DD when present`);
  const FIELDS = ['url', 'tier', 'note', 'date'];
  for (const k of Object.keys(c)) if (!FIELDS.includes(k)) errs.push(`"${label}.${k}" is not a recognised field`);
  return errs;
}

/**
 * Validate the optional `specSources` (array of citations covering the
 * weight/dimensions/optical-formula/status block) and `priceSource` (single
 * citation for the current price) fields. Both are optional and retrofitted
 * only where a refresh actually recorded where a fact came from — absence
 * does not mean the data is wrong, just that no durable citation was kept
 * for it (pre-dates this convention, added 2026-08-15).
 */
function checkSources(obj) {
  const errs = [];
  if (obj.specSources != null) {
    if (!Array.isArray(obj.specSources)) errs.push('"specSources" should be an array');
    else obj.specSources.forEach((c, i) => errs.push(...checkCitation(c, `specSources[${i}]`)));
  }
  if (obj.priceSource != null) errs.push(...checkCitation(obj.priceSource, 'priceSource'));
  return errs;
}

// ── CAMERA ──────────────────────────────────
function validateCamera(id, cam, brandSections = []) {
  const e = [];
  const add = (arr) => arr.forEach(m => e.push(m));

  add(checkField(cam, 'name', { type: 'string' }));
  add(checkField(cam, 'series', { type: 'string' }));
  add(checkField(cam, 'tagline', { type: 'string' }));
  add(checkField(cam, 'year', { type: 'number', min: 2010, max: 2027 }));
  add(checkField(cam, 'discontinued', { type: 'boolean' }));

  add(checkField(cam, 'sensorMP', { type: 'number', min: 1, max: 200 }));
  add(checkField(cam, 'sensorType', { type: 'string' }));
  add(checkField(cam, 'processor', { type: 'string' }));

  add(checkField(cam, 'width', { type: 'number', min: 1, max: 300 }));
  add(checkField(cam, 'height', { type: 'number', min: 1, max: 300 }));
  add(checkField(cam, 'depth', { type: 'number', min: 1, max: 300 }));
  add(checkField(cam, 'weight', { type: 'number', min: 1, max: 3000 }));
  add(checkField(cam, 'weatherSealed', { type: 'boolean' }));

  add(checkField(cam, 'lcdSize', { type: 'string' }));
  add(checkField(cam, 'lcdDots', { type: 'number', nullable: true, min: 1 }));
  add(checkField(cam, 'lcdType', { type: 'string' }));
  add(checkField(cam, 'evfType', { type: 'string', nullable: true }));
  add(checkField(cam, 'evfDots', { type: 'number', nullable: true, min: 0 }));
  add(checkField(cam, 'evfMag', { type: 'number', nullable: true, min: 0 }));

  add(checkField(cam, 'faceDetection', { type: 'boolean' }));
  add(checkField(cam, 'subjectDetection', { type: 'string', nullable: true }));
  add(checkField(cam, 'maxBurst', { type: 'number', min: 0 }));

  add(checkField(cam, 'ibis', { type: 'boolean' }));
  add(checkField(cam, 'ibisStops', { type: 'number', nullable: true, min: 0 }));

  add(checkField(cam, 'maxVideoRes', { type: 'string' }));
  add(checkField(cam, 'logVideo', { type: 'boolean' }));

  // bluetooth: a version string, or `false`/null meaning "none".
  if (!(typeof cam.bluetooth === 'string' || cam.bluetooth === false || cam.bluetooth == null)) {
    e.push(`"bluetooth" = ${JSON.stringify(cam.bluetooth)} should be a version string, false, or null`);
  }
  add(checkField(cam, 'wifi', { type: 'boolean' }));
  add(checkField(cam, 'cardSlots', { type: 'string' }));
  add(checkField(cam, 'batteryLife', { type: 'number', nullable: true, min: 0 }));
  add(checkField(cam, 'usbCharging', { type: 'boolean' }));
  add(checkField(cam, 'lensType', { type: 'string' }));

  // Links: optional (absent == null == "none"); when present must be https.
  // (buyUrl is no longer stored — buy links are generated per-currency by
  // the engine's amazonBuyUrl() from `asin`; see tests/logic/buy-links.test.js.)
  add(checkField(cam, 'productUrl', { type: 'url', nullable: true, required: false }));
  add(checkField(cam, 'imageUrl', { type: 'url', nullable: true, required: false }));
  add(checkImageCredit(cam));
  add(checkAsin(cam));
  add(checkSources(cam));

  // Prices: USD required & positive; other currencies may be null
  // (the UI falls back to the USD launch price for those).
  add(checkPrices(cam));

  // Brand-specific fields.
  if (brandSections.includes('fujifilm')) {
    add(checkField(cam, 'filmSims', { type: 'number', min: 0 }));
    if (![true, false, 'firmware'].includes(cam.xApp)) {
      e.push(`"xApp" = ${JSON.stringify(cam.xApp)} not one of [true, false, "firmware"]`);
    }
  }
  if (brandSections.includes('canon')) {
    add(checkField(cam, 'dpafPoints', { type: 'number', nullable: true, min: 0 }));
    add(checkField(cam, 'clogTiers', { type: 'string', nullable: true }));
  }
  if (brandSections.includes('sony')) {
    add(checkField(cam, 'logProfile', { type: 'string', nullable: true }));
    add(checkField(cam, 'aiAf', { type: 'boolean' }));
    add(checkField(cam, 'realtimeTracking', { type: 'boolean' }));
  }
  if (brandSections.includes('nikon')) {
    add(checkField(cam, 'expeed', { type: 'string', nullable: true }));
    add(checkField(cam, 'nRaw', { type: 'string', nullable: true }));
    add(checkField(cam, 'pixelShift', { type: 'string', nullable: true }));
    add(checkField(cam, 'preCapture', { type: 'boolean' }));
  }
  if (brandSections.includes('panasonic')) {
    add(checkField(cam, 'vLog', { type: 'string', nullable: true }));
    add(checkField(cam, 'openGate', { type: 'string', nullable: true }));
    add(checkField(cam, 'dualNativeIso', { type: 'boolean' }));
    add(checkField(cam, 'proResInternal', { type: 'boolean' }));
  }

  return e.map(m => `${id}: ${m}`);
}

// ── LENS ────────────────────────────────────
function validateLens(id, lens) {
  const e = [];
  const add = (arr) => arr.forEach(m => e.push(m));

  add(checkField(lens, 'name', { type: 'string' }));
  add(checkField(lens, 'manufacturer', { type: 'string' }));
  add(checkField(lens, 'line', { type: 'string' }));
  add(checkField(lens, 'type', { type: 'string', oneOf: ['Prime', 'Zoom'] }));
  add(checkField(lens, 'focalLengthEquiv', { type: 'string' }));

  if (lens.type === 'Prime') {
    add(checkField(lens, 'focalLength', { type: 'number', min: 1, max: 2000 }));
  } else if (lens.type === 'Zoom') {
    add(checkField(lens, 'focalLengthMin', { type: 'number', min: 1, max: 2000 }));
    add(checkField(lens, 'focalLengthMax', { type: 'number', min: 1, max: 2000 }));
    if (typeof lens.focalLengthMin === 'number' && typeof lens.focalLengthMax === 'number'
        && lens.focalLengthMin >= lens.focalLengthMax) {
      e.push(`focalLengthMin (${lens.focalLengthMin}) must be < focalLengthMax (${lens.focalLengthMax})`);
    }
  }

  add(checkField(lens, 'maxAperture', { type: 'number', min: 0.7, max: 45 }));
  add(checkField(lens, 'minAperture', { type: 'number', min: 1, max: 99 }));
  add(checkField(lens, 'elements', { type: 'number', nullable: true, min: 1 }));
  add(checkField(lens, 'groups', { type: 'number', nullable: true, min: 1 }));
  add(checkField(lens, 'blades', { type: 'number', nullable: true, min: 1, max: 20 }));

  add(checkField(lens, 'minFocusDist', { type: 'number', min: 0 }));
  add(checkField(lens, 'maxMagnification', { type: 'number', nullable: true, min: 0 }));
  add(checkField(lens, 'afType', { type: 'string' }));
  add(checkField(lens, 'weatherSealed', { type: 'boolean' }));
  add(checkField(lens, 'ois', { type: 'boolean' }));
  add(checkField(lens, 'oisStops', { type: 'number', nullable: true, min: 0 }));

  add(checkField(lens, 'weight', { type: 'number', min: 1, max: 5000 }));
  add(checkField(lens, 'length', { type: 'number', min: 1, max: 600 }));
  add(checkField(lens, 'diameter', { type: 'number', min: 1, max: 300 }));
  add(checkField(lens, 'filterThread', { type: 'number', nullable: true, min: 1 }));

  // Floor is 2008, when Micro Four Thirds launched — the earliest mount any
  // brand here covers. Panasonic's LUMIX G Vario 7-14mm F4 (2009) sits below
  // the 2010 bound this used to carry; the bound is only a typo guard.
  add(checkField(lens, 'year', { type: 'number', min: 2008, max: 2027 }));
  add(checkField(lens, 'discontinued', { type: 'boolean' }));

  add(checkField(lens, 'productUrl', { type: 'url', nullable: true, required: false }));
  add(checkField(lens, 'imageUrl', { type: 'url', nullable: true, required: false }));
  add(checkImageCredit(lens));
  add(checkAsin(lens));
  add(checkSources(lens));

  add(checkPrices(lens));

  return e.map(m => `${id}: ${m}`);
}

module.exports = {
  validateCamera, validateLens, checkField, checkPrices, checkAsin,
  CURRENCIES, HTTPS_URL, HEX_COLOR,
};
