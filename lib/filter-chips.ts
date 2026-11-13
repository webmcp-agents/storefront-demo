import { categories } from '@/lib/data/categories'
import { formatDate, formatPrice, type ProductFilters } from '@/lib/queries'

/**
 * One applied filter, with the patch that removes it.
 *
 * `key` is stable across renders (`cat-bags`, `price`), `label` is the chip's text, and `clear` is merged into the
 * {@link ProductFilters} to drop the filter.
 */
export type FilterChip = { key: string; label: string; clear: Partial<ProductFilters> }

/** "Nov 12" from an ISO date. */
const shortDate = (iso: string) => formatDate(iso, { month: 'short', day: 'numeric' })

/**
 * The price chip's text: a range, "Over $X" or "Under $X".
 *
 * @param min - Lower bound in USD.
 * @param max - Upper bound in USD; must be set when `min` isn't.
 * @returns The label.
 */
function priceLabel(min?: number, max?: number) {
  if (min !== undefined && max !== undefined) return `${formatPrice(min)}–${formatPrice(max)}`
  return min !== undefined ? `Over ${formatPrice(min)}` : `Under ${formatPrice(max!)}`
}

/**
 * The date chip's text: a range, "Added since …" or "Added before …".
 *
 * @param from - First day, `YYYY-MM-DD`.
 * @param to - Last day, `YYYY-MM-DD`; must be set when `from` isn't.
 * @returns The label.
 */
function addedLabel(from?: string, to?: string) {
  if (from && to) return `Added ${shortDate(from)}–${shortDate(to)}`
  return from ? `Added since ${shortDate(from)}` : `Added before ${shortDate(to!)}`
}

/**
 * The applied filters as removable chips, in the panel's order.
 *
 * @param f - The filters in effect.
 * @returns One chip per category, color and size, and one each for search, price, sale, date added and stock (sort
 * never makes a chip). Matches the count from `countActiveFilters`.
 */
export function activeFilterChips(f: ProductFilters): FilterChip[] {
  const chips: FilterChip[] = []
  if (f.q) chips.push({ key: 'q', label: `“${f.q}”`, clear: { q: '' } })
  for (const c of f.categories)
    chips.push({
      key: `cat-${c}`,
      label: categories.find((x) => x.slug === c)?.name ?? c,
      clear: { categories: f.categories.filter((x) => x !== c) },
    })
  if (f.minPrice !== undefined || f.maxPrice !== undefined)
    chips.push({ key: 'price', label: priceLabel(f.minPrice, f.maxPrice), clear: { minPrice: undefined, maxPrice: undefined } })
  if (f.onSale || f.minDiscount !== undefined)
    chips.push({
      key: 'sale',
      label: f.minDiscount ? `${f.minDiscount}%+ off` : 'On sale',
      clear: { onSale: false, minDiscount: undefined },
    })
  if (f.addedFrom || f.addedTo)
    chips.push({ key: 'added', label: addedLabel(f.addedFrom, f.addedTo), clear: { addedFrom: undefined, addedTo: undefined } })
  for (const c of f.colors) chips.push({ key: `color-${c}`, label: c, clear: { colors: f.colors.filter((x) => x !== c) } })
  for (const s of f.sizes) chips.push({ key: `size-${s}`, label: `Size ${s}`, clear: { sizes: f.sizes.filter((x) => x !== s) } })
  if (f.inStock) chips.push({ key: 'stock', label: 'In stock', clear: { inStock: false } })
  return chips
}
