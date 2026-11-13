import { Toggle } from '@/components/ui/toggle'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const SIZES = {
  sm: { toggle: 'size-8 ring-offset-surface', check: 'size-3.5' },
  lg: { toggle: 'size-10 ring-offset-background', check: 'size-4' },
} as const

/** A color swatch that toggles, with its name in a tooltip. */
export function ColorSwatchToggle({
  name,
  hex,
  darkMark,
  pressed,
  onToggle,
  label = name,
  size = 'sm',
}: {
  name: string
  hex: string
  /** Whether the check mark needs to be dark to show on this color. */
  darkMark: boolean
  pressed: boolean
  onToggle: () => void
  label?: string
  size?: keyof typeof SIZES
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* The swatch's color is inline, so it wins over the toggle's own on/off background. */}
        <Toggle
          variant="outline"
          size={size === 'lg' ? 'lg' : undefined}
          pressed={pressed}
          aria-label={label}
          onClick={onToggle}
          className={cn(
            'min-w-0 border-border-strong p-0 ring-offset-2 data-[state=on]:border-border-strong data-[state=on]:ring-2 data-[state=on]:ring-foreground',
            SIZES[size].toggle,
          )}
          style={{ background: hex }}
        >
          {pressed && (
            <Check
              className={cn(
                SIZES[size].check,
                darkMark ? 'text-[#111]' : 'text-white',
              )}
            />
          )}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  )
}
