import type { Badge } from '@/components/ui/badge'
import type { StepState } from '@/hooks/use-order-detail'
import type { OrderStatus } from '@/lib/data/types'
import { Check, PackageCheck, PackageSearch, Truck } from 'lucide-react'
import type { ComponentProps } from 'react'

/** The badge style for each order status. */
export const ORDER_STATUS_VARIANT = {
  processing: 'secondary',
  shipped: 'brand-soft',
  delivered: 'success',
  cancelled: 'outline',
} as const satisfies Record<
  OrderStatus,
  ComponentProps<typeof Badge>['variant']
>

/** The marker icon for a delivery step that is not done yet; done steps show a check. */
export const STEP_ICON: Partial<Record<OrderStatus, typeof Check>> = {
  processing: PackageSearch,
  shipped: Truck,
  delivered: PackageCheck,
}

/** What a screen reader hears after each step's label. */
export const STEP_STATE_LABEL: Record<StepState, string> = {
  done: 'completed',
  current: 'current step',
  upcoming: 'not yet',
}
