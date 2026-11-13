import { AddToCartButton } from '@/components/product/add-to-cart-button'
import { ColorPicker } from '@/components/product/color-picker'
import { QuantityField } from '@/components/product/quantity-field'
import { SizePicker } from '@/components/product/size-picker'
import { Button } from '@/components/ui/button'
import type { ProductPurchaseModel } from '@/hooks/use-product-purchase'
import Link from 'next/link'

const ERROR_ID = 'add-error'

/** Color, size and quantity, then add to cart. */
export function PurchaseForm({
  productName,
  buy,
}: {
  productName: string
  buy: ProductPurchaseModel
}) {
  const { control } = buy.form
  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={buy.submit}
      noValidate
    >
      {buy.colors.length > 0 && (
        <ColorPicker
          control={control}
          colors={buy.colors}
        />
      )}
      {buy.sizes.length > 0 && (
        <SizePicker
          control={control}
          sizes={buy.sizes}
          errorId={buy.error ? ERROR_ID : undefined}
        />
      )}

      <div className="flex flex-wrap items-end gap-3">
        <QuantityField
          control={control}
          bounds={buy.quantityBounds}
        />
        <AddToCartButton added={buy.added} />
      </div>

      {/* Rendered empty up front so the first message is announced; sr-only while empty takes no layout space. */}
      <p
        id={ERROR_ID}
        role="alert"
        className="text-sm text-brand empty:sr-only"
      >
        {buy.error}
      </p>
      <p
        role="status"
        className="sr-only"
      >
        {buy.added ? `Added ${productName} to your cart.` : ''}
      </p>

      {buy.added && (
        <Button
          asChild
          variant="outline"
          className="animate-rise w-fit"
        >
          <Link href="/cart">View cart</Link>
        </Button>
      )}
    </form>
  )
}
