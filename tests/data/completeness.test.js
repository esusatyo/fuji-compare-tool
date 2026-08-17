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
    // eos-r50v resolved 2026-08-17 (Tier 3 manufacturer hotlink, canon.com.au —
    // usa.canon.com geo-blocks non-US traffic). All 18 first-party RF/RF-S
    // lenses that were still gapped (rf-14mm-f14-l-vcm, rf-20mm-f14-l-vcm,
    // rf-45mm-f12-stm, rf-85mm-f14-l-vcm, rf-600mm-f4-l-is-usm,
    // rf-85mm-f12-l-usm-ds, rf-50mm-f14-l-vcm, rf-1200mm-f8-l-is-usm,
    // rfs-39mm-f35-stm-dual-fisheye, rfs-78mm-f4-stm-dual,
    // rf-20-50mm-f4-l-is-usm-pz, rf-7-14mm-f28-35-l-fisheye-stm,
    // rf-16-28mm-f28-is-stm, rf-100-300mm-f28-l-is-usm,
    // rf-200-800mm-f63-9-is-usm, rf-75-300mm-f4-56,
    // rfs-14-30mm-f4-63-is-stm-pz) resolved the same day via canon.com.au
    // product-carousel images, barrel text visually confirmed for every one.
    //
    // rf-800mm-f56-l-is-usm and rf-1200mm-f8-l-is-usm's Commons candidate
    // (used only for the 800) has no legible model text on the barrel, and
    // Canon's super-teles (400/2.8, 600/4, 800/5.6, 1200/8) look near-identical
    // in a field shot — rejected, stays a gap. Re-checked 2026-08-16 at full
    // resolution (crop of the front barrel): still blank, no printed
    // designation anywhere visible. The focus-limiter switch reads
    // "2.6m-20m", far closer to the 400mm f/2.8's ~2.5m MFD than the 800mm
    // f/5.6's ~6m — actively suggests this is a mislabeled 400mm f/2.8
    // photo, not weak evidence either way. rf-1200mm-f8-l-is-usm itself
    // resolved 2026-08-17 via its own canon.com.au page instead.
    'rf-800mm-f56-l-is-usm',
    // viltrox-85mm-f18 (RF II): Viltrox pulled this lens from their own site
    // entirely — Canon blocks third-party AF lens licensing on RF, so
    // viltroxcamera.com now only lists the Sony E-mount version. No official
    // manufacturer page exists to source from; B&H/retailer photos aren't an
    // acceptable substitute per this skill's sourcing tiers. Stays a gap
    // until Viltrox (or Canon's policy) changes.
    'viltrox-85mm-f18',
    // yongnuo-35mm-f2, yongnuo-85mm-f18: resolved 2026-08-17 (Tier 3,
    // yongnuo.eu — both images carry an explicit "R mount / Full Frame"
    // badge overlay confirming Canon RF, despite the 85mm page's body copy
    // being a template error describing Fujifilm X-mount).
    // laowa-90mm-f28-macro, laowa-15mm-f2, laowa-10mm-f4-cookie: resolved
    // 2026-08-17 (Tier 3, venuslens.net + laowa.com.au — Canon RF confirmed
    // as a selectable mount on each page; the Cookie's image goes further,
    // showing the lens mounted on an actual Canon EOS R6 body).
    // ttartisan-50mm-f14-asph, ttartisan-tilt-50mm-f14, ttartisan-50mm-f12,
    // ttartisan-50mm-f095, 7artisans-9mm-f56, 7artisans-10mm-f28-ii,
    // 7artisans-35mm-f14-iii: resolved 2026-08-17 (Tier 3, ttartisan.store /
    // 7artisans.store — Canon RF/EOS-R confirmed as a selectable mount on
    // each page; none of the photos show mount-specific markings since
    // these are manual lenses with an identical front barrel across
    // mounts, but nothing in any image contradicts the confirmed RF
    // availability). ttartisan-500mm-f63 resolved earlier, 2026-08-15
    // (Commons, camera-mounted shot with legible barrel text).
  ]),
  fujifilm: new Set([
    // 38 ids resolved 2026-08-17 (manufacturer product-image sourcing sweep):
    // xc-16-50mm-f35-56; all 17 first-party GF lenses (gf23mm-f4 through
    // gf110mm-f56-ts-macro) via fujifilm-x.com product pages
    // (fujifilm-x.b-cdn.net assets, barrel text confirmed on every one); all
    // 4 Sigma entries via sigma-global.com (each page states "FUJIFILM X
    // MOUNT" in its Available Mounts list); viltrox-air-9mm-f28,
    // viltrox-air-15mm-f17, viltrox-28mm-f45-chip, viltrox-56mm-f12,
    // viltrox-75mm-f18-evo, viltrox-90mm-f22-evo via viltroxcamera.com
    // (viltrox-56mm-f12's first candidate image was caught showing the WRONG
    // mount — barrel read "AF 56/1.2 E" on a visible Sony body — corrected to
    // the XF-marked photo); and all 10 TTArtisan entries (ttartisan-23mm-f18,
    // ttartisan-air-17mm-f18, ttartisan-14mm-f35, ttartisan-25mm-f2,
    // ttartisan-50mm-f095, ttartisan-35mm-f095, ttartisan-tilt-35mm-f14,
    // ttartisan-10mm-f2-asph, ttartisan-35mm-f14, ttartisan-7-5mm-f2-fisheye)
    // via ttartisan.store — notable finding: that store's mount-selector
    // radio buttons default to "Sony E" regardless of the linked lens's
    // relevant mount, and the gallery image swaps per mount selection;
    // several first-pass captures were caught (via "SKU-E"-prefixed
    // filenames / unclicked default state) before the mount was explicitly
    // switched to "Fuji X" and re-verified. ttartisan-7-5mm-f2-fisheye's
    // listing has no per-mount hero image at all (confirmed via the store's
    // own product.json — no variant has a distinct featured_image), so its
    // shared front-only studio shot (no mount plate visible) was used
    // instead. ttartisan-35mm-f095 previously had a rejected Commons
    // candidate (no mount stated) — resolved here via Tier 3 instead.
    //
    // 14 more ids resolved 2026-08-17 (second pass, same sweep): all 4
    // 7Artisans (7artisans-50mm-f18/25mm-f18/25mm-f18-lite/35mm-f18-lite) via
    // 7artisans.store — the AF 25/35/50mm f/1.8 Lite trio share one listing
    // with no per-mount hero image (product.json confirms every variant
    // shares the same image set), so its focal-length-specific studio shots
    // were used directly; the manual 25mm f/1.8's page mixes in an
    // EOS-M-mount photo (rear reads "EOS-M Mount") alongside the used one,
    // confirming the listing is genuinely multi-mount rather than reused
    // Sony/Canon-only assets. samyang-75mm-f18 via samyangus.com — a
    // single-mount (X-only) listing, barrel reads "AF 75/1.8 X". Both Laowa
    // Aksen lenses via venuslens.net (real browser only — 403s to
    // curl/WebFetch): the mount dropdown includes Fuji X but doesn't swap the
    // gallery, which is entirely "FE"-filenamed (Sony); used a top-angle shot
    // that shows no mount plate for each. All 7 Meike entries via
    // meikeglobal.com — meike-33mm-f14's productUrl on file
    // (meikeglobal.com/products/3314) turned out to be the Nikon Z-mount
    // page ("...for Z Mount" in its own title); corrected to the X-mount
    // "3314x" handle (matching the "x"-suffix convention used by every other
    // X-mount SKU on this site) and sourced a photo showing the
    // lens mounted on a "FUJIFILM X-T5" body. meike-55mm-f18 and
    // meike-85mm-f18's galleries mix in explicit on-body lifestyle photos
    // shot on Sony/Nikon bodies (rejected) alongside studio shots that are
    // genuinely shared, unmarked imagery across every mount's listing page
    // (confirmed via each page's product.json) — used the studio shots.
    // meike-25mm-f17-air and meike-56mm-f17-air's pages had no ambiguity:
    // filenames are explicitly "2517X-"/non-"Z"-tagged and page titles state
    // "for Fujifilm Mirrorless Cameras".
    //
    // Zeiss Touit trio — discontinued; the old per-lens URLs now redirect to
    // one combined page whose sole product image (a "stage" hero banner)
    // 403s to curl even from a same-origin fetch inside a real browser tab —
    // reconfirmed 2026-08-17, still blocked.
    'zeiss-touit-12mm-f28', 'zeiss-touit-32mm-f18', 'zeiss-touit-50mm-f28',
    // viltrox-85mm-f18 (plain original, not Air/Pro/EVO): discontinued,
    // superseded by the II; Viltrox pulled its own listing and no Commons
    // candidate exists ("Viltrox 85mm f1.8 X" search: zero results, checked
    // 2026-08-17).
    'viltrox-85mm-f18',
    // Samyang manual-lens line (10 of 11 — only samyang-75mm-f18 above
    // resolved): samyangus.com's product pages for these list "Fuji X" as a
    // purchasable mount option, but the gallery photography is either
    // explicitly another mount by filename (8mm/10mm/12mm-ncscs/14mm/16mm are
    // "sony"/"Canon"/"NikonAE"-tagged; 300mm is "SonyE"-tagged; confirmed
    // wrong-mount even after clicking the "Fuji X" mount selector, which
    // doesn't swap the displayed images on this site) or unlabeled with no
    // mount plate markings either way (85mm f/1.4, 85mm f/1.8, 100mm macro,
    // 135mm f/2 — no "sony"/"canon"/"nikon" tag, but the visible bayonet ring
    // has no legible brand text to confirm X specifically, so left gapped
    // rather than guess). Checked 2026-08-17.
    'samyang-8mm-f28', 'samyang-10mm-f28',
    // samyang-12mm-f2-ncscs: Commons candidate's barrel is legibly stamped
    // "NCS CS E" — the Sony E-mount copy, not X. samyang-14mm-f28: candidate's
    // barrel reads "EOS" — the Canon DSLR-mount original, not the X-mount
    // mirrorless version. Both rejected 2026-08-16 (visual barrel-text check).
    'samyang-12mm-f2-ncscs',
    'samyang-14mm-f28', 'samyang-16mm-f2', 'samyang-85mm-f14', 'samyang-85mm-f18',
    'samyang-100mm-f28-macro', 'samyang-135mm-f2', 'samyang-300mm-f63',
  ]),
  nikon: new Set([
    // Cameras: all 10 resolved 2026-08-15 (Commons photos sourced + applied).
    // Lenses — re-run 2026-08-15 (Nikon+Panasonic lens image pass): z-dx-16-50mm-vr
    // and viltrox-27mm-f12 resolved and removed from this list.
    // All 17 first-party NIKKOR Z lenses resolved 2026-08-17 (Tier 3, official
    // nikonusa.com product-page images, barrel text visually confirmed for
    // every one — several explicitly print the model designation, e.g.
    // "NIKKOR Z 70-200mm 1:2.8 VR S II", "DX 12-28/3.5-5.6 PZ").
    // 9 Viltrox Z primes, 3 Laowa Z manuals, both Voigtländer Z manuals, both
    // Yongnuo Z primes, TTArtisan/7Artisans 27mm f/2.8, and both Meike 85mm
    // f/1.8 variants all resolved 2026-08-17 (Tier 3, official maker store
    // pages — viltrox.com, venuslens.net, voigtlaender.de, yongnuo.eu,
    // ttartisan.store, 7artisans.store, meikeglobal.com — barrel/mount text
    // or an explicit Z-mount selector confirmed for every one; see each
    // entry's imageSource.note for specifics).
    //
    // viltrox-85mm-f18-ii: genuine gap, checked 2026-08-17 — no Nikon Z
    // product of this "II" revision exists on viltrox.com (only Fuji X and
    // Sony E Mark II variants found); the stored productUrl was already null.
    'viltrox-85mm-f18-ii',
    // tamron-17-70mm-f28 has a Commons candidate (File:Tamron 17-70mm F 2.8
    // Di III-A VC RXD (Model B070) (50829297527).jpg) but it's dated
    // 2021-01-12 — years before this lens's 2026 Nikon Z release — and shows
    // no rear mount, so it's almost certainly the original Sony E-mount (or
    // later Fuji X) copy; rejected as wrong-mount rather than confirmed.
    // tamron.com's own B070 (17-70mm) and B061 (18-300mm) product/spec pages
    // were checked directly 2026-08-17: both the hero shot and the dedicated
    // rear-mount closeup (b061e_mount.png) show a generic bayonet with no
    // "Nikon Z"/mount-identifying text or shape — Tamron does not publish
    // visually mount-distinguishable photography for either lens.
    'tamron-17-70mm-f28', 'tamron-18-300mm-f35-63',
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
    // gh5, G9 II for g9 — and were rejected). l10's Commons candidate is still
    // rejected (licence-suspect, points to an Adorama listing) — but l10,
    // s1-ii, s5-iix, g97, g95 all resolved 2026-08-17 via Tier 3 manufacturer
    // hotlinks (shop.panasonic.com official product galleries, `imageSource`
    // citations recorded).
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
    // bgh1 resolved 2026-08-17 (Tier 3 manufacturer hotlink; the page's other
    // gallery images were mislabeled GH7 photos — rejected those, used the
    // one matching the page's own "DC-BGH1PP" title)
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
    // a7-v and a6100 resolved 2026-08-17 via Tier 3 manufacturer hotlinks
    // (electronics.sony.com's /PDP/DI/.../desktop/N.jpg product gallery,
    // which serves correct image/* Content-Type — a7-v's earlier Commons
    // rejection, a generic "α7" badge with no confirming category, is
    // resolved here by a front 3/4 shot with an explicit "α7 V" nameplate).
    // fx5/fx2 stay gapped: Sony's Cinema Line category only has product
    // photos on the /converted/ CDN path, which serves genuinely valid image
    // bytes (confirmed via `file`) but with Content-Type
    // application/octet-stream — fails this repo's own image-link check, and
    // no working /PDP/DI/ equivalent exists for either model (checked both
    // pages' DOM directly, only a generic cashback banner uses that path).
    'fx5', 'fx2',
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
