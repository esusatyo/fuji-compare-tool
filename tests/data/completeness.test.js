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
    // Sony E Mark II variants found). Corrected 2026-08-22: this entry's
    // `name` had an erroneous "II" — it actually describes the plain
    // (non-II) "AF 85mm f/1.8 Z", a real product no longer on viltrox.com's
    // own storefront but still sold new by B&H (productUrl updated to that
    // listing); still no official product photo to source, so the image gap
    // stands under this same (unchanged) slug.
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
    // The 34 round-2 third-party Nikon Z entries whose images were deferred
    // in the Aug 2026 lens-entry batches (21 Laowa, 7 Yongnuo, 4 Meike,
    // 2 Samyang) were all resolved 2026-09-06 via Tier 3 maker-store pages
    // (venuslens.net, yongnuo.eu, meikeglobal.com, samyangus.com) — every
    // image viewed at full size in a real browser, model confirmed by barrel
    // text / caption / file name and the page's own Nikon-Z-mount listing;
    // see each entry's imageSource.note. The venuslens.net (Laowa) hotlinks
    // 403 to datacenter IPs (Cloudflare) exactly like the 3 pre-existing
    // round-1 Laowa images here — they load for real visitors. Manual-focus
    // Laowa lenses share one mount-agnostic barrel across mounts; the studio
    // shots used show either no mount plate or an unmarked bayonet, nothing
    // contradicting Nikon Z.
  ]),
  panasonic: new Set([
    // Cameras: all resolved (see git history — Commons sweeps plus Tier 3
    // manufacturer hotlinks for l10/s1-ii/s5-iix/g97/g95/bgh1, the last of
    // which required rejecting mislabeled GH7 photos on the same page).
    //
    // Lenses — the large majority (LUMIX S primes/zooms, LUMIX G/Leica DG
    // primes/zooms, third-party L-mount/MFT from Sigma/Viltrox/Samyang/
    // Laowa/Voigtländer, and most of OM System's MFT PRO line) resolved
    // 2026-08-17 via Tier 3 manufacturer hotlinks — shop.panasonic.com,
    // explore.omsystem.com, sigma-global.com, viltrox.com, lksamyang.com,
    // venuslens.net, voigtlaender.de — each with an `imageSource` citation
    // and a barrel-text or dimension-spec visual match recorded in its note.
    // Notable catches during that pass: shop.panasonic.com's 100mm F2.8
    // MACRO page's first DOM-order image was actually an unrelated 70-300mm
    // zoom pulled in from a widget; Viltrox's 16mm L page likewise surfaced
    // the Sony FE-mount photo first. Both rejected in favor of explicitly
    // mount/model-tagged filenames found deeper in each gallery.
    //
    // omsystem-17mm-f18: Commons candidate's category says plain "17mm
    // f/1.8" (the 2012 original) while the dataset entry is the "II" (2023
    // redesign) — wrong-generation, rejected, stays a gap.
    'omsystem-17mm-f18',
    // voigtlander-apo-lanthar-35mm-f2-l / -50mm-f2-l: investigated
    // 2026-08-17 — Voigtländer does not currently manufacture any lens in
    // the modern Leica/Panasonic/Sigma L-Mount Alliance mount. Their own
    // site explicitly warns "Voigtländer L-mount has nothing in common with
    // the L-mount from Leica, Sigma, Panasonic and Leitz Cine lens!" (it
    // refers to a decades-old L39 screw mount instead), voigtlaender.de has
    // no /l-mount/ or /lenses/l-mount/ path for either lens (both 404, and
    // the 50mm's stored productUrl silently redirects to the Nikon Z-mount
    // page instead), and multiple independent sources confirm Voigtländer's
    // APO-Lanthar/Nokton lines ship in VM/Sony E/Nikon Z/Canon RF only, not
    // native L-mount. This calls the underlying data entries into question,
    // not just their images — flagged to the repo owner for a decision
    // rather than deleted unilaterally.
    'voigtlander-apo-lanthar-35mm-f2-l', 'voigtlander-apo-lanthar-50mm-f2-l',
    // lumix-g-12-32mm-f3-5-5-6: the US shop.panasonic.com product page
    // 404s for this kit lens (pre-existing productUrl note); Panasonic's JP
    // site (panasonic.jp) has no standalone product photo, only marketing
    // composites/diagrams (a cross-section render, a "-K vs -S" color
    // comparison banner) and Commons has camera+lens combo shots only
    // (DMC-GM1 body reviews), no standalone lens photo. Stays a gap.
    'lumix-g-12-32mm-f3-5-5-6',
    // lumix-g-35-100mm-f2-8-ii: discontinued/superseded by the LEICA DG
    // 35-100mm F2.8 POWER O.I.S. — Panasonic's own product page for this
    // model now serves the replacement lens (productUrl already cleared to
    // null for that reason), and Commons has zero results for this exact
    // model. Stays a gap.
    'lumix-g-35-100mm-f2-8-ii',
    // omsystem-100-400mm-f5-63-ii: explore.omsystem.com's product page for
    // this exact "IS II" SKU is confirmed correct (page title matches), but
    // its only tech-spec image (100-400mmf5-63is-techspecs.webp — filename
    // has no "ii") shows a barrel with no "II" badge and a dimension label
    // reading "160mm" against this entry's stored length:205.6 — diameter
    // matches exactly (86.4mm) but length does not, so this may be a
    // leftover first-gen asset on the II's page rather than a genuine II
    // photo. Left as a gap rather than risk a wrong-generation image;
    // worth a second look with a non-cached page load.
    'omsystem-100-400mm-f5-63-ii',
  ]),
  sony: new Set([
    // tamron-70-300mm: the only Commons file is the Nikon Z version (Model
    // A047Z); the Sony-E variant is A047, so this stays gapped here even though
    // the Nikon entry now carries that photo.
    'tamron-70-300mm-f45-63',
    // Tamron FE zooms — tamron-17-70mm-f28 and tamron-70-180mm-f28-g2 resolved
    // 2026-08-15 (Commons, mount confirmed via filename/description).
    // tamron-35-150mm-f2-28's only Commons candidate explicitly says "Nikon Z"
    // in the filename — wrong mount, rejected. tamron-16-30mm-f28-g2,
    // tamron-20-40mm-f28, and tamron-12-20mm-f28 checked directly on
    // tamron-americas.com 2026-08-17: each product page is a shared
    // Sony-E-and-Nikon-Z listing (e.g. page title "...for Sony E & Nikon
    // Z-Mount") with no dedicated hero product photo at all, only spec
    // diagrams/icons — consistent with the mount-indistinguishable
    // photography already confirmed for Tamron's Nikon Z entries.
    'tamron-16-30mm-f28-g2', 'tamron-20-40mm-f28', 'tamron-35-150mm-f2-28',
    'tamron-12-20mm-f28',
    // Samyang — samyang-35mm-f18 and samyang-135mm-f18 resolved 2026-08-15
    // (Commons). samyang-24mm-f18, samyang-45mm-f18, samyang-75mm-f18 resolved
    // 2026-08-17 via Tier 3 (samyangus.com, filenames literally contain "FE").
    // Viltrox (all 7), Voigtländer (all 3), Laowa (all 3), 7Artisans,
    // TTArtisan, and Meike resolved 2026-08-17 via Tier 3 manufacturer store
    // pages (viltrox.com, voigtlaender.de, venuslens.net, 7artisans.store,
    // ttartisan.store, meikeglobal.com) — see each entry's imageSource.note.
    //
    // Zeiss Loxia 35mm f/2: Zeiss discontinued the whole Loxia line and no
    // longer hosts a live per-lens product page (zeiss.com/.../loxia-lenses
    // and /loxia both 404); stays a documented gap.
    'zeiss-loxia-35mm-f2',
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
    // Lens batch resolved 2026-08-17 via Tier 3 — electronics.sony.com's
    // 1WorldSync-syndicated product gallery (cdn.cs.1worldsync.com
    // .../inline-content/<hash>/..._gallery.jpg or _hero.jpg, alt-text
    // matched to the exact product name to rule out cross-sell/related-item
    // contamination — a real trap hit mid-pass, see commit message) for
    // fe-400mm-f28-gm, fe-35mm-f18, fe-50mm-f28-macro, fe-35mm-f28-za,
    // fe-12-24mm-f28-gm, fe-100-400mm-f45-63-gm-oss, fe-70-200mm-f4-g-oss,
    // e-16mm-f28, e-20mm-f28, e-24mm-f18-za, e-16-55mm-f28-g; plus
    // sigma-35mm-f14-dg-ii, sigma-90mm-f28-dg, sigma-28-70mm-f28-dg,
    // sigma-100-400mm-f5-63-dg via sigma-global.com/lenses/images/*_product_
    // img01.png (barrel-text confirmed, page lists Sony E-mount availability).
    //
    // Genuine remaining gaps, checked 2026-08-17: fe-300mm-f28-gm,
    // fe-28-70mm-f2-gm, fe-100-400mm-f45-gm-oss, fe-100-400mm-f56-8-oss,
    // fe-16-25mm-f28-g, and fe-24-50mm-f28-g each have ONLY numbered
    // PDP/DI/Lenses/<SKU>/desktop-or-mobile/N.jpg marketing-lifestyle photos
    // (a tennis player, a ballet studio, a portrait, a "G MASTER" logo card —
    // confirmed by screenshot, not equipment shots) and no 1WorldSync
    // product-gallery block on their electronics.sony.com pages at all — a
    // real distinction from Sony's *camera* PDP pages, where that same N.jpg
    // path IS the product photo (used successfully for a7-v/a6100 above).
    // fe-70-200mm-f4-macro-g-oss-ii, fe-200-600mm-f56-63-g-oss (Commons
    // Restrictions:"personality" — explicit reject), and fe-400-800mm-f63-8-g-oss
    // have no 1WorldSync block either. fe-28-70mm-f35-56-oss-ii's stored
    // productUrl 404'd — fixed to the correct sel28702 slug (found via
    // search) — but that corrected page also has no product-gallery block.
    // e-16-50mm-f35-56-pz-oss-ii's stored productUrl (selp1650-2) also
    // 404s; a search only surfaces the ORIGINAL (non-II) selp1650 SKU page,
    // not a distinct current URL for the "II" revision — left unfixed rather
    // than risk attaching the wrong product's URL, and stays gapped.
    'fe-300mm-f28-gm', 'fe-28-70mm-f2-gm', 'fe-100-400mm-f45-gm-oss',
    'fe-100-400mm-f56-8-oss', 'fe-16-25mm-f28-g', 'fe-24-50mm-f28-g',
    'fe-70-200mm-f4-macro-g-oss-ii', 'fe-200-600mm-f56-63-g-oss',
    'fe-400-800mm-f63-8-g-oss', 'fe-28-70mm-f35-56-oss-ii',
    'e-16-50mm-f35-56-pz-oss-ii',
  ]),
};

