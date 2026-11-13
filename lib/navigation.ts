import { categories } from '@/lib/data/categories'

/** A link in the header or footer navigation. */
export type NavLink = { href: string; label: string }

/** The header's main navigation. */
export const MAIN_NAV: NavLink[] = [
  { href: '/shop', label: 'Shop' },
  { href: '/orders', label: 'Orders' },
]

/** The footer's Shop column: one link per category. */
export const SHOP_LINKS: NavLink[] = categories.map((c) => ({ href: `/shop?category=${c.slug}`, label: c.name }))

/** The footer's Account column. */
export const ACCOUNT_LINKS: NavLink[] = [
  { href: '/orders', label: 'Your orders' },
  { href: '/cart', label: 'Cart' },
]
