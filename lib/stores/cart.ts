'use client'

import { shippingFor } from '@/lib/data/orders'
import type { CartLine } from '@/lib/data/types'
import { getProduct } from '@/lib/queries'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { browserStorage } from './persist'

/** The most of one line (product + color + size) the cart holds. */
export const MAX_LINE_QUANTITY = 10

const clampQuantity = (quantity: number) => Math.min(quantity, MAX_LINE_QUANTITY)

/**
 * A cart line's stable id: product, color and size, so the same variant added twice is one line.
 *
 * @param line - The line, or just the fields that identify it.
 * @returns `"<productId>|<color>|<size>"`, with empty parts for a missing color or size.
 * @example
 * lineKey({ productId: 'p01', color: 'Camel', size: 'M' }) // "p01|Camel|M"
 * lineKey({ productId: 'p20' }) // "p20||"
 */
export const lineKey = (line: Pick<CartLine, 'productId' | 'color' | 'size'>) =>
  `${line.productId}|${line.color ?? ''}|${line.size ?? ''}`

/** The cart's state and the actions that change it. */
export interface CartState {
  /** The lines in the order they were added. */
  lines: CartLine[]
  /**
   * Add a line, or top up the matching line (same product, color and size). Quantities cap at
   * {@link MAX_LINE_QUANTITY}.
   *
   * @param line - The variant and how many to add.
   */
  addLine: (line: CartLine) => void
  /**
   * Set one line's quantity, capped at {@link MAX_LINE_QUANTITY}. Zero or less removes the line.
   *
   * @param key - The line's {@link lineKey}.
   * @param quantity - The new quantity.
   */
  setLineQuantity: (key: string, quantity: number) => void
  /**
   * Remove one line. An unknown key is a no-op.
   *
   * @param key - The line's {@link lineKey}.
   */
  removeLine: (key: string) => void
  /** Empty the cart. */
  clear: () => void
  /**
   * Put a removed line back where it was (undo). A no-op if the line is already in the cart again.
   *
   * @param line - The removed line.
   * @param index - Where it was; clamped to the end of the cart.
   */
  restoreLine: (line: CartLine, index: number) => void
  /**
   * Replace every line (undo of {@link CartState.clear}).
   *
   * @param lines - The lines to restore.
   */
  restoreLines: (lines: CartLine[]) => void
}

/**
 * The cart, saved to localStorage. Components read it with the hook (`useCartStore((s) => s.lines)`); agent tools,
 * which live outside React, use `useCartStore.getState()`.
 *
 * @remarks Created with `skipHydration`: see {@link useRehydrateStores} and `useHasHydrated`.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      addLine: (line) =>
        set(({ lines }) => {
          const key = lineKey(line)
          const hit = lines.find((l) => lineKey(l) === key)
          return {
            lines: hit
              ? lines.map((l) => (l === hit ? { ...l, quantity: clampQuantity(l.quantity + line.quantity) } : l))
              : [...lines, { ...line, quantity: clampQuantity(line.quantity) }],
          }
        }),
      setLineQuantity: (key, quantity) =>
        set(({ lines }) => ({
          lines:
            quantity <= 0
              ? lines.filter((l) => lineKey(l) !== key)
              : lines.map((l) => (lineKey(l) === key ? { ...l, quantity: clampQuantity(quantity) } : l)),
        })),
      removeLine: (key) => set(({ lines }) => ({ lines: lines.filter((l) => lineKey(l) !== key) })),
      clear: () => set({ lines: [] }),
      restoreLine: (line, index) =>
        set(({ lines }) => {
          if (lines.some((l) => lineKey(l) === lineKey(line))) return {}
          const next = [...lines]
          next.splice(Math.min(index, next.length), 0, line)
          return { lines: next }
        }),
      restoreLines: (lines) => set({ lines }),
    }),
    {
      // v2: zustand's `{ state, version }` envelope; v1 was the bare array.
      name: 'shop:cart:v2',
      storage: browserStorage,
      partialize: ({ lines }) => ({ lines }),
      skipHydration: true,
    },
  ),
)

/**
 * The cart's money and item count.
 *
 * @param lines - Cart lines; lines whose product no longer exists count as $0.
 * @returns `subtotal`, `shipping` (see `shippingFor`), `total`, and `count` (the sum of quantities).
 */
export function cartTotals(lines: CartLine[]) {
  const subtotal = lines.reduce((sum, l) => sum + (getProduct(l.productId)?.price ?? 0) * l.quantity, 0)
  const shipping = shippingFor(subtotal)
  const count = lines.reduce((n, l) => n + l.quantity, 0)
  return { subtotal, shipping, total: subtotal + shipping, count }
}

/**
 * The cart as an agent reads it (`get_cart`): each line with the `lineId` other cart tools take, plus totals.
 *
 * @param lines - Cart lines.
 * @returns The lines with product name, slug and unit price, and the fields of {@link cartTotals}.
 */
export function describeCart(lines: CartLine[]) {
  return {
    items: lines.map((l) => {
      const p = getProduct(l.productId)
      return {
        lineId: lineKey(l),
        product: p?.name,
        slug: p?.slug,
        color: l.color,
        size: l.size,
        quantity: l.quantity,
        unitPrice: p?.price,
      }
    }),
    ...cartTotals(lines),
  }
}
