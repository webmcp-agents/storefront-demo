import { products } from './products'
import type { Order, OrderItem, OrderStatus } from './types'

/** Catalog products by slug, for building the seed orders. */
const bySlug = new Map(products.map((p) => [p.slug, p]))

/**
 * One seed order line at the product's current price.
 *
 * @param slug - The product's slug.
 * @param color - The color ordered; undefined for products without colors.
 * @param size - The size ordered; undefined for one-size products.
 * @param quantity - Units ordered.
 * @returns The {@link OrderItem}.
 * @throws {Error} when no product has that slug (at module load, since the seed orders are built then).
 */
function line(
  slug: string,
  color: string | undefined,
  size: string | undefined,
  quantity = 1,
): OrderItem {
  const product = bySlug.get(slug)
  if (!product) throw new Error(`Seed order references unknown product ${slug}`)
  return {
    productId: product.id,
    color,
    size,
    quantity,
    unitPrice: product.price,
  }
}

/** Subtotal, in USD, at or above which shipping is free. */
export const FREE_SHIPPING_OVER = 150
/** Shipping charged below {@link FREE_SHIPPING_OVER}, in USD. */
export const SHIPPING_FLAT = 9

/**
 * Shipping for a subtotal: free when it is 0 or at least {@link FREE_SHIPPING_OVER}, else {@link SHIPPING_FLAT}.
 *
 * @param subtotal - Order subtotal in USD.
 * @returns Shipping in USD.
 */
export function shippingFor(subtotal: number) {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT
}

/**
 * A seed order, with subtotal, shipping and total worked out from its lines.
 *
 * @param id - Order number.
 * @param placedAt - ISO date-time it was placed.
 * @param status - Where it is now.
 * @param arrives - ISO date it arrives (or arrived).
 * @param city - City it ships to.
 * @param items - Its lines, from {@link line}.
 * @returns The {@link Order}.
 */
function order(
  id: string,
  placedAt: string,
  status: OrderStatus,
  arrives: string,
  city: string,
  items: OrderItem[],
): Order {
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
  const shipping = shippingFor(subtotal)
  return {
    id,
    placedAt,
    status,
    arrives,
    city,
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
  }
}

/** Past orders the store starts with. Newest are placed just before "today" (2026-11-12). */
export const seedOrders: Order[] = [
  order('1001', '2026-02-06T10:14:00', 'delivered', '2026-02-11', 'Cairo', [
    line('classic-white-tee', 'White', 'M', 2),
    line('knit-joggers', 'Grey', '32'),
  ]),
  order('1002', '2026-03-09T18:42:00', 'delivered', '2026-03-14', 'Cairo', [
    line('leather-biker-jacket', 'Black', 'M'),
  ]),
  order('1003', '2026-03-27T09:05:00', 'delivered', '2026-04-01', 'Giza', [
    line('white-leather-sneakers', 'White', '42'),
  ]),
  order('1004', '2026-04-18T14:30:00', 'delivered', '2026-04-23', 'Cairo', [
    line('slim-denim-jeans', 'Blue', '32'),
    line('canvas-tote', 'Cream', undefined),
  ]),
  order('1005', '2026-05-12T21:10:00', 'cancelled', '2026-05-17', 'Cairo', [
    line('denim-trucker-jacket', 'Blue', 'L'),
  ]),
  order(
    '1006',
    '2026-06-02T11:55:00',
    'delivered',
    '2026-06-07',
    'Alexandria',
    [
      line('bomber-jacket', 'Olive', 'M'),
      line('canvas-high-tops', 'Black', '43'),
    ],
  ),
  order('1007', '2026-07-08T16:20:00', 'delivered', '2026-07-13', 'Cairo', [
    line('linen-shirt', 'White', 'M', 2),
    line('denim-shorts', 'Blue', '32'),
  ]),
  order('1008', '2026-08-21T13:48:00', 'delivered', '2026-08-26', 'Cairo', [
    line('crossbody-bag', 'Tan', undefined),
    line('leather-wallet', 'Black', undefined),
    line('aviator-sunglasses', 'Gold', undefined),
  ]),
  order('1009', '2026-09-12T08:36:00', 'delivered', '2026-09-17', 'Giza', [
    line('leather-watch', 'Brown', undefined),
    line('chino-trousers', 'Tan', '32'),
  ]),
  order('1010', '2026-09-30T19:02:00', 'delivered', '2026-10-05', 'Cairo', [
    line('running-shoes', 'Grey', '43'),
    line('graphic-hoodie', 'Black', 'L'),
  ]),
  order('1011', '2026-10-18T12:25:00', 'delivered', '2026-10-23', 'Cairo', [
    line('merino-sweater', 'Navy', 'M'),
    line('wool-beanie', 'Grey', undefined),
  ]),
  order('1012', '2026-10-29T17:40:00', 'shipped', '2026-11-14', 'Cairo', [
    line('chelsea-boots', 'Black', '43'),
    line('pleated-trousers', 'Grey', '32'),
  ]),
  order('1013', '2026-11-06T10:03:00', 'shipped', '2026-11-13', 'Cairo', [
    line('wool-overcoat', 'Camel', 'M'),
  ]),
  order('1014', '2026-11-11T22:15:00', 'processing', '2026-11-17', 'Cairo', [
    line('weekender-duffel', 'Olive', undefined),
    line('suede-loafers', 'Tan', '42'),
  ]),
]
