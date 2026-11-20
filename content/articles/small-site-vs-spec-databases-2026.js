// Article (dated, frozen): why a small site can check specs more carefully than
// a big spec database, where it is still weaker, and why we publish our rules
// (/methodology). Companion to camera-specs-we-got-wrong-2026. Draft for the
// owner, 2026-11-21.
'use strict';
const fs = require('fs');
const path = require('path');

// Facts from our verification work, not from the data files.
const FOUND = {
  // A large lens database (2026 add-thirdparty-lenses run): spec tables matched
  // the makers, mount lists did not; six lenses listed for Canon RF that their
  // makers don't sell for RF.
  rfPhantoms: 6,
  // OM System's stabilization figure for the OM-5 Mark II with a Sync IS lens;
  // we store the body-only figure (owner decision 2026-11-18).
  om5iiSync: 7.5,
};
const OM5II_SOURCE = 'https://explore.omsystem.com/us/en/om-5-mark-ii';
const ISSUES = 'https://github.com/esusatyo/fuji-compare-tool/issues';

// A "maker source" is a T1 citation: the maker's own page, PDF, manual or
// press release (docs/data-methodology.md, section 1).
const maker = x => (x.specSources || []).some(src => src.tier === 'T1');
const t1Url = x => ((x.specSources || []).find(src => src.tier === 'T1') || {}).url || null;
const pct = (a, b) => Math.round((a / b) * 100);

