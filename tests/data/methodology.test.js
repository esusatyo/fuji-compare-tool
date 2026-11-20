// methodology.html is the public restatement of docs/data-methodology.md.
// The doc's decision log is append-only; every row must reach the public
// "Rule changes" log too, or the page quietly stops being true.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

test('the public rule-change log has one row per decision in docs/data-methodology.md', () => {
  const doc = read('docs/data-methodology.md');
  const logSection = doc.slice(doc.indexOf('## 6. Decision log'));
  const docRows = logSection.split('\n').filter(l => /^\| \d{4}-\d{2}-\d{2} \|/.test(l)).length;
  const page = read('methodology.html');
  const table = page.slice(page.indexOf('<table class="log">'), page.indexOf('</table>', page.indexOf('<table class="log">')));
  const pageRows = (table.match(/<tr><td>/g) || []).length;
  assert.ok(docRows > 0, 'found no rows in the doc decision log');
  assert.equal(pageRows, docRows,
    `methodology.html "Rule changes" has ${pageRows} rows, docs/data-methodology.md decision log has ${docRows}: add the missing change to the public page in plain words`);
});
