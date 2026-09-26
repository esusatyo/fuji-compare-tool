// Tier 1 — Offline link and ASIN hygiene across every brand.
//
// Delivered early from the `expand-correctness-tests` change, because the Sigma
// port is what first created same-mount duplicate URLs and ASINs.
//
// The central lesson encoded here: **duplication in this dataset is usually
// legitimate.** One maker product page and one product photo routinely serve
// every mount of the same optic, and Amazon lists mount variants under a single
// parent ASIN. A global uniqueness rule would fire on ~98 correct rows. So the
// URL guard is scoped *within* a brand and backed by a reviewed allowlist, and
// the ASIN guard checks coherence (same maker, same product) rather than
// uniqueness.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand, brandDirs } = require('../helpers/load-brand');

// Suffix allowlist: manufacturer sites, their CDNs, Wikimedia, and the handful
// of retailers used where no maker page survives. Adding a host is deliberate.
const ALLOWED_HOSTS = [
  'wikimedia.org', 'wikipedia.org',
  'sigma-global.com', 'panasonic.com', 'panasonic.jp', 'sony.com', 'fujifilm-x.com',
  'fujifilm-x.b-cdn.net', 'nikonusa.com', 'nikon.com', 'cosina.co.jp',
  // Regional TLDs are separate suffixes — 'canon.com' does not cover 'canon.com.au'.
  'canon.com', 'canon.com.au', 'sony.com.au',
  'viltrox.com', 'venuslens.net', 'ttartisan.store', 'ttartisan.com', '7artisans.store',
  'samyangus.com', 'lksamyang.com', 'tamron-americas.com', 'tamron.com',
  'meikeglobal.com', 'yongnuo.eu', 'hkyongnuo.com', 'omsystem.com', 'zeiss.com',
  'laowa.com.au', 'laowalenses.ca', 'pergear.com', 'voigtlaender.de', 'leica-camera.com',
  // DPReview: used as productUrl for a handful of discontinued Leica Q
  // bodies whose own leica-camera.com pages are gone (task 5.6). Already
  // trusted as a footerLinks source across several brands.
  'dpreview.com',
  // bigcommerce.com (leicacamerausa.com's storefront CDN): used for the
  // APO-Summicron-SL 75mm's image — leica-camera.com's own og:image for
  // that lens is broken (points to an unrelated product), verified
  // visually against this CDN photo instead (task 6.1/6.2).
  'bigcommerce.com',
  // leicastoremiami.com (authorized US dealer): used for two Summicron-M
  // images where leica-camera.com's own og:image resolves to an unrelated
  // product (task 6.4) — same recurring pattern as the SL 75mm above.
  'leicastoremiami.com',
  // CDNs and storefront hosts backing the above.
  'cdn.shopify.com', 'commercetools.com', 'cs.1worldsync.com', 'cloudfront.net',
  'foto-erhardt.de', 'contentstack.io', 'etoren.com', 'bhphotovideo.com',
];

const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

/**
 * Within-brand duplicate links that are correct, each checked by hand.
 * Keyed by `<brand> <field>` -> the shared URL. A *new* duplicate still fails.
 */
const KNOWN_SHARED_LINKS = new Map([
  // Fujifilm retired the per-model pages for its discontinued bodies; the
  // generic camera index is the only maker URL left for all 20.
  ['fujifilm productUrl https://www.fujifilm-x.com/global/products/cameras/', 20],
  // Laowa sells the Aksen 45mm and 17.5mm off one product page.
  ['fujifilm productUrl https://www.venuslens.net/product/laowa-aksen-ultra-macro-apo/', 2],
  // 7Artisans sells the 25/35/50mm f/1.8 Lite trio as ONE listing with mount and
  // focal-length variants; the photo is the maker's official family shot showing
  // all three barrels. Verified visually 2026-09-07.
  ['nikon imageUrl https://7artisans.store/cdn/shop/files/2342434.jpg', 3],
  ['nikon productUrl https://7artisans.store/products/af-25-35-50mm-f1-8-aps-c-lens-for-e-fx-z', 3],
  // Same Laowa 90mm optic in L and MFT — one maker page, one photo.
  ['panasonic imageUrl https://www.venuslens.net/wp-content/uploads/2022/06/Laowa_90mmF282XMacroAPO_1-700x482.jpg', 2],
  ['panasonic productUrl https://www.venuslens.net/product/laowa-90mm-f-2-8-2x-macro-apo/', 2],
]);

