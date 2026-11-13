import { ProductCard } from '@/components/shared/product-card'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Product } from '@/lib/data/types'
import Link from 'next/link'

export function SaleSection({
  products,
  maxDiscount,
}: {
  products: Product[]
  maxDiscount: number
}) {
  return (
    <Card
      asChild
      className="my-12 gap-6 rounded-[28px] border-0 py-5 shadow-card sm:py-8"
    >
      <section aria-labelledby="sale">
        <CardHeader className="items-end sm:px-8">
          <CardDescription className="text-sm font-medium text-brand">
            Up to {maxDiscount}% off
          </CardDescription>
          <CardTitle
            asChild
            className="text-2xl"
          >
            <h2 id="sale">Seasonal sale</h2>
          </CardTitle>
          <CardAction className="self-end">
            <Button
              asChild
              variant="outline"
              size="sm"
            >
              <Link href="/shop?sale=1&sort=discount">Shop all sale</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-4 gap-y-10 sm:px-8 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
            />
          ))}
        </CardContent>
      </section>
    </Card>
  )
}
