// Tier 1 — Mount integrity, per brand.
//
// Every camera and lens records the mount it belongs to (see CLAUDE.md). The
// mount used to live only as prose inside dropdown group labels, so nothing
// could act on it; these guards keep the field honest now that the UI filters
// on it.
//
// Three separate things are checked, because they fail in different ways:
//   1. the declared list and the items agree (an id nobody uses is dead weight);
//   2. a dropdown group never straddles two mounts, which is what makes the
//      group labels ("── Sigma (MFT) ──") truthful;
//   3. a camera's mount agrees with its sensor, which catches a mistyped token
//      that rules 1 and 2 would both wave through.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand, brandDirs } = require('../helpers/load-brand');

// sensorType → mount, first match wins. Only the brands spanning more than one
// mount need a rule; everywhere else the brand's sole mount is the answer, and
// asserting that is still worth doing — it catches a stray token.
// Crop factor per mount, for the lens-side equivalent of the sensor check.
// A lens's `focalLengthEquiv` divided by its native focal length IS the mount's
// crop factor, which makes it an independent witness: the mounts were seeded
// from dropdown-group labels, so without this a whole group tagged wrong would
// pass every other guard here — schema (the id is declared), group agreement
// (they all agree with each other) and the sensor rule (cameras only).
// Only the multi-mount brands need it; elsewhere there is nothing to tell apart.
const LENS_CROP = {
  fujifilm:  { x: 1.5, g: 0.79 },
  panasonic: { l: 1.0, mft: 2.0 },
  sigma:     { l: 1.0 },
};
// Generous next to the spread actually seen (worst case 1.467 against 1.5, from
// rounding a 14mm APS-C lens to "21mm"), and nowhere near wide enough to blur
// two mounts — the closest pair is 1.5 against 0.79.
const CROP_TOLERANCE = 0.08;

const SENSOR_RULES = {
  fujifilm:  [[/43\.8×32\.9mm GFX/, 'g'], [/X-Trans|Bayer CMOS|1" Primary Color/, 'x']],
  panasonic: [[/Micro Four Thirds/, 'mft'], [/Full-frame/, 'l']],
  sigma:     [[/Foveon/, 'sa'], [/Full-frame/, 'l']],
};

for (const brand of brandDirs()) {
  const { data } = loadBrand(brand);
  const declared = (data.BRAND_CONFIG.mounts || []).map(m => m.id);
  const items = [
    ...Object.entries(data.CAMERAS).map(([id, it]) => ['camera', id, it]),
    ...Object.entries(data.LENSES).map(([id, it]) => ['lens', id, it]),
  ];

  test(`[${brand}] every item's mount is declared, and every declared mount is used`, () => {
    const undeclared = items
      .filter(([, , it]) => !declared.includes(it.mount))
      .map(([kind, id, it]) => `${kind} ${id}: mount ${JSON.stringify(it.mount)}`);
    assert.deepEqual(undeclared, [],
      `\nmounts not in BRAND_CONFIG.mounts (${declared.join(', ')}):\n${undeclared.join('\n')}`);

    const used = new Set(items.map(([, , it]) => it.mount));
    const unused = declared.filter(id => !used.has(id));
    assert.deepEqual(unused, [],
      `declared mount(s) no camera or lens uses: ${unused.join(', ')} — ` +
      'drop them from BRAND_CONFIG.mounts or add the items');
  });

  // A group whose members disagree cannot carry the mount in its label, and the
  // filter would offer a mount that pulls in foreign items. Panasonic's box
  // cameras (BS1H is L-Mount, BGH1 is MFT) were the one real case; they were
  // split so this can hold everywhere.
  test(`[${brand}] every dropdown group holds one mount`, () => {
    const problems = [];
    for (const [label, groups, source] of [
      ['cameras', data.DROPDOWN_GROUPS, data.CAMERAS],
      ['lenses', data.LENS_DROPDOWN_GROUPS, data.LENSES],
    ]) {
      for (const grp of groups) {
        const mounts = new Map();
        for (const id of grp.ids) {
          const it = source[id];
          if (!it) continue; // referential.test.js owns orphan ids
          if (!mounts.has(it.mount)) mounts.set(it.mount, []);
          mounts.get(it.mount).push(id);
        }
        if (mounts.size > 1) {
          problems.push(`${label} group "${grp.label}" spans ${mounts.size} mounts: ` +
            [...mounts].map(([m, ids]) => `${m} (${ids.join(', ')})`).join(' vs '));
        }
      }
    }
    assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
  });

  test(`[${brand}] every lens's mount agrees with its focal-length equivalent`, () => {
    const crops = LENS_CROP[brand];
    if (!crops) return; // single-mount brand: nothing to tell apart
    const problems = [];
    for (const [id, lens] of Object.entries(data.LENSES)) {
      const native = lens.focalLength ?? lens.focalLengthMin;
      const equiv = parseFloat(String(lens.focalLengthEquiv).replace(/[^0-9.].*$/, ''));
      if (!native || !equiv) {
        problems.push(`${id}: cannot read a crop factor from focalLengthEquiv ` +
          `${JSON.stringify(lens.focalLengthEquiv)} and focal length ${native}`);
        continue;
      }
      const expected = crops[lens.mount];
      if (expected === undefined) {
        problems.push(`${id}: mount ${JSON.stringify(lens.mount)} has no crop factor in ` +
          'LENS_CROP — add one so its lenses stay checkable');
        continue;
      }
      const actual = equiv / native;
      if (Math.abs(actual - expected) > CROP_TOLERANCE) {
        // Name the mount it looks like, since a wrong token is the likely cause.
        const nearest = Object.entries(crops)
          .sort((a, b) => Math.abs(actual - a[1]) - Math.abs(actual - b[1]))[0];
        problems.push(`${id}: mount ${JSON.stringify(lens.mount)} implies a ${expected}× crop, ` +
          `but ${native}mm → ${lens.focalLengthEquiv} is ${actual.toFixed(2)}×` +
          (Math.abs(actual - nearest[1]) <= CROP_TOLERANCE ? ` — that is ${nearest[0]}` : ''));
      }
    }
    assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
  });

  test(`[${brand}] every camera's mount agrees with its sensor`, () => {
    const rules = SENSOR_RULES[brand];
    const problems = [];
    for (const [id, cam] of Object.entries(data.CAMERAS)) {
      let derived;
      if (!rules) {
        derived = declared[0]; // single-mount brand
      } else {
        const hit = rules.find(([re]) => re.test(cam.sensorType));
        if (!hit) {
          problems.push(`${id}: sensorType ${JSON.stringify(cam.sensorType)} matches no rule — ` +
            'add one to SENSOR_RULES so the mount stays checkable');
          continue;
        }
        derived = hit[1];
      }
      if (cam.mount !== derived) {
        problems.push(`${id}: mount ${JSON.stringify(cam.mount)} but sensorType ` +
          `${JSON.stringify(cam.sensorType)} implies ${JSON.stringify(derived)}`);
      }
    }
    assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
  });
}
