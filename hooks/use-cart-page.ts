'use client'

import { FREE_SHIPPING_OVER } from '@/lib/data/orders'
import type { CartLine } from '@/lib/data/types'
import { formatPrice, formatVariant, getProduct } from '@/lib/queries'
import { MAX_LINE_QUANTITY, cartTotals, lineKey, useCartStore } from '@/lib/stores/cart'
import { useHasHydrated } from '@/lib/stores/persist'
import { WebToolError } from '@webmcp-agents/core'
import { useWebTool } from '@webmcp-agents/react'
import { useState } from 'react'
import { z } from 'zod'

/** The last removal, kept until the person undoes or dismisses it. */
type Notice = { message: string; undo: () => void }

/**
 * The product name of a cart line, read from the store now (not a render's snapshot).
 *
 * @param lineId - The line's {@link lineKey}.
 * @returns The product's name, or undefined when there is no such line or its product no longer exists.
 */
const nameOf = (lineId: string) => {
  const line = useCartStore.getState().lines.find((l) => lineKey(l) === lineId)
  return line ? getProduct(line.productId)?.name : undefined
}

/**
 * The product name of a cart line an agent named, checked.
 *
 * @param lineId - The line's {@link lineKey}, as `get_cart` lists it.
 * @returns The product's name.
 * @throws {WebToolError} `invalid_input` when there is no such line (or its product no longer exists).
 */
const requireLine = (lineId: string) => {
  const name = nameOf(lineId)
  if (!name)
    throw new WebToolError(
      'invalid_input',
      `No cart line "${lineId}". Call get_cart and use a lineId from it.`,
    )
  return name
}

/**
 * The cart page: lines ready to render, totals, free-shipping progress, actions with undo, and the cart's agent tools.
 *
 * @returns The page's model: whether the cart has loaded, the lines with their quantity actions, the item count, the
 * money summary, free-shipping progress, `clear`, and the undo notice for the last removal, if any.
 */
export function useCartPage() {
  const lines = useCartStore((s) => s.lines)
  const ready = useHasHydrated(useCartStore)
  const { setLineQuantity, removeLine, restoreLine, restoreLines, clear: clearCart } = useCartStore.getState()
  const [notice, setNotice] = useState<Notice | null>(null)
  const totals = cartTotals(lines)

  /**
   * Remove one line and offer to undo it (the line goes back where it was). An unknown line is a no-op.
   *
   * @param lineId - The line's {@link lineKey}.
   */
  const remove = (lineId: string) => {
    const current = useCartStore.getState().lines
    const index = current.findIndex((l) => lineKey(l) === lineId)
    if (index === -1) return
    const line = current[index]
    const name = getProduct(line.productId)?.name ?? 'Item'
    removeLine(lineId)
    setNotice({
      message: `Removed ${name}.`,
      undo: () => restoreLine(line, index),
    })
  }

  /** Empty the cart and offer to undo it (every line comes back). An empty cart is a no-op. */
  const clear = () => {
    const snapshot: CartLine[] = useCartStore.getState().lines
    if (!snapshot.length) return
    clearCart()
    setNotice({
      message: 'Your cart was cleared.',
      undo: () => restoreLines(snapshot),
    })
  }

  // Agent tool: set one line's quantity (1 to MAX_LINE_QUANTITY); the cursor points at that line's Increase or
  // Decrease button, whichever way the quantity moves.
  useWebTool({
    id: 'update_cart_item',
    title: 'Change quantity',
    description:
      'Change how many of one cart line you want, 1 to 10. Use after get_cart, which lists each line and its lineId. Next: get_cart, or go_to checkout.',
    inputSchema: z.object({
      lineId: z
        .string()
        .describe('The lineId from get_cart, e.g. "p01|Camel|M"'),
      quantity: z
        .number()
        .int()
        .min(1)
        .max(MAX_LINE_QUANTITY)
        .describe('The new quantity, e.g. 2'),
    }),
    target: ({ lineId, quantity }) => {
      const current = useCartStore.getState().lines.find((l) => lineKey(l) === lineId)?.quantity ?? 0
      return {
        role: 'button',
        name: `${quantity < current ? 'Decrease' : 'Increase'} quantity of ${nameOf(lineId) ?? ''}`,
      }
    },
    execute: ({ lineId, quantity }) => {
      const name = requireLine(lineId)
      setLineQuantity(lineId, quantity)
      return `${name} is now quantity ${quantity}.`
    },
  })

  // Agent tool: remove one line, with the same undo notice as the page's Remove button.
  useWebTool({
    id: 'remove_from_cart',
    title: 'Remove from cart',
    description:
      'Remove one line from the cart. Use after get_cart, which lists each lineId. Next: get_cart.',
    inputSchema: z.object({
      lineId: z
        .string()
        .describe('The lineId from get_cart, e.g. "p01|Camel|M"'),
    }),
    target: ({ lineId }) => ({
      role: 'button',
      name: `Remove ${nameOf(lineId) ?? ''}`,
    }),
    execute: ({ lineId }) => {
      const name = requireLine(lineId)
      remove(lineId)
      return `Removed ${name} from the cart.`
    },
  })

  // Agent tool: empty the cart once the person confirms, with the same undo notice as the page's Clear button.
  useWebTool({
    id: 'clear_cart',
    title: 'Clear cart',
    description:
      'Empty the whole cart. Use only when the person asks to start over. The person confirms on the page.',
    destructive: true,
    requireConfirmation: true,
    execute: () => {
      clear()
      return 'The cart is empty.'
    },
  })

  const items = lines.flatMap((l) => {
    const p = getProduct(l.productId)
    if (!p) return []
    const key = lineKey(l)
    return [
      {
        key,
        product: p,
        href: `/product/${p.slug}`,
        variant: formatVariant(l, 'One size'),
        quantity: l.quantity,
        lineTotal: formatPrice(p.price * l.quantity),
        canDecrease: l.quantity > 1,
        canIncrease: l.quantity < MAX_LINE_QUANTITY,
        decrease: () => setLineQuantity(key, l.quantity - 1),
        increase: () => setLineQuantity(key, l.quantity + 1),
        remove: () => remove(key),
      },
    ]
  })

  const toFree = Math.max(0, FREE_SHIPPING_OVER - totals.subtotal)

  return {
    ready,
    isEmpty: lines.length === 0,
    items,
    count: totals.count,
    summary: {
      subtotal: formatPrice(totals.subtotal),
      shipping: totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping),
      total: formatPrice(totals.total),
    },
    freeShipping: {
      remaining: toFree > 0 ? formatPrice(toFree) : null,
      progress: Math.min(
        100,
        Math.round((totals.subtotal / FREE_SHIPPING_OVER) * 100),
      ),
    },
    clear,
    /** The undo notice for the last removal or clear, or null. */
    notice: notice && {
      message: notice.message,
      /** Put back what was removed, then hide the notice. */
      undo: () => {
        notice.undo()
        setNotice(null)
      },
      dismiss: () => setNotice(null),
    },
  }
}

/** What {@link useCartPage} returns. */
export type CartPageModel = ReturnType<typeof useCartPage>
/** One cart line, as the cart page renders it. */
export type CartItemModel = CartPageModel['items'][number]
/** The undo notice for the last removal or clear, or null. */
export type CartNotice = CartPageModel['notice']
