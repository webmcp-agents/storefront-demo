/**
 * The AI providers a visitor can bring their own key for. Shared by the settings sheet (labels, model lists) and the
 * chat route (which provider to build). Nothing secret lives here.
 *
 * Model ids change often. Checked against each provider's model docs on 2026-11-13 (first entry = flagship); "Custom
 * model ID" in the sheet covers anything newer. Kimi K2.x and deepseek-v4-flash / -chat / -reasoner are retired.
 */
export const AI_PROVIDERS = [
  {
    id: 'openai',
    label: 'OpenAI',
    keyPlaceholder: 'sk-…',
    keysUrl: 'https://platform.openai.com/api-keys',
    models: [
      { id: 'gpt-6-astra', label: 'GPT-6 Astra' },
      { id: 'gpt-6.1-sol', label: 'GPT-6.1 Sol' },
      { id: 'gpt-6.1-terra', label: 'GPT-6.1 Terra' },
      { id: 'gpt-6-luna', label: 'GPT-6 Luna' },
    ],
  },
  {
    id: 'zai',
    label: 'Z.ai',
    keyPlaceholder: 'Your Z.ai API key',
    keysUrl: 'https://z.ai/manage-apikey/apikey-list',
    baseURL: 'https://api.z.ai/api/paas/v4',
    models: [
      { id: 'glm-5.3', label: 'GLM-5.3' },
      { id: 'glm-5.2', label: 'GLM-5.2' },
      { id: 'glm-5.1', label: 'GLM-5.1' },
    ],
  },
  {
    id: 'moonshot',
    label: 'Moonshot',
    keyPlaceholder: 'sk-…',
    keysUrl: 'https://platform.moonshot.ai/console/api-keys',
    baseURL: 'https://api.moonshot.ai/v1',
    models: [
      { id: 'kimi-k3.1-pro', label: 'Kimi K3.1 Pro' },
      { id: 'kimi-k3.1-pro-highspeed', label: 'Kimi K3.1 Pro HighSpeed' },
      { id: 'kimi-k3', label: 'Kimi K3' },
    ],
  },
  {
    id: 'deepseek',
    label: 'DeepSeek',
    keyPlaceholder: 'sk-…',
    keysUrl: 'https://platform.deepseek.com/api_keys',
    models: [
      { id: 'deepseek-flash', label: 'DeepSeek Flash (V4.1)' },
      { id: 'deepseek-v4-pro', label: 'DeepSeek V4 Pro' },
    ],
  },
] as const satisfies readonly AiProvider[]

/** One entry in {@link AI_PROVIDERS}. */
export interface AiProvider {
  /** Stored in the settings cookie and sent by the settings sheet. */
  id: string
  /** Name shown in the sheet. */
  label: string
  /** Placeholder for the key field. */
  keyPlaceholder: string
  /** Where to create a key: linked from the sheet. */
  keysUrl: string
  /** OpenAI-compatible endpoint, for providers without their own AI SDK package. */
  baseURL?: string
  /** Models the sheet offers, flagship first. */
  models: readonly { id: string; label: string }[]
}

/** Id of a supported provider: `openai`, `zai`, `moonshot` or `deepseek`. */
export type AiProviderId = (typeof AI_PROVIDERS)[number]['id']

/**
 * Whether a value is one of the {@link AI_PROVIDERS} ids: check ids that arrive in requests and cookies with it.
 *
 * @param value - Anything.
 * @returns True when `value` is an {@link AiProviderId}.
 */
export const isAiProviderId = (value: unknown): value is AiProviderId =>
  AI_PROVIDERS.some((p) => p.id === value)

/**
 * The {@link AI_PROVIDERS} entry for an id.
 *
 * @param id - A known id; check untrusted input with {@link isAiProviderId} first.
 * @returns The provider (never undefined for a valid {@link AiProviderId}).
 */
export const getAiProvider = (id: AiProviderId): AiProvider =>
  AI_PROVIDERS.find((p) => p.id === id)!

/** Model ids: letters, digits and . _ - : / only, so a custom id can't smuggle anything into a URL or header. */
export const MODEL_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,99}$/

/** A provider the visitor saved a key for: its model and the key's last four characters. */
export interface SavedAiProvider {
  /** The model chosen for this provider. */
  model: string
  /** The key's last four characters. */
  keyHint: string
}

/**
 * What the settings endpoint reports. The keys themselves never leave the server: only their last four characters.
 * `provider`/`model`/`keyHint` describe the active provider (the one the chat uses); `saved` has every saved one.
 */
export interface AiSettingsStatus {
  /** Whether a provider is active, i.e. the chat can run. */
  configured: boolean
  provider?: AiProviderId
  model?: string
  keyHint?: string
  saved: Partial<Record<AiProviderId, SavedAiProvider>>
}

/** The status before anything is saved. */
export const EMPTY_AI_SETTINGS: AiSettingsStatus = {
  configured: false,
  saved: {},
}
