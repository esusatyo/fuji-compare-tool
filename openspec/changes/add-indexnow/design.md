## Context

Deploys are done by Cloudflare Workers Builds on every push to `main` (it reports as the `Workers Builds: fuji-compare-tool` check run on the commit). The repo has no CI of its own. Generated pages are committed, so the HTML files a push changes are exactly the pages whose content changed. The sitemap lists the 57 indexable URLs and has no `<lastmod>`.

## Decisions

**1. Build our own ping, not Crawler Hints.** Crawler Hints is already on and has delivered nothing (Bing's IndexNow report is empty as of 2026-10-24).

**2. Choose URLs from the git diff, filtered by the sitemap.** For a range `A..B`:
- **Changed pages**: every changed `*.html` file is mapped to its clean URL (`index.html` → `/`, `x/index.html` → `/x/`, `x/y.html` → `/x/y`). A changed `<brand>/data.js` also counts as its brand page, because brand pages render their data client-side and a price refresh may not touch the HTML. A changed URL is submitted only if it appears in B's sitemap, so noindexed vs-pages are never pushed.
- **Dropped pages**: URLs that are in A's sitemap but not in B's (removed, or newly noindexed) are also submitted, so Bing re-crawls them and sees the 404 or `noindex` sooner. IndexNow's protocol explicitly allows submitting deleted URLs.

Submitting only changed URLs follows Bing's guidance against resubmitting unchanged pages. `--all` exists for the one-off first submission.

**3. Use the sitemap as the source of indexable URLs.** It is generated, already tested for freshness, and is what Bing is told to index. Reading it at both revisions with `git show` means the script needs no generator run.

**4. Wait for the deploy before pinging.** If Bing fetches a URL before Workers Builds finishes, it would see the old page. The workflow polls the commit's check runs, using `GITHUB_TOKEN` with `checks: read`, until `Workers Builds: fuji-compare-tool` completes. It pings only on success. It gives up after 15 minutes without pinging: a missed ping costs only crawl latency, and the next push's range does not re-cover it, so that's accepted.

**5. Put the key in the script as a constant, not a secret.** IndexNow keys are public by design (the file is served to anyone). A test ties the constant, the file name and the file contents together.

**6. Treat ping failures as warnings.** A non-2xx response (for example, 429 or 422) fails the workflow run so it is visible on GitHub. That has no effect on the site or the deploy.

## Risks / Trade-offs

- [Multi-commit pushes and merge commits] → the workflow uses `github.event.before..github.sha`, so every page in the push is covered. A force-push or new branch (`before` is all zeros) falls back to `HEAD~1..HEAD`.
- [Data-only edits that the sitemap filter drops] → none: brand pages are always in the sitemap.
- [The key file is excluded from the upload by mistake] → the test checks that `.assetsignore` doesn't match it.
