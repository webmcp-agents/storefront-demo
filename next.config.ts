import type { NextConfig } from "next";

// Set by the Cloudflare scripts (preview / deploy / upload). Cache Components currently hang on the Workers runtime
// (opennextjs/opennextjs-cloudflare#1450, vercel/next.js#94880), so the Worker build renders without them until the
// adapter ships the fix. Everything else (next dev, next build, next start) keeps them on.
const forCloudflare = process.env.CLOUDFLARE_BUILD === "1";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    // @webmcp-agents/* are `link:`ed to the local monorepo (bun link in each package): let Turbopack follow the
    // symlinks there, and to the packages' own dependencies in its node_modules. Rebuild dist with
    // `pnpm --filter "./packages/*" dev` in the monorepo to see library changes.
    turbopackAdditionalRoots: {
      webmcpAgents: { path: '../../webmcp-agent-cursor' },
    },
  },
  // The dev badge sits where the chat launcher is (bottom-left in development).
  devIndicators: false,
  cacheComponents: !forCloudflare,
  partialPrefetching: !forCloudflare,
  turbopack: {
    // The chat handler lazy-loads whichever AI SDK provider WEB_AGENTS_MODEL names. We install OpenAI's and DeepSeek's (visitors can pick them in AI settings),
    // so the others resolve to a stub that explains how to install them.
    resolveAlias: Object.fromEntries(
      [
        '@ai-sdk/anthropic',
        '@ai-sdk/google',
        '@ai-sdk/mistral',
        '@ai-sdk/xai',
        '@openrouter/ai-sdk-provider',
      ].map((name) => [name, './lib/stubs/ai-provider.ts']),
    ),
    rules: {
      "*.css": {
        // Only the app's own CSS: a loader can't read files outside the project root (the linked packages' CSS),
        // and library CSS has no Tailwind in it.
        condition: { all: [{ not: "foreign" }, { not: { path: /^packages\// } }] },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

// Gives `next dev` the Cloudflare bindings from wrangler.jsonc (getCloudflareContext), as on the deployed Worker.
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
initOpenNextCloudflareForDev()
