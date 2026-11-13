// ─────────────────────────────────────────────
// SIZE DIAGRAM
//
// Draws cameras (or lenses) to scale from their stated outer dimensions, and
// words the difference. One implementation for both worlds: engine.js calls it
// in the browser on every render, and scripts/generate-seo.js require()s it to
// pre-render the same markup into vs-pages and size pages — so the tool and
// the static pages cannot drift.
//
// The data holds bounding boxes only (width × height × depth, or diameter ×
// length), so an item is a rounded box, never a silhouette.
//
// How "to scale" survives a responsive layout: every outline is its own small
// <svg> whose viewBox is in millimetres and whose CSS width is
//     calc((100cqw - gutter) * <its mm> / var(--size-total))
// — a share of the container's width proportional to its millimetres. One
// --size-total per drawing means one px-per-mm for every outline in it, at any
// container width, with the labels left as ordinary HTML text.
//
// Standalone browser script (no imports), like theme.js. The tail exports it
// for Node.
// ─────────────────────────────────────────────
(function (root) {
  // ISO/IEC 7810 ID-1: a credit card, the reference object in every drawing.
  const CARD = { w: 85.6, h: 53.98 };

  // One colour per column, so three or four outlines can be told apart at a
  // glance. The first two are the columns' own accents; the third and fourth
  // are size-only tokens (engine.css defines all four for both themes).
  const COLORS = ['var(--accent-primary)', 'var(--accent-secondary)', 'var(--size-c3)', 'var(--size-c4)'];

  function esc(text) {
    return String(text).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  const num = v => (typeof v === 'number' && isFinite(v) && v > 0 ? v : null);

  // An item's box in mm (and its weight in g, which may be null). A lens is a
  // cylinder: as wide and as tall as its diameter, as deep as its length.
  // null when any dimension is missing — such an item is listed, never drawn.
  function box(item, kind) {
    if (!item) return null;
    const b = kind === 'lens'
      ? { w: num(item.diameter), h: num(item.diameter), d: num(item.length) }
      : { w: num(item.width), h: num(item.height), d: num(item.depth) };
    if (b.w == null || b.h == null || b.d == null) return null;
    b.weight = num(item.weight);
    return b;
  }

  // 16 not "16.0"; 1.8 stays 1.8.
  const trim = (n, places = 1) => String(+n.toFixed(places));

  const DIMS = {
    camera: [
      { key: 'w', label: 'Width', less: 'narrower', more: 'wider', same: 'width' },
      { key: 'h', label: 'Height', less: 'shorter', more: 'taller', same: 'height' },
      { key: 'd', label: 'Depth', less: 'slimmer', more: 'deeper', same: 'depth' },
      { key: 'weight', label: 'Weight', less: 'lighter', more: 'heavier', same: 'weight', unit: 'g' },
    ],
    lens: [
      { key: 'w', label: 'Diameter', less: 'narrower', more: 'wider', same: 'diameter' },
      { key: 'd', label: 'Length', less: 'shorter', more: 'longer', same: 'length' },
      { key: 'weight', label: 'Weight', less: 'lighter', more: 'heavier', same: 'weight', unit: 'g' },
    ],
  };

  // Below this the two are, for a reader, the same.
  const same = (dim, delta) => Math.abs(delta) < (dim.unit === 'g' ? 0.5 : 0.05);

  function list(parts) {
    if (parts.length < 2) return parts[0] || '';
    return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
  }

  // One factual sentence for two boxes: "The X-T5 is 1.8 mm narrower, 5.4 mm
  // shorter, 16 mm slimmer and 101 g lighter than the A7 IV." Equal dimensions
  // are said to be equal rather than dropped; a dimension either side lacks
  // (weight can be unknown) is left out. '' unless both boxes exist.
  function facts(nameA, a, nameB, b, kind) {
    if (!a || !b) return '';
    const differ = [];
    const equal = [];
    for (const dim of DIMS[kind === 'lens' ? 'lens' : 'camera']) {
      if (a[dim.key] == null || b[dim.key] == null) continue;
      const delta = a[dim.key] - b[dim.key];
      if (same(dim, delta)) { equal.push(dim.same); continue; }
      const amount = dim.unit === 'g' ? `${Math.round(Math.abs(delta))} g` : `${trim(Math.abs(delta))} mm`;
      differ.push(`${amount} ${delta < 0 ? dim.less : dim.more}`);
    }
    if (!differ.length) {
      return `The ${nameA} and the ${nameB} are the same size${equal.includes('weight') ? ' and weight' : ''}.`;
    }
    const tail = equal.length ? `, and the same ${list(equal)}` : '';
    return `The ${nameA} is ${list(differ)} than the ${nameB}${tail}.`;
  }

  // Table rows: one per dimension, a value per entry (null → "—"), and — for
  // exactly two measured items — the signed difference, first minus second.
  function rows(entries, kind) {
    const boxes = entries.map(e => box(e.item, kind));
    const pair = boxes.length === 2 && boxes[0] && boxes[1];
    return DIMS[kind === 'lens' ? 'lens' : 'camera'].map(dim => {
      const values = boxes.map(b => (b && b[dim.key] != null ? b[dim.key] : null));
      let diff = null;
      if (pair && values[0] != null && values[1] != null) {
        const delta = values[0] - values[1];
        const mag = dim.unit === 'g' ? `${Math.round(Math.abs(delta))} g` : `${trim(Math.abs(delta))} mm`;
        diff = same(dim, delta) ? 'Same' : `${delta < 0 ? '−' : '+'}${mag}`;
      }
      return { label: dim.label, unit: dim.unit || 'mm', values, diff };
    });
  }

  // "129.5 mm" with the imperial figure in small print beside it.
  function valueHTML(value, unit) {
    if (value == null) return '—';
    return unit === 'g'
      ? `${Math.round(value)} g <small>${(value / 28.3495).toFixed(1)} oz</small>`
      : `${trim(value)} mm <small>${(value / 25.4).toFixed(2)} in</small>`;
  }

  // ── drawing ───────────────────────────────────────────────────────
  const VIEWS = {
    camera: [
      { id: 'front', label: 'Front', x: 'w', y: 'h' },
      { id: 'top', label: 'Top', x: 'w', y: 'd' },
      { id: 'side', label: 'Side', x: 'd', y: 'h' },
    ],
    lens: [
      { id: 'front', label: 'Front', x: 'w', y: 'h', round: true },
      { id: 'side', label: 'Side', x: 'd', y: 'h' },
    ],
  };

  // Corner radius in mm: a little of the shorter side, never a pill.
  const radius = (w, h) => +Math.min(Math.min(w, h) * 0.08, 8).toFixed(2);

  // One outline, tagged with its entry's index so the legend can hide it.
  // Strokes are a constant 2px however the svg is scaled.
  function shape(view, w, h, x, y, e) {
    const paint = `data-item="${e.index}" fill="${e.color}" fill-opacity="0.1" stroke="${e.color}" stroke-width="2" vector-effect="non-scaling-stroke"`;
    if (view.round) {
      return `<ellipse cx="${trim(x + w / 2, 2)}" cy="${trim(y + h / 2, 2)}" rx="${trim(w / 2, 2)}" ry="${trim(h / 2, 2)}" ${paint}/>`;
    }
    return `<rect x="${trim(x, 2)}" y="${trim(y, 2)}" width="${trim(w, 2)}" height="${trim(h, 2)}" rx="${radius(w, h)}" ${paint}/>`;
  }

  // A figure: an svg `mmW` millimetres wide, sized by the shared scale. The
  // data-mm-* attributes restate its true size for tests and the curious.
  function figure(mmW, mmH, inner, caption, extra = '', attrs = '') {
    return `<figure class="size-fig${extra}"${attrs} data-mm-w="${trim(mmW, 2)}" data-mm-h="${trim(mmH, 2)}" style="--mm:${trim(mmW, 2)}">`
      + `<svg viewBox="0 0 ${trim(mmW, 2)} ${trim(mmH, 2)}" aria-hidden="true" focusable="false">${inner}</svg>`
      + (caption ? `<figcaption>${esc(caption)}</figcaption>` : '')
      + `</figure>`;
  }

  function cardFigure() {
    const inner = `<rect x="0" y="0" width="${CARD.w}" height="${CARD.h}" rx="3.18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4" vector-effect="non-scaling-stroke"/>`;
    return figure(CARD.w, CARD.h, inner, 'Credit card', ' size-fig--card');
  }

  // Overlay: per view, every outline in one svg — centred, on a shared
  // baseline (lens fronts share a centre), largest first so none hides another.
  function overlayViews(drawn, views) {
    let total = CARD.w;
    let widest = CARD.w;
    const figs = views.map(view => {
      const mmW = Math.max(...drawn.map(e => e.box[view.x]));
      const mmH = Math.max(...drawn.map(e => e.box[view.y]));
      total += mmW;
      widest = Math.max(widest, mmW);
      const inner = drawn.slice()
        .sort((p, q) => q.box[view.x] * q.box[view.y] - p.box[view.x] * p.box[view.y])
        .map(e => {
          const w = e.box[view.x], h = e.box[view.y];
          return shape(view, w, h, (mmW - w) / 2, view.round ? (mmH - h) / 2 : mmH - h, e);
        }).join('');
      return figure(mmW, mmH, inner, view.label);
    });
    figs.push(cardFigure());
    // Wide: everything on one row (the 15% is room for the gaps between
    // figures). Narrow: the widest figure takes most of the row, the rest wrap.
    return { html: figs.join(''), wide: total * 1.15, narrow: widest * 1.25 };
  }

  // Side by side: per view a row of separate outlines, bottom-aligned. Rows
  // stack at every width, so the scale is set by the widest row.
  function sideViews(drawn, views) {
    let widest = 0;
    const groups = views.map((view, vi) => {
      let rowMm = 0;
      const figs = drawn.map(e => {
        const w = e.box[view.x], h = e.box[view.y];
        rowMm += w;
        return figure(w, h, shape(view, w, h, 0, 0, e), '', '', ` data-item="${e.index}"`);
      });
      if (vi === 0) { figs.push(cardFigure()); rowMm += CARD.w; }
      widest = Math.max(widest, rowMm);
      return `<div class="size-row"><div class="size-row-label">${esc(view.label)}</div><div class="size-row-figs">${figs.join('')}</div></div>`;
    });
    const t = widest * 1.2;
    return { html: groups.join(''), wide: t, narrow: t };
  }

  function viewsHTML(drawn, kind, layout) {
    const views = VIEWS[kind === 'lens' ? 'lens' : 'camera'];
    const v = layout === 'side' ? sideViews(drawn, views) : overlayViews(drawn, views);
    // Never blow a small item up past ~3px per mm on a wide screen.
    const cap = Math.round(v.wide * 3);
    return `<div class="size-views size-views--${layout}" style="--size-total-wide:${trim(v.wide, 1)};--size-total-narrow:${trim(v.narrow, 1)};max-width:${cap}px">${v.html}</div>`;
  }

  // The visitor's layout choice for this page view: 'auto' follows the
  // viewport (overlay from 600px, side by side below — see engine.css) until a
  // button is pressed. Kept here so a re-render by the engine keeps it.
  let layoutChoice = 'auto';

  // Items the visitor has switched off in the legend, by name — so the choice
  // survives the engine re-rendering the table, and lapses by itself when that
  // item leaves the comparison.
  let hiddenNames = new Set();

  const NOTE = {
    tool: 'Outlines are each maker’s stated outer dimensions, drawn to scale as rounded boxes. Real bodies have grips and viewfinder humps, and makers do not all measure the same way. Sources for each item are under References, below.',
    page: 'Outlines are each maker’s stated outer dimensions, drawn to scale as rounded boxes. Real bodies have grips and viewfinder humps, and makers do not all measure the same way. Sources for each camera are under References, below.',
    compact: 'Outlines are makers’ stated outer dimensions, drawn to scale as rounded boxes; sources are under References.',
  };

  /**
   * The whole size block as HTML.
   * @param {object} o
   * @param {{name:string,color:string,item:object}[]} o.entries  1–4, in column order
   * @param {'camera'|'lens'} [o.kind='camera']
   * @param {string} [o.page='page']    names the page in the size-view event
   * @param {'tool'|'page'|'compact'} [o.variant='tool']
   *        compact (vs-pages): drawing, sentence and note only — no switch, no table
   * @param {string} [o.moreHref]       compact only: link to the full size page
   */
  function block(o) {
    const kind = o.kind === 'lens' ? 'lens' : 'camera';
    const variant = o.variant || 'tool';
    const entries = o.entries.map((e, index) => ({ ...e, index, box: box(e.item, kind) }));
    const drawn = entries.filter(e => e.box);
    if (!drawn.length) return '';
    const compact = variant === 'compact';

    // Forget hidden items that are gone; never start with everything hidden.
    hiddenNames = new Set(drawn.map(e => e.name).filter(n => hiddenNames.has(n)));
    if (hiddenNames.size >= drawn.length) hiddenNames.clear();
    const hidden = compact ? [] : drawn.filter(e => hiddenNames.has(e.name));

    const label = `Size drawing to scale: ${list(drawn.map(e =>
      `${e.name} ${kind === 'lens' ? `${trim(e.box.w)} mm diameter × ${trim(e.box.d)} mm long` : `${trim(e.box.w)} × ${trim(e.box.h)} × ${trim(e.box.d)} mm`}`))}, with a credit card for reference.`;

    // The legend doubles as a set of switches: press a name to take its
    // outlines out of the drawing (and again to put them back). Only where
    // there is more than one item, and not on vs-pages, which load no script.
    const swatch = e => `<span class="size-swatch" style="color:${e.color}"></span>`;
    const switchable = !compact && drawn.length > 1;
    const legend = `<ul class="size-legend${switchable ? ' size-legend--toggles' : ''}">${drawn.map(e => (switchable
      ? `<li><button type="button" class="size-legend-btn" data-item="${e.index}" data-name="${esc(e.name)}" aria-pressed="${!hiddenNames.has(e.name)}" title="Show or hide ${esc(e.name)} in the drawing">${swatch(e)}${esc(e.name)}</button></li>`
      : `<li>${swatch(e)}${esc(e.name)}</li>`)).join('')}</ul>`;

    const switcher = compact ? '' : `<div class="size-layout" role="group" aria-label="Drawing layout">`
      + `<button type="button" class="size-layout-btn" data-layout="overlay">Overlay</button>`
      + `<button type="button" class="size-layout-btn" data-layout="side">Side by side</button></div>`;

    const sentence = drawn.length === 2 && entries.length === 2
      ? `<p class="size-sentence">${esc(facts(drawn[0].name, drawn[0].box, drawn[1].name, drawn[1].box, kind))}</p>` : '';

    let table = '';
    if (!compact) {
      const r = rows(entries, kind);
      const hasDiff = r.some(row => row.diff != null);
      table = `<div class="size-table-wrap"><table class="size-table"><thead><tr><th scope="col"></th>`
        + entries.map(e => `<th scope="col">${esc(e.name)}</th>`).join('')
        + (hasDiff ? '<th scope="col">Difference</th>' : '') + `</tr></thead><tbody>`
        + r.map(row => `<tr><th scope="row">${row.label}</th>`
          + row.values.map(v => `<td>${valueHTML(v, row.unit)}</td>`).join('')
          + (hasDiff ? `<td class="size-diff">${row.diff == null ? '—' : row.diff}</td>` : '') + `</tr>`).join('')
        + `</tbody></table></div>`;
    }

    const more = compact && o.moreHref
      ? `<p class="size-more"><a href="${esc(o.moreHref)}">Full size comparison: all dimensions &rarr;</a></p>` : '';

    return `<div class="size-diagram${compact ? ' size-diagram--compact' : ''}" data-layout="${compact ? 'auto' : layoutChoice}" data-hidden="${hidden.map(e => e.index).join(' ')}" data-page="${esc(o.page || 'page')}" data-kind="${kind}">`
      + switcher
      + `<div class="size-stage" role="img" aria-label="${esc(label)}">`
      + viewsHTML(drawn, kind, 'overlay') + viewsHTML(drawn, kind, 'side')
      + `</div>`
      + legend + sentence + table
      + `<p class="size-note">${NOTE[variant] || NOTE.tool}</p>`
      + more
      + `</div>`;
  }

  const api = { CARD, COLORS, box, facts, rows, block, valueHTML };

  // ── the layout switch ─────────────────────────────────────────────
  // Wired once here, by delegation, for every page that loads this file — the
  // tool (whose table is re-rendered around it) and the static size pages
  // alike. Both layouts are already in the markup; the switch only flips an
  // attribute.
  if (typeof document !== 'undefined') {
    // Legend switches: hide or show one item's outlines. The last one showing
    // can't be hidden — an empty drawing is a dead end.
    document.addEventListener('click', e => {
      const btn = e.target.closest && e.target.closest('.size-legend-btn');
      const diagram = btn && btn.closest('.size-diagram');
      if (!diagram) return;
      const showing = btn.getAttribute('aria-pressed') === 'true';
      const others = diagram.querySelectorAll('.size-legend-btn[aria-pressed="true"]').length - (showing ? 1 : 0);
      if (showing && others < 1) return;
      const name = btn.dataset.name;
      if (showing) hiddenNames.add(name); else hiddenNames.delete(name);
      btn.setAttribute('aria-pressed', String(!showing));
      diagram.dataset.hidden = [...diagram.querySelectorAll('.size-legend-btn[aria-pressed="false"]')]
        .map(b => b.dataset.item).join(' ');
      if (typeof window.trackEvent === 'function') {
        window.trackEvent(`size-toggle:${diagram.dataset.page}:${showing ? 'hide' : 'show'}`, `Size drawing: ${showing ? 'hide' : 'show'} an item`);
      }
    });

    document.addEventListener('click', e => {
      const btn = e.target.closest && e.target.closest('.size-layout-btn');
      if (!btn) return;
      const diagram = btn.closest('.size-diagram');
      if (!diagram || diagram.dataset.layout === btn.dataset.layout) return;
      layoutChoice = btn.dataset.layout;
      diagram.dataset.layout = layoutChoice;
      if (typeof window.trackEvent === 'function') {
        window.trackEvent(`size-view:${diagram.dataset.page}:${layoutChoice}`, `Size layout: ${layoutChoice}`);
      }
    });
  }

  root.SizeDiagram = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
