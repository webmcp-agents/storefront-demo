import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import type { CartNotice } from '@/hooks/use-cart-page'
import { X } from 'lucide-react'

/** "Removed X. Undo": stays until undone or dismissed, so the person can recover from any removal. */
export function UndoNotice({ notice }: { notice: CartNotice }) {
  return (
    <div role="status">
      {notice && (
        // inside the always-present live region above, so no role of its own
        <Alert
          role={undefined}
          className="animate-rise mb-6 flex items-center gap-3 rounded-card border-0 bg-muted py-2 ps-4 pe-2 text-sm"
        >
          <AlertDescription className="me-auto text-sm text-foreground">
            {notice.message}
          </AlertDescription>
          <Button
            variant="outline"
            size="sm"
            onClick={notice.undo}
          >
            Undo
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Dismiss"
            onClick={notice.dismiss}
          >
            <X />
          </Button>
        </Alert>
      )}
    </div>
  )
}
