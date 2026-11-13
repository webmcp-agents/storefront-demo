import { LoadingRegion } from '@/components/ui/loading-region'
import { Skeleton } from '@/components/ui/skeleton'

export function OrdersSkeleton() {
  return (
    <LoadingRegion
      label="Loading orders"
      className="mx-auto block max-w-275 px-4 py-12 sm:px-6"
    >
      <Skeleton className="mb-8 h-10 w-56" />
      <Skeleton className="mb-6 h-48" />
      <div className="grid gap-3">
        {[0, 1, 2].map((i) => (
          <Skeleton
            key={i}
            className="h-36"
          />
        ))}
      </div>
    </LoadingRegion>
  )
}
