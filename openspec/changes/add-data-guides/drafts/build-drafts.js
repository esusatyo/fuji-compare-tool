// Builds the draft articles from the live brand data, so every number is real,
// then checks every internal link: the page must exist and be in sitemap.xml
// (indexable), and every slug in a hash link must resolve. Draft tooling only;
// the real generator (tasks 2.x) replaces it.
//
//   node openspec/changes/add-data-guides/drafts/build-drafts.js
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '../../../..');
const OUT = __dirname;
const SITE = 'https://comparecameraspecs.com';
const { loadBrand, brandDirs } = require(path.join(ROOT, 'tests/helpers/load-brand'));
const { siteName } = require(path.join(ROOT, 'scripts/generate-seo.js')).siteConfig();

const DATA = {};
for (const b of brandDirs()) DATA[b] = loadBrand(b).data;
const BRAND = { fujifilm: 'Fujifilm', canon: 'Canon', sony: 'Sony', nikon: 'Nikon', leica: 'Leica', sigma: 'Sigma', panasonic: 'Panasonic', olympus: 'OM System' };
const UPDATED = { iso: '2026-11-17', text: '17 November 2026' };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const usd = n => '$' + n.toLocaleString('en-US');
const checks = []; // declared claims: [description, boolean]
const claim = (text, ok) => { checks.push([text, !!ok]); };

