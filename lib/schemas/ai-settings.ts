import {
  AI_PROVIDERS,
  type AiProviderId,
  type AiSettingsStatus,
  getAiProvider,
  MODEL_ID_PATTERN,
} from '@/lib/ai/providers'
import { z } from 'zod'

/** The model select's value for "type your own model ID". */
export const CUSTOM_MODEL = '__custom__'

const providerIds = AI_PROVIDERS.map((p) => p.id) as [AiProviderId, ...AiProviderId[]]

/** What the AI settings form holds. */
export interface AiSettingsValues {
  provider: AiProviderId
  /** A model id from the provider's list, or {@link CUSTOM_MODEL}. */
  model: string
  /** The typed model id, used when `model` is {@link CUSTOM_MODEL}. */
  customModel: string
  /** A newly typed key; empty keeps the saved one. */
  apiKey: string
}

/**
 * The model id a form submits: the custom one when "Custom model ID…" is picked, else the picked one.
 *
 * @param values - The form's model fields.
 * @returns The id, trimmed.
 */
export const selectedModelId = ({ model, customModel }: Pick<AiSettingsValues, 'model' | 'customModel'>) =>
  (model === CUSTOM_MODEL ? customModel : model).trim()

/**
 * The AI settings form. The model id must match {@link MODEL_ID_PATTERN}, and a key is required unless one is already
 * saved for the chosen provider.
 *
 * @param saved - Which providers already have a key (from the settings status).
 * @returns A schema that puts the model error on `customModel` (or `model`) and the key error on `apiKey`.
 */
export function aiSettingsFormSchema(saved: AiSettingsStatus['saved']) {
  return z
    .object({
      provider: z.enum(providerIds),
      model: z.string(),
      customModel: z.string(),
      apiKey: z.string().trim(),
    })
    .superRefine((v, ctx) => {
      if (!MODEL_ID_PATTERN.test(selectedModelId(v)))
        ctx.addIssue({
          code: 'custom',
          path: [v.model === CUSTOM_MODEL ? 'customModel' : 'model'],
          message: 'Enter a model ID, such as gpt-6.1-sol.',
        })
      if (!v.apiKey && !saved[v.provider])
        ctx.addIssue({
          code: 'custom',
          path: ['apiKey'],
          message: `Enter your ${getAiProvider(v.provider).label} API key.`,
        })
    }) satisfies z.ZodType<AiSettingsValues>
}

/**
 * The form's starting values for one provider: its saved model (or its first one) and an empty key field.
 *
 * @param provider - The provider to show.
 * @param status - What is saved, or `null` before it has loaded.
 * @returns Form values; a saved model that isn't in the provider's list shows as a custom model id.
 */
export function aiSettingsValuesFor(provider: AiProviderId, status: AiSettingsStatus | null): AiSettingsValues {
  const spec = getAiProvider(provider)
  const savedModel = status?.saved[provider]?.model
  const known = savedModel !== undefined && spec.models.some((m) => m.id === savedModel)
  return {
    provider,
    model: savedModel ? (known ? savedModel : CUSTOM_MODEL) : spec.models[0].id,
    customModel: savedModel && !known ? savedModel : '',
    apiKey: '',
  }
}
