import type { Metadata } from 'next'
import { Suspense } from 'react'
import { OrderDetail } from '@/components/orders/order-detail'
import { OrderDetailSkeleton } from '@/components/orders/order-detail-skeleton'
import { seedOrders } from '@/lib/data/orders'

export const metadata: Metadata = { title: 'Order details' }

export function generateStaticParams() {
  return seedOrders.map((o) => ({ id: o.id }))
}

async function Order({ params }: Pick<PageProps<'/orders/[id]'>, 'params'>) {
  const { id } = await params
  return <OrderDetail id={id} />
}

export default function OrderPage({ params }: PageProps<'/orders/[id]'>) {
  // Orders placed in this browser are not known at build time, so params resolve inside Suspense.
  return (
    <Suspense fallback={<OrderDetailSkeleton />}>
      <Order params={params} />
    </Suspense>
  )
}
