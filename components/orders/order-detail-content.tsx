import { OrderDetailHeader } from '@/components/orders/order-detail-header'
import { OrderItems } from '@/components/orders/order-items'
import { OrderProgress } from '@/components/orders/order-progress'
import type { FoundOrderModel } from '@/hooks/use-order-detail'

export function OrderDetailContent({ order }: { order: FoundOrderModel }) {
  return (
    <div className="mx-auto max-w-225 px-4 py-8 sm:px-6 lg:py-12">
      <OrderDetailHeader order={order} />
      <OrderProgress
        cancelled={order.cancelled}
        steps={order.steps}
        arrival={order.arrival}
      />
      <OrderItems order={order} />
    </div>
  )
}
