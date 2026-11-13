import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { OrderStatusBadge } from '@/components/orders/order-status-badge'
import { Button } from '@/components/ui/button'
import type { FoundOrderModel } from '@/hooks/use-order-detail'

export function OrderDetailHeader({ order }: { order: Pick<FoundOrderModel, 'id' | 'status' | 'placed' | 'city'> }) {
  return (
    <>
      <Button asChild variant="link" size="sm" className="h-auto gap-1.5 px-0 text-sm text-muted-foreground hover:text-foreground">
        <Link href="/orders">
          <ArrowLeft className="rtl:-scale-x-100" /> All orders
        </Link>
      </Button>
      <header className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-mono text-3xl font-semibold tracking-tight">Order #{order.id}</h1>
        <OrderStatusBadge status={order.status} />
      </header>
      <p className="tnum mt-1.5 text-sm text-muted-foreground">
        Placed {order.placed} · Shipping to {order.city}
      </p>
    </>
  )
}
