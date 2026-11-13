import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

/** "24 products": a live region, so filtering announces the new count. `children` follow the noun. */
export function ResultCount({
  count,
  noun,
  className,
  children,
}: {
  count: number
  noun: string
  className?: string
  children?: ReactNode
}) {
  return (
    <p
      role="status"
      className={cn('tnum text-sm text-muted-foreground', className)}
    >
      <span className="font-medium text-foreground">{count}</span> {noun}
      {children}
    </p>
  )
}
