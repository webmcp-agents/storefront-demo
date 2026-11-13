'use client'

import { useEffect } from 'react'
import { useCartStore } from './cart'
import { useOrdersStore } from './orders'

/** Every store that is saved to localStorage. */
const PERSISTED_STORES = [useCartStore, useOrdersStore]

/**
 * Read the persisted stores from localStorage once, after the first render. Mounted once, by `<Providers>`.
 *
 * Reading during render would make the first client render differ from the server's (an empty cart) and break
 * hydration, so the stores start empty and fill in here; pages wait with `useHasHydrated`.
 */
export function useRehydrateStores(): void {
  useEffect(() => {
    for (const store of PERSISTED_STORES) void store.persist?.rehydrate()
  }, [])
}
