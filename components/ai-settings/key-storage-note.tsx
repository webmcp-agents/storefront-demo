import { LockKeyhole } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function KeyStorageNote() {
  return (
    <Alert role="note" className="border-0 bg-transparent px-0 py-0">
      <LockKeyhole className="text-muted-foreground" />
      <AlertDescription>
        Each provider keeps its own key, for this browser session only, encrypted, in a cookie that scripts on the page
        can&apos;t read. Closing the browser deletes them.
      </AlertDescription>
    </Alert>
  )
}
