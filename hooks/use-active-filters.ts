'use client'

import { activeFilterChips } from '@/lib/filter-chips'
import type { ProductFilters } from '@/lib/queries'
import { useProductFiltersStore } from '@/lib/stores/filters'

/**
 * The applied filters as chips, each with the action that removes it.
 *
 * @param filters - The product filters in force.
 * @returns One chip per applied filter, in the panel's order: a stable `key`, its `label`, and `remove`, which patches
 * the filters store to drop just that filter.
 */
export function useActiveFilters(filters: ProductFilters) {
  const patch = useProductFiltersStore((s) => s.patch)
  return activeFilterChips(filters).map((chip) => ({
    key: chip.key,
    label: chip.label,
    remove: () => patch(chip.clear),
  }))
}
