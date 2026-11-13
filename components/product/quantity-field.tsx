import { Field, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { clampQuantity, type ProductPurchaseModel } from '@/hooks/use-product-purchase'
import type { PurchaseValues } from '@/lib/schemas/purchase'
import { Minus, Plus } from 'lucide-react'
import { type Control, Controller } from 'react-hook-form'

/** − [n] +, where the number can also be typed; the form's `quantity` field. */
export function QuantityField({
  control,
  bounds,
}: {
  control: Control<PurchaseValues>
  bounds: ProductPurchaseModel['quantityBounds']
}) {
  return (
    <Controller
      name="quantity"
      control={control}
      render={({ field }) => (
        <Field className="w-auto gap-2.5">
          <FieldLabel
            htmlFor="quantity"
            className="text-sm"
          >
            Quantity
          </FieldLabel>
          <InputGroup className="h-12 w-auto rounded-full px-1.5">
            <InputGroupAddon className="ps-0">
              <InputGroupButton
                size="icon-sm"
                className="rounded-full"
                aria-label="Decrease quantity"
                disabled={field.value <= bounds.min}
                onClick={() => field.onChange(clampQuantity(field.value - 1))}
              >
                <Minus />
              </InputGroupButton>
            </InputGroupAddon>
            <InputGroupInput
              ref={field.ref}
              id="quantity"
              name={field.name}
              type="number"
              inputMode="numeric"
              min={bounds.min}
              max={bounds.max}
              value={field.value}
              onChange={(e) => field.onChange(clampQuantity(e.target.valueAsNumber))}
              onBlur={field.onBlur}
              className="tnum w-12 flex-none px-0 text-center"
            />
            <InputGroupAddon
              align="inline-end"
              className="pe-0"
            >
              <InputGroupButton
                size="icon-sm"
                className="rounded-full"
                aria-label="Increase quantity"
                disabled={field.value >= bounds.max}
                onClick={() => field.onChange(clampQuantity(field.value + 1))}
              >
                <Plus />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      )}
    />
  )
}
