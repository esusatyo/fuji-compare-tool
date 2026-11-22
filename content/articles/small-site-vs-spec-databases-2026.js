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
  // the manufacturers in most spot-checks; three of its ten TTArtisan Canon RF
  // listings were lenses TTArtisan's own Mount row says aren't sold for RF.
  rfListed: 10, rfPhantoms: 3,
  // OM System's stabilization figure for the OM-5 Mark II with a Sync IS lens;
  // we store the body-only figure (owner decision 2026-11-18).
  om5iiSync: 7.5,
};
const OM5II_SOURCE = 'https://explore.omsystem.com/us/en/om-5-mark-ii';
const ISSUES = 'https://github.com/esusatyo/fuji-compare-tool/issues';

// A "manufacturer source" is a T1 citation: the manufacturer's own page, PDF, manual or
// press release (docs/data-methodology.md, section 1).
const maker = x => (x.specSources || []).some(src => src.tier === 'T1');
const t1Url = x => ((x.specSources || []).find(src => src.tier === 'T1') || {}).url || null;
const pct = (a, b) => Math.round((a / b) * 100);

module.exports = {
  slug: 'small-site-vs-spec-databases-2026',
  title: 'Small Site vs Big Spec Databases: Who Gets It Right?',
  headline: 'Why a small site can get camera specs more right than a big database',
  dek: "We can't out-list them. We can out-check them.",
  published: '2026-11-22',
  query: {
    text: 'are camera spec websites accurate / camera spec database errors',
    evidence: 'Owner decision 2026-11-21: published for reader trust alongside /methodology, not for search volume.',
  },

  snapshot(brandData) {
    // One entry per camera, and per lens per mount: a lens sold for one mount
    // appears in several brand files (e.g. Sigma L-Mount in Sigma, Panasonic
    // and Leica), so fold by mount + manufacturer + name.
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
    // Companies, not web addresses: one manufacturer has several regional sites.
    const companies = new Set();
    const company = name => (name === 'OM System' ? 'Olympus' : name);
    for (const data of Object.values(brandData)) {
      for (const c of Object.values(data.CAMERAS)) if (maker(c)) companies.add(company(data.BRAND_CONFIG.name));
      for (const l of Object.values(data.LENSES)) if (maker(l)) companies.add(company(l.manufacturer));
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
      manufacturers: companies.size,
      sharedLenses: lensList.filter(e => e.files > 1).length,
      rules,
      uncitedAllDiscontinued: brands.every(b => b.uncitedDiscontinued),
      uncitedNewest: Math.max(...withGaps.map(b => b.uncitedNewest)),
      x100vi: { evf: x100vi.batteryLifeEvf, ovf: x100vi.batteryLifeOvf, source: t1Url(x100vi) },
      om5ii: { ibis: om5ii.ibisStops, source: OM5II_SOURCE, cited: maker(om5ii) },
    };
  },

  description(s) {
    return `${pct(s.itemsCited, s.items)}% of our ${s.items.toLocaleString('en-US')} cameras and lenses cite a manufacturer document. Why a small site can out-check big spec databases, and where it still can't.`;
  },

  claims(s) {
    return [
      ['More than nine in ten of our cameras and lenses cite the manufacturer', s.itemsCited / s.items > 0.9],
      ['Our citations cover about 20 manufacturers', s.manufacturers >= 18 && s.manufacturers <= 22],
      ['More than 200 lenses appear in more than one brand file', s.sharedLenses > 200],
      ['Every camera without a manufacturer source is discontinued', s.uncitedAllDiscontinued],
      ['The X100VI gets more shots through the optical finder than the electronic one', s.x100vi.ovf > s.x100vi.evf],
      ['We store the OM-5 II body-only stabilization, lower than the Sync IS figure', s.om5ii.ibis < FOUND.om5iiSync && s.om5ii.cited],
      ['Some brands have every camera traced to the manufacturer, some do not', s.brands.some(b => b.cited === b.cameras) && s.brands.some(b => b.cited < b.cameras)],
      ['The rule-change log has entries', s.rules > 0],
      ['Every source we link is an https manufacturer page', [s.x100vi.source, s.om5ii.source].every(u => /^https:/.test(u || ''))],
    ];
  },

  render(s, k) {
    const n = x => x.toLocaleString('en-US');
    const full = s.brands.filter(b => b.cited === b.cameras).map(b => b.name);
    const list = a => a.length > 1 ? `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}` : a[0];
    return `
<p class="guide-answer">A big spec database lists more cameras than anyone can easily check by hand. We list fewer, and <strong>${pct(s.itemsCited, s.items)}%</strong> of our ${n(s.items)} cameras and lenses cite a manufacturer document: a spec page, manual or press release. Being small makes that kind of checking possible.</p>

<p>That's not a dig at the big sites. It's a trade-off: they win on coverage, we try to win on checking. And because a careful site can still be wrong, we publish ${k.a('methodology', 'the rules we check by')}.</p>

<h2>Why big spec databases drift</h2>
<p>The problem is likely size, not care. Three things can go wrong at scale.</p>
<p><strong>Copies of copies.</strong> Stores often list specs from the same distributor feed, and a database that fills its gaps from stores or other databases inherits their mistakes. One typo can end up on many pages that all "agree".</p>
<p><strong>One entry for many mounts.</strong> A lens sold for five mounts can be five products, with different weights and lengths. When we tested one lens database this year, its spec tables mostly matched where we spot-checked, yet ${FOUND.rfPhantoms} of its ${FOUND.rfListed} Canon RF listings for one manufacturer were lenses that manufacturer doesn't sell for RF.</p>
<p><strong>Mixed rules.</strong> Manufacturers quote the same thing in different ways, and a database with one "battery life" box has to pick. Fujifilm ${k.src(s.x100vi.source, 'rates the X100VI')} at ${s.x100vi.evf} shots with the electronic viewfinder and ${s.x100vi.ovf} with the optical one. OM System ${k.src(s.om5ii.source, 'rates the OM-5 Mark II')} at ${s.om5ii.ibis} stops of stabilization on its own and ${FOUND.om5iiSync} with a matching lens. Neither number is wrong. Comparing one camera's best case with another's normal case is.</p>

<h2>What a small site can do instead</h2>
<p>We can't out-list the big databases, so we try to out-check them.</p>
${k.table(['What we do', 'What it stops'], [
  ['Start from the manufacturer\'s own figures', 'Copied mistakes'],
  [`Store each mount on its own (${k.a('mount/l-mount', 'L-Mount lenses')} aren't Sony E lenses)`, 'One mount\'s figures on another'],
  ['Use one rule per spec for every brand', 'Battery and stabilization figures that don\'t compare'],
  ['Link the source on every item we\'ve checked', 'Numbers you have to take on trust'],
  ['Record the numbers we rejected, not just the ones we kept', 'The next check "fixing" a right number'],
  [`Let tests fail on drift: ${n(s.sharedLenses)} lenses sit in more than one of our brand files, and every copy must agree`, 'Two pages disagreeing about one lens'],
  [`Log rule changes in public (${s.rules} so far)`, 'Rules changing quietly'],
], { rowHeader: 0, wrap: true })}

