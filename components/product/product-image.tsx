import type { Product } from '@/lib/data/types'
import Image from 'next/image'

/** The product photo; sticks beside the details on wide screens. */
export function ProductImage({
  product,
}: {
  product: Pick<Product, 'image' | 'name'>
}) {
  return (
    <div className="media relative aspect-4/5 overflow-hidden rounded-[28px] bg-surface-2 lg:sticky lg:top-24 lg:self-start">
      <Image
        src={product.image}
        alt={product.name}
        fill
        priority
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="object-cover"
      />
    </div>
  )
}
