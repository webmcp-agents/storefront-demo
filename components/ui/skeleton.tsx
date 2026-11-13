import * as React from "react"
import { cn } from "@/lib/utils"

/* shadcn/ui Skeleton on the store's .skeleton shimmer (globals.css), which already respects reduced motion. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" aria-hidden className={cn("skeleton", className)} {...props} />
}

export { Skeleton }
