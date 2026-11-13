import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export type ToggleOption = {
  key: string
  label: ReactNode
  pressed: boolean
  toggle: () => void
}

/** A wrapping row of outline toggles; `children` render after them in the same row. */
export function ToggleList({
  options,
  className,
  toggleClassName,
  children,
}: {
  options: ToggleOption[]
  className?: string
  toggleClassName?: string
  children?: ReactNode
}) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((o) => (
        <Toggle
          variant="outline"
          key={o.key}
          pressed={o.pressed}
          className={toggleClassName}
          onClick={o.toggle}
        >
          {o.label}
        </Toggle>
      ))}
      {children}
    </div>
  )
}
