import { SectionHeader } from '@/components/home/section-header'
import { ProductGrid } from '@/components/shared/product-grid'
import type { Product } from '@/lib/data/types'

export function NewInSection({ products }: { products: Product[] }) {
  return (
    <section
      aria-labelledby="new"
      className="py-12"
    >
      <SectionHeader
        id="new"
        title="New in"
        href="/shop?sort=newest"
        linkLabel="View all new"
      />
      <ProductGrid products={products} />
    </section>
  )
}
