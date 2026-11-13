import { ProductGrid } from '@/components/shared/product-grid'
import type { Product } from '@/lib/data/types'

/** "You may also like": nothing renders when there are no related products. */
export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null
  return (
    <section
      aria-labelledby="related"
      className="mx-auto max-w-330 px-4 pt-16 sm:px-6"
    >
      <h2
        id="related"
        className="mb-6 text-2xl font-semibold tracking-tight"
      >
        You may also like
      </h2>
      <ProductGrid products={products} />
    </section>
  )
}