// ── shared page shell ──────────────────────────────────────────────
const PALETTE_LIGHT = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100'];
const PALETTE_DARK = ['#3987e5', '#d95926', '#199e70', '#c98500'];
function page({ slug, title, description, headline, body }) {
  const url = `${SITE}/articles/${slug}`;
  if (title.length > 60) throw new Error(`${slug}: title is ${title.length} chars`);
  if (description.length < 140 || description.length > 160) throw new Error(`${slug}: description is ${description.length} chars`);
  const ld = {
    '@context': 'https://schema.org', '@type': 'Article', headline,
    datePublished: UPDATED.iso, dateModified: UPDATED.iso,
    author: { '@type': 'Organization', name: siteName, url: SITE + '/' },
    publisher: { '@type': 'Organization', name: siteName, url: SITE + '/' },
    image: `${SITE}/og/articles/${slug}.png`, mainEntityOfPage: url,
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- DRAFT for owner review. The head below is what the generator would emit (design G3). -->
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="${esc(siteName)}">
<meta property="og:title" content="${esc(headline)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>
:root{--bg:#fcfcfb;--ink:#1f1f1d;--ink2:#5c5b55;--line:#e4e3de;--card:#f4f3ef;--link:#1c5cab;
${PALETTE_LIGHT.map((c, i) => `--c${i}:${c}`).join(';')}}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#1a1a19;--ink:#f0efec;--ink2:#c3c2b7;--line:#33322f;--card:#242422;--link:#86b6ef;
${PALETTE_DARK.map((c, i) => `--c${i}:${c}`).join(';')}}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:720px;margin:0 auto;padding:32px 16px 64px}
.draft{background:var(--card);border:1px dashed var(--ink2);padding:10px 14px;border-radius:8px;font-size:14px;color:var(--ink2)}
h1{font-size:34px;line-height:1.15;margin:28px 0 6px}
.dek{color:var(--ink2);font-size:19px;margin:0 0 6px}
.byline{color:var(--ink2);font-size:14px;margin:0 0 20px}
h2{font-size:23px;margin:40px 0 8px}
p{margin:0 0 14px}
a{color:var(--link)}
.answer{background:var(--card);border-left:4px solid var(--c0);padding:14px 16px;border-radius:6px;margin:0 0 24px}
.wrap{overflow-x:auto}
table{border-collapse:collapse;width:100%;font-size:15px;margin:0 0 14px}
th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line);white-space:nowrap}
thead th{color:var(--ink2);font-weight:600}
.chart{width:100%;height:auto;display:block}
.chart .grid{stroke:var(--line);stroke-width:1}
.chart .axis{fill:var(--ink2);font-size:12px}
.chart .val{fill:var(--ink);font-size:12px;font-weight:600}
.chart .cam{fill:var(--ink2);font-size:10.5px}
.chart .bar:hover path{opacity:.8}
.legend{display:flex;gap:16px;flex-wrap:wrap;font-size:14px;color:var(--ink2);margin:6px 0}
.legend i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:6px;vertical-align:-1px}
figure{margin:20px 0}
figcaption{font-size:14px;color:var(--ink2)}
details{margin-top:8px;font-size:14px}
ul.links li{margin-bottom:6px}
.meta{font-size:14px;color:var(--ink2)}
</style>
</head>
<body>
<main>
<p class="draft">Draft for review. Numbers are pulled from the site's data on ${UPDATED.text}. Not published.</p>
${body}
<p class="meta">By ${esc(siteName)}. Updated <time datetime="${UPDATED.iso}">${UPDATED.text}</time>.</p>
</main>
</body>
</html>
`;
}
const bar = (x, top, bw, base) => { const r = 4; return `M${x},${base} V${top + r} Q${x},${top} ${x + r},${top} H${x + bw - r} Q${x + bw},${top} ${x + bw},${top + r} V${base} Z`; };
const hbar = (left, y, len, bh) => { const r = Math.min(4, len / 2); return `M${left},${y} H${left + len - r} Q${left + len},${y} ${left + len},${y + r} V${y + bh - r} Q${left + len},${y + bh} ${left + len - r},${y + bh} H${left} Z`; };
const legendHTML = items => `<div class="legend">${items.map(([label, i]) => `<span><i style="background:var(--c${i})"></i>${esc(label)}</span>`).join('')}</div>`;

// ══ Article 1: lightest APS-C cameras ═════════════════════════════
function apscArticle() {
  const isApsc = c => /APS-C|X-Trans|Bayer CMOS/.test(c.sensorType) && !/Full-frame|APS-H/.test(c.sensorType);
  const all = [];
  for (const b of Object.keys(DATA)) for (const [id, c] of Object.entries(DATA[b].CAMERAS)) if (isApsc(c)) all.push({ b, id, ...c });
  all.sort((a, b) => a.weight - b.weight);
  const current = all.filter(c => !c.discontinued && !c.preRelease).slice(0, 6);
  const years = [];
  for (let y = 2016; y <= 2025; y++) years.push({ y, c: all.filter(c => c.year === y).sort((a, b) => a.weight - b.weight)[0] });
  const full = c => `${BRAND[c.b]} ${c.name}`;
  const cam = (b, id) => ({ b, id, ...DATA[b].CAMERAS[id] });

  // Every name links to an indexable comparison page (pinned where needed).
  const LINK = {
    'fujifilm:x-m5': '/vs/sony-zv-e10-ii-vs-fujifilm-x-m5',
    'canon:eos-r100': '/canon/vs/eos-r50-vs-eos-r100',
    'canon:eos-r50v': '/canon/vs/eos-r50v-vs-eos-r50',
    'canon:eos-r50': '/vs/fujifilm-x-m5-vs-canon-eos-r50',
    'sony:zv-e10-ii': '/vs/sony-zv-e10-ii-vs-fujifilm-x-m5',
    'fujifilm:x-t30iii': '/fujifilm/vs/x-t30iii-vs-x-t30ii',
  };
  for (const c of current) if (!LINK[`${c.b}:${c.id}`]) throw new Error(`no comparison link for ${c.b}:${c.id}`);

  const COLOR = { fujifilm: 0, canon: 1, sony: 2, nikon: 3 };
  const W = 720, H = 300, L = 44, R = 12, T = 34, B = 58, MAX = 450;
  const pw = W - L - R, ph = H - T - B, slot = pw / years.length, bw = Math.min(40, slot - 18);
  const y = v => T + ph - (v / MAX) * ph;
  const minW = Math.min(...years.map(v => v.c.weight)), maxW = Math.max(...years.map(v => v.c.weight));
  const wins = {}; years.forEach(({ c }) => { wins[c.b] = (wins[c.b] || 0) + 1; });
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="c1t c1d" class="chart">
<title id="c1t">Lightest new APS-C camera each year, 2016 to 2025</title>
<desc id="c1d">Bar chart. Every year's lightest launch weighs between ${minW} and ${maxW} grams. Fujifilm had the lightest launch in ${wins.fujifilm} of the ten years.</desc>`;
  for (const g of [0, 100, 200, 300, 400]) svg += `<line x1="${L}" x2="${W - R}" y1="${y(g)}" y2="${y(g)}" class="grid"/><text x="${L - 6}" y="${y(g) + 4}" class="axis" text-anchor="end">${g}</text>`;
  svg += `<text x="${L - 6}" y="${T - 14}" class="axis" text-anchor="end">grams</text>`;
  years.forEach(({ y: yr, c }, i) => {
    const x = L + i * slot + (slot - bw) / 2, top = y(c.weight), cx = x + bw / 2;
    svg += `<g class="bar"><title>${yr}: ${esc(full(c))}, ${c.weight} g</title><path d="${bar(x, top, bw, T + ph)}" fill="var(--c${COLOR[c.b]})"/>`;
    svg += `<text x="${cx}" y="${top - 6}" class="val" text-anchor="middle">${c.weight}</text>`;
    svg += `<text x="${cx}" y="${T + ph + 16}" class="axis" text-anchor="middle">${yr}</text>`;
    svg += `<text x="${cx}" y="${T + ph + 31}" class="cam" text-anchor="middle">${esc(c.name)}</text></g>`;
  });
  svg += '</svg>';
  const chartTable = `<table><thead><tr><th scope="col">Year</th><th scope="col">Lightest new APS-C camera</th><th scope="col">Weight</th></tr></thead><tbody>${years.map(({ y: yr, c }) => `<tr><td>${yr}</td><td>${esc(full(c))}</td><td>${c.weight} g</td></tr>`).join('')}</tbody></table>`;
  const rows = current.map((c, i) => `<tr><td>${i + 1}</td><th scope="row"><a href="${LINK[`${c.b}:${c.id}`]}">${esc(full(c))}</a></th><td>${c.weight} g</td><td>${c.width} × ${c.height} × ${c.depth} mm</td><td>${c.year}</td><td>${usd(c.prices.USD)}</td></tr>`).join('');

  const lightestEver = all[0];
  const lightestWindow = years.map(v => v.c).sort((a, b) => a.weight - b.weight)[0];
  const [first, second] = current;
  const r100 = cam('canon', 'eos-r100'), r50 = cam('canon', 'eos-r50'), xm5 = cam('fujifilm', 'x-m5'), xs20 = cam('fujifilm', 'x-s20');
  const streak = (() => { let best = 0, run = 0, prev; years.forEach(({ c }) => { run = c.b === 'fujifilm' ? run + 1 : 0; best = Math.max(best, run); }); return best; })();

  claim('X-M5 is the lightest current APS-C camera', first.id === 'x-m5');
  claim('EOS R100 is second, 1 g behind', second.id === 'eos-r100' && second.weight - first.weight === 1);
  claim('Fujifilm led 6 of 10 years', wins.fujifilm === 6);
  claim('Five Fujifilm years in a row, 2016 to 2020', streak === 5 && years.slice(0, 5).every(v => v.c.b === 'fujifilm'));
  claim('Sony 2021 ZV-E10, Nikon 2022 Z30, Canon 2023 R100 and 2025 R50 V, Fujifilm 2024 X-M5',
    years[5].c.id === 'zv-e10' && years[6].c.id === 'z30' && years[7].c.id === 'eos-r100' && years[9].c.id === 'eos-r50v' && years[8].c.id === 'x-m5');
  claim('Canon winners both under $800', [years[7].c, years[9].c].every(c => c.prices.USD < 800));
  claim('X-S20 is far heavier than the list and has IBIS', xs20.weight > current[5].weight + 50 && xs20.ibis);
  claim('No APS-C launches in 2026 in the data', !all.some(c => c.year === 2026));

  const body = `
<h1>The lightest APS-C cameras, ranked</h1>
<p class="dek">Ten years of camera launches, one remarkably stubborn number.</p>

<p class="answer">The lightest APS-C camera you can buy new is the <strong>${esc(full(first))}</strong>, at <strong>${first.weight} g</strong> with battery and card. The ${esc(full(second))} is ${second.weight - first.weight} g behind. That's a paperclip.</p>

<h2>The lightest APS-C cameras on sale now</h2>
<p>Here are the six lightest you can still buy new. Tap a name to see how it stacks up against its closest rival.</p>
<div class="wrap"><table>
<thead><tr><th scope="col">#</th><th scope="col">Camera</th><th scope="col">Weight</th><th scope="col">Size (W × H × D)</th><th scope="col">Launched</th><th scope="col">Price (USD)</th></tr></thead>
<tbody>${rows}</tbody>
</table></div>
<p>All six weigh within ${current[5].weight - first.weight} g of each other. If one feels lighter in your hand, it's the lens.</p>

<h2>Have APS-C cameras got lighter in 10 years?</h2>
<p>Not really. Here's the lightest new APS-C camera from each year since 2016, colored by brand.</p>
<figure>
${legendHTML([['Fujifilm', 0], ['Canon', 1], ['Sony', 2], ['Nikon', 3]])}
${svg}
<figcaption>Lightest new APS-C camera launched each year, weight with battery and card. Bars start at zero.</figcaption>
<details><summary>Show as a table</summary>${chartTable}</details>
</figure>
<p>Every winner lands between ${minW} and ${maxW} g. That's roughly a full can of soda, every single year.</p>
<p>The lightest of the decade is the ${esc(full(lightestWindow))} from ${lightestWindow.year}, at ${lightestWindow.weight} g. Nothing since has beaten it.</p>
<p>And the ${esc(full(lightestEver))} from ${lightestEver.year} weighed just ${lightestEver.weight} g. Progress, it turns out, went into autofocus and video, not the scales.</p>

<h2>Which brand makes the lightest APS-C cameras?</h2>
<p><strong>Fujifilm</strong>, mostly. It had the lightest launch in ${wins.fujifilm} of the last 10 years, including five in a row from 2016 to 2020.</p>
<p>Then the others noticed. Sony took 2021 with the ZV-E10, Nikon took 2022 with the Z30, and Canon took 2023 and 2025 with the EOS R100 and EOS R50 V.</p>
<p>Fujifilm grabbed the title back in 2024 with the X-M5. Canon is the one to watch: two wins in three years, both on cameras under $800.</p>
<p>Full disclosure: I shoot with a Fujifilm X-S20, and I really enjoy it. At ${xs20.weight} g it's nowhere near this list. A proper grip and in-body stabilization weigh something.</p>

<h2>Light isn't the same as small</h2>
<p>The X-M5 and EOS R100 weigh almost exactly the same. But the R100 is ${(r100.depth / xm5.depth).toFixed(1)}× as deep, thanks to its chunky grip.</p>
<p>If it has to slip into a jacket pocket, check the size, not just the weight. Here's the <a href="/size/fujifilm-x-m5-vs-canon-eos-r50">X-M5 vs EOS R50 size comparison</a>, drawn to scale. Or browse <a href="/size/">every camera drawn to scale</a>.</p>

<h2>Compare the lightweights</h2>
<ul class="links">
<li><a href="/vs/sony-zv-e10-ii-vs-fujifilm-x-m5">Fujifilm X-M5 vs Sony ZV-E10 II</a>, and the <a href="/size/sony-zv-e10-ii-vs-fujifilm-x-m5">X-M5 vs ZV-E10 II size comparison</a></li>
<li><a href="/vs/fujifilm-x-m5-vs-canon-eos-r50">Fujifilm X-M5 vs Canon EOS R50</a></li>
<li><a href="/canon/vs/eos-r50-vs-eos-r100">Canon EOS R50 vs EOS R100</a></li>
<li><a href="/canon/vs/eos-r50v-vs-eos-r50">Canon EOS R50 V vs EOS R50</a></li>
<li><a href="/fujifilm/vs/x-t30iii-vs-x-t30ii">Fujifilm X-T30 III vs X-T30 II</a></li>
<li><a href="/compare/#cameras=fujifilm:x-m5,canon:eos-r100,canon:eos-r50v,canon:eos-r50">The four lightest, side by side</a></li>
<li>Next up: <a href="/articles/lightest-zoom-lenses">the lightest zoom lenses for every mount</a></li>
</ul>

<h2>How we weighed them</h2>
<p>Weights are each maker's published figure with battery and memory card. We count every APS-C mirrorless camera in our database from Canon, Fujifilm, Leica, Nikon, Sigma and Sony, ${all.length} in all.</p>
<p>Canon's retired EOS M cameras aren't in the database, so they aren't in the chart. No new APS-C cameras have launched in 2026 so far.</p>`;
  return page({
    slug: 'lightest-aps-c-cameras',
    title: 'Lightest APS-C Cameras in 2026, Ranked by Weight',
    description: `The lightest APS-C cameras you can buy, weighed with battery and card. The ${full(first)} leads at ${first.weight} g, plus 10 years of the lightest launches.`,
    headline: 'The lightest APS-C cameras, ranked',
    body,
  });
}

