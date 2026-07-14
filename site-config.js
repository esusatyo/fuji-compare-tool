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
  dataVerified: '2026-07-13',
};
