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
    // rf-800mm-f56-l-is-usm RESOLVED 2026-09-11 (Commons, CC BY-SA 4.0,
    // File:Canon_RF_800mm_f5.6L_IS_USM.jpg by Dinkun Chen). The prior
    // rejection (2026-08-16) reasoned the barrel's "2.6m-20m" focus-limiter
    // switch reading was "far closer to the 400mm f/2.8's ~2.5m MFD than the
    // 800mm f/5.6's ~6m" — that ~6m figure was wrong, borrowed from the
    // unrelated budget RF800mm F11 IS STM. Canon's own published spec (and
    // this dataset's own minFocusDist:260 for this item) puts the RF 800mm
    // f/5.6L IS USM's true MFD at exactly 2.6m — an exact match to the
    // switch reading visible in the photo (re-verified at full crop
    // resolution), not merely close, and distinct from the 400mm f/2.8
    // (2.5m), 600mm f/4 (4.2m), and 1200mm f/8 (4.3m). Accepted.
    //
    // viltrox-85mm-f18 (RF II): re-checked 2026-09-11, still a gap. Viltrox's
    // own store (viltrox.com) site search for "85mm RF" lists the F1.8 II,
    // F1.4 Pro, and F2.0 EVO variants only in Sony E / Nikon Z / Fujifilm X —
    // no Canon RF option on any of them. Canon still blocks third-party AF
    // lens licensing on RF, so no official manufacturer page exists to
    // source from; B&H/retailer photos aren't an acceptable substitute per
    // this skill's sourcing tiers. Stays a gap until Viltrox (or Canon's
    // policy) changes.
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
    // Re-checked 2026-09-11 (image-refresh pass): this time Commons searches
    // (not just the dead manufacturer page) surface real candidates for all
    // three, but every one turns out to be the Sony E-mount copy, not X —
    // 12mm: File:Zeiss Touit Distagon 12mm 2,8 Lens.jpg, own description
    // reads "for Sony E-Mount"; 32mm: File:NEX-5T with ZEISS touit 32mm
    // F1.8.jpg, pictured mounted on a Sony NEX-5T body; 50mm:
    // File:Zeiss-touit-28-50m.jpg, barrel visibly printed "E-mount" at full
    // resolution (verified by downloading and reading the image). Commons
    // appears to have no X-mount Touit photography at all. Still gaps.
    'zeiss-touit-12mm-f28', 'zeiss-touit-32mm-f18', 'zeiss-touit-50mm-f28',
    // viltrox-85mm-f18 (plain original, not Air/Pro/EVO): discontinued,
    // superseded by the II; Viltrox pulled its own listing and no Commons
    // candidate exists ("Viltrox 85mm f1.8 X" search: zero results, checked
    // 2026-08-17). Re-checked 2026-09-11: viltrox.com's own site search for
    // "85mm f1.8 fuji x" still resolves only to the II product page; Commons'
    // Category:Viltrox lenses (4 files total) has none of this model in any
    // mount. Still a gap.
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
    // Re-checked 2026-09-11 (image-refresh pass, Commons this time rather
    // than samyangus.com): scripts/fetch-images-commons.js's strict-token
    // search surfaced two new hits, both rejected on inspection —
    // "Samyang 14mm f2.8 lens - Diliff.jpg" (own description: "lens with a
    // Canon mount" — the same wrong-mount problem as the 2026-08-16 rejection,
    // just a different file) and "Samyang 85mm f1.4 as if umc 02.jpg" (looked
    // promising — a front 3/4 studio shot with no rear mount visible in that
    // frame — but it's part of a numbered series by the same photographer;
    // frames 04/05 in that same series show the rear mount with a glued-on
    // EMF electronic contact chip, a well-known Canon-EF-only manual-lens
    // modification, confirming the whole series — including 02 — is the
    // Canon copy, not X). No product-photo candidate turned up on Commons at
    // all for 8mm/10mm/16mm/85mm-f1.8/100mm-macro/135mm/300mm (targeted
    // per-model searches returned only sample photography, unrelated lenses,
    // or — for 135mm — an astrophotography rig where the lens is
    // bracket-mounted to a dedicated astro camera via a T-mount adapter, so
    // the retail bayonet isn't visible/identifiable). 12mm-ncscs's Commons
    // file was re-confirmed rather than re-found: its description literally
    // states "for Sony-E Mount APSC cameras". All still gaps.
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
    // Re-checked 2026-09-11 (image refresh pass): viltrox.com's current
    // "85mm" search (126 results) still lists only "AF 85mm F1.8 II" (Sony
    // E / Fuji X) and "AF 85mm F1.4 Pro" / "AF 85mm F2.0 EVO" for Nikon Z —
    // no plain AF 85mm F1.8 (STM, non-Pro/EVO/II) Z-mount SKU exists on the
    // storefront to source a page photo from. Commons' "Viltrox Z-mount
    // lenses" > "Viltrox AF 85/1.8 Z" category holds only a "Taken with"
    // subcategory (photos shot using the lens, not of it) — no product
    // photo. B&H still stocks the lens but retailer photos aren't an
    // acceptable source per this skill. Still a gap.
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
    // Re-checked 2026-09-11 (image refresh pass): re-ran both the automated
    // Commons matcher and manual API searches (site search, category sweep
    // of "Tamron Z-mount lenses" and "Tamron lenses") — the only 17-70mm hit
    // is still the same pre-2026 Sony-E-era file; no 18-300mm file exists on
    // Commons at all, and neither model has a "…Nikon Z…"-suffixed filename
    // the way the resolved tamron-35-150mm-f2-28 entry does (its Commons
    // file is explicitly captioned "(model A058Z)"). Also loaded both
    // tamron.com product pages live in a browser: the "SONY E / NIKON Z /
    // FUJIFILM X / CANON RF" mount badges are static text, not a selector —
    // clicking "NIKON Z" doesn't swap the hero image, and the gallery still
    // has no rear-mount shot. Both remain genuine gaps.
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
    // omsystem-17mm-f18: RESOLVED 2026-09-06 — explore.omsystem.com's own
    // "m-zuiko-17mm-f1-8-ii" product page tech-spec image
    // (17mm_f1.8_ii-om_-_tech.webp) visually confirmed: 37.6mm length /
    // 57.6mm diameter / ⌀46mm filter, matching this entry's stored 38/58/46
    // almost exactly (rounding). Superseded the earlier wrong-generation
    // Commons rejection below.
    // voigtlander-apo-lanthar-35mm-f2-l / -50mm-f2-l: RESOLVED 2026-09-09 —
    // both entries DELETED from panasonic/data.js. The 2026-08-17
    // investigation concluded they were fabricated: Voigtländer makes no lens
    // in the modern L-Mount Alliance mount (its own site warns its
    // "Voigtländer L-mount" is a decades-old L39 screw mount with "nothing in
    // common with the L-mount from Leica, Sigma, Panasonic"), both stored
    // productUrls 404, and the APO-Lanthar line ships in VM/Sony E/Nikon
    // Z/Canon RF only. The repo owner confirmed and approved removal. Their
    // dead links were the only failures in `npm run test:links`.
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
    // omsystem-100-400mm-f5-63-ii: RE-CONFIRMED 2026-09-06 (second look, per
    // the note below) — explore.omsystem.com's "m-zuiko-ed-100-400mm-f5-0-6-3-is-ii"
    // page still only serves that same tech-spec image
    // (100-400mmf5-63is-techspecs.webp). Downloaded and visually inspected it
    // directly this round: it's dimensioned 160mm long / ⌀72mm front element,
    // not this entry's stored 205.6mm length — confirms it's the leftover
    // first-gen asset suspected below, not a genuine "IS II" photo. A fork
    // briefly applied it to panasonic/data.js on 2026-09-06 before this was
    // caught and reverted. Still a genuine gap.
    'omsystem-100-400mm-f5-63-ii',
    // 2026-09-12 image-refresh pass: re-ran scripts/fetch-images-commons.js
    // panasonic lenses (dry run) for all three remaining gaps above — 0/3
    // candidates found, same result as the 2026-09-06 pass. A follow-up direct
    // Commons API search hit the same IP-wide search-API rate limiting/garbled
    // responses documented for other brands this round, so no further manual
    // digging was done beyond the one pass. All three stay genuine gaps.
  ]),
  sony: new Set([
    // tamron-70-300mm: the only Commons file is the Nikon Z version (Model
    // A047Z); the Sony-E variant is A047, so this stays gapped here even though
    // the Nikon entry now carries that photo. Re-confirmed 2026-09-12
    // (image-refresh pass): scripts/fetch-images-commons.js's fuzzy search
    // resurfaced the same A047Z/"Nikon Z" file as its only hit — still the
    // wrong mount, still gapped.
    'tamron-70-300mm-f45-63',
    // Tamron FE zooms — tamron-17-70mm-f28 and tamron-70-180mm-f28-g2 resolved
    // 2026-08-15 (Commons, mount confirmed via filename/description).
    // tamron-35-150mm-f2-28's only Commons candidate explicitly says "Nikon Z"
    // in the filename — wrong mount, rejected. tamron-16-30mm-f28-g2 and
    // tamron-12-20mm-f28 checked directly on tamron-americas.com 2026-08-17:
    // each product page is a shared Sony-E-and-Nikon-Z listing (e.g. page
    // title "...for Sony E & Nikon Z-Mount") with no dedicated hero product
    // photo at all, only spec diagrams/icons — consistent with the
    // mount-indistinguishable photography already confirmed for Tamron's
    // Nikon Z entries. tamron-20-40mm-f28 resolved 2026-09-12 (Commons; see
    // below — it turned out NOT to share this dual-mount problem).
    // Re-checked 2026-09-12 (image-refresh pass): fresh Commons category +
    // search queries for tamron-16-30mm-f28-g2, tamron-35-150mm-f2-28 and
    // tamron-12-20mm-f28 (by name and by Tamron model code) returned zero
    // file hits for any of the three — still no Commons coverage at all,
    // not just a wrong-mount rejection. All three stay gapped.
    'tamron-16-30mm-f28-g2', 'tamron-35-150mm-f2-28',
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
    // Re-checked 2026-09-12 (image-refresh pass): scripts/fetch-images-commons.js
    // plus manual Commons category/search queries ("Sony FX5", "ILME-FX5",
    // "Sony FX2 cinema line") returned zero file hits for either model —
    // still no Commons coverage at all. Both stay gapped.
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
    // fe-400-800mm-f63-8-g-oss has no 1WorldSync block either.
    // fe-28-70mm-f35-56-oss-ii's stored productUrl 404'd — fixed to the
    // correct sel28702 slug (found via search) — but that corrected page
    // also has no product-gallery block. e-16-50mm-f35-56-pz-oss-ii's
    // stored productUrl (selp1650-2) also 404s; a search only surfaces the
    // ORIGINAL (non-II) selp1650 SKU page, not a distinct current URL for
    // the "II" revision — left unfixed rather than risk attaching the wrong
    // product's URL, and stays gapped.
    // fe-70-200mm-f4-macro-g-oss-ii and fe-200-600mm-f56-63-g-oss resolved
    // 2026-09-12 (Commons) — see their data.js entries; the earlier
    // "Restrictions:personality — explicit reject" note on the 70-200 was
    // about a *different* Commons candidate than the one ultimately used.
    //
    // Re-checked 2026-09-12 (image-refresh pass), electronics.sony.com's own
    // page confirmed live via a real browser (curl/WebFetch are both
    // Akamai-blocked with a 403 on this host — not a licensing signal, just
    // bot-detection): fe-300mm-f28-gm and fe-28-70mm-f2-gm's product pages
    // were re-inspected end-to-end via the rendered DOM. Both do have a
    // genuine studio product photo, but only on the cloudfront.net
    // /converted/<id>_..._converted.webp path, which serves Content-Type
    // application/octet-stream (confirmed via curl -I) — same failure as the
    // documented fx5/fx2 case, fails tests/links/links.test.js's image/*
    // check. The PDP/DI/Lenses/<SKU>/desktop/N.jpg images on both pages are
    // confirmed still marketing-only (tennis player / "G MASTER" logo card /
    // ballet studio — viewed directly, not guessed). No Commons category or
    // search hit exists for fe-100-400mm-f45-gm-oss (a brand-new 2026
    // release — expected), fe-100-400mm-f56-8-oss, fe-16-25mm-f28-g,
    // fe-24-50mm-f28-g, fe-400-800mm-f63-8-g-oss, fe-28-70mm-f35-56-oss-ii,
    // or e-16-50mm-f35-56-pz-oss-ii either (tried by lens name and by SKU).
    // All seven stay gapped alongside the two confirmed-marketing-only pages.
    'fe-300mm-f28-gm', 'fe-28-70mm-f2-gm', 'fe-100-400mm-f45-gm-oss',
    'fe-100-400mm-f56-8-oss', 'fe-16-25mm-f28-g', 'fe-24-50mm-f28-g',
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
