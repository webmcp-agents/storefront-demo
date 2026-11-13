'use client'

import { type AiSettingsStatus, EMPTY_AI_SETTINGS } from '@/lib/ai/providers'
import { create } from 'zustand'

/** What the visitor's AI settings are, as the server reports them (keys are never sent to the page). */
export interface AiSettingsState {
  /** The saved settings, or `null` until {@link loadAiSettings} has answered. */
  status: AiSettingsStatus | null
  /**
   * Changes on every save or removal. The chat widget is keyed on it, so it remounts and picks up the new provider;
   * the first load does not change it.
   */
  revision: number
  /**
   * Record the status as first loaded, without remounting the chat.
   *
   * @param status - What `GET /api/ai-settings` returned.
   */
  setStatus: (status: AiSettingsStatus) => void
  /**
   * Record the status after a save or removal, and bump {@link AiSettingsState.revision}.
   *
   * @param status - What the `POST` or `DELETE` returned.
   */
  commitStatus: (status: AiSettingsStatus) => void
}

/** The visitor's AI settings. */
export const useAiSettingsStore = create<AiSettingsState>()((set) => ({
  status: null,
  revision: 0,
  setStatus: (status) => set({ status }),
  commitStatus: (status) => set((s) => ({ status, revision: s.revision + 1 })),
}))

let loading: Promise<void> | null = null

/**
 * Read the settings from the server, once per page load (the cookie is httpOnly, so the page can't read it).
 *
 * @returns A promise that settles when the store has the status. Never rejects: a failed request counts as "nothing
 * saved" ({@link EMPTY_AI_SETTINGS}). Later calls return the same promise.
 */
export function loadAiSettings(): Promise<void> {
  loading ??= fetch('/api/ai-settings', { cache: 'no-store' })
    .then((res) => (res.ok ? (res.json() as Promise<AiSettingsStatus>) : EMPTY_AI_SETTINGS))
    .catch(() => EMPTY_AI_SETTINGS)
    .then((status) => useAiSettingsStore.getState().setStatus(status))
  return loading
}
