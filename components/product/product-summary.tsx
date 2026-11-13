import { Price } from '@/components/shared/price'
import { Badge } from '@/components/ui/badge'
import type { ProductPurchaseModel } from '@/hooks/use-product-purchase'
import type { Product } from '@/lib/data/types'
import { Star } from 'lucide-react'

/** Category, name, price and rating. */
export function ProductSummary({
  product,
  buy,
}: {
  product: Product
  buy: ProductPurchaseModel
}) {
  return (
    <header>
      {buy.category && (
        <p className="text-sm text-muted-foreground">{buy.category.name}</p>
      )}
      <h1 className="mt-1 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {product.name}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Price
          product={product}
          size="lg"
        />
        {buy.discount > 0 && (
          <Badge variant="brand-soft">Save {buy.discount}%</Badge>
        )}
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
        <Star className="size-4 fill-foreground text-foreground" />
        <span className="tnum font-medium text-foreground">{buy.rating}</span>
        <span className="tnum">({product.reviews} reviews)</span>
        <span aria-hidden>·</span>
        <span>Added {buy.addedOn}</span>
      </p>
    </header>
  )
}
