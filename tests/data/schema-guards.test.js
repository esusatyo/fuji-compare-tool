// Tier 1 — Negative coverage for the schema helper itself.
//
// Every other data test asserts real data *passes* validation. Nothing asserted
// that the validators ever *reject* anything, so a broken guard — or a widened
// bound — was invisible to the suite. These tests pin the guards from the other
// side: each case mutates a known-good fixture and asserts the specific problem
// is reported.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand } = require('../helpers/load-brand');
const { validateCamera, validateLens } = require('../helpers/schema');

// Real entries as fixtures, so "valid" means valid against shipped data rather
// than against a hand-written object that drifts from the schema.
const { data } = loadBrand('fujifilm');
const GOOD_CAMERA = Object.entries(data.CAMERAS)[0];
const GOOD_LENS = Object.entries(data.LENSES).find(([, l]) => l.type === 'Zoom');
const GOOD_PRIME = Object.entries(data.LENSES).find(([, l]) => l.type === 'Prime');

const camera = (patch) => ({ ...GOOD_CAMERA[1], ...patch });
const lens = (patch) => ({ ...GOOD_LENS[1], ...patch });
const prime = (patch) => ({ ...GOOD_PRIME[1], ...patch });

const without = (obj, key) => {
  const copy = { ...obj };
  delete copy[key];
  return copy;
};

/** Assert at least one reported problem mentions `needle`. */
const reports = (problems, needle) =>
  assert.ok(
    problems.some(p => p.includes(needle)),
    `expected a problem mentioning ${JSON.stringify(needle)}, got:\n${problems.join('\n') || '(none)'}`,
  );

// ── Baseline: the fixtures really are valid ──────────────────────────
// Without this, every test below could pass by rejecting everything.

test('a known-good camera fixture reports no problems', () => {
  const problems = validateCamera('fixture', GOOD_CAMERA[1], []);
  assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
});

test('known-good lens fixtures report no problems', () => {
  assert.deepEqual(validateLens('fixture-zoom', GOOD_LENS[1]), []);
  assert.deepEqual(validateLens('fixture-prime', GOOD_PRIME[1]), []);
});

// ── Camera year bounds ───────────────────────────────────────────────
// The floor moved 2010 → 2008 to admit Sigma's DP compacts. These pin both
// ends so a future widening is a deliberate edit, not an accident.

test('camera year below the floor is rejected', () => {
  reports(validateCamera('too-old', camera({ year: 2007 }), []), 'year');
});

test('camera year above the ceiling is rejected', () => {
  reports(validateCamera('too-new', camera({ year: 2028 }), []), 'year');
});

test('camera year at the 2008 floor is accepted', () => {
  const problems = validateCamera('at-floor', camera({ year: 2008 }), []);
  assert.equal(problems.filter(p => p.includes('year')).length, 0, problems.join('\n'));
});

// ── Missing / null / wrong-typed fields ──────────────────────────────

test('a missing required field is reported', () => {
  reports(validateCamera('no-name', without(GOOD_CAMERA[1], 'name'), []), 'missing "name"');
});

test('null in a non-nullable field is reported', () => {
  reports(validateCamera('null-weight', camera({ weight: null }), []), 'not nullable');
});

test('a wrong-typed field is reported', () => {
  reports(validateCamera('string-mp', camera({ sensorMP: '24' }), []), 'should be a number');
});

test('a non-boolean in a boolean field is reported', () => {
  reports(validateCamera('truthy', camera({ weatherSealed: 'yes' }), []), 'should be a boolean');
});

test('a non-https URL is reported', () => {
  reports(validateCamera('http-img', camera({ imageUrl: 'http://example.com/a.jpg' }), []), 'https');
});

// ── Lens-specific guards ─────────────────────────────────────────────

test('a lens type outside Prime/Zoom is rejected', () => {
  reports(validateLens('odd-type', lens({ type: 'Tilt-Shift' })), 'not one of');
});

test('a zoom whose focal range does not ascend is rejected', () => {
  const bad = lens({ focalLengthMin: 70, focalLengthMax: 24 });
  reports(validateLens('inverted', bad), 'focalLength');
});

test('a prime missing its focal length is reported', () => {
  reports(validateLens('no-focal', without(prime({}), 'focalLength')), 'focalLength');
});

// ── Prices ───────────────────────────────────────────────────────────

test('a non-positive USD price is rejected', () => {
  reports(validateCamera('free', camera({ prices: { ...GOOD_CAMERA[1].prices, USD: 0 } }), []), 'prices.USD');
});

test('a missing prices object is rejected', () => {
  reports(validateCamera('no-prices', without(GOOD_CAMERA[1], 'prices'), []), 'prices');
});

test('an unrecognised currency key is rejected', () => {
  const bad = camera({ prices: { ...GOOD_CAMERA[1].prices, XYZ: 100 } });
  reports(validateCamera('bad-cur', bad, []), 'not a recognised currency');
});

// ── ASIN ─────────────────────────────────────────────────────────────

test('a malformed ASIN is rejected', () => {
  reports(validateCamera('short-asin', camera({ asin: 'B01' }), []), 'asin');
  reports(validateCamera('lower-asin', camera({ asin: 'b0abcdefgh' }), []), 'asin');
});

test('a null or absent ASIN is accepted', () => {
  assert.equal(validateCamera('null-asin', camera({ asin: null }), []).length, 0);
  assert.equal(validateCamera('no-asin', without(GOOD_CAMERA[1], 'asin'), []).length, 0);
});
