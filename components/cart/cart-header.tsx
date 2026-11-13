import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export function CartHeader({
  count,
  onClear,
}: {
  count: number
  onClear: () => void
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <h1 className="text-3xl font-semibold tracking-tight">
        Cart{' '}
        <span className="tnum text-xl font-normal text-muted-foreground">
          ({count})
        </span>
      </h1>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
      >
        <Trash2 /> Clear cart
      </Button>
    </div>
  )
}
