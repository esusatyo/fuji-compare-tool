// ─────────────────────────────────────────────
// SITE CONFIG — single source of truth for site-wide settings.
// Loaded by every brand page before data.js; evaluated by
// scripts/generate-seo.js to produce canonicals, vs-pages,
// sitemap.xml and robots.txt.
//
// ─────────────────────────────────────────────
const SITE_CONFIG = {
  baseUrl: 'https://comparecameraspecs.com',
  siteName: 'Compare Camera Specs',
  // Date the specs/prices were last audited (kept current by the
  // periodic price/link audit) — a verification claim, never "today".
  dataVerified: '2026-10-11',
  // The key specs: the few that answer "which one?" at a glance, in the order
  // they are shown. This list is the single record of that choice — vs-pages
  // render it as tiles above the spec table, and anything else that wants
  // "the key specs" should read it from here. Each id is defined once in
  // key-specs.js (label, wording, which way is better); a test fails on an
  // id with no definition.
  keySpecs: {
    cameras: ['sensor', 'video', 'stabilization', 'burst', 'price'],
  },
  // Ready-made lists: each is a saved camera/lens finder search that gets its
  // own static, indexable page at /cameras/<slug> or /lenses/<slug>, linked
  // from the finder. Add, edit or delete an entry here, then run
  // `node scripts/generate-seo.js` (the pre-commit hook does it).
  //   slug     the page address: lower-case words joined by hyphens
  //   title    the page title and heading; never a count or a price the data
  //            could make false (a fixed threshold like "Under $1,500" is fine)
  //   intro    optional one-sentence description
  //   filters  the finder's own filter keys and values (see FILTERS in
  //            finder.js): brand, sensor, lens, mount, maxprice, maxweight,
  //            minmp, since, ibis, sealed, evf for cameras; mount, maker, type,
  //            focal ('24-70'), maxaperture, maxweight, maxprice, focus,
  //            filter, ois, sealed for lenses. Lists may be arrays.
  //   sort     year | price | weight | mp | name (cameras);
  //            year | price | weight | focal | aperture | name (lenses)
  //   limit    optional: keep only the first N
  //   currency optional, default USD; disc: true includes discontinued items
  // The generator stops with an error naming the entry if a key, value or
  // sort is unknown, a slug is repeated, or the list comes out empty.
  finderPresets: {
    cameras: [
      { slug: 'lightest-full-frame', title: 'Lightest Full-Frame Mirrorless Cameras',
        filters: { sensor: 'full-frame', lens: 'interchangeable' }, sort: 'weight', limit: 25 },
      { slug: 'cheapest-full-frame', title: 'Cheapest Full-Frame Mirrorless Cameras',
        filters: { sensor: 'full-frame', lens: 'interchangeable' }, sort: 'price', limit: 25 },
      { slug: 'lightest-aps-c', title: 'Lightest APS-C Mirrorless Cameras',
        filters: { sensor: 'aps-c', lens: 'interchangeable' }, sort: 'weight', limit: 25 },
      { slug: 'highest-resolution', title: 'Highest-Resolution Mirrorless Cameras',
        filters: {}, sort: 'mp', limit: 25 },
      { slug: 'fixed-lens-compacts', title: 'Fixed-Lens Compact Cameras',
        intro: 'Every fixed-lens camera on the site, current and discontinued, newest first.',
        filters: { lens: 'fixed' }, sort: 'year', disc: true },
      { slug: 'weather-sealed-under-1500', title: 'Weather-Sealed Cameras Under $1,500',
        filters: { sealed: 1, maxprice: 1500 }, sort: 'price' },
    ],
    lenses: [],
  },
};