// Two different products in the same brand sharing one `imageUrl` is almost
// always a copy-paste slip — and a wrong-but-plausible photo ships silently
// (a dead link fails loudly, a mismatched one doesn't). The only legitimate
// case is a maker that publishes a single photo for a set of near-identical
// SKUs; those groups are listed here. (Cross-brand reuse — the same third-party
// lens in several mounts pointing at one mount-agnostic maker shot — is fine
// and not checked.)
const SHARED_IMAGE_OK = {
  nikon: [
    // 7Artisans' AF 25/35/50mm f/1.8 "Lite" trio share one product listing with
    // a single hero image (no per-focal-length photo published).
    ['7artisans-25mm-f18-lite', '7artisans-35mm-f18-lite', '7artisans-50mm-f18-lite'],
  ],
  panasonic: [
    // Laowa 90mm f/2.8 2x Macro APO — one maker studio shot, entered once per
    // Panasonic-file mount (L and MFT).
    ['laowa-90mm-f28-macro-l', 'laowa-90mm-f28-macro-mft'],
  ],
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

    // The allowlist must not carry ids that don't resolve to a real item in
    // this brand — a typo, or a leftover after an item was renamed/removed,
    // silently exempts nothing and rots. Every entry has to earn its place.
    const realIds = new Set([...Object.keys(data.CAMERAS), ...Object.keys(data.LENSES)]);
    const bogus = [...gaps].filter((id) => !realIds.has(id));
    assert.deepEqual(bogus, [],
      `\nKNOWN_IMAGE_GAPS[${brand}] lists ids that aren't a camera or lens in ${brand}:\n${bogus.join('\n')}`);
  });

  test(`[${brand}] no two items share a product image (copy-paste guard)`, () => {
    const ok = new Set((SHARED_IMAGE_OK[brand] || []).flat());
    const byUrl = new Map();
    for (const [id, item] of [...Object.entries(data.CAMERAS), ...Object.entries(data.LENSES)]) {
      if (!item.imageUrl) continue;
      (byUrl.get(item.imageUrl) || byUrl.set(item.imageUrl, []).get(item.imageUrl)).push(id);
    }
    const clashes = [];
    for (const [url, ids] of byUrl) {
      if (ids.length > 1 && !ids.every((id) => ok.has(id))) clashes.push(`${ids.join(' + ')}\n    ${url}`);
    }
    assert.deepEqual(clashes, [],
      `\n${clashes.length} imageUrl(s) reused by different ${brand} items (add to SHARED_IMAGE_OK if intentional):\n${clashes.join('\n')}`);
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
