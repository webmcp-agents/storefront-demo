import { defineWebTool } from '@webmcp-agents/core'
import { filterProducts } from '@/lib/queries'
import { useProductFiltersStore } from '@/lib/stores/filters'

/**
 * `clear_filters`: reset every /shop filter and the search, and answer with how many products now show.
 *
 * On /shop only (`match`). Never throws.
 */
export const clearFilters = defineWebTool({
  id: 'clear_filters',
  title: 'Clear all',
  description:
    'Remove every filter and the search from the shop page so all products show again. On /shop only: go_to shop first. Next: filter_products.',
  match: '/shop',
  execute: () => {
    useProductFiltersStore.getState().reset()
    return `Filters cleared. Showing all ${filterProducts(useProductFiltersStore.getState().filters).length} products.`
  },
})
