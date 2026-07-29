#!/usr/bin/env python3
"""Local preview server that resolves URLs the way the host does.

Internal links are published extensionless (`/fujifilm/vs/x-t5-vs-x-t4`)
because Cloudflare Pages 307-redirects `/page.html` → `/page`, so a `.html`
href would put a temporary redirect on every crawl path — see cleanHref in
scripts/generate-seo.js.

`python3 -m http.server` doesn't do that mapping and 404s on every vs-page
link, so preview through this instead:

    python3 scripts/preview.py [port]      # default 3456

Standard library only — the site itself stays dependency-free.
"""
import functools
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class CleanURLHandler(SimpleHTTPRequestHandler):
    """Serve `/page` from `page.html`, matching Cloudflare Pages."""

    def translate_path(self, path):
        local = super().translate_path(path)
        if os.path.isdir(local) or os.path.exists(local):
            return local
        # No trailing slash and no extension → try the .html file the
        # generator actually emits.
        if not path.endswith('/') and os.path.exists(local + '.html'):
            return local + '.html'
        return local


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3456
    handler = functools.partial(CleanURLHandler, directory=ROOT)
    with ThreadingHTTPServer(('', port), handler) as httpd:
        print(f'Preview (clean URLs) → http://localhost:{port}/')
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == '__main__':
    main()