// ══ Article 2: lightest zoom lenses ═══════════════════════════════
function zoomArticle() {
  const MAKER_BRAND = { Panasonic: 'panasonic', 'OM System': 'olympus', Sony: 'sony', Fujifilm: 'fujifilm', Canon: 'canon', Nikon: 'nikon', Leica: 'leica', Sigma: 'sigma' };
  const MOUNT = { rf: 'Canon RF', x: 'Fujifilm X', g: 'Fujifilm GFX', l: 'L-Mount', z: 'Nikon Z', mft: 'Micro Four Thirds', e: 'Sony E', m: 'Leica M' };
  const MOUNT_PAGE = { rf: 'rf-mount', x: 'x-mount', g: 'g-mount', l: 'l-mount', z: 'z-mount', mft: 'micro-four-thirds-mount', e: 'e-mount', m: 'm-mount' };
  const crop = l => parseFloat(String(l.focalLengthEquiv)) / (l.focalLengthMin || l.focalLength);
  const format = l => (l.mount === 'mft' ? 'MFT' : l.mount === 'g' ? 'Medium format' : crop(l) < 1.2 ? 'Full-frame' : 'APS-C');
  const FMT_COLOR = { 'APS-C': 0, 'Full-frame': 1, MFT: 2, 'Medium format': 3 };

  // One entry per lens per mount (a design sold on several brand files of one
  // mount is folded), preferring the maker's own brand file for links.
  const byKey = new Map();
  for (const b of Object.keys(DATA)) {
    for (const [id, l] of Object.entries(DATA[b].LENSES)) {
      if (l.type !== 'Zoom' || l.discontinued || l.preRelease) continue;
      const key = `${l.manufacturer}|${l.name}|${l.mount}`;
      const entry = { b, id, ...l, fmt: format(l) };
      const prev = byKey.get(key);
      if (!prev || (MAKER_BRAND[l.manufacturer] === b && MAKER_BRAND[prev.manufacturer] !== prev.b)) byKey.set(key, entry);
    }
  }
  const zooms = [...byKey.values()].sort((a, b) => a.weight - b.weight || a.name.localeCompare(b.name));
  const short = l => l.name.replace(/^(OM System|Sigma|Tamron|Laowa|Samyang|Viltrox)\s+/, '');
  const full = l => (l.name.startsWith(l.manufacturer) ? l.name : `${l.manufacturer} ${l.name}`);
  // Brand-page deep link: this lens next to the next-lightest zoom of its mount in the same file.
  const deepLink = l => {
    const mate = zooms.find(z => z !== l && z.b === l.b && z.mount === l.mount);
    return `/${l.b}/#lenses=${l.id}${mate ? ',' + mate.id : ''}`;
  };

  const tableMounts = ['mft', 'e', 'x', 'rf', 'z', 'l', 'g'];
  const perMount = tableMounts.map(m => zooms.find(z => z.mount === m)).sort((a, b) => a.weight - b.weight);
  const ff = zooms.filter(z => z.fmt === 'Full-frame' && z.mount !== 'm');
  const ffPerMount = ['l', 'e', 'z', 'rf'].map(m => ff.find(z => z.mount === m)).sort((a, b) => a.weight - b.weight);
  const groups = new Map();
  for (const z of zooms) { if (z.mount === 'm') continue; const k = `${z.mount}|${z.fmt}`; if (!groups.has(k)) groups.set(k, z); }
  const chartRows = [...groups.values()].sort((a, b) => a.weight - b.weight);
  const top5 = zooms.slice(0, 5);
  const powerZooms = top5.filter(z => /\b(PZ|EZ)\b/.test(z.name));
  const f28 = zooms.filter(z => z.maxAperture === 2.8 && /f\/?2\.8(?![\d.]*-)/i.test(z.name) && z.fmt !== 'Medium format')[0];
  const lightest = zooms[0], lightestFF = ffPerMount[0];
  const apscWinners = perMount.filter(z => z.fmt === 'APS-C');
  const heaviestApscWinner = apscWinners[apscWinners.length - 1];
  const xs20 = DATA.fujifilm.CAMERAS['x-s20'], xMount = zooms.find(z => z.mount === 'x');
  const mZooms = zooms.filter(z => z.mount === 'm');

  claim('Lightest zoom is the Panasonic 12-32mm, under half a ~170 g phone', lightest.id === 'lumix-g-12-32mm-f3-5-5-6' && lightest.weight < 85);
  claim('Lightest full-frame zoom is the LUMIX S 18-40mm', lightestFF.id === 'lumix-s-18-40mm-f4-5-6-3');
  claim('Three of the five lightest zooms are power zooms', powerZooms.length === 3);
  claim('Every per-mount winner starts at f/3.5 or slower', perMount.every(z => z.maxAperture >= 3.5));
  claim('Every per-mount winner is a variable-aperture zoom', perMount.every(z => /\d-\d/.test(z.name.replace(/^.*?(f\/|F)/, ''))));
  claim('Sony, Nikon and Canon full-frame winners all under 250 g and stop at 50-60mm', ffPerMount.filter(z => z.mount !== 'l').every(z => z.weight < 250 && z.focalLengthMax >= 50 && z.focalLengthMax <= 60));
  claim('Lightest full-frame zooms stop at 40-60mm', ffPerMount.every(z => z.focalLengthMax >= 40 && z.focalLengthMax <= 60));
  claim('Lightest full-frame zoom is 20 g heavier than the heaviest APS-C winner', lightestFF.weight - heaviestApscWinner.weight === 20);
  claim('Lightest X-mount zoom is the XC 13-33mm', xMount.id === 'xc-13-33mm-f35-63');
  claim('Leica M has exactly one zoom (a manual Laowa)', mZooms.length === 1 && mZooms[0].manufacturer === 'Laowa');
  claim('Lightest constant f/2.8 zoom is more than 3x the lightest zoom', f28 && f28.weight > 3 * lightest.weight);

  // Horizontal bar chart: lightest zoom per mount and sensor format.
  const W = 720, rowH = 30, T = 8, LBL = 196, R = 56, MAX = 400;
  const H = T + chartRows.length * rowH + 28;
  const x = v => (v / MAX) * (W - LBL - R);
  const label = z => (['mft', 'x', 'g'].includes(z.mount) ? MOUNT[z.mount] : `${MOUNT[z.mount]} (${z.fmt === 'APS-C' ? 'APS-C' : 'full-frame'})`);
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="c2t c2d" class="chart">
<title id="c2t">Lightest zoom lens for each mount and sensor size</title>
<desc id="c2d">Horizontal bar chart. The lightest zoom is ${lightest.weight} grams on Micro Four Thirds; the lightest full-frame zoom is ${lightestFF.weight} grams; the lightest medium-format zoom is ${chartRows[chartRows.length - 1].weight} grams.</desc>`;
  for (const g of [0, 100, 200, 300, 400]) svg += `<line x1="${LBL + x(g)}" x2="${LBL + x(g)}" y1="${T}" y2="${T + chartRows.length * rowH}" class="grid"/><text x="${LBL + x(g)}" y="${T + chartRows.length * rowH + 18}" class="axis" text-anchor="middle">${g}${g === 400 ? ' g' : ''}</text>`;
  chartRows.forEach((z, i) => {
    const y = T + i * rowH + 6, bh = rowH - 12;
    svg += `<g class="bar"><title>${esc(label(z))}: ${esc(full(z))}, ${z.weight} g</title>`;
    svg += `<text x="${LBL - 10}" y="${y + bh / 2 + 4}" class="axis" text-anchor="end">${esc(label(z))}</text>`;
    svg += `<path d="${hbar(LBL, y, x(z.weight), bh)}" fill="var(--c${FMT_COLOR[z.fmt]})"/>`;
    svg += `<text x="${LBL + x(z.weight) + 6}" y="${y + bh / 2 + 4}" class="val">${z.weight} g</text></g>`;
  });
  svg += '</svg>';
  const chartTable = `<table><thead><tr><th scope="col">Mount</th><th scope="col">Lightest zoom</th><th scope="col">Weight</th></tr></thead><tbody>${chartRows.map(z => `<tr><td>${esc(label(z))}</td><td>${esc(full(z))}</td><td>${z.weight} g</td></tr>`).join('')}</tbody></table>`;
  const usedFormats = Object.keys(FMT_COLOR).filter(f => chartRows.some(z => z.fmt === f));

  const row = z => `<tr><td>${esc(MOUNT[z.mount])}</td><th scope="row"><a href="${deepLink(z)}">${esc(full(z))}</a></th><td>${z.weight} g</td><td>${z.length} mm</td><td>${esc(z.focalLengthEquiv.replace('–', '-'))}</td><td>${usd(z.prices.USD)}</td></tr>`;
  const head = '<thead><tr><th scope="col">Mount</th><th scope="col">Lens</th><th scope="col">Weight</th><th scope="col">Length</th><th scope="col">Range (full-frame equiv.)</th><th scope="col">Price (USD)</th></tr></thead>';
  const kitLink = `/kit/#kit=fujifilm:x-s20,fujifilm:${xMount.id}`;

  const body = `
<h1>The lightest zoom lenses, ranked by mount</h1>
<p class="dek">A zoom you forget is in the bag. Here's who makes one.</p>

<p class="answer">The lightest zoom lens you can buy new is the <strong>${esc(full(lightest))}</strong>, at <strong>${lightest.weight} g</strong>. That's less than half the weight of most phones. For full-frame, the lightest is the <strong>${esc(full(lightestFF))}</strong>, at <strong>${lightestFF.weight} g</strong>.</p>

<h2>The lightest zoom for every mount</h2>
<p>One winner per mount, current lenses only. Tap a name to put it next to that mount's runner-up.</p>
<div class="wrap"><table>${head}<tbody>${perMount.map(row).join('')}</tbody></table></div>
<p>Of the five lightest zooms on sale, three are power zooms, with PZ or EZ in the name. A motor does the zooming, so the barrel can tuck away when the camera's off.</p>

<h2>Does sensor size decide how heavy a zoom is?</h2>
<p>Mostly, yes. Here's the lightest zoom for each mount, split by sensor size where a mount takes two.</p>
<figure>
${legendHTML(usedFormats.map(f => [f, FMT_COLOR[f]]))}
${svg}
<figcaption>Lightest current zoom lens for each mount and sensor size, maker's published weight. Bars start at zero.</figcaption>
<details><summary>Show as a table</summary>${chartTable}</details>
</figure>
<p>Smaller sensor, smaller glass. Micro Four Thirds wins at ${lightest.weight} g, while Fujifilm's medium-format ${esc(chartRows[chartRows.length - 1].name.replace(/mm *F[\d.].*$/, 'mm'))} needs ${chartRows[chartRows.length - 1].weight} g.</p>
<p>But full-frame is closer than you'd think. Panasonic's LUMIX S 18-40mm is only ${lightestFF.weight - heaviestApscWinner.weight} g heavier than Nikon's DX 16-50mm, a lens made for a smaller sensor.</p>

<h2>The lightest full-frame zooms</h2>
<p>If you shoot full-frame, these are the featherweights. One per mount.</p>
<div class="wrap"><table>${head}<tbody>${ffPerMount.map(row).join('')}</tbody></table></div>
<p>Sony, Nikon and Canon each make one under 250 g. Every one of them is a short zoom that stops at 50 or 60mm.</p>

<h2>What do you give up for a light zoom?</h2>
<p>Speed, mostly. Every lens in the first table starts at f/3.5 or slower, and gets darker as you zoom in.</p>
<p>And reach. The lightest full-frame zooms stop at 40 to 60mm, so think of them as a standard prime that can stretch a little.</p>
<p>Want f/2.8 all the way through? The lightest we list is the ${esc(full(f28))} for ${esc(MOUNT[f28.mount])}, at ${f28.weight} g. That's more than three times the 12-32mm.</p>

<h2>What I'd put on my X-S20</h2>
<p>Full disclosure: I shoot with a Fujifilm X-S20, and I really enjoy it. The lightest zoom it takes is Fujifilm's new ${esc(short(xMount))}, at ${xMount.weight} g.</p>
<p>That brings the whole kit to ${xs20.weight + xMount.weight} g. <a href="${kitLink}">Weigh it in the kit builder</a>, then swap in your own lenses.</p>

<h2>Browse every lens by mount</h2>
<ul class="links">
<li><a href="/mount/micro-four-thirds-mount">Every Micro Four Thirds lens</a></li>
<li><a href="/mount/e-mount">Every Sony E-mount lens</a></li>
<li><a href="/mount/x-mount">Every Fujifilm X-mount lens</a></li>
<li><a href="/mount/rf-mount">Every Canon RF-mount lens</a></li>
<li><a href="/mount/z-mount">Every Nikon Z-mount lens</a></li>
<li><a href="/mount/l-mount">Every L-Mount lens</a></li>
<li>Pair one with a light body: <a href="/articles/lightest-aps-c-cameras">the lightest APS-C cameras, ranked</a></li>
</ul>

<h2>How we weighed them</h2>
<p>Weights are each maker's published figure for the lens. We count every zoom on sale in our database, ${zooms.length} in all across ${new Set(zooms.map(z => z.mount)).size} mounts, from first-party and third-party makers. A lens made for two mounts counts once for each.</p>
<p>Discontinued lenses and lenses that are announced but not on sale yet are left out. Leica M has one zoom in our list, a manual Laowa, so it sits this one out.</p>`;
  return page({
    slug: 'lightest-zoom-lenses',
    title: 'Lightest Zoom Lenses in 2026, Ranked by Mount',
    description: `The lightest zoom lens you can buy is Panasonic's 12-32mm, at just ${lightest.weight} g. Here's the lightest zoom for every mount, full-frame included, ranked.`,
    headline: 'The lightest zoom lenses, ranked by mount',
    body,
  });
}