module.exports = {
  slug: 'small-site-vs-spec-databases-2026',
  title: 'Small Site vs Big Spec Databases: Who Gets It Right?',
  headline: 'Why a small site can get camera specs more right than a big database',
  dek: "We can't out-list them. We can out-check them.",
  published: '2026-11-21',
  query: {
    text: 'are camera spec websites accurate / camera spec database errors',
    evidence: 'Owner decision 2026-11-21: published for reader trust alongside /methodology, not for search volume.',
  },

  snapshot(brandData) {
    // One entry per camera, and per lens per mount: a lens sold for one mount
    // appears in several brand files (e.g. Sigma L-Mount in Sigma, Panasonic
    // and Leica), so fold by mount + maker + name.
    const lenses = new Map();
    const brands = [];
    for (const [b, data] of Object.entries(brandData)) {
      const cams = Object.values(data.CAMERAS);
      const uncited = cams.filter(c => !maker(c));
      brands.push({
        name: data.BRAND_CONFIG.name,
        cameras: cams.length,
        cited: cams.length - uncited.length,
        uncitedDiscontinued: uncited.every(c => c.discontinued),
        uncitedNewest: uncited.length ? Math.max(...uncited.map(c => c.year)) : null,
      });
      for (const l of Object.values(data.LENSES)) {
        const key = `${l.mount}|${l.manufacturer}|${l.name}`;
        const e = lenses.get(key) || { cited: false, files: 0 };
        e.files += 1;
        e.cited = e.cited || maker(l);
        lenses.set(key, e);
      }
    }
    const cameras = brands.reduce((n, b) => n + b.cameras, 0);
    const camerasCited = brands.reduce((n, b) => n + b.cited, 0);
    const lensList = [...lenses.values()];
    const lensesCited = lensList.filter(e => e.cited).length;
    const hosts = new Set();
    for (const data of Object.values(brandData)) {
      for (const x of [...Object.values(data.CAMERAS), ...Object.values(data.LENSES)]) {
        for (const src of x.specSources || []) if (src.tier === 'T1') hosts.add(new URL(src.url).hostname.replace(/^www\./, ''));
      }
    }
    // Rule changes so far: rows in the methodology doc's append-only log.
    const doc = fs.readFileSync(path.join(__dirname, '..', '..', 'docs', 'data-methodology.md'), 'utf8');
    const rules = doc.slice(doc.indexOf('## 6. Decision log')).split('\n').filter(l => /^\| \d{4}-\d{2}-\d{2} \|/.test(l)).length;
    const x100vi = brandData.fujifilm.CAMERAS['x100vi'];
    const om5ii = brandData.olympus.CAMERAS['om-5-ii'];
    const withGaps = brands.filter(b => b.cited < b.cameras);
    return {
      brands: brands.sort((a, b) => (b.cited / b.cameras) - (a.cited / a.cameras) || a.name.localeCompare(b.name)),
      cameras, camerasCited,
      lenses: lensList.length, lensesCited,
      items: cameras + lensList.length, itemsCited: camerasCited + lensesCited,
      makerSites: hosts.size,
      sharedLenses: lensList.filter(e => e.files > 1).length,
      rules,
      uncitedAllDiscontinued: brands.every(b => b.uncitedDiscontinued),
      uncitedNewest: Math.max(...withGaps.map(b => b.uncitedNewest)),
      x100vi: { evf: x100vi.batteryLifeEvf, ovf: x100vi.batteryLifeOvf, source: t1Url(x100vi) },
      om5ii: { ibis: om5ii.ibisStops, source: OM5II_SOURCE, cited: maker(om5ii) },
    };
  },

  description(s) {
    return `${pct(s.itemsCited, s.items)}% of our ${s.items.toLocaleString('en-US')} cameras and lenses link to the maker's own spec page. Why a small site can out-check big spec databases, and where it can't.`;
  },

  claims(s) {
    return [
      ['More than nine in ten of our cameras and lenses cite the maker', s.itemsCited / s.items > 0.9],
      ['Our citations point to more than 40 different maker websites', s.makerSites > 40],
      ['More than 200 lenses appear in more than one brand file', s.sharedLenses > 200],
      ['Every camera without a maker source is discontinued', s.uncitedAllDiscontinued],
      ['The X100VI gets more shots through the optical finder than the electronic one', s.x100vi.ovf > s.x100vi.evf],
      ['We store the OM-5 II body-only stabilization, lower than the Sync IS figure', s.om5ii.ibis < FOUND.om5iiSync && s.om5ii.cited],
      ['Some brands have every camera traced to the maker, some do not', s.brands.some(b => b.cited === b.cameras) && s.brands.some(b => b.cited < b.cameras)],
      ['The rule-change log has entries', s.rules > 0],
      ['Every source we link is an https maker page', [s.x100vi.source, s.om5ii.source].every(u => /^https:/.test(u || ''))],
    ];
  },

  render(s, k) {
    const n = x => x.toLocaleString('en-US');
    const full = s.brands.filter(b => b.cited === b.cameras).map(b => b.name);
    const list = a => a.length > 1 ? `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}` : a[0];
    return `
<p class="guide-answer">A big spec database lists more cameras than anyone can check by hand, so it copies. We list fewer, and <strong>${pct(s.itemsCited, s.items)}%</strong> of our ${n(s.items)} cameras and lenses link straight to the maker's own spec page. Being small is what makes that possible.</p>

<p>That's not a dig at the big sites. It's a trade-off: they win on coverage, we try to win on checking. And because a careful site can still be wrong, we publish ${k.a('methodology', 'the rules we check by')}.</p>

<h2>Why big spec databases drift</h2>
<p>Size is the problem, not care. Three things go wrong at scale.</p>
<p><strong>Copies of copies.</strong> Most stores list specs from the same distributor feed, and databases often fill their gaps from stores and from each other. One typo can end up on a hundred pages that all "agree".</p>
<p><strong>One entry for many mounts.</strong> A lens sold for five mounts is five products, with different weights and lengths. When we checked one large lens database this year, its spec tables matched the makers, yet it listed ${FOUND.rfPhantoms} lenses for Canon RF that their makers don't sell for RF.</p>
<p><strong>Mixed rules.</strong> Makers quote the same thing in different ways, and a database with one "battery life" box has to pick. Fujifilm ${k.src(s.x100vi.source, 'rates the X100VI')} at ${s.x100vi.evf} shots with the electronic viewfinder and ${s.x100vi.ovf} with the optical one. OM System ${k.src(s.om5ii.source, 'rates the OM-5 Mark II')} at ${s.om5ii.ibis} stops of stabilization on its own and ${FOUND.om5iiSync} with a matching lens. Neither number is wrong. Comparing one camera's best case with another's normal case is.</p>

<h2>What a small site can do instead</h2>
<p>We can't out-list the big databases, so we try to out-check them.</p>
${k.table(['What we do', 'What it stops'], [
  ['Read the maker\'s own spec page for every figure', 'Copied mistakes'],
  [`Store each mount on its own (${k.a('mount/l-mount', 'L-Mount lenses')} aren't Sony E lenses)`, 'One mount\'s figures on another'],
  ['Use one rule per spec for every brand', 'Battery and stabilization figures that don\'t compare'],
  ['Link the source on every item we\'ve checked', 'Numbers you have to take on trust'],
  ['Record the numbers we rejected, not just the ones we kept', 'The next check "fixing" a right number'],
  [`Let tests fail on drift: ${n(s.sharedLenses)} lenses sit in more than one of our brand files, and every copy must agree`, 'Two pages disagreeing about one lens'],
  [`Log every rule change in public (${s.rules} so far)`, 'Rules changing quietly'],
], { rowHeader: 0, wrap: true })}

