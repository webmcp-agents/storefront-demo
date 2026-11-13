import { defineWebTool } from '@webmcp-agents/core'
import { categories } from '@/lib/data/categories'
import { products } from '@/lib/data/products'

/**
 * `list_categories`: every category's slug, name, blurb and product count, for picking a slug for `filter_products`.
 *
 * On every page (no `match`). Read-only; never throws.
 */
export const listCategories = defineWebTool({
  id: 'list_categories',
  title: 'List categories',
  description:
    'List the store categories with their slug and how many products each has. Use to find the right category slug before filter_products. ' +
    'Next: filter_products (on /shop) or search_products.',
  readOnly: true,
  execute: () =>
    categories.map((c) => ({
      slug: c.slug,
      name: c.name,
      about: c.blurb,
      products: products.filter((p) => p.category === c.slug).length,
    })),
})
