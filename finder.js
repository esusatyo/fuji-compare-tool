// ─────────────────────────────────────────────
// FINDER — filter and sort every camera (/cameras/) or every lens (/lenses/)
//
// The generator (scripts/generate-seo.js) writes every item as a table row,
// so the page is complete without JavaScript. This file holds everything the
// two worlds share, defined once:
//   - the row record each item becomes (`record`), and how it is written to
//     and read back from a row's data-* attributes (`rowAttrs` / `readRow`);
//   - the derived categories the data does not store (`sensorFormat`,
//     `isAutofocus`);
//   - the filters, sorts and the URL grammar (`parseState` / `formatState`);
//   - `matches`, `sortItems` and `run`, which presets (generator) and the
//     live page (browser) both call.
// In the browser it also wires the page (`boot`). Loaded with a plain
// <script src>, `require`d by the generator and the tests — like kit.js.
//
// No database and no library: 232 cameras and ~1,250 lenses fit in memory
// many times over; filtering is one pass over an array.
// ─────────────────────────────────────────────
(function () {
  const CURRENCIES = ['USD', 'AUD', 'EUR', 'GBP', 'JPY', 'CAD', 'SGD'];
  const SYMBOL = { USD: '$', AUD: 'A$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$', SGD: 'S$' };
  const COMPARE_MIN = 2;
  const COMPARE_MAX = 4;

  // ── Derived categories ─────────────────────
  // Sensor format from the free-text `sensorType`. First match wins, so the
  // specific wordings come before the general ones (APS-H before APS-C).
  // A test fails on any camera that matches none — add a rule, never a
  // fallback.
  const SENSOR_FORMATS = [
    { id: 'medium-format', label: 'Medium format', test: /43\.8|\bGFX\b|medium format/i },
    { id: 'full-frame', label: 'Full-frame', test: /full-frame/i },
    { id: 'aps-h', label: 'APS-H', test: /APS-H/i },
    // Fujifilm's X-Trans and its few Bayer bodies (X-A/X-T100/X-T200, the
    // original X100's EXR) are all APS-C.
    { id: 'aps-c', label: 'APS-C', test: /APS-C|X-Trans|^Bayer CMOS/i },
    { id: 'four-thirds', label: 'Four Thirds', test: /four thirds|^4\/3"/i },
    { id: '1-inch', label: '1-inch', test: /^1-inch|^1"/i },
    { id: 'small', label: 'Smaller than 1-inch', test: /^1\/\d/ },
  ];

  function sensorFormat(cam) {
    const f = SENSOR_FORMATS.find(s => s.test.test(String(cam.sensorType || '')));
    return f ? f.id : null;
  }

  // An electronic finder, or a Leica M's optical rangefinder (stored as
  // focusingSystem, with no evfType). Rear-screen-only bodies have neither.
  function hasViewfinder(cam) {
    return !!cam.evfType || cam.focusingSystem === 'Rangefinder';
  }

  // The mount pages' rule: anything but "Manual" is an autofocus motor.
  function isAutofocus(lens) {
    return lens.afType !== 'Manual';
  }

  // Full-frame-equivalent focal range. `focalLengthEquiv` is "35mm",
  // "24-105mm" or "150–600mm (210–840mm w/ TC)"; a teleconverter reading in
  // brackets is not the lens's own range (kit.js's focalRange, per lens).
  function focalRange(lens) {
    const own = String(lens.focalLengthEquiv || '').split('(')[0];
    const nums = (own.match(/\d+(?:\.\d+)?/g) || []).map(Number);
    return nums.length ? [Math.min(...nums), Math.max(...nums)] : null;
  }

  // ── Row records ────────────────────────────
  // What a row knows about its item. `ctx` is supplied by the generator:
  // { id, brand, brandName, name, href, mountLabel } — the parts that depend
  // on which brand file the item came from.
  function priceMap(item) {
    const out = {};
    for (const c of CURRENCIES) {
      const v = item.prices && item.prices[c];
      if (typeof v === 'number' && v > 0) out[c] = v;
    }
    return out;
  }

  function record(kind, item, ctx) {
    const base = {
      id: ctx.id, brand: ctx.brand, name: ctx.name, href: ctx.href,
      year: item.year, weight: item.weight,
      disc: !!item.discontinued, pre: !!item.preRelease,
      prices: priceMap(item),
    };
    if (kind === 'cameras') {
      return Object.assign(base, {
        sensor: sensorFormat(item),
        mp: item.sensorMP,
        lens: item.lensType === 'Fixed' ? 'fixed' : 'interchangeable',
        mount: item.mount,
        ibis: !!item.ibis,
        sealed: !!item.weatherSealed,
        evf: hasViewfinder(item),
      });
    }
    const range = focalRange(item) || [null, null];
    return Object.assign(base, {
      maker: item.manufacturer,
      mount: item.mount,
      type: String(item.type || '').toLowerCase(),
      fmin: range[0], fmax: range[1],
      aperture: item.maxAperture,
      focus: isAutofocus(item) ? 'af' : 'manual',
      ois: !!item.ois,
      sealed: !!item.weatherSealed,
      filter: typeof item.filterThread === 'number' ? item.filterThread : null,
    });
  }

  // How each record field travels in a row's attributes: `data-id`, plus one
  // `data-f` holding the fields below in this order, '|'-separated (empty =
  // none). One packed attribute instead of a dozen named ones keeps the lens
  // page about a third smaller. The name is read from the row's link text.
  const FIELDS = {
    cameras: {
      brand: 'str', year: 'num', weight: 'num', disc: 'bool', pre: 'bool', prices: 'prices',
      sensor: 'str', mp: 'num', lens: 'str', mount: 'str', ibis: 'bool', sealed: 'bool', evf: 'bool',
    },
    lenses: {
      year: 'num', weight: 'num', disc: 'bool', pre: 'bool', prices: 'prices',
      maker: 'str', mount: 'str', type: 'str', fmin: 'num', fmax: 'num', aperture: 'num',
      focus: 'str', ois: 'bool', sealed: 'bool', filter: 'num',
    },
  };

  const attrEsc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

  // ' data-id="sony:a7-iv" data-f="sony|2021|658|…"'
  function rowAttrs(kind, rec) {
    const parts = Object.entries(FIELDS[kind]).map(([key, type]) => {
      const v = rec[key];
      if (type === 'bool') return v ? '1' : '';
      if (type === 'prices') return Object.entries(v || {}).map(([c, n]) => `${c}:${n}`).join(',');
      const s = v == null ? '' : String(v);
      if (s.includes('|')) throw new Error(`finder: ${rec.id}.${key} contains "|"`);
      return s;
    });
    return ` data-id="${attrEsc(rec.id)}" data-f="${attrEsc(parts.join('|'))}"`;
  }

  // The inverse of rowAttrs, from an element's `dataset`.
  function readRow(kind, dataset) {
    const vals = String(dataset.f || '').split('|');
    const rec = { id: dataset.id };
    Object.entries(FIELDS[kind]).forEach(([key, type], i) => {
      const s = vals[i] == null ? '' : vals[i];
      if (type === 'bool') rec[key] = s === '1';
      else if (type === 'prices') {
        rec[key] = {};
        for (const pair of s.split(',').filter(Boolean)) {
          const [c, n] = pair.split(':');
          rec[key][c] = Number(n);
        }
      } else if (type === 'num') rec[key] = s === '' ? null : Number(s);
      else rec[key] = s === '' ? null : s;
    });
    return rec;
  }

  // ── Filters ────────────────────────────────
  // One entry per URL key. `type`:
  //   choice — any of several ids (a comma list in the URL)
  //   max    — the item's value is at most the number given
  //   min    — at least
  //   yes    — the item has it ('1' in the URL)
  //   range  — focal length: the lens's own range overlaps "from-to"
  //   exact  — equals the number given
  // Price filters read the selected currency (see `run`).
  const FILTERS = {
    cameras: [
      { key: 'brand', label: 'Brand', type: 'choice', field: 'brand' },
      { key: 'sensor', label: 'Sensor size', type: 'choice', field: 'sensor' },
      { key: 'lens', label: 'Lens', type: 'choice', field: 'lens' },
      // A fixed-lens camera's stored mount is its system's, not a mount it
      // takes lenses for, so a mount choice matches interchangeable bodies only.
      { key: 'mount', label: 'Mount', type: 'choice', field: 'mount', only: r => r.lens === 'interchangeable' },
      { key: 'maxprice', label: 'Max price', type: 'max', field: 'price' },
      { key: 'maxweight', label: 'Max weight (g)', type: 'max', field: 'weight' },
      { key: 'minmp', label: 'Min megapixels', type: 'min', field: 'mp' },
      { key: 'since', label: 'Announced since', type: 'min', field: 'year' },
      { key: 'ibis', label: 'In-body stabilization', type: 'yes', field: 'ibis' },
      { key: 'sealed', label: 'Weather sealed', type: 'yes', field: 'sealed' },
      { key: 'evf', label: 'Viewfinder', type: 'yes', field: 'evf' },
    ],
    lenses: [
      { key: 'mount', label: 'Mount', type: 'choice', field: 'mount' },
      { key: 'maker', label: 'Maker', type: 'choice', field: 'maker' },
      { key: 'type', label: 'Type', type: 'choice', field: 'type' },
      { key: 'focal', label: 'Focal length (mm, full-frame equiv.)', type: 'range' },
      { key: 'maxaperture', label: 'Max aperture', type: 'max', field: 'aperture' },
      { key: 'maxweight', label: 'Max weight (g)', type: 'max', field: 'weight' },
      { key: 'maxprice', label: 'Max price', type: 'max', field: 'price' },
      { key: 'focus', label: 'Focus', type: 'choice', field: 'focus' },
      { key: 'filter', label: 'Filter thread (mm)', type: 'exact', field: 'filter' },
      { key: 'ois', label: 'Optical stabilization', type: 'yes', field: 'ois' },
      { key: 'sealed', label: 'Weather sealed', type: 'yes', field: 'sealed' },
    ],
  };

  // Each sort has one natural direction; missing values always sort last.
  const SORTS = {
    cameras: [
      { key: 'year', label: 'Newest first', field: 'year', dir: -1 },
      { key: 'price', label: 'Price: low to high', field: 'price', dir: 1 },
      { key: 'weight', label: 'Lightest first', field: 'weight', dir: 1 },
      { key: 'mp', label: 'Most megapixels', field: 'mp', dir: -1 },
      { key: 'name', label: 'Name A–Z', field: 'name', dir: 1 },
    ],
    lenses: [
      { key: 'year', label: 'Newest first', field: 'year', dir: -1 },
      { key: 'price', label: 'Price: low to high', field: 'price', dir: 1 },
      { key: 'weight', label: 'Lightest first', field: 'weight', dir: 1 },
      { key: 'focal', label: 'Widest first', field: 'fmin', dir: 1 },
      { key: 'aperture', label: 'Brightest first', field: 'aperture', dir: 1 },
      { key: 'name', label: 'Name A–Z', field: 'name', dir: 1 },
    ],
  };
  const DEFAULT_SORT = 'year';

  const filterDef = (kind, key) => FILTERS[kind].find(f => f.key === key);
  const sortDef = (kind, key) => SORTS[kind].find(s => s.key === key);

  // ── State and the URL grammar ──────────────
  // { filters: { key: value }, sort, cur, disc }. Values: choice → array of
  // ids; max/min/exact → number; yes → true; range → [from, to].
  function emptyState() {
    return { filters: {}, sort: DEFAULT_SORT, cur: 'USD', disc: false };
  }

  const num = s => {
    const n = Number(s);
    return s !== '' && s != null && Number.isFinite(n) && n >= 0 ? n : null;
  };

  // One filter value from its URL text, or null when it is not valid.
  function parseValue(def, raw) {
    const s = String(raw == null ? '' : raw).trim();
    if (!s) return null;
    switch (def.type) {
      case 'choice': {
        const ids = [...new Set(s.split(',').map(x => x.trim()).filter(Boolean))];
        return ids.length ? ids : null;
      }
      case 'yes': return s === '1' || s === 'true' ? true : null;
      case 'range': {
        const m = /^(\d+(?:\.\d+)?)?-(\d+(?:\.\d+)?)?$/.exec(s) || /^(\d+(?:\.\d+)?)()$/.exec(s);
        if (!m) return null;
        let from = m[1] ? Number(m[1]) : null;
        let to = m[2] ? Number(m[2]) : (m[0].includes('-') ? null : from);
        if (from == null && to == null) return null;
        if (from != null && to != null && from > to) [from, to] = [to, from];
        return [from, to];
      }
      default: return num(s);
    }
  }

  function formatValue(def, v) {
    if (def.type === 'choice') return v.join(',');
    if (def.type === 'yes') return '1';
    if (def.type === 'range') return `${v[0] == null ? '' : v[0]}-${v[1] == null ? '' : v[1]}`;
    return String(v);
  }

  // Builds a state from plain key → text pairs (a URL hash or a preset's
  // config). Unknown keys and invalid values are dropped; `errors` names
  // them for callers that must not drop silently (presets).
  function stateFromPairs(kind, pairs) {
    const state = emptyState();
    const errors = [];
    for (const [key, raw] of pairs) {
      if (key === 'sort') {
        if (sortDef(kind, raw)) state.sort = raw; else errors.push(`unknown sort "${raw}"`);
      } else if (key === 'cur') {
        const c = String(raw).toUpperCase();
        if (CURRENCIES.includes(c)) state.cur = c; else errors.push(`unknown currency "${raw}"`);
      } else if (key === 'disc') {
        state.disc = raw === '1' || raw === true || raw === 'true';
      } else {
        const def = filterDef(kind, key);
        if (!def) { errors.push(`unknown filter "${key}"`); continue; }
        const v = parseValue(def, Array.isArray(raw) ? raw.join(',') : raw);
        if (v == null) errors.push(`invalid value for "${key}": ${JSON.stringify(raw)}`);
        else state.filters[key] = v;
      }
    }
    return { state, errors };
  }

  // '#brand=sony,nikon&maxweight=500&sort=weight' → state. Bad input is
  // ignored, so any link opens a working page.
  function parseState(kind, hash) {
    const body = String(hash || '').replace(/^#/, '');
    const pairs = [];
    for (const part of body.split('&').filter(Boolean)) {
      const i = part.indexOf('=');
      if (i < 1) continue;
      let v = part.slice(i + 1);
      try { v = decodeURIComponent(v); } catch (e) { /* keep as typed */ }
      pairs.push([part.slice(0, i), v]);
    }
    return stateFromPairs(kind, pairs).state;
  }

  // State → '#…' with only non-default parts, in a fixed order so one state
  // has one URL. '' for the default state.
  function formatState(kind, state) {
    const parts = [];
    for (const def of FILTERS[kind]) {
      const v = state.filters[def.key];
      if (v != null) parts.push(`${def.key}=${formatValue(def, v)}`);
    }
    if (state.sort && state.sort !== DEFAULT_SORT) parts.push(`sort=${state.sort}`);
    if (state.cur && state.cur !== 'USD') parts.push(`cur=${state.cur}`);
    if (state.disc) parts.push('disc=1');
    return parts.length ? `#${parts.join('&')}` : '';
  }

  // ── Matching and sorting ───────────────────
  const priceIn = (rec, cur) => (rec.prices && rec.prices[cur] != null ? rec.prices[cur] : null);
  const valueOf = (rec, field, cur) => (field === 'price' ? priceIn(rec, cur) : rec[field]);

  // Does `rec` pass one filter? (Price is read in `cur`.)
  function passes(def, v, rec, cur) {
    if (def.only && !def.only(rec)) return false;
    switch (def.type) {
      case 'choice': return v.includes(String(rec[def.field]));
      case 'yes': return !!rec[def.field];
      case 'range': {
        if (rec.fmin == null) return false;
        const [from, to] = v;
        return (from == null || rec.fmax >= from) && (to == null || rec.fmin <= to);
      }
      case 'exact': return rec[def.field] === v;
      default: {
        const x = valueOf(rec, def.field, cur);
        if (x == null) return false;
        return def.type === 'max' ? x <= v : x >= v;
      }
    }
  }

  // Whether the state reads prices: then an item without a price in the
  // selected currency cannot be placed, and is hidden (and counted).
  function usesPrice(state) {
    return state.filters.maxprice != null || state.sort === 'price';
  }

  function matches(kind, rec, state) {
    if (rec.disc && !state.disc) return false;
    for (const [key, v] of Object.entries(state.filters)) {
      const def = filterDef(kind, key);
      if (def && !passes(def, v, rec, state.cur)) return false;
    }
    return true;
  }

  function sortItems(kind, recs, state) {
    const def = sortDef(kind, state.sort) || sortDef(kind, DEFAULT_SORT);
    const cmp = (a, b) => {
      const x = valueOf(a, def.field, state.cur);
      const y = valueOf(b, def.field, state.cur);
      if (x == null || y == null) return (x == null) - (y == null);
      if (typeof x === 'string') return def.dir * x.localeCompare(y);
      return def.dir * (x - y);
    };
    // Ties fall back to newest, then name, so the order is stable everywhere.
    return [...recs].sort((a, b) => cmp(a, b) || ((b.year || 0) - (a.year || 0)) || a.name.localeCompare(b.name));
  }

  // The whole query: which items show, in what order, and how many were
  // hidden only because they have no price in the selected currency.
  function run(kind, recs, state) {
    const pricey = usesPrice(state);
    let noPrice = 0;
    const shown = [];
    for (const rec of recs) {
      if (pricey) {
        const withoutPrice = Object.assign({}, state, { filters: Object.assign({}, state.filters) });
        delete withoutPrice.filters.maxprice;
        if (priceIn(rec, state.cur) == null) {
          if (matches(kind, rec, withoutPrice)) noPrice++;
          continue;
        }
      }
      if (matches(kind, rec, state)) shown.push(rec);
    }
    return { items: sortItems(kind, shown, state), noPrice };
  }

  // ── Words ──────────────────────────────────
  function money(amount, cur) {
    return SYMBOL[cur] + Math.round(amount).toLocaleString(cur === 'JPY' ? 'ja-JP' : 'en-US');
  }

  // The price cell. Never converted: no price in `cur` reads "—".
  function priceText(rec, cur) {
    const v = priceIn(rec, cur);
    if (v != null) return money(v, cur);
    if (rec.pre && !Object.keys(rec.prices || {}).length) return 'Not announced';
    return '—';
  }

  const plural = (n, one, many) => `${n.toLocaleString('en-US')} ${n === 1 ? one : many}`;
  const NOUN = { cameras: ['camera', 'cameras'], lenses: ['lens', 'lenses'] };

  // "Showing 98 of 232 cameras", and the line explaining price-hidden items.
  function summary(kind, shown, total, noPrice, cur) {
    const [one, many] = NOUN[kind];
    const head = shown === total ? `Showing all ${plural(total, one, many)}` : `Showing ${shown.toLocaleString('en-US')} of ${plural(total, one, many)}`;
    const note = noPrice
      ? `${plural(noPrice, one, many)} hidden: no ${cur} price.${cur === 'USD' ? '' : ' Switch to USD to see more.'}`
      : '';
    return { head, note };
  }

  // ── Presets ────────────────────────────────
  // A preset (SITE_CONFIG.finderPresets[kind][i]) is a saved finder state:
  // { slug, title, intro?, filters: { key: value }, sort?, currency?, disc?,
  //   limit? }. Returns the state, or throws naming the preset and the fault.
  const RESERVED = new Set(['index']);
  function presetState(kind, preset) {
    const where = `finderPresets.${kind} "${preset && preset.slug}"`;
    if (!preset || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(preset.slug || '')) throw new Error(`${where}: slug must be lower-case words joined by hyphens`);
    if (RESERVED.has(preset.slug)) throw new Error(`${where}: slug is reserved`);
    if (!preset.title) throw new Error(`${where}: no title`);
    const pairs = Object.entries(preset.filters || {});
    if (preset.sort) pairs.push(['sort', preset.sort]);
    if (preset.currency) pairs.push(['cur', preset.currency]);
    if (preset.disc) pairs.push(['disc', '1']);
    const { state, errors } = stateFromPairs(kind, pairs);
    if (errors.length) throw new Error(`${where}: ${errors.join('; ')}`);
    if (preset.limit != null && !(Number.isInteger(preset.limit) && preset.limit > 0)) throw new Error(`${where}: limit must be a positive whole number`);
    return state;
  }

  // ─────────────────────────────────────────────
  // BROWSER — wires a generated finder page. The page carries
  // <main data-finder="cameras|lenses">, a hidden <form id="finder-form">
  // (revealed here), and <tbody id="finder-rows"> whose rows carry rowAttrs.
  // ─────────────────────────────────────────────
  function boot(doc, win) {
    const root = doc.querySelector('[data-finder]');
    if (!root) return null;
    const kind = root.dataset.finder;
    const form = doc.getElementById('finder-form');
    const tbody = doc.getElementById('finder-rows');
    const total = tbody.rows.length;
    const rows = [...tbody.rows].map(tr => {
      const rec = readRow(kind, tr.dataset);
      rec.name = tr.querySelector('th a').textContent.trim();
      return { tr, rec, price: tr.querySelector('.finder-price') };
    });
    const byId = new Map(rows.map(r => [r.rec.id, r]));
    const recs = rows.map(r => r.rec);
    const track = (path, title) => { if (typeof win.trackEvent === 'function') win.trackEvent(path, title); };
    const countEl = doc.getElementById('finder-count');
    const noteEl = doc.getElementById('finder-note');
    const emptyEl = doc.getElementById('finder-empty');
    let state = parseState(kind, win.location.hash);

    // Form ⇄ state. Inputs are named after their filter key.
    function writeForm() {
      for (const el of form.elements) {
        if (!el.name) continue;
        const def = filterDef(kind, el.name);
        if (el.name === 'sort') el.value = state.sort;
        else if (el.name === 'cur') el.value = state.cur;
        else if (el.name === 'disc') el.checked = state.disc;
        else if (el.name === 'focal-from' || el.name === 'focal-to') {
          const v = state.filters.focal;
          el.value = v && v[el.name === 'focal-from' ? 0 : 1] != null ? v[el.name === 'focal-from' ? 0 : 1] : '';
        } else if (!def) continue;
        else if (def.type === 'choice') el.checked = (state.filters[def.key] || []).includes(el.value);
        else if (def.type === 'yes') el.checked = !!state.filters[def.key];
        else el.value = state.filters[def.key] != null ? state.filters[def.key] : '';
      }
    }

    function readForm() {
      const pairs = [];
      const choice = {};
      let focalFrom = '';
      let focalTo = '';
      for (const el of form.elements) {
        if (!el.name) continue;
        if (el.name === 'sort' || el.name === 'cur') { pairs.push([el.name, el.value]); continue; }
        if (el.name === 'disc') { if (el.checked) pairs.push(['disc', '1']); continue; }
        if (el.name === 'focal-from') { focalFrom = el.value.trim(); continue; }
        if (el.name === 'focal-to') { focalTo = el.value.trim(); continue; }
        const def = filterDef(kind, el.name);
        if (!def) continue;
        if (def.type === 'choice') { if (el.checked) (choice[def.key] = choice[def.key] || []).push(el.value); }
        else if (def.type === 'yes') { if (el.checked) pairs.push([def.key, '1']); }
        else if (el.value.trim() !== '') pairs.push([def.key, el.value]);
      }
      for (const [k, ids] of Object.entries(choice)) pairs.push([k, ids.join(',')]);
      if (focalFrom || focalTo) pairs.push(['focal', `${focalFrom}-${focalTo}`]);
      return stateFromPairs(kind, pairs).state;
    }

    function render() {
      const { items, noPrice } = run(kind, recs, state);
      const visible = new Set(items.map(r => r.id));
      for (const r of rows) {
        r.tr.hidden = !visible.has(r.rec.id);
        if (r.price) r.price.textContent = priceText(r.rec, state.cur);
      }
      // Re-append in sorted order (hidden rows keep their place at the end).
      const frag = doc.createDocumentFragment();
      for (const rec of items) frag.appendChild(byId.get(rec.id).tr);
      for (const r of rows) if (!visible.has(r.rec.id)) frag.appendChild(r.tr);
      tbody.appendChild(frag);
      const s = summary(kind, items.length, total, noPrice, state.cur);
      countEl.textContent = s.head;
      noteEl.textContent = s.note;
      noteEl.hidden = !s.note;
      emptyEl.hidden = items.length > 0;
      const head = doc.getElementById('finder-price-head');
      if (head) head.textContent = `Price (${state.cur})`;
      updatePicks();
    }

    function setHash() {
      const h = formatState(kind, state);
      const url = win.location.pathname + win.location.search + h;
      if (win.history && win.history.replaceState) win.history.replaceState(null, '', url);
    }

    form.addEventListener('change', e => {
      const name = e.target.name;
      if (!name || name === 'pick') return;
      state = readForm();
      setHash();
      render();
      const key = name.startsWith('focal-') ? 'focal' : name;
      if (key === 'sort') track(`finder-sort:${kind}:${state.sort}`, `Finder sort: ${state.sort}`);
      else if (key === 'cur') track(`finder-currency:${kind}:${state.cur}`, `Finder currency: ${state.cur}`);
      else if (key === 'disc') track(`finder-disc:${kind}:${state.disc ? 'on' : 'off'}`, 'Finder: show discontinued');
      else track(`finder-filter:${kind}:${key}`, `Finder filter: ${key}`);
    });
    form.addEventListener('submit', e => e.preventDefault());
    const clear = doc.getElementById('finder-clear');
    const clearAll = () => {
      const keep = { sort: state.sort, cur: state.cur };
      state = Object.assign(emptyState(), keep);
      writeForm();
      setHash();
      render();
      track(`finder-clear:${kind}`, 'Finder: clear filters');
    };
    if (clear) clear.addEventListener('click', clearAll);
    for (const b of doc.querySelectorAll('[data-finder-clear]')) b.addEventListener('click', clearAll);
    win.addEventListener('hashchange', () => {
      state = parseState(kind, win.location.hash);
      writeForm();
      render();
    });

    // Item links: one delegated listener instead of an attribute per row.
    tbody.addEventListener('click', e => {
      const a = e.target.closest('a');
      if (a) track(`finder-item:${kind}`, `Finder item: ${a.textContent.trim()}`);
    });

    // ── Compare (cameras) ──
    const bar = doc.getElementById('finder-compare');
    const barText = doc.getElementById('finder-compare-text');
    const barLink = doc.getElementById('finder-compare-link');
    function picked() {
      return rows.filter(r => !r.tr.hidden && r.tr.querySelector('input[name="pick"]:checked')).map(r => r.rec.id);
    }
    function updatePicks() {
      if (!bar) return;
      const ids = picked();
      const full = ids.length >= COMPARE_MAX;
      for (const r of rows) {
        const box = r.tr.querySelector('input[name="pick"]');
        if (box) box.disabled = full && !box.checked;
      }
      bar.hidden = ids.length === 0;
      barText.textContent = ids.length < COMPARE_MIN
        ? `${ids.length} selected — pick ${COMPARE_MIN - ids.length} more to compare`
        : `${ids.length} selected${full ? ` (up to ${COMPARE_MAX})` : ''}`;
      const ready = ids.length >= COMPARE_MIN;
      barLink.setAttribute('aria-disabled', ready ? 'false' : 'true');
      barLink.classList.toggle('disabled', !ready);
      barLink.href = ready ? `${barLink.dataset.base}#cameras=${ids.join(',')}` : barLink.dataset.base;
    }
    if (bar) {
      // The boxes do nothing without this script, so it adds them.
      for (const r of rows) {
        const box = doc.createElement('input');
        box.type = 'checkbox';
        box.name = 'pick';
        box.className = 'finder-pick';
        box.value = r.rec.id;
        box.setAttribute('aria-label', `Select ${r.rec.name} to compare`);
        const th = r.tr.querySelector('th');
        th.insertBefore(box, th.firstChild);
      }
      tbody.addEventListener('change', e => { if (e.target.name === 'pick') updatePicks(); });
      barLink.addEventListener('click', e => {
        const n = picked().length;
        if (n < COMPARE_MIN) { e.preventDefault(); return; }
        track(`finder-compare:${n}`, `Finder: compare ${n} cameras`);
      });
      const reset = doc.getElementById('finder-compare-clear');
      if (reset) reset.addEventListener('click', () => {
        for (const box of tbody.querySelectorAll('input[name="pick"]:checked')) box.checked = false;
        updatePicks();
      });
    }

    // Filters start folded on a phone, so the list is the first thing seen.
    const panel = doc.getElementById('finder-panel');
    if (panel && win.innerWidth < 600) panel.open = false;

    form.hidden = false;
    writeForm();
    render();
    return { kind, get state() { return state; }, render };
  }

  const api = {
    CURRENCIES, COMPARE_MIN, COMPARE_MAX, SENSOR_FORMATS, FILTERS, SORTS, DEFAULT_SORT, FIELDS,
    sensorFormat, hasViewfinder, isAutofocus, focalRange, record, rowAttrs, readRow,
    emptyState, parseState, formatState, stateFromPairs, matches, sortItems, run, usesPrice,
    money, priceText, summary, presetState, boot,
  };
  if (typeof window !== 'undefined') {
    window.Finder = api;
    if (typeof document !== 'undefined') {
      const start = () => boot(document, window);
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
      else start();
    }
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
