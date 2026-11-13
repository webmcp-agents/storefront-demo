import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import type { AiSettingsModel } from '@/hooks/use-ai-settings'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { Controller } from 'react-hook-form'

/**
 * The key input with a show/hide toggle; its help is the saved key's last digits, or where to get a key. The form's
 * `apiKey` field.
 */
export function ApiKeyField({ ai }: { ai: AiSettingsModel }) {
  const { ids } = ai
  return (
    <Controller
      name="apiKey"
      control={ai.form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined}>
          <FieldLabel htmlFor={ids.key}>API key</FieldLabel>
          <InputGroup>
            <InputGroupInput
              {...field}
              id={ids.key}
              type={ai.showKey ? 'text' : 'password'}
              placeholder={ai.savedKeyHint ? `•••• ${ai.savedKeyHint}` : ai.spec.keyPlaceholder}
              autoComplete="off"
              spellCheck={false}
              aria-describedby={`${ids.keyHelp}${fieldState.invalid ? ` ${ids.keyError}` : ''}`}
              aria-invalid={fieldState.invalid || undefined}
              className="font-mono"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-sm"
                onClick={ai.toggleShowKey}
                aria-label={ai.showKey ? 'Hide API key' : 'Show API key'}
                aria-pressed={ai.showKey}
              >
                {ai.showKey ? <EyeOff /> : <Eye />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription id={ids.keyHelp}>
            {ai.savedKeyHint ? (
              <>Saved key ending in {ai.savedKeyHint}. Leave this empty to keep it.</>
            ) : (
              <Button
                asChild
                variant="link"
                size="xs"
                className="h-auto px-0 text-caption text-muted-foreground underline"
              >
                <Link
                  href={ai.spec.keysUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get your API key from {ai.spec.label}
                </Link>
              </Button>
            )}
          </FieldDescription>
          <FieldError
            id={ids.keyError}
            errors={[fieldState.error]}
          />
        </Field>
      )}
    />
  )
}
