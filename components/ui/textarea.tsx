import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-xl border border-input bg-card px-3 py-2 text-base transition-colors duration-150 placeholder:text-muted-foreground hover:border-foreground/30 focus-visible:border-foreground focus-visible:outline-offset-1 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive sm:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
