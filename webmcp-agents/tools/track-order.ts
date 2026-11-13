import { defineWebTool, WebToolError } from '@webmcp-agents/core'
import { z } from 'zod'
import { formatDate, summarizeOrder } from '@/lib/queries'
import { getOrder } from '@/lib/stores/orders'

/**
 * `track_order`: one order's summary plus a sentence on where it is (delivered, cancelled, or its status and arrival
 * date). Answers in words only; the page doesn't change. A leading `#` in the id is ignored.
 *
 * On /orders and /orders/:id (`match`). Read-only.
 *
 * @throws {WebToolError} `invalid_input` when there is no order with that id.
 */
export const trackOrder = defineWebTool({
  id: 'track_order',
  title: 'Track order',
  description:
    'Where one order is: its status, when it was placed and when it arrives, and what it contains. On the orders pages only: go_to orders first. ' +
    'Take the id from list_orders. Next: reorder.',
  match: ['/orders', '/orders/:id'],
  readOnly: true,
  inputSchema: z.object({ orderId: z.string().describe("The order's id, e.g. 1012") }),
  execute: ({ orderId }) => {
    const order = getOrder(orderId.replace('#', ''))
    if (!order) throw new WebToolError('invalid_input', `No order "${orderId}". Try list_orders.`)
    const s = summarizeOrder(order)
    const when = formatDate(order.arrives, { weekday: 'long', month: 'long', day: 'numeric' })
    return {
      ...s,
      summary:
        order.status === 'delivered'
          ? `Order ${order.id} was delivered on ${when}.`
          : order.status === 'cancelled'
            ? `Order ${order.id} was cancelled.`
            : `Order ${order.id} is ${order.status} and arrives ${when}.`,
    }
  },
})
