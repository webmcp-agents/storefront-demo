'use client'

import { useUrlSyncedFilters } from '@/hooks/use-url-synced-filters'
import type { Order } from '@/lib/data/types'
import {
  ORDER_SORTS,
  ORDER_STATUSES,
  TODAY,
  addDays,
  countActiveOrderFilters,
  emptyOrderFilters,
  filterOrders,
  formatDate,
  formatPrice,
  formatVariant,
  getProduct,
  orderFiltersToParams,
  parseOrderFilters,
  type OrderSort,
} from '@/lib/queries'
import { showOrderFilters, useOrderFiltersStore } from '@/lib/stores/filters'
import { getOrder, reorderItems, useOrders } from '@/lib/stores/orders'
import { whenElement } from '@/lib/when-element'
import { WebToolError } from '@webmcp-agents/core'
import { useWebTool } from '@webmcp-agents/react'
import { useMemo } from 'react'
import { z } from 'zod'

/**
 * The `reorder` tool's input. An unknown or cancelled order is turned away here, before the tool looks for a button
 * for the person to confirm on (there is none for those), so the agent hears why instead of a confirmation failure.
 */
const reorderSchema = z
  .object({ orderId: z.string().describe('The order id from list_orders, e.g. "1008"') })
  .superRefine(({ orderId }, ctx) => {
    const order = getOrder(orderId)
    if (!order) ctx.addIssue({ code: 'custom', message: `No order "${orderId}". Try list_orders.` })
    else if (order.status === 'cancelled')
      ctx.addIssue({ code: 'custom', message: `Order ${orderId} was cancelled; reorder a delivered one.` })
  })

/** The "placed" date shortcuts: each sets a start date and no end date. */
const DATE_PRESETS = [
  { label: 'Last 30 days', from: addDays(TODAY, -30) },
  { label: 'Last 90 days', from: addDays(TODAY, -90) },
  { label: 'This year', from: `${TODAY.slice(0, 4)}-01-01` },
]

/** A number field's text as a filter amount: empty means no limit. */
const amount = (raw: string) => (raw === '' ? undefined : Number(raw))
/** "Nov 12" from an ISO date. */
const shortDate = (iso: string) =>
  formatDate(iso, { month: 'short', day: 'numeric' })

/**
 * One order, shaped for its card in the list.
 *
 * @param order - The order.
 * @returns Its id, status, link, formatted total, a "Placed … · Arrives …" line, the items (those whose product no
 * longer exists are left out), and `reorder`, which puts every item back in the cart (`canReorder` is false for a
 * cancelled order).
 */
function toOrderCard(order: Order) {
  const timing =
    order.status === 'delivered'
      ? ` · Delivered ${shortDate(order.arrives)}`
      : order.status === 'cancelled'
        ? ''
        : ` · Arrives ${shortDate(order.arrives)}`
  return {
    id: order.id,
    status: order.status,
    href: `/orders/${order.id}`,
    total: formatPrice(order.total),
    meta: `Placed ${formatDate(order.placedAt, { month: 'short', day: 'numeric', year: 'numeric' })}${timing}`,
    items: order.items.flatMap((i, idx) => {
      const p = getProduct(i.productId)
      return p
        ? [
            {
              key: `${idx}-${p.id}`,
              name: p.name,
              image: p.image,
              quantity: i.quantity,
              variant: formatVariant(i),
            },
          ]
        : []
    }),
    canReorder: order.status !== 'cancelled',
    reorder: () => reorderItems(order),
  }
}

/** One order's card in the /orders list. */
export type OrderCardModel = ReturnType<typeof toOrderCard>

/**
 * The /orders page: filters mirrored to the URL, matching orders, totals, and the `reorder` agent tool.
 *
 * @returns The page's model: the matching orders as cards, the result count and amount spent (cancelled orders
 * excluded), and every filter control (status pills, placed dates and presets, product words, total range, sort) with
 * its value and setter.
 */
export function useOrdersPage() {
  const filters = useUrlSyncedFilters(
    useOrderFiltersStore,
    parseOrderFilters,
    orderFiltersToParams,
  )
  const { patch: set, reset } = useOrderFiltersStore.getState()
  const orders = useOrders()
  const results = useMemo(
    () => filterOrders(filters, orders),
    [filters, orders],
  )

  // Agent tool: put every item of a past (not cancelled) order back in the cart, once the person confirms.
  useWebTool({
    id: 'reorder',
    title: 'Reorder',
    description:
      'Put every item of a past order back in the cart. Use after list_orders, which gives the order id. The person confirms on the page. Next: go_to cart or checkout.',
    inputSchema: reorderSchema,
    requireConfirmation: true,
    // The order's own button. Filtered out of the list? Clear the filters so it shows, then park on it. (The schema
    // has already turned away unknown and cancelled orders, which have no button to confirm on.)
    target: async ({ orderId }) => {
      const button = `button[aria-label="Reorder order ${orderId}"]`
      if (!document.querySelector(button)) showOrderFilters(emptyOrderFilters)
      return whenElement(button, 1000)
    },
    execute: ({ orderId }) => {
      const order = getOrder(orderId)
      if (!order) throw new WebToolError('invalid_input', `No order "${orderId}". Try list_orders.`)
      return reorderItems(order)
    },
  })

  const spent = results
    .filter((o) => o.status !== 'cancelled')
    .reduce((s, o) => s + o.total, 0)

  return {
    hasOrders: orders.length > 0,
    orders: results.map(toOrderCard),
    resultCount: results.length,
    resultNoun: results.length === 1 ? 'order' : 'orders',
    spent: results.length > 0 ? formatPrice(spent) : null,
    activeCount: countActiveOrderFilters(filters),
    clearAll: reset,

    statuses: ORDER_STATUSES.map((s) => {
      const pressed = filters.statuses.includes(s)
      return {
        key: s,
        label: s,
        pressed,
        toggle: () =>
          set({
            statuses: pressed
              ? filters.statuses.filter((x) => x !== s)
              : [...filters.statuses, s],
          }),
      }
    }),

    dates: {
      max: TODAY,
      from: filters.from ?? '',
      to: filters.to ?? '',
      setFrom: (v: string) => set({ from: v || undefined }),
      setTo: (v: string) => set({ to: v || undefined }),
      presets: DATE_PRESETS.map((p) => {
        const pressed = filters.from === p.from && !filters.to
        return {
          key: p.label,
          label: p.label,
          pressed,
          toggle: () =>
            set({ from: pressed ? undefined : p.from, to: undefined }),
        }
      }),
    },

    product: {
      value: filters.product,
      set: (v: string) => set({ product: v }),
    },

    totals: {
      min: filters.minTotal ?? '',
      max: filters.maxTotal ?? '',
      setMin: (raw: string) => set({ minTotal: amount(raw) }),
      setMax: (raw: string) => set({ maxTotal: amount(raw) }),
    },

    sort: filters.sort,
    sortOptions: ORDER_SORTS,
    setSort: (v: string) => set({ sort: v as OrderSort }),
  }
}

/** What {@link useOrdersPage} returns. */
export type OrdersPageModel = ReturnType<typeof useOrdersPage>
