import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { CheckoutModel, DeliveryFieldSpec } from '@/hooks/use-checkout'
import type { DeliveryDetails } from '@/lib/schemas/checkout'
import { Lock } from 'lucide-react'
import { type Control, Controller } from 'react-hook-form'

export function DeliveryForm({
  form,
  fields,
  total,
  onSubmit,
}: {
  form: CheckoutModel['form']
  fields: DeliveryFieldSpec[]
  total: string
  onSubmit: CheckoutModel['submit']
}) {
  return (
    <Card
      asChild
      className="sm:py-6"
    >
      <form
        onSubmit={onSubmit}
        noValidate
        aria-labelledby="delivery"
      >
        <CardHeader className="sm:px-6">
          <CardTitle asChild>
            <h2 id="delivery">Delivery details</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:px-6">
          {fields.map((f) => (
            <DeliveryFieldInput
              key={f.name}
              control={form.control}
              spec={f}
            />
          ))}
          <Button
            type="submit"
            size="lg"
            variant="brand"
            className="mt-1"
            disabled={form.formState.isSubmitting}
          >
            <Lock /> Place order · <span className="tnum">{total}</span>
          </Button>
          <p className="text-center text-caption text-muted-foreground">
            Demo store: no payment is taken.
          </p>
        </CardContent>
      </form>
    </Card>
  )
}

function DeliveryFieldInput({ control, spec }: { control: Control<DeliveryDetails>; spec: DeliveryFieldSpec }) {
  const errorId = `${spec.name}-error`
  return (
    <Controller
      name={spec.name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined}>
          <FieldLabel htmlFor={spec.name}>{spec.label}</FieldLabel>
          <Input
            {...field}
            id={spec.name}
            type={spec.type}
            autoComplete={spec.autoComplete}
            aria-invalid={fieldState.invalid || undefined}
            aria-describedby={fieldState.invalid ? errorId : undefined}
          />
          {/* linked to its input by aria-describedby; no alert role, so several errors don't talk over each other */}
          <FieldError
            id={errorId}
            role={undefined}
            errors={[fieldState.error]}
          />
        </Field>
      )}
    />
  )
}
