// Maintenance helper: find a verified, hotlinkable product image for each
// item that is missing one, using the Wikipedia + Wikimedia Commons APIs.
// Prints an id -> URL map plus a list of items with no image found.
//
//   node scripts/fetch-images.js <brand> [cameras|lenses|all]
//
// Every printed URL has been fetched and confirmed to return image/*.
const { loadBrand } = require('../tests/helpers/load-brand');

const UA = 'fuji-compare-tool/1.0 (data maintenance script)';
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Fetch with retry/backoff (Wikimedia rate-limits aggressively).
async function getJson(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA } });
      if (r.status === 429 || r.status >= 500) { await sleep(800 * (i + 1)); continue; }
      if (!r.ok) return null;
      return await r.json();
    } catch { await sleep(500 * (i + 1)); }
  }
  return null;
}

async function verify(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
      if (r.status === 429) { await sleep(800 * (i + 1)); continue; }
      const ct = r.headers.get('content-type') || '';
      return r.ok && /^image\//.test(ct) ? url : null;
    } catch { await sleep(500); }
  }
  return null;
}

// MediaWiki action API (pageimages) — more lenient than the REST summary.
async function wikipediaImage(title) {
  const u = `https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1`
    + `&prop=pageimages&piprop=original|thumbnail&pithumbsize=800&titles=${encodeURIComponent(title)}`;
  const j = await getJson(u);
  const pages = j && j.query && j.query.pages;
  if (!pages) return null;
  for (const p of Object.values(pages)) {
    const url = (p.original && p.original.source) || (p.thumbnail && p.thumbnail.source);
    if (url) return url;
  }
  return null;
}

// Search Wikimedia Commons for a file and return a width-limited thumb URL.
async function commonsImage(query) {
  const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search`
    + `&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=5`
    + `&prop=imageinfo&iiprop=url&iiurlwidth=700`;
  const j = await getJson(u);
  const pages = j && j.query && j.query.pages;
  if (!pages) return null;
  for (const p of Object.values(pages)) {
    const info = p.imageinfo && p.imageinfo[0];
    const url = info && (info.thumburl || info.url);
    if (url && /\.(jpe?g|png)$/i.test(url)) return url;
  }
  return null;
}

async function findImage(name, kind) {
  // Candidate Wikipedia titles + Commons queries from the product name.
  const titles = [`Canon ${name}`, name];
  for (const t of titles) {
    const wImg = await wikipediaImage(t);
    const ok = wImg && await verify(wImg);
    if (ok) return ok;
  }
  const queries = kind === 'lens'
    ? [`Canon ${name}`, `Canon RF ${name}`]
    : [`Canon ${name}`];
  for (const q of queries) {
    const cImg = await commonsImage(q);
    const ok = cImg && await verify(cImg);
    if (ok) return ok;
  }
  return null;
}

async function main() {
  const brand = process.argv[2] || 'canon';
  const which = process.argv[3] || 'all';
  const { data } = loadBrand(brand);

  const items = [];
  if (which === 'cameras' || which === 'all') {
    for (const [id, c] of Object.entries(data.CAMERAS)) if (!c.imageUrl) items.push([id, c.name, 'camera']);
  }
  if (which === 'lenses' || which === 'all') {
    for (const [id, l] of Object.entries(data.LENSES)) if (!l.imageUrl) items.push([id, l.name, 'lens']);
  }

  const found = {};
  const misses = [];
  for (const [id, name, kind] of items) {
    await sleep(400); // be polite to the Wikimedia APIs (avoid rate limiting)
    const url = await findImage(name, kind);
    if (url) { found[id] = url; console.error(`✓ ${id} -> ${url}`); }
    else { misses.push(`${id} (${name})`); console.error(`✗ ${id} (${name})`); }
  }

  console.log('\n=== FOUND (id -> url) ===');
  console.log(JSON.stringify(found, null, 2));
  console.log(`\n=== MISSES (${misses.length}/${items.length}) ===`);
  console.log(misses.join('\n'));
}

main();
