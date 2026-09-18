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
// Rebased to 87 on 2026-09-18 (owner-approved at the add-leica-brand kickoff):
// Leica sells almost entirely through its own stores, not Amazon, so its
// current items overwhelmingly lack a genuine plain-new ASIN (confirmed
// per-item during research — Amazon listings found were consistently
// used-only, bundles, or nonexistent). This is a narrow, incremental rebase
// (+1) covering only what today's Leica lens batch (task 6.1/6.2) actually
// needs; the full Leica ASIN pass + a final rebase happens at task 7.6, once
// every current Leica item (including the M-mount lenses still to come) has
// had a real attempt. Current Leica items counted against this baseline as
// of this rebase: sl3-p, sl3-s, sl3, q3-monochrom, d-lux-8, m-ev1, m11-d,
// m11-p, m11-monochrom, m11, super-apo-summicron-sl-21mm-f2-asph,
// apo-summicron-sl-50mm-f2-asph, summilux-sl-50mm-f14-asph,
// vario-elmarit-sl-24-70mm-f28-asph, apo-summicron-sl-28mm-f2-asph,
// apo-summicron-sl-35mm-f2-asph, apo-summicron-sl-75mm-f2-asph,
// apo-summicron-sl-90mm-f2-asph, apo-macro-elmarit-sl-100mm-f28,
// super-vario-elmarit-sl-14-24mm-f28-asph,
// super-vario-elmar-sl-16-35mm-f35-45-asph, vario-elmarit-sl-70-200mm-f28-asph,
// apo-vario-elmarit-sl-90-280mm-f28-4, vario-elmar-sl-100-400mm-f5-63 (24 items).
//
// Rebased to 93 on 2026-09-18 (same batch of work, next commit): task 6.3a
// added 6 more current M lenses (Noctilux-M 35/50-f0.95/50-f1.2/75, and
// Summilux-M 50-ASPH/50-Classic), all null-ASIN for the same reason —
// +6 named: noctilux-m-35mm-f12-asph, noctilux-m-50mm-f095-asph,
// noctilux-m-50mm-f12-asph, noctilux-m-75mm-f125-asph,
// summilux-m-50mm-f14-asph, summilux-m-50mm-f14-classic. (A 7th researched
// lens, Summilux-M 90 f/1.5 ASPH, was left OUT of the dataset entirely — no
// USD price could be sourced anywhere, so it doesn't count here either.)
// Rebased to 97 on 2026-09-18 (task 6.3b, same batch of work): +4 more
// current M primes, same reason — summilux-m-21mm-f14-asph,
// summilux-m-28mm-f14-asph, summilux-m-35mm-f14-steel-rim,
// summilux-m-35mm-f14-asph. (Summilux-M 24mm f/1.4 ASPH was researched but
// confirmed discontinued and left out entirely, per task 1.4's scope call —
// doesn't count here either.)
const ASIN_GAP_BASELINE = 97;

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
