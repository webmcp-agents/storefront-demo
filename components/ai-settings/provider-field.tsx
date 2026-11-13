import { Badge } from '@/components/ui/badge'
import { Field, FieldContent, FieldLabel, FieldLegend, FieldSet, FieldTitle } from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { AiSettingsModel } from '@/hooks/use-ai-settings'
import { isAiProviderId } from '@/lib/ai/providers'
import { Controller } from 'react-hook-form'

/** One card per provider; "Key saved" marks the ones with a key in this session. The form's `provider` field. */
export function ProviderField({ ai }: { ai: AiSettingsModel }) {
  return (
    <Controller
      name="provider"
      control={ai.form.control}
      render={({ field }) => (
        <FieldSet>
          <FieldLegend variant="label">Provider</FieldLegend>
          <RadioGroup
            name={field.name}
            value={field.value}
            // Switching provider loads that provider's saved model, so it resets the form rather than just this field.
            onValueChange={(value) => isAiProviderId(value) && ai.setProvider(value)}
            className="grid-cols-2 gap-2"
          >
            {ai.providers.map((p) => (
              <FieldLabel
                key={p.id}
                htmlFor={ai.ids.provider(p.id)}
              >
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>
                      {p.label}
                      {ai.isSaved(p.id) && <Badge variant="secondary">Key saved</Badge>}
                    </FieldTitle>
                  </FieldContent>
                  <RadioGroupItem
                    value={p.id}
                    id={ai.ids.provider(p.id)}
                  />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </FieldSet>
      )}
    />
  )
}
