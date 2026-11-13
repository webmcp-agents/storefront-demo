import { defineCloudflareConfig } from '@opennextjs/cloudflare'

// The catalog is static data, so no incremental cache is configured: nothing to provision beyond the Worker.
// To persist ISR / `use cache` output across requests, add an R2 bucket and pass
// `incrementalCache: r2IncrementalCache` (see https://opennext.js.org/cloudflare/caching).
export default defineCloudflareConfig({})
