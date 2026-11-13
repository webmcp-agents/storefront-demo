'use client'

import { ToggleList } from '@/components/shared/toggle-list'
import { ColorFilter } from '@/components/shop/color-filter'
import { DateAddedFilter } from '@/components/shop/date-added-filter'
import { FilterGroup } from '@/components/shop/filter-group'
import { PriceFilter } from '@/components/shop/price-filter'
import { SizeFilter } from '@/components/shop/size-filter'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'
import { useProductFilterPanel } from '@/hooks/use-product-filter-panel'
import type { ProductFilters } from '@/lib/queries'
import { cn } from '@/lib/utils'

export function FilterPanel({
  filters,
  className,
  hideTitle = false,
}: {
  filters: ProductFilters
  className?: string
  hideTitle?: boolean
}) {
  const panel = useProductFilterPanel(filters)

  return (
    <div className={cn('flex flex-col', className)}>
      <div
        className={cn(
          'mb-4 flex items-center',
          hideTitle ? 'justify-end' : 'justify-between',
        )}
      >
        {!hideTitle && (
          <h2 className="text-base font-semibold tracking-tight">Filters</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          disabled={panel.activeCount === 0}
          onClick={panel.clearAll}
        >
          Clear all
        </Button>
      </div>

      <div>
        <FilterGroup title="Category">
          <ToggleList options={panel.categories} />
        </FilterGroup>
        <Separator />
        <FilterGroup title="Price">
          <PriceFilter price={panel.price} />
        </FilterGroup>
        <Separator />
        <FilterGroup title="Discount">
          <ToggleList options={panel.discounts} />
        </FilterGroup>
        <Separator />
        <FilterGroup title="Date added">
          <DateAddedFilter added={panel.added} />
        </FilterGroup>
        <Separator />
        <FilterGroup title="Color">
          <ColorFilter colors={panel.colors} />
        </FilterGroup>
        <Separator />
        <FilterGroup title="Size">
          <SizeFilter groups={panel.sizeGroups} />
        </FilterGroup>
        <Separator />
        <FilterGroup title="Availability">
          <Toggle
            variant="outline"
            pressed={panel.inStock.pressed}
            onClick={panel.inStock.toggle}
          >
            In stock only
          </Toggle>
        </FilterGroup>
      </div>
    </div>
  )
}
