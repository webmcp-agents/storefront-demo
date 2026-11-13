'use client'

import { useUrlSyncedFilters } from '@/hooks/use-url-synced-filters'
import {
  PRODUCT_SORTS,
  countActiveFilters,
  filterProducts,
  getCategory,
  parseProductFilters,
  productFiltersToParams,
  type ProductSort,
} from '@/lib/queries'
import { useProductFiltersStore } from '@/lib/stores/filters'
import { useMemo } from 'react'

/** "1 result" or "3 results". */
const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`

/**
 * The /shop page: filters mirrored to the URL, the matching products and the page's heading.
 *
 * @returns The page's model: the filters in force, the matching products and their count, the heading and intro (the
 * category's when exactly one is chosen, else "Sale" or "All products"), the sort and its options, and `clearAll`.
 */
export function useShopCatalog() {
  const filters = useUrlSyncedFilters(
    useProductFiltersStore,
    parseProductFilters,
    productFiltersToParams,
  )
  const { patch, reset } = useProductFiltersStore.getState()
  const results = useMemo(() => filterProducts(filters), [filters])
  const category =
    filters.categories.length === 1
      ? getCategory(filters.categories[0])
      : undefined

  return {
    filters,
    results,
    activeCount: countActiveFilters(filters),
    heading: category?.name ?? (filters.onSale ? 'Sale' : 'All products'),
    intro:
      category?.blurb ??
      'Search and filter by price, discount, color, size and when it was added.',
    resultCount: results.length,
    resultNoun: results.length === 1 ? 'product' : 'products',
    showResultsLabel: `Show ${plural(results.length, 'result', 'results')}`,
    sort: filters.sort,
    sortOptions: PRODUCT_SORTS,
    setSort: (sort: string) =>
      patch({ sort: sort as ProductSort }),
    clearAll: reset,
  }
}

/** What {@link useShopCatalog} returns. */
export type ShopCatalogModel = ReturnType<typeof useShopCatalog>
