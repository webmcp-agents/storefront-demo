import { FreeShippingProgress } from '@/components/cart/free-shipping-progress'
import { SummaryRow } from '@/components/shared/summary-row'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { CartPageModel } from '@/hooks/use-cart-page'
import Link from 'next/link'

export function CartSummary({
  summary,
  freeShipping,
}: Pick<CartPageModel, 'summary' | 'freeShipping'>) {
  return (
    <Card
      asChild
      className="gap-4 shadow-card lg:sticky lg:top-24"
    >
      <aside aria-labelledby="summary">
        <CardHeader>
          <CardTitle asChild>
            <h2 id="summary">Order summary</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FreeShippingProgress {...freeShipping} />
          <dl className="tnum space-y-2.5 text-sm">
            <SummaryRow
              label="Subtotal"
              value={summary.subtotal}
            />
            <SummaryRow
              label="Shipping"
              value={summary.shipping}
            />
          </dl>
          <Separator />
          <dl className="tnum">
            <SummaryRow
              label="Total"
              value={summary.total}
              total
            />
          </dl>
          <Button
            asChild
            size="lg"
            variant="brand"
            className="mt-1 w-full"
          >
            <Link href="/checkout">Checkout</Link>
          </Button>
        </CardContent>
      </aside>
    </Card>
  )
}
