import type { Metadata } from 'next'
import { Suspense } from 'react'
import { OrdersSkeleton } from '@/components/orders/orders-skeleton'
import { OrdersView } from '@/components/orders/orders-view'

export const metadata: Metadata = { title: 'Orders' }

export default function OrdersPage() {
  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <OrdersView />
    </Suspense>
  )
}
