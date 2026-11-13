'use client'

import type { Product } from '@/lib/data/types'
import { formatDate, getCategory, productFlags, swatchTakesDarkMark } from '@/lib/queries'
import {
  type AddToCartInput,
  addToCartToolSchema,
  purchaseFormSchema,
  type PurchaseValues,
} from '@/lib/schemas/purchase'
import { MAX_LINE_QUANTITY, useCartStore } from '@/lib/stores/cart'
import { resolveVariant } from '@/lib/variants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useWebTool } from '@webmcp-agents/react'
import { type BaseSyntheticEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

/** How long the button reads "Added" before it returns to "Add to cart". */
const ADDED_FOR_MS = 1800

/**
 * Bring a typed or stepped quantity back into range.
 *
 * @param n - Any number, including `NaN` from an emptied number input.
 * @returns A whole number from 1 to {@link MAX_LINE_QUANTITY}; 1 for `NaN` or infinities.
 */
export const clampQuantity = (n: number) =>
  Math.min(MAX_LINE_QUANTITY, Math.max(1, Number.isFinite(n) ? Math.round(n) : 1))

/**
 * The product page: the purchase form (react-hook-form, validated by {@link purchaseFormSchema}), adding to the cart,
 * and the `add_to_cart` agent tool.
 *
 * @param product - The product on the page.
 * @returns The page's model: labels for the summary, the form with its color and size options, `submit`, and
 * whether something was just added.
 */
export function useProductPurchase(product: Product) {
  const schema = useMemo(() => purchaseFormSchema(product), [product])
  const form = useForm<PurchaseValues>({
    resolver: zodResolver(schema),
    defaultValues: { color: product.colors[0]?.name, size: undefined, quantity: 1 },
  })
  const [color, size] = useWatch({ control: form.control, name: ['color', 'size'] })
  const [added, setAdded] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  /**
   * Add the chosen variant to the cart and flash "Added" on the button.
   *
   * @param input - Values that override the form's (an agent's call); the form fills in the rest.
   * @returns A sentence for the agent saying what was added and what to do next.
   * @throws {WebToolError} `invalid_input` from {@link resolveVariant} when the color or size is missing or unknown.
   */
  const add = (input: AddToCartInput) => {
    const current = form.getValues()
    const v = resolveVariant(product, input.color ?? current.color, input.size ?? current.size)
    const qty = input.quantity ?? current.quantity
    useCartStore.getState().addLine({ productId: product.id, color: v.color, size: v.size, quantity: qty })
    form.clearErrors()
    setAdded(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setAdded(false), ADDED_FOR_MS)
    return `Added ${qty} × ${product.name}${v.color ? `, ${v.color}` : ''}${v.size ? `, size ${v.size}` : ''} to the cart. Next: get_cart, or go_to cart.`
  }

  // An agent calls this: the cursor types the quantity, `fill` shows the color and size, then it presses the button.
  useWebTool({
    id: 'add_to_cart',
    title: 'Add to cart',
    description:
      `Add ${product.name} to the cart, in a color, size and quantity. On this product's page only: open it with open_product first. ` +
      `Colors: ${product.colors.map((c) => c.name).join(', ')}. ` +
      (product.sizes.length ? `Sizes: ${product.sizes.join(', ')}. ` : 'One size. ') +
      'Ask the person for a color or size they did not give. Next: get_cart, or go_to cart.',
    inputSchema: addToCartToolSchema,
    fill: (v) => {
      // Show the agent's values in the page's own spelling ("camel" -> "Camel") so the right swatch lights up.
      const c = product.colors.find((x) => x.name.toLowerCase() === v.color?.trim().toLowerCase())
      const sz = product.sizes.find((x) => x.toLowerCase() === v.size?.trim().toLowerCase())
      if (c) form.setValue('color', c.name)
      if (sz) form.setValue('size', sz, { shouldValidate: form.formState.isSubmitted })
      if (v.quantity) form.setValue('quantity', clampQuantity(v.quantity))
    },
    execute: add,
  })

  /** The form's submit handler: validates (a size is required), then adds; a failed add shows as the root error. */
  const submit = (e?: BaseSyntheticEvent) =>
    form.handleSubmit(() => {
      try {
        add({})
      } catch (err) {
        form.setError('root', {
          message: err instanceof Error ? err.message : 'Could not add to cart. Try again.',
        })
      }
    })(e)

  const flags = productFlags(product)
  const category = getCategory(product.category)

  return {
    category: category && { name: category.name, href: `/shop?category=${category.slug}` },
    discount: flags.discount,
    stockLabel: flags.lowStock ? `Only ${product.stock} left` : 'In stock',
    addedOn: formatDate(product.addedAt),
    rating: product.rating.toFixed(1),

    /** The react-hook-form instance; the pickers bind to `form.control`. */
    form,
    colors: product.colors.map((c) => ({ name: c.name, hex: c.hex, darkMark: swatchTakesDarkMark(c.hex) })),
    selectedColor: color,
    sizes: product.sizes,
    selectedSize: size,
    quantityBounds: { min: 1, max: MAX_LINE_QUANTITY },

    submit,
    added,
    /** The size error, else why adding failed; empty when there is nothing to say. */
    error: form.formState.errors.size?.message ?? form.formState.errors.root?.message ?? '',
  }
}

/** What {@link useProductPurchase} returns. */
export type ProductPurchaseModel = ReturnType<typeof useProductPurchase>
