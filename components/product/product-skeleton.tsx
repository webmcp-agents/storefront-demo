import { LoadingRegion } from '@/components/ui/loading-region'
import { Skeleton } from '@/components/ui/skeleton'

export function ProductSkeleton() {
  return (
    <LoadingRegion
      label="Loading product"
      className="mx-auto block max-w-330 px-4 py-6 sm:px-6 lg:py-10"
    >
      <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <Skeleton className="aspect-4/5 rounded-[28px]" />
        <div className="space-y-4">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-24" />
          <Skeleton className="h-12" />
        </div>
      </div>
    </LoadingRegion>
  )
}
