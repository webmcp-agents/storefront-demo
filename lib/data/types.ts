/** A store category's id; also its `?category=` value in shop URLs. */
export type CategorySlug =
  | 'outerwear'
  | 'tops'
  | 'bottoms'
  | 'footwear'
  | 'bags'
  | 'accessories'

/** A store category, as shown on the home page and in the footer. */
export type Category = {
  slug: CategorySlug
  name: string
  /** One-line pitch shown under the name. */
  blurb: string
  /** Path under /public. */
  image: string
}

/** A color a product comes in: its display `name` and swatch `hex` (`#rrggbb`). */
export type ProductColor = { name: string; hex: string }

/** A product in the catalog. Prices are in USD. */
export type Product = {
  /** Stable id (`p01`, `p02`…); orders and the cart refer to products by it. */
  id: string
  /** URL segment of the product page, `/product/<slug>`. */
  slug: string
  name: string
  category: CategorySlug
  price: number
  /** Original price before the discount, when the product is on sale. */
  compareAtPrice?: number
  colors: ProductColor[]
  /** Empty for one-size products (bags, most accessories). */
  sizes: string[]
  /** ISO date (YYYY-MM-DD) the product was added to the store. */
  addedAt: string
  /** Average review score, out of 5. */
  rating: number
  /** Number of reviews behind `rating`. */
  reviews: number
  /** Units left; 0 is sold out. */
  stock: number
  description: string
  /** Bullet points: material, lining, care. */
  details: string[]
  /** Path under /public. */
  image: string
}

/** Where an order is: `processing` until it ships, then `shipped`, `delivered`, or `cancelled`. */
export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled'

/** One line of an order, at the price paid when it was placed. */
export type OrderItem = {
  /** The {@link Product.id}. */
  productId: string
  /** Absent for products without colors. */
  color?: string
  /** Absent for one-size products. */
  size?: string
  quantity: number
  /** Price paid per unit, in USD. */
  unitPrice: number
}

/** A placed order. Money is in USD. */
export type Order = {
  /** Order number, e.g. `1001`. */
  id: string
  /** ISO date-time. */
  placedAt: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  shipping: number
  /** `subtotal + shipping`. */
  total: number
  /** ISO date the order arrives (or arrived). */
  arrives: string
  /** City it ships to. */
  city: string
}

/** One line in the cart: a product variant and how many. It holds no price; that comes from the catalog. */
export type CartLine = {
  /** The {@link Product.id}. */
  productId: string
  color?: string
  size?: string
  quantity: number
}
