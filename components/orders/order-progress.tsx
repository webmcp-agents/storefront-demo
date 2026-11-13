import { OrderStep } from '@/components/orders/order-step'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { FoundOrderModel } from '@/hooks/use-order-detail'
import { XCircle } from 'lucide-react'

export function OrderProgress({
  cancelled,
  steps,
  arrival,
}: Pick<FoundOrderModel, 'cancelled' | 'steps' | 'arrival'>) {
  return (
    <Card
      asChild
      className="mt-8 block p-5"
    >
      <section aria-labelledby="progress">
        <h2
          id="progress"
          className="sr-only"
        >
          Delivery progress
        </h2>
        {cancelled ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <XCircle className="size-5 shrink-0" /> This order was cancelled and
            has not been charged.
          </p>
        ) : (
          <>
            <ol className="grid grid-cols-3">
              {steps.map((s, i) => (
                <OrderStep
                  key={s.status}
                  step={s}
                  first={i === 0}
                />
              ))}
            </ol>
            <Separator className="mt-5" />
            <p className="tnum pt-4 text-center text-sm">
              {arrival.label} <b className="font-semibold">{arrival.date}</b>
            </p>
          </>
        )}
      </section>
    </Card>
  )
}
