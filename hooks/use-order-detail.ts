'use client'

import type { Order, OrderStatus } from '@/lib/data/types'
import {
  formatDate,
  formatPrice,
  formatVariant,
  getProduct,
} from '@/lib/queries'
import { useOrders, useOrdersStore } from '@/lib/stores/orders'
import { useHasHydrated } from '@/lib/stores/persist'

/** The delivery progress steps, in order. A cancelled order reaches none of them. */
const STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'processing', label: 'Order placed' },
  { status: 'shipped', label: 'Shipped' },
  { status: 'delivered', label: 'Delivered' },
]

/** Where a progress step stands against the order's status. */
export type StepState = 'done' | 'current' | 'upcoming'

/**
 * One order's page: its progress through delivery, items and totals.
 *
 * @param id - The order id from the URL, e.g. `"1014"`.
 * @returns `loading` until the orders store has hydrated, `missing` when there is no such order, else `found` with the
 * order's dates, progress steps, items and money (see {@link OrderDetailModel}).
 */
export function useOrderDetail(id: string): OrderDetailModel {
  const orders = useOrders()
  const ready = useHasHydrated(useOrdersStore)
  const order = orders.find((o) => o.id === id)

  if (!order) return ready ? { state: 'missing', id } : { state: 'loading', id }
  return { state: 'found', ...toOrderDetail(order) }
}

/** What {@link useOrderDetail} returns: still loading, no such order, or the order ready to render. */
export type OrderDetailModel =
  | { state: 'loading'; id: string }
  | { state: 'missing'; id: string }
  | ({ state: 'found' } & ReturnType<typeof toOrderDetail>)

/**
 * One order, shaped for its own page.
 *
 * @param order - The order.
 * @returns Its id and status, formatted placed and arrival dates, each {@link STEPS} step with its {@link StepState},
 * the items (those whose product no longer exists are left out), and formatted subtotal, shipping and total.
 */
function toOrderDetail(order: Order) {
  const reached = STEPS.findIndex((s) => s.status === order.status)

  return {
    id: order.id,
    status: order.status,
    cancelled: order.status === 'cancelled',
    placed: formatDate(order.placedAt, {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    city: order.city,
    arrival: {
      label: order.status === 'delivered' ? 'Delivered on' : 'Arrives',
      date: formatDate(order.arrives, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    },
    steps: STEPS.map((s, i) => ({
      status: s.status,
      label: s.label,
      state: (i < reached
        ? 'done'
        : i === reached
          ? 'current'
          : 'upcoming') as StepState,
    })),
    items: order.items.flatMap((i, idx) => {
      const p = getProduct(i.productId)
      if (!p) return []
      return [
        {
          key: `${idx}-${p.id}`,
          name: p.name,
          image: p.image,
          href: `/product/${p.slug}`,
          variant: formatVariant(i, 'One size'),
          quantity: i.quantity,
          unitPrice: formatPrice(i.unitPrice),
        },
      ]
    }),
    subtotal: formatPrice(order.subtotal),
    shipping: order.shipping === 0 ? 'Free' : formatPrice(order.shipping),
    total: formatPrice(order.total),
  }
}

/** An order that was found, ready to render. */
export type FoundOrderModel = Extract<OrderDetailModel, { state: 'found' }>
/** One step of an order's delivery progress. */
export type OrderStepModel = FoundOrderModel['steps'][number]
/** One item of an order, as its page renders it. */
export type OrderItemModel = FoundOrderModel['items'][number]
