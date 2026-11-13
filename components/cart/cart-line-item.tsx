import { CartQuantity } from '@/components/cart/cart-quantity'
import { Price } from '@/components/shared/price'
import { Button } from '@/components/ui/button'
import type { CartItemModel } from '@/hooks/use-cart-page'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function CartLineItem({ item }: { item: CartItemModel }) {
  return (
    <li className="animate-rise flex gap-4 p-4 sm:p-5">
      {/* Duplicate of the name link below: out of the tab order and hidden from AT. */}
      <Link
        href={item.href}
        tabIndex={-1}
        aria-hidden
        className="media relative size-24 shrink-0 overflow-hidden rounded-xl bg-surface-2 sm:size-28"
      >
        <Image
          src={item.product.image}
          alt=""
          fill
          sizes="112px"
          className="object-cover"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-body font-medium leading-snug">
              <Link
                href={item.href}
                className="hover:underline"
              >
                {item.product.name}
              </Link>
            </h2>
            <p className="mt-0.5 text-caption text-muted-foreground">
              {item.variant}
            </p>
          </div>
          <p className="tnum text-body font-medium">{item.lineTotal}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CartQuantity item={item} />
          <div className="flex items-center gap-3">
            <Price
              product={item.product}
              className="hidden text-muted-foreground sm:flex"
            />
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove ${item.product.name}`}
              onClick={item.remove}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </div>
    </li>
  )
}