<h2>How much of our data can you trace to the maker?</h2>
<p>Here's the share of each brand's cameras that cite the maker's own spec, across ${s.makerSites} maker websites in all.</p>
${k.bars({
  caption: `Cameras citing the maker's own spec, by brand. Lenses: ${pct(s.lensesCited, s.lenses)}% of ${n(s.lenses)}.`,
  unit: '%',
  max: 100,
  bars: s.brands.map(b => ({ label: b.name, sub: `${b.cited} of ${b.cameras} cameras`, value: pct(b.cited, b.cameras), series: 1 })),
  table: {
    head: ['Brand', 'Cameras', 'With a maker source', 'Share'],
    rows: s.brands.map(b => [b.name, b.cameras, b.cited, `${pct(b.cited, b.cameras)}%`]),
  },
})}
<p>${list(full)} are fully traced. Every camera we can't yet trace is discontinued, the newest from ${s.uncitedNewest}. Their maker pages are gone, which is exactly where a secondhand number is most tempting.</p>

<h2>Where we're still weaker</h2>
<p><strong>We don't weigh anything.</strong> We have no lab, so when a maker is wrong, we're wrong with it. Makers' own pages sometimes copy a figure from one product to another.</p>
<p><strong>Old cameras are hard.</strong> When a maker deletes a page, we're left with manuals and archives, and some of those never made it online.</p>
<p><strong>We've made our own mistakes.</strong> ${k.a('articles/camera-specs-we-got-wrong-2026', 'We wrote up the specs we got wrong')}, from a Canon flagship listed far too heavy to cameras missing their viewfinders.</p>
<p><strong>Coverage.</strong> A big database will have the camera you're looking for. We might not: we cover mirrorless cameras from ${s.brands.length} brands and their lenses.</p>

<h2>Why we publish the rules</h2>
<p>Checking is only half of it. If you can't see how a number was chosen, you can't tell a careful site from a confident one.</p>
<p>So ${k.a('methodology', 'our methodology')} lists which sources we trust, which number we store when makers disagree, and every rule change with its date. A figure that breaks one of those rules is a bug, and you can ${k.src(ISSUES, 'report it on GitHub')}.</p>

<h2>Keep reading</h2>
<ul>
  <li>${k.a('methodology', 'How we check camera and lens specs')}</li>
  <li>${k.a('articles/camera-specs-we-got-wrong-2026', 'The camera specs we got wrong (and why it happens)')}</li>
  <li>${k.a('mount/', 'Every lens, by mount')}</li>
  <li>${k.a('compare/', 'Compare any two cameras')}</li>
</ul>

<h2>How we counted</h2>
<p>Counts are from our data on the publish date, including discontinued models. A lens sold for one mount appears in several of our brand files (a Sigma L-Mount lens sits under Sigma, Panasonic and Leica), so it counts once per mount. A maker source is the maker's own spec page, spec sheet, manual or press release; reviews and stores don't count.</p>
`;
  },
};
