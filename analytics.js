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
// Page-level signals are owned here rather than by the engine, so they also
// cover vs-pages (which load no engine.js):
//   engaged-30s / engaged-120s — visible time on the page, two tiers
//   specs-seen                 — the spec table entered the viewport
//
// Event paths are `<event>:<detail>` (GoatCounter keeps one title per path, so
// anything worth breaking down by has to live in the path). Search the
// dashboard for the prefix to see a whole family:
//   buy-click:tool:<brand>:<slug>     buy-click:vs:<brand>:<slug>
//   view-product:tool:<brand>:<slug>  view-product:vs:<brand>:<slug>
//   camera-swap:<brand>:<slug>        lens-swap:<brand>:<slug>
//   mode-switch:<brand|compare>:<cameras|lenses>
//   brand-switch:<from>:<to>          brand-pick:<brand|compare>
//   mount-filter:<brand>:<mount|all>  theme:<light|dark|system>
//   currency:<CUR>                    spec-section:<id>:<open|close>
//   vs-to-interactive:<brand|cross>:<pair>   vs-related:<brand|cross>:<pair>
//   engaged-30s:<pathname>  engaged-120s:<pathname>  specs-seen:<pathname>
(function () {
  // Cumulative visible-time marks, in order.
  var ENGAGED_TIERS = [
    { ms: 30000, name: 'engaged-30s' },
    { ms: 120000, name: 'engaged-120s' },
  ];
  // The comparison table on a tool page, the spec card on a vs-page.
  var SPEC_TABLE = '#compare-table, .vs-card';

  function trackEvent(path, title) {
    var gc = window.goatcounter;
    if (!gc || typeof gc.count !== 'function') return;
    try {
      gc.count({ path: path, title: title || path, event: true });
    } catch (e) { /* analytics must never break the page */ }
  }
  window.trackEvent = trackEvent;

  // No counter, nothing to report — and no timers or observers left pending.
  if (!window.goatcounter || typeof window.goatcounter.count !== 'function') return;

  var page = location.pathname;

  // ── visible-time tiers ────────────────────────────────────────────
  // Time spent in a background tab doesn't count, so a page opened and
  // forgotten isn't mistaken for a page read. Each tier is armed for the gap
  // since the previous one, so the marks are cumulative visible time.
  var tier = 0, remaining = ENGAGED_TIERS[0].ms, startedAt = 0, timer = null;

  function start() {
    if (timer || tier >= ENGAGED_TIERS.length) return;
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
    var t = ENGAGED_TIERS[tier++];
    trackEvent(t.name + ':' + page, t.name + ': ' + page);
    if (tier < ENGAGED_TIERS.length) {
      remaining = ENGAGED_TIERS[tier].ms - t.ms;
      start();
    } else {
      document.removeEventListener('visibilitychange', onVisibility);
    }
  }

  document.addEventListener('visibilitychange', onVisibility);
  if (document.visibilityState !== 'hidden') start();

  // ── did the spec table get seen ───────────────────────────────────
  // Fires once, when the table first intersects the viewport — on a tall
  // desktop window that can be immediately, which is why it's "seen" rather
  // than "scrolled to". Without IntersectionObserver, simply never fires.
  if (typeof window.IntersectionObserver === 'function') {
    var watch = function (node) {
      if (!node) return;
      var io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (!entries[i].isIntersecting) continue;
          io.disconnect();
          trackEvent('specs-seen:' + page, 'Specs seen: ' + page);
          return;
        }
      });
      io.observe(node);
    };
    // engine.js renders the table before this deferred script runs; the load
    // fallback covers any page that builds it later.
    var el = document.querySelector(SPEC_TABLE);
    if (el) watch(el);
    else addEventListener('load', function () { watch(document.querySelector(SPEC_TABLE)); });
  }
})();
