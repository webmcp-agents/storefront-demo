'use client'

import { OrderDetailContent } from '@/components/orders/order-detail-content'
import { OrderDetailSkeleton } from '@/components/orders/order-detail-skeleton'
import { OrderNotFound } from '@/components/orders/order-not-found'
import { useOrderDetail } from '@/hooks/use-order-detail'

export function OrderDetail({ id }: { id: string }) {
  const order = useOrderDetail(id)

  if (order.state === 'loading') return <OrderDetailSkeleton />
  if (order.state === 'missing') return <OrderNotFound id={order.id} />
  return <OrderDetailContent order={order} />
}
