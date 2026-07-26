// Site-wide Light/Dark/System theme toggle. Loaded on every page (root,
// about/privacy, every brand page, compare/) alongside engine.css, which
// defines the actual color tokens for :root and :root[data-theme="light"].
//
// The choice of *pref* ('light' | 'dark' | 'system', default 'system') is
// stored in localStorage; the *effective* theme it resolves to is what gets
// written to <html data-theme>. A tiny inline script (emitted by
// scripts/generate-seo.js assetLinks(), before the engine.css <link> in
// <head>) already applies the effective theme before first paint so there's
// no flash — this file only handles the interactive parts: syncing each
// .theme-toggle's active button, wiring clicks, and following the OS live
// when the user's pref is 'system'.
(function () {
  var STORAGE_KEY = 'theme-pref';
  var media = window.matchMedia ? matchMedia('(prefers-color-scheme: light)') : null;

  function getPref() {
    try {
      var p = localStorage.getItem(STORAGE_KEY);
      return (p === 'light' || p === 'dark' || p === 'system') ? p : 'system';
    } catch (e) { return 'system'; }
  }

  function effectiveFor(pref) {
    if (pref === 'system') return (media && media.matches) ? 'light' : 'dark';
    return pref;
  }

  function applyPref(pref) {
    document.documentElement.setAttribute('data-theme', effectiveFor(pref));
    document.querySelectorAll('.theme-toggle .theme-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.themePref === pref);
    });
  }

  function setPref(pref) {
    try { localStorage.setItem(STORAGE_KEY, pref); } catch (e) { /* storage unavailable */ }
    applyPref(pref);
  }

  // Sync button state to whatever the early inline script already applied.
  applyPref(getPref());

  // Follow the OS live while the user's choice is 'system'.
  if (media && media.addEventListener) {
    media.addEventListener('change', function () {
      if (getPref() === 'system') applyPref('system');
    });
  }

  // Event delegation: works regardless of whether the toggle markup is
  // static HTML already in the DOM or injected later (engine.js renders
  // brand/compare page footers into #app after this script has run).
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.theme-toggle .theme-btn');
    if (!btn) return;
    setPref(btn.dataset.themePref);
  });
})();
