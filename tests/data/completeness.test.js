// Tier 1 — Data completeness rules (distinct from structural schema validity).
// These enforce business expectations: every product has an image, and every
// current camera/lens is priced in all supported currencies.
//
// `priceIncomplete: true` on a lens item is an explicit acknowledgement that
// a regional RRP is genuinely unavailable (e.g. no official distribution).
// Items with this flag skip the currency-completeness check but still require
// a valid USD price. Remove the flag once the price is filled in.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand, brandDirs } = require('../helpers/load-brand');
const { CURRENCIES } = require('../helpers/schema');

// Items with no freely-licensed product image available yet. Each entry is a
// documented exception, not a silent skip — the test below fails if an
// allowlisted item later gains an image (so this list self-cleans over time).
const KNOWN_IMAGE_GAPS = {
  canon: new Set([
    'eos-r50v',          // 2025 vlogging body — no Wikimedia/Commons image yet
    'rf-85mm-f14-l-vcm', // RF 85mm f/1.4 L VCM — no Commons image yet
    // 2025–2026 RF/RF-S lenses — no freely-licensed Commons image yet
    'rf-14mm-f14-l-vcm',
    'rf-20mm-f14-l-vcm',
    'rf-45mm-f12-stm',
    'rf-20-50mm-f4-l-is-usm-pz',
    'rf-7-14mm-f28-35-l-fisheye-stm',
    'rf-16-28mm-f28-is-stm', // Commons search for this returns only the unrelated RF 28mm f/2.8 pancake
    'rf-75-300mm-f4-56',
    'rfs-14-30mm-f4-63-is-stm-pz',
    // 2020-2022 first-party RF supertelephoto/portrait primes — resolved
    // 2026-08-15: rf-600mm-f11-is-stm, rf-400mm-f28-l-is-usm, rf-24mm-f14-l-vcm,
    // rf-35mm-f14-l-vcm, rf-52mm-f28-l-dual-fisheye, rf-10-20mm-f4-l-is-stm,
    // rf-15-30mm-f45-63-is-stm, rf-28-70mm-f2-l-usm, rf-28-70mm-f28-is-stm,
    // rf-24-105mm-f28-l-is-usm-z, rf-24-240mm-f4-63-is-usm,
    // rf-70-200mm-f28-l-is-usm-z (all Commons, licence+visual verified).
    // rf-800mm-f56-l-is-usm and rf-1200mm-f8-l-is-usm have Commons candidates
    // but no legible model text on the barrel, and Canon's super-teles
    // (400/2.8, 600/4, 800/5.6, 1200/8) look near-identical in a field shot —
    // rejected, stay gaps. Remaining have no candidate at all:
    'rf-600mm-f4-l-is-usm',
    'rf-85mm-f12-l-usm-ds',
    'rf-50mm-f14-l-vcm',
    'rf-800mm-f56-l-is-usm',
    'rf-1200mm-f8-l-is-usm',
    'rfs-39mm-f35-stm-dual-fisheye',
    'rfs-78mm-f4-stm-dual',
    'rf-100-300mm-f28-l-is-usm',
    'rf-200-800mm-f63-9-is-usm',
    // Third-party RF AF lenses — no freely-licensed Commons image; manufacturer
    // image pending backfill (Viltrox 85 RF II B&H page blocks fetch; Yongnuo).
    'viltrox-85mm-f18',
    'yongnuo-35mm-f2',
    'yongnuo-85mm-f18',
    'laowa-90mm-f28-macro',
    'laowa-15mm-f2',
    'laowa-10mm-f4-cookie',
    // TTArtisan RF primes — ttartisan-500mm-f63 resolved 2026-08-15 (Commons,
    // camera-mounted shot with legible barrel text). Rest: no per-mount photo.
    'ttartisan-50mm-f14-asph',
    'ttartisan-tilt-50mm-f14',
    'ttartisan-50mm-f12',
    'ttartisan-50mm-f095',
    // 7Artisans RF primes — store photos are Shopify CDN assets keyed per
    // variant; no stable per-mount product shot. Backfill next image pass.
    '7artisans-9mm-f56',
    '7artisans-10mm-f28-ii',
    '7artisans-35mm-f14-iii'
  ]),
  fujifilm: new Set([
    'xc-16-50mm-f35-56', // no freely-licensed product image found
    // Zeiss Touit trio — discontinued, manufacturer/retailer pages block automated fetch
    'zeiss-touit-12mm-f28', 'zeiss-touit-32mm-f18', 'zeiss-touit-50mm-f28',
    // Meike — meikeglobal.com blocks automated fetch, no other direct image URL found
    'meike-33mm-f14', 'meike-55mm-f18', 'meike-85mm-f18',
    // 7Artisans — no direct manufacturer/retailer image URL found yet
    '7artisans-50mm-f18', '7artisans-25mm-f18',
    // GFX medium format line (added 2026-08-15) — no freely-licensed image sourced yet
    'gfx100-ii', 'gfx100s-ii', 'gfx100rf',
    'gf23mm-f4', 'gf30mm-f35', 'gf45mm-f28', 'gf50mm-f35', 'gf55mm-f17',
    'gf63mm-f28', 'gf80mm-f17', 'gf110mm-f2', 'gf120mm-f4-macro',
    'gf250mm-f4', 'gf500mm-f56', 'gf20-35mm-f4', 'gf32-64mm-f4',
    'gf35-70mm-f45-56', 'gf45-100mm-f4', 'gf100-200mm-f56',
    'gf30mm-f56-ts', 'gf110mm-f56-ts-macro',
    // 2025-2026 additions (refresh 2026-08-15) — no freely-licensed image sourced yet
    'sigma-12mm-f14', 'sigma-15mm-f14', 'sigma-16-300mm-f35-67', 'sigma-17-40mm-f18',
    // viltrox-85mm-f18: now discontinued (superseded by the II below); its old
    // imageUrl was actually the II's promo photo, moved to the new entry, so
    // this one is genuinely gapped rather than reusing a wrong image.
    'viltrox-85mm-f18',
    'viltrox-air-9mm-f28', 'viltrox-air-15mm-f17',
    'viltrox-28mm-f45-chip', 'viltrox-56mm-f12', 'viltrox-75mm-f18-evo', 'viltrox-90mm-f22-evo',
    'ttartisan-23mm-f18', 'ttartisan-air-17mm-f18', 'ttartisan-14mm-f35',
    'ttartisan-25mm-f2', 'ttartisan-35mm-f095', 'ttartisan-50mm-f095',
    '7artisans-25mm-f18-lite', '7artisans-35mm-f18-lite',
    'samyang-75mm-f18', 'samyang-8mm-f28', 'samyang-10mm-f28', 'samyang-12mm-f2-ncscs',
    'samyang-14mm-f28', 'samyang-16mm-f2', 'samyang-85mm-f14', 'samyang-85mm-f18',
    'samyang-100mm-f28-macro', 'samyang-135mm-f2', 'samyang-300mm-f63',
    'laowa-aksen-45mm-f28',
    'meike-55mm-f14-golden', 'meike-25mm-f17-air', 'meike-25mm-f18', 'meike-50mm-f17-ff'
  ]),
  nikon: new Set([
    // Cameras: all 10 resolved 2026-08-15 (Commons photos sourced + applied).
    // Lenses — re-run 2026-08-15 (Nikon+Panasonic lens image pass): z-dx-16-50mm-vr
    // and viltrox-27mm-f12 resolved and removed from this list. tamron-17-70mm-f28
    // has a Commons candidate (File:Tamron 17-70mm F 2.8 Di III-A VC RXD (Model
    // B070) (50829297527).jpg) but it's dated 2021-01-12 — years before this
    // lens's 2026 Nikon Z release — and shows no rear mount, so it's almost
    // certainly the original Sony E-mount (or later Fuji X) copy; rejected as
    // wrong-mount rather than confirmed. Remaining 38 have no Commons candidate
    // at all after a full sweep (script + manual per-item search).
    'z-24mm-f1-8-s', 'z-35mm-f1-2-s', 'z-58mm-f0-95-s-noct',
    'z-24-70mm-f2-8-s-ii', 'z-70-200mm-f2-8-vr-s-ii', 'z-40mm-f2-se',
    'z-dx-24mm-f1-7', 'z-dx-mc-35mm-f17', 'z-14-24mm-f2-8-s',
    'z-24-105mm-f4-71', 'z-28-135mm-f4-pz',
    'z-400mm-f2-8-tc-vr-s', 'z-600mm-f6-3-vr-s-pf', 'z-800mm-f6-3-vr-s-pf',
    'z-dx-12-28mm-pz-vr', 'z-dx-18-140mm-vr', 'z-dx-50-250mm-vr',
    'viltrox-13mm-f14', 'viltrox-16mm-f18', 'viltrox-33mm-f14', 'viltrox-56mm-f14',
    'viltrox-85mm-f18-ii', 'viltrox-24mm-f18', 'viltrox-35mm-f18-evo',
    'viltrox-40mm-f25-air', 'viltrox-85mm-f20-evo', 'viltrox-85mm-f14-pro',
    'tamron-17-70mm-f28', 'tamron-18-300mm-f35-63',
    'laowa-90mm-f28-macro', 'laowa-15mm-f2', 'laowa-10mm-f4-cookie',
    'voigtlander-nokton-40mm-f12', 'voigtlander-apo-lanthar-50mm-f2',
    'yongnuo-35mm-f2', 'yongnuo-50mm-f18',
    'ttartisan-27mm-f28', '7artisans-27mm-f28',
    'meike-85mm-f18', 'meike-85mm-f18-se-ii',
  ]),
  panasonic: new Set([
    'voigtlander-nokton-25mm-f095', 'laowa-7-5mm-f2-mft',
    // OM System M.Zuiko — omsystem-40-150mm-f4-pro, omsystem-25mm-f18,
    // omsystem-45mm-f18 resolved 2026-08-15 (Commons). omsystem-17mm-f18 has
    // a Commons candidate but its category says plain "17mm f/1.8" (the 2012
    // original) while the dataset entry is the "II" (2023 redesign) —
    // wrong-generation, rejected, stays a gap.
    'omsystem-12-40mm-f28-pro', 'omsystem-12-100mm-f4-pro', 'omsystem-17mm-f12-pro',
    'omsystem-25mm-f12-pro', 'omsystem-45mm-f12-pro', 'omsystem-60mm-f28-macro', 'omsystem-17mm-f18',
    // Sigma L-mount: 90/2.8 and 28-70/2.8 have Commons candidates (Henry
    // Söderlund photos, both undated-mount) but sibling photos in the same
    // category explicitly suffix "Sony E" when that's the mount and these
    // don't — and both are dated within weeks of each lens's Sony-E-only
    // launch — so almost certainly Sony E, not L-mount. Rejected, stay gaps.
    'voigtlander-apo-lanthar-35mm-f2-l', 'voigtlander-apo-lanthar-50mm-f2-l',
    'laowa-90mm-f28-macro-l', 'laowa-15mm-f2-l',
    'sigma-90mm-f28-dg', 'sigma-28-70mm-f28-dg', 'sigma-100-400mm-f5-63-dg',
    // Curated via scripts/fetch-images-commons.js. Cameras: s1iie, g100, s1h,
    // g100d, gx9, bs1h, s1, s5, gh5, g9 resolved 2026-08-15 (genuine
    // matching-generation photos found after the script's first-pass hits
    // returned wrong-generation photos — S1R for s1, S5D for s5, GH5 II for
    // gh5, G9 II for g9 — and were rejected). l10 has a genuine 2026-model
    // Commons candidate but its licence is suspect (CC0 tag, but Credit/Artist
    // point to an Adorama retail listing, flagged "missing SDC copyright
    // license") — rejected as likely mis-tagged, stays a gap. Remaining
    // cameras (5) have no Commons candidate at all:
    's1-ii', 's5-iix', 'g97', 'g95', 'l10',
    // Lenses — LUMIX S primes: lumix-s-50mm-f1-8 resolved 2026-08-15.
    'lumix-s-18mm-f1-8', 'lumix-s-24mm-f1-8', 'lumix-s-40mm-f2',
    'lumix-s-pro-50mm-f1-4', 'lumix-s-85mm-f1-8', 'lumix-s-100mm-f2-8-macro',
    // LUMIX G primes:
    'leica-dg-9mm-f1-7', 'leica-dg-12mm-f1-4', 'leica-dg-15mm-f1-7', 'lumix-g-20mm-f1-7-ii',
    'leica-dg-25mm-f1-4-ii', 'lumix-g-42-5mm-f1-7', 'leica-dg-200mm-f2-8',
    // LUMIX S zooms: lumix-s-20-60mm-f3-5-5-6 has a Commons candidate but the
    // only shot is a hand holding the camera at a store display — rejected
    // per the "no people holding gear" guardrail, stays a gap.
    'lumix-s-14-28mm-f4-5-6-macro', 'lumix-s-pro-16-35mm-f4', 'lumix-s-20-60mm-f3-5-5-6',
    'lumix-s-24-60mm-f2-8', 'lumix-s-24-70mm-f2-8-pro',
    'lumix-s-28-200mm-f4-7-1-macro', 'lumix-s-pro-70-200mm-f2-8',
    // LUMIX G zooms: leica-dg-10-25mm-f1-7 and leica-dg-12-60mm-f2-8-4
    // resolved 2026-08-15.
    'leica-dg-8-18mm-f2-8-4', 'lumix-g-12-32mm-f3-5-5-6',
    'lumix-g-12-60mm-f3-5-5-6', 'lumix-g-12-35mm-f2-8-ii',
    'leica-dg-25-50mm-f1-7', 'lumix-g-35-100mm-f2-8-ii', 'leica-dg-50-200mm-f2-8-4',
    'lumix-g-14-140mm-f3-5-5-6-ii', 'lumix-g-100-300mm-f4-5-6-ii', 'leica-dg-100-400mm-f4-6-3-ii',
    // Added 2026-08-08 refresh (new releases): lumix-s-18-40mm-f4-5-6-3
    // resolved 2026-08-15 (VRT-verified official press photo).
    'lumix-s-100-500mm-f5-7-1', 'leica-dg-35-100mm-f2-8-power-ois',
    // Sigma 35/1.4 DG II: maker product-image URL 404s (the 135/1.4 one resolves)
    'sigma-35mm-f14-dg-ii',
    // Viltrox/Samyang: makers host no stable product-image URL
    'viltrox-16mm-f18-l', 'viltrox-28mm-f45-l', 'samyang-14-24mm-f28-l',
    // Laowa/OM System additions (2026-08-08) — makers host no usable image URL
    // (laowa-180mm-f45-macro-l got a Commons image 2026-08-15 — removed)
    'laowa-17mm-f4-tilt-shift-l', 'omsystem-100-400mm-f5-63-ii',
    // 2026-08-16 refresh additions — new/newly-found items, no image sourced yet
    'lumix-s-26mm-f8', 'leica-dg-45mm-f28-macro', 'laowa-90mm-f28-macro-mft',
    // Older first-party MFT lenses: lumix-g-macro-30mm-f2-8 and
    // lumix-g-7-14mm-f4 resolved 2026-08-15 (Commons).
    'lumix-g-14mm-f2-5-ii', 'lumix-g-fisheye-8mm-f3-5',
    'lumix-g-x-pz-14-42mm-f3-5-5-6', 'lumix-g-35-100mm-f4-5-6',
    // Cameras backfilled 2026-08-08
    'bgh1'
  ]),
  sony: new Set([
    'sigma-90mm-f28-dg', // discontinued I-series; Sigma image URL not available
    'sigma-28-70mm-f28-dg', // Sigma product image URL not available (404)
    'sigma-100-400mm-f5-63-dg', // Sigma product image URL not available (404)
    // tamron-70-300mm: the only Commons file is the Nikon Z version (Model
    // A047Z); the Sony-E variant is A047, so this stays gapped here even though
    // the Nikon entry now carries that photo.
    'tamron-70-300mm-f45-63',
    // Tamron FE zooms — tamron-17-70mm-f28 and tamron-70-180mm-f28-g2 resolved
    // 2026-08-15 (Commons, mount confirmed via filename/description). The
    // 17-70mm photo is the SAME file rejected for the Nikon entry (dated
    // 2021-01-12, before the lens existed in any mount but Sony E — right here,
    // wrong there). tamron-35-150mm-f2-28's only Commons candidate explicitly
    // says "Nikon Z" in the filename — wrong mount, rejected, stays a gap.
    'tamron-16-30mm-f28-g2',
    'tamron-20-40mm-f28', 'tamron-35-150mm-f2-28',
    // Viltrox — viltrox-27mm-f12's only Commons candidate is the SAME photo
    // used for the Nikon entry, visually confirmed there via an explicit
    // "Nikon Z" mount marking — wrong mount here, rejected. Rest: no
    // freely-licensed image found at all.
    'viltrox-13mm-f14', 'viltrox-16mm-f18', 'viltrox-26mm-f28-evo', 'viltrox-27mm-f12', 'viltrox-33mm-f14',
    'viltrox-56mm-f14', 'viltrox-85mm-f18-ii',
    // Samyang — samyang-35mm-f18 and samyang-135mm-f18 resolved 2026-08-15
    // (Commons, "FE" in filename/barrel text confirms Sony mount).
    'samyang-24mm-f18', 'samyang-45mm-f18', 'samyang-75mm-f18',
    // Voigtländer — manufacturer image URLs pending backfill
    'voigtlander-apo-lanthar-35mm-f2', 'voigtlander-apo-lanthar-50mm-f2', 'voigtlander-nokton-40mm-f12',
    // Laowa — Venus Optics image URLs pending backfill
    'laowa-90mm-f28-macro', 'laowa-15mm-f2', 'laowa-10mm-f4-cookie',
    // Zeiss — zeiss-batis-25mm-f2, zeiss-batis-85mm-f18, zeiss-touit-32mm-f18
    // resolved 2026-08-15 (Commons; Batis is Sony-E-exclusive so no mount
    // ambiguity, Touit confirmed via NEX-mounted photo). Loxia still gapped.
    'zeiss-loxia-35mm-f2',
    // 7Artisans / TTArtisan / Meike — product image URLs pending backfill
    '7artisans-27mm-f28', 'ttartisan-27mm-f28', 'meike-85mm-f18',
    // Cameras: fe-... — a7-v's only Commons candidate shows just the generic
    // "α7" body badge, which every a7-series generation shares, and the file
    // carries no confirming category (just "needs categories") — classic
    // generation-trap, rejected. fx5/fx2/a6100 have no candidate at all.
    'a7-v',
    'fx5',
    'fx2', // 2025 Cinema Line camera added Aug 2026 refresh; no Commons photo yet
    'a6100',
    // Aug 2026 refresh additions — resolved 2026-08-15: fe-16mm-f18-g,
    // fe-20mm-f18-g, fe-28mm-f2, fe-35mm-f14-za, fe-50mm-f14-za, fe-55mm-f18-za,
    // fe-100mm-f28-macro-gm, fe-600mm-f4-gm (store placard reads "SEL600F40GM"),
    // fe-16-35mm-f28-gm-ii, fe-16-35mm-f28-gm, fe-16-35mm-f4-pz-g,
    // fe-16-35mm-f4-za-oss, fe-24-70mm-f4-za-oss, e-10-18mm-f4-oss (rear-mount
    // view, description confirms E-mount), e-16-50mm-f35-56-pz-oss,
    // e-18-105mm-f4-g-oss-pz, e-18-135mm-f35-56-oss, e-70-350mm-f45-63-g-oss
    // (store placard reads model number). fe-400mm-f28-gm and
    // fe-70-200mm-f4-g-oss (two-lens comparison photo) and
    // fe-200-600mm-f56-63-g-oss (Commons Restrictions:"personality" — explicit
    // reject) and e-16mm-f28 (multi-lens lineup photo, not a dedicated shot)
    // were found but rejected; rest have no candidate:
    'fe-100-400mm-f45-gm-oss', 'fe-100-400mm-f56-8-oss',
    'sigma-35mm-f14-dg-ii', 'tamron-12-20mm-f28',
    'fe-300mm-f28-gm', 'fe-400mm-f28-gm',
    'fe-35mm-f18',
    'fe-50mm-f28-macro', 'fe-35mm-f28-za',
    'e-16mm-f28', 'e-20mm-f28', 'e-24mm-f18-za',
    'fe-12-24mm-f28-gm', 'fe-16-25mm-f28-g',
    'fe-24-50mm-f28-g', 'fe-28-70mm-f2-gm',
    'fe-28-70mm-f35-56-oss-ii', 'fe-70-200mm-f4-macro-g-oss-ii', 'fe-70-200mm-f4-g-oss',
    'fe-100-400mm-f45-63-gm-oss', 'fe-200-600mm-f56-63-g-oss',
    'fe-400-800mm-f63-8-g-oss',
    'e-16-50mm-f35-56-pz-oss-ii', 'e-16-55mm-f28-g'
  ]),
};

