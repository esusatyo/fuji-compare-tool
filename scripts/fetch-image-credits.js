// Attach licence + attribution metadata to every Wikimedia Commons image in
// the dataset, so the About page can credit them as CC BY / CC BY-SA require.
//
//   node scripts/fetch-image-credits.js [brand] [--apply]
//
// Without --apply it prints what it would write (and flags anything whose
// licence is missing, unfree, or restricted). With --apply it inserts an
// `imageCredit:{…}` object immediately after the item's `imageUrl` in
// <brand>/data.js. Re-running is safe: existing credits are refreshed in place.
//
// Only upload.wikimedia.org images are handled — they are the ones carrying
// machine-readable licence metadata. Manufacturer/retailer hotlinks are
// reported separately and left alone; they are publicity shots used to depict
// the product they advertise, not freely-licensed works, and no credit string
// would make them so.
const fs = require('fs');
const path = require('path');
const { loadBrand, brandDirs, ROOT } = require('../tests/helpers/load-brand');

const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'fuji-compare-tool/1.0 (image attribution; +https://comparecameraspecs.com)';

// Licences we may use. Anything else is reported and skipped.
const FREE = /^(CC0|CC BY(-SA)? [0-9.]+( [a-z]{2})?|Public domain|PD)/i;
const UNFREE = /\b(NC|ND|NonCommercial|NoDerivatives|fair use|non-free)\b/i;

const strip = s => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

// Commons normalises File titles with spaces; upload URLs use underscores.
// Key every lookup through this so the two forms match.
const key = s => decodeURIComponent(String(s)).replace(/_/g, ' ').replace(/^File:/, '').trim();

/** Commons File name out of an upload.wikimedia.org URL (thumb or original). */
function commonsFile(url) {
  const m = url.match(/\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

async function fetchMeta(files) {
  const out = {};
  for (let i = 0; i < files.length; i += 25) {
    const titles = files.slice(i, i + 25).map(f => 'File:' + f).join('|');
    const url = `${API}?action=query&format=json&prop=imageinfo&iiprop=extmetadata` +
                `&titles=${encodeURIComponent(titles)}`;
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`Commons API ${res.status}`);
    const json = await res.json();
    for (const page of Object.values(json.query?.pages || {})) {
      const name = key(page.title);
      if (page.missing !== undefined) { out[name] = { error: 'not on Commons' }; continue; }
      const m = page.imageinfo?.[0]?.extmetadata || {};
      out[name] = {
        author: strip(m.Artist?.value) || null,
        licence: strip(m.LicenseShortName?.value) || null,
        licenceUrl: strip(m.LicenseUrl?.value) || null,
        restrictions: strip(m.Restrictions?.value) || null,
        attributionRequired: strip(m.AttributionRequired?.value) === 'true',
        // encodeURI (not encodeURIComponent) so ":" and "(" stay readable, and
        // underscores rather than %20 — the canonical Commons file-page form.
        source: encodeURI('https://commons.wikimedia.org/wiki/' + page.title.replace(/ /g, '_')),
      };
    }
    await new Promise(r => setTimeout(r, 300)); // Commons rate-limits
  }
  return out;
}

/** Insert or replace `imageCredit:{…}` for one slug in a data.js source string. */
function patch(src, slug, credit) {
  const at = src.indexOf(`'${slug}': {`);
  if (at === -1) return { src, ok: false, why: 'slug not found' };
  const end = src.indexOf('\n  },', at);
  const block = src.slice(at, end);

  const lit = `imageCredit:{author:${JSON.stringify(credit.author)}, ` +
              `licence:${JSON.stringify(credit.licence)}, ` +
              `licenceUrl:${JSON.stringify(credit.licenceUrl)}, ` +
              `source:${JSON.stringify(credit.source)}}`;

  // Refresh an existing credit in place.
  const existing = block.match(/imageCredit:\{[^}]*\}/);
  if (existing) {
    return { src: src.slice(0, at) + block.replace(existing[0], lit) + src.slice(end), ok: true };
  }
  // Otherwise insert right after the imageUrl string.
  const im = block.match(/imageUrl:'[^']*',?/);
  if (!im) return { src, ok: false, why: 'no imageUrl to anchor to' };
  const anchored = block.replace(im[0], `${im[0].replace(/,$/, '')},\n    ${lit},`);
  return { src: src.slice(0, at) + anchored + src.slice(end), ok: true };
}

(async () => {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const only = args.find(a => !a.startsWith('--'));
  const brands = only ? [only] : brandDirs();

  let totalWM = 0, totalOther = 0, wrote = 0;
  const problems = [], otherHosts = {};

  for (const brand of brands) {
    const { data } = loadBrand(brand);
    const items = { ...data.CAMERAS, ...data.LENSES };
    const wanted = {}; // slug -> file

    for (const [slug, item] of Object.entries(items)) {
      if (!item.imageUrl) continue;
      const host = new URL(item.imageUrl).host;
      if (host !== 'upload.wikimedia.org') {
        totalOther++; otherHosts[host] = (otherHosts[host] || 0) + 1; continue;
      }
      const f = commonsFile(item.imageUrl);
      if (f) { wanted[slug] = f; totalWM++; }
      else problems.push(`${brand}/${slug}: could not parse Commons filename`);
    }

    const files = [...new Set(Object.values(wanted))];
    if (!files.length) { console.log(`${brand}: no Commons images`); continue; }
    const meta = await fetchMeta(files);

    let src = fs.readFileSync(path.join(ROOT, brand, 'data.js'), 'utf8');
    let n = 0;
    for (const [slug, file] of Object.entries(wanted)) {
      const m = meta[key(file)];
      if (!m || m.error) { problems.push(`${brand}/${slug}: ${m?.error || 'no metadata'}`); continue; }
      if (!m.licence) { problems.push(`${brand}/${slug}: no licence in metadata — REJECT`); continue; }
      if (UNFREE.test(m.licence) || !FREE.test(m.licence)) {
        problems.push(`${brand}/${slug}: licence "${m.licence}" not on the allowed list — REJECT`); continue;
      }
      if (m.restrictions) problems.push(`${brand}/${slug}: restrictions "${m.restrictions}" — review`);
      if (m.attributionRequired && !m.author) {
        problems.push(`${brand}/${slug}: attribution required but no author — REJECT`); continue;
      }
      const credit = { author: m.author, licence: m.licence, licenceUrl: m.licenceUrl, source: m.source };
      if (apply) {
        const r = patch(src, slug, credit);
        if (r.ok) { src = r.src; n++; } else problems.push(`${brand}/${slug}: patch failed (${r.why})`);
      } else {
        console.log(`  ${slug.padEnd(28)} ${(m.licence || '').padEnd(16)} ${m.author || '—'}`);
        n++;
      }
    }
    if (apply && n) { fs.writeFileSync(path.join(ROOT, brand, 'data.js'), src); wrote += n; }
    console.log(`${brand}: ${n} credit${n === 1 ? '' : 's'} ${apply ? 'written' : 'resolved (dry run)'}`);
  }

  console.log(`\nCommons images: ${totalWM}   non-Commons hotlinks: ${totalOther}`);
  console.log('non-Commons hosts (left alone, not freely licensed):');
  Object.entries(otherHosts).sort((a, b) => b[1] - a[1])
    .forEach(([h, c]) => console.log(`  ${String(c).padStart(3)}  ${h}`));
  if (problems.length) console.log('\nproblems:\n' + problems.map(p => '  ' + p).join('\n'));
  if (apply) console.log(`\nwrote ${wrote} credits — review the diff, then run npm test`);
})();
