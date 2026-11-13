import { defineWebTool } from '@webmcp-agents/core'
import { describeCart, useCartStore } from '@/lib/stores/cart'

/**
 * `get_cart`: read the cart as {@link describeCart} shapes it, each line with the `lineId` the other cart tools take.
 *
 * On every page (no `match`). Read-only; never throws.
 */
export const getCart = defineWebTool({
  id: 'get_cart',
  title: 'Get cart',
  description:
    'Read the cart: each line with its lineId, product, color, size, quantity and price, plus subtotal, shipping and total. Works on every page. ' +
    'Use before changing the cart. Next: update_cart_item, remove_from_cart, or go_to checkout.',
  readOnly: true,
  execute: () => describeCart(useCartStore.getState().lines),
})
