import { Button } from '@/components/ui/button'
import type { PlacedOrderModel } from '@/hooks/use-checkout'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

/** The confirmation that replaces the checkout once the order is placed. */
export function OrderPlaced({ order }: { order: PlacedOrderModel }) {
  return (
    <div className="animate-rise mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-24 text-center">
      <CheckCircle2 className="size-12 text-success" />
      <h1 className="text-balance text-3xl font-semibold tracking-tight">
        Thanks, your order is in
      </h1>
      <p className="tnum text-pretty text-muted-foreground">
        Order <span className="font-mono text-foreground">#{order.id}</span> ·{' '}
        {order.total} · arriving {order.arrives}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Button
          asChild
          size="lg"
        >
          <Link href={order.href}>Track order</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
        >
          <Link href="/shop">Keep shopping</Link>
        </Button>
      </div>
    </div>
  )
}
