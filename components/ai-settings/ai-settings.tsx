'use client'

import { AiSettingsFooter } from '@/components/ai-settings/ai-settings-footer'
import { AiSettingsTrigger } from '@/components/ai-settings/ai-settings-trigger'
import { ApiKeyField } from '@/components/ai-settings/api-key-field'
import { KeyStorageNote } from '@/components/ai-settings/key-storage-note'
import { ModelField } from '@/components/ai-settings/model-field'
import { ProviderField } from '@/components/ai-settings/provider-field'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { FieldError, FieldGroup } from '@/components/ui/field'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAiSettings } from '@/hooks/use-ai-settings'
import { CircleCheck } from 'lucide-react'

/**
 * The header's key button and the sheet behind it: pick a provider and model and paste an API key for the shopping
 * assistant. The key goes to the server, which keeps it in an encrypted, httpOnly session cookie; the page never
 * sees it again.
 */
export function AiSettings() {
  const ai = useAiSettings()

  return (
    <Sheet open={ai.open} onOpenChange={ai.setOpen}>
      <AiSettingsTrigger configured={ai.configured} activeLabel={ai.activeLabel} />

      <SheetContent layer="top" closeLabel="Close AI settings">
        <SheetHeader>
          <SheetTitle>AI settings</SheetTitle>
          <SheetDescription>Use your own API key for the shopping assistant.</SheetDescription>
        </SheetHeader>

        <form onSubmit={ai.save} noValidate className="flex min-h-0 flex-1 flex-col">
          <FieldGroup className="flex-1 gap-6 overflow-y-auto overscroll-contain px-5 py-5">
            {ai.activeLabel && (
              <Alert role="status" className="border-0 bg-muted">
                <CircleCheck className="text-success" />
                <AlertTitle>Connected to {ai.activeLabel}</AlertTitle>
              </Alert>
            )}
            <ProviderField ai={ai} />
            <ModelField ai={ai} />
            <ApiKeyField ai={ai} />
            <FieldError
              id={ai.ids.rootError}
              errors={[ai.form.formState.errors.root]}
            />
            <KeyStorageNote />
          </FieldGroup>
          <AiSettingsFooter ai={ai} />
        </form>
      </SheetContent>
    </Sheet>
  )
}
