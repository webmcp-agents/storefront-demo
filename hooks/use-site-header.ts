'use client'

import { MAIN_NAV } from '@/lib/navigation'
import { cartTotals, useCartStore } from '@/lib/stores/cart'
import { usePathname } from 'next/navigation'

/**
 * The site header: which section is current and the cart count.
 *
 * @returns The header's model: the main nav items, each marked `current` on its page or a page under it, and the
 * cart's item count with its accessible label ("Cart, 2 items").
 */
export function useSiteHeader() {
  const pathname = usePathname()
  const count = cartTotals(useCartStore((s) => s.lines)).count

  return {
    nav: MAIN_NAV.map((item) => ({
      ...item,
      current: pathname === item.href || pathname.startsWith(`${item.href}/`),
    })),
    cart: {
      count,
      label: count
        ? `Cart, ${count} ${count === 1 ? 'item' : 'items'}`
        : 'Cart',
    },
  }
}

/** What {@link useSiteHeader} returns. */
export type SiteHeaderModel = ReturnType<typeof useSiteHeader>
