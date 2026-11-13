import { STEP_ICON, STEP_STATE_LABEL } from '@/components/orders/constants'
import type { OrderStepModel } from '@/hooks/use-order-detail'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

/** One step of the delivery tracker: marker, label and a connector back to the previous step. */
export function OrderStep({
  step,
  first,
}: {
  step: OrderStepModel
  first: boolean
}) {
  const Icon = step.state === 'done' ? Check : (STEP_ICON[step.status] ?? Check)
  const reached = step.state !== 'upcoming'
  return (
    <li
      aria-current={step.state === 'current' ? 'step' : undefined}
      className="relative flex flex-col items-center gap-2 text-center"
    >
      {/* Connector to the previous step, drawn behind the marker. */}
      {!first && (
        <span
          aria-hidden
          className={cn(
            'absolute inset-e-1/2 top-5 h-0.5 w-full -translate-y-1/2',
            reached ? 'bg-foreground' : 'bg-border-strong',
          )}
        />
      )}
      <span
        className={cn(
          'relative grid size-10 place-items-center rounded-full border',
          reached
            ? 'border-foreground bg-foreground text-background'
            : 'border-border-strong bg-surface text-muted-foreground',
        )}
      >
        <Icon className="size-4" />
      </span>
      <span
        className={cn(
          'text-caption',
          reached ? 'font-medium' : 'text-muted-foreground',
        )}
      >
        {step.label}
        <span className="sr-only">, {STEP_STATE_LABEL[step.state]}</span>
      </span>
    </li>
  )
}
