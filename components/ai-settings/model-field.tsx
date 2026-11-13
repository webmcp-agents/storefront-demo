import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { type AiSettingsModel, CUSTOM_MODEL } from '@/hooks/use-ai-settings'
import { Controller } from 'react-hook-form'

/**
 * The provider's models, plus "Custom model ID…", which reveals a text field for any other ID. The form's `model` and
 * `customModel` fields.
 */
export function ModelField({ ai }: { ai: AiSettingsModel }) {
  return (
    <>
      <Controller
        name="model"
        control={ai.form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor={ai.ids.model}>Model</FieldLabel>
            <NativeSelect
              {...field}
              id={ai.ids.model}
              aria-invalid={fieldState.invalid || undefined}
            >
              {ai.spec.models.map((m) => (
                <NativeSelectOption
                  key={m.id}
                  value={m.id}
                >
                  {m.label}
                </NativeSelectOption>
              ))}
              <NativeSelectOption value={CUSTOM_MODEL}>Custom model ID…</NativeSelectOption>
            </NativeSelect>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      {ai.model === CUSTOM_MODEL && (
        <Controller
          name="customModel"
          control={ai.form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor={ai.ids.custom}>Model ID</FieldLabel>
              <Input
                {...field}
                id={ai.ids.custom}
                placeholder={ai.spec.models[0].id}
                autoComplete="off"
                spellCheck={false}
                aria-invalid={fieldState.invalid || undefined}
                aria-describedby={fieldState.invalid ? ai.ids.customError : undefined}
                className="font-mono"
              />
              <FieldError
                id={ai.ids.customError}
                errors={[fieldState.error]}
              />
            </Field>
          )}
        />
      )}
    </>
  )
}
