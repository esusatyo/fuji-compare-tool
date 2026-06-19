// One-off: resolve curated Wikimedia Commons File titles to verified image
// URLs and patch the imageUrl:null fields in canon/data.js.
//   node scripts/apply-images.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const UA = 'fuji-compare-tool/1.0 (data maintenance script)';
const sleep = ms => new Promise(r => setTimeout(r, ms));

// id -> Wikimedia Commons File title (each hand-verified as the right product).
const MAP = {
  // cameras
  'eos-r1': 'File:Canon EOS R1 12 apr 2025c.jpg',
  'eos-r5-ii': 'File:Canon EOS R5 Mark II (front, no body cap).jpg',
  'eos-r8': 'File:Canon EOS R8 27 may 2023c.jpg',
  'eos-r50': 'File:Canon EOS R50 (52694437103).jpg',
  'eos-r100': 'File:Canon EOS R100 19 aug 2023a.jpg',
  'eos-r6-ii': 'File:Canon EOS R6 Mark II - by Henry Söderlund (52546794891).jpg',
  'eos-r7': 'File:Canon EOS R7 9 Jul 2022a.jpg',
  'eos-r10': 'File:Canon EOS R10 22 nov 2022a.jpg',
  'eos-r5c': 'File:Canon EOS R5C (51973388828).jpg',
  'eos-r3': 'File:Canon EOS R3.jpg',
  'eos-r5': 'File:Canon EOS R5.jpg',
  'eos-r6': 'File:Canon R6 und RF 85 1,2-8068.jpg',
  'eos-rp': 'File:Canon EOS RP 27 Mar 2019a.jpg',
  'eos-r': 'File:Canon EOS R 07 sep 2018a.jpg',
  // lenses
  'rf-16mm-f28-stm': 'File:Canon RF 16mm F2.8 STM.jpg',
  'rf-24mm-f18-macro-is-stm': 'File:Canon RF 24mm F1.8 MACRO IS STM.jpg',
  'rf-28mm-f28-stm': 'File:Canon RF 28mm F2.8-8795.jpg',
  'rf-35mm-f18-macro-is-stm': 'File:Canon R5 Rück mit RF 35 1.8-8053.jpg',
  'rf-50mm-f12-l-usm': 'File:Canon RF 50mm F1.2L USM, with lens hood.jpg',
  'rf-50mm-f18-stm': 'File:Canon RF 50mm F1.8 STM.jpg',
  'rf-85mm-f12-l-usm': 'File:Canon R5 mit RF 85 1.2-8049.jpg',
  'rf-85mm-f2-macro-is-stm': 'File:Canon R6 und RF 85 2,0-8067.jpg',
  'rf-100mm-f28-l-macro-is-usm': 'File:Canon RF 100mm.jpg',
  'rf-135mm-f18-l-is-usm': 'File:Canon RF 135mm f1.8L IS USM.jpg',
  'rf-800mm-f11-is-stm': 'File:Canon R5 und RF 800 11-8061.jpg',
  'rf-14-35mm-f4-l-is-usm': 'File:Canon RF 14-35mm F4L IS USM.jpg',
  'rf-15-35mm-f28-l-is-usm': 'File:Canon RF 15-35mm F2.8L IS USM.jpg',
  'rf-24-50mm-f45-63-is-stm': 'File:Canon RF 24-50mm F4.5-6.3 IS STM (52853984559).jpg',
  'rf-24-70mm-f28-l-is-usm': 'File:Canon EOS R5 with Canon RF 24-70mm F2.8L IS USM (50170662581).jpg',
  'rf-24-105mm-f4-l-is-usm': 'File:CanonR5 24-105.jpg',
  'rf-24-105mm-f4-71-is-stm': 'File:Canon RF 24-105mm f4-7.1 IS STM.jpg',
  'rf-70-200mm-f28-l-is-usm': 'File:Canon RF 70-200 2,8-8063.jpg',
  'rf-70-200mm-f4-l-is-usm': 'File:Canon RF 70-200mm F4L IS USM - by Henry Söderlund (50914145648).jpg',
  'rf-100-400mm-f56-8-is-usm': 'File:Canon RF 100–400mm F5.6–8 IS USM.jpg',
  'rf-100-500mm-f45-71-l-is-usm': 'File:Canon EOS R5+RF 100-500mm f4.5-7.1L IS USM(2).jpg',
  'rfs-10-18mm-f45-63-is-stm': 'File:Canon RF-S 10-18mm F4.5-6.3 IS STM by Henry Söderlund.jpg',
  'rfs-18-45mm-f45-63-is-stm': 'File:Canon RF-S18-45mm F4.5-6.3 IS STM Lens.jpg',
  'rfs-18-150mm-f35-63-is-stm': 'File:Canon EOS R7+RF-S 18-150mm f3.5-6.3 IS STM.jpg',
  'rfs-55-210mm-f5-71-is-stm': 'File:Canon RF-S 55-210mm F5-7.1 IS STM (52792902905).jpg',
};

