import { defineWebTool, locate, WebToolError } from '@webmcp-agents/core'
import { z } from 'zod'
import { categories } from '@/lib/data/categories'
import {
  PRODUCT_SORTS,
  TODAY,
  addDays,
  allSizes,
  catalogColors,
  emptyProductFilters,
  filterProducts,
  isIsoDate,
  summarizeProduct,
  type ProductFilters,
} from '@/lib/queries'
import { showProductFilters, useProductFiltersStore } from '@/lib/stores/filters'
import { whenElement } from '@/lib/when-element'

const categorySlugs = categories.map((c) => c.slug) as [string, ...string[]]
const sorts = PRODUCT_SORTS.map((s) => s.value) as [string, ...string[]]

/**
 * Match an agent's values to the catalog's own spelling, ignoring case and surrounding spaces.
 *
 * @param kind - What the values are, for the error, e.g. `"color"`.
 * @param values - The values the call gave.
 * @param options - The values the catalog has.
 * @returns Each value as the catalog spells it, in the call's order.
 * @throws {WebToolError} `invalid_input` naming the first value not in `options`, with the list to choose from.
 */
const pickFrom = (kind: string, values: string[], options: string[]) =>
  values.map((v) => {
    const hit = options.find((o) => o.toLowerCase() === v.trim().toLowerCase())
    if (!hit) throw new WebToolError('invalid_input', `Unknown ${kind} "${v}". Choose from: ${options.join(', ')}.`)
    return hit
  })

const callSchema = z.object({
  query: z.string().optional().describe('Words to look for in the name or description, e.g. "hoodie"'),
  categories: z.array(z.enum(categorySlugs)).optional().describe('Category slugs from list_categories, e.g. ["outerwear"]'),
  min_price: z.number().min(0).optional().describe('Lowest price in dollars, e.g. 50'),
  max_price: z.number().min(0).optional().describe('Highest price in dollars, e.g. 150'),
  on_sale: z.boolean().optional().describe('true to show only discounted products'),
  min_discount: z.number().min(1).max(90).optional().describe('Only products discounted by at least this many percent, e.g. 25'),
  added_after: z.string().optional().describe('Added on or after this date, YYYY-MM-DD, e.g. "2026-10-01"'),
  added_before: z.string().optional().describe('Added on or before this date, YYYY-MM-DD'),
  added_within_days: z.number().int().min(1).max(365).optional().describe('Added in the last N days, e.g. 30 for "this month"'),
  colors: z.array(z.string()).optional().describe('Color names, e.g. ["Black", "Navy"]. Any match counts.'),
  sizes: z.array(z.string()).optional().describe('Sizes, e.g. ["M"], ["32"] for waist, ["42"] for shoes. Any match counts.'),
  in_stock: z.boolean().optional().describe('true to hide sold-out products'),
  sort: z.enum(sorts).optional().describe('featured, newest, price-asc, price-desc, discount or rating'),
  merge: z.boolean().optional().describe('true to keep the filters already applied and add these'),
})

/** What a `filter_products` call passes. */
type FilterInput = z.infer<typeof callSchema>

/**
 * The tool's input schema: the call's shape, plus every check in {@link filtersFor}. The tool validates its input
 * before the cursor moves, so a call that would fail is rejected before anything is typed into the panel (typing a
 * price or date there applies it at once).
 */
const inputSchema = callSchema.superRefine((i, ctx) => {
  try {
    filtersFor(i)
  } catch (err) {
    if (!(err instanceof WebToolError)) throw err
    ctx.addIssue({ code: 'custom', message: err.message })
  }
})

/**
 * The filters a call asks for, checked.
 *
 * @param i - The call's input. With `merge`, unset fields keep the filters in force; otherwise they are cleared.
 * Any `min_discount` turns on `onSale`; `on_sale: false` clears a discount already in force.
 * @returns The product filters to show.
 * @throws {WebToolError} `invalid_input` when `added_after` or `added_before` isn't YYYY-MM-DD; when the call
 * contradicts itself (`added_within_days` with `added_after`, `on_sale: false` with `min_discount`); when the
 * resulting filters (after a merge) have a minimum price above the maximum or a start date after the end date; or
 * when a color or size isn't in the catalog (see {@link pickFrom}).
 */
function filtersFor(i: FilterInput): ProductFilters {
  if (i.added_after && !isIsoDate(i.added_after)) throw new WebToolError('invalid_input', `added_after must be YYYY-MM-DD, got "${i.added_after}".`)
  if (i.added_before && !isIsoDate(i.added_before)) throw new WebToolError('invalid_input', `added_before must be YYYY-MM-DD, got "${i.added_before}".`)
  if (i.added_within_days !== undefined && i.added_after)
    throw new WebToolError('invalid_input', 'Give added_within_days or added_after, not both.')
  if (i.on_sale === false && i.min_discount !== undefined)
    throw new WebToolError('invalid_input', 'on_sale false and min_discount contradict each other: drop one.')

  const base: ProductFilters = i.merge ? useProductFiltersStore.getState().filters : emptyProductFilters
  const next: ProductFilters = {
    ...base,
    q: i.query ?? base.q,
    categories: (i.categories as ProductFilters['categories']) ?? base.categories,
    minPrice: i.min_price ?? base.minPrice,
    maxPrice: i.max_price ?? base.maxPrice,
    onSale: i.on_sale ?? base.onSale,
    minDiscount: i.min_discount ?? base.minDiscount,
    addedFrom: i.added_within_days ? addDays(TODAY, -i.added_within_days) : (i.added_after ?? base.addedFrom),
    addedTo: i.added_before ?? base.addedTo,
    colors: i.colors ? pickFrom('color', i.colors, catalogColors.map((c) => c.name)) : base.colors,
    sizes: i.sizes ? pickFrom('size', i.sizes, allSizes) : base.sizes,
    inStock: i.in_stock ?? base.inStock,
    sort: (i.sort as ProductFilters['sort']) ?? base.sort,
  }
  // Turning the sale filter off drops a discount floor kept by `merge`; any floor means on sale.
  if (i.on_sale === false) next.minDiscount = undefined
  if (next.minDiscount !== undefined) next.onSale = true

  // Checked on the result, so a merge can't pair a new bound with an old one that crosses it.
  if (next.minPrice !== undefined && next.maxPrice !== undefined && next.minPrice > next.maxPrice)
    throw new WebToolError('invalid_input', `The minimum price (${next.minPrice}) is higher than the maximum (${next.maxPrice}).`)
  if (next.addedFrom && next.addedTo && next.addedFrom > next.addedTo)
    throw new WebToolError('invalid_input', `The start date (${next.addedFrom}) is after the end date (${next.addedTo}).`)

  return next
}

