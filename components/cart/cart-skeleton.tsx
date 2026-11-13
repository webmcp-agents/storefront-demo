import { LoadingRegion } from '@/components/ui/loading-region'
import { Skeleton } from '@/components/ui/skeleton'

export function CartSkeleton() {
  return (
    <LoadingRegion
      label="Loading cart"
      className="mx-auto block max-w-275 px-4 py-10 sm:px-6"
    >
      <Skeleton className="mb-8 h-10 w-40" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <Skeleton
              key={i}
              className="h-32"
            />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    </LoadingRegion>
  )
}
