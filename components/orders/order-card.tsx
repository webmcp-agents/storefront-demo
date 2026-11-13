import { OrderStatusBadge } from '@/components/orders/order-status-badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { OrderCardModel } from '@/hooks/use-orders-page'
import { ArrowRight, RotateCw } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type OrderCardItem = OrderCardModel['items'][number]

export function OrderCard({ order }: { order: OrderCardModel }) {
  return (
    <Card
      asChild
      className="block p-4 shadow-card sm:p-5"
    >
      <article aria-labelledby={`order-${order.id}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2
              id={`order-${order.id}`}
              className="flex flex-wrap items-center gap-2"
            >
              <Link
                href={order.href}
                className="font-mono text-body font-medium hover:underline"
              >
                Order #{order.id}
              </Link>
              <OrderStatusBadge status={order.status} />
            </h2>
            <p className="tnum mt-1 text-caption text-muted-foreground">
              {order.meta}
            </p>
          </div>
          <p className="tnum text-base font-semibold">{order.total}</p>
        </div>

        <ul
          className="mt-4 flex flex-wrap gap-2"
          aria-label="Items"
        >
          {order.items.map((i) => (
            <OrderCardItemChip
              key={i.key}
              item={i}
            />
          ))}
        </ul>

        <OrderCardActions order={order} />
      </article>
    </Card>
  )
}

function OrderCardItemChip({ item }: { item: OrderCardItem }) {
  return (
    <li className="flex min-w-0 items-center gap-2.5 rounded-card bg-surface-2 p-1.5 pe-3">
      <span className="media relative size-10 shrink-0 overflow-hidden rounded-lg bg-surface">
        <Image
          src={item.image}
          alt=""
          fill
          sizes="40px"
          className="object-cover"
        />
      </span>
      <span className="min-w-0 text-caption">
        <span className="block font-medium leading-snug">
          {item.name}
          {item.quantity > 1 && (
            <span className="tnum text-muted-foreground">
              {' '}
              × {item.quantity}
            </span>
          )}
        </span>
        {item.variant && (
          <span className="block leading-snug text-muted-foreground">
            {item.variant}
          </span>
        )}
      </span>
    </li>
  )
}

function OrderCardActions({ order }: { order: OrderCardModel }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
      {order.canReorder && (
        // The agent's reorder tool targets this label: keep it.
        <Button
          variant="outline"
          size="sm"
          aria-label={`Reorder order ${order.id}`}
          onClick={order.reorder}
        >
          <RotateCw /> Reorder
        </Button>
      )}
      {/* The agent's open_order tool targets this label; the visible text is part of it. */}
      <Button
        asChild
        size="sm"
      >
        <Link
          href={order.href}
          aria-label={`View order ${order.id}`}
        >
          View order <ArrowRight className="rtl:-scale-x-100" />
        </Link>
      </Button>
    </div>
  )
}
