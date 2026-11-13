import { Progress } from '@/components/ui/progress'
import type { CartPageModel } from '@/hooks/use-cart-page'
import { Truck } from 'lucide-react'

export function FreeShippingProgress({
  remaining,
  progress,
}: CartPageModel['freeShipping']) {
  return (
    <div className="rounded-xl bg-muted p-3 text-caption">
      <p className="flex items-center gap-2">
        <Truck className="size-4 shrink-0 text-muted-foreground" />
        {remaining ? (
          <span>
            Add <b className="tnum font-semibold">{remaining}</b> for free
            shipping
          </span>
        ) : (
          <span>Your order ships free</span>
        )}
      </p>
      <Progress
        value={progress}
        aria-label="Progress to free shipping"
        className="mt-2 h-1 bg-border-strong"
      />
    </div>
  )
}
