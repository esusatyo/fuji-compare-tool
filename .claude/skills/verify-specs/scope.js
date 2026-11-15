#!/usr/bin/env node
// Resolve a verify-specs scope into a concrete list of `brand:slug` items.
//
//   node .claude/skills/verify-specs/scope.js [filters…]
//
// Filters (all optional, AND-ed together; comma-separated values are OR-ed):
//   --brand nikon,canon      brand directories (the data.js files)
//   --maker sigma,tamron     lens `manufacturer` across EVERY brand file (lenses only)
//   --mount l,mft            mount id across every brand file (x, g, rf, z, e, l, mft, sa, m, …)
//   --items x-t5,canon:rf-50mm-f18-stm,"Z 50mm f/1.8 S"
//                            slug, brand:slug, or a name substring. A bare slug that
//                            exists in several brands returns ALL of them (they are
//                            different mounts — see brand-slug collisions) and says so.
//   --kind cameras|lenses
//   --uncited                only items with no `specSources`
//   --current                skip discontinued items
//   --json                   machine-readable output
//
// With no filters it prints per-brand citation coverage instead of a list.
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '../../..');
const { loadBrand, brandDirs } = require(path.join(ROOT, 'tests/helpers/load-brand.js'));

const args = process.argv.slice(2);
const opt = {};
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (!a.startsWith('--')) { console.error(`unexpected argument: ${a}`); process.exit(2); }
  const key = a.slice(2);
  if (['uncited', 'current', 'json'].includes(key)) { opt[key] = true; continue; }
  if (!['brand', 'maker', 'mount', 'items', 'kind'].includes(key)) { console.error(`unknown flag: ${a}`); process.exit(2); }
  const v = args[++i];
  if (v == null) { console.error(`${a} needs a value`); process.exit(2); }
  opt[key] = v.split(',').map(s => s.trim()).filter(Boolean);
}
const lc = s => String(s).toLowerCase();

const brands = brandDirs();
if (opt.brand) {
  const bad = opt.brand.filter(b => !brands.includes(lc(b)));
  if (bad.length) { console.error(`unknown brand(s): ${bad.join(', ')} — known: ${brands.join(', ')}`); process.exit(2); }
}

// Load every brand once; collect all items.
const all = [];
for (const brand of brands) {
  const { data } = loadBrand(brand);
  for (const [kindKey, kind] of [['CAMERAS', 'camera'], ['LENSES', 'lens']]) {
    for (const [slug, it] of Object.entries(data[kindKey] || {})) {
      all.push({
        id: `${brand}:${slug}`, brand, slug, kind, name: it.name,
        manufacturer: kind === 'lens' ? it.manufacturer : brand,
        mount: it.mount, discontinued: !!it.discontinued,
        cited: Array.isArray(it.specSources) ? it.specSources.length : 0,
        productUrl: it.productUrl || null,
      });
    }
  }
}

const noFilters = !opt.brand && !opt.maker && !opt.mount && !opt.items && !opt.kind && !opt.uncited && !opt.current;
if (noFilters) {
  console.log('Spec-citation coverage (items with specSources / total):');
  for (const b of brands) {
    const row = k => { const xs = all.filter(x => x.brand === b && x.kind === k); return `${xs.filter(x => x.cited).length}/${xs.length}`; };
    console.log(`  ${b.padEnd(10)} cameras ${row('camera').padEnd(8)} lenses ${row('lens')}`);
  }
  const u = all.filter(x => !x.cited).length;
  console.log(`  total uncited: ${u} of ${all.length}`);
  process.exit(0);
}

let items = all;
const notes = [];
if (opt.brand) items = items.filter(x => opt.brand.map(lc).includes(x.brand));
if (opt.maker) items = items.filter(x => x.kind === 'lens' && opt.maker.map(lc).includes(lc(x.manufacturer)));
if (opt.mount) items = items.filter(x => opt.mount.map(lc).includes(lc(x.mount)));
if (opt.kind) {
  const k = opt.kind.map(s => s.replace(/s$/, '').replace(/^lense$/, 'lens'));
  items = items.filter(x => k.includes(x.kind));
}
if (opt.items) {
  const picked = new Map();
  for (const q of opt.items) {
    let hits;
    if (q.includes(':')) hits = items.filter(x => x.id === lc(q));
    else {
      hits = items.filter(x => x.slug === lc(q));
      if (!hits.length) hits = items.filter(x => lc(x.name).includes(lc(q)));
    }
    if (!hits.length) notes.push(`NO MATCH: "${q}"`);
    else if (hits.length > 1) notes.push(`"${q}" matched ${hits.length} items (${hits.map(h => h.id).join(', ')}) — same slug in several brands = different mounts; all included, confirm that's intended`);
    hits.forEach(h => picked.set(h.id, h));
  }
  items = [...picked.values()];
}
if (opt.uncited) items = items.filter(x => !x.cited);
if (opt.current) items = items.filter(x => !x.discontinued);

// Uncited first, then current before discontinued, then brand/kind order.
items.sort((a, b) => (!!a.cited - !!b.cited) || (a.discontinued - b.discontinued));

if (opt.json) { console.log(JSON.stringify({ items, notes }, null, 2)); process.exit(0); }
for (const n of notes) console.log(`! ${n}`);
for (const x of items) {
  console.log([
    x.id.padEnd(42), x.kind.padEnd(6), String(x.mount).padEnd(4),
    (x.cited ? `cited×${x.cited}` : 'UNCITED').padEnd(9),
    x.discontinued ? 'disc' : 'curr', x.name,
  ].join('  '));
}
const unc = items.filter(x => !x.cited).length;
console.log(`\n${items.length} item(s): ${unc} uncited, ${items.length - unc} already cited`);
