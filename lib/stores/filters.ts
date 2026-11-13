'use client'

import {
  emptyOrderFilters,
  emptyProductFilters,
  orderFiltersToParams,
  productFiltersToParams,
  type OrderFilters,
  type ProductFilters,
} from '@/lib/queries'
import { create } from 'zustand'

/** One page's filters and the actions that change them. */
export interface FiltersState<T> {
  /** The filters in force. */
  filters: T
  /**
   * Replace every filter.
   *
   * @param next - The new filters.
   */
  replace: (next: T) => void
  /**
   * Change some filters and keep the rest.
   *
   * @param patch - The filters to change.
   */
  patch: (patch: Partial<T>) => void
  /** Back to the empty filters the store started with. */
  reset: () => void
}

/**
 * A zustand store for one page's filters.
 *
 * @param empty - The filters with nothing applied; the initial state and what `reset` returns to.
 * @returns A bound zustand store hook (call it in components, or `.getState()` outside React).
 */
function createFiltersStore<T>(empty: T) {
  return create<FiltersState<T>>()((set) => ({
    filters: empty,
    replace: (filters) => set({ filters }),
    patch: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
    reset: () => set({ filters: empty }),
  }))
}

/** A filters store made by `createFiltersStore`, e.g. {@link useProductFiltersStore}. */
export type FiltersStore<T> = ReturnType<typeof createFiltersStore<T>>

/** Filters for /shop. The page mirrors them to the URL; tools write here and the grid follows. */
export const useProductFiltersStore = createFiltersStore<ProductFilters>(emptyProductFilters)

/** Filters for /orders. The page mirrors them to the URL; tools write here and the list follows. */
export const useOrderFiltersStore = createFiltersStore<OrderFilters>(emptyOrderFilters)

/**
 * Write filters to a store and, when the person is on that page, to its URL too.
 *
 * A tool can run before the page's view has mounted (its `match` turns it on as the URL changes), and the view copies
 * the URL into the store when it mounts: with the URL written too, it copies the same filters instead of clearing them.
 *
 * @param store - The page's filters store.
 * @param path - The page's pathname, e.g. `"/shop"`.
 * @param toParams - Turns filters into query parameters.
 * @param next - The filters to show.
 */
function showFilters<T>(store: FiltersStore<T>, path: string, toParams: (f: T) => URLSearchParams, next: T) {
  store.getState().replace(next)
  if (window.location.pathname !== path) return
  const query = toParams(next).toString()
  window.history.replaceState(null, '', query ? `${path}?${query}` : path)
}

/**
 * Show these filters on /shop: the store and the URL together.
 *
 * @param next - The product filters to apply.
 * @remarks Browser only: reads `window.location`.
 */
export const showProductFilters = (next: ProductFilters) =>
  showFilters(useProductFiltersStore, '/shop', productFiltersToParams, next)

/**
 * Show these filters on /orders: the store and the URL together (see {@link showProductFilters}).
 *
 * @param next - The order filters to apply.
 * @remarks Browser only: reads `window.location`.
 */
export const showOrderFilters = (next: OrderFilters) =>
  showFilters(useOrderFiltersStore, '/orders', orderFiltersToParams, next)
