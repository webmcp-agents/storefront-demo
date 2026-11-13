import { ToggleList } from '@/components/shared/toggle-list'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { FilterPanelModel } from '@/hooks/use-product-filter-panel'

/** Presets ("Last 7 days"…) and a from/to date range. */
export function DateAddedFilter({
  added,
}: {
  added: FilterPanelModel['added']
}) {
  return (
    <>
      <ToggleList options={added.presets} />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Field className="min-w-0">
          <FieldLabel
            htmlFor="added-from"
            className="text-muted-foreground"
          >
            Added from
          </FieldLabel>
          <Input
            id="added-from"
            name="addedFrom"
            type="date"
            max={added.max}
            value={added.from}
            onChange={(e) => added.setFrom(e.target.value)}
          />
        </Field>
        <Field className="min-w-0">
          <FieldLabel
            htmlFor="added-to"
            className="text-muted-foreground"
          >
            Added to
          </FieldLabel>
          <Input
            id="added-to"
            name="addedTo"
            type="date"
            max={added.max}
            value={added.to}
            onChange={(e) => added.setTo(e.target.value)}
          />
        </Field>
      </div>
    </>
  )
}
