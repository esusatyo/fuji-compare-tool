// Find product images on Wikimedia Commons for items missing an `imageUrl`,
// using CURATED category members + STRICT model-token file search — far more
// reliable than the fuzzy name-match in fetch-images.js (which returned wrong
// subjects, e.g. an Audi A1 for the Sony a1-ii). Brand-agnostic.
//
//   node scripts/fetch-images-commons.js <brand> [cameras|lenses|all] [--apply]
//
// Without --apply it prints an id -> url map (+ misses) for review.
// With   --apply it patches `imageUrl:null` fields in <brand>/data.js for the
//                verified matches. Always review the diff afterwards.
//
// Reliability rules:
//  - Only image MIME types; rejects logos/diagrams/rears/samples/videos/etc.
//  - File-search results are accepted ONLY when the normalized filename contains
//    the item's model token (derived from its productUrl slug) — this is what
//    prevents the fuzzy-garbage problem. Items without a confident match are
//    reported as MISSES rather than guessed.
const fs = require('fs');
const path = require('path');
const { loadBrand } = require('../tests/helpers/load-brand');

const UA = 'fuji-compare-tool/1.0 (image maintenance; brand-agnostic Commons finder)';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const norm = s => s.replace(/[^a-z0-9]/gi, '').toUpperCase();

const BAD_EXT = /\.(svg|pdf|ogv|webm|gif|tif|tiff|djvu)$/i;
const REJECT = /(logo|diagram|mount|sensor|menu|screen|chart|sample|specimen|font|typeface|resolution test|MTF|exif|manual|roadmap|graph|unboxing|teardown|\brear\b|\bback\b|\btop\b|box|packaging)/i;

// "Main" part of a filename: drop the extension and any trailing parenthetical,
// e.g. "SST Condensed (ILCE-6100Y).jpg" -> "SST Condensed". A model code that
// only appears in a trailing (...) usually denotes the camera that TOOK the
// photo (capture attribution), not the subject — so we match against this.
function mainName(f) {
  return f.replace(/\.[a-z0-9]+$/i, '').replace(/\s*\([^)]*\)\s*$/, '');
}
const matchesToken = (f, mt) => {
  const n = norm(mainName(f));
  return n.includes(mt.token) || n.includes(mt.core);
};

async function getJson(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA } });
      if (r.status === 429 || r.status >= 500) { await sleep(900 * (i + 1)); continue; }
      if (!r.ok) return null;
      return await r.json();
    } catch { await sleep(600 * (i + 1)); }
  }
  return null;
}

async function categoryFiles(cat) {
  const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=categorymembers`
    + `&cmtitle=${encodeURIComponent(cat)}&cmtype=file&cmlimit=50`;
  const j = await getJson(u);
  const m = j && j.query && j.query.categorymembers;
  return m ? m.map(x => x.title) : [];
}

async function searchFiles(term) {
  const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search`
    + `&srnamespace=6&srlimit=20&srsearch=${encodeURIComponent(term)}`;
  const j = await getJson(u);
  const s = j && j.query && j.query.search;
  return s ? s.map(x => x.title) : [];
}

