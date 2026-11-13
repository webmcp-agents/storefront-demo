'use client'

import { ProductBreadcrumb } from '@/components/product/product-breadcrumb'
import { ProductImage } from '@/components/product/product-image'
import { ProductPerks } from '@/components/product/product-perks'
import { ProductSpecs } from '@/components/product/product-specs'
import { ProductSummary } from '@/components/product/product-summary'
import { PurchaseForm } from '@/components/product/purchase-form'
import { Separator } from '@/components/ui/separator'
import { useProductPurchase } from '@/hooks/use-product-purchase'
import type { Product } from '@/lib/data/types'

export function ProductDetail({ product }: { product: Product }) {
  const buy = useProductPurchase(product)

  return (
    <div className="mx-auto max-w-330 px-4 py-6 sm:px-6 lg:py-10">
      <ProductBreadcrumb
        name={product.name}
        category={buy.category}
      />

      <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <ProductImage product={product} />

        <div className="flex min-w-0 flex-col gap-8">
          <ProductSummary
            product={product}
            buy={buy}
          />
          <p className="max-w-prose text-pretty text-body leading-relaxed text-muted-foreground">
            {product.description}
          </p>
          <PurchaseForm
            productName={product.name}
            buy={buy}
          />
          <Separator />
          <ProductPerks />
          <Separator />
          <ProductSpecs
            details={product.details}
            stockLabel={buy.stockLabel}
          />
        </div>
      </div>
    </div>
  )
}