// Non-discontinued items without an ASIN. A null ASIN is a degraded Buy link
// (the engine falls back to an Amazon search), not a broken one — so this
// ratchets downward rather than demanding zero.
//
// History: 74 before the Sigma ASIN pass -> 61 after it. Rebased to 86 on
// 2026-09-09 when 25 lenses were corrected from `discontinued: true` to current
// (8 I-series primes across panasonic/sigma/sony, plus Sony's 35mm F1.4 DG DN).
// That grew the denominator; it is NOT a coverage regression. Rebase only for a
// population change like this, and say why — otherwise tighten, never loosen.
//
// Rebased to 74 on 2026-09-22 (add-leica-brand, task 7.6 — the real ASIN
// pass, replacing the change's earlier incremental bumps with one clean
// final number, per the plan agreed at kickoff). Tasks 6.1-6.5 had pushed
// this baseline up to 108 as current SL/M lenses were entered with a
// placeholder null ASIN and a documented assumption ("Leica sells almost
// entirely through its own stores, not Amazon") rather than a real per-item
// search. Task 7.6 ran that search for all 45 of Leica's current items and
// found a genuine plain-new-product ASIN (not a bundle/Renewed/International
// listing, and — for the M lenses with a currently-sold revision distinct
// from an older discontinued one — confirmed as the current revision) for
// 34 of them, applied to the dataset. That cuts Leica's own gap from 45 to
// 11 and this cross-brand baseline from 108 to 74. Leica's remaining 11, all
// with no confident ASIN after a genuine attempt: sl3-p (too new, not yet
// listed), apo-macro-elmarit-sl-100mm-f28 (brand-new, not yet shipping),
// noctilux-m-35mm-f12-asph, summilux-m-21mm-f14-asph and
// summilux-m-35mm-f14-steel-rim (no Amazon.com listing found at all),
// noctilux-m-50mm-f095-asph, summilux-m-50mm-f14-classic, summicron-m-50mm-f2,
// summaron-m-28mm-f56 and apo-telyt-m-135mm-f34 (the correct lens exists on
// Amazon only bundled with accessories, no plain listing), and
// summicron-m-35mm-f2-asph (a candidate ASIN exists but its listing doesn't
// explicitly confirm the current "V2"/11673 revision rather than its
// discontinued predecessor — left out per this dataset's lens-revision
// caution, learned the hard way at task 6.4).
//
// Rebased to 78 on 2026-09-25 when main (#65, the Sept 2026 camera data
// refresh) was merged into add-leica-brand: it added four current items that
// have no ASIN yet — canon/eos-r8-ii, panasonic/lumix-s-20mm-f2-5,
// sony/fe-400mm-f45-gm-oss, sony/fe-600mm-f63-gm-oss. A population change,
// not a coverage regression (Leica's own gap stays at 11); each is a
// candidate for the next ASIN pass.
// Rebased to 80 on 2026-09-26 by the Sigma/Olympus data refresh: two Sigma
// lenses announced 2026-09-08 and shipping 2026-10-06 (sigma/sigma-85mm-f12-dg,
// sigma/sigma-20-60mm-f28-4-dg) have no Amazon listing yet. Population change,
// not a coverage regression; next ASIN pass candidates.
const ASIN_GAP_BASELINE = 80;

const allItems = () => brandDirs().flatMap(brand => {
  const { data } = loadBrand(brand);
  return Object.entries({ ...data.CAMERAS, ...data.LENSES })
    .map(([id, item]) => ({ brand, id, item }));
});

test('every imageUrl and productUrl is a valid https URL on an allowed host', () => {
  const bad = [];
  for (const { brand, id, item } of allItems()) {
    for (const field of ['imageUrl', 'productUrl']) {
      const raw = item[field];
      if (!raw) continue;
      let url;
      try { url = new URL(raw); } catch { bad.push(`${brand}/${id} ${field}: unparseable ${raw}`); continue; }
      if (url.protocol !== 'https:') bad.push(`${brand}/${id} ${field}: not https — ${raw}`);
      if (!ALLOWED_HOSTS.some(h => url.host === h || url.host.endsWith(`.${h}`))) {
        bad.push(`${brand}/${id} ${field}: host "${url.host}" not in ALLOWED_HOSTS`);
      }
    }
  }
  assert.deepEqual(bad, [], `\n${bad.join('\n')}`);
});

test('every imageUrl points at an image file', () => {
  const bad = [];
  for (const { brand, id, item } of allItems()) {
    if (!item.imageUrl) continue;
    const path = new URL(item.imageUrl).pathname.toLowerCase();
    if (!IMAGE_EXT.some(ext => path.endsWith(ext))) {
      bad.push(`${brand}/${id}: imageUrl has no image extension — ${item.imageUrl}`);
    }
  }
  assert.deepEqual(bad, [], `\n${bad.join('\n')}`);
});

