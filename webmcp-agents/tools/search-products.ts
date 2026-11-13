import { defineWebTool } from '@webmcp-agents/core'
import { z } from 'zod'
import { products } from '@/lib/data/products'
import { emptyProductFilters, filterProducts, summarizeProduct } from '@/lib/queries'
import { useSearchUiStore } from '@/lib/stores/ui'
import { whenElement } from '@/lib/when-element'

/**
 * `search_products`: find products by words and answer with the match count and up to 10 summaries. The cursor opens
 * the search palette and types the query there, so the person sees the matches too.
 *
 * On every page (no `match`). Read-only; never throws.
 */
export const searchProducts = defineWebTool({
  id: 'search_products',
  title: 'Search products',
  description:
    'Find products by words in their name, category, color or description, e.g. "linen shirt" or "black boots". Answers with up to 10 matches (slug, price, discount, colors, sizes, date added). ' +
    'Works on every page: it opens the search palette and types the words there, so the person sees the matches too. To show results on the shop page use filter_products. Next: get_product or open_product.',
  readOnly: true,
  inputSchema: z.object({
    query: z.string().min(1).describe('Words to look for, e.g. "denim jacket"'),
  }),
  // The palette's field is the control: open it, then the cursor types the query into it.
  target: () => {
    useSearchUiStore.getState().openSearch()
    return whenElement<HTMLInputElement>('input[name="query"]')
  },
  execute: ({ query }) => {
    const hits = filterProducts({ ...emptyProductFilters, q: query }, products)
    return { query, total: hits.length, products: hits.slice(0, 10).map(summarizeProduct) }
  },
})
