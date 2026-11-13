'use client'

import type { Order } from '@/lib/data/types'
import { formatDate, formatPrice, formatVariant, getProduct } from '@/lib/queries'
import { type DeliveryDetails, deliveryDetailsSchema, EMPTY_DELIVERY_DETAILS } from '@/lib/schemas/checkout'
import { cartTotals, lineKey, useCartStore } from '@/lib/stores/cart'
import { useOrdersStore } from '@/lib/stores/orders'
import { useHasHydrated } from '@/lib/stores/persist'
import { zodResolver } from '@hookform/resolvers/zod'
import { WebToolError } from '@webmcp-agents/core'
import { useWebTool } from '@webmcp-agents/react'
import { type HTMLInputTypeAttribute, useState } from 'react'
import { useForm } from 'react-hook-form'

/** One delivery field's label and input hints. Validation messages live in {@link deliveryDetailsSchema}. */
export interface DeliveryFieldSpec {
  name: keyof DeliveryDetails
  label: string
  type: HTMLInputTypeAttribute
  autoComplete: string
}

/** The delivery form's fields, in order. */
const DELIVERY_FIELDS: DeliveryFieldSpec[] = [
  { name: 'fullName', label: 'Full name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'address', label: 'Street address', type: 'text', autoComplete: 'street-address' },
  { name: 'city', label: 'City', type: 'text', autoComplete: 'address-level2' },
]

/**
 * The checkout page: the delivery form (react-hook-form, validated by {@link deliveryDetailsSchema}), placing the
 * order, and the `place_order` agent tool.
 *
 * @returns The page's model: whether the cart has loaded, the form and its fields, the order summary, and the placed
 * order once there is one.
 */
export function useCheckout() {
  const lines = useCartStore((s) => s.lines)
  const ready = useHasHydrated(useCartStore)
  const totals = cartTotals(lines)
  const [placed, setPlaced] = useState<Order | null>(null)

  const form = useForm<DeliveryDetails>({
    resolver: zodResolver(deliveryDetailsSchema),
    defaultValues: EMPTY_DELIVERY_DETAILS,
  })

  /**
   * Place the order for the whole cart, then empty the cart.
   *
   * @param input - Valid delivery details.
   * @returns A sentence for the agent with the order id, total and arrival date.
   * @throws {WebToolError} `invalid_input` when the cart is empty.
   */
  const place = (input: DeliveryDetails) => {
    const cart = useCartStore.getState()
    if (cart.lines.length === 0)
      throw new WebToolError('invalid_input', 'The cart is empty. Add something first with add_to_cart.')
    const order = useOrdersStore.getState().placeOrder(cart.lines, input.city)
    cart.clear()
    setPlaced(order)
    return `Order ${order.id} placed: ${formatPrice(order.total)}, arriving ${formatDate(order.arrives)}. Next: go_to orders, then track_order.`
  }

  useWebTool({
    id: 'place_order',
    title: 'Place order',
    description:
      'Place the order for everything in the cart with delivery details. Checkout page only: go_to checkout first. ' +
      'Take the name, email, address and city from who_am_i unless the person gives others; never invent them. The person confirms on the page. Next: track_order.',
    inputSchema: deliveryDetailsSchema,
    // Show the agent's details in the form (and drop stale errors) before the person confirms.
    fill: (values) => form.reset({ ...form.getValues(), ...values }),
    requireConfirmation: true,
    execute: place,
  })

  return {
    ready,
    isEmpty: lines.length === 0,
    /** The react-hook-form instance; fields bind to `form.control`. */
    form,
    fields: DELIVERY_FIELDS,
    /** The form's submit handler: validates, then places the order. Invalid fields get focus and their errors. */
    submit: form.handleSubmit(place),
    total: formatPrice(totals.total),
    shipping: totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping),
    items: lines.flatMap((l) => {
      const p = getProduct(l.productId)
      if (!p) return []
      return [
        {
          key: lineKey(l),
          name: p.name,
          image: p.image,
          variant: formatVariant(l),
          quantity: l.quantity,
          lineTotal: formatPrice(p.price * l.quantity),
        },
      ]
    }),
    placed: placed && {
      id: placed.id,
      href: `/orders/${placed.id}`,
      total: formatPrice(placed.total),
      arrives: formatDate(placed.arrives),
    },
  }
}

/** What {@link useCheckout} returns. */
export type CheckoutModel = ReturnType<typeof useCheckout>
/** A placed order, as the confirmation shows it. */
export type PlacedOrderModel = NonNullable<CheckoutModel['placed']>
