import { Skeleton } from '@/components/ui/skeleton'

export function ProductCardSkeleton() {
  return (
    <div
      className="flex flex-col gap-3"
      aria-hidden
    >
      <Skeleton className="aspect-4/5 rounded-card" />
      <div className="flex justify-between gap-3 px-0.5">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  )
}
