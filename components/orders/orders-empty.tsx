import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { ClipboardList, SearchX } from 'lucide-react'

/** No orders match the filters (or there are no orders at all). */
export function OrdersEmpty({
  hasOrders,
  onClear,
}: {
  hasOrders: boolean
  onClear: () => void
}) {
  const Icon = hasOrders ? SearchX : ClipboardList
  return (
    <Empty className="animate-fade rounded-card border border-dashed border-border-strong px-6 py-20">
      <EmptyHeader>
        <EmptyMedia>
          <Icon className="size-8 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle className="font-semibold">No orders match</EmptyTitle>
        <EmptyDescription className="text-pretty">
          Try a wider date range or fewer filters.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          variant="outline"
          onClick={onClear}
        >
          Clear filters
        </Button>
      </EmptyContent>
    </Empty>
  )
}
