'use client'

import { create } from 'zustand'

/** The search palette's state, shared so the `search_products` tool can open it in front of the person. */
export interface SearchUiState {
  /** Whether the palette is open. */
  open: boolean
  /** What is typed in it; kept while it is closed so ⌘K reopens on the same search. */
  query: string
  /**
   * Open the palette.
   *
   * @param query - What to show in its field. Defaults to empty.
   */
  openSearch: (query?: string) => void
  /** Close the palette and keep the query. */
  closeSearch: () => void
  /**
   * Change the query.
   *
   * @param query - The new text.
   */
  setQuery: (query: string) => void
}

/** The search palette's state. Use `useSearchUiStore.getState()` outside React. */
export const useSearchUiStore = create<SearchUiState>()((set) => ({
  open: false,
  query: '',
  openSearch: (query = '') => set({ open: true, query }),
  closeSearch: () => set({ open: false }),
  setQuery: (query) => set({ query }),
}))