test('no unreviewed duplicate imageUrl or productUrl within a brand', () => {
  // Deliberately per-brand: the same maker page and photo legitimately serve
  // every mount, so cross-brand duplicates are expected and not compared.
  const bad = [];
  for (const brand of brandDirs()) {
    const { data } = loadBrand(brand);
    const items = Object.entries({ ...data.CAMERAS, ...data.LENSES });
    for (const field of ['imageUrl', 'productUrl']) {
      const byUrl = new Map();
      for (const [id, item] of items) {
        if (!item[field]) continue;
        if (!byUrl.has(item[field])) byUrl.set(item[field], []);
        byUrl.get(item[field]).push(id);
      }
      for (const [url, ids] of byUrl) {
        if (ids.length < 2) continue;
        const allowed = KNOWN_SHARED_LINKS.get(`${brand} ${field} ${url}`);
        if (allowed !== ids.length) {
          bad.push(`${brand} ${field} shared by ${ids.length} items (allowlist: ${allowed ?? 'none'})`
            + `\n    ${url}\n    ${ids.join(', ')}`);
        }
      }
    }
  }
  assert.deepEqual(bad, [], `\n${bad.join('\n')}`);
});

test('items sharing an ASIN describe the same product', () => {
  // Sharing is legitimate — Amazon lists mount variants of one lens under a
  // single parent ASIN. What must hold is that the entries agree on who makes
  // it and roughly what it is.
  const byAsin = new Map();
  for (const { brand, id, item } of allItems()) {
    if (!item.asin) continue;
    if (!byAsin.has(item.asin)) byAsin.set(item.asin, []);
    byAsin.get(item.asin).push({ brand, id, item });
  }

  // Compare on the distinguishing tokens, ignoring mount/branding words that
  // legitimately differ between a lens's RF and X copies.
  const MOUNT_WORDS = /\b(rf|rf-s|ef|ef-s|fe|e|x|z|l|dx|dg|dn|mft|m43|sa|mount|for)\b/gi;
  const tokens = name => new Set(
    String(name).toLowerCase().replace(MOUNT_WORDS, ' ')
      .replace(/[^a-z0-9.]+/g, ' ').trim().split(/\s+/).filter(Boolean));

  const bad = [];
  for (const [asin, group] of byAsin) {
    if (group.length < 2) continue;
    const makers = new Set(group.map(g => g.item.manufacturer ?? `camera:${g.brand}`));
    if (makers.size > 1) {
      bad.push(`ASIN ${asin} spans manufacturers ${[...makers].join(' / ')}: `
        + group.map(g => `${g.brand}/${g.id}`).join(', '));
      continue;
    }
    const [first, ...rest] = group;
    const base = tokens(first.item.name);
    // Name-token overlap alone is too blunt: two different Tamron zooms score
    // 0.70 purely on shared boilerplate ("tamron di iii rxd f/2.8"). So the
    // optical signature — focal length and max aperture — is the real check,
    // and the name check only backstops items that lack those fields.
    const optics = i => [i.focalLength, i.focalLengthMin, i.focalLengthMax, i.maxAperture].join('/');
    for (const other of rest) {
      if (first.item.maxAperture != null && other.item.maxAperture != null) {
        if (optics(first.item) !== optics(other.item)) {
          bad.push(`ASIN ${asin} spans different optics: `
            + `"${first.item.name}" (${optics(first.item)}) vs `
            + `"${other.item.name}" (${optics(other.item)})`);
        }
        continue;
      }
      const cmp = tokens(other.item.name);
      const shared = [...base].filter(t => cmp.has(t)).length;
      const overlap = shared / Math.max(base.size, cmp.size, 1);
      if (overlap < 0.6) {
        bad.push(`ASIN ${asin} names diverge (${overlap.toFixed(2)} overlap): `
          + `"${first.item.name}" (${first.brand}) vs "${other.item.name}" (${other.brand})`);
      }
    }
  }
  assert.deepEqual(bad, [], `\n${bad.join('\n')}`);
});

test('ASIN coverage does not regress', () => {
  const missing = allItems().filter(({ item }) => !item.discontinued && !item.asin);
  assert.ok(missing.length <= ASIN_GAP_BASELINE,
    `${missing.length} current items lack an asin, above the ${ASIN_GAP_BASELINE} baseline:\n`
    + missing.map(m => `  ${m.brand}/${m.id}`).join('\n'));
});
