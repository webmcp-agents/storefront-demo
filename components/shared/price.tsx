import type { Product } from '@/lib/data/types'
import { discountPercent, formatPrice } from '@/lib/queries'
import { cn } from '@/lib/utils'

export function Price({
  product,
  className,
  size = 'md',
}: {
  product: Pick<Product, 'price' | 'compareAtPrice'>
  className?: string
  size?: 'md' | 'lg'
}) {
  const onSale = discountPercent(product) > 0 && product.compareAtPrice
  return (
    <p
      className={cn(
        'tnum flex items-baseline gap-2 whitespace-nowrap',
        className,
      )}
    >
      <span
        className={cn(
          'font-medium',
          size === 'lg' ? 'text-2xl tracking-tight' : 'text-sm',
        )}
      >
        {onSale && <span className="sr-only">Now </span>}
        {formatPrice(product.price)}
      </span>
      {onSale ? (
        <s
          className={cn(
            'text-muted-foreground',
            size === 'lg' ? 'text-base' : 'text-caption',
          )}
        >
          <span className="sr-only">Was </span>
          {formatPrice(product.compareAtPrice!)}
        </s>
      ) : null}
    </p>
  )
}
