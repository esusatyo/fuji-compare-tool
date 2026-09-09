// Tier 1 — Same-mount drift guard.
//
// Lenses are denormalized per brand on purpose (see CLAUDE.md): the same optic
// in RF and X mount really is a different product with its own weight, price
// and ASIN, so the files are expected to disagree.
//
// The exception is two brands that share a mount. Sigma's L-Mount lenses live
// in BOTH `panasonic/data.js` (as third-party) and `sigma/data.js` (as
// first-party), describing one physical product — so there they must agree.
//
// This is not hypothetical. Before this guard existed, every one of those
// entries in panasonic/data.js carried Sony E-mount dimensions (L-Mount barrels
// are ~2mm shorter), and nine were marked discontinued while Sigma was still
// selling them. Both were copied verbatim into sigma/data.js by the port.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand } = require('../helpers/load-brand');

// [brandA, brandB, mount]. The only mounts on this site that span two makers
// are L-Mount (Panasonic/Sigma, plus Leica if ever added) and Micro Four Thirds
// (Panasonic/OM System if ever added) — so adding a row is all a future
// mount-sharing brand needs.
const SAME_MOUNT_BRANDS = [
  ['panasonic', 'sigma', 'L-Mount'],
];

// Everything that is a property of the optic rather than of the listing.
// `prices.USD` is included deliberately: one product has one US list price, so
// a divergence means one file is stale — exactly how the pre-tariff prices
// survived unnoticed.
const INVARIANT = [
  'name', 'manufacturer', 'line', 'type',
  'focalLength', 'focalLengthMin', 'focalLengthMax', 'focalLengthEquiv',
  'maxAperture', 'minAperture', 'elements', 'groups', 'blades',
  'weight', 'length', 'diameter', 'filterThread',
  'minFocusDist', 'maxMagnification', 'afType',
  'weatherSealed', 'ois', 'oisStops', 'year', 'discontinued',
];

for (const [brandA, brandB, mount] of SAME_MOUNT_BRANDS) {
  test(`[${brandA} ↔ ${brandB}] shared ${mount} lenses agree on the optic`, () => {
    const A = loadBrand(brandA).data.LENSES;
    const B = loadBrand(brandB).data.LENSES;
    const shared = Object.keys(A).filter(id => B[id]);

    assert.ok(shared.length > 0,
      `expected ${brandA} and ${brandB} to share ${mount} lenses; found none — ` +
      'if that is intentional, remove the row from SAME_MOUNT_BRANDS');

    const problems = [];
    for (const id of shared) {
      for (const field of INVARIANT) {
        if (A[id][field] !== B[id][field]) {
          problems.push(`${id}.${field}: ${brandA}=${JSON.stringify(A[id][field])} ` +
            `${brandB}=${JSON.stringify(B[id][field])}`);
        }
      }
      if (A[id].prices?.USD !== B[id].prices?.USD) {
        problems.push(`${id}.prices.USD: ${brandA}=${A[id].prices?.USD} ` +
          `${brandB}=${B[id].prices?.USD} — one product has one US list price`);
      }
    }
    assert.deepEqual(problems, [],
      `\n${shared.length} shared ${mount} lenses; ${problems.length} disagreements:\n` +
      problems.join('\n'));
  });
}
