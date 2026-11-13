import { SummaryRow } from '@/components/shared/summary-row'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { CheckoutModel } from '@/hooks/use-checkout'
import Image from 'next/image'

type CheckoutItem = CheckoutModel['items'][number]

export function CheckoutSummary({
  items,
  shipping,
  total,
}: Pick<CheckoutModel, 'items' | 'shipping' | 'total'>) {
  return (
    <Card
      asChild
      className="gap-4"
    >
      <aside aria-labelledby="in-cart">
        <CardHeader>
          <CardTitle asChild>
            <h2 id="in-cart">In your cart</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ul className="space-y-3">
            {items.map((item) => (
              <CheckoutItemRow
                key={item.key}
                item={item}
              />
            ))}
          </ul>
          <Separator />
          <dl className="tnum space-y-2 text-sm">
            <SummaryRow
              label="Shipping"
              value={shipping}
            />
            <SummaryRow
              label="Total"
              value={total}
              total
            />
          </dl>
        </CardContent>
      </aside>
    </Card>
  )
}

function CheckoutItemRow({ item }: { item: CheckoutItem }) {
  return (
    <li className="flex items-center gap-3">
      <span className="media relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-2">
        <Image
          src={item.image}
          alt=""
          fill
          sizes="56px"
          className="object-cover"
        />
      </span>
      <span className="min-w-0 flex-1 text-sm">
        <span className="line-clamp-2 font-medium leading-snug">
          {item.name}
        </span>
        <span className="tnum text-caption text-muted-foreground">
          {item.variant ? `${item.variant} · ` : ''}Qty {item.quantity}
        </span>
      </span>
      <span className="tnum text-sm">{item.lineTotal}</span>
    </li>
  )
}
