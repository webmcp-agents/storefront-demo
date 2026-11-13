'use client'

import { CheckoutContent } from '@/components/checkout/checkout-content'
import { CheckoutEmpty } from '@/components/checkout/checkout-empty'
import { CheckoutSkeleton } from '@/components/checkout/checkout-skeleton'
import { OrderPlaced } from '@/components/checkout/order-placed'
import { useCheckout } from '@/hooks/use-checkout'

export function CheckoutView() {
  const checkout = useCheckout()

  if (checkout.placed) return <OrderPlaced order={checkout.placed} />
  if (!checkout.ready) return <CheckoutSkeleton />
  if (checkout.isEmpty) return <CheckoutEmpty />
  return <CheckoutContent checkout={checkout} />
}
