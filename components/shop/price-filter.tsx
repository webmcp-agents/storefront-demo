import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import type { FilterPanelModel } from '@/hooks/use-product-filter-panel'

/** A two-thumb slider, with min and max inputs for typing exact prices. */
export function PriceFilter({ price }: { price: FilterPanelModel['price'] }) {
  return (
    <>
      <Slider
        min={price.bounds.min}
        max={price.bounds.max}
        step={1}
        minStepsBetweenThumbs={1}
        value={price.range}
        thumbLabels={['Minimum price', 'Maximum price']}
        onValueChange={(v) => price.setRange([v[0], v[1]])}
      />
      <div className="mt-3 flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <Label
            htmlFor="price-min"
            className="sr-only"
          >
            Min price
          </Label>
          <Input
            id="price-min"
            name="minPrice"
            type="number"
            inputMode="numeric"
            placeholder={`$${price.bounds.min}`}
            value={price.min}
            onChange={(e) => price.setMin(e.target.value)}
          />
        </div>
        <span
          aria-hidden
          className="text-muted-foreground"
        >
          –
        </span>
        <div className="min-w-0 flex-1">
          <Label
            htmlFor="price-max"
            className="sr-only"
          >
            Max price
          </Label>
          <Input
            id="price-max"
            name="maxPrice"
            type="number"
            inputMode="numeric"
            placeholder={`$${price.bounds.max}`}
            value={price.max}
            onChange={(e) => price.setMax(e.target.value)}
          />
        </div>
      </div>
    </>
  )
}
