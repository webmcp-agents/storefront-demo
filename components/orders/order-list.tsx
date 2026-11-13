import { OrderCard } from '@/components/orders/order-card'
import type { OrderCardModel } from '@/hooks/use-orders-page'

export function OrderList({ orders }: { orders: OrderCardModel[] }) {
  return (
    <ul className="grid gap-3">
      {orders.map((o) => (
        <li
          key={o.id}
          className="animate-rise"
        >
          <OrderCard order={o} />
        </li>
      ))}
    </ul>
  )
}
