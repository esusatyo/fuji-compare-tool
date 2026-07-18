## Context

`scripts/generate-seo.js` already emits 143 curated vs-pages with crawlable spec tables, `Product` JSON-LD, canonicals, and a deep link into the tool. The content is good. Nothing links to it — verified: zero `<a>` anchors anywhere on the site point at a `vs/` path; the 143 grep "hits" are each page's own canonical URL. Discovery is sitemap-only.

Three facts constrain the design:

1. **`engine.js:399` does `document.body.innerHTML = …`** — it destroys the whole body on render. No static content can survive inside a brand page today.
2. **`buildAll()` in `generate-seo.js` is pure** — it returns a `path → content` Map, and `tests/data/seo.test.js` rebuilds it in memory and fails on any diff from committed files. Anything generated is automatically protected from going stale, and anything hand-written is not.
3. **`withHeadBlock()` refuses to write** a file lacking both `seo:begin`/`seo:end` markers. The marker pattern is the established way generated content lives inside a hand-maintained file.

The existing `brand-picker` spec requires the root redirect to fire "with no user interaction" when no preference is stored. That requirement is what makes the root URL unrankable, and this change supersedes it.

## Goals / Non-Goals

**Goals:**
- No generated page is orphaned — every vs-page reachable by crawlable `<a>` links from at least one other page.
- The root URL is a real indexable page that can rank for head terms.
- Brand pages carry crawlable content and internal links.
- New generated content inherits the existing anti-staleness guarantee.
- Returning visitors keep the one-jump-to-my-brand behaviour they have today.

**Non-Goals:**
- Cross-brand comparison pages. Deferred by explicit decision; the one-brand-per-page invariant stands.
- Server-side rendering the full interactive tool. The static block is a crawlable summary plus links, not a duplicate of the table.
- Performance work. RUM shows ~1,011ms processing but load is 1,323ms with a 3ms response; it is not the bottleneck.
- Changing the curated pairing rules or which vs-pages exist.

## Decisions

### 1. Render target: `#app` with a `document.body` fallback

`engine.js` renders into `document.getElementById('app') || document.body`.

*Why the fallback:* it keeps every existing consumer working — notably `tests/helpers/load-brand.js:63`, which boots JSDOM with a bare `<body></body>`. Without a fallback that harness breaks instantly and loudly for reasons unrelated to what each test asserts. The harness gains `<div id="app"></div>` anyway (Task 2.2), but the fallback means the engine never hard-depends on page structure it doesn't own.

*Alternative rejected:* throwing when `#app` is absent. More "correct", but converts a missing div into a blank page for users, and the fallback costs one `||`.

*Note:* `document.querySelectorAll('.section-header')` and friends (engine.js:637–741) are document-scoped and keep working, since `#app` is inside `body`.

### 2. Static block goes *after* `#app`, not before

The generated block renders below the interactive tool, presented as a "Popular comparisons" / brand-intro section.

*Why:* above-the-fold belongs to the tool — that's the product. Below-the-fold links are standard practice, genuinely useful to humans, and equally crawlable; crawlers don't discount links for being low on the page the way they discount, say, hidden content.

### 3. A second marker pair for body blocks

Introduce `<!-- seo:body:begin -->` / `<!-- seo:body:end -->`, and generalize `withHeadBlock(html, block, file)` into `withBlock(html, block, file, begin, end)`, keeping the "markers missing → throw" behaviour for both.

*Why:* reuses the pattern the repo already trusts, and keeps head and body blocks independently replaceable. The existing head markers stay untouched, so this is additive.

### 4. Related comparisons derived from `curatedPairs()`, not a new list

For a vs-page `(a,b)`, related links = other curated pairs sharing camera `a` or `b`, ranked deterministically (shared-camera pairs first, then by newer year, then USD, then slug), capped at 6.

*Why:* `curatedPairs()` is already the single source of truth for which pages exist, so links can never point at a page that wasn't generated — the orphan class of bug is designed out rather than tested for. The cap keeps link equity focused and avoids footer-spam patterns.

### 5. Root page: branch on stored state, never on user-agent

```
const stored = localStorage.getItem('brand');
if (VALID_BRANDS.includes(stored)) location.replace('./' + stored + '/' + (location.hash || ''));
// else: fall through and render the landing page
```

*Why this is not cloaking:* the branch reads client-side stored state. A crawler has no `localStorage`, so it takes the same path a first-time human takes and sees byte-identical content. Cloaking is serving different content *based on detecting the crawler*; this never inspects the user-agent. Search engines have treated preference-based redirects this way for years.

*Consequence accepted:* a returning visitor can no longer reach the landing page by typing the bare domain. Mitigated by the brand switcher already present on every brand page (`brand-picker` spec), which is how users change brands today anyway.

*Keep:* `location.replace` (not `.href`) so the redirect doesn't poison the back button, and hash preservation — both are existing tested behaviour.

### 6. Landing page content is generated, not hand-written

`rootBodyBlock()` emits brand cards (name + live camera/lens counts from each `data.js`) and a curated set of vs-page links.

*Why:* hand-written content drifts from the data and is invisible to `seo.test.js`. Generating it means the counts are always true and the anti-staleness test covers it.

### 7. Orphan prevention becomes a test, not a convention

New Tier 1 test: build the `path → content` map in memory, extract every `<a href>`, resolve relative to each file, and assert every generated page (except the root) is the target of at least one link from another page.

*Why:* this bug shipped once, silently, and cost the entire vs-page investment. A convention won't catch it a second time; a test will. It runs on `buildAll()` output, so it needs no network and no server.

## Risks / Trade-offs

- **Changing `engine.js`'s render target touches all five brands at once** → The `|| document.body` fallback plus Tier 2 tests asserting static content survives; `npm test` (268 tests today) is the gate before commit.
- **`tests/helpers/load-brand.js` boots JSDOM without `#app`** → Known and explicitly handled: the fallback keeps it green even before the harness is updated, so the two changes can't deadlock.
- **Root redirect is shared by every visitor; a bug here strands everyone** → Behaviour is pinned by existing Tier 2 redirect tests, extended with a no-preference case that must render rather than redirect.
- **Regenerating 143 vs-pages produces a large diff** → Mechanical and generator-owned; `seo.test.js` proves output matches the generator, so the diff is verifiable by rerunning rather than by reading.
- **SEO results are not immediate** → Indexing and ranking take weeks. This change makes the site *crawlable*; it does not make it *rank* on a schedule. Search Console is the only way to observe the effect, which is why it precedes the work rather than following it.
- **Returning visitors lose the landing page at the bare domain** → Accepted (Decision 5); the brand switcher covers brand changes.
