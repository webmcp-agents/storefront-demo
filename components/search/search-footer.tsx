import { Kbd } from '@/components/ui/kbd'
import { Separator } from '@/components/ui/separator'

/** The match count (a live region) and the esc hint. */
export function SearchFooter({ status }: { status: string }) {
  return (
    <>
      <Separator />
      <div className="flex items-center justify-between px-4 py-2.5 text-caption text-muted-foreground">
        <span
          role="status"
          className="tnum"
        >
          {status}
        </span>
        <Kbd aria-hidden>esc</Kbd>
      </div>
    </>
  )
}
