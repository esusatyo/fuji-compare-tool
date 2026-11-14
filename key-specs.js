// ─────────────────────────────────────────────
// KEY SPECS — the handful of specs that answer "which one?" at a glance.
//
// WHICH specs are key, and in what order, is data: SITE_CONFIG.keySpecs in
// site-config.js (e.g. cameras: ['sensor', 'video', …]). This file holds what
// cannot be data — how each one's value is worded and which way is better —
// and turns that list into tiles. One definition per id, used everywhere.
//
// Pure (no DOM, no globals read), and both a browser script and a CommonJS
// module, like size.js: scripts/generate-seo.js requires it to pre-render
// the tiles on vs-pages; a page can load it to render them live.
//
// A definition:
//   label     string, or (opts) => string
//   value     (item, opts) => text shown, or null for "no value"
//   note      (item) => smaller text under the value (optional)
//   rank      (item, opts) => number to compare, or null (optional)
//   better    'higher' | 'lower' — absent means the spec has no verdict
//   needsAll  a verdict only when every item has a rank
// ─────────────────────────────────────────────
(function () {
  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const usd = amount => `$${amount.toLocaleString('en-US')}`;
  const priceOf = (item, opts) => (item.prices && item.prices[opts.currency] != null ? item.prices[opts.currency] : null);

  const DEFS = {
    cameras: {
      sensor: {
        label: 'Sensor',
        value: c => (c.sensorMP == null ? null : `${c.sensorMP} MP`),
        note: c => c.sensorType || null,
        rank: c => (c.sensorMP == null ? null : c.sensorMP),
        better: 'higher',
      },
      // Free text ("6.2K / 30P", "4K / 60P (DX crop)"): shown, never ranked —
      // resolution against frame rate has no honest single winner.
      video: {
        label: 'Max video',
        value: c => c.maxVideoRes || null,
      },
      // A body with IBIS but no published rating can't be ranked against a
      // rated one, so the verdict needs every value.
      stabilization: {
        label: 'Stabilization',
        value: c => (!c.ibis ? 'None' : (c.ibisStops ? `${c.ibisStops} stops` : 'In-body')),
        note: c => (c.ibis && c.ibisStops ? 'in-body' : null),
        rank: c => (!c.ibis ? 0 : (c.ibisStops || null)),
        better: 'higher',
        needsAll: true,
      },
      burst: {
        label: 'Burst',
        value: c => (c.maxBurst ? `${c.maxBurst} fps` : null),
        rank: c => c.maxBurst || null,
        better: 'higher',
      },
      // List price in opts.currency (default USD). Cheaper is better only
      // when every item has a price to compare.
      price: {
        label: opts => `Price (${opts.currency})`,
        value: (c, opts) => (priceOf(c, opts) == null ? null : opts.money(priceOf(c, opts))),
        note: () => 'list price',
        rank: priceOf,
        better: 'lower',
        needsAll: true,
      },
    },
  };

  // The recorded list for `kind` ('cameras'), from a SITE_CONFIG-shaped object.
  function list(config, kind) {
    return ((config && config.keySpecs && config.keySpecs[kind]) || []).slice();
  }

  function has(kind, id) {
    return !!(DEFS[kind] && DEFS[kind][id]);
  }

  // Which items hold the better value. The engine's winner rule: fewer than
  // two items, no direction, or a dead heat → nobody; a tie for best among
  // some marks each of them.
  function winners(def, items, opts) {
    const none = items.map(() => false);
    if (items.length < 2 || !def.better || !def.rank) return none;
    const ranks = items.map(it => {
      const r = def.rank(it, opts);
      return typeof r === 'number' ? r : null;
    });
    const valid = ranks.filter(r => r !== null);
    if (!valid.length) return none;
    if (def.needsAll && valid.length !== ranks.length) return none;
    const best = def.better === 'higher' ? Math.max(...valid) : Math.min(...valid);
    if (valid.length === ranks.length && valid.every(r => r === best)) return none;
    return ranks.map(r => r !== null && r === best);
  }

  // One tile per id: { id, label, rows: [{ name, value, note, better }] }.
  // `entries` is [{ name, item }]. Ids with no definition, and tiles where no
  // item has a value, are left out.
  function tiles(kind, ids, entries, options = {}) {
    const opts = { currency: 'USD', money: usd, ...options };
    const items = entries.map(e => e.item);
    const out = [];
    for (const id of ids) {
      const def = DEFS[kind] && DEFS[kind][id];
      if (!def) continue;
      const values = items.map(it => def.value(it, opts));
      if (values.every(v => v == null)) continue;
      const won = winners(def, items, opts);
      out.push({
        id,
        label: typeof def.label === 'function' ? def.label(opts) : def.label,
        rows: entries.map((e, i) => ({
          name: e.name,
          value: values[i],
          note: values[i] != null && def.note ? def.note(e.item) : null,
          better: won[i],
        })),
      });
    }
    return out;
  }

  // The tiles as markup: complete without JavaScript, styled by engine.css.
  // Each row's dot takes its column colour (--key-c).
  const COLORS = ['var(--accent-primary)', 'var(--accent-secondary)', 'var(--size-c3)', 'var(--size-c4)'];
  function html(tileList, { heading = 'Key specs' } = {}) {
    if (!tileList.length) return '';
    const tile = t => `      <div class="key-tile" data-key-spec="${esc(t.id)}">
        <h3 class="key-tile-label">${esc(t.label)}</h3>
        <dl>
${t.rows.map((r, i) => `          <div class="key-row${r.better ? ' key-better' : ''}" style="--key-c:${COLORS[i % COLORS.length]}">
            <dt>${esc(r.name)}</dt>
            <dd>${r.value == null ? '—' : esc(r.value)}${r.better ? '<span class="key-sr"> (better)</span>' : ''}${r.note ? `<small>${esc(r.note)}</small>` : ''}</dd>
          </div>`).join('\n')}
        </dl>
      </div>`;
    return `<section class="key-specs" aria-label="${esc(heading)}">
      <h2 class="key-specs-title">${esc(heading)}</h2>
      <div class="key-tiles">
${tileList.map(tile).join('\n')}
      </div>
    </section>`;
  }

  const api = { DEFS, list, has, winners, tiles, html };
  if (typeof window !== 'undefined') window.KeySpecs = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
