import { WebToolError } from '@webmcp-agents/core'
import type { Product } from '@/lib/data/types'

/**
 * Resolve a (possibly sloppy) color/size to the product's own spelling, or explain how to fix the call.
 *
 * Matching ignores case and surrounding spaces. A product with no colors (or no sizes) ignores that argument.
 *
 * @param product - The product being added or looked up.
 * @param color - The requested color, e.g. `"camel "`.
 * @param size - The requested size, e.g. `"m"`.
 * @returns The product's spelling of each, e.g. `{ color: 'Camel', size: 'M' }`; undefined where the product has none.
 * @throws {WebToolError} `invalid_input` when the product has colors (or sizes) and none was given, or the one given
 * isn't offered. The message lists the choices, so the agent can ask the person or retry.
 */
export function resolveVariant(product: Product, color?: string, size?: string) {
  let resolvedColor: string | undefined
  if (product.colors.length) {
    if (!color) {
      throw new WebToolError(
        'invalid_input',
        `Which color? ${product.name} comes in: ${product.colors.map((c) => c.name).join(', ')}. Ask the person.`,
      )
    }
    const hit = product.colors.find((c) => c.name.toLowerCase() === color.trim().toLowerCase())
    if (!hit) {
      throw new WebToolError(
        'invalid_input',
        `${product.name} has no color "${color}". Choose one of: ${product.colors.map((c) => c.name).join(', ')}.`,
      )
    }
    resolvedColor = hit.name
  }

  let resolvedSize: string | undefined
  if (product.sizes.length) {
    if (!size) {
      throw new WebToolError(
        'invalid_input',
        `Which size? ${product.name} comes in: ${product.sizes.join(', ')}. Ask the person.`,
      )
    }
    const hit = product.sizes.find((s) => s.toLowerCase() === size.trim().toLowerCase())
    if (!hit) {
      throw new WebToolError(
        'invalid_input',
        `${product.name} has no size "${size}". Choose one of: ${product.sizes.join(', ')}.`,
      )
    }
    resolvedSize = hit
  }
  return { color: resolvedColor, size: resolvedSize }
}
