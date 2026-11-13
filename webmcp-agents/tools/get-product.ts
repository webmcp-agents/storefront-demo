import { defineWebTool, WebToolError } from '@webmcp-agents/core'
import { z } from 'zod'
import { getProduct } from '@/lib/queries'
import { discountPercent, getCategory } from '@/lib/queries'

/**
 * `get_product`: one product's full details by slug (price, discount, colors, sizes, stock, rating, description),
 * without changing the page.
 *
 * On every page (no `match`). Read-only.
 *
 * @throws {WebToolError} `invalid_input` when no product has that slug.
 */
export const getProductTool = defineWebTool({
  id: 'get_product',
  title: 'Get product',
  description:
    'Full details of one product: price, discount, colors, sizes, stock, rating, date added and description. Works on every page. ' +
    'Take the slug from search_products or filter_products. Next: open_product, then add_to_cart.',
  readOnly: true,
  inputSchema: z.object({
    slug: z.string().describe('The product slug as search_products lists it, e.g. "wool-overcoat"'),
  }),
  execute: ({ slug }) => {
    const p = getProduct(slug)
    if (!p) throw new WebToolError('invalid_input', `No product "${slug}". Try search_products.`)
    return {
      slug: p.slug,
      name: p.name,
      category: getCategory(p.category)?.name,
      price: p.price,
      compareAtPrice: p.compareAtPrice ?? null,
      discountPercent: discountPercent(p),
      colors: p.colors.map((c) => c.name),
      sizes: p.sizes.length ? p.sizes : 'one size',
      inStock: p.stock > 0,
      unitsLeft: p.stock,
      rating: p.rating,
      reviews: p.reviews,
      addedAt: p.addedAt,
      description: p.description,
      details: p.details,
    }
  },
})