async function getJson(url, tries = 6) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA } });
      const text = await r.text();
      if (!r.ok || /too many requests/i.test(text)) { await sleep(2000 * (i + 1)); continue; }
      return JSON.parse(text);
    } catch { await sleep(2000 * (i + 1)); }
  }
  return null;
}

// Derive the canonical upload.wikimedia.org URL from a Commons File title.
// Wikimedia lays files out at /commons/<h0>/<h0h1>/<filename> where the hash
// is md5(filename_with_underscores). The upload host isn't rate-limited, so
// this avoids the throttled API entirely.
function commonsUrl(title) {
  const fname = title.replace(/^File:/, '').replace(/ /g, '_');
  const h = crypto.createHash('md5').update(fname, 'utf8').digest('hex');
  return `https://upload.wikimedia.org/wikipedia/commons/${h[0]}/${h.slice(0, 2)}/${encodeURIComponent(fname)}`;
}

async function verify(url) {
  for (let i = 0; i < 6; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
      if (r.status === 429 || r.status >= 500) { await sleep(1500 * (i + 1)); continue; }
      const ct = r.headers.get('content-type') || '';
      return r.ok && /^image\//.test(ct);
    } catch { await sleep(1000 * (i + 1)); }
  }
  return false;
}

function patch(src, id, url) {
  const idIdx = src.indexOf(`'${id}':`);
  if (idIdx === -1) throw new Error(`id ${id} not found`);
  const target = src.indexOf('imageUrl:null', idIdx);
  if (target === -1) throw new Error(`imageUrl:null not found for ${id}`);
  const safe = url.replace(/'/g, "\\'");
  return src.slice(0, target) + `imageUrl:'${safe}'` + src.slice(target + 'imageUrl:null'.length);
}

function stillNull(src, id) {
  const idIdx = src.indexOf(`'${id}':`);
  if (idIdx === -1) return false;
  const nextId = src.indexOf("':", idIdx + id.length + 3);
  const region = src.slice(idIdx, nextId === -1 ? undefined : nextId);
  return /imageUrl:null/.test(region);
}

async function main() {
  const file = path.resolve(__dirname, '..', 'canon', 'data.js');
  let src = fs.readFileSync(file, 'utf8');

  // Only process ids that still have imageUrl:null (idempotent re-runs).
  const todo = Object.entries(MAP).filter(([id]) => stillNull(src, id));
  console.error(`${todo.length} item(s) to fill`);

  // FORCE=1 trusts the deterministic md5 URL scheme and skips live verification
  // (used when the upload host is temporarily rate-limiting our IP). Run a
  // verification pass later: node scripts/verify-images.js
  const force = !!process.env.FORCE;
  const fails = [];
  for (const [id, title] of todo) {
    const url = commonsUrl(title);
    if (force || await verify(url)) {
      src = patch(src, id, url);
      console.error(`${force ? '~' : '✓'} ${id}`);
    } else { fails.push(id); console.error(`✗ ${id} (${title})`); }
    if (!force) await sleep(500);
  }

  fs.writeFileSync(file, src);
  console.log(`\nPatched ${todo.length - fails.length}/${todo.length}`);
  if (fails.length) console.log('FAILED:', fails.join(', '));
}

main();
