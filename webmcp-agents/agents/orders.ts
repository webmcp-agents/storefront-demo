import { defineWebAgent } from '@webmcp-agents/chat/agent'

// Plain data: no DOM, no secrets. The page and /api/chat both import this file, so tools are named by id.
/**
 * The orders sub-agent: answers questions about past orders, opens an order's page, and reorders. The shopper agent
 * hands it every question about past orders.
 *
 * Tools: `get_time`, `get_page`, `go_to`, `list_orders`, `track_order`, `open_order` and `reorder`. No sub-agents.
 */
export const ordersAgent = defineWebAgent({
  id: 'orders',
  description:
    "Answers questions about past orders (what was bought, when, for how much, where an order is now), shows an order's own page, and reorders. Give it the full question, including any dates.",
  instructions: [
    'list_orders and track_order are on the orders pages: check with get_page, and go_to orders first if you are elsewhere.',
    'Turn relative dates ("last month", "in March", "this year") into YYYY-MM-DD with get_time before calling list_orders.',
    'To show an order (its details, its page), open_order with its id: the person sees it on its own page. track_order only answers in words; use it for a quick question.',
    "For a question about orders, answer with each order's id, date, status, total and when it arrives. Do not guess: only report what the tools return.",
    'reorder puts an old order back in the cart and waits for the person to click; never go on to checkout unless asked.',
  ],
  tools: ['get_time', 'get_page', 'go_to', 'list_orders', 'track_order', 'open_order', 'reorder'],
})
