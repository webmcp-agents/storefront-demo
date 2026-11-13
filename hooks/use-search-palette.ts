'use client'

import { products } from '@/lib/data/products'
import { emptyProductFilters, filterProducts, getCategory } from '@/lib/queries'
import { useSearchUiStore } from '@/lib/stores/ui'
import { useShallow } from 'zustand/react/shallow'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useSyncExternalStore, type FormEvent } from 'react'

/** How many matches the palette lists; "see all" opens the rest on /shop. */
const MAX_RESULTS = 6

/**
 * Whether a key press lands in a text field, so the `/` shortcut leaves it alone.
 *
 * @param target - The key event's target.
 * @returns True for an input, textarea, select or contenteditable element.
 */
const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || /input|textarea|select/i.test(target.tagName))

/** A `useSyncExternalStore` subscribe that never fires: the platform doesn't change. */
const noop = () => () => {}
/** Whether this is a Mac, iPhone or iPad, to show ⌘K rather than Ctrl K. */
const isApple = () => /Mac|iPhone|iPad/.test(navigator.platform)

/**
 * The search palette: open state, the query and its matches, ⌘K and / shortcuts, and navigating to a result.
 *
 * @returns The palette's model: open state and setters, the query, up to {@link MAX_RESULTS} matches with their links,
 * a status line, the shortcut label for this platform, and actions that close the palette and open a result or all
 * matches on /shop.
 */
export function useSearchPalette() {
  const { open, query, openSearch, closeSearch, setQuery } = useSearchUiStore(
    useShallow((s) => ({ open: s.open, query: s.query, openSearch: s.openSearch, closeSearch: s.closeSearch, setQuery: s.setQuery })),
  )
  const router = useRouter()
  const pathname = usePathname()
  const apple = useSyncExternalStore(noop, isApple, () => true)

  // A new page (an agent's open_product after a search, a link) closes the palette instead of covering it.
  useEffect(() => {
    closeSearch()
  }, [pathname, closeSearch])

  // ⌘K / Ctrl K reopens on the last query; / (outside a text field) opens it empty.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        openSearch(useSearchUiStore.getState().query)
      } else if (e.key === '/' && !isTyping(e.target)) {
        e.preventDefault()
        openSearch()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openSearch])

  const results = useMemo(
    () =>
      filterProducts({ ...emptyProductFilters, q: query }, products)
        .slice(0, MAX_RESULTS)
        .map((p) => ({
          product: p,
          href: `/product/${p.slug}`,
          category: getCategory(p.category)?.name ?? p.category,
        })),
    [query],
  )

  const allResultsHref = `/shop?q=${encodeURIComponent(query)}`
  /**
   * Close the palette and open a page.
   *
   * @param href - The page to open, e.g. a product's.
   */
  const go = (href: string) => {
    closeSearch()
    router.push(href)
  }

  return {
    open,
    /** Open (keeping the query) or close the palette, for the dialog's open state. */
    setOpen: (next: boolean) => (next ? openSearch(query) : closeSearch()),
    /** Open the palette with an empty query. */
    openPalette: () => openSearch(),
    query,
    setQuery,
    results,
    status: results.length
      ? `${results.length} ${results.length === 1 ? 'match' : 'matches'}`
      : query
        ? 'No matches'
        : 'No products',
    shortcut: apple ? '⌘K' : 'Ctrl K',
    go,
    /** The form's submit handler: opens every match on /shop. */
    submit: (e: FormEvent) => {
      e.preventDefault()
      go(allResultsHref)
    },
    seeAll: () => go(allResultsHref),
  }
}

/** What {@link useSearchPalette} returns. */
export type SearchPaletteModel = ReturnType<typeof useSearchPalette>
/** One match in the palette: the product, its link and its category's name. */
export type SearchResultModel = SearchPaletteModel['results'][number]