<h2>How much of our data can you trace to the manufacturer?</h2>
<p>Here's the share of each brand's cameras that cite at least one manufacturer document. Across cameras and lenses, those citations cover ${s.manufacturers} manufacturers.</p>
${k.bars({
  caption: `Cameras citing a manufacturer document, by brand. Lenses: ${pct(s.lensesCited, s.lenses)}% of ${n(s.lenses)}.`,
  unit: '%',
  max: 100,
  bars: s.brands.map(b => ({ label: b.name, sub: `${b.cited} of ${b.cameras} cameras`, value: pct(b.cited, b.cameras), series: 1 })),
  table: {
    head: ['Brand', 'Cameras', 'With a manufacturer source', 'Share'],
    rows: s.brands.map(b => [b.name, b.cameras, b.cited, `${pct(b.cited, b.cameras)}%`]),
  },
})}
<p>Every ${list(full)} camera cites one. Every camera that doesn't is discontinued, the newest from ${s.uncitedNewest}. Old models are the hardest to find documents for, which is exactly where a secondhand number is most tempting.</p>

<h2>Where we're still weaker</h2>
<p><strong>We don't weigh anything.</strong> We have no lab, so when a manufacturer is wrong, we're wrong with it. Manufacturers' own pages sometimes copy a figure from one product to another.</p>
<p><strong>Old cameras are hard.</strong> When a manufacturer deletes a page, we're left with manuals and archives, and some of those never made it online.</p>
<p><strong>We don't yet meet all our own rules.</strong> ${n(s.items - s.itemsCited)} of our cameras and lenses cite no manufacturer document. Some older entries still rely on retailers, Wikipedia, spec databases or estimates, and some regional prices are worked out from the US price.</p>
<p><strong>We've made our own mistakes.</strong> ${k.a('articles/camera-specs-we-got-wrong-2026', 'We wrote up the specs we got wrong')}, from a Canon flagship listed far too heavy to cameras missing their viewfinders.</p>
<p><strong>Coverage.</strong> A big database will probably have the camera you're looking for. We might not: we cover mirrorless and fixed-lens cameras from ${s.brands.length} brands and their lenses.</p>

<h2>Why we publish the rules</h2>
<p>Checking is only half of it. If you can't see how a number was chosen, you can't tell a careful site from a confident one.</p>
<p>So ${k.a('methodology', 'our methodology')} lists which sources we trust, which number we store when manufacturers disagree, and the rule changes we could trace, with dates. A figure that breaks one of those rules is a bug, and you can ${k.src(ISSUES, 'report it on GitHub')}.</p>

<h2>Keep reading</h2>
<ul>
  <li>${k.a('methodology', 'How we check camera and lens specs')}</li>
  <li>${k.a('articles/camera-specs-we-got-wrong-2026', 'The camera specs we got wrong (and why it happens)')}</li>
  <li>${k.a('mount/', 'Every lens, by mount')}</li>
  <li>${k.a('compare/', 'Compare any two cameras')}</li>
</ul>

<h2>How we counted</h2>
<p>Counts are from our data on the publish date, including discontinued models. A lens sold for one mount appears in several of our brand files (a Sigma L-Mount lens sits under Sigma, Panasonic and Leica), so it counts once per mount. A manufacturer document is its spec page, spec sheet, manual or press release, including archived or mirrored copies; reviews and stores don't count. Citing one doesn't mean every figure on that item came from it.</p>
`;
  },
};
