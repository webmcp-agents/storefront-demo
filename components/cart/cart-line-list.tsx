import { CartLineItem } from '@/components/cart/cart-line-item'
import { Card } from '@/components/ui/card'
import type { CartItemModel } from '@/hooks/use-cart-page'

export function CartLineList({ items }: { items: CartItemModel[] }) {
  return (
    // rows divided by divide-y: a Separator is a div, which can't sit between <li>s
    <Card asChild className="gap-0 divide-y divide-border py-0">
      <ul>
        {items.map((item) => (
          <CartLineItem key={item.key} item={item} />
        ))}
      </ul>
    </Card>
  )
}
