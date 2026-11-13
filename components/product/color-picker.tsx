import { ColorSwatchToggle } from '@/components/shared/color-swatch-toggle'
import { FieldLegend, FieldSet } from '@/components/ui/field'
import type { ProductPurchaseModel } from '@/hooks/use-product-purchase'
import type { PurchaseValues } from '@/lib/schemas/purchase'
import { type Control, Controller } from 'react-hook-form'

/** The product's colors as swatches; the form's `color` field. */
export function ColorPicker({
  control,
  colors,
}: {
  control: Control<PurchaseValues>
  colors: ProductPurchaseModel['colors']
}) {
  return (
    <Controller
      name="color"
      control={control}
      render={({ field }) => (
        <FieldSet className="gap-0">
          <FieldLegend
            variant="label"
            className="mb-2.5 text-sm"
          >
            Color: <span className="font-normal text-muted-foreground">{field.value}</span>
          </FieldLegend>
          <ul className="flex flex-wrap gap-3">
            {colors.map((c) => (
              <li key={c.name}>
                <ColorSwatchToggle
                  size="lg"
                  name={c.name}
                  label={`Color ${c.name}`}
                  hex={c.hex}
                  darkMark={c.darkMark}
                  pressed={field.value === c.name}
                  onToggle={() => field.onChange(c.name)}
                />
              </li>
            ))}
          </ul>
        </FieldSet>
      )}
    />
  )
}