// ── link check ─────────────────────────────────────────────────────
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const indexable = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(SITE, '')));
const ARTICLES = ['lightest-aps-c-cameras', 'lightest-zoom-lenses'];
function fileFor(p) {
  const rel = p.replace(/^\//, '');
  return rel === '' || rel.endsWith('/') ? path.join(ROOT, rel, 'index.html') : path.join(ROOT, rel + '.html');
}
function checkLinks(slug, html) {
  const problems = [];
  const hrefs = [...html.matchAll(/<a href="([^"]+)"/g)].map(m => m[1]);
  for (const href of hrefs) {
    const [p, hash] = href.split('#');
    if (p.startsWith('/articles/')) { if (!ARTICLES.includes(p.slice(10))) problems.push(`${href}: unknown article`); continue; }
    if (!fs.existsSync(fileFor(p))) problems.push(`${href}: no such page`);
    if (!indexable.has(p)) problems.push(`${href}: not in sitemap (noindexed)`);
    if (hash) {
      const m = /^(cameras|lenses|kit)=(.*)$/.exec(hash);
      if (!m) { problems.push(`${href}: unknown hash`); continue; }
      const brandPage = /^\/([a-z]+)\/$/.exec(p);
      for (const id of m[2].split(/[,;]/)) {
        let [b, slug2] = id.includes(':') ? id.split(':') : [brandPage && brandPage[1], id];
        const pool = m[1] === 'lenses' ? DATA[b] && DATA[b].LENSES : DATA[b] && { ...DATA[b].CAMERAS, ...DATA[b].LENSES };
        if (!pool || !pool[slug2]) problems.push(`${href}: '${id}' does not resolve`);
      }
    }
  }
  return { count: hrefs.length, problems };
}

let failed = false;
for (const [slug, build] of [['lightest-aps-c-cameras', apscArticle], ['lightest-zoom-lenses', zoomArticle]]) {
  const html = build();
  fs.writeFileSync(path.join(OUT, slug + '.html'), html);
  const { count, problems } = checkLinks(slug, html);
  console.log(`${slug}: ${count} links, ${problems.length} problems`);
  problems.forEach(p => console.log('  ✗ ' + p));
  if (problems.length) failed = true;
}
for (const [text, ok] of checks) { console.log(`${ok ? '✓' : '✗'} ${text}`); if (!ok) failed = true; }
process.exit(failed ? 1 : 0);
