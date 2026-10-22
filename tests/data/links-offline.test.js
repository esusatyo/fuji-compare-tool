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
  'sg-image.com',
  // Thypoch's official Shopify store (productUrl) and site (spec tables).
  'thypoch.com',
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
  ['sony productUrl https://www.venuslens.net/product/laowa-aksen-ultra-macro-apo/', 2],
  ['nikon productUrl https://www.venuslens.net/product/laowa-aksen-ultra-macro-apo/', 2],
  // Panasonic carries both Aksens twice (L-Mount and MFT): one page, and one
  // maker photo per lens for both mounts.
  ['panasonic productUrl https://www.venuslens.net/product/laowa-aksen-ultra-macro-apo/', 4],
  ['panasonic imageUrl https://www.laowalenses.ca/wp-content/uploads/2026/07/02_VEAKSEN4528FE-scaled-1-768x768.jpg', 2],
  ['panasonic imageUrl https://www.laowalenses.ca/wp-content/uploads/2026/07/01_VEAKSEN17517FE-CO-scaled-1-768x768.jpg', 2],
  ['olympus productUrl https://www.venuslens.net/product/laowa-aksen-ultra-macro-apo/', 2],
  ['leica productUrl https://www.venuslens.net/product/laowa-aksen-ultra-macro-apo/', 2],
  // Laowa sells the RL lenses' L-Mount and Leica M versions off one page
  // each; Leica's page carries both.
  ['leica productUrl https://www.venuslens.net/product/laowa-9mm-f-5-6-ff-rl/', 2],
  ['leica productUrl https://www.venuslens.net/product/laowa-11mm-f-4-5-ff-rl/', 2],
  ['leica productUrl https://www.venuslens.net/product/14mm-f4-ff-rl-zero-d/', 2],
  // SG-image 50mm f/1.8 Shaped Aperture — one listing and photo for every mount;
  // Panasonic carries it in L and MFT.
  ['panasonic imageUrl https://cdn.shopify.com/s/files/1/0729/5051/3889/files/13_3eaacd43-9a62-4582-b9de-bb3063ec86c2.png', 2],
  ['panasonic productUrl https://www.sg-image.com/products/50mm-f1-8-mf-full-frame-lens-with-shaped-aperture', 2],
  // Zeiss has one page (with a per-lens Technical Data table) per lens line.
  ['sony productUrl https://www.zeiss.com/photonics-and-optics/us/photography/products/lenses-for-mirrorless-system-cameras/batis-lenses.html', 5],
  ['sony productUrl https://www.zeiss.com/photonics-and-optics/us/photography/products/lenses-for-mirrorless-system-cameras/touit-lenses.html', 3],
  ['sony productUrl https://www.zeiss.com/photonics-and-optics/us/photography/products/lenses-for-mirrorless-system-cameras/otus-ml-lenses.html', 3],
  ['nikon productUrl https://www.zeiss.com/photonics-and-optics/us/photography/products/lenses-for-mirrorless-system-cameras/otus-ml-lenses.html', 3],
  ['leica productUrl https://www.zeiss.com/photonics-and-optics/us/photography/products/lenses-for-rangefinder-cameras/zm-lenses.html', 9],
  // 7Artisans sells the 25/35/50mm f/1.8 Lite trio as ONE listing with mount and
  // focal-length variants; the photo is the maker's official family shot showing
  // all three barrels. Verified visually 2026-09-07.
  ['nikon imageUrl https://7artisans.store/cdn/shop/files/2342434.jpg', 3],
  ['nikon productUrl https://7artisans.store/products/af-25-35-50mm-f1-8-aps-c-lens-for-e-fx-z', 3],
  ['sony imageUrl https://cdn.shopify.com/s/files/1/0555/8504/6736/files/2342434.jpg', 3],
  ['sony productUrl https://7artisans.store/products/af-25-35-50mm-f1-8-aps-c-lens-for-e-fx-z', 3],
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
// Rebased to 82 on 2026-09-26 by the Sigma/Olympus data refresh: two Sigma
// lenses announced 2026-09-08 and shipping 2026-10-06 have no Amazon listing
// yet, in both mounts they launched in (sigma/ and sony/ sigma-85mm-f12-dg,
// sigma-20-60mm-f28-4-dg). Population change, not a coverage regression;
// next ASIN pass candidates.
// Tightened to 78 the same day: the Leica ASIN pass filled four Leica gaps
// (summicron-m-50mm-f2, apo-telyt-m-135mm-f34, summaron-m-28mm-f56,
// summilux-m-50mm-f14-classic).
// Rebased to 79: six Leica lenses were added; five got ASINs, but
// leica/super-elmar-m-21mm-f34-asph is only listed on Amazon inside
// accessory bundles, so it has none yet.
// Rebased to 81 by the post-#68 follow-ups: Panasonic now also carries the
// two unreleased Sigma L-Mount lenses (panasonic/sigma-85mm-f12-dg,
// panasonic/sigma-20-60mm-f28-4-dg) -- still no Amazon listing.
// Tightened to 80 in the same follow-ups: leica/super-elmar-m-21mm-f34-asph
// got a plain (non-bundle) listing, B00579W0DE.
// Tightened to 75 on 2026-10-10: the four post-#65 releases got listings
// (canon/eos-r8-ii, panasonic/lumix-s-20mm-f2-5, sony/fe-400mm-f45-gm-oss,
// sony/fe-600mm-f63-gm-oss), plus fujifilm/samyang-85mm-f18 (sold on
// amazon.com under Samyang's US brand, Rokinon RK8518). Each title was read
// on amazon.com in a real browser before applying; the same pass re-read all
// 46 existing Leica ASINs and found each on its stated product. The 7
// remaining Leica gaps still have no plain listing.
// Tightened to 57 the same day: 18 Sigma lenses got their original "DG DN"
// listing (L-Mount ASIN shared by sigma/ and panasonic/, Sony E by sony/):
// 17mm f/4, 20mm f/2, 24mm f/2 (L only), 35mm f/2, 65mm f/2, 90mm f/2.8,
// plus sigma/sigma-300-600mm-f4-dg. Amazon also lists 2025 "DG" / "DG II"
// re-releases of several of these; those were deliberately not used, since
// they may be a different product from the DG DN entries stored here.
// Tightened to 45 the same day by a full pass over the remaining gaps (each
// title read on amazon.com): canon/samyang-14mm-f28 (Rokinon RF14),
// nikon/tamron-12-20mm-f28, olympus/om-3, om-3-astro, pen-om,
// omsystem-25mm-f18-ii (also panasonic/), omsystem-14-42mm-f35-56-iii,
// panasonic/omsystem-17mm-f12-pro, sony/fe-100-400mm-f56-8-oss,
// sony/sigma-24mm-f2-dg, sigma/sigma-14-24mm-f28-dg. Still open, with the
// reason: no amazon.com listing in that mount (most Laowa and Voigtländer Z,
// Laowa MFT and L, Samyang 14-24 L, Viltrox 85 II RF, Meike 25 Air X, Sony
// FX5, the 2026 Sigma 85mm f/1.2 and 20-60mm); only a 2025 "DG"/"DG II"
// re-release listed (Sigma 45mm, 50mm); listing doesn't name the mount or
// version (Yongnuo YN56, Meike 55mm, Meike 85mm); 7 Leica (bundles only).
// Tightened to 44 on 2026-10-11, net of a new-release pass: +8 new items
// (nikon/z5-iic, sigma-50-120mm-f28 in sony/fujifilm/canon, and 4 Viltrox
// Air L primes in panasonic/), of which the 4 Viltrox got listings; the
// Z5IIC and 50-120 aren't on amazon.com yet. Also closed 5 Sigma gaps:
// 45mm f/2.8 (sigma/, panasonic/ via the renewed "DG (Black)" listing,
// which Sigma states is the same optics; sony/ via the original DG DN
// listing) and 50mm f/2 L (sigma/, panasonic/, original DG DN listing).
// Raised to 47 on 2026-10-13 by the Fujifilm SG-image/Laowa additions, none
// of which has an X-mount amazon.com listing: sgimage-55mm-f18 (only the Z
// listing, B0H765VW8R), laowa-4-5-10mm-f28-fisheye, laowa-8-16mm-f35-5 and
// laowa-12-24mm-f56-shift (Laowa's 12-24 has only a Z listing).
// Raised to 50 on 2026-10-19 by the Fujifilm older-third-party pass
// (add-fujifilm-older-thirdparty-lenses): of 10 new 7Artisans lenses, 7 got
// X-mount listings; 7artisans-6mm-f2 and 7artisans-50mm-f14-tilt have none
// found, and 7artisans-10mm-f35's only listing doesn't name the mount.
// Raised to 58 the same day: the 8 SG-image manual-focus lenses have no
// amazon.com listings in any mount (site:amazon.com search, 2026-10-19).
// Sony missing-lens pass (add-sony-missing-thirdparty-lenses, 2026-10-19+):
// ~180 lenses are being added in maker batches without per-lens ASIN
// lookups; ASINs are backfilled afterwards with the check-prices-and-buy-links
// skill, which then tightens this back down. +21 Viltrox, +32 Samyang, +17 Sigma, +14 Tamron,
// +35 Laowa, +13 Voigtländer, +9 Zeiss (8 new + Batis 85, now current again),
// +19 TTArtisan, +28 7Artisans, +12 Meike, +13 Thypoch/SG-image.
// Nikon missing-lens pass (add-nikon-missing-thirdparty-lenses, 2026-10-21+),
// same approach: +1 Tamron, +14 Laowa, +2 Voigtländer, +3 Zeiss, +7 TTArtisan,
// +13 7Artisans, +4 Meike, +13 Thypoch/SG-image.
// Panasonic/Leica missing-lens pass (add-panasonic-leica-missing-thirdparty-
// lenses, 2026-10-22+): copies of entries already in another brand file carry
// that entry's asin, so only the ones that had none add a gap — +4 Sigma L /
// Leica SL copies, +1 Samyang L, +19 Laowa L, +6 TTArtisan L,
// +11 7Artisans L, +2 Meike L, +2 SG-image L, +22 Laowa MFT (11 each in
// panasonic and olympus), +10 Voigtländer MFT (5 each),
// +14 SG-image MFT, +26 Samyang MFT (7 / 13 each), +24 TTArtisan/7Artisans
// MFT (12 each), +49 Leica L-Mount copies of Panasonic's LUMIX S /
// third-party entries that have no asin, +29 Voigtländer VM, +9 Zeiss ZM,
// +19 TTArtisan/7Artisans/Laowa/Thypoch M (Leica).
const ASIN_GAP_BASELINE = 575;

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