/** The discount floors with a pill of their own in the panel (see `DISCOUNT_STEPS` in use-product-filter-panel). */
const DISCOUNT_PILLS = [20, 25, 30]

/**
 * The pills this call turns on, as their names in the panel, in the panel's order.
 *
 * @param i - The call's input.
 * @returns Accessible names of the panel's buttons: categories, the discount pill ("25%+ off" for a 20, 25 or 30
 * `min_discount`, else "On sale" for any other `min_discount` or `on_sale`), colors, "Size …" and "In stock only".
 * Empty when the call sets no pill.
 */
function pillsFor(i: FilterInput): string[] {
  const discount =
    i.min_discount && DISCOUNT_PILLS.includes(i.min_discount)
      ? `${i.min_discount}%+ off`
      : i.min_discount || i.on_sale
        ? 'On sale' // a floor with no pill of its own (say 15%) still turns the sale filter on
        : undefined
  return [
    ...(i.categories ?? []).map((slug) => categories.find((c) => c.slug === slug)?.name ?? slug),
    ...(discount ? [discount] : []),
    ...(i.colors ?? []),
    ...(i.sizes ?? []).map((size) => `Size ${size}`),
    ...(i.in_stock ? ['In stock only'] : []),
  ]
}

/** The filter panel's column on /shop. */
const FILTERS = 'aside[aria-label="Filters"]'
/**
 * Where the cursor presses: the first pill the call turns on, in the filter panel (wide windows); the panel itself
 * when it sets no pill (words, prices, dates, sort); on phones, where the panel is closed, the Filters button that
 * opens it. Right after go_to shop the page may still show its skeleton: wait for the grid first.
 *
 * @param i - The call's input.
 * @returns The pill, the panel or the "Open filters" button; null when the panel is hidden and there is no such
 * button. Never throws: a grid that doesn't appear within `whenElement`'s timeout just moves on.
 */
const filtersControl = async (i: FilterInput): Promise<Element | null> => {
  await whenElement('section[aria-label="Products"]')
  // the sticky panel, not the <aside>: that is a grid column as tall as every product in it
  const panel = document.querySelector(`${FILTERS} > div`)
  if (!panel?.checkVisibility()) return document.querySelector('button[aria-label="Open filters"]')
  for (const name of pillsFor(i)) {
    const pill = locate({ role: 'button', name, within: panel })
    if (pill) return pill
  }
  return panel
}

/**
 * `filter_products`: filter and sort the /shop grid in front of the person (store and URL together), and answer with
 * the filters applied, the match count and up to 12 product summaries, plus a hint when nothing matched.
 *
 * On /shop only (`match`).
 *
 * @throws {WebToolError} `invalid_input` when a date isn't YYYY-MM-DD, `min_price` is higher than `max_price`, or a
 * color or size isn't in the catalog (see {@link filtersFor}).
 */
export const filterProductsTool = defineWebTool({
  id: 'filter_products',
  title: 'Filter products',
  description:
    'Filter and sort the product grid on the shop page, in front of the person: by words, category, price, discount, date added, color, size and stock. ' +
    'Answers with the match count and up to 12 products. Any filter left out is cleared unless merge is true. ' +
    `On /shop only: go_to shop first. Dates are YYYY-MM-DD and the store's date today is ${TODAY}; for "this month" or "last week" use added_within_days, or call get_time. ` +
    'Next: open_product, or filter_products again to refine.',
  inputSchema,
  match: '/shop',
  // The cursor types what has a field in the filter panel, then presses the first pill the call turns on; every
  // filter changes with that press (execute).
  target: filtersControl,
  fields: {
    query: false, // no search field on /shop (the palette's is another tool's)
    min_price: { name: 'Min price', within: FILTERS },
    max_price: { name: 'Max price', within: FILTERS },
    added_after: { name: 'Added from', within: FILTERS },
    added_before: { name: 'Added to', within: FILTERS },
  },
  execute: (i) => {
    const next = filtersFor(i)
    showProductFilters(next)
    const results = filterProducts(next)
    return {
      applied: {
        query: next.q || undefined,
        categories: next.categories,
        price: [next.minPrice, next.maxPrice],
        minDiscountPercent: next.minDiscount ?? (next.onSale ? 1 : undefined),
        addedBetween: [next.addedFrom, next.addedTo],
        colors: next.colors,
        sizes: next.sizes,
        inStockOnly: next.inStock,
        sort: next.sort,
      },
      total: results.length,
      products: results.slice(0, 12).map(summarizeProduct),
      hint: results.length === 0 ? 'Nothing matched. Loosen a filter (size and color together are strict).' : undefined,
    }
  },
})
