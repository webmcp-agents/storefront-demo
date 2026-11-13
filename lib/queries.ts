import { categories } from './data/categories'
import { products, SHOE_SIZES, TOP_SIZES, WAIST_SIZES } from './data/products'
import type {
  CategorySlug,
  Order,
  OrderStatus,
  Product,
} from './data/types'

/** The store's "today". Fixed so relative filters ("added this week") are stable in the demo. */
export const TODAY = '2026-11-12'

/* ------------------------------------------------------------------ */
/* Formatting + lookups                                                */
/* ------------------------------------------------------------------ */

/** Whole dollars: "$129". */
const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
/** Dollars and cents: "$19.50". */
const moneyExact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

/**
 * A USD price, with cents only when there are any.
 *
 * @param n - Amount in dollars.
 * @returns The formatted price.
 * @example
 * formatPrice(129) // "$129"
 * formatPrice(19.5) // "$19.50"
 */
export const formatPrice = (n: number) =>
  Number.isInteger(n) ? money.format(n) : moneyExact.format(n)

/**
 * Format an ISO date or date-time in US English. A bare `YYYY-MM-DD` is read as local midnight, so it never shows as
 * the day before.
 *
 * @param iso - `YYYY-MM-DD` or a full ISO date-time.
 * @param opts - `toLocaleDateString` options; the default gives "Nov 12, 2026".
 * @returns The formatted date ("Invalid Date" for input that doesn't parse).
 */
