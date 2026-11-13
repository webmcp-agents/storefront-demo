import { SummaryRow } from '@/components/shared/summary-row'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { FoundOrderModel, OrderItemModel } from '@/hooks/use-order-detail'
import Image from 'next/image'
import Link from 'next/link'

export function OrderItems({
  order,
}: {
  order: Pick<FoundOrderModel, 'items' | 'subtotal' | 'shipping' | 'total'>
}) {
  return (
    <Card
      asChild
      className="mt-6 gap-0 py-0"
    >
      <section aria-labelledby="items">
        <CardHeader className="border-b border-border py-4">
          <CardTitle asChild>
            <h2 id="items">Items</h2>
          </CardTitle>
        </CardHeader>
        {/* rows divided by divide-y: a Separator is a div, which can't sit between <li>s */}
        <CardContent className="px-0">
          <ul className="divide-y divide-border">
            {order.items.map((item) => (
              <OrderItemRow
                key={item.key}
                item={item}
              />
            ))}
          </ul>
        </CardContent>
        <CardFooter className="border-t border-border py-4">
          <dl className="tnum w-full space-y-2 text-sm">
            <SummaryRow
              label="Subtotal"
              value={order.subtotal}
            />
            <SummaryRow
              label="Shipping"
              value={order.shipping}
            />
            <SummaryRow
              label="Total"
              value={order.total}
              total
            />
          </dl>
        </CardFooter>
      </section>
    </Card>
  )
}

function OrderItemRow({ item }: { item: OrderItemModel }) {
  return (
    <li className="flex items-center gap-4 px-5 py-4">
      <Link
        href={item.href}
        tabIndex={-1}
        aria-hidden
        className="media relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface-2"
      >
        <Image
          src={item.image}
          alt=""
          fill
          sizes="64px"
          className="object-cover"
        />
      </Link>
      <div className="min-w-0 flex-1 text-sm">
        <Link
          href={item.href}
          className="font-medium leading-snug hover:underline"
        >
          {item.name}
        </Link>
        <p className="text-caption text-muted-foreground">{item.variant}</p>
      </div>
      <p className="tnum whitespace-nowrap text-sm">
        {item.quantity} × {item.unitPrice}
      </p>
    </li>
  )
}
