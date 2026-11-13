import { LoadingRegion } from '@/components/ui/loading-region'
import { Skeleton } from '@/components/ui/skeleton'

/** Shown while the route resolves its params and while the browser's saved orders load. */
export function OrderDetailSkeleton() {
  return (
    <LoadingRegion
      label="Loading order"
      className="mx-auto block max-w-225 px-4 py-12"
    >
      <Skeleton className="h-64" />
    </LoadingRegion>
  )
}