for (const brand of brandDirs()) {
  const { data } = loadBrand(brand);
  const gaps = KNOWN_IMAGE_GAPS[brand] || new Set();

  test(`[${brand}] every camera and lens has a product image`, () => {
    const missing = [];
    const staleAllow = [];
    const sweep = (collection, kind) => {
      for (const [id, item] of Object.entries(collection)) {
        if (!item.imageUrl) { if (!gaps.has(id)) missing.push(`${kind} ${id}`); }
        else if (gaps.has(id)) staleAllow.push(id);
      }
    };
    sweep(data.CAMERAS, 'camera');
    sweep(data.LENSES, 'lens');
    assert.deepEqual(missing, [], `\n${missing.length} item(s) missing imageUrl:\n${missing.join('\n')}`);
    assert.deepEqual(staleAllow, [],
      `\nThese now have an image — remove them from KNOWN_IMAGE_GAPS[${brand}]:\n${staleAllow.join('\n')}`);
  });

  test(`[${brand}] every current camera is priced in all currencies`, () => {
    const gaps = [];
    for (const [id, c] of Object.entries(data.CAMERAS)) {
      if (c.discontinued) continue; // discontinued bodies legitimately show USD only
      for (const cur of CURRENCIES) {
        if (c.prices[cur] == null) gaps.push(`${id}: missing ${cur}`);
      }
    }
    assert.deepEqual(gaps, [], `\n${gaps.length} current-camera price gap(s):\n${gaps.join('\n')}`);
  });

  test(`[${brand}] every current lens is priced in all currencies`, () => {
    const gaps = [];
    for (const [id, l] of Object.entries(data.LENSES)) {
      if (l.discontinued) continue;   // discontinued lenses show USD only
      if (l.priceIncomplete) continue; // explicit acknowledgement — no regional RRP available
      for (const cur of CURRENCIES) {
        if (l.prices[cur] == null) gaps.push(`${id}: missing ${cur}`);
      }
    }
    assert.deepEqual(gaps, [], `\n${gaps.length} current-lens price gap(s):\n${gaps.join('\n')}`);
  });
}
