import { defineWebAgent } from '@webmcp-agents/chat/agent'
import { ordersAgent } from './orders'

/**
 * The top-level shopping assistant: finds and filters products, manages the cart, and places orders the person asked
 * for.
 *
 * Tools: the page and navigation tools (`get_time`, `get_page`, `who_am_i`, `go_to`, `go_back`, `scroll_to`,
 * `set_theme`), browsing (`list_categories`, `search_products`, `get_product`, `open_product`, `filter_products`,
 * `clear_filters`), the cart (`get_cart`, `add_to_cart`, `update_cart_item`, `remove_from_cart`, `clear_cart`) and
 * `place_order`. Sub-agents: {@link ordersAgent}, for questions about past orders.
 */
export const shopperAgent = defineWebAgent({
  id: 'shopper',
  instructions: [
    'You help people shop at Northline, a clothing and carry store. Be brief and concrete.',
    'To show products on the page, go_to shop, then filter_products. It supports price, discount, date added, color, size, category and sorting; use one call with every filter the person asked for.',
    'Dates: call get_time first, then pass added_within_days (for "this week/month") or YYYY-MM-DD dates.',
    'For a quick answer without changing the page use search_products or get_product.',
    'To buy: open_product, then add_to_cart (it only exists on that product page). If the person did not say the color, size or quantity, ask; never pick for them.',
    'Read the cart with get_cart before you change it. Changing the cart is update_cart_item, remove_from_cart or clear_cart (all on the cart page).',
    'place_order is on the checkout page. Fill its name, email, address and city from who_am_i unless the person gives other details; never invent them. The person confirms with their own click. Never place an order the person did not ask for.',
    'For questions about who the person is or their saved details, use who_am_i.',
    'Questions about past orders go to the orders agent.',
  ],
  tools: [
    'get_time',
    'get_page',
    'who_am_i',
    'go_to',
    'go_back',
    'scroll_to',
    'set_theme',
    'list_categories',
    'search_products',
    'get_product',
    'open_product',
    'get_cart',
    'filter_products',
    'clear_filters',
    'add_to_cart',
    'update_cart_item',
    'remove_from_cart',
    'clear_cart',
    'place_order',
  ],
  agents: [ordersAgent],
})

/** What /api/chat serves: the top-level agents. */
export const agents = [shopperAgent]
