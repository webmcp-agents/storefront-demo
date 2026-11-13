import { defineWebTool, WebToolError } from '@webmcp-agents/core'
import { z } from 'zod'
import { emptyOrderFilters } from '@/lib/queries'
import { navigate } from '@/lib/navigate'
import { showOrderFilters } from '@/lib/stores/filters'
import { getOrder } from '@/lib/stores/orders'
import { whenElement } from '@/lib/when-element'

/**
 * The selector for an order's Details link on the /orders list.
 *
 * @param id - The order id, without `#`.
 * @returns A CSS selector matching the link by its accessible label.
 */
const details = (id: string) => `a[aria-label="View order ${id}"]`

/**
 * `open_order`: open an order's own page through {@link navigate}, and answer once it is open, or say it is still
 * loading when the address hasn't changed in time. A leading `#` in the id is ignored.
 *
 * On every page (no `match`); on /orders the cursor points at the order's Details link first.
 *
 * @throws {WebToolError} `invalid_input` when there is no order with that id.
 */
export const openOrder = defineWebTool({
  id: 'open_order',
  title: 'Open order',
  description:
    "Open one order's own page, where the person sees its items, status, totals and delivery. Use whenever they want to see or open an order; " +
    'track_order only answers in words. Works on every page; answers once the page is open. Take the id from list_orders, e.g. "1014". Next: reorder, or answer from what the page shows.',
  inputSchema: z.object({ orderId: z.string().describe('The order id from list_orders, e.g. "1014"') }),
  // The order's Details link on the orders list (filtered out: the filters clear so it shows). Elsewhere there is
  // nothing to point at and the order opens with the router.
  target: async ({ orderId }) => {
    const id = orderId.replace('#', '')
    if (window.location.pathname !== '/orders') return null
    if (!document.querySelector(details(id)) && getOrder(id)) showOrderFilters(emptyOrderFilters)
    return whenElement(details(id), 1000)
  },
  execute: async ({ orderId }) => {
    const order = getOrder(orderId.replace('#', ''))
    if (!order) throw new WebToolError('invalid_input', `No order "${orderId}". Try list_orders.`)
    const opened = await navigate(`/orders/${order.id}`)
    return opened ? `Opened order ${order.id} (its own page).` : `Opening order ${order.id}: the page is loading.`
  },
})
