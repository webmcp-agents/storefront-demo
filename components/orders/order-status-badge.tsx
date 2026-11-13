import { ORDER_STATUS_VARIANT } from '@/components/orders/constants'
import { Badge } from '@/components/ui/badge'
import type { OrderStatus } from '@/lib/data/types'

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge
      variant={ORDER_STATUS_VARIANT[status]}
      className="capitalize"
    >
      {status}
    </Badge>
  )
}
