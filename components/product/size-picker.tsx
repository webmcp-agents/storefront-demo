import { FieldLegend, FieldSet } from '@/components/ui/field'
import { Toggle } from '@/components/ui/toggle'
import type { PurchaseValues } from '@/lib/schemas/purchase'
import { type Control, Controller } from 'react-hook-form'

/** The product's sizes as toggles; the form's `size` field. */
export function SizePicker({
  control,
  sizes,
  errorId,
}: {
  control: Control<PurchaseValues>
  sizes: string[]
  /** The id of the "pick a size" error, while it shows. */
  errorId?: string
}) {
  return (
    <Controller
      name="size"
      control={control}
      render={({ field, fieldState }) => (
        <FieldSet
          className="gap-0"
          data-invalid={fieldState.invalid || undefined}
          aria-invalid={fieldState.invalid || undefined}
          aria-describedby={errorId}
        >
          <FieldLegend
            variant="label"
            className="mb-2.5 text-sm"
          >
            Size: <span className="font-normal text-muted-foreground">{field.value ?? 'Select a size'}</span>
          </FieldLegend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <Toggle
                key={s}
                variant="outline"
                className="h-11 min-w-14"
                pressed={field.value === s}
                aria-label={`Size ${s}`}
                onClick={() => field.onChange(s)}
              >
                {s}
              </Toggle>
            ))}
          </div>
        </FieldSet>
      )}
    />
  )
}
