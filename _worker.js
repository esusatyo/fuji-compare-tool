// ─────────────────────────────────────────────
// EDGE IMAGE CACHE PROXY
//
// fujifilm-x.b-cdn.net (Fujifilm's own Bunny CDN) hangs on a meaningful
// share of cache-miss requests — TCP/TLS connects, but no response body
// ever arrives — which engine.js's <img onerror> fallback can't catch
// (it only fires on an explicit load error, not a hang), so visitors see
// a stuck white box instead of the colored placeholder.
//
// Routes under /img-cache/<host>/<path> proxy to the real host (allowlisted
// below — this must stay an allowlist, not an open passthrough, or the
// route becomes a public proxy for arbitrary URLs), cache the response at
// Cloudflare's edge, and time out fast so a hang becomes a quick 504 —
// which DOES fire <img onerror>, restoring the existing fallback.
//
// engine.js's PROXIED_IMAGE_HOSTS must match ALLOWED_ORIGIN_HOSTS below;
// they can't share a module (brand/engine scripts are plain browser
// globals, this runs as a Worker), so keep the two lists in sync by hand.
// ─────────────────────────────────────────────

// Exported (unused by the Worker runtime itself, which only reads the
// default export) so tests/logic/image-proxy.test.js can assert this stays
// in sync with engine.js's PROXIED_IMAGE_HOSTS without duplicating the list.
export const ALLOWED_ORIGIN_HOSTS = new Set(['fujifilm-x.b-cdn.net']);
const ORIGIN_TIMEOUT_MS = 8000;
const EDGE_CACHE_TTL = 60 * 60 * 24 * 30; // 30 days

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/img-cache/')) {
      return handleImageCache(request, url, ctx);
    }
    return env.ASSETS.fetch(request);
  },
};

async function handleImageCache(request, url, ctx) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405 });
  }

  const rest = url.pathname.slice('/img-cache/'.length);
  const slash = rest.indexOf('/');
  if (slash === -1) return new Response('Not found', { status: 404 });

  const host = rest.slice(0, slash);
  if (!ALLOWED_ORIGIN_HOSTS.has(host)) return new Response('Not found', { status: 404 });

  const cache = caches.default;
  const cached = await cache.match(request);
  if (cached) return cached;

  const targetUrl = `https://${host}${rest.slice(slash)}${url.search}`;

  let originResp;
  try {
    originResp = await fetch(targetUrl, {
      cf: { cacheTtl: EDGE_CACHE_TTL, cacheEverything: true },
      signal: AbortSignal.timeout(ORIGIN_TIMEOUT_MS),
    });
  } catch {
    // Hang/timeout/DNS/TLS failure — return a fast, explicit error so the
    // browser's <img onerror> fires instead of leaving the request to hang.
    return new Response('Upstream unreachable', { status: 504 });
  }

  if (!originResp.ok) {
    return new Response('Upstream error', { status: 502 });
  }

  const headers = new Headers(originResp.headers);
  headers.set('Cache-Control', `public, max-age=${EDGE_CACHE_TTL}, immutable`);
  headers.delete('set-cookie');
  const response = new Response(originResp.body, { status: 200, headers });

  ctx.waitUntil(cache.put(request, response.clone()));
  return response;
}
