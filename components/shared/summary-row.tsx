import { cn } from '@/lib/utils'

/** One label/value row of an order summary; place inside a <dl>. `total` sets it as the bold grand total. */
export function SummaryRow({
  label,
  value,
  total = false,
}: {
  label: string
  value: string
  total?: boolean
}) {
  return (
    <div
      className={cn('flex justify-between', total && 'text-base font-semibold')}
    >
      <dt className={cn(!total && 'text-muted-foreground')}>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
