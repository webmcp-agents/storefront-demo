import { LoadingRegion } from '@/components/ui/loading-region'
import { Skeleton } from '@/components/ui/skeleton'

export function CheckoutSkeleton() {
  return (
    <LoadingRegion
      label="Loading checkout"
      className="mx-auto block max-w-250 px-4 py-10 sm:px-6"
    >
      <Skeleton className="mb-8 h-10 w-48" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Skeleton className="h-80" />
        <Skeleton className="h-64" />
      </div>
    </LoadingRegion>
  )
}
