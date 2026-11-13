import * as React from "react"
import { cn } from "@/lib/utils"

/*
 * The store's field look, shared by Input, NativeSelect and InputGroup. 16px below `sm` so iOS Safari never zooms on
 * focus; the focus ring is the global :focus-visible outline, with the border darkening as a second cue.
 */
const fieldClasses =
  "h-10 w-full min-w-0 rounded-xl border border-input bg-card px-3 text-base text-foreground transition-colors duration-150 placeholder:text-muted-foreground hover:border-foreground/30 focus-visible:border-foreground focus-visible:outline-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive sm:text-sm"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return <input type={type} data-slot="input" className={cn(fieldClasses, className)} {...props} />
}

export { Input, fieldClasses }
