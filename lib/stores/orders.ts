'use client'

import { seedOrders, shippingFor } from '@/lib/data/orders'
import type { CartLine, Order } from '@/lib/data/types'
import { TODAY, addDays, getProduct } from '@/lib/queries'
import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useCartStore } from './cart'
import { browserStorage } from './persist'

/** Orders placed in this browser, and placing a new one. */
export interface OrdersState {
  /** Orders placed in this browser, newest first. The seeded history is not in here: see {@link getOrders}. */
  placed: Order[]
  /**
   * Turn cart lines into a new `processing` order, priced at today's prices, and save it.
   *
   * @param lines - What to order; usually the whole cart.
   * @param city - The delivery city.
   * @returns The new order. Its id is one more than the highest id so far (at least 1001).
   */
  placeOrder: (lines: CartLine[], city: string) => Order
}

/**
 * Orders placed in this browser, saved to localStorage.
 *
 * @remarks Created with `skipHydration`: see {@link useRehydrateStores} and `useHasHydrated`.
 */
export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      placed: [],
      placeOrder: (lines, city) => {
        const items = lines.map((l) => ({
          productId: l.productId,
          color: l.color,
          size: l.size,
          quantity: l.quantity,
          unitPrice: getProduct(l.productId)?.price ?? 0,
        }))
        const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
        const shipping = shippingFor(subtotal)
        const nextId = String(Math.max(1000, ...getOrders().map((o) => Number(o.id))) + 1)
        const order: Order = {
          id: nextId,
          placedAt: `${TODAY}T${new Date().toTimeString().slice(0, 8)}`,
          status: 'processing',
          items,
          subtotal,
          shipping,
          total: subtotal + shipping,
          arrives: addDays(TODAY, 5),
          city,
        }
        set((s) => ({ placed: [order, ...s.placed] }))
        return order
      },
    }),
    {
      // v2: zustand's `{ state, version }` envelope; v1 was the bare array.
      name: 'shop:orders:v2',
      storage: browserStorage,
      partialize: ({ placed }) => ({ placed }),
      skipHydration: true,
    },
  ),
)

const withSeed = (placed: Order[]) => [...placed, ...seedOrders]

/**
 * Every order, for components: this browser's, then the seeded history.
 *
 * @returns A list that keeps its identity until an order is placed, so it is safe as a memo dependency.
 */
export function useOrders(): Order[] {
  const placed = useOrdersStore((s) => s.placed)
  return useMemo(() => withSeed(placed), [placed])
}

/**
 * Every order, outside React (agent tools): this browser's, then the seeded history.
 *
 * @returns A new array on each call.
 */
export const getOrders = (): Order[] => withSeed(useOrdersStore.getState().placed)

/**
 * Look up one order.
 *
 * @param id - The order id without "#", e.g. `"1012"`.
 * @returns The order, or `undefined` when there is none with that id.
 */
export const getOrder = (id: string): Order | undefined => getOrders().find((o) => o.id === id)

/**
 * Put an old order's items back in the cart. Shared by the Reorder buttons and the `reorder` tool.
 *
 * @param order - The order to repeat. Cancelled orders are not checked here: callers decide.
 * @returns A sentence for the agent saying what was added and what to do next.
 */
export function reorderItems(order: Order): string {
  const { addLine } = useCartStore.getState()
  for (const i of order.items) addLine({ productId: i.productId, color: i.color, size: i.size, quantity: i.quantity })
  return `Added the ${order.items.reduce((n, i) => n + i.quantity, 0)} items from order ${order.id} to the cart. Next: go_to checkout.`
}
