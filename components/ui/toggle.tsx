"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Toggle as TogglePrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

/*
 * shadcn/ui Toggle. Radix renders aria-pressed, which carries the state for screen readers and the agent cursor.
 * `outline` is the store's filter chip: a pill that fills with the primary color when on.
 */
const toggleVariants = cva(
  "press inline-flex items-center justify-center gap-1.5 rounded-full whitespace-nowrap tnum disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-transparent hover:bg-accent data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
        outline:
          "border border-input bg-card text-foreground hover:border-foreground/40 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
      },
      size: {
        default: "h-9 min-w-9 px-3 text-caption",
        sm: "h-8 min-w-8 px-2.5 text-caption",
        lg: "h-10 min-w-10 px-3.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return <TogglePrimitive.Root data-slot="toggle" className={cn(toggleVariants({ variant, size, className }))} {...props} />
}

export { Toggle, toggleVariants }
