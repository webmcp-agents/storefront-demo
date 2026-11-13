import { defineWebTool } from '@webmcp-agents/core'
import { z } from 'zod'
import {
  ORDER_SORTS,
  ORDER_STATUSES,
  emptyOrderFilters,
  filterOrders,
  isIsoDate,
  summarizeOrder,
  type OrderFilters,
} from '@/lib/queries'
import { showOrderFilters } from '@/lib/stores/filters'
import { whenElement } from '@/lib/when-element'
import { getOrders } from '@/lib/stores/orders'

const sorts = ORDER_SORTS.map((s) => s.value) as [string, ...string[]]

/** The filter panel on /orders (an order's own page has none: the call just answers). */
const ORDER_FILTERS = 'section[aria-label="Order filters"]'

/**
 * The tool's input. The checks run here, not in `execute`: the tool validates before the cursor moves, so a bad call
 * is rejected before anything is typed into the panel (typing a date or total there applies it at once).
 */
const inputSchema = z
  .object({
    statuses: z.array(z.enum(ORDER_STATUSES as [string, ...string[]])).optional().describe('Any of processing, shipped, delivered, cancelled'),
    placed_after: z.string().optional().describe('Placed on or after this date, YYYY-MM-DD, e.g. "2026-03-01"'),
    placed_before: z.string().optional().describe('Placed on or before this date, YYYY-MM-DD, e.g. "2026-03-31"'),
    product: z.string().optional().describe('Words from a product in the order, e.g. "jacket" or "Chelsea boots"'),
    min_total: z.number().min(0).optional().describe('Lowest order total in dollars'),
    max_total: z.number().min(0).optional().describe('Highest order total in dollars'),
    sort: z.enum(sorts).optional().describe('newest, oldest, total-desc or total-asc'),
    limit: z.number().int().min(1).max(30).optional().describe('How many orders to return. Defaults to 10.'),
  })
  .superRefine((i, ctx) => {
    const fail = (message: string) => ctx.addIssue({ code: 'custom', message })
    if (i.placed_after && !isIsoDate(i.placed_after)) fail(`placed_after must be YYYY-MM-DD, got "${i.placed_after}".`)
    if (i.placed_before && !isIsoDate(i.placed_before)) fail(`placed_before must be YYYY-MM-DD, got "${i.placed_before}".`)
    if (i.placed_after && i.placed_before && i.placed_after > i.placed_before) fail('placed_after is later than placed_before.')
    if (i.min_total !== undefined && i.max_total !== undefined && i.min_total > i.max_total) fail('min_total is higher than max_total.')
  })

/**
 * `list_orders`: filter past orders by status, placed dates, product words and total, show the result on /orders, and
 * answer with the match count, the amount spent (cancelled orders excluded) and up to `limit` (default 10) summaries.
 * Filters left out are cleared; the sort defaults to newest.
 *
 * On /orders and /orders/:id (`match`); on an order's own page it only answers.
 *
 * Rejects a call (before the cursor moves) whose `placed_after` or `placed_before` isn't YYYY-MM-DD, whose
 * `placed_after` is later than `placed_before`, or whose `min_total` is higher than `max_total`.
 */
export const listOrders = defineWebTool({
  id: 'list_orders',
  title: 'List orders',
  description:
    'List past orders and show them on the orders page, filtered by status, the date they were placed, a product they contain and their total. Newest first by default. ' +
    'Answers with id, date, status, total, arrival date and items. Filters left out are cleared. On the orders pages only: go_to orders first. ' +
    'Dates are YYYY-MM-DD: call get_time to turn "last month" or "in March" into dates. Next: track_order, or reorder.',
  match: ['/orders', '/orders/:id'],
  // Right after go_to orders the page may still be loading: wait for the panel, then the cursor types the dates,
  // product and totals there, and the status pills change as it presses.
  target: () => (window.location.pathname === '/orders' ? whenElement(ORDER_FILTERS) : null),
  fields: {
    placed_after: { name: 'Placed from', within: ORDER_FILTERS },
    placed_before: { name: 'Placed to', within: ORDER_FILTERS },
    min_total: { name: 'Min total', within: ORDER_FILTERS },
    max_total: { name: 'Max total', within: ORDER_FILTERS },
    limit: false,
  },
  inputSchema,
  execute: (i) => {
    const next: OrderFilters = {
      ...emptyOrderFilters,
      statuses: (i.statuses ?? []) as OrderFilters['statuses'],
      from: i.placed_after,
      to: i.placed_before,
      product: i.product ?? '',
      minTotal: i.min_total,
      maxTotal: i.max_total,
      sort: (i.sort as OrderFilters['sort']) ?? 'newest',
    }
    showOrderFilters(next)
    const results = filterOrders(next, getOrders())
    return {
      total: results.length,
      spentExcludingCancelled: results.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
      orders: results.slice(0, i.limit ?? 10).map(summarizeOrder),
    }
  },
})
