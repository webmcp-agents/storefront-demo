import { ToggleList } from '@/components/shared/toggle-list'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Field, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { OrdersPageModel } from '@/hooks/use-orders-page'

/** The agent's list_orders tool targets this section and its field labels: keep both. */
export function OrderFilters({ page }: { page: OrdersPageModel }) {
  return (
    <Card
      asChild
      className="mb-6 grid gap-5 p-4 sm:p-5 md:grid-cols-2 lg:grid-cols-4"
    >
      <section aria-label="Order filters">
        <FieldSet className="gap-0 md:col-span-2 lg:col-span-4">
          <FieldLegend
            variant="label"
            className="mb-2"
          >
            Status
          </FieldLegend>
          <ToggleList
            options={page.statuses}
            toggleClassName="capitalize"
          />
        </FieldSet>

        <Field className="min-w-0">
          <FieldLabel htmlFor="o-from">Placed from</FieldLabel>
          <Input
            id="o-from"
            name="from"
            type="date"
            max={page.dates.max}
            value={page.dates.from}
            onChange={(e) => page.dates.setFrom(e.target.value)}
          />
        </Field>
        <Field className="min-w-0">
          <FieldLabel htmlFor="o-to">Placed to</FieldLabel>
          <Input
            id="o-to"
            name="to"
            type="date"
            max={page.dates.max}
            value={page.dates.to}
            onChange={(e) => page.dates.setTo(e.target.value)}
          />
        </Field>
        <Field className="min-w-0">
          <FieldLabel htmlFor="o-product">Product</FieldLabel>
          <Input
            id="o-product"
            name="product"
            type="search"
            placeholder="e.g. jacket"
            value={page.product.value}
            onChange={(e) => page.product.set(e.target.value)}
          />
        </Field>
        <div className="grid min-w-0 grid-cols-2 gap-2">
          <Field className="min-w-0">
            <FieldLabel htmlFor="o-min">Min total</FieldLabel>
            <Input
              id="o-min"
              name="minTotal"
              type="number"
              inputMode="numeric"
              placeholder="$0"
              value={page.totals.min}
              onChange={(e) => page.totals.setMin(e.target.value)}
            />
          </Field>
          <Field className="min-w-0">
            <FieldLabel htmlFor="o-max">Max total</FieldLabel>
            <Input
              id="o-max"
              name="maxTotal"
              type="number"
              inputMode="numeric"
              placeholder="Any"
              value={page.totals.max}
              onChange={(e) => page.totals.setMax(e.target.value)}
            />
          </Field>
        </div>

        <ToggleList
          options={page.dates.presets}
          className="items-center md:col-span-2 lg:col-span-4"
        >
          <Button
            variant="ghost"
            size="sm"
            className="ms-auto"
            disabled={page.activeCount === 0}
            onClick={page.clearAll}
          >
            Clear filters
          </Button>
        </ToggleList>
      </section>
    </Card>
  )
}
