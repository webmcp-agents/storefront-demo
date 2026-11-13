import { FilterPanel } from '@/components/shop/filter-panel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { ShopCatalogModel } from '@/hooks/use-shop-catalog'
import { SlidersHorizontal } from 'lucide-react'

/** The filter panel in a bottom sheet, for screens too narrow for the sidebar. */
export function FiltersSheet({ shop }: { shop: ShopCatalogModel }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="lg:hidden"
          aria-label="Open filters"
        >
          <SlidersHorizontal />
          Filters
          {shop.activeCount > 0 && (
            <Badge
              variant="brand"
              aria-hidden
            >
              {shop.activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        closeLabel="Close filters"
        aria-describedby={undefined}
      >
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          <FilterPanel
            filters={shop.filters}
            hideTitle
          />
        </div>
        <SheetFooter className="gap-3 p-4">
          <Button
            variant="outline"
            className="flex-1"
            disabled={shop.activeCount === 0}
            onClick={shop.clearAll}
          >
            Clear all
          </Button>
          <SheetClose asChild>
            <Button className="flex-2">{shop.showResultsLabel}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
