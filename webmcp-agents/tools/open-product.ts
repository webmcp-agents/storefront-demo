import { defineWebTool, WebToolError } from '@webmcp-agents/core'
import { z } from 'zod'
import { navigate } from '@/lib/navigate'
import { getProduct } from '@/lib/queries'

/**
 * `open_product`: open a product's page (where `add_to_cart` lives) through {@link navigate}, and answer once it is
 * open, or say it is still loading when the address hasn't changed in time.
 *
 * On every page (no `match`).
 *
 * @throws {WebToolError} `invalid_input` when no product has that slug.
 */
export const openProduct = defineWebTool({
  id: 'open_product',
  title: 'Open product',
  description:
    "Open one product's page so it can be added to the cart. Works on every page; answers once the page is open. " +
    'Take the slug from search_products or filter_products. Next: add_to_cart (it is on the product page).',
  inputSchema: z.object({
    slug: z.string().describe('The product slug, e.g. "wool-overcoat"'),
  }),
  // the product's card link, or its row in the open search palette (a button): whatever on screen opens it
  target: ({ slug }) => ({ name: getProduct(slug)?.name ?? slug }),
  execute: async ({ slug }) => {
    const p = getProduct(slug)
    if (!p) throw new WebToolError('invalid_input', `No product "${slug}". Try search_products.`)
    const opened = await navigate(`/product/${p.slug}`)
    return opened
      ? `Opened ${p.name}. Next: add_to_cart with a color, size and quantity.`
      : `Opening ${p.name}: the page is loading. Next: add_to_cart with a color, size and quantity.`
  },
})
