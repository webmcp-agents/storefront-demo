// Stand-in for AI SDK provider packages this app does not install. The chat handler lazy-loads whichever provider
// WEB_AGENTS_MODEL names; the bundler still wants every import to resolve. This app uses OpenAI, DeepSeek and the
// OpenAI-compatible provider (Z.ai, Moonshot).
/**
 * A provider factory that fails loudly, naming the package to install.
 *
 * @param name - The npm package the real factory comes from.
 * @returns A function that throws `Error` whenever it is called.
 */
const missing = (name: string) => () => {
  throw new Error(`${name} is not installed. Run: bun add ${name}`)
}

/** Stand-in for `@ai-sdk/anthropic`: throws when called. */
export const createAnthropic = missing('@ai-sdk/anthropic')
/** Stand-in for `@ai-sdk/google`: throws when called. */
export const createGoogleGenerativeAI = missing('@ai-sdk/google')
/** Stand-in for `@ai-sdk/mistral`: throws when called. */
export const createMistral = missing('@ai-sdk/mistral')
/** Stand-in for `@ai-sdk/xai`: throws when called. */
export const createXai = missing('@ai-sdk/xai')
/** Stand-in for `@openrouter/ai-sdk-provider`: throws when called. */
export const createOpenRouter = missing('@openrouter/ai-sdk-provider')
