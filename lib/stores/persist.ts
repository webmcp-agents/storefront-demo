'use client'

import { useSyncExternalStore } from 'react'
import { createJSONStorage } from 'zustand/middleware'

/**
 * localStorage as a zustand `persist` storage. On the server `localStorage` doesn't exist: zustand catches that and
 * skips persisting, so importing a persisted store from a server-rendered component is safe.
 */
export const browserStorage = createJSONStorage(() => localStorage)

/**
 * The slice of a `persist`-wrapped zustand store that hydration needs.
 *
 * @remarks Only present in the browser: on the server, where there is no storage, zustand leaves `persist` off.
 */
export interface PersistedStore {
  persist: {
    /** Read the saved state from storage and merge it into the store. */
    rehydrate: () => Promise<void> | void
    /** Whether {@link PersistedStore.persist.rehydrate} has finished at least once. */
    hasHydrated: () => boolean
    /** Subscribe to the end of hydration. Returns the unsubscribe function. */
    onFinishHydration: (listener: () => void) => () => void
  }
}

/**
 * Whether a persisted store has read its saved state yet.
 *
 * Persisted stores are created with `skipHydration` so the server render and the first client render agree (both
 * show the initial state); {@link useRehydrateStores} reads storage right after mount. Until then a page should show a
 * skeleton rather than, say, an empty cart.
 *
 * @param store - A zustand store wrapped in `persist`.
 * @returns `false` on the server and until hydration finishes, then `true`.
 */
export function useHasHydrated(store: PersistedStore): boolean {
  // On the server zustand has no storage and leaves `persist` off the store: report "not yet".
  const api = store.persist as PersistedStore['persist'] | undefined
  return useSyncExternalStore(api?.onFinishHydration ?? noSubscription, api?.hasHydrated ?? notHydrated, notHydrated)
}

const noSubscription = () => () => {}
const notHydrated = () => false
