// ─────────────────────────────────────────────
// SITE CONFIG — single source of truth for site-wide settings.
// Loaded by every brand page before data.js; evaluated by
// scripts/generate-seo.js to produce canonicals, vs-pages,
// sitemap.xml and robots.txt.
//
// TODO(launch): set baseUrl to the real domain, then run
//   node scripts/generate-seo.js
// and commit the regenerated files (launch roadmap Phase F).
// ─────────────────────────────────────────────
const SITE_CONFIG = {
  // Reserved-TLD placeholder — unambiguously fake until launch.
  baseUrl: 'https://camera-compare.example',
  siteName: 'Camera Compare',
  // Date the specs/prices were last audited (kept current by the
  // periodic price/link audit) — a verification claim, never "today".
  dataVerified: '2026-07-03',
};
