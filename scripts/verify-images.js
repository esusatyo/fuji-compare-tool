// Verify every imageUrl across all brands actually returns an image.
// Throttle-friendly (slow, sequential). Use after bulk image edits:
//   node scripts/verify-images.js [brand]
const { loadBrand, brandDirs } = require('../tests/helpers/load-brand');

const UA = 'fuji-compare-tool/1.0 (image verifier)';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function check(url) {
  for (let i = 0; i < 6; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
      if (r.status === 429 || r.status >= 500) { await sleep(2000 * (i + 1)); continue; }
      const ct = r.headers.get('content-type') || '';
      return { ok: r.ok && /^image\//.test(ct), status: r.status, ct };
    } catch (e) { await sleep(1500 * (i + 1)); }
  }
  return { ok: false, status: 0, ct: 'rate-limited/error' };
}

async function main() {
  const only = process.argv[2];
  const brands = only ? [only] : brandDirs();
  const bad = [];
  for (const brand of brands) {
    const { data } = loadBrand(brand);
    const all = [
      ...Object.entries(data.CAMERAS),
      ...Object.entries(data.LENSES),
    ].filter(([, it]) => it.imageUrl);
    for (const [id, it] of all) {
      const { ok, status, ct } = await check(it.imageUrl);
      if (!ok) { bad.push(`${brand}/${id} [${status} ${ct}] ${it.imageUrl}`); console.error(`✗ ${brand}/${id} (${status})`); }
      else console.error(`✓ ${brand}/${id}`);
      await sleep(600);
    }
  }
  console.log(`\n${bad.length} bad image URL(s):`);
  console.log(bad.join('\n') || 'all good');
  process.exit(bad.length ? 1 : 0);
}

main();
