'use client'

import type { FiltersStore } from '@/lib/stores/filters'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useStore } from 'zustand'

/**
 * Two-way sync between a filters store and the query string.
 *
 * - URL -> store: first load, and navigations we did not cause (a header link, back/forward).
 * - store -> URL: keeps the address shareable without adding history entries.
 *
 * Tools write to the store from outside React, so the store stays the source of truth while the page is open.
 *
 * @param store - The page's filters store, e.g. `useProductFiltersStore`.
 * @param parse - Reads filters from query parameters. Keep it stable (module-level), as it is an effect dependency.
 * @param toParams - Writes filters to query parameters. Keep it stable too.
 * @returns The filters in force.
 * @remarks Uses `useSearchParams`, so the calling page needs a `<Suspense>` boundary.
 */
export function useUrlSyncedFilters<T>(
  store: FiltersStore<T>,
  parse: (params: URLSearchParams) => T,
  toParams: (filters: T) => URLSearchParams,
): T {
  const searchParams = useSearchParams()
  const filters = useStore(store, (s) => s.filters)
  const lastWritten = useRef<string | null>(null)
  const urlKey = searchParams.toString()

  useEffect(() => {
    if (lastWritten.current === urlKey) return
    lastWritten.current = urlKey
    store.getState().replace(parse(new URLSearchParams(urlKey)))
  }, [urlKey, store, parse])

  useEffect(() => {
    // Skip a stale snapshot: the effect above may have just replaced the store from the URL.
    if (store.getState().filters !== filters) return
    const next = toParams(filters).toString()
    if (next === lastWritten.current) return
    lastWritten.current = next
    window.history.replaceState(null, '', next ? `?${next}` : window.location.pathname)
  }, [filters, store, toParams])

  return filters
}
