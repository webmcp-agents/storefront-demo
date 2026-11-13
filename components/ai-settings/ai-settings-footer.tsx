import { Button } from '@/components/ui/button'
import { SheetFooter } from '@/components/ui/sheet'
import type { AiSettingsModel } from '@/hooks/use-ai-settings'

/** Remove (only with a saved key) and Save, each with its pending label. */
export function AiSettingsFooter({ ai }: { ai: AiSettingsModel }) {
  return (
    <SheetFooter>
      {ai.savedKeyHint && (
        <Button variant="destructive" onClick={ai.remove} disabled={ai.busy}>
          {ai.pending === 'remove' ? 'Removing…' : `Remove ${ai.spec.label} key`}
        </Button>
      )}
      <Button type="submit" className="ms-auto" disabled={ai.busy}>
        {ai.pending === 'save' ? 'Saving…' : 'Save settings'}
      </Button>
    </SheetFooter>
  )
}
