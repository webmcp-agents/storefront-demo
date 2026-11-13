import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { SearchX } from 'lucide-react'

/** No products match the filters. */
export function ShopEmpty({ onClear }: { onClear: () => void }) {
  return (
    <Empty className="animate-fade mt-10 rounded-card border border-dashed border-border-strong px-6 py-20">
      <EmptyHeader>
        <EmptyMedia>
          <SearchX className="size-8 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle className="font-semibold">No products match</EmptyTitle>
        <EmptyDescription className="text-pretty">
          Remove a filter or widen the price range. A size and a color together
          can leave nothing.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          variant="outline"
          onClick={onClear}
        >
          Clear all filters
        </Button>
      </EmptyContent>
    </Empty>
  )
}