async function resolveUrl(title, width) {
  const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo`
    + `&titles=${encodeURIComponent(title)}&iiprop=url|mime&iiurlwidth=${width}`;
  const j = await getJson(u);
  const pages = j && j.query && j.query.pages;
  if (!pages) return null;
  for (const p of Object.values(pages)) {
    const ii = p.imageinfo && p.imageinfo[0];
    if (ii && /^image\//.test(ii.mime || '')) return ii.thumburl || ii.url;
  }
  return null;
}

// Model token from a productUrl slug, e.g. .../p/ilce7m4-b -> "ILCE7M4",
// .../p/sel50f14gm -> "SEL50F14GM". Returns { token, core, dashed } where
// `core` drops a trailing region letter (the "B" in "ilmefx30b") and `dashed`
// reinserts a dash after the leading letters ("ILCE-7M4") to match how
// Wikimedia Commons names many categories. Returns null when the URL has no
// "/p/<slug>" (e.g. Canon's usa.canon.com/cameras/<name> URLs).
function modelToken(productUrl) {
  if (!productUrl) return null;
  const m = productUrl.match(/\/p\/([^/?#]+)/i);
  if (!m) return null;
  const seg = m[1].replace(/[-_/][a-z]$/i, ''); // strip trailing "-b"/"/s" region suffix
  const token = norm(seg);
  if (token.length < 4) return null;
  const core = /[A-Z]$/.test(token) && token.length > 6 ? token.slice(0, -1) : token;
  const dm = token.match(/^([A-Z]+?)(\d.*)$/);
  const dashed = dm ? `${dm[1]}-${dm[2]}` : token;
  return { token, core, dashed };
}

// Strong, specific acceptance tokens for a file-search result: the model code
// (from the slug) and the full normalized product name (e.g. "A7RV",
// "FE50MMF14GM"). Requiring the FULL name as a contiguous substring is specific
// enough to avoid the fuzzy-garbage problem, while still matching Commons files
// named after the marketing name rather than the internal model code.
function acceptTokens(item, mt) {
  const t = [];
  if (mt) { t.push(mt.token); t.push(mt.core); }
  const nameTok = norm(item.name);
  if (nameTok.length >= 4) t.push(nameTok);
  return [...new Set(t)].filter(Boolean);
}
const matchesAny = (f, toks) => { const n = norm(mainName(f)); return toks.some(t => n.includes(t)); };

function pickFromCategory(files, toks) {
  const clean = files.filter(f => !BAD_EXT.test(f) && !REJECT.test(f));
  if (!clean.length) return null;
  const byToken = clean.find(f => matchesAny(f, toks));
  if (byToken) return byToken;
  // Category members are curated to be ABOUT the subject, so when no filename
  // carries the token, prefer a clean "front"/"body" studio shot, else first.
  return clean.find(f => /front|body/i.test(f)) || clean[0];
}

function brandCategoryCandidates(brandName, name, mt) {
  // Cover the common Commons naming styles, e.g.
  //   "Category:Canon EOS R5", "Category:Nikon Z 6", "Category:Fujifilm X-T5",
  //   "Category:Sony α7R V" (marketing α), "Category:Sony ILCE-7RM5" (model code)
  const variants = new Set([`Category:${brandName} ${name}`]);
  if (/^A\d/i.test(name)) variants.add(`Category:${brandName} ${name.replace(/^A/i, 'α')}`);
  if (mt && mt.dashed) variants.add(`Category:${brandName} ${mt.dashed}`);
  return [...variants];
}

async function findImage(brandName, item, width) {
  const mt = modelToken(item.productUrl);
  const toks = acceptTokens(item, mt);
  if (!toks.length) return null; // nothing specific enough to match safely
  // 1) Curated category (by marketing name, α-variant, or model code).
  for (const cat of brandCategoryCandidates(brandName, item.name, mt)) {
    await sleep(250);
    const files = await categoryFiles(cat);
    const pick = pickFromCategory(files, toks);
    if (pick) { await sleep(250); const url = await resolveUrl(pick, width); if (url) return { url, pick, via: `cat:${cat}` }; }
  }
  // 2) STRICT file-search: accept only files whose name carries a strong token
  //    (model code or full product name) — outside any trailing parenthetical.
  const terms = [`${brandName} ${item.name}`, item.name, mt && mt.dashed].filter(Boolean);
  const seen = new Set();
  for (const term of terms) {
    await sleep(250);
    const files = await searchFiles(term);
    const ok = files.filter(f => !BAD_EXT.test(f) && !REJECT.test(f) && matchesAny(f, toks));
    for (const f of ok) {
      if (seen.has(f)) continue; seen.add(f);
      await sleep(250); const url = await resolveUrl(f, width);
      if (url) return { url, pick: f, via: `search:${term}` };
    }
  }
  return null;
}

function patch(src, id, url) {
  const i = src.indexOf(`'${id}': {`);
  if (i === -1) return { src, ok: false, why: 'id-not-found' };
  const t = src.indexOf('imageUrl:null', i);
  if (t === -1 || t - i > 1000) return { src, ok: false, why: 'no-imageUrl:null-near' };
  const safe = url.replace(/'/g, "\\'");
  return { src: src.slice(0, t) + `imageUrl:'${safe}'` + src.slice(t + 'imageUrl:null'.length), ok: true };
}

async function main() {
  const brand = process.argv[2];
  if (!brand) { console.error('usage: node scripts/fetch-images-commons.js <brand> [cameras|lenses|all] [--skip=N] [--limit=N] [--apply]'); process.exit(1); }
  const which = (process.argv[3] && !process.argv[3].startsWith('--')) ? process.argv[3] : 'all';
  const apply = process.argv.includes('--apply');
  const width = 1280;

  const { data } = loadBrand(brand);
  const brandName = data.BRAND_CONFIG.name;
  const items = [];
  if (which === 'cameras' || which === 'all') for (const [id, c] of Object.entries(data.CAMERAS)) if (!c.imageUrl) items.push([id, c]);
  if (which === 'lenses'  || which === 'all') for (const [id, l] of Object.entries(data.LENSES))  if (!l.imageUrl) items.push([id, l]);

  // --skip/--limit make a large brand chunkable. Commons rate-limiting puts
  // throughput at roughly 4 items/minute, so a brand like Sony (105 gapped
  // lenses) overruns a 10-minute command ceiling and is SIGTERM'd mid-run with
  // no summary printed. Slicing the list lets it be swept across several runs.
  const numArg = (name) => {
    const a = process.argv.find(x => x.startsWith(`--${name}=`));
    return a ? parseInt(a.split('=')[1], 10) : null;
  };
  const skip = numArg('skip') || 0;
  const limit = numArg('limit');
  const total = items.length;
  const slice = items.slice(skip, limit != null ? skip + limit : undefined);
  items.length = 0; items.push(...slice);

  const range = (skip || limit != null) ? ` [${skip + 1}–${skip + items.length} of ${total}]` : '';
  console.error(`${brandName}: ${total} item(s) missing imageUrl${range}\n`);
  const found = {}; const misses = [];
  for (const [id, item] of items) {
    const res = await findImage(brandName, item, width);
    if (res) { found[id] = res.url; console.error(`✓ ${id}  (${res.via})\n    ${res.pick}`); }
    else { misses.push(`${id} (${item.name})`); console.error(`✗ ${id} (${item.name})`); }
  }

  console.log('\n=== FOUND (id -> url) ===');
  console.log(JSON.stringify(found, null, 2));
  console.log(`\n=== MISSES (${misses.length}/${items.length}) ===\n${misses.join('\n')}`);

  if (apply && Object.keys(found).length) {
    const file = path.resolve(__dirname, '..', brand, 'data.js');
    let src = fs.readFileSync(file, 'utf8');
    let n = 0; const fails = [];
    for (const [id, url] of Object.entries(found)) {
      const r = patch(src, id, url);
      if (r.ok) { src = r.src; n++; } else fails.push(`${id}: ${r.why}`);
    }
    fs.writeFileSync(file, src);
    console.log(`\nAPPLIED ${n} imageUrl(s) to ${brand}/data.js`);
    if (fails.length) console.log('apply fails:\n' + fails.join('\n'));
    console.log('Next: remove applied ids from KNOWN_IMAGE_GAPS, run scripts/verify-images.js + npm test.');
  } else if (apply) {
    console.log('\n(--apply given but nothing found to apply)');
  }
}

main();
