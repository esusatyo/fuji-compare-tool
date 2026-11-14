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
};