export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions) {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso)
  return d.toLocaleDateString('en-US', opts ?? { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Find a product by id (`p01`) or slug.
 *
 * @param idOrSlug - Either one.
 * @returns The product, or undefined.
 */
export const getProduct = (idOrSlug: string) =>
  products.find((p) => p.id === idOrSlug || p.slug === idOrSlug)

/**
 * Find a category by slug.
 *
 * @param slug - A {@link CategorySlug}, or any string from a URL.
 * @returns The category, or undefined.
 */
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug)

/**
 * Percent off the compare-at price, rounded; 0 when the product isn't on sale.
 *
 * @param p - Anything with a price and an optional compare-at price.
 * @returns Whole percent.
 */
export function discountPercent(p: Pick<Product, 'price' | 'compareAtPrice'>) {
  if (!p.compareAtPrice || p.compareAtPrice <= p.price) return 0
  return Math.round((1 - p.price / p.compareAtPrice) * 100)
}

/**
 * Shift an ISO date by whole days, in UTC so time zones and DST can't move it.
 *
 * @param iso - `YYYY-MM-DD`.
 * @param days - Days to add; negative goes back.
 * @returns The new `YYYY-MM-DD`.
 * @throws {RangeError} when `iso` isn't a valid date.
 * @example
 * addDays('2026-11-12', -14) // '2026-10-29'
 */
export function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/**
 * Whether a value is a `YYYY-MM-DD` string naming a real calendar day.
 *
 * @param s - Anything, typically a URL param.
 * @returns True for a usable ISO date; false for impossible days such as `2026-02-30`.
 * @example
 * isIsoDate('2026-02-28') // true
 * isIsoDate('2026-02-30') // false
 */
export const isIsoDate = (s: unknown): s is string => {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  // Date.parse rolls impossible days over (2026-02-30 -> Mar 2): only a real calendar date reads back unchanged.
  const d = new Date(`${s}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s
}

/* ------------------------------------------------------------------ */
/* Product filters                                                     */
/* ------------------------------------------------------------------ */

/** The shop's sort options, in menu order; `value` is the `?sort=` param. */
export const PRODUCT_SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'discount', label: 'Biggest discount' },
  { value: 'rating', label: 'Top rated' },
] as const
/** One of the {@link PRODUCT_SORTS} values. */
export type ProductSort = (typeof PRODUCT_SORTS)[number]['value']

/** Everything the shop can filter and sort by. Kept in the URL: see {@link parseProductFilters}. */
export type ProductFilters = {
  /** Search text; every word must match (see {@link matchesQuery}). */
  q: string
  /** Any of these; empty means all. */
  categories: CategorySlug[]
  /** Lowest price in USD, inclusive. */
  minPrice?: number
  /** Highest price in USD, inclusive. */
  maxPrice?: number
  /** Only items with a discount. */
  onSale: boolean
  /** Only items discounted by at least this many percent. */
  minDiscount?: number
  /** ISO date (YYYY-MM-DD), inclusive. */
  addedFrom?: string
  /** ISO date (YYYY-MM-DD), inclusive. */
  addedTo?: string
  /** Any of these, case-insensitive; empty means all. */
  colors: string[]
  /** Any of these, case-insensitive; empty means all. */
  sizes: string[]
  /** Only items with stock left. */
  inStock: boolean
  sort: ProductSort
}

/** No filters, featured order: the shop's default. */
export const emptyProductFilters: ProductFilters = {
  q: '',
  categories: [],
  onSale: false,
  colors: [],
  sizes: [],
  inStock: false,
  sort: 'featured',
}

/** Lowercase and trim, for case-insensitive matching. */
const norm = (s: string) => s.toLowerCase().trim()

/**
 * Whether every word of a search appears in the product's name, slug, category, description or colors.
 * Case-insensitive; a trailing "s" is optional, so "jackets" finds "jacket".
 *
 * @param p - The product.
 * @param q - The search text.
 * @returns True when all words match, or the search is empty.
 */
export function matchesQuery(p: Product, q: string) {
  const terms = norm(q).split(/\s+/).filter(Boolean)
  if (!terms.length) return true
  const hay = norm(
    [
      p.name,
      p.slug.replace(/-/g, ' '),
      p.category,
      p.description,
      p.colors.map((c) => c.name).join(' '),
    ].join(' '),
  )
  return terms.every((t) => hay.includes(t) || hay.includes(t.replace(/s$/, '')))
}

/**
 * Filter and sort products.
 *
 * @param f - The filters and sort.
 * @param source - Products to filter; defaults to the whole catalog.
 * @returns A new array; `featured` keeps the source order.
 */
export function filterProducts(f: ProductFilters, source: Product[] = products): Product[] {
  const colors = f.colors.map(norm)
  const sizes = f.sizes.map(norm)

  const out = source.filter((p) => {
    if (f.q && !matchesQuery(p, f.q)) return false
    if (f.categories.length && !f.categories.includes(p.category)) return false
    if (f.minPrice !== undefined && p.price < f.minPrice) return false
    if (f.maxPrice !== undefined && p.price > f.maxPrice) return false
    const off = discountPercent(p)
    if (f.onSale && off === 0) return false
    if (f.minDiscount !== undefined && off < f.minDiscount) return false
    if (f.addedFrom && p.addedAt < f.addedFrom) return false
    if (f.addedTo && p.addedAt > f.addedTo) return false
    if (colors.length && !p.colors.some((c) => colors.includes(norm(c.name)))) return false
    if (sizes.length && !p.sizes.some((s) => sizes.includes(norm(s)))) return false
    if (f.inStock && p.stock <= 0) return false
    return true
  })

  const sorted = [...out]
  switch (f.sort) {
    case 'newest':
      sorted.sort((a, b) => b.addedAt.localeCompare(a.addedAt))
      break
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'discount':
      sorted.sort((a, b) => discountPercent(b) - discountPercent(a))
      break
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
      break
    default:
      break
  }
  return sorted
}

/** Colors and sizes that actually exist in the catalog, for filter UI and tool validation. */
export const catalogColors = (() => {
  const map = new Map<string, string>()
  for (const p of products) for (const c of p.colors) map.set(c.name, c.hex)
  return [...map].map(([name, hex]) => ({ name, hex }))
})()

/** The size scales the catalog uses: letter, waist and EU shoe sizes. */
export const catalogSizes = {
  clothing: TOP_SIZES,
  waist: WAIST_SIZES,
  shoes: SHOE_SIZES,
}
/** Every size in {@link catalogSizes}, in display order. */
export const allSizes = [...catalogSizes.clothing, ...catalogSizes.waist, ...catalogSizes.shoes]

/** The cheapest and the dearest catalog price, in USD. */
export const priceBounds = {
  min: Math.min(...products.map((p) => p.price)),
  max: Math.max(...products.map((p) => p.price)),
}

/**
 * A short, model- and human-readable summary of a product.
 *
 * @param p - The product.
 * @returns Its slug, name, category, prices, discount, color names, sizes, date added, rating and whether it's in
 * stock; `compareAtPrice` is null when it isn't on sale.
 */
export function summarizeProduct(p: Product) {
  return {
    slug: p.slug,
    name: p.name,
    category: p.category,
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? null,
    discountPercent: discountPercent(p),
    colors: p.colors.map((c) => c.name),
    sizes: p.sizes,
    addedAt: p.addedAt,
    rating: p.rating,
    inStock: p.stock > 0,
  }
}

/* ------------------------------------------------------------------ */
/* URL <-> filters                                                     */
/* ------------------------------------------------------------------ */

/** A comma-separated param as trimmed, non-empty parts. */
const list = (v: string | null) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])
/** A numeric param, or undefined when missing, empty or not a finite number. */
const num = (v: string | null) => {
  if (v === null || v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

/** Valid `?category=` values. */
/** A number above zero, else undefined: `?off=0` is no discount filter at all. */
const positive = (n: number | undefined) => (n !== undefined && n > 0 ? n : undefined)

const categorySlugs = categories.map((c) => c.slug) as string[]
/** Valid `?sort=` values for the shop. */
const sortValues = PRODUCT_SORTS.map((s) => s.value) as string[]

/**
 * Read shop filters from the URL. Unknown categories and sorts, and malformed numbers and dates, are dropped.
 *
 * @param params - The shop page's search params.
 * @returns Filters, with defaults for anything missing.
 * @example
 * parseProductFilters(new URLSearchParams('q=coat&category=tops,bags&max=100&sale=1&sort=newest'))
 * // { q: 'coat', categories: ['tops', 'bags'], maxPrice: 100, onSale: true, sort: 'newest', ... }
 */
export function parseProductFilters(params: URLSearchParams): ProductFilters {
  const sort = params.get('sort') ?? ''
  const from = params.get('from')
  const to = params.get('to')
  return {
    q: params.get('q') ?? '',
    categories: list(params.get('category')).filter((c) => categorySlugs.includes(c)) as CategorySlug[],
    minPrice: num(params.get('min')),
    maxPrice: num(params.get('max')),
    onSale: params.get('sale') === '1',
    minDiscount: positive(num(params.get('off'))),
    addedFrom: isIsoDate(from) ? from : undefined,
    addedTo: isIsoDate(to) ? to : undefined,
    colors: list(params.get('color')),
    sizes: list(params.get('size')),
    inStock: params.get('stock') === '1',
    sort: (sortValues.includes(sort) ? sort : 'featured') as ProductSort,
  }
}

/**
 * Write shop filters as search params, leaving out defaults so URLs stay short. The inverse of
 * {@link parseProductFilters}.
 *
 * Params: `q`, `category`, `min`, `max`, `sale`, `off`, `from`, `to`, `color`, `size`, `stock`, `sort`. Lists are
 * comma-separated and on/off filters are `1`.
 *
 * @param f - The filters.
 * @returns New search params.
 */
export function productFiltersToParams(f: ProductFilters): URLSearchParams {
  const p = new URLSearchParams()
  if (f.q) p.set('q', f.q)
  if (f.categories.length) p.set('category', f.categories.join(','))
  if (f.minPrice !== undefined) p.set('min', String(f.minPrice))
  if (f.maxPrice !== undefined) p.set('max', String(f.maxPrice))
  if (f.onSale) p.set('sale', '1')
  if (f.minDiscount !== undefined) p.set('off', String(f.minDiscount))
  if (f.addedFrom) p.set('from', f.addedFrom)
  if (f.addedTo) p.set('to', f.addedTo)
  if (f.colors.length) p.set('color', f.colors.join(','))
  if (f.sizes.length) p.set('size', f.sizes.join(','))
  if (f.inStock) p.set('stock', '1')
  if (f.sort !== 'featured') p.set('sort', f.sort)
  return p
}

/**
 * How many filters are applied: each category, color and size counts on its own; sort doesn't count.
 *
 * @param f - The filters.
 * @returns The count, one per chip from `activeFilterChips`.
 */
export function countActiveFilters(f: ProductFilters) {
  return (
    (f.q ? 1 : 0) +
    f.categories.length +
    (f.minPrice !== undefined || f.maxPrice !== undefined ? 1 : 0) +
    (f.onSale || f.minDiscount !== undefined ? 1 : 0) +
    (f.addedFrom || f.addedTo ? 1 : 0) +
    f.colors.length +
    f.sizes.length +
    (f.inStock ? 1 : 0)
  )
}

/* ------------------------------------------------------------------ */
/* Order filters                                                       */
/* ------------------------------------------------------------------ */

/** Every order status, in lifecycle order. */
export const ORDER_STATUSES: OrderStatus[] = ['processing', 'shipped', 'delivered', 'cancelled']

/** The orders page's sort options; `value` is the `?sort=` param. */
export const ORDER_SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'total-desc', label: 'Total: high to low' },
  { value: 'total-asc', label: 'Total: low to high' },
] as const
/** One of the {@link ORDER_SORTS} values. */
export type OrderSort = (typeof ORDER_SORTS)[number]['value']

/** Everything the orders page can filter and sort by. Kept in the URL: see {@link parseOrderFilters}. */
export type OrderFilters = {
  /** Any of these; empty means all. */
  statuses: OrderStatus[]
  /** ISO date (YYYY-MM-DD), inclusive, compared with the day the order was placed. */
  from?: string
  /** ISO date (YYYY-MM-DD), inclusive. */
  to?: string
  /** Matches product names (e.g. "jacket"). */
  product: string
  /** Lowest order total in USD, inclusive. */
  minTotal?: number
  /** Highest order total in USD, inclusive. */
  maxTotal?: number
  sort: OrderSort
}

/** No filters, newest first: the orders page's default. */
export const emptyOrderFilters: OrderFilters = {
  statuses: [],
  product: '',
  sort: 'newest',
}

/**
 * Filter and sort orders. The product search matches if any line's product matches (see {@link matchesQuery}).
 *
 * @param f - The filters and sort.
 * @param source - The orders to filter.
 * @returns A new array, newest first unless `f.sort` says otherwise.
 */
export function filterOrders(f: OrderFilters, source: Order[]): Order[] {
  const term = norm(f.product)
  const out = source.filter((o) => {
    if (f.statuses.length && !f.statuses.includes(o.status)) return false
    const day = o.placedAt.slice(0, 10)
    if (f.from && day < f.from) return false
    if (f.to && day > f.to) return false
    if (f.minTotal !== undefined && o.total < f.minTotal) return false
    if (f.maxTotal !== undefined && o.total > f.maxTotal) return false
    if (term) {
      const hit = o.items.some((i) => {
        const p = getProduct(i.productId)
        return p ? matchesQuery(p, term) : false
      })
      if (!hit) return false
    }
    return true
  })
  const sorted = [...out]
  switch (f.sort) {
    case 'oldest':
      sorted.sort((a, b) => a.placedAt.localeCompare(b.placedAt))
      break
    case 'total-desc':
      sorted.sort((a, b) => b.total - a.total)
      break
    case 'total-asc':
      sorted.sort((a, b) => a.total - b.total)
      break
    default:
      sorted.sort((a, b) => b.placedAt.localeCompare(a.placedAt))
  }
  return sorted
}

/**
 * Read order filters from the URL. Unknown statuses and sorts, and malformed numbers and dates, are dropped.
 *
 * @param params - The orders page's search params: `status`, `from`, `to`, `product`, `min`, `max`, `sort`.
 * @returns Filters, with defaults for anything missing.
 */
export function parseOrderFilters(params: URLSearchParams): OrderFilters {
  const from = params.get('from')
  const to = params.get('to')
  const sort = params.get('sort') ?? ''
  return {
    statuses: list(params.get('status')).filter((s): s is OrderStatus =>
      (ORDER_STATUSES as string[]).includes(s),
    ),
    from: isIsoDate(from) ? from : undefined,
    to: isIsoDate(to) ? to : undefined,
    product: params.get('product') ?? '',
    minTotal: num(params.get('min')),
    maxTotal: num(params.get('max')),
    sort: ((ORDER_SORTS.map((s) => s.value) as string[]).includes(sort) ? sort : 'newest') as OrderSort,
  }
}

/**
 * Write order filters as search params, leaving out defaults. The inverse of {@link parseOrderFilters}.
 *
 * @param f - The filters.
 * @returns New search params.
 */
export function orderFiltersToParams(f: OrderFilters): URLSearchParams {
  const p = new URLSearchParams()
  if (f.statuses.length) p.set('status', f.statuses.join(','))
  if (f.from) p.set('from', f.from)
  if (f.to) p.set('to', f.to)
  if (f.product) p.set('product', f.product)
  if (f.minTotal !== undefined) p.set('min', String(f.minTotal))
  if (f.maxTotal !== undefined) p.set('max', String(f.maxTotal))
  if (f.sort !== 'newest') p.set('sort', f.sort)
  return p
}

/**
 * How many order filters are applied: each status counts on its own; sort doesn't count.
 *
 * @param f - The filters.
 * @returns The count.
 */
export function countActiveOrderFilters(f: OrderFilters) {
  return (
    f.statuses.length +
    (f.from || f.to ? 1 : 0) +
    (f.product ? 1 : 0) +
    (f.minTotal !== undefined || f.maxTotal !== undefined ? 1 : 0)
  )
}

/**
 * A short, model- and human-readable summary of an order, with product names in place of ids.
 *
 * @param o - The order.
 * @returns Its id, dates, status, total and lines; a line whose product is gone shows the id as its name.
 */
export function summarizeOrder(o: Order) {
  return {
    id: o.id,
    placedAt: o.placedAt,
    status: o.status,
    total: o.total,
    arrives: o.arrives,
    items: o.items.map((i) => {
      const p = getProduct(i.productId)
      return {
        product: p?.name ?? i.productId,
        slug: p?.slug,
        color: i.color,
        size: i.size,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      }
    }),
  }
}

/* ------------------------------------------------------------------ */
/* Presentation helpers                                                */
/* ------------------------------------------------------------------ */

/**
 * "Camel · Size M", or `fallback` when the line has neither.
 *
 * @param v - A cart or order line, or anything with an optional color and size.
 * @param fallback - Text for a line with neither.
 * @returns The label.
 * @example
 * formatVariant({ color: 'Camel', size: 'M' }) // "Camel · Size M"
 * formatVariant({ size: '42' }) // "Size 42"
 * formatVariant({}, 'One size') // "One size"
 */
export function formatVariant(v: { color?: string; size?: string }, fallback = '') {
  return [v.color, v.size && `Size ${v.size}`].filter(Boolean).join(' · ') || fallback
}

/** Products added in the last two weeks count as new. */
export const NEW_FOR_DAYS = 14
/** At or below this many left, a product shows a low-stock badge. */
export const LOW_STOCK_AT = 8

/**
 * The badges and states a product card or page shows.
 *
 * @param p - The product.
 * @returns Its discount percent, whether it is new (added within {@link NEW_FOR_DAYS} of {@link TODAY}) and whether
 * stock is low (at most {@link LOW_STOCK_AT}).
 */
export function productFlags(p: Product) {
  return {
    discount: discountPercent(p),
    isNew: p.addedAt >= addDays(TODAY, -NEW_FOR_DAYS),
    lowStock: p.stock <= LOW_STOCK_AT,
  }
}

/* ------------------------------------------------------------------ */
/* Catalog selections                                                  */
/* ------------------------------------------------------------------ */

/**
 * The most recently added products.
 *
 * @param n - How many.
 * @returns Up to `n` products, newest first.
 */
export const newArrivals = (n: number) =>
  [...products].sort((a, b) => b.addedAt.localeCompare(a.addedAt)).slice(0, n)

/**
 * The biggest discounts in the catalog.
 *
 * @param n - How many.
 * @returns Up to `n` products, biggest discount first (may include full-price ones when fewer are on sale).
 */
export const topDeals = (n: number) =>
  [...products].sort((a, b) => discountPercent(b) - discountPercent(a)).slice(0, n)

/** The biggest discount in the catalog, in whole percent. */
export const maxDiscount = () => Math.max(...products.map(discountPercent))

/** How many products the home page's "New in" and sale shelves show. */
export const HOME_SHELF_SIZE = 4
/** How many "You may also like" products a product page shows. */
export const RELATED_COUNT = 4
/** How many of the shop's product images load eagerly: the first row on most screens. */
export const SHOP_PRIORITY_IMAGES = 3
/** How many color dots a product card shows before "+N". */
export const CARD_SWATCH_COUNT = 5

/**
 * A product card's color dots, and how many more colors are hidden behind "+N".
 *
 * @param p - The product.
 * @param max - Most dots to show.
 * @returns `swatches` to show and the `moreColors` count.
 */
export function colorSwatches(p: Product, max = CARD_SWATCH_COUNT) {
  const swatches = p.colors.slice(0, max)
  return { swatches, moreColors: p.colors.length - swatches.length }
}

/**
 * Other products in the same category, for "You may also like".
 *
 * @param p - The product being viewed; never included.
 * @param n - How many.
 * @returns Up to `n` products, in catalog order.
 */
export const relatedProducts = (p: Product, n: number = RELATED_COUNT) =>
  products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, n)

/**
 * Find a product by slug only; see {@link getProduct} to accept an id too.
 *
 * @param slug - The product's slug.
 * @returns The product, or undefined.
 */
export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug)

/**
 * WCAG relative luminance of a `#rrggbb` color.
 *
 * @param hex - The color, with the leading `#`.
 * @returns 0 (black) to 1 (white).
 */
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Whether a check mark on this swatch reads better dark (#111) than white.
 *
 * @param hex - The swatch color, `#rrggbb`.
 * @returns True when #111 has more contrast against it than white does.
 */
export function swatchTakesDarkMark(hex: string) {
  const l = luminance(hex)
  return (l + 0.05) / 0.0556 > 1.05 / (l + 0.05)
}
