import { Price } from '@/components/shared/price'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Product } from '@/lib/data/types'
import { colorSwatches, productFlags } from '@/lib/queries'
import Image from 'next/image'
import Link from 'next/link'

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product
  priority?: boolean
}) {
  return (
    <Card
      asChild
      className="group relative gap-3 rounded-none border-0 bg-transparent py-0"
    >
      <article>
        <ProductCardImage
          product={product}
          priority={priority}
        />
        <div className="flex items-start justify-between gap-3 px-0.5">
          <div className="min-w-0">
            <ProductCardName product={product} />
            <ProductCardSwatches product={product} />
          </div>
          <Price
            product={product}
            className="flex-col items-end gap-0 text-end [&>s]:order-2"
          />
        </div>
      </article>
    </Card>
  )
}

/** The image link is the card's one tab stop; its accessible name is the product name (open_product targets it). */
function ProductCardImage({
  product,
  priority,
}: {
  product: Product
  priority: boolean
}) {
  const { discount, isNew, lowStock } = productFlags(product)
  return (
    <Link
      href={`/product/${product.slug}`}
      className="media relative block aspect-4/5 overflow-hidden rounded-card bg-surface-2"
    >
      <Image
        src={product.image}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 1536px) 22vw, (min-width: 768px) 30vw, 48vw"
        className="zoom-img object-cover"
      />
      <span className="absolute inset-s-3 top-3 flex gap-1.5">
        {discount > 0 && (
          <Badge variant="brand">
            <span className="sr-only">Save </span>−{discount}%
          </Badge>
        )}
        {isNew && (
          <Badge
            variant="secondary"
            className="bg-surface text-foreground"
          >
            New
          </Badge>
        )}
      </span>
      {lowStock && (
        <Badge
          variant="outline"
          className="absolute bottom-3 inset-s-3 border-0 bg-surface/90 text-foreground backdrop-blur"
        >
          Only {product.stock} left
        </Badge>
      )}
      <span className="sr-only">{product.name}</span>
    </Link>
  )
}

/**
 * Stretched over the card so the whole card is a pointer target; hidden from keyboard and AT (the image link already
 * carries the name). The full name lives on the product page.
 */
function ProductCardName({ product }: { product: Product }) {
  return (
    <h3 className="truncate text-sm font-medium">
      <Link
        href={`/product/${product.slug}`}
        className="after:absolute after:inset-0 after:content-['']"
        tabIndex={-1}
        aria-hidden
      >
        {product.name}
      </Link>
    </h3>
  )
}

function ProductCardSwatches({ product }: { product: Product }) {
  const { swatches, moreColors } = colorSwatches(product)
  return (
    <ul
      className="mt-1.5 flex items-center gap-1"
      aria-label="Colors"
    >
      {swatches.map((c) => (
        <Tooltip key={c.name}>
          <TooltipTrigger asChild>
            <li
              className="size-3 rounded-full border border-border-strong"
              style={{ background: c.hex }}
            >
              <span className="sr-only">{c.name}</span>
            </li>
          </TooltipTrigger>
          <TooltipContent aria-hidden>{c.name}</TooltipContent>
        </Tooltip>
      ))}
      {moreColors > 0 && (
        <li className="tnum text-micro text-muted-foreground">
          +{moreColors}
          <span className="sr-only"> more</span>
        </li>
      )}
    </ul>
  )
}
