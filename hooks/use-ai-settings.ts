'use client'

import { AI_PROVIDERS, type AiProviderId, type AiSettingsStatus, getAiProvider } from '@/lib/ai/providers'
import {
  aiSettingsFormSchema,
  type AiSettingsValues,
  aiSettingsValuesFor,
  selectedModelId,
} from '@/lib/schemas/ai-settings'
import { loadAiSettings, useAiSettingsStore } from '@/lib/stores/ai-settings'
import { zodResolver } from '@hookform/resolvers/zod'
import { type BaseSyntheticEvent, useEffect, useId, useState } from 'react'
import { type Resolver, useForm, useWatch } from 'react-hook-form'

export { CUSTOM_MODEL } from '@/lib/schemas/ai-settings'

const DEFAULT_PROVIDER: AiProviderId = 'openai'

/**
 * Send the settings endpoint a request and read its answer.
 *
 * @param init - The request: a `POST` with the new settings, or a `DELETE`.
 * @param query - The query string, e.g. `"?provider=openai"`.
 * @param fallback - The message to throw when the server gives none.
 * @returns The settings status after the change.
 * @throws {Error} with the server's message (or `fallback`) when the request fails or the response isn't a status.
 */
async function requestAiSettings(init: RequestInit, query: string, fallback: string): Promise<AiSettingsStatus> {
  const res = await fetch(`/api/ai-settings${query}`, init)
  const body = (await res.json().catch(() => null)) as (AiSettingsStatus & { error?: string }) | null
  if (!res.ok || !body) throw new Error(body?.error ?? fallback)
  return body
}

/**
 * The AI settings sheet: the form (react-hook-form, validated by {@link aiSettingsFormSchema}), seeded from what's
 * saved, and saving or removing keys. Each provider keeps its own model and key, so switching between providers in the
 * sheet shows what was saved for each.
 *
 * @returns The sheet's model: open state, the form, the chosen provider's details, save and remove, and labels for
 * the header trigger.
 */
export function useAiSettings() {
  const status = useAiSettingsStore((s) => s.status)
  const commitStatus = useAiSettingsStore((s) => s.commitStatus)
  const [open, setOpenState] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [removing, setRemoving] = useState(false)
  const id = useId()

  // The schema depends on which providers have a saved key, which changes after a save or removal: build it per call.
  const resolver: Resolver<AiSettingsValues> = (values, context, options) =>
    zodResolver(aiSettingsFormSchema(useAiSettingsStore.getState().status?.saved ?? {}))(values, context, options)

  const form = useForm<AiSettingsValues>({
    resolver,
    defaultValues: aiSettingsValuesFor(DEFAULT_PROVIDER, null),
  })
  const [provider, model] = useWatch({ control: form.control, name: ['provider', 'model'] })

  useEffect(() => {
    void loadAiSettings()
  }, [])

  /**
   * Show a provider in the form: its saved model (or its first one), an empty key field, and no errors.
   *
   * @param next - The provider to show.
   * @param from - The status to read its saved model from.
   */
  const showProvider = (next: AiProviderId, from: AiSettingsStatus | null) => form.reset(aiSettingsValuesFor(next, from))

  /**
   * Open or close the sheet. Opening resets the form to the active provider as saved, so a half-typed, unsaved
   * change never lingers.
   *
   * @param next - Whether the sheet should be open.
   */
  function setOpen(next: boolean) {
    if (next) {
      const first = Object.keys(status?.saved ?? {})[0] as AiProviderId | undefined
      showProvider(status?.provider ?? first ?? DEFAULT_PROVIDER, status)
      setShowKey(false)
    }
    setOpenState(next)
  }

  /**
   * Switch the form to another provider (its saved model, an empty key). Picking the current one is a no-op.
   *
   * @param next - The provider picked in the radio group.
   */
  function setProvider(next: AiProviderId) {
    if (next !== form.getValues('provider')) showProvider(next, status)
  }

  const spec = getAiProvider(provider)
  const savedKeyHint = status?.saved[provider]?.keyHint

  /**
   * Save valid settings for the chosen provider and make it the active one; a server error shows on the form.
   *
   * @param values - The validated form values. An empty key keeps the saved one.
   */
  async function saveValid(values: AiSettingsValues) {
    try {
      const next = await requestAiSettings(
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            provider: values.provider,
            model: selectedModelId(values),
            apiKey: values.apiKey || undefined,
          }),
        },
        '',
        'Unable to save settings. Try again.',
      )
      commitStatus(next)
      setOpenState(false)
    } catch (err) {
      form.setError('root', { message: err instanceof Error ? err.message : 'Unable to save settings. Try again.' })
    }
  }

  /** Remove the chosen provider's key only; the others stay saved. A failure shows on the form. */
  async function remove() {
    const current = form.getValues('provider')
    setRemoving(true)
    form.clearErrors('root')
    try {
      const next = await requestAiSettings({ method: 'DELETE' }, `?provider=${current}`, '')
      commitStatus(next)
      showProvider(current, next)
    } catch {
      form.setError('root', { message: `Unable to remove the ${getAiProvider(current).label} key. Try again.` })
    } finally {
      setRemoving(false)
    }
  }

  const saving = form.formState.isSubmitting
  const active = status?.configured && status.provider ? getAiProvider(status.provider) : undefined
  const activeModel = active?.models.find((m) => m.id === status?.model)?.label ?? status?.model

  return {
    open,
    setOpen,
    /** The react-hook-form instance; fields bind to `form.control`. */
    form,
    providers: AI_PROVIDERS,
    setProvider,
    spec,
    /** The model select's value, to show the custom model field. */
    model,
    showKey,
    toggleShowKey: () => setShowKey((v) => !v),
    savedKeyHint,
    /**
     * Whether a provider has a saved key, for the "Key saved" mark on its card.
     *
     * @param p - The provider to check.
     */
    isSaved: (p: AiProviderId) => Boolean(status?.saved[p]),
    pending: saving ? ('save' as const) : removing ? ('remove' as const) : null,
    busy: saving || removing,
    /** A save or remove failure from the server (field errors show on their fields). */
    rootError: form.formState.errors.root?.message,
    /** Element ids that tie the form's labels, help text and errors to their fields. */
    ids: {
      provider: (p: AiProviderId) => `${id}-provider-${p}`,
      model: `${id}-model`,
      custom: `${id}-custom`,
      customError: `${id}-custom-error`,
      key: `${id}-key`,
      keyHelp: `${id}-key-help`,
      keyError: `${id}-key-error`,
      rootError: `${id}-error`,
    },
    /** The form's submit handler: validates, then saves. */
    save: (e?: BaseSyntheticEvent) => form.handleSubmit(saveValid)(e),
    remove,
    configured: Boolean(status?.configured),
    /** "DeepSeek · DeepSeek V4 Pro", for the trigger's name and the sheet's status line. */
    activeLabel: active ? `${active.label} · ${activeModel}` : undefined,
  }
}

/** What {@link useAiSettings} returns. */
export type AiSettingsModel = ReturnType<typeof useAiSettings>
