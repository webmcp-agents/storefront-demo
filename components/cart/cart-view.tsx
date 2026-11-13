'use client'

import { CartContent } from '@/components/cart/cart-content'
import { CartEmpty } from '@/components/cart/cart-empty'
import { CartSkeleton } from '@/components/cart/cart-skeleton'
import { useCartPage } from '@/hooks/use-cart-page'

export function CartView() {
  const cart = useCartPage()

  if (!cart.ready) return <CartSkeleton />
  if (cart.isEmpty) return <CartEmpty notice={cart.notice} />
  return <CartContent cart={cart} />
}
