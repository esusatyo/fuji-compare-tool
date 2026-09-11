// Anonymous interaction events, counted by GoatCounter (cookieless). Loaded on
// every page with `defer`, directly after GoatCounter's own count.js tag, so
// `window.goatcounter` already exists when this runs — unless an ad blocker
// stripped count.js, in which case every call below is a silent no-op.
//
// Owns the one place the site talks to GoatCounter's event API:
//   window.trackEvent(path, title) — engine.js and theme.js call this from
//   their handlers. Static links (vs-pages, landing cards) don't need it: they
//   carry `data-goatcounter-click`, which count.js binds on load.
//
// Event paths are `<event>:<detail>` (GoatCounter keeps one title per path, so
// anything worth breaking down by has to live in the path). Search the
// dashboard for the prefix to see a whole family:
//   buy-click:tool:<brand>:<slug>     buy-click:vs:<brand>:<slug>
//   camera-swap:<brand>:<slug>        lens-swap:<brand>:<slug>
//   mode-switch:<brand|compare>:<cameras|lenses>
//   brand-switch:<from>:<to>          brand-pick:<brand|compare>
//   mount-filter:<brand>:<mount|all>  theme:<light|dark|system>
//   vs-to-interactive:<brand|cross>:<pair>
//   engaged-30s:<pathname>
(function () {
  var ENGAGED_MS = 30000;

  function trackEvent(path, title) {
    var gc = window.goatcounter;
    if (!gc || typeof gc.count !== 'function') return;
    try {
      gc.count({ path: path, title: title || path, event: true });
    } catch (e) { /* analytics must never break the page */ }
  }
  window.trackEvent = trackEvent;

  // No counter, nothing to report — and no 30s timer left pending.
  if (!window.goatcounter || typeof window.goatcounter.count !== 'function') return;

  // Fires once, after 30s of the tab actually being visible: time spent in a
  // background tab doesn't count, so a page opened and forgotten isn't
  // mistaken for a page read.
  var remaining = ENGAGED_MS, startedAt = 0, timer = null;

  function start() {
    if (timer) return;
    startedAt = Date.now();
    timer = setTimeout(fire, remaining);
  }
  function pause() {
    if (!timer) return;
    clearTimeout(timer);
    timer = null;
    remaining -= Date.now() - startedAt;
  }
  function onVisibility() {
    if (document.visibilityState === 'hidden') pause(); else start();
  }
  function fire() {
    timer = null;
    document.removeEventListener('visibilitychange', onVisibility);
    trackEvent('engaged-30s:' + location.pathname, 'Engaged 30s: ' + location.pathname);
  }

  document.addEventListener('visibilitychange', onVisibility);
  if (document.visibilityState !== 'hidden') start();
})();
