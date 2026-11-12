/**
 * Sandbox fix for the Firecrawl JS SDK.
 *
 * This VM reaches the internet through an authenticated egress proxy.
 * Axios's default Node http adapter mangles the Host header through that
 * proxy ("The property 'Host in options.headers' must match the request
 * authority"), which breaks every Firecrawl call the SDK makes. Node's
 * native fetch handles the same proxy correctly, so force axios onto its
 * fetch adapter. Verified: axios + fetch adapter -> Firecrawl scrape
 * HTTP 200, while the default adapter fails in ~200ms with the Host error.
 *
 * Import this module from any route that uses @mendable/firecrawl-js.
 * It must live in the route's own module graph: setting the default in
 * instrumentation.ts alone does not reach Turbopack route bundles.
 * Module top-level code runs at import, before the handler constructs
 * the SDK client (which builds its axios instance per request).
 */
import axios from "axios";

axios.defaults.adapter = "fetch";
