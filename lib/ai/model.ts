import { createDeepSeek } from '@ai-sdk/deepseek'
import { createOpenAI } from '@ai-sdk/openai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import type { LanguageModel } from 'ai'
import { getAiProvider } from './providers'
import type { AiSettings } from './settings-cookie'

/**
 * The model for a visitor's own settings. Z.ai and Moonshot speak the OpenAI chat API at their own base URL.
 *
 * @param settings - The active provider's {@link AiSettings}.
 * @param settings.provider - Which provider to build.
 * @param settings.model - The model id to ask it for.
 * @param settings.apiKey - The visitor's key for that provider.
 * @returns An AI SDK model; nothing is sent until it is used.
 * @remarks Server only: the key must never reach the browser.
 */
export function modelFromSettings({ provider, model, apiKey }: AiSettings): LanguageModel {
  switch (provider) {
    case 'openai':
      return createOpenAI({ apiKey })(model)
    case 'deepseek':
      return createDeepSeek({ apiKey })(model)
    case 'zai':
    case 'moonshot': {
      const spec = getAiProvider(provider)
      return createOpenAICompatible({ name: provider, apiKey, baseURL: spec.baseURL! })(model)
    }
  }
}
