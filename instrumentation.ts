/**
 * Runs once when the Next.js server starts (Node.js runtime).
 *
 * Sandbox fix: this VM reaches the internet through an authenticated egress
 * proxy. Axios's default Node http adapter mangles the Host header through
 * that proxy ("The property 'Host in options.headers' must match the request
 * authority"), which breaks every Firecrawl call the app makes via the
 * Firecrawl JS SDK (it builds its own axios instance). Node's native fetch
 * handles the same proxy correctly, so force axios onto its fetch adapter.
 * Verified: axios + fetch adapter -> Firecrawl scrape HTTP 200, while the
 * default adapter fails in ~200ms with the Host error.
 *
 * NOTE: setting the default here alone does NOT reach Turbopack route
 * bundles (separate module graph). The effective fix is the per-route
 * import of lib/axios-fetch-adapter.ts in each route that uses
 * @mendable/firecrawl-js. Keep this file as a backstop for non-route
 * server contexts.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const axios = (await import("axios")).default;
    axios.defaults.adapter = "fetch";
  }
}
