import type { Product } from '@/lib/data/types'
import { MAX_LINE_QUANTITY } from '@/lib/stores/cart'
import { z } from 'zod'

/** What the purchase form holds. */
export interface PurchaseValues {
  color?: string
  size?: string
  quantity: number
}

/**
 * The product page's purchase form: a size is required when the product comes in sizes, and the quantity is a whole
 * number from 1 to {@link MAX_LINE_QUANTITY}.
 *
 * @param product - The product on the page; only its sizes matter.
 * @returns A schema whose size error reads "Choose a size, then add to cart."
 */
export function purchaseFormSchema(product: Pick<Product, 'sizes'>) {
  return z
    .object({
      color: z.string().optional(),
      size: z.string().optional(),
      quantity: z.number().int().min(1).max(MAX_LINE_QUANTITY),
    })
    .refine((v) => product.sizes.length === 0 || Boolean(v.size), {
      path: ['size'],
      message: 'Choose a size, then add to cart.',
    }) satisfies z.ZodType<PurchaseValues>
}

/**
 * The `add_to_cart` agent tool's input. Everything is optional: what the agent leaves out comes from the form.
 */
export const addToCartToolSchema = z.object({
  color: z
    .string()
    .optional()
    .describe('A color the product comes in, e.g. "Black". Ask the person if they did not say.'),
  size: z
    .string()
    .optional()
    .describe('A size the product comes in, e.g. "M" or "42". Ask the person if they did not say.'),
  quantity: z
    .number()
    .int()
    .min(1)
    .max(MAX_LINE_QUANTITY)
    .optional()
    .describe('How many to add. Defaults to 1.'),
})

/** What an agent passes to `add_to_cart`. */
export type AddToCartInput = z.infer<typeof addToCartToolSchema>
