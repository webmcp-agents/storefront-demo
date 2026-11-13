import { ProductCardSkeleton } from '@/components/shared/product-card-skeleton'
import { LoadingRegion } from '@/components/ui/loading-region'
import { Skeleton } from '@/components/ui/skeleton'

export function ShopSkeleton() {
  return (
    <LoadingRegion
      label="Loading products"
      className="mx-auto block max-w-330 px-4 pb-8 pt-8 sm:px-6"
    >
      <Skeleton className="mb-2 h-10 w-56" />
      <Skeleton className="mb-8 h-4 w-80 max-w-full" />
      <div className="grid gap-8 lg:grid-cols-[264px_minmax(0,1fr)]">
        <div className="hidden space-y-6 lg:block">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-24"
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </LoadingRegion>
  )
}
