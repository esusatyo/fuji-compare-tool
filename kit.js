// ─────────────────────────────────────────────
// KIT BUILDER — the arithmetic behind /kit/
//
// A kit is one camera body plus the lenses that fit it. Everything here is
// pure (no DOM, no globals read): which lenses fit a body, what a kit weighs
// and costs, which currency the page can honestly total in, and the URL
// grammar. engine.js renders with it (COMPARE_CONFIG.kit); tests require it
// directly. Loaded before engine.js, like size.js.
//
// Ids are '<brand>:<slug>' everywhere, as on the compare page.
// ─────────────────────────────────────────────
(function () {
  const MAX_LENSES = 6;
  const KIT_COUNT = 2;

  const brandOf = id => id.split(':')[0];

  // A fixed-lens body (X100VI, Leica Q3) is a whole kit by itself.
  function takesLenses(cam) {
    return !!cam && cam.lensType !== 'Fixed';
  }

  // Brand slugs in the site's own order, then any brand the list forgot.
  function brandOrder(registry) {
    const first = Object.values(registry)[0];
    const listed = ((first && first.REGISTERED_BRANDS) || []).map(b => b.slug).filter(s => registry[s]);
    return [...listed, ...Object.keys(registry).filter(s => !listed.includes(s))];
  }

  // Every camera and lens on the site, keyed by id.
  //
  // Lenses for a shared mount are stored once per brand file (an L-Mount Sigma
  // prime is in sigma/, panasonic/ and leica/, with identical figures), so the
  // copies are folded by mount + name. The one kept is the copy in the lens
  // maker's own brand file, else the first in site order — a rule that does
  // not depend on the body, so a shared link names the same id for everyone.
  // `canonical` maps every copy's id to the kept one.
  function catalogue(registry) {
    const order = brandOrder(registry);
    const cameras = {};
    const all = {};
    const copies = new Map();
    const brandName = {};
    for (const slug of order) {
      const data = registry[slug];
      brandName[slug] = data.BRAND_CONFIG.name;
      for (const [id, cam] of Object.entries(data.CAMERAS)) cameras[`${slug}:${id}`] = cam;
      for (const [id, lens] of Object.entries(data.LENSES)) {
        const full = `${slug}:${id}`;
        all[full] = lens;
        const key = `${lens.mount}|${lens.name}`;
        if (!copies.has(key)) copies.set(key, []);
        copies.get(key).push(full);
      }
    }
    const lenses = {};
    const canonical = {};
    for (const ids of copies.values()) {
      const keep = ids.find(id => brandName[brandOf(id)] === all[id].manufacturer) || ids[0];
      lenses[keep] = all[keep];
      for (const id of ids) canonical[id] = keep;
    }
    return { registry, order, brandName, cameras, lenses, canonical };
  }

  // The lenses that fit `mount`, as browse groups: each brand file's own
  // dropdown groups, the body's brand first. Empty groups are dropped.
  function lensGroups(cat, mount, firstBrand) {
    const order = [firstBrand, ...cat.order.filter(b => b !== firstBrand)].filter(b => cat.registry[b]);
    const groups = [];
    for (const slug of order) {
      for (const grp of cat.registry[slug].LENS_DROPDOWN_GROUPS) {
        const ids = grp.ids.map(s => `${slug}:${s}`)
          .filter(id => cat.lenses[id] && cat.lenses[id].mount === mount);
        if (ids.length) groups.push({ label: grp.label.replace(/^[─\s]+|[─\s]+$/g, ''), ids });
      }
    }
    return groups;
  }

  // A kit as it may legitimately be shown: a known body (else empty), and only
  // lenses that exist, fit its mount, appear once, up to MAX_LENSES. Used on
  // load (a link can say anything) and whenever the body changes.
  function sanitize(kit, cat) {
    const body = kit && cat.cameras[kit.body] ? kit.body : null;
    if (!body || !takesLenses(cat.cameras[body])) return { body, lenses: [] };
    const mount = cat.cameras[body].mount;
    const lenses = [];
    for (const raw of kit.lenses || []) {
      const id = cat.canonical[raw];
      if (!id || cat.lenses[id].mount !== mount || lenses.includes(id)) continue;
      lenses.push(id);
      if (lenses.length === MAX_LENSES) break;
    }
    return { body, lenses };
  }

  const isPriced = it => !!(it && it.prices && it.prices.USD != null);

  // The one currency the whole page is priced in. The chosen currency is used
  // only when every priced item (both kits) has a list price in it; otherwise
  // everything is in US dollars, so a total always equals the sum of the rows
  // above it and the two kits stay comparable. Never converted, never mixed.
  // `missing` names the items that forced the fallback.
  function priceView(items, currency) {
    const missing = items.filter(it => isPriced(it) && it.prices[currency] == null);
    const fallback = missing.length > 0 && currency !== 'USD';
    return { currency: fallback ? 'USD' : currency, fallback, missing: missing.map(it => it.name) };
  }

  // What a kit adds up to in `currency` (the priceView currency). An item with
  // no US price — announced, not yet priced — is left out and named.
  function totals(items, currency) {
    const priced = items.filter(isPriced);
    return {
      count: items.length,
      weight: items.reduce((sum, it) => sum + (it.weight || 0), 0),
      price: priced.length ? priced.reduce((sum, it) => sum + it.prices[currency], 0) : null,
      unpriced: items.filter(it => !isPriced(it)).map(it => it.name),
      discontinued: items.filter(it => it.discontinued).map(it => it.name),
    };
  }

  // Lowest and highest full-frame-equivalent focal length among the lenses.
  // `focalLengthEquiv` is "35mm", "24-105mm" or "150–600mm (210–840mm w/ TC)";
  // a teleconverter reading in brackets is not the lens's own range.
  function focalRange(lenses) {
    const nums = [];
    for (const lens of lenses) {
      const own = String(lens.focalLengthEquiv || '').split('(')[0];
      for (const m of own.match(/\d+(?:\.\d+)?/g) || []) nums.push(Number(m));
    }
    return nums.length ? { min: Math.min(...nums), max: Math.max(...nums) } : null;
  }

  // The distinct filter thread sizes (mm) the lenses take, smallest first.
  function filterSizes(lenses) {
    return [...new Set(lenses.map(l => l.filterThread).filter(v => typeof v === 'number'))]
      .sort((a, b) => a - b);
  }

  function ounces(grams) {
    return (grams / 28.349523125).toFixed(1);
  }

  // Two kits' totals in words, and which one wins each figure (0, 1 or null on
  // a tie). Price is compared only when both totals exist and neither kit left
  // an unpriced item out — a total missing a lens is not "cheaper".
  // `money` formats an amount in the page's currency.
  function verdict(a, b, money, names = ['Kit 1', 'Kit 2']) {
    const comparable = a.price != null && b.price != null && !a.unpriced.length && !b.unpriced.length;
    const dw = b.weight - a.weight;
    const dp = comparable ? b.price - a.price : 0;
    const weightWinner = dw === 0 ? null : (dw < 0 ? 1 : 0);
    const priceWinner = !comparable || dp === 0 ? null : (dp < 0 ? 1 : 0);
    const grams = `${Math.abs(dw).toLocaleString('en-US')} g`;
    const amount = comparable ? money(Math.abs(dp)) : '';
    let text;
    if (weightWinner === null) {
      if (priceWinner === null) {
        text = comparable ? 'Both kits weigh the same and cost the same.' : 'Both kits weigh the same.';
      } else {
        text = `${names[priceWinner]} is ${amount} cheaper than ${names[1 - priceWinner]}; they weigh the same.`;
      }
    } else {
      const s = names[weightWinner];
      const o = names[1 - weightWinner];
      if (!comparable) text = `${s} is ${grams} lighter than ${o}.`;
      else if (priceWinner === null) text = `${s} is ${grams} lighter than ${o} and costs the same.`;
      else if (priceWinner === weightWinner) text = `${s} is ${grams} lighter and ${amount} cheaper than ${o}.`;
      else text = `${s} is ${grams} lighter but ${amount} more expensive than ${o}.`;
    }
    return { text, weightWinner, priceWinner, comparable };
  }

  // ── URL state ──────────────────────────────
  // #kit=<body>[,<lens>…][;<body>[,<lens>…]] — raw ids, not yet checked
  // against the data (sanitize does that). Always KIT_COUNT kits.
  function parseHash(hash) {
    const kits = Array.from({ length: KIT_COUNT }, () => ({ body: null, lenses: [] }));
    const m = /^#kit=(.*)$/.exec(hash || '');
    if (!m) return kits;
    let raw = m[1];
    try { raw = decodeURIComponent(raw); } catch (e) { /* keep as typed */ }
    raw.split(';').slice(0, KIT_COUNT).forEach((part, i) => {
      const ids = part.split(',').map(s => s.trim()).filter(Boolean);
      if (ids.length) kits[i] = { body: ids[0], lenses: ids.slice(1) };
    });
    return kits;
  }

  // '' when there is nothing to name. A kit without a body has no lenses.
  function formatHash(kits) {
    const parts = kits.map(k => (k.body ? [k.body, ...k.lenses].join(',') : ''));
    while (parts.length && !parts[parts.length - 1]) parts.pop();
    return parts.length ? `#kit=${parts.join(';')}` : '';
  }

  const api = {
    MAX_LENSES, KIT_COUNT, takesLenses, catalogue, lensGroups, sanitize,
    priceView, totals, focalRange, filterSizes, ounces, verdict, parseHash, formatHash,
  };
  if (typeof window !== 'undefined') window.KitBuilder = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
